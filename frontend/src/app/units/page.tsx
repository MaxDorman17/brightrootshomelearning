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

const SUBJECT_STYLE: Record<string, { from: string; to: string; dot: string; light: string }> = {
  Maths:                  { from: "from-blue-500",   to: "to-blue-600",   dot: "bg-blue-500",   light: "bg-blue-50 border-blue-200" },
  English:                { from: "from-purple-500", to: "to-purple-600", dot: "bg-purple-500", light: "bg-purple-50 border-purple-200" },
  Science:                { from: "from-green-500",  to: "to-green-600",  dot: "bg-green-500",  light: "bg-green-50 border-green-200" },
  History:                { from: "from-yellow-500", to: "to-amber-500",  dot: "bg-yellow-500", light: "bg-yellow-50 border-yellow-200" },
  Computing:              { from: "from-indigo-500", to: "to-indigo-600", dot: "bg-indigo-500", light: "bg-indigo-50 border-indigo-200" },
  Geography:              { from: "from-cyan-500",   to: "to-cyan-600",   dot: "bg-cyan-500",   light: "bg-cyan-50 border-cyan-200" },
  Cooking:                { from: "from-orange-500", to: "to-orange-600", dot: "bg-orange-500", light: "bg-orange-50 border-orange-200" },
  "Art & Design":         { from: "from-pink-500",   to: "to-pink-600",   dot: "bg-pink-500",   light: "bg-pink-50 border-pink-200" },
  "Design and Technology":{ from: "from-red-500",    to: "to-red-600",    dot: "bg-red-500",    light: "bg-red-50 border-red-200" },
  "Life Skills":          { from: "from-teal-500",   to: "to-teal-600",   dot: "bg-teal-500",   light: "bg-teal-50 border-teal-200" },
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">📖 Current Units</h1>
          <p className="text-gray-500 font-medium mt-1">
            {isParent ? "Click any subject to set the current unit and link for Oscar" : "What you're studying in each subject right now"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.map(subject => {
            const unit = getUnit(subject);
            const s = SUBJECT_STYLE[subject] || { from: "from-gray-400", to: "to-gray-500", dot: "bg-gray-400", light: "bg-gray-50 border-gray-200" };
            return (
              <div key={subject}
                onClick={() => openModal(subject)}
                className={`rounded-2xl border-2 p-5 transition-all ${isParent ? "cursor-pointer hover:shadow-lg hover:scale-[1.02]" : "cursor-default"} ${unit ? s.light : "bg-white/70 border-dashed border-gray-200"}`}>
                {/* Subject header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shrink-0`}>
                    <span className={`w-2.5 h-2.5 rounded-full bg-white`} />
                  </div>
                  <span className="font-extrabold text-gray-800">{subject}</span>
                  {isParent && <span className="ml-auto text-gray-300 text-lg">{unit ? "✏️" : "+"}</span>}
                </div>

                {unit ? (
                  <>
                    <p className="font-bold text-gray-800 text-sm leading-snug">{unit.title}</p>
                    {unit.unit_url && (
                      <a href={unit.unit_url} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#2F5D3A] hover:text-[#6EA76E] bg-[#A8C67A]/10 px-2.5 py-1 rounded-lg border border-[#A8C67A]/30 transition-colors">
                        🔗 Open Unit
                      </a>
                    )}
                    {unit.notes && (
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{unit.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      Updated {format(parseISO(unit.updated_at), "d MMM yyyy")}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 font-medium">{isParent ? "Click to add current unit" : "Not set yet"}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit modal */}
      {modal && isParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${SUBJECT_STYLE[modal.subject]?.from || "from-gray-400"} ${SUBJECT_STYLE[modal.subject]?.to || "to-gray-500"} flex items-center justify-center`}>
                <span className="w-3 h-3 rounded-full bg-white" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">{modal.subject}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Unit / Topic title *</label>
                <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder={`e.g. Year 7 Algebra — Unit 2`}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Unit link (optional)</label>
                <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.thenational.academy/…"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Notes (optional)</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Any context for Oscar…"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !title.trim()}
                className="flex-1 gradient-btn py-2.5 disabled:opacity-50">
                {saving ? "Saving…" : modal.existing ? "Save Changes" : "Set Unit"}
              </button>
              {modal.existing && (
                <button onClick={handleDelete} disabled={saving}
                  className="px-4 py-2.5 border-2 border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors">
                  Clear
                </button>
              )}
              <button onClick={closeModal}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
