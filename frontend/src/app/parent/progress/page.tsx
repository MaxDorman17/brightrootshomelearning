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
    Maths: "bg-[#EAF0E7] text-[#3F5D46]",
    English: "bg-[#F3ECE8] text-[#765D52]",
    Science: "bg-[#E8F0E8] text-[#3F5D46]",
    History: "bg-[#F8F0DA] text-[#8A6A22]",
    Geography: "bg-[#EAF2EC] text-[#48654E]",
    Computing: "bg-[#ECECF5] text-[#5C607D]",
    Cooking: "bg-[#F7EDE5] text-[#8A624B]",
    "Art & Design": "bg-[#F7E9ED] text-[#8B5968]",
    "Design and Technology": "bg-[#F4E9E6] text-[#8A5A52]",
    "Life Skills": "bg-[#E7F0ED] text-[#4F6E64]",
  };
  return colors[subj] || "bg-[#F0ECE6] text-[#6E6256]";
};

export default function ProgressPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [allFeedback, setAllFeedback] = useState<WorkFeedback[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "review" | "submitted" | "complete" | "incomplete">("review");
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
    if (f === "submitted" || f === "complete" || f === "incomplete" || f === "review") setFilter(f);
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

  const awaitingReview = childEntries.filter(
    e => !!e.completed_work_url && getFeedbackForEntry(e.id).length === 0
  );

  const filtered = childEntries
    .filter((e) => {
      if (filter === "review") return !!e.completed_work_url && getFeedbackForEntry(e.id).length === 0;
      if (filter === "submitted") return !!e.completed_work_url;
      if (filter === "complete") return e.is_complete;
      if (filter === "incomplete") return !e.is_complete;
      return true;
    })
    .sort((a, b) => {
      const aNeedsReview = !!a.completed_work_url && getFeedbackForEntry(a.id).length === 0;
      const bNeedsReview = !!b.completed_work_url && getFeedbackForEntry(b.id).length === 0;
      if (aNeedsReview !== bNeedsReview) return aNeedsReview ? -1 : 1;
      return b.scheduled_date.localeCompare(a.scheduled_date);
    });

  const totalComplete = childEntries.filter((e) => e.is_complete).length;
  const totalSubmitted = childEntries.filter((e) => e.completed_work_url).length;
  const feedbackSent = childEntries.filter((e) => getFeedbackForEntry(e.id).length > 0).length;
  const selectedChild = children.find(c => c.id === selectedChildId);

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
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">
                Review & Feedback
              </h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Review submitted work, read lesson notes and send feedback in one place.
              </p>
            </div>

            {children.length > 0 && (
              <div className="brand-card px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Viewing</span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                  className="text-sm font-semibold text-[#2E342F] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All children</option>
                  {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#B66443]">{awaitingReview.length}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Awaiting review</p>
          </div>
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#D19A32]">{totalSubmitted}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Work submitted</p>
          </div>
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#3F5D46]">{feedbackSent}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Feedback sent</p>
          </div>
          <div className="brand-card p-4">
            <p className="text-2xl font-bold text-[#2E342F]">{totalComplete}</p>
            <p className="text-xs font-semibold text-[#6E5A46] mt-1">Lessons completed</p>
          </div>
        </div>

        <div className="brand-card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {([
              ["review", "Needs review"],
              ["submitted", "Submitted work"],
              ["complete", "Completed"],
              ["incomplete", "Incomplete"],
              ["all", "All lessons"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  filter === value
                    ? "bg-[#3F5D46] border-[#3F5D46] text-white"
                    : "bg-[#FFFDF8] border-[#E7DFD1] text-[#6E5A46] hover:border-[#8FA382]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading review inbox…</div>
        ) : filtered.length === 0 ? (
          <div className="brand-card p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Review Inbox</p>
            <h2 className="text-xl font-bold text-[#2E342F] mt-2">
              {filter === "review" ? "Nothing waiting for review" : "No lessons found"}
            </h2>
            <p className="text-sm text-[#6E5A46] mt-2">
              {filter === "review"
                ? "Submitted work that needs feedback will appear here."
                : "Try a different filter to view more lessons."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((entry) => {
              const entryFeedback = getFeedbackForEntry(entry.id);
              const isOpen = feedbackOpen === entry.id;
              const needsReview = !!entry.completed_work_url && entryFeedback.length === 0;
              const childName = entry.assigned_to
                ? children.find(c => c.id === entry.assigned_to)?.username ?? "Child"
                : "All children";

              return (
                <div
                  key={entry.id}
                  id={`entry-${entry.id}`}
                  className={`brand-card p-6 transition-all ${
                    highlightId === entry.id ? "ring-2 ring-[#8FA382]" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${subjectColor(entry.lesson.subject)}`}>
                          {entry.lesson.subject}
                        </span>

                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0ECE6] text-[#6E6256] font-semibold">
                          {childName}
                        </span>

                        <span className="text-xs text-[#8A7A69]">
                          {format(parseISO(entry.scheduled_date), "EEE d MMM yyyy")}
                        </span>

                        {needsReview && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAE4DA] text-[#A85F46] font-bold">
                            Needs review
                          </span>
                        )}

                        {entry.is_complete && !needsReview && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8F0E8] text-[#3F5D46] font-bold">
                            Completed
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-[#2E342F]">{entry.lesson.title}</h2>

                      <div className="flex flex-wrap gap-3 mt-3">
                        {entry.lesson.lesson_url && (
                          <a
                            href={entry.lesson.lesson_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-[#3F5D46] hover:underline"
                          >
                            Open lesson
                          </a>
                        )}

                        {entry.completed_work_url && (
                          <a
                            href={entry.completed_work_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-[#D19A32] hover:underline"
                          >
                            Open submitted work
                          </a>
                        )}
                      </div>

                      {entry.completed_note && (
                        <div className="rounded-xl bg-[#F7F2E8] border border-[#E7DFD1] p-4 mt-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                            Child note
                          </p>
                          <p className="text-sm text-[#6E5A46] mt-1 leading-relaxed">
                            {entry.completed_note}
                          </p>
                        </div>
                      )}

                      {!entry.completed_work_url && (
                        <div className="rounded-xl border border-dashed border-[#DDD3C4] bg-[#FBF8F1] p-4 mt-4">
                          <p className="text-sm text-[#8A7A69]">No submitted work attached yet.</p>
                        </div>
                      )}

                      {entryFeedback.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382] mb-2">
                            Feedback history
                          </p>

                          <div className="space-y-2">
                            {entryFeedback.map(fb => (
                              <div
                                key={fb.id}
                                className="rounded-xl border border-[#E7DFD1] bg-[#FFFDF8] p-3 flex items-start gap-3"
                              >
                                {fb.emoji && (
                                  <span className="text-xl shrink-0">{fb.emoji}</span>
                                )}

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#2E342F]">{fb.message}</p>
                                  <p className="text-xs text-[#8A7A69] mt-1">
                                    {format(parseISO(fb.created_at), "d MMM yyyy")}
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleDeleteFeedback(fb.id)}
                                  className="text-[#C4BBB0] hover:text-[#A85F46] text-lg leading-none shrink-0"
                                  aria-label="Delete feedback"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-80 shrink-0">
                      {isOpen ? (
                        <div className="rounded-2xl bg-[#F7F2E8] border border-[#E7DFD1] p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                            Write feedback
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {EMOJIS.map(e => (
                              <button
                                key={e}
                                onClick={() => setFeedbackEmoji(e)}
                                className={`text-xl rounded-lg p-1.5 transition-all ${
                                  feedbackEmoji === e
                                    ? "bg-[#E8F0E8] ring-1 ring-[#8FA382]"
                                    : "hover:bg-[#EEE6D9]"
                                }`}
                              >
                                {e}
                              </button>
                            ))}
                          </div>

                          <textarea
                            rows={5}
                            value={feedbackMsg}
                            onChange={e => setFeedbackMsg(e.target.value)}
                            placeholder="What went well? What should they try next?"
                            autoFocus
                            className="w-full mt-3 text-sm border border-[#D8D1C4] bg-[#FFFDF8] rounded-xl px-3 py-3 focus:outline-none focus:border-[#8FA382] resize-none"
                          />

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleSendFeedback(entry.id)}
                              disabled={sendingFeedback || !feedbackMsg.trim()}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] disabled:opacity-50"
                            >
                              {sendingFeedback ? "Sending…" : "Send feedback"}
                            </button>

                            <button
                              onClick={() => setFeedbackOpen(null)}
                              className="px-4 py-2.5 rounded-xl border border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] text-sm font-bold hover:border-[#8FA382]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`rounded-2xl border p-4 ${
                          needsReview
                            ? "bg-[#FFF8F4] border-[#E7CFC2]"
                            : "bg-[#F7F2E8] border-[#E7DFD1]"
                        }`}>
                          <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                            Review
                          </p>
                          <h3 className="text-base font-bold text-[#2E342F] mt-1">
                            {needsReview
                              ? "Feedback needed"
                              : entryFeedback.length > 0
                              ? "Feedback sent"
                              : "Ready when you are"}
                          </h3>

                          <p className="text-xs text-[#6E5A46] mt-2">
                            {needsReview
                              ? "Open the submitted work, then leave a short review."
                              : entryFeedback.length > 0
                              ? `${entryFeedback.length} feedback message${entryFeedback.length === 1 ? "" : "s"} sent.`
                              : "You can leave feedback on this lesson at any time."}
                          </p>

                          <button
                            onClick={() => {
                              setFeedbackOpen(entry.id);
                              setFeedbackMsg("");
                              setFeedbackEmoji("⭐");
                            }}
                            className="w-full mt-4 px-4 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B]"
                          >
                            {entryFeedback.length > 0 ? "Add feedback" : "Leave feedback"}
                          </button>
                        </div>
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
