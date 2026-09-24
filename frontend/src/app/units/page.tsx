"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getUnits, upsertUnit, deleteUnit } from "@/lib/api";
import { Unit } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO } from "date-fns";

const SUBJECTS = [
  "Maths", "English", "Science", "History", "Computing",
  "Geography", "Cooking", "Art & Design", "Design and Technology", "Life Skills",
];

const SUBJECT_PRIORITY: Record<string, number> = {
  Maths: 0,
  English: 1,
  Science: 2,
};

interface Modal { subject: string; existing: Unit | null }

export default function UnitsPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const isParent = role === "parent";

  const load = useCallback(async () => {
    const res = await getUnits();
    setUnits(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setRole(getRole() || "");
    load();
  }, [load, router]);

  const openModal = (subject: string) => {
    if (!isParent) return;
    const existing = units.find(u => u.subject === subject) || null;
    setModal({ subject, existing });
    setTitle(existing?.title ?? "");
    setUrl(existing?.unit_url ?? "");
    setNotes(existing?.notes ?? "");
  };

  const closeModal = () => { setModal(null); setTitle(""); setUrl(""); setNotes(""); };

  const handleSave = async () => {
    if (!modal || !title.trim()) return;
    setSaving(true);
    try {
      await upsertUnit({ subject: modal.subject, title, unit_url: url || undefined, notes: notes || undefined });
      await load();
      closeModal();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!modal?.existing) return;
    if (!confirm("Clear this unit?")) return;
    setSaving(true);
    try {
      await deleteUnit(modal.subject);
      await load();
      closeModal();
    } finally { setSaving(false); }
  };

  const getUnit = (subject: string) => units.find(u => u.subject === subject);

  const activeUnits = SUBJECTS.filter(subject => !!getUnit(subject)).length;
  const emptyUnits = SUBJECTS.length - activeUnits;

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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Learning
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">
                Oak Units
              </h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                {isParent
                  ? "Keep each subject's current Oak unit and link in one tidy place."
                  : "The current units you are studying across each subject."}
              </p>
            </div>

            <div className="brand-card px-5 py-4 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-[#3F5D46]">{activeUnits}</p>
                <p className="text-xs font-semibold text-[#6E5A46]">Units set</p>
              </div>
              <div className="w-px h-10 bg-[#E7DFD1]" />
              <div>
                <p className="text-2xl font-bold text-[#8FA382]">{emptyUnits}</p>
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
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Current Learning</p>
                  <h2 className="text-xl font-bold text-[#2E342F] mt-1">Current Units</h2>
                  <p className="text-sm text-[#6E5A46] mt-1">
                    Maths, English and Science stay at the top, with the remaining subjects below.
                  </p>
                </div>

                {isParent && (
                  <p className="text-xs font-semibold text-[#8FA382]">
                    Select Edit unit to update a subject
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {orderedSubjects.map((subject, index) => {
                  const unit = getUnit(subject);
                  const isCore = index < 3;

                  return (
                    <div
                      key={subject}
                      className={`rounded-2xl border p-5 transition-colors ${
                        unit
                          ? isCore
                            ? "bg-[#F7F2E8] border-[#D8D1C4]"
                            : "bg-[#FFFDF8] border-[#E7DFD1]"
                          : "bg-[#FBF8F1] border-dashed border-[#DDD3C4]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              unit ? "bg-[#8FA382]" : "bg-[#D8D1C4]"
                            }`} />
                            <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                              {subject}
                            </p>
                          </div>

                          {unit ? (
                            <>
                              <h3 className="text-base font-bold text-[#2E342F] mt-3 leading-snug">
                                {unit.title}
                              </h3>

                              {unit.notes && (
                                <p className="text-sm text-[#6E5A46] mt-2 leading-relaxed line-clamp-2">
                                  {unit.notes}
                                </p>
                              )}

                              <p className="text-xs text-[#8A7A69] mt-3">
                                Updated {format(parseISO(unit.updated_at), "d MMM yyyy")}
                              </p>
                            </>
                          ) : (
                            <>
                              <h3 className="text-base font-bold text-[#8A7A69] mt-3">No unit set</h3>
                              <p className="text-sm text-[#A69A8D] mt-1">
                                {isParent ? "Add the current unit when ready." : "Nothing has been set yet."}
                              </p>
                            </>
                          )}
                        </div>

                        {isCore && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#8FA382] bg-[#E8F0E8] px-2 py-1 rounded-full shrink-0">
                            Core
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#E7DFD1]">
                        {unit?.unit_url && (
                          <a
                            href={unit.unit_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-[#3F5D46] text-white text-xs font-bold hover:bg-[#354F3B] transition-colors"
                          >
                            Open unit
                          </a>
                        )}

                        {isParent && (
                          <button
                            onClick={() => openModal(subject)}
                            className="inline-flex items-center justify-center px-3 py-2 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#3F5D46] text-xs font-bold hover:border-[#8FA382] transition-colors"
                          >
                            {unit ? "Edit unit" : "Set unit"}
                          </button>
                        )}
                      </div>
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
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Current Unit</p>
                <h3 className="text-2xl font-bold text-[#2E342F] mt-1">{modal.subject}</h3>
                <p className="text-sm text-[#6E5A46] mt-1">
                  Keep the current topic and Oak link up to date.
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
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Unit / topic title
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder="e.g. Algebraic notation"
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Unit link
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.thenational.academy/…"
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Optional context for this unit…"
                  className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : modal.existing ? "Save changes" : "Set unit"}
              </button>

              {modal.existing && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-[#E5CFC3] bg-[#FFFDF8] text-[#A85F46] text-sm font-bold hover:bg-[#FAEEE8]"
                >
                  Clear unit
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] text-sm font-bold hover:border-[#8FA382]"
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
