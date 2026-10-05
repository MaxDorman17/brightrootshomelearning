"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import CookAlong from "@/components/make/CookAlong";
import StoryBook from "@/components/make/StoryBook";
import { errorText, KIND_INFO, listPathFor, MakeDetail, MakePhoto, MetaChips, TEEN_TABS } from "@/components/make/common";
import {
  addItemToShopping,
  addMoment,
  clearMakeWishes,
  copyMakeItem,
  deleteMakeItem,
  getChildren,
  getMakeItem,
  getTimetable,
  logActivity,
  planMakeItem,
  toggleMakeWish,
} from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { subjectsInTimetable } from "@/lib/subjects";
import Emoji, { EmojiText } from "@/components/Emoji";

type Child = { id: number; username: string; activity_level?: string | null };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-brand-white p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold text-brand-charcoal">{title}</h2>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm font-bold text-brand-earth/60 hover:bg-brand-cream">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const btn = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-60";
const primary = `${btn} bg-brand-sage text-white hover:bg-brand-sagedark`;
const secondary = `${btn} border-2 border-brand-line bg-white text-brand-sage hover:border-brand-softsage`;
const input = "w-full rounded-xl border-2 border-brand-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage";

export default function MakeItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [role, setRole] = useState("");
  const [item, setItem] = useState<MakeDetail | null>(null);
  const [missing, setMissing] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [got, setGot] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<"shop" | "plan" | "made" | "did" | "delete" | null>(null);
  const [cooking, setCooking] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    getMakeItem(id)
      .then((res) => setItem(res.data))
      .catch(() => setMissing(true));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const r = getRole() || "";
    setRole(r);
    load();
    if (r === "parent") {
      getChildren()
        .then((res) => setChildren(res.data))
        .catch(() => {});
    }
    getTimetable()
      .then((res) => setSubjects(subjectsInTimetable(res.data.config || {})))
      .catch(() => {});
  }, [load, router]);

  if (missing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-lg font-bold text-brand-charcoal">We couldn&apos;t find that one.</p>
          <Link href="/make/cookbook" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to the Cookbook
          </Link>
        </div>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="px-6 py-10 text-sm text-brand-earth/70">Loading...</p>
      </div>
    );
  }

  const info = KIND_INFO[item.kind];
  const isParent = role === "parent";
  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 4000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link href={listPathFor(item)} className="text-sm font-bold text-brand-sage hover:underline">
          ← {(item.age_from ?? 0) >= 11 ? TEEN_TABS.find((t) => t.kind === item.kind)!.name : info.name}
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <MakePhoto item={item} big className="aspect-[4/3] w-full rounded-3xl border border-brand-line" />
          </div>
          <div className="lg:col-span-3">
            {item.category && <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">{item.category}</p>}
            <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
              <Emoji e={item.emoji} /> {item.title}
            </h1>
            {item.summary && <p className="mt-2 text-brand-earth/80">{item.summary}</p>}
            <div className="mt-3">
              <MetaChips item={item} />
            </div>
            {isParent && item.wished_by.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm">
                <span className="font-bold text-rose-700">❤️ {item.wished_by.join(" and ")} would love to make this!</span>
                <button
                  onClick={async () => {
                    await clearMakeWishes(item.id);
                    load();
                  }}
                  className="text-xs font-bold text-rose-700 underline"
                >
                  Mark as done
                </button>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {item.steps.length > 0 && (
                <button onClick={() => setCooking(true)} className={primary}>
                  ▶ {item.kind === "life" || item.kind === "little" ? "Start" : "Start making"}
                </button>
              )}
              {role === "child" && (
                <button
                  onClick={async () => {
                    const res = await toggleMakeWish(item.id);
                    flash(res.data.wished ? "Added to your wish list. Your grown-up will see it!" : "Taken off your wish list.");
                    load();
                  }}
                  className={item.wished_by.length ? `${btn} bg-rose-100 text-rose-700` : secondary}
                >
                  {item.wished_by.length ? "❤️ On my wish list" : item.kind === "life" ? "🤍 I'd love to learn this" : "🤍 I'd love to make this"}
                </button>
              )}
              {isParent && item.materials.length > 0 && item.kind !== "life" && (
                <button onClick={() => setModal("shop")} className={secondary}>
                  🛒 Add to shopping list
                </button>
              )}
              {isParent && (
                <button onClick={() => setModal("plan")} className={secondary}>
                  🗓️ Plan it
                </button>
              )}
              {(item.kind === "pe" || item.kind === "outdoor") && (
                <button onClick={() => setModal("did")} className={secondary}>
                  ✓ We did this
                </button>
              )}
              <button onClick={() => setModal("made")} className={secondary}>
                <Emoji e="📸" /> {item.kind === "pe" || item.kind === "outdoor" || item.kind === "life" || item.kind === "little" ? "Share a photo" : "We made this!"}
              </button>
            </div>
            {notice && <p className="mt-3 text-sm font-bold text-brand-sage">{notice}</p>}

            {isParent && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold">
                {item.is_own ? (
                  <>
                    <Link href={`/make/${item.id}/edit`} className="text-brand-sage hover:underline">
                      ✏️ Edit
                    </Link>
                    <button onClick={() => setModal("delete")} className="text-red-700 hover:underline">
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={async () => {
                      const res = await copyMakeItem(item.id);
                      router.push(`/make/${res.data.id}/edit`);
                    }}
                    className="text-brand-sage hover:underline"
                  >
                    ✏️ Make my own version
                  </button>
                )}
                {item.kind === "little" ? (
                  <Link href={`/make/${item.id}/print`} className="text-brand-sage hover:underline">
                    <EmojiText text="🖨️ Print a fridge card" />
                  </Link>
                ) : (
                  <button onClick={() => window.print()} className="text-brand-sage hover:underline">
                    <EmojiText text="🖨️ Print" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <section className="brand-card h-fit p-5 lg:col-span-2">
            <h2 className="text-lg font-extrabold text-brand-charcoal">{info.materials}</h2>
            {item.materials.length === 0 ? (
              <p className="mt-2 text-sm text-brand-earth/70">Nothing listed.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {item.materials.map((m, i) => (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1 hover:bg-brand-cream">
                      <input
                        type="checkbox"
                        checked={got.has(i)}
                        onChange={() =>
                          setGot((prev) => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i);
                            else next.add(i);
                            return next;
                          })
                        }
                        className="mt-1 h-4 w-4 accent-brand-sage"
                      />
                      <span className={got.has(i) ? "text-brand-earth/50 line-through" : "text-brand-charcoal"}>
                        {m.qty && <b>{m.qty} </b>}
                        {m.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {item.materials.length > 0 && <p className="mt-3 text-xs text-brand-earth/60">Tick things off as you get them out.</p>}
          </section>

          <section className="lg:col-span-3">
            <h2 className="text-lg font-extrabold text-brand-charcoal">{item.kind === "little" ? "What to do" : item.kind === "life" ? "How to do it" : "How to make it"}</h2>
            <ol className="mt-3 space-y-3">
              {item.steps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-2xl border border-brand-line bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-sage text-sm font-black text-white">{i + 1}</span>
                  <div>
                    {s.grown_up && (
                      <span className="mb-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800"><Emoji e="🧑" /> Grown-up job</span>
                    )}
                    <p className="text-brand-charcoal">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {item.talk?.length > 0 && (
              <div className="mt-4 rounded-2xl border border-brand-line bg-white p-4">
                <h3 className="font-extrabold text-brand-charcoal"><Emoji e="💬" /> What to say or ask</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-brand-charcoal">
                  {item.talk.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.more && (
              <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm text-brand-charcoal">
                <b><Emoji e="🚀" /> If they&apos;re ready for more:</b> {item.more}
              </div>
            )}
            {item.easier && (
              <div className="mt-4 rounded-2xl bg-brand-cream p-4 text-sm text-brand-charcoal">
                <b><Emoji e="🌙" /> If it&apos;s not a good day:</b> {item.easier}
              </div>
            )}
            {item.tips && (
              <div className={`mt-4 rounded-2xl p-4 text-sm text-brand-charcoal ${item.kind === "little" ? "bg-amber-50" : "bg-brand-tint"}`}>
                {item.kind === "little" ? (
                  <b><Emoji e="⚠️" /> Keep it safe:</b>
                ) : (
                  <b><Emoji e="💡" /> Tip:</b>
                )}{" "}
                {item.tips}
              </div>
            )}
          </section>
        </div>
      </div>

      {cooking && item.kind === "little" && (
        <StoryBook
          item={item}
          kids={isParent ? children : []}
          onClose={() => setCooking(false)}
          onFinish={() => {
            setCooking(false);
            setModal("made");
          }}
        />
      )}
      {cooking && item.kind !== "little" && (
        <CookAlong
          item={item}
          onClose={() => setCooking(false)}
          onFinish={() => {
            setCooking(false);
            setModal("made");
          }}
        />
      )}
      {modal === "shop" && (
        <ShopModal
          item={item}
          onClose={() => setModal(null)}
          onDone={(n) => {
            setModal(null);
            flash(`Added ${n} thing${n === 1 ? "" : "s"} to your shopping list.`);
          }}
        />
      )}
      {modal === "plan" && (
        <PlanModal
          item={item}
          kids={children}
          subjects={subjects}
          onClose={() => setModal(null)}
          onDone={(when) => {
            setModal(null);
            flash(`Added to the planner for ${when}.`);
          }}
        />
      )}
      {modal === "made" && (
        <MadeModal
          item={item}
          role={role}
          kids={children}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            flash("Saved to Moments! 🎉");
          }}
        />
      )}
      {modal === "did" && (
        <DidItModal
          item={item}
          role={role}
          kids={children}
          onClose={() => setModal(null)}
          onDone={() => {
            setModal(null);
            flash("Added to the activity diary. It will show in the reports. 🎉");
          }}
        />
      )}
      {modal === "delete" && (
        <Modal title={`Delete ${item.title}?`} onClose={() => setModal(null)}>
          <p className="text-sm text-brand-earth/80">This removes it from your {info.name}. It can&apos;t be undone.</p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={async () => {
                await deleteMakeItem(item.id);
                router.replace(info.path);
              }}
              className={`${btn} bg-red-700 text-white`}
            >
              Delete
            </button>
            <button onClick={() => setModal(null)} className={secondary}>
              Keep it
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ShopModal({ item, onClose, onDone }: { item: MakeDetail; onClose: () => void; onDone: (n: number) => void }) {
  const [picked, setPicked] = useState<Set<number>>(new Set(item.materials.map((_, i) => i)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    try {
      const names = item.materials.filter((_, i) => picked.has(i)).map((m) => m.name);
      const res = await addItemToShopping(item.id, names);
      onDone(res.data.added);
    } catch (err) {
      setError(errorText(err, "Could not add to the list. Please try again."));
      setSaving(false);
    }
  };

  return (
    <Modal title="Add to shopping list" onClose={onClose}>
      <p className="text-sm text-brand-earth/70">Untick anything you already have at home.</p>
      <ul className="mt-3 space-y-1">
        {item.materials.map((m, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-brand-cream">
              <input
                type="checkbox"
                checked={picked.has(i)}
                onChange={() =>
                  setPicked((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
                className="h-4 w-4 accent-brand-sage"
              />
              <span className="text-sm text-brand-charcoal">
                {m.qty && <b>{m.qty} </b>}
                {m.name}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={save} disabled={saving || picked.size === 0} className={primary}>
          {saving ? "Adding..." : `Add ${picked.size} to list`}
        </button>
        <Link href="/make/shopping" className={secondary}>
          Open shopping list
        </Link>
      </div>
    </Modal>
  );
}

function DidItModal({
  item,
  role,
  kids,
  onClose,
  onDone,
}: {
  item: MakeDetail;
  role: string;
  kids: Child[];
  onClose: () => void;
  onDone: () => void;
}) {
  const [day, setDay] = useState(format(new Date(), "yyyy-MM-dd"));
  const [minutes, setMinutes] = useState<number | "">(item.minutes ?? "");
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<number[]>(kids.length === 1 ? [kids[0].id] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (role === "parent" && !picked.length) {
      setError("Pick who did it.");
      return;
    }
    setSaving(true);
    try {
      await logActivity({
        kind: item.kind === "outdoor" ? "outdoor" : "pe",
        title: item.title,
        make_item_id: item.id,
        done_on: day,
        minutes: minutes === "" ? null : minutes,
        note: note || undefined,
        child_ids: picked,
      });
      onDone();
    } catch (err) {
      setError(errorText(err, "Could not save that."));
      setSaving(false);
    }
  };

  return (
    <Modal title="We did this!" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-brand-earth/80">This goes in the activity diary, and shows in the learning report and the council report.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-brand-charcoal" htmlFor="did-day">Day</label>
            <input id="did-day" type="date" required value={day} onChange={(e) => setDay(e.target.value)} className={input} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-brand-charcoal" htmlFor="did-minutes">Minutes</label>
            <input
              id="did-minutes"
              type="number"
              min={1}
              max={600}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value ? Number(e.target.value) : "")}
              className={input}
            />
          </div>
        </div>
        {role === "parent" && kids.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-bold text-brand-charcoal">Who did it?</p>
            <div className="flex flex-wrap gap-2">
              {kids.map((k) => {
                const on = picked.includes(k.id);
                return (
                  <button
                    type="button"
                    key={k.id}
                    onClick={() => setPicked(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
                    className={
                      "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                      (on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                    }
                  >
                    {on ? "✓ " : ""}
                    {k.username}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-charcoal" htmlFor="did-note">Note (optional)</label>
          <textarea id="did-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Beat their best time!" className={input} />
        </div>
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className={primary}>
          {saving ? "Saving..." : "Add to diary"}
        </button>
      </form>
    </Modal>
  );
}

function PlanModal({
  item,
  kids,
  subjects,
  onClose,
  onDone,
}: {
  item: MakeDetail;
  kids: Child[];
  subjects: string[];
  onClose: () => void;
  onDone: (when: string) => void;
}) {
  const [day, setDay] = useState(format(new Date(), "yyyy-MM-dd"));
  const [subject, setSubject] = useState(KIND_INFO[item.kind].subject);
  const [picked, setPicked] = useState<number[]>(kids.map((k) => k.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await planMakeItem(item.id, { scheduled_date: day, subject, child_ids: picked });
      onDone(format(new Date(`${day}T12:00:00`), "EEEE d MMMM"));
    } catch (err) {
      setError(errorText(err, "Could not add it to the planner."));
      setSaving(false);
    }
  };

  return (
    <Modal title="Add to the planner" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">Day</label>
          <input type="date" required value={day} onChange={(e) => setDay(e.target.value)} className={input} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">Subject</label>
          <input list="make-subjects" required value={subject} onChange={(e) => setSubject(e.target.value)} className={input} />
          <datalist id="make-subjects">
            {[KIND_INFO[item.kind].subject, "Life Skills", "Art", "Cooking", ...subjects].filter((s, i, a) => a.indexOf(s) === i).map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        {kids.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-bold text-brand-charcoal">Who&apos;s joining in?</p>
            <div className="flex flex-wrap gap-2">
              {kids.map((k) => {
                const on = picked.includes(k.id);
                return (
                  <button
                    type="button"
                    key={k.id}
                    onClick={() => setPicked(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
                    className={
                      "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                      (on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                    }
                  >
                    {on ? "✓ " : ""}
                    {k.username}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className={primary}>
          {saving ? "Adding..." : "Add to planner"}
        </button>
      </form>
    </Modal>
  );
}

function MadeModal({
  item,
  role,
  kids,
  onClose,
  onDone,
}: {
  item: MakeDetail;
  role: string;
  kids: Child[];
  onClose: () => void;
  onDone: () => void;
}) {
  const [note, setNote] = useState(`We made ${item.title.toLowerCase()}! ${item.emoji || ""}`.trim());
  const [files, setFiles] = useState<File[]>([]);
  const [picked, setPicked] = useState<number[]>(kids.length === 1 ? [kids[0].id] : []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addMoment(
        { note, moment_date: format(new Date(), "yyyy-MM-dd"), subject: KIND_INFO[item.kind].subject, child_ids: role === "parent" ? picked : [] },
        files
      );
      onDone();
    } catch (err) {
      setError(errorText(err, "Could not save the moment."));
      setSaving(false);
    }
  };

  return (
    <Modal title="📸 We made this!" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 6))}
            className="block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-brand-tint file:px-4 file:py-2 file:font-bold file:text-brand-sage"
          />
          {files.length > 0 && <p className="mt-1 text-xs text-brand-earth/70">{files.length} photo{files.length === 1 ? "" : "s"} chosen</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-charcoal">Note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className={input} />
        </div>
        {role === "parent" && kids.length > 1 && (
          <div>
            <p className="mb-1.5 text-sm font-bold text-brand-charcoal">Who made it?</p>
            <div className="flex flex-wrap gap-2">
              {kids.map((k) => {
                const on = picked.includes(k.id);
                return (
                  <button
                    type="button"
                    key={k.id}
                    onClick={() => setPicked(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
                    className={
                      "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                      (on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                    }
                  >
                    {on ? "✓ " : ""}
                    {k.username}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={saving || (!note.trim() && files.length === 0)} className={primary}>
          {saving ? "Saving..." : "Save to Moments"}
        </button>
      </form>
    </Modal>
  );
}
