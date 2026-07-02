"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getAllEntries, getFeedback, createFeedback, deleteFeedback, getChildren } from "@/lib/api";
import { PlannerEntry, WorkFeedback, Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO } from "date-fns";

const EMOJIS = ["👏", "⭐", "🔥", "💪", "🎉", "👍", "🌟", "🏆"];

const subjectColor = (subj: string) => {
  const colors: Record<string, string> = {
    Maths: "bg-blue-100 text-blue-800", English: "bg-purple-100 text-purple-800",
    Science: "bg-green-100 text-green-800", History: "bg-yellow-100 text-yellow-800",
    Geography: "bg-cyan-100 text-cyan-800", Computing: "bg-indigo-100 text-indigo-800",
    Cooking: "bg-orange-100 text-orange-800", "Art & Design": "bg-pink-100 text-pink-800",
    "Design and Technology": "bg-red-100 text-red-800", "Life Skills": "bg-teal-100 text-teal-800",
  };
  return colors[subj] || "bg-gray-100 text-gray-800";
};

export default function ProgressPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [allFeedback, setAllFeedback] = useState<WorkFeedback[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "submitted" | "complete" | "incomplete">("all");
  const [highlightId, setHighlightId] = useState<number | null>(null);

  // Feedback form state
  const [feedbackOpen, setFeedbackOpen] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackEmoji, setFeedbackEmoji] = useState("⭐");
  const [sendingFeedback, setSendingFeedback] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    // Deep link support: /parent/progress?filter=submitted&entry=123 (from the notification bell)
    const params = new URLSearchParams(window.location.search);
    const f = params.get("filter");
    if (f === "submitted" || f === "complete" || f === "incomplete") setFilter(f);
    const entryParam = params.get("entry");
    const entryId = entryParam ? Number(entryParam) : null;
    if (entryId) setHighlightId(entryId);
    Promise.all([getAllEntries(), getFeedback(), getChildren()]).then(([eRes, fRes, cRes]) => {
      setEntries(eRes.data);
      setAllFeedback(fRes.data);
      setChildren(cRes.data);
      setLoading(false);
      if (entryId) {
        setTimeout(() => {
          document.getElementById(`entry-${entryId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    });
  }, [router]);

  const getFeedbackForEntry = (entryId: number) =>
    allFeedback.filter(f => f.entry_id === entryId);

  const handleSendFeedback = async (entryId: number) => {
    if (!feedbackMsg.trim()) return;
    setSendingFeedback(true);
    try {
      const res = await createFeedback({ entry_id: entryId, message: feedbackMsg.trim(), emoji: feedbackEmoji });
      setAllFeedback(prev => [res.data, ...prev]);
      setFeedbackMsg("");
      setFeedbackOpen(null);
    } finally { setSendingFeedback(false); }
  };

  const handleDeleteFeedback = async (id: number) => {
    await deleteFeedback(id);
    setAllFeedback(prev => prev.filter(f => f.id !== id));
  };

  const childEntries = selectedChildId
    ? entries.filter(e => e.assigned_to === null || e.assigned_to === selectedChildId)
    : entries;

  const filtered = childEntries.filter((e) => {
    if (filter === "submitted") return !!e.completed_work_url;
    if (filter === "complete") return e.is_complete;
    if (filter === "incomplete") return !e.is_complete;
    return true;
  });

  const totalComplete = childEntries.filter((e) => e.is_complete).length;
  const totalSubmitted = childEntries.filter((e) => e.completed_work_url).length;
  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {selectedChild ? `${selectedChild.username} — Review & Feedback` : "Review & Feedback"}
            </h1>
            <p className="text-gray-500 mt-1">All lessons, submitted work, and your feedback</p>
          </div>
          {children.length > 0 && (
            <div className="flex items-center gap-2 bg-white/80 border border-white/60 rounded-xl px-3 py-1.5 shadow-sm">
              <span className="text-xs font-bold text-gray-500">Viewing:</span>
              <select
                value={selectedChildId ?? ""}
                onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">All children</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-[#2F5D3A]">{entries.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Lessons</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{totalComplete}</p>
            <p className="text-sm text-gray-500 mt-1">Completed</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalSubmitted}</p>
            <p className="text-sm text-gray-500 mt-1">Work Submitted</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "submitted", "complete", "incomplete"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all capitalize ${
                filter === f
                  ? "bg-[#2F5D3A] text-white shadow-md"
                  : "bg-white/80 backdrop-blur-sm border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"
              }`}>
              {f === "submitted" ? "Work Submitted" : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-10 text-center">
            <p className="text-gray-400">No entries found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => {
              const entryFeedback = getFeedbackForEntry(entry.id);
              const isOpen = feedbackOpen === entry.id;
              return (
                <div key={entry.id} id={`entry-${entry.id}`}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl border shadow-sm p-5 transition-all ${
                    highlightId === entry.id ? "border-[#6EA76E] ring-2 ring-[#A8C67A]/50" : "border-white/60"
                  }`}>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className={`mt-1 w-5 h-5 rounded-full shrink-0 flex items-center justify-center ${entry.is_complete ? "bg-green-500" : "bg-gray-200"}`}>
                      {entry.is_complete && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColor(entry.lesson.subject)}`}>{entry.lesson.subject}</span>
                        <span className="text-xs text-gray-400">{format(parseISO(entry.scheduled_date), "EEE d MMM yyyy")}</span>
                        {entry.is_complete && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Completed</span>}
                      </div>
                      <p className="font-semibold text-gray-900">{entry.lesson.title}</p>

                      {entry.lesson.lesson_url && (
                        <a href={entry.lesson.lesson_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[#6EA76E] hover:underline mt-1 block">🔗 Lesson link</a>
                      )}

                      {/* Child's note */}
                      {entry.completed_note && (
                        <div className="mt-2 p-2.5 bg-[#F7F9F7] rounded-xl border border-[#A8C67A]/30">
                          <p className="text-xs font-bold text-[#2F5D3A] mb-0.5">
                            📝 {entry.assigned_to ? (children.find(c => c.id === entry.assigned_to)?.username ?? "Child") : "Note"}:
                          </p>
                          <p className="text-sm text-gray-700">{entry.completed_note}</p>
                        </div>
                      )}

                      {/* Submitted work */}
                      {entry.completed_work_url ? (
                        <div className="mt-2 p-2.5 bg-green-50 rounded-xl border border-green-100">
                          <p className="text-xs font-bold text-green-700 mb-0.5">📎 Submitted work:</p>
                          <a href={entry.completed_work_url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-green-800 hover:underline font-medium break-all">{entry.completed_work_url}</a>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">No work submitted yet</p>
                      )}

                      {/* Existing feedback */}
                      {entryFeedback.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {entryFeedback.map(fb => (
                            <div key={fb.id} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                              {fb.emoji && <span className="text-lg shrink-0">{fb.emoji}</span>}
                              <p className="text-sm text-amber-800 flex-1 font-medium">{fb.message}</p>
                              <button onClick={() => handleDeleteFeedback(fb.id)}
                                className="text-amber-300 hover:text-red-400 text-xs font-bold shrink-0 transition-colors">×</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Feedback form */}
                      {isOpen ? (
                        <div className="mt-3 bg-[#F7F9F7] border border-[#A8C67A]/30 rounded-xl p-3">
                          <div className="flex gap-1.5 mb-2 flex-wrap">
                            {EMOJIS.map(e => (
                              <button key={e} onClick={() => setFeedbackEmoji(e)}
                                className={`text-xl rounded-lg p-1 transition-all ${feedbackEmoji === e ? "bg-[#A8C67A]/40 scale-110" : "hover:bg-[#A8C67A]/20"}`}>
                                {e}
                              </button>
                            ))}
                          </div>
                          <textarea rows={2} value={feedbackMsg} onChange={e => setFeedbackMsg(e.target.value)}
                            placeholder="Great work on this lesson! Next time try…"
                            autoFocus
                            className="w-full text-sm border-2 border-[#A8C67A]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6EA76E] font-medium resize-none bg-white" />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleSendFeedback(entry.id)}
                              disabled={sendingFeedback || !feedbackMsg.trim()}
                              className="gradient-btn text-xs px-4 py-1.5 disabled:opacity-50">
                              {sendingFeedback ? "Sending…" : "Send Feedback"}
                            </button>
                            <button onClick={() => setFeedbackOpen(null)}
                              className="text-xs px-3 py-1.5 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setFeedbackOpen(entry.id); setFeedbackMsg(""); setFeedbackEmoji("⭐"); }}
                          className="mt-2 text-xs text-[#6EA76E] hover:text-[#2F5D3A] font-bold hover:bg-[#F7F9F7] px-3 py-1 rounded-lg transition-colors border border-[#A8C67A]/30">
                          {entryFeedback.length > 0 ? "💬 Add another" : "💬 Leave feedback"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
