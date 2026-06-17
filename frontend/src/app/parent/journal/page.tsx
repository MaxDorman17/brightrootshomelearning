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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">📔 Daily Journal</h1>
          <p className="text-gray-500 font-medium mt-1">Your private notes on Oscar&apos;s learning — what worked, what didn&apos;t, observations to remember.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Left: editor */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="block mt-1 border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                  />
                </div>
                <div className="ml-auto text-right">
                  {isToday && (
                    <span className="text-xs font-bold text-[#2F5D3A] bg-[#A8C67A]/20 px-2 py-1 rounded-lg">Today</span>
                  )}
                  {hasEntry && !isToday && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Entry saved</span>
                  )}
                </div>
              </div>

              <textarea
                value={content}
                onChange={e => { setContent(e.target.value); setSaved(false); }}
                placeholder={`How did today go? What did Oscar learn? Any observations worth remembering…`}
                rows={12}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#6EA76E] resize-none transition-colors leading-relaxed"
              />

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                  className="gradient-btn disabled:opacity-50 text-sm px-5 py-2"
                >
                  {saving ? "Saving…" : saved ? "✓ Saved!" : hasEntry ? "Update Entry" : "Save Entry"}
                </button>
                {hasEntry && (
                  <button onClick={handleDelete} className="text-sm text-red-400 hover:text-red-600 font-semibold transition-colors">
                    Delete
                  </button>
                )}
                <span className="ml-auto text-xs text-gray-400">{content.length} characters</span>
              </div>
            </div>
          </div>

          {/* Right: past entries list */}
          <div>
            <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">
              Past Entries ({entries.length})
            </h2>
            {loading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : entries.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-5 text-center">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-sm text-gray-500">No entries yet — write your first one!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {entries.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedDate(e.entry_date)}
                    className={`w-full text-left rounded-xl px-4 py-3 border-2 transition-all ${
                      selectedDate === e.entry_date
                        ? "border-[#6EA76E] bg-[#A8C67A]/10"
                        : "border-white/60 bg-white/80 hover:border-[#A8C67A] hover:bg-white"
                    }`}
                  >
                    <p className="text-xs font-extrabold text-gray-500">
                      {format(parseISO(e.entry_date), "EEE, d MMM yyyy")}
                      {e.entry_date === format(new Date(), "yyyy-MM-dd") && (
                        <span className="ml-2 text-[#6EA76E]">Today</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2 font-medium">{e.content}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
