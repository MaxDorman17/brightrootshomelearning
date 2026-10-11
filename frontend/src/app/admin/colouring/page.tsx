"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import {
  apiFileUrl,
  changeColouringSheet,
  createColouringTheme,
  deleteColouringSheet,
  deleteColouringTheme,
  getColouringAdminSheets,
  getUploadedColouring,
  uploadColouringCover,
  uploadColouringSheet,
  type UploadedColouringSheet,
  type UploadedColouringTheme,
} from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { THEMES } from "@/lib/colouring";

const MAX_MB = 25;
const NEW_THEME = "__new__";
const PAGE = 60;

const detail = (err: any, fallback: string) => (typeof err?.response?.data?.detail === "string" ? err.response.data.detail : fallback);

/** "forest-picnic_2.pdf" -> "Forest Picnic 2", the same as the server does when no title is given. */
function tidyTitle(fileName: string): string {
  const stem = fileName.replace(/\.[A-Za-z0-9]{1,5}$/, "");
  const words = stem.replace(/[-_.]+/g, " ").split(/\s+/).filter(Boolean);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") || "Colouring Sheet";
}

type Status = "ready" | "uploading" | "done" | "failed" | "rejected";
type QueuedFile = { id: number; file: File; title: string; status: Status; progress: number; message: string };

let nextId = 1;

/** Owner only: upload this week's colouring sheets, make new themes, and rename or remove uploaded sheets. */
export default function ColouringUploadsPage() {
  const router = useRouter();
  const [denied, setDenied] = useState(false);
  const [sheets, setSheets] = useState<UploadedColouringSheet[] | null>(null);
  const [madeThemes, setMadeThemes] = useState<UploadedColouringTheme[]>([]);

  const [theme, setTheme] = useState("");
  const [newName, setNewName] = useState("");
  const [newCover, setNewCover] = useState<File | null>(null);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const [coverBusy, setCoverBusy] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");

  const [filter, setFilter] = useState("");
  const [showing, setShowing] = useState(PAGE);
  const [editing, setEditing] = useState<{ id: number; title: string; theme: string } | null>(null);
  const [listMessage, setListMessage] = useState("");
  const [listError, setListError] = useState("");

  const loadSheets = useCallback(
    () =>
      getColouringAdminSheets()
        .then((res) => setSheets(res.data))
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) setDenied(true);
          else setListError("Could not load the uploaded sheets. Please refresh the page.");
        }),
    []
  );
  const loadThemes = useCallback(
    () =>
      getUploadedColouring()
        .then((res) => setMadeThemes(res.data.themes.filter((t) => !THEMES.some((b) => b.slug === t.slug))))
        .catch(() => undefined),
    []
  );

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    loadSheets();
    loadThemes();
  }, [loadSheets, loadThemes, router]);

  const themeOptions = useMemo(
    () => [...THEMES.map((t) => ({ slug: t.slug, name: t.name })), ...madeThemes.map((t) => ({ slug: t.slug, name: t.name }))],
    [madeThemes]
  );
  const themeName = (slug: string) => themeOptions.find((t) => t.slug === slug)?.name ?? slug;
  const chosenMadeTheme = madeThemes.find((t) => t.slug === theme);
  const sheetsInChosen = (sheets ?? []).filter((s) => s.theme === theme).length;

  const update = (id: number, change: Partial<QueuedFile>) => setQueue((q) => q.map((f) => (f.id === id ? { ...f, ...change } : f)));

  const addFiles = (files: FileList | File[]) => {
    setDone("");
    setError("");
    const added: QueuedFile[] = Array.from(files).map((file) => {
      const looksLikePdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const tooBig = file.size > MAX_MB * 1024 * 1024;
      const message = !looksLikePdf ? "This isn't a PDF, so it won't be uploaded." : tooBig ? `This is bigger than ${MAX_MB} MB, so it won't be uploaded.` : "";
      return { id: nextId++, file, title: tidyTitle(file.name), status: message ? "rejected" : "ready", progress: 0, message };
    });
    setQueue((q) => [...q, ...added]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!busy && e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const toUpload = queue.filter((f) => f.status === "ready" || f.status === "failed");

  const upload = async () => {
    setError("");
    setDone("");
    if (!theme) {
      setError("Please choose a theme first.");
      return;
    }
    if (theme === NEW_THEME && !newName.trim()) {
      setError("Please give the new theme a name.");
      return;
    }
    if (!toUpload.length) {
      setError("Please add some PDFs first.");
      return;
    }
    if (toUpload.some((f) => !f.title.trim())) {
      setError("Every sheet needs a name. Please fill in the empty ones.");
      return;
    }
    setBusy(true);
    let slug = theme;
    try {
      if (theme === NEW_THEME) {
        try {
          const made = await createColouringTheme(newName.trim());
          slug = made.data.slug;
          if (newCover) {
            try {
              await uploadColouringCover(slug, newCover);
            } catch (err) {
              setError(`The theme was made, but its cover picture didn't upload: ${detail(err, "please try again below.")}`);
            }
          }
          await loadThemes();
          setTheme(slug);
          setNewName("");
          setNewCover(null);
        } catch (err) {
          setError(detail(err, "Could not make the new theme."));
          return;
        }
      }

      let ok = 0;
      let failed = 0;
      // One at a time, so each file shows its own progress and one bad file doesn't stop the rest.
      for (const item of toUpload) {
        update(item.id, { status: "uploading", progress: 0, message: "" });
        try {
          await uploadColouringSheet(slug, item.file, item.title.trim(), (p) => update(item.id, { progress: p }));
          update(item.id, { status: "done", progress: 1, message: "" });
          ok++;
        } catch (err) {
          const tooBig = (err as any)?.response?.status === 413;
          update(item.id, {
            status: "failed",
            message: tooBig ? `This file is too big. Each PDF must be ${MAX_MB} MB or smaller.` : detail(err, "This one didn't upload. Please check your internet connection and try again."),
          });
          failed++;
        }
      }
      if (ok) setDone(`${ok} sheet${ok === 1 ? "" : "s"} added to ${themeName(slug)}.${failed ? "" : " They're on the colouring page now."}`);
      if (failed) setError(`${failed} sheet${failed === 1 ? "" : "s"} didn't upload. See the message next to ${failed === 1 ? "it" : "each one"}, then press Upload again to retry.`);
      await loadSheets();
    } finally {
      setBusy(false);
    }
  };

  const changeCover = async (file: File | undefined) => {
    if (!file || !chosenMadeTheme) return;
    setCoverBusy(true);
    setCoverMessage("");
    try {
      await uploadColouringCover(chosenMadeTheme.slug, file);
      await loadThemes();
      setCoverMessage("Cover picture saved.");
    } catch (err) {
      setCoverMessage(detail(err, "Could not save the cover picture."));
    } finally {
      setCoverBusy(false);
    }
  };

  const removeTheme = async () => {
    if (!chosenMadeTheme || !confirm(`Remove the theme "${chosenMadeTheme.name}"? It has no sheets in it.`)) return;
    try {
      await deleteColouringTheme(chosenMadeTheme.slug);
      setTheme("");
      await loadThemes();
    } catch (err) {
      setCoverMessage(detail(err, "Could not remove the theme."));
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setListMessage("");
    setListError("");
    if (!editing.title.trim()) {
      setListError("Please give the sheet a name.");
      return;
    }
    try {
      await changeColouringSheet(editing.id, { title: editing.title.trim(), theme: editing.theme });
      setEditing(null);
      setListMessage("Saved.");
      await loadSheets();
    } catch (err) {
      setListError(detail(err, "Could not save the changes."));
    }
  };

  const remove = async (s: UploadedColouringSheet) => {
    if (!confirm(`Delete "${s.title}" from ${themeName(s.theme)}? Families won't be able to print it any more. This can't be undone.`)) return;
    setListMessage("");
    setListError("");
    try {
      await deleteColouringSheet(s.id);
      setListMessage(`"${s.title}" was deleted.`);
      await loadSheets();
    } catch (err) {
      setListError(detail(err, "Could not delete the sheet."));
    }
  };

  if (denied) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-[#6E5A46]">This page is only for the owner of Bright Roots.</div>
      </div>
    );
  }

  const listed = (sheets ?? []).filter((s) => !filter || s.theme === filter);
  const finished = queue.some((f) => f.status === "done" || f.status === "rejected");
  const input = "rounded-xl border border-brand-line bg-white px-3 py-2 text-sm text-brand-charcoal";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="colouring" tint={4}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Owner</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Colouring uploads</h1>
          <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">
            Add new colouring sheets to the site. Choose a theme, drop in the PDFs, check the names, then press Upload. They appear on the{" "}
            <Link href="/make/colouring" className="font-bold text-brand-sage hover:underline">
              colouring page
            </Link>{" "}
            straight away, with a &ldquo;New&rdquo; badge for a month.
          </p>
        </PageHero>

        <section className="brand-card p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-brand-charcoal">1. Choose a theme</h2>
          <select
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              setCoverMessage("");
              setError("");
            }}
            disabled={busy}
            className={`${input} mt-3 w-full sm:w-80`}
            aria-label="Theme"
          >
            <option value="">Choose a theme...</option>
            <optgroup label="Themes">
              {themeOptions.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </optgroup>
            <option value={NEW_THEME}>+ Make a new theme</option>
          </select>

          {theme === NEW_THEME && (
            <div className="mt-4 grid gap-3 rounded-2xl border border-brand-line bg-brand-cream/50 p-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-brand-charcoal">
                Name of the new theme
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Pirate Island" className={`${input} mt-1 block w-full font-normal`} maxLength={100} />
              </label>
              <label className="text-sm font-bold text-brand-charcoal">
                Cover picture (optional, square works best)
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setNewCover(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm font-normal" />
                <span className="mt-1 block text-xs font-normal text-[#6E5A46]">Without one, the theme shows the top of its first sheet.</span>
              </label>
            </div>
          )}

          {chosenMadeTheme && (
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-brand-line bg-brand-cream/50 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-line bg-white">
                {chosenMadeTheme.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={apiFileUrl(chosenMadeTheme.cover_url)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🖍️</div>
                )}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-bold text-brand-charcoal">{chosenMadeTheme.cover_url ? "Cover picture" : "No cover picture yet"}</p>
                <label className="mt-1 inline-block cursor-pointer rounded-full border border-brand-line bg-white px-4 py-1.5 text-xs font-bold text-brand-sage hover:border-brand-softsage">
                  {coverBusy ? "Saving..." : chosenMadeTheme.cover_url ? "Change cover" : "Add a cover"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={coverBusy} onChange={(e) => changeCover(e.target.files?.[0])} />
                </label>
                {sheetsInChosen === 0 && (
                  <button onClick={removeTheme} className="ml-2 rounded-full border border-brand-line px-4 py-1.5 text-xs font-bold text-[#A64F42] hover:bg-white">
                    Remove this theme
                  </button>
                )}
                {coverMessage && <p className="mt-1 text-xs font-semibold text-brand-earth">{coverMessage}</p>}
              </div>
            </div>
          )}
        </section>

        <section className="brand-card mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-brand-charcoal">2. Add the PDFs</h2>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={
              "mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors " +
              (dragging ? "border-brand-sage bg-brand-wash" : "border-brand-line bg-brand-cream/40")
            }
          >
            <p className="text-3xl" aria-hidden>
              📄
            </p>
            <p className="mt-2 font-bold text-brand-charcoal">Drag your PDFs here</p>
            <p className="text-sm text-[#6E5A46]">or</p>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="mt-2 rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50"
            >
              Choose PDFs
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="mt-3 text-xs text-[#6E5A46]">You can pick lots at once. Each PDF can be up to {MAX_MB} MB. The first page is used for the picture.</p>
          </div>

          {queue.length > 0 && (
            <>
              <h3 className="mt-5 text-sm font-extrabold text-brand-charcoal">3. Check the names</h3>
              <p className="text-xs text-[#6E5A46]">These are what families see under each picture. Change any you like before uploading.</p>
              <ul className="mt-2 divide-y divide-brand-line">
                {queue.map((f) => (
                  <li key={f.id} className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={f.title}
                        onChange={(e) => update(f.id, { title: e.target.value })}
                        disabled={busy || f.status === "done" || f.status === "rejected" || f.status === "uploading"}
                        maxLength={120}
                        aria-label={`Name for ${f.file.name}`}
                        className={`${input} min-w-0 flex-1 disabled:bg-brand-cream/60`}
                      />
                      <StatusPill item={f} />
                      {!busy && f.status !== "done" && (
                        <button
                          onClick={() => setQueue((q) => q.filter((x) => x.id !== f.id))}
                          className="rounded-full px-3 py-1 text-xs font-bold text-[#6E5A46] hover:bg-brand-cream"
                          aria-label={`Take ${f.file.name} off the list`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-[#6E5A46]">
                      {f.file.name} · {(f.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    {f.status === "uploading" && (
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-cream">
                        <div className="h-full rounded-full bg-brand-sage transition-all" style={{ width: `${Math.round(f.progress * 100)}%` }} />
                      </div>
                    )}
                    {f.message && <p className="mt-1 text-xs font-semibold text-[#A64F42]">{f.message}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={upload}
              disabled={busy || toUpload.length === 0}
              className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-extrabold text-white hover:bg-brand-sagedark disabled:opacity-50"
            >
              {busy ? "Uploading..." : toUpload.length ? `Upload ${toUpload.length} sheet${toUpload.length === 1 ? "" : "s"}` : "Upload"}
            </button>
            {finished && !busy && (
              <button
                onClick={() => setQueue((q) => q.filter((f) => f.status !== "done" && f.status !== "rejected"))}
                className="rounded-xl border border-brand-line px-4 py-2.5 text-sm font-bold text-brand-earth hover:bg-white"
              >
                Clear the finished ones
              </button>
            )}
            {theme && theme !== NEW_THEME && <span className="text-sm text-[#6E5A46]">Going into: <b>{themeName(theme)}</b></span>}
          </div>
          {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
          {done && <p className="mt-3 text-sm font-semibold text-brand-sage">{done}</p>}
        </section>

        <section className="brand-card mt-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-brand-charcoal">Uploaded sheets</h2>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setShowing(PAGE);
              }}
              className={input}
              aria-label="Show sheets from"
            >
              <option value="">All themes</option>
              {themeOptions.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-[#6E5A46]">Newest first. The original sheets that came with the site aren&rsquo;t listed here.</p>
          {listError && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{listError}</p>}
          {listMessage && <p className="mt-3 text-sm font-semibold text-brand-sage">{listMessage}</p>}
          {sheets === null ? (
            <p className="mt-3 text-sm text-[#6E5A46]">Loading...</p>
          ) : listed.length === 0 ? (
            <p className="mt-3 text-sm text-[#6E5A46]">{filter ? "No uploaded sheets in this theme yet." : "Nothing uploaded yet."}</p>
          ) : (
            <ul className="mt-3 divide-y divide-brand-line">
              {listed.slice(0, showing).map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap">
                  <a href={apiFileUrl(s.pdf_url)} target="_blank" rel="noopener" className="h-[68px] w-12 shrink-0 overflow-hidden rounded-md border border-brand-line bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={apiFileUrl(s.preview_url)} alt="" loading="lazy" className="h-full w-full object-contain" />
                  </a>
                  {editing?.id === s.id ? (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <input
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        maxLength={120}
                        aria-label="Sheet name"
                        className={`${input} min-w-0 flex-1`}
                        autoFocus
                      />
                      <select value={editing.theme} onChange={(e) => setEditing({ ...editing, theme: e.target.value })} className={input} aria-label="Theme">
                        {themeOptions.map((t) => (
                          <option key={t.slug} value={t.slug}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <button onClick={saveEdit} className="rounded-full bg-brand-sage px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-sagedark">
                        Save
                      </button>
                      <button onClick={() => setEditing(null)} className="rounded-full border border-brand-line px-4 py-1.5 text-xs font-bold text-brand-earth hover:bg-white">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-[10rem] flex-1 text-sm">
                        <p className="font-bold text-brand-charcoal">{s.title}</p>
                        <p className="text-[#6E5A46]">
                          {s.theme_name || themeName(s.theme)} · added {format(parseISO(s.created_at), "d MMM yyyy")}
                        </p>
                      </div>
                      <div className="flex w-full shrink-0 gap-2 pl-[60px] sm:w-auto sm:pl-0">
                        <button
                          onClick={() => {
                            setListMessage("");
                            setListError("");
                            setEditing({ id: s.id, title: s.title, theme: s.theme });
                          }}
                          className="rounded-full border border-brand-line px-4 py-1.5 text-xs font-bold text-brand-sage hover:bg-white"
                        >
                          Rename or move
                        </button>
                        <button onClick={() => remove(s)} className="rounded-full border border-brand-line px-4 py-1.5 text-xs font-bold text-[#A64F42] hover:bg-white">
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          {listed.length > showing && (
            <button onClick={() => setShowing((n) => n + PAGE)} className="mt-3 rounded-xl border border-brand-line px-4 py-2 text-sm font-bold text-brand-earth hover:bg-white">
              Show more ({listed.length - showing} more)
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusPill({ item }: { item: QueuedFile }) {
  const [text, style] =
    item.status === "uploading"
      ? [item.progress >= 0.999 ? "Making the picture..." : `Uploading ${Math.round(item.progress * 100)}%`, "bg-brand-wash text-brand-sage"]
      : item.status === "done"
        ? ["✓ Uploaded", "bg-brand-wash text-brand-sage"]
        : item.status === "failed"
          ? ["Didn't upload", "bg-[#FBEFEB] text-[#A64F42]"]
          : item.status === "rejected"
            ? ["Can't upload", "bg-[#FBEFEB] text-[#A64F42]"]
            : ["Ready", "bg-brand-cream text-brand-earth"];
  return <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${style}`}>{text}</span>;
}
