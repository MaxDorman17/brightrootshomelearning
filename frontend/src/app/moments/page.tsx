"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import MomentImage, { loadMomentPhoto } from "@/components/MomentImage";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  addMoment,
  addMomentPhotos,
  commentOnMoment,
  deleteMoment,
  deleteMomentComment,
  deleteMomentPhoto,
  getChildren,
  getMoments,
  getTimetable,
  reactToMoment,
  updateMoment,
} from "@/lib/api";
import { subjectsInTimetable } from "@/lib/subjects";

type Moment = {
  id: number;
  note: string | null;
  moment_date: string;
  subject: string | null;
  child_ids: number[];
  children: string[];
  author: string;
  author_role: string | null;
  photo_ids: number[];
  reactions: Record<string, { count: number; mine: boolean }>;
  comments: { id: number; text: string; author: string; can_delete: boolean }[];
  can_edit: boolean;
};
type Child = { id: number; username: string };

const REACTIONS = ["⭐", "❤️", "👏"];
const MAX_PHOTOS = 5;
const input = "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function MomentForm({
  moment,
  isParent,
  childList,
  subjects,
  onSaved,
  onClose,
}: {
  moment: Moment | null;
  isParent: boolean;
  childList: Child[];
  subjects: string[];
  onSaved: () => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(moment?.note ?? "");
  const [date, setDate] = useState(moment?.moment_date ?? format(new Date(), "yyyy-MM-dd"));
  const [subject, setSubject] = useState(moment?.subject ?? "");
  const [childIds, setChildIds] = useState<number[]>(moment?.child_ids ?? (childList.length === 1 ? [childList[0].id] : []));
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const existing = moment?.photo_ids.length ?? 0;

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? []);
    e.target.value = "";
    const room = MAX_PHOTOS - existing - files.length;
    if (chosen.length > room) setError(`You can add ${room} more photo${room === 1 ? "" : "s"} (up to ${MAX_PHOTOS}).`);
    const tooBig = chosen.find((f) => f.size > 10 * 1024 * 1024);
    if (tooBig) return setError(`${tooBig.name} is over 10 MB.`);
    setFiles((prev) => [...prev, ...chosen].slice(0, MAX_PHOTOS - existing));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim() && files.length === 0 && existing === 0) return setError("Add a photo or write a note.");
    setSaving(true);
    setError("");
    const fields = { note: note.trim(), moment_date: date, subject: subject.trim(), child_ids: childIds };
    try {
      if (moment) {
        await updateMoment(moment.id, fields);
        if (files.length) await addMomentPhotos(moment.id, files);
      } else {
        await addMoment(fields, files);
      }
      onSaved();
    } catch (err) {
      setError(errorText(err, "Could not save. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-brand-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-brand-charcoal">{moment ? "Edit moment" : "Add a learning moment"}</h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">
              Photos <span className="font-normal text-[#8A7A69]">(up to {MAX_PHOTOS})</span>
            </label>
            {(previews.length > 0 || existing > 0) && (
              <div className="mb-2 grid grid-cols-5 gap-2">
                {moment?.photo_ids.map((id) => (
                  <MomentImage key={id} photoId={id} alt="Photo" className="aspect-square w-full rounded-lg" />
                ))}
                {previews.map((src, i) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="New photo" className="aspect-square w-full rounded-lg object-cover" />
                    <button type="button" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white" aria-label="Remove photo">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {existing + files.length < MAX_PHOTOS && (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-brand-mist bg-white px-4 py-3 text-sm font-bold text-brand-sage hover:bg-brand-wash">
                📷 Choose photos
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={pick} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">What happened?</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={5000} placeholder="e.g. Built a volcano and it actually erupted!" className={input + " w-full"} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold text-brand-charcoal">
              Date
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={input + " mt-1.5 w-full"} />
            </label>
            <label className="block text-sm font-semibold text-brand-charcoal">
              Subject
              <input list="moment-subjects" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100} placeholder="Optional" className={input + " mt-1.5 w-full"} />
              <datalist id="moment-subjects">
                {subjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </label>
          </div>

          {isParent && childList.length > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-semibold text-brand-charcoal">Who is it about?</p>
              <div className="flex flex-wrap gap-2">
                {childList.map((c) => (
                  <label key={c.id} className="flex items-center gap-1.5 rounded-xl border border-brand-line bg-white px-3 py-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={childIds.includes(c.id)}
                      onChange={() => setChildIds((prev) => (prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]))}
                      className="accent-brand-sage"
                    />
                    {c.username}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">{error}</div>}
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : moment ? "Save" : "Share moment"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Lightbox({ photoId, moment, onClose }: { photoId: number; moment?: Moment; onClose: () => void }) {
  const download = async () => {
    const url = await loadMomentPhoto(photoId);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `bright-roots-${moment?.moment_date ?? "photo"}-${photoId}`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <div className="flex max-h-full w-full max-w-4xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <MomentImage photoId={photoId} alt={moment?.note ?? "Photo"} className="max-h-[75vh] w-auto max-w-full rounded-xl !object-contain" />
        {moment && (
          <div className="mt-3 w-full text-center text-white">
            <p className="text-sm opacity-80">
              {format(parseISO(moment.moment_date), "d MMMM yyyy")}
              {moment.subject ? ` · ${moment.subject}` : ""}
              {moment.children.length ? ` · ${moment.children.join(", ")}` : ""}
            </p>
            {moment.note && <p className="mt-1">{moment.note}</p>}
          </div>
        )}
        <div className="mt-4 flex gap-3">
          <button onClick={download} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-charcoal">Download</button>
          <button onClick={onClose} className="rounded-xl border border-white/40 px-4 py-2 text-sm font-bold text-white">Close</button>
        </div>
      </div>
    </div>
  );
}

function MomentCard({ moment, onChanged, onEdit, onView }: { moment: Moment; onChanged: () => void; onEdit: () => void; onView: (photoId: number) => void }) {
  const [comment, setComment] = useState("");

  const react = async (emoji: string) => {
    await reactToMoment(moment.id, emoji);
    onChanged();
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await commentOnMoment(moment.id, comment.trim());
    setComment("");
    onChanged();
  };

  const remove = async () => {
    if (!confirm("Delete this moment and its photos?")) return;
    await deleteMoment(moment.id);
    onChanged();
  };

  const removePhoto = async (photoId: number) => {
    if (!confirm("Remove this photo?")) return;
    await deleteMomentPhoto(moment.id, photoId);
    onChanged();
  };

  const photos = moment.photo_ids;

  return (
    <article className="brand-card overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div>
          <p className="font-extrabold text-brand-charcoal">
            {moment.author}
            {moment.children.length > 0 && <span className="font-semibold text-[#6E5A46]"> · about {moment.children.join(", ")}</span>}
          </p>
          <p className="text-xs text-[#6E5A46]">
            {format(parseISO(moment.moment_date), "EEEE d MMMM")}
            {moment.subject && <span className="ml-1 rounded-full bg-brand-tint px-2 py-0.5 font-bold text-brand-sage">{moment.subject}</span>}
          </p>
        </div>
        {moment.can_edit && (
          <div className="flex gap-3">
            <button onClick={onEdit} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
            <button onClick={remove} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className={"grid gap-1 " + (photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {photos.map((id, i) => (
            <div key={id} className={"group relative " + (photos.length === 3 && i === 0 ? "col-span-3" : photos.length >= 4 && i === 0 ? "col-span-3 sm:col-span-2 sm:row-span-2" : "")}>
              <MomentImage photoId={id} alt={moment.note ?? "Learning moment"} onClick={() => onView(id)} className={"w-full " + (photos.length === 1 ? "max-h-[28rem]" : "aspect-square h-full")} />
              {moment.can_edit && (
                <button onClick={() => removePhoto(id)} className="absolute right-2 top-2 hidden rounded-full bg-black/60 px-2 py-0.5 text-xs text-white group-hover:block" aria-label="Remove photo">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
        {moment.note && <p className="whitespace-pre-line text-brand-charcoal">{moment.note}</p>}

        <div className="mt-3 flex gap-2">
          {REACTIONS.map((emoji) => {
            const r = moment.reactions[emoji];
            return (
              <button
                key={emoji}
                onClick={() => react(emoji)}
                className={"rounded-full border px-3 py-1 text-sm " + (r?.mine ? "border-brand-sage bg-brand-tint" : "border-brand-line bg-white")}
              >
                {emoji} {r?.count ? <span className="text-xs font-bold text-brand-charcoal">{r.count}</span> : null}
              </button>
            );
          })}
        </div>

        {moment.comments.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {moment.comments.map((c) => (
              <p key={c.id} className="text-sm text-brand-charcoal">
                <span className="font-bold">{c.author}</span> {c.text}
                {c.can_delete && (
                  <button
                    onClick={async () => {
                      await deleteMomentComment(c.id);
                      onChanged();
                    }}
                    className="ml-2 text-xs text-[#8A7A69] hover:text-[#A64F42]"
                    aria-label="Delete comment"
                  >
                    ✕
                  </button>
                )}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={send} className="mt-3 flex gap-2">
          <input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} placeholder="Add a comment" className={input + " min-w-0 flex-1"} />
          <button type="submit" disabled={!comment.trim()} className="rounded-xl bg-brand-sage px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Send</button>
        </form>
      </div>
    </article>
  );
}

export default function MomentsPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [tab, setTab] = useState<"feed" | "photos">("feed");
  const [moments, setMoments] = useState<Moment[]>([]);
  const [childList, setChildList] = useState<Child[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ moment: Moment | null } | null>(null);
  const [viewing, setViewing] = useState<number | null>(null);
  const [filterChild, setFilterChild] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const isParent = role === "parent";

  const load = useCallback(async () => {
    const res = await getMoments();
    setMoments(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const r = getRole() || "";
    setRole(r);
    load().catch(() => setLoading(false));
    if (r === "parent") getChildren().then((res) => setChildList(res.data)).catch(() => {});
    getTimetable().then((res) => setSubjects(subjectsInTimetable(res.data.config || {}))).catch(() => {});
  }, [load, router]);

  const photoRows = useMemo(
    () => moments.flatMap((m) => m.photo_ids.map((id) => ({ id, moment: m }))),
    [moments]
  );
  const months = useMemo(() => Array.from(new Set(moments.map((m) => m.moment_date.slice(0, 7)))), [moments]);
  const photoSubjects = useMemo(() => Array.from(new Set(moments.map((m) => m.subject).filter(Boolean))) as string[], [moments]);
  const photoChildren = useMemo(() => Array.from(new Set(moments.flatMap((m) => m.children))), [moments]);
  const shownPhotos = photoRows.filter(
    ({ moment }) =>
      (!filterChild || moment.children.includes(filterChild)) &&
      (!filterSubject || moment.subject === filterSubject) &&
      (!filterMonth || moment.moment_date.startsWith(filterMonth))
  );
  const viewingMoment = viewing != null ? photoRows.find((p) => p.id === viewing)?.moment : undefined;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Our family</p>
        <h1 className="mt-1 text-3xl font-bold text-brand-charcoal sm:text-4xl">Learning moments</h1>
        <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">Photos and notes from your learning, just for your family.</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-2xl bg-brand-white p-1">
            {(["feed", "photos"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={"rounded-xl px-4 py-2 text-sm font-bold " + (tab === t ? "bg-brand-sage text-white" : "text-[#6E5A46]")}>
                {t === "feed" ? "Moments" : `Photos (${photoRows.length})`}
              </button>
            ))}
          </div>
          <button onClick={() => setForm({ moment: null })} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark">
            + Add a moment
          </button>
        </div>

        {loading && <p className="mt-6 text-sm text-[#6E5A46]">Loading...</p>}

        {!loading && tab === "feed" && (
          <div className="mt-5 space-y-5">
            {moments.length === 0 ? (
              <div className="brand-card p-8 text-center">
                <p className="text-4xl">📸</p>
                <p className="mt-2 font-bold text-brand-charcoal">No moments yet</p>
                <p className="mt-1 text-sm text-[#6E5A46]">Share a photo or a note about something you learned today.</p>
              </div>
            ) : (
              moments.map((m) => (
                <MomentCard key={m.id} moment={m} onChanged={load} onEdit={() => setForm({ moment: m })} onView={setViewing} />
              ))
            )}
          </div>
        )}

        {!loading && tab === "photos" && (
          <div className="mt-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {photoChildren.length > 1 && (
                <select value={filterChild} onChange={(e) => setFilterChild(e.target.value)} className={input}>
                  <option value="">Everyone</option>
                  {photoChildren.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className={input}>
                <option value="">All subjects</option>
                {photoSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className={input}>
                <option value="">All months</option>
                {months.map((m) => (
                  <option key={m} value={m}>{format(parseISO(`${m}-01`), "MMMM yyyy")}</option>
                ))}
              </select>
            </div>
            {shownPhotos.length === 0 ? (
              <div className="brand-card p-8 text-center text-sm text-[#6E5A46]">
                {photoRows.length === 0 ? "No photos yet. Add a moment with a photo to start your gallery." : "No photos match."}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {shownPhotos.map(({ id, moment }) => (
                  <MomentImage key={id} photoId={id} alt={moment.note ?? "Photo"} onClick={() => setViewing(id)} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {form && (
        <MomentForm
          moment={form.moment}
          isParent={isParent}
          childList={childList}
          subjects={subjects}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            load();
          }}
        />
      )}
      {viewing != null && <Lightbox photoId={viewing} moment={viewingMoment} onClose={() => setViewing(null)} />}
    </div>
  );
}
