"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  getUnits,
  upsertUnit,
  deleteUnit,
  getUnitQueue,
  addQueuedUnit,
  updateQueuedUnit,
  deleteQueuedUnit,
  promoteQueuedUnit,
  getFamilySubjects,
} from "@/lib/api";
import { Unit, UnitQueueItem } from "@/types";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import SchemeInput from "@/components/SchemeInput";
import { schemeOf } from "@/lib/schemes";
import { UNIT_TO_PLAN_KEY, type UnitToPlan } from "@/components/UnitAdder";
import { format, parseISO } from "date-fns";

// Used only if the family's timetable can't be loaded.
const FALLBACK_SUBJECTS = [
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
];

const SUBJECT_PRIORITY: Record<string, number> = {
  Maths: 0,
  English: 1,
  Science: 2,
};

interface Modal {
  subject: string;
  mode: "current" | "queue";
  existing: Unit | UnitQueueItem | null;
}

export default function UnitsPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [queue, setQueue] = useState<UnitQueueItem[]>([]);
  const [timetableSubjects, setTimetableSubjects] = useState<string[]>(FALLBACK_SUBJECTS);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [scheme, setScheme] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const isParent = role === "parent";

  const load = useCallback(async () => {
    const [unitsRes, queueRes, timetableRes] = await Promise.all([
      getUnits(),
      getUnitQueue(),
      getFamilySubjects().catch(() => null),
    ]);
    setUnits(unitsRes.data);
    setQueue(queueRes.data);
    if (timetableRes) {
      const familySubjects = timetableRes.data.subjects || [];
      if (familySubjects.length > 0) setTimetableSubjects(familySubjects);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    // Units are for grown-ups planning lessons; children go to their Today page.
    if (getRole() === "child") { router.replace("/child"); return; }
    setRole(getRole() || "");
    load();
  }, [load, router]);

  // Hands a unit to the planner's Add a Unit box, so its scheme and link don't need typing again.
  const planUnit = (unit: UnitToPlan) => {
    try {
      sessionStorage.setItem(UNIT_TO_PLAN_KEY, JSON.stringify(unit));
    } catch { /* the planner simply opens without it filled in */ }
    router.push("/parent");
  };

  const openCurrentModal = (subject: string) => {
    if (!isParent) return;
    const existing = units.find(u => u.subject === subject) || null;
    setModal({ subject, mode: "current", existing });
    setTitle(existing?.title ?? "");
    setUrl(existing?.unit_url ?? "");
    setScheme(existing?.scheme ?? "");
    setNotes(existing?.notes ?? "");
  };

  const openQueueModal = (subject: string, existing: UnitQueueItem | null = null) => {
    if (!isParent) return;
    setModal({ subject, mode: "queue", existing });
    setTitle(existing?.title ?? "");
    setUrl(existing?.unit_url ?? "");
    setScheme(existing?.scheme ?? "");
    setNotes(existing?.notes ?? "");
  };

  const closeModal = () => {
    setModal(null);
    setTitle("");
    setUrl("");
    setScheme("");
    setNotes("");
  };

  const handleSave = async () => {
    if (!modal || !title.trim()) return;
    setSaving(true);
    try {
      if (modal.mode === "current") {
        await upsertUnit({
          subject: modal.subject,
          title,
          unit_url: url || undefined,
          scheme: scheme.trim(),
          notes: notes || undefined,
        });
      } else if (modal.existing) {
        await updateQueuedUnit(modal.existing.id, {
          title,
          unit_url: url || "",
          scheme: scheme.trim(),
          notes: notes || "",
        });
      } else {
        await addQueuedUnit({
          subject: modal.subject,
          title,
          unit_url: url || undefined,
          scheme: scheme.trim(),
          notes: notes || undefined,
        });
      }

      await load();
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!modal?.existing) return;

    const message = modal.mode === "current"
      ? "Clear the current unit?"
      : "Remove this upcoming unit?";
    if (!confirm(message)) return;

    setSaving(true);
    try {
      if (modal.mode === "current") {
        await deleteUnit(modal.subject);
      } else {
        await deleteQueuedUnit(modal.existing.id);
      }
      await load();
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async (item: UnitQueueItem) => {
    if (!confirm(`Make “${item.title}” the current ${item.subject} unit? The existing current unit will be replaced.`)) return;
    await promoteQueuedUnit(item.id);
    await load();
  };

  const getUnit = (subject: string) => units.find(u => u.subject === subject);
  const getQueuedUnits = (subject: string) =>
    queue.filter(item => item.subject === subject).sort((a, b) => a.position - b.position);

  // The family's timetable subjects, plus any subject that already has units so nothing saved is hidden.
  const SUBJECTS = [
    ...timetableSubjects,
    ...[...units.map(u => u.subject), ...queue.map(q => q.subject)].filter(
      (subject, index, all) => !timetableSubjects.includes(subject) && all.indexOf(subject) === index
    ),
  ];

  const activeUnits = SUBJECTS.filter(subject => !!getUnit(subject)).length;
  const emptyUnits = SUBJECTS.length - activeUnits;
  const upcomingUnits = queue.length;

  const orderedSubjects = [...SUBJECTS].sort((a, b) => {
    const aPriority = SUBJECT_PRIORITY[a] ?? 99;
    const bPriority = SUBJECT_PRIORITY[b] ?? 99;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <PageHero art="oak" tint={0}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage mb-2">
                Learning
              </p>
              <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
                Units
              </h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                {isParent
                  ? "Keep each subject's current unit and link in one tidy place, whichever scheme you use."
                  : "The current units you are studying across each subject."}
              </p>
              </PageHero>
            </div>

            <div className="brand-card px-5 py-4 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-brand-sage">{activeUnits}</p>
                <p className="text-xs font-semibold text-[#6E5A46]">Current units</p>
              </div>
              <div className="w-px h-10 bg-brand-line" />
              <div>
                <p className="text-2xl font-bold text-[#D19A32]">{upcomingUnits}</p>
                <p className="text-xs font-semibold text-[#6E5A46]">Upcoming</p>
              </div>
              <div className="w-px h-10 bg-brand-line" />
              <div>
                <p className="text-2xl font-bold text-brand-softsage">{emptyUnits}</p>
                <p className="text-xs font-semibold text-[#6E5A46]">Not set</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading units…</div>
        ) : (
          <>
            <div className="brand-card p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">Current Learning</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Current Units</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    Keep the current unit at the top of each subject and queue future units underneath.
                  </p>
                </div>

                {isParent && (
                  <p className="text-xs font-semibold text-brand-softsage">
                    Add future units whenever you plan ahead
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orderedSubjects.map((subject, index) => {
                  const unit = getUnit(subject);
                  const queued = getQueuedUnits(subject);
                  const isCore = index < 3;

                  return (
                    <div
                      key={subject}
                      className={`rounded-2xl border p-5 transition-colors ${
                        unit
                          ? isCore
                            ? "bg-brand-cream border-[#D8D1C4]"
                            : "bg-brand-white border-brand-line"
                          : "bg-[#FBF8F1] border-dashed border-[#DDD3C4]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${unit ? "bg-brand-softsage" : "bg-[#D8D1C4]"}`} />
                          <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">{subject}</p>
                        </div>

                        {isCore && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-softsage bg-brand-tint px-2 py-1 rounded-full">
                            Core
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#A69A8D]">Current</p>
                        {unit ? (
                          <div className="mt-2">
                            <h3 className="text-base font-bold text-[#2E342F] leading-snug">{unit.title}</h3>
                            {schemeOf(unit.scheme, unit.unit_url) && (
                              <p className="text-xs font-bold text-brand-sage mt-1">{schemeOf(unit.scheme, unit.unit_url)}</p>
                            )}
                            {unit.notes && (
                              <p className="text-sm text-[#6E5A46] mt-2 line-clamp-2">{unit.notes}</p>
                            )}
                            <p className="text-xs text-[#8A7A69] mt-2">
                              Updated {format(parseISO(unit.updated_at), "d MMM yyyy")}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {unit.unit_url && (
                                <a
                                  href={unit.unit_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 rounded-xl bg-brand-sage text-white text-xs font-bold hover:bg-brand-sagedark"
                                >
                                  Open unit
                                </a>
                              )}
                              {isParent && (
                                <button
                                  onClick={() => planUnit({ title: unit.title, subject, scheme: schemeOf(unit.scheme, unit.unit_url), url: unit.unit_url })}
                                  title="Add this unit's lessons to the planner"
                                  className="px-3 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage text-xs font-bold hover:border-brand-softsage"
                                >
                                  Plan this unit
                                </button>
                              )}
                              {isParent && (
                                <button
                                  onClick={() => openCurrentModal(subject)}
                                  className="px-3 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage text-xs font-bold hover:border-brand-softsage"
                                >
                                  Edit current
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-sm font-bold text-[#8A7A69]">No current unit set</p>
                            {isParent && (
                              <button
                                onClick={() => openCurrentModal(subject)}
                                className="mt-3 px-3 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage text-xs font-bold hover:border-brand-softsage"
                              >
                                Set current unit
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {(queued.length > 0 || isParent) && (
                        <div className="mt-5 pt-4 border-t border-brand-line">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wide text-[#A69A8D]">Up next</p>
                              {queued.length > 0 && (
                                <p className="text-xs text-[#8A7A69] mt-1">
                                  {queued.length} unit{queued.length === 1 ? "" : "s"} planned ahead
                                </p>
                              )}
                            </div>

                            {isParent && (
                              <button
                                onClick={() => openQueueModal(subject)}
                                className="text-xs font-bold text-brand-sage hover:underline"
                              >
                                + Add next unit
                              </button>
                            )}
                          </div>

                          {queued.length === 0 ? (
                            <p className="text-sm text-[#A69A8D]">Nothing queued yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {queued.map((item, qIndex) => (
                                <div
                                  key={item.id}
                                  className="rounded-xl border border-brand-line bg-brand-white p-3"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="w-7 h-7 rounded-full bg-[#F0EADF] text-[#6E5A46] text-xs font-bold flex items-center justify-center shrink-0">
                                      {qIndex + 1}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-[#2E342F]">{item.title}</p>
                                      {schemeOf(item.scheme, item.unit_url) && (
                                        <p className="text-xs font-bold text-brand-sage mt-0.5">{schemeOf(item.scheme, item.unit_url)}</p>
                                      )}
                                      {item.notes && (
                                        <p className="text-xs text-[#6E5A46] mt-1 line-clamp-2">{item.notes}</p>
                                      )}

                                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                                        {item.unit_url && (
                                          <a
                                            href={item.unit_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-brand-sage hover:underline"
                                          >
                                            Open
                                          </a>
                                        )}

                                        {isParent && (
                                          <>
                                            <button
                                              onClick={() => openQueueModal(subject, item)}
                                              className="text-xs font-bold text-[#6E5A46] hover:underline"
                                            >
                                              Edit
                                            </button>

                                            {qIndex === 0 && (
                                              <button
                                                onClick={() => handlePromote(item)}
                                                className="text-xs font-bold text-[#D19A32] hover:underline"
                                              >
                                                Make current
                                              </button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {modal && isParent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="brand-card w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-softsage">
                  {modal.mode === "current" ? "Current Unit" : modal.existing ? "Upcoming Unit" : "Add Upcoming Unit"}
                </p>
                <h3 className="text-2xl font-bold text-[#2E342F] mt-1">{modal.subject}</h3>
                <p className="text-sm text-[#6E5A46] mt-1">
                  {modal.mode === "current"
                    ? "Keep the current topic and its link up to date."
                    : "Add or edit a unit you plan to use after the current one."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-[#8A7A69] hover:text-[#2E342F] text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-softsage mb-2">
                  Unit / topic title
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder="e.g. Algebraic notation"
                  className="w-full border border-[#D8D1C4] bg-brand-white rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-brand-softsage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-softsage mb-2">
                  Unit link
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-[#D8D1C4] bg-brand-white rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-brand-softsage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-softsage mb-2">
                  Scheme
                </label>
                <SchemeInput
                  value={scheme}
                  onChange={setScheme}
                  className="w-full border border-[#D8D1C4] bg-brand-white rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-brand-softsage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-softsage mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Optional context for this unit…"
                  className="w-full border border-[#D8D1C4] bg-brand-white rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-brand-softsage"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-5 py-2.5 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark disabled:opacity-50 transition-colors"
              >
                {saving
                  ? "Saving…"
                  : modal.existing
                  ? "Save changes"
                  : modal.mode === "current"
                  ? "Set current unit"
                  : "Add to queue"}
              </button>

              {modal.existing && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-[#E5CFC3] bg-brand-white text-[#A85F46] text-sm font-bold hover:bg-[#FAEEE8]"
                >
                  {modal.mode === "current" ? "Clear current" : "Remove from queue"}
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-[#D8D1C4] bg-brand-white text-[#6E5A46] text-sm font-bold hover:border-brand-softsage"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
