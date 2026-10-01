"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Emoji from "@/components/Emoji";
import {
  addFamilyBadge,
  deleteFamilyBadge,
  FamilyBadge,
  getFamilyBadgeImage,
  getFamilyBadges,
  setFamilyBadgeAwards,
  updateFamilyBadge,
} from "@/lib/api";
import { Child } from "@/types";

const EMOJIS = ["⭐", "🏆", "🏅", "👑", "💖", "🎉", "🌈", "🚀", "🦁", "💪", "🎨", "📚"];
const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";
const label = "mb-1.5 block text-sm font-bold text-brand-charcoal";

function detail(err: unknown, fallback: string) {
  const d = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof d === "string" ? d : fallback;
}

// Badge pictures are behind login, so they're fetched once and kept in memory.
const cache = new Map<string, Promise<string | null>>();
function loadImage(badge: FamilyBadge): Promise<string | null> {
  const key = `${badge.id}:${badge.image_version}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      getFamilyBadgeImage(badge.id)
        .then((res) => URL.createObjectURL(res.data as Blob))
        .catch(() => null)
    );
  }
  return cache.get(key)!;
}

/** The badge's own picture, or its emoji when there isn't one. */
function BadgeArt({ badge, dim }: { badge: FamilyBadge; dim?: boolean }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    if (badge.has_image) loadImage(badge).then((url) => !cancelled && setSrc(url));
    return () => {
      cancelled = true;
    };
  }, [badge]);

  return (
    <div
      className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl text-4xl ${
        dim ? "bg-[#EFE9DF] opacity-50 grayscale" : "bg-brand-cream"
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain" />
      ) : (
        <Emoji e={badge.emoji || "🏅"} />
      )}
    </div>
  );
}

function BadgeForm({ badge, onDone }: { badge: FamilyBadge | null; onDone: (changed: boolean) => void }) {
  const [title, setTitle] = useState(badge?.title ?? "");
  const [description, setDescription] = useState(badge?.description ?? "");
  const [emoji, setEmoji] = useState(badge?.emoji ?? "⭐");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const picker = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const choose = (f: File | undefined) => {
    setError("");
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setError("Pictures must be 5 MB or smaller.");
    setFile(f);
    setRemoveImage(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("Give the badge a name.");
    setSaving(true);
    setError("");
    try {
      const body = { title: title.trim(), description: description.trim(), emoji, file, remove_image: removeImage };
      if (badge) await updateFamilyBadge(badge.id, body);
      else await addFamilyBadge(body);
      onDone(true);
    } catch (err) {
      setError(detail(err, "That didn't save. Please try again."));
      setSaving(false);
    }
  };

  const hasPicture = !!preview || (!!badge?.has_image && !removeImage);

  return (
    <form onSubmit={submit} className="mb-5 space-y-4 rounded-2xl border border-brand-line bg-white p-5">
      <h3 className="text-lg font-extrabold text-brand-charcoal">{badge ? "Change this badge" : "Make a badge"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="badge-title">Badge name</label>
          <input id="badge-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="e.g. Kind Friend" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="badge-desc">What is it for?</label>
          <input id="badge-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} placeholder="e.g. For helping without being asked" className={input} />
        </div>
      </div>

      <div>
        <p className={label}>Picture</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-cream text-4xl">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain" />
            ) : badge && badge.has_image && !removeImage ? (
              <BadgeArtInline badge={badge} />
            ) : (
              <Emoji e={emoji} />
            )}
          </div>
          <div className="space-y-2">
            <input ref={picker} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => choose(e.target.files?.[0])} />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => picker.current?.click()} className="rounded-xl border-2 border-brand-sage bg-white px-4 py-2 text-sm font-extrabold text-brand-sage">
                {hasPicture ? "Choose a different picture" : "Upload your own picture"}
              </button>
              {hasPicture && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setRemoveImage(true);
                  }}
                  className="rounded-xl px-3 py-2 text-sm font-bold text-[#A64F42] hover:underline"
                >
                  Remove picture
                </button>
              )}
            </div>
            <p className="text-xs text-brand-earth/70">A square PNG or JPG works best, up to 5 MB. A see-through background looks neatest.</p>
          </div>
        </div>
        {!hasPicture && (
          <div className="mt-3">
            <p className="mb-1.5 text-xs font-bold text-brand-earth/70">Or pick a symbol</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  aria-label={`Use ${e}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-2xl ${
                    emoji === e ? "border-brand-sage bg-brand-tint" : "border-brand-line bg-white"
                  }`}
                >
                  <Emoji e={e} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60">
          {saving ? "Saving…" : badge ? "Save changes" : "Add badge"}
        </button>
        <button type="button" onClick={() => onDone(false)} className="rounded-xl border-2 border-brand-line bg-white px-5 py-2.5 text-sm font-extrabold text-brand-sage">
          Cancel
        </button>
      </div>
    </form>
  );
}

/** The saved picture, filling the preview box in the form. */
function BadgeArtInline({ badge }: { badge: FamilyBadge }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadImage(badge).then((url) => !cancelled && setSrc(url));
    return () => {
      cancelled = true;
    };
  }, [badge]);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" className="h-full w-full object-contain" /> : null;
}

type Props = {
  role: string;
  kids: Child[];
  /** For a parent: the child being viewed on the Badges page, if one is picked. */
  viewingChildId: number | null;
  /** How many family badges the viewed child has, so the page total can include them. */
  onEarnedCount?: (count: number) => void;
};

/** "Our family's badges" on the Badges page: grown-ups make, award and remove them; children see theirs. */
export default function FamilyBadges({ role, kids, viewingChildId, onEarnedCount }: Props) {
  const [badges, setBadges] = useState<FamilyBadge[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<FamilyBadge | "new" | null>(null);
  const [error, setError] = useState("");
  const isParent = role === "parent";

  const load = useCallback(() => {
    getFamilyBadges()
      .then((res) => setBadges(res.data))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasIt = useCallback(
    (b: FamilyBadge) => (isParent ? (viewingChildId ? b.awarded_to.includes(viewingChildId) : b.awarded_to.length > 0) : !!b.earned),
    [isParent, viewingChildId]
  );

  useEffect(() => {
    onEarnedCount?.(badges.filter(hasIt).length);
  }, [badges, hasIt, onEarnedCount]);

  const toggle = async (badge: FamilyBadge, childId: number) => {
    const next = badge.awarded_to.includes(childId) ? badge.awarded_to.filter((c) => c !== childId) : [...badge.awarded_to, childId];
    setError("");
    try {
      const res = await setFamilyBadgeAwards(badge.id, next);
      setBadges((all) => all.map((b) => (b.id === badge.id ? res.data : b)));
    } catch (err) {
      setError(detail(err, "That didn't save."));
    }
  };

  const remove = async (badge: FamilyBadge) => {
    if (!confirm(`Remove the "${badge.title}" badge? It will disappear for everyone who has it.`)) return;
    try {
      await deleteFamilyBadge(badge.id);
      load();
    } catch (err) {
      setError(detail(err, "That didn't work."));
    }
  };

  if (!loaded) return null;
  // Children only see this once their grown-ups have made a badge.
  if (!isParent && badges.length === 0) return null;

  return (
    <div className="brand-card mt-6 p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Made by us</p>
          <h2 className="mt-1 text-xl font-bold text-[#2E342F]">Our family&apos;s badges</h2>
          {isParent && (
            <p className="mt-1 max-w-xl text-sm text-[#6E5A46]">
              Make badges of your own with your own pictures, then tick who has earned each one. Untick to take a badge back.
            </p>
          )}
        </div>
        {isParent && !editing && (
          <button onClick={() => setEditing("new")} className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark">
            + Make a badge
          </button>
        )}
      </div>

      {editing && (
        <BadgeForm
          key={editing === "new" ? "new" : editing.id}
          badge={editing === "new" ? null : editing}
          onDone={(changed) => {
            setEditing(null);
            if (changed) load();
          }}
        />
      )}
      {error && <p className="mb-3 text-sm font-semibold text-[#A64F42]">{error}</p>}

      {badges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-8 text-center">
          <p className="text-sm font-semibold text-[#6E5A46]">
            No badges of your own yet. Make one for anything you like: kindness, swimming a length, tidying up without being asked.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((b) => {
            const earned = hasIt(b);
            return (
              <div
                key={b.id}
                className={`rounded-2xl border p-4 text-center ${earned ? "border-[#D8D1C4] bg-brand-white" : "border-dashed border-[#DDD3C4] bg-[#FBF8F1]"}`}
              >
                <BadgeArt badge={b} dim={!earned} />
                <p className={`text-sm font-bold leading-tight ${earned ? "text-[#2E342F]" : "text-[#6E5A46]"}`}>{b.title}</p>
                {b.description && <p className="mt-1 text-xs leading-snug text-[#8A7A69]">{b.description}</p>}

                {isParent ? (
                  <>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {kids.length === 0 && <span className="text-xs text-[#8A7A69]">Add a child to award this</span>}
                      {kids.map((k) => {
                        const on = b.awarded_to.includes(k.id);
                        return (
                          <button
                            key={k.id}
                            onClick={() => toggle(b, k.id)}
                            aria-pressed={on}
                            className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold ${
                              on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth"
                            }`}
                          >
                            {on ? "✓ " : ""}
                            {k.username}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex justify-center gap-4 text-xs font-bold">
                      <button onClick={() => setEditing(b)} className="text-brand-sage hover:underline">Edit</button>
                      <button onClick={() => remove(b)} className="text-[#A64F42] hover:underline">Remove</button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        earned ? "bg-brand-tint text-brand-sage" : "bg-[#F0ECE6] text-[#8A7A69]"
                      }`}
                    >
                      {earned ? "Earned" : "Not yet"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
