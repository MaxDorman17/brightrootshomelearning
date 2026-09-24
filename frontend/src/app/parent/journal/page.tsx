"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getJournalEntries, upsertJournalEntry, deleteJournalEntry } from "@/lib/api";
import { JournalEntry } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO } from "date-fns";

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await getJournalEntries();
    setEntries(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    load();
  }, [load, router]);

  // When date changes, load that day's content into the textarea
  useEffect(() => {
    const existing = entries.find(e => e.entry_date === selectedDate);
    setContent(existing?.content ?? "");
    setSaved(false);
  }, [selectedDate, entries]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await upsertJournalEntry(selectedDate, content.trim());
      setEntries(prev => {
        const without = prev.filter(e => e.entry_date !== selectedDate);
        return [res.data, ...without].sort((a, b) => b.entry_date.localeCompare(a.entry_date));
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!entries.find(e => e.entry_date === selectedDate)) return;
    if (!confirm("Delete this journal entry?")) return;
    await deleteJournalEntry(selectedDate);
    setEntries(prev => prev.filter(e => e.entry_date !== selectedDate));
    setContent("");
  };

  const hasEntry = !!entries.find(e => e.entry_date === selectedDate);
  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  const selectedEntry = entries.find(e => e.entry_date === selectedDate) ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                More
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Journal</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Private notes about learning, progress, what worked well and anything worth remembering.
              </p>
            </div>

            <div className="brand-card px-5 py-4 flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-[#3F5D46]">{entries.length}</p>
                <p className="text-xs font-semibold text-[#6E5A46]">Entries</p>
              </div>
              <div className="w-px h-10 bg-[#E7DFD1]" />
              <div>
                <p className="text-2xl font-bold text-[#D19A32]">{content.length}</p>
                <p className="text-xs font-semibold text-[#6E5A46]">Characters</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)] gap-6">
          <div className="brand-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Journal Entry</p>
                <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                  {isToday ? "Today" : format(parseISO(selectedDate), "EEEE d MMMM yyyy")}
                </h2>
                <p className="text-sm text-[#6E5A46] mt-1">
                  {hasEntry ? "Edit the saved note for this day." : "Add a private note for this day."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isToday && (
                  <span className="text-xs font-bold text-[#3F5D46] bg-[#E8F0E8] px-3 py-1.5 rounded-full">
                    Today
                  </span>
                )}
                {hasEntry && (
                  <span className="text-xs font-bold text-[#6E5A46] bg-[#F0ECE6] px-3 py-1.5 rounded-full">
                    Saved entry
                  </span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-4 py-3 text-sm font-semibold text-[#2E342F] focus:outline-none focus:border-[#8FA382]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                Notes
              </label>
              <textarea
                value={content}
                onChange={e => {
                  setContent(e.target.value);
                  setSaved(false);
                }}
                placeholder="How did the day go? What worked well? What was tricky? Any useful observations to remember later?"
                rows={14}
                className="w-full border border-[#D8D1C4] bg-[#FFFDF8] rounded-2xl px-4 py-4 text-sm text-[#2E342F] focus:outline-none focus:border-[#8FA382] resize-y leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 pt-5 border-t border-[#EEE6D9]">
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-50"
              >
                {saving ? "Saving…" : saved ? "Saved ✓" : hasEntry ? "Update entry" : "Save entry"}
              </button>

              {hasEntry && (
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-xl border border-[#E5CFC3] bg-[#FFFDF8] text-[#A85F46] text-sm font-bold hover:bg-[#FAEEE8]"
                >
                  Delete entry
                </button>
              )}

              <p className="sm:ml-auto text-xs text-[#8A7A69]">
                {saved
                  ? "Changes saved"
                  : selectedEntry
                  ? "Editing saved entry"
                  : "Not saved yet"}
              </p>
            </div>
          </div>

          <div className="brand-card p-5 h-fit">
            <div className="flex items-end justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">History</p>
                <h2 className="text-lg font-bold text-[#2E342F] mt-1">Past entries</h2>
              </div>
              <span className="text-sm font-bold text-[#3F5D46]">{entries.length}</span>
            </div>

            {loading ? (
              <p className="text-sm text-[#8A7A69] py-6 text-center">Loading entries…</p>
            ) : entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-6 text-center">
                <p className="text-sm font-semibold text-[#6E5A46]">No journal entries yet.</p>
                <p className="text-xs text-[#8A7A69] mt-1">Your saved notes will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {entries.map(e => {
                  const active = selectedDate === e.entry_date;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelectedDate(e.entry_date)}
                      className={`w-full text-left rounded-xl border p-4 transition-colors ${
                        active
                          ? "border-[#8FA382] bg-[#F7F2E8]"
                          : "border-[#E7DFD1] bg-[#FFFDF8] hover:border-[#8FA382]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                            {format(parseISO(e.entry_date), "EEE d MMM")}
                          </p>
                          <p className="text-sm text-[#2E342F] mt-2 line-clamp-3 leading-relaxed">
                            {e.content}
                          </p>
                        </div>

                        {e.entry_date === format(new Date(), "yyyy-MM-dd") && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#3F5D46] bg-[#E8F0E8] px-2 py-1 rounded-full shrink-0">
                            Today
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
