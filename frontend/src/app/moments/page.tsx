"use client";

import { ChangeEvent, FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
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
  getFamilySubjects,
  reactToMoment,
  updateMoment,
} from "@/lib/api";
import Emoji from "@/components/Emoji";

type Moment = {
  id: number;
  note: string | null;
  moment_date: string;
  subject: string | null;
  trip_place: string | null;
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
  trip,
  isParent,
  childList,
  subjects,
  onSaved,
  onClose,
}: {
  moment: Moment | null;
  trip: boolean;
  isParent: boolean;
  childList: Child[];
  subjects: string[];
  onSaved: () => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(moment?.note ?? "");
  const [date, setDate] = useState(moment?.moment_date ?? format(new Date(), "yyyy-MM-dd"));
  const [subject, setSubject] = useState(moment?.subject ?? "");
  const [place, setPlace] = useState(moment?.trip_place ?? "");
  const isTrip = trip || !!moment?.trip_place;
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
    if (isTrip && !place.trim()) return setError("Say where you went.");
    if (!note.trim() && files.length === 0 && existing === 0 && !place.trim()) return setError("Add a photo or write a note.");
    setSaving(true);
    setError("");
    const fields = { note: note.trim(), moment_date: date, subject: subject.trim(), child_ids: childIds, trip_place: place.trim() };
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
        <h2 className="text-xl font-bold text-brand-charcoal">
          {moment ? (isTrip ? "Edit trip" : "Edit moment") : isTrip ? "Add a trip or day out" : "Add a learning moment"}
        </h2>

        <div className="mt-5 space-y-4">
          {isTrip && (
            <label className="block text-sm font-semibold text-brand-charcoal">
              Where did you go?
              <input value={place} onChange={(e) => setPlace(e.target.value)} maxLength={200} required placeholder="e.g. Natural History Museum, London" className={input + " mt-1.5 w-full"} />
            </label>
          )}
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
            <label className="mb-1.5 block text-sm font-semibold text-brand-charcoal">{isTrip ? "What did you see and learn?" : "What happened?"}</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={5000} placeholder={isTrip ? "e.g. Saw the dinosaur skeletons and learned how fossils form." : "e.g. Built a volcano and it actually erupted!"} className={input + " w-full"} />
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
            {saving ? "Saving..." : moment ? "Save" : isTrip ? "Save trip" : "Share moment"}
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

/** One moment as a small tile in the grid. Clicking it opens the whole moment. */
function MomentTile({ moment, onOpen }: { moment: Moment; onOpen: () => void }) {
  const photos = moment.photo_ids;
  const label = `Open ${moment.trip_place ? `trip to ${moment.trip_place}` : "moment"} from ${format(parseISO(moment.moment_date), "d MMMM")}`;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="group flex flex-col overflow-hidden rounded-2xl bg-brand-white text-left shadow-sm ring-1 ring-[#E4DCCD] transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F1EADC]">
        {photos.length > 0 ? (
          <MomentImage photoId={photos[0]} alt={moment.note ?? "Learning moment"} className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-105" />
        ) : (
          // No photo: the note itself fills the tile.
          <div className="absolute inset-0 flex items-center p-4">
            <p className="line-clamp-6 text-sm font-semibold leading-relaxed text-[#6E5A46]">{moment.note || (moment.trip_place ? `Trip to ${moment.trip_place}` : "")}</p>
          </div>
        )}
        {photos.length > 1 && (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-white">{photos.length} photos</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-[#6E5A46]">
          {format(parseISO(moment.moment_date), "d MMM")}
          {moment.children.length > 0 && <span className="font-semibold"> · {moment.children.join(", ")}</span>}
        </p>
        {moment.trip_place ? (
          <p className="mt-0.5 truncate text-sm font-bold text-[#7A5B22]">📍 {moment.trip_place}</p>
        ) : (
          photos.length > 0 && moment.note && <p className="mt-0.5 truncate text-sm font-semibold text-brand-charcoal">{moment.note}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          {moment.subject && <span className="rounded-full bg-brand-tint px-2 py-0.5 font-bold text-brand-sage">{moment.subject}</span>}
          {moment.comments.length > 0 && (
            <span className="font-semibold text-[#8A7A69]">
              {moment.comments.length} comment{moment.comments.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function MomentGrid({ moments, onOpen }: { moments: Moment[]; onOpen: (id: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {moments.map((m) => (
        <MomentTile key={m.id} moment={m} onOpen={() => onOpen(m.id)} />
      ))}
    </div>
  );
}

/** The whole moment, enlarged: its photos, note, reactions and comments. */
function MomentPopup({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-3 sm:p-6" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative mx-auto my-4 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="mt-3 text-center">
          <button onClick={onClose} className="rounded-xl bg-brand-white px-5 py-2 text-sm font-bold text-brand-charcoal shadow">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// How a moment's photos are laid out, by how many there are (up to five).
function photoGrid(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 3) return "grid-cols-3 grid-rows-2";
  return "grid-cols-6";
}

function photoTile(count: number, index: number) {
  if (count === 1) return "";
  if (count === 2) return "col-span-3 aspect-square";
  // Three: one large photo with two smaller ones stacked beside it.
  if (count === 3) return index === 0 ? "col-span-2 row-span-2" : "aspect-square";
  if (count === 4) return "col-span-3 aspect-[4/3]";
  // Five: two across the top, three underneath.
  return index < 2 ? "col-span-3 aspect-[4/3]" : "col-span-2 aspect-square";
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
          {moment.trip_place && <p className="mt-1 text-sm font-bold text-[#7A5B22]">📍 Trip to {moment.trip_place}</p>}
        </div>
        {moment.can_edit && (
          <div className="flex gap-3">
            <button onClick={onEdit} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
            <button onClick={remove} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className={"mx-4 grid gap-1.5 overflow-hidden rounded-2xl " + photoGrid(photos.length)}>
          {photos.map((id, i) => (
            <div key={id} className={"group relative overflow-hidden bg-[#F1EADC] " + photoTile(photos.length, i)}>
              {/* One photo is shown whole, never cropped. Several are tidy tiles; tap one to see all of it. */}
              <MomentImage
                photoId={id}
                alt={moment.note ?? "Learning moment"}
                onClick={() => onView(id)}
                className={photos.length === 1 ? "mx-auto block max-h-[26rem] w-auto max-w-full !object-contain" : "absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"}
              />
              {moment.can_edit && (
                <button
                  onClick={() => removePhoto(id)}
                  className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
                  aria-label="Remove photo"
                >
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

export default function MomentsPageWrapper() {
  return (
    <Suspense>
      <MomentsPage />
    </Suspense>
  );
}

function MomentsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState("");
  const [tab, setTab] = useState<"feed" | "photos" | "trips">(() => (params.get("tab") === "trips" ? "trips" : "feed"));
  const [moments, setMoments] = useState<Moment[]>([]);
  const [childList, setChildList] = useState<Child[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ moment: Moment | null; trip?: boolean } | null>(null);
  const [open, setOpen] = useState<number | null>(null);
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
    getFamilySubjects().then((res) => setSubjects(res.data.subjects || [])).catch(() => {});
  }, [load, router]);

  useEffect(() => {
    if (params.get("tab") === "trips") setTab("trips");
    else setTab((current) => (current === "trips" ? "feed" : current));
  }, [params]);

  // Trips live under Active in the menu, so the address and the menu follow the tab.
  useEffect(() => {
    const url = tab === "trips" ? "/moments?tab=trips" : "/moments";
    if (window.location.pathname + window.location.search !== url) window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event("moments-tab-changed"));
  }, [tab]);

  const trips = useMemo(() => moments.filter((m) => m.trip_place), [moments]);
  const tripsThisYear = trips.filter((m) => m.moment_date.startsWith(String(new Date().getFullYear()))).length;

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
  // The gallery is grouped by month, newest first.
  const photoMonths = useMemo(() => {
    const groups = new Map<string, typeof shownPhotos>();
    for (const row of shownPhotos) {
      const month = row.moment.moment_date.slice(0, 7);
      groups.set(month, [...(groups.get(month) ?? []), row]);
    }
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [shownPhotos]);

  // The moment that is open in the pop-up. It is looked up fresh, so a new comment or reaction shows straight away,
  // and the pop-up closes by itself if the moment is deleted.
  const openMoment = open != null ? moments.find((m) => m.id === open) : undefined;

  const viewingMoment = viewing != null ? photoRows.find((p) => p.id === viewing)?.moment : undefined;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <PageHero art={tab === "trips" ? "trips" : "moments"} tint={3}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Our family</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Learning moments</h1>
        <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">Photos and notes from your learning, and your trips and days out, just for your family.</p>
        </PageHero>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-2xl bg-brand-white p-1">
            {(["feed", "trips", "photos"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={"rounded-xl px-3 py-2 text-sm font-bold sm:px-4 " + (tab === t ? "bg-brand-sage text-white" : "text-[#6E5A46]")}>
                {t === "feed" ? "Moments" : t === "trips" ? `Trips (${trips.length})` : `Photos (${photoRows.length})`}
              </button>
            ))}
          </div>
          {tab === "trips" ? (
            <button onClick={() => setForm({ moment: null, trip: true })} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark">
              + Add a trip
            </button>
          ) : (
            <button onClick={() => setForm({ moment: null })} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark">
              + Add a moment
            </button>
          )}
        </div>

        {loading && <p className="mt-6 text-sm text-[#6E5A46]">Loading...</p>}

        {!loading && tab === "feed" && (
          <div className="mt-5 space-y-5">
            {moments.length === 0 ? (
              <div className="brand-card p-8 text-center">
                <Emoji e="📸" className="mx-auto h-16 w-16" />
                <p className="mt-2 font-bold text-brand-charcoal">No moments yet</p>
                <p className="mt-1 text-sm text-[#6E5A46]">Share a photo or a note about something you learned today.</p>
              </div>
            ) : (
              <MomentGrid moments={moments} onOpen={setOpen} />
            )}
          </div>
        )}

        {!loading && tab === "trips" && (
          <div className="mt-5 space-y-5">
            {trips.length === 0 ? (
              <div className="brand-card p-8 text-center">
                <Emoji e="🚌" className="mx-auto h-16 w-16 text-6xl" />
                <p className="mt-2 font-bold text-brand-charcoal">No trips yet</p>
                <p className="mt-1 text-sm text-[#6E5A46]">
                  Museums, farms, castles, nature reserves, the library: add where you went, a few photos and what you learned. Trips show up in your reports too.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#6E5A46]">
                  {tripsThisYear} {tripsThisYear === 1 ? "trip or day out" : "trips and days out"} this year, {trips.length} in all.
                </p>
                <MomentGrid moments={trips} onOpen={setOpen} />
              </>
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
              <div className="space-y-7">
                {photoMonths.map(([month, rows]) => (
                  <section key={month}>
                    <h2 className="mb-3 flex items-baseline gap-2 text-sm font-extrabold uppercase tracking-wider text-[#6E5A46]">
                      {format(parseISO(`${month}-01`), "MMMM yyyy")}
                      <span className="font-semibold normal-case tracking-normal text-[#8A7A69]">
                        {rows.length} photo{rows.length === 1 ? "" : "s"}
                      </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {rows.map(({ id, moment }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setViewing(id)}
                          className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F1EADC] shadow-sm ring-1 ring-[#E4DCCD] transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage"
                          aria-label={`Open photo from ${format(parseISO(moment.moment_date), "d MMMM")}`}
                        >
                          <MomentImage photoId={id} alt={moment.note ?? "Photo"} className="absolute inset-0 h-full w-full cursor-zoom-in transition-transform duration-300 group-hover:scale-105" />
                          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/55 to-transparent px-2.5 pb-2 pt-8 text-left text-xs font-bold text-white">
                            <span>{format(parseISO(moment.moment_date), "d MMM")}</span>
                            {moment.children.length > 0 && <span className="truncate font-semibold opacity-90">{moment.children.join(", ")}</span>}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {form && (
        <MomentForm
          moment={form.moment}
          trip={!!form.trip}
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
      {openMoment && (
        <MomentPopup onClose={() => setOpen(null)}>
          <MomentCard
            moment={openMoment}
            onChanged={load}
            onEdit={() => {
              setOpen(null);
              setForm({ moment: openMoment });
            }}
            onView={setViewing}
          />
        </MomentPopup>
      )}
      {viewing != null && <Lightbox photoId={viewing} moment={viewingMoment} onClose={() => setViewing(null)} />}
    </div>
  );
}
