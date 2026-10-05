"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import {
  getAllEntries,
  getFeedback,
  createFeedback,
  deleteFeedback,
  getChildren,
  getReviewedEntryIds,
  markEntryReviewed,
  markEntryUnreviewed,
  getOakQuizResults,
  refreshOakQuizResults,
} from "@/lib/api";
import { PlannerEntry, WorkFeedback, Child, OakQuizResult } from "@/types";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { format, parseISO } from "date-fns";
import Emoji from "@/components/Emoji";

const EMOJIS = ["👏", "⭐", "🔥", "💪", "🎉", "👍", "🌟", "🏆"];
const PAGE_SIZE = 20;

const subjectColor = (subj: string) => {
  const colors: Record<string, string> = {
    Maths: "bg-brand-tint text-brand-sage",
    English: "bg-[#F3ECE8] text-[#765D52]",
    Science: "bg-brand-tint text-brand-sage",
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

// A child hands in an Oak lesson by pasting its results link. The quiz scores are read from that link.
const OAK_SHARE_RE = /https?:\/\/(?:www\.)?thenational\.academy\/pupils\/lessons\/[^/?#]+\/results\/[^/?#]+\/share/;
const oakShareUrl = (url?: string | null) => url?.match(OAK_SHARE_RE)?.[0];

const percent = (score: number, total: number) => (total > 0 ? Math.round((score / total) * 100) : 0);
// Green for a strong score, amber for middling, soft red for one worth going over again.
const scoreColor = (score: number, total: number) => {
  const p = percent(score, total);
  return p >= 80 ? "bg-brand-tint text-brand-sage" : p >= 50 ? "bg-[#F8F0DA] text-[#8A6A22]" : "bg-[#FAE4DA] text-[#A85F46]";
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-[#8A7A69]">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-[#2E342F]">{children}</dd>
    </div>
  );
}

export default function ProgressPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [allFeedback, setAllFeedback] = useState<WorkFeedback[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "review" | "submitted" | "complete" | "incomplete">("review");
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [reviewedEntryIds, setReviewedEntryIds] = useState<Set<number>>(new Set());
  const [reviewingEntryId, setReviewingEntryId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [subject, setSubject] = useState("");
  // Which lesson has its details open, and the Oak quiz scores keyed by results link.
  const [detailsOpen, setDetailsOpen] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<Record<string, OakQuizResult>>({});
  const [checkingScores, setCheckingScores] = useState(false);

  const loadQuizResults = () =>
    getOakQuizResults()
      .then(res => setQuizResults(Object.fromEntries((res.data as OakQuizResult[]).map(r => [r.url, r]))))
      .catch(() => {});

  const checkScores = async () => {
    setCheckingScores(true);
    try {
      await refreshOakQuizResults();
      await loadQuizResults();
    } catch {
      // Oak may be slow or down. The scores simply stay as they were.
    } finally {
      setCheckingScores(false);
    }
  };

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
    if (entryId) setDetailsOpen(entryId);
    loadQuizResults();
    Promise.all([getAllEntries(), getFeedback(), getChildren(), getReviewedEntryIds()]).then(([eRes, fRes, cRes, rRes]) => {
      const loadedEntries: PlannerEntry[] = eRes.data;
      const loadedFeedback: WorkFeedback[] = fRes.data;
      const loadedReviewed = new Set<number>((rRes.data.entry_ids ?? []) as number[]);

      setEntries(loadedEntries);
      setAllFeedback(loadedFeedback);
      setChildren(cRes.data);
      setReviewedEntryIds(loadedReviewed);

      if (entryId) {
        const feedbackCount = (id: number) => loadedFeedback.filter(fb => fb.entry_id === id).length;
        const requestedFilter =
          f === "submitted" || f === "complete" || f === "incomplete" || f === "review"
            ? f
            : "review";

        const matching = loadedEntries
          .filter(entry => {
            if (requestedFilter === "review") return !!entry.completed_work_url && feedbackCount(entry.id) === 0 && !loadedReviewed.has(entry.id);
            if (requestedFilter === "submitted") return !!entry.completed_work_url;
            if (requestedFilter === "complete") return entry.is_complete;
            if (requestedFilter === "incomplete") return !entry.is_complete;
            return true;
          })
          .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));

        const index = matching.findIndex(entry => entry.id === entryId);
        if (index >= 0) setPage(Math.floor(index / PAGE_SIZE));
      }

      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (!highlightId || loading) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`entry-${highlightId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [highlightId, loading, page]);

  useEffect(() => {
    setPage(0);
  }, [filter, selectedChildId, subject]);

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

  const handleMarkReviewed = async (entryId: number) => {
    setReviewingEntryId(entryId);
    try {
      await markEntryReviewed(entryId);
      setReviewedEntryIds(prev => new Set(prev).add(entryId));
    } finally {
      setReviewingEntryId(null);
    }
  };

  const handleMarkUnreviewed = async (entryId: number) => {
    setReviewingEntryId(entryId);
    try {
      await markEntryUnreviewed(entryId);
      setReviewedEntryIds(prev => {
        const next = new Set(prev);
        next.delete(entryId);
        return next;
      });
    } finally {
      setReviewingEntryId(null);
    }
  };


  const handleMarkDayReviewed = async (ids: number[]) => {
    for (const id of ids) {
      await markEntryReviewed(id);
      setReviewedEntryIds(prev => new Set(prev).add(id));
    }
  };

  const needsReviewFor = (e: PlannerEntry) =>
    !!e.completed_work_url && getFeedbackForEntry(e.id).length === 0 && !reviewedEntryIds.has(e.id);

  const childEntries = entries
    .filter(e => !selectedChildId || e.assigned_to === null || e.assigned_to === selectedChildId)
    .filter(e => !subject || e.lesson.subject === subject);

  const subjects = Array.from(new Set(entries.map(e => e.lesson.subject))).sort();

  const matches = (e: PlannerEntry, f: typeof filter) => {
    if (f === "review") return needsReviewFor(e);
    if (f === "submitted") return !!e.completed_work_url;
    if (f === "complete") return e.is_complete;
    if (f === "incomplete") return !e.is_complete;
    return true;
  };

  const filtered = childEntries
    .filter(e => matches(e, filter))
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));

  const counts = {
    review: childEntries.filter(e => matches(e, "review")).length,
    submitted: childEntries.filter(e => matches(e, "submitted")).length,
    complete: childEntries.filter(e => matches(e, "complete")).length,
    incomplete: childEntries.filter(e => matches(e, "incomplete")).length,
    all: childEntries.length,
  };
  const feedbackSent = childEntries.filter(e => getFeedbackForEntry(e.id).length > 0).length;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageStart = safePage * PAGE_SIZE;
  const visibleEntries = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // Group the visible lessons by the day they were planned for.
  const days: { date: string; items: PlannerEntry[] }[] = [];
  for (const e of visibleEntries) {
    const last = days[days.length - 1];
    if (last && last.date === e.scheduled_date) last.items.push(e);
    else days.push({ date: e.scheduled_date, items: [e] });
  }

  const childName = (entry: PlannerEntry) =>
    entry.assigned_to ? children.find(c => c.id === entry.assigned_to)?.username ?? "Child" : "All children";

  const stats = [
    { key: "review" as const, label: "Waiting for review", value: counts.review, color: "text-[#B66443]", bg: "bg-[#F6E6DF]" },
    { key: "submitted" as const, label: "Work handed in", value: counts.submitted, color: "text-[#A87A1E]", bg: "bg-[#F3EAD7]" },
    { key: null, label: "Feedback sent", value: feedbackSent, color: "text-brand-sage", bg: "bg-[#E3E7D9]" },
    { key: "complete" as const, label: "Lessons completed", value: counts.complete, color: "text-[#2E342F]", bg: "bg-[#E3EAF0]" },
  ];

  const selectCls =
    "rounded-xl border border-brand-line bg-brand-white px-3 py-2 text-sm font-semibold text-[#2E342F] focus:outline-none focus:border-brand-softsage cursor-pointer";

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <PageHero art="review" tint={3}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage mb-2">Progress</p>
          <h1 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Review & Feedback</h1>
          <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
            Look over work your children have handed in, then leave a note or tick it off as checked.
          </p>
        </PageHero>

        {/* Headline numbers. Tapping one shows those lessons. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {stats.map(s => {
            const active = s.key !== null && filter === s.key;
            return (
              <button
                key={s.label}
                onClick={() => s.key && setFilter(s.key)}
                disabled={!s.key}
                className={`rounded-2xl ${s.bg} p-4 text-left transition disabled:cursor-default ${s.key ? "hover:brightness-[0.98]" : ""} ${
                  active ? "ring-2 ring-brand-sage" : ""
                }`}
              >
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs font-semibold text-[#6E5A46] mt-1">{s.label}</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="brand-card p-3 sm:p-4 mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              ["review", "Needs review"],
              ["submitted", "Handed in"],
              ["complete", "Completed"],
              ["incomplete", "Not done yet"],
              ["all", "All lessons"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  filter === value
                    ? "bg-brand-sage border-brand-sage text-white"
                    : "bg-brand-white border-brand-line text-[#6E5A46] hover:border-brand-softsage"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${filter === value ? "text-white/80" : "text-[#A8998A]"}`}>{counts[value]}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {children.length > 1 && (
              <select
                value={selectedChildId ?? ""}
                onChange={e => setSelectedChildId(e.target.value ? Number(e.target.value) : null)}
                className={selectCls}
                aria-label="Child"
              >
                <option value="">All children</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
              </select>
            )}
            {subjects.length > 1 && (
              <select value={subject} onChange={e => setSubject(e.target.value)} className={selectCls} aria-label="Subject">
                <option value="">All subjects</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="brand-card p-12 text-center text-[#8A7A69]">Loading review inbox…</div>
        ) : filtered.length === 0 ? (
          <div className="brand-card p-10 text-center">
            <p className="text-3xl"><Emoji e={filter === "review" ? "🎉" : "🔍"} className="mx-auto h-14 w-14" /></p>
            <h2 className="text-xl font-bold text-[#2E342F] mt-2">
              {filter === "review" ? "All caught up" : "No lessons found"}
            </h2>
            <p className="text-sm text-[#6E5A46] mt-2">
              {filter === "review"
                ? "When your children hand in work, it will appear here for you to look over."
                : "Try a different filter to see more lessons."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map(day => {
              const toReview = day.items.filter(needsReviewFor).map(e => e.id);
              return (
                <section key={day.date}>
                  <div className="flex items-center justify-between gap-3 mb-2 px-1">
                    <h2 className="text-sm font-extrabold text-[#2E342F]">
                      {format(parseISO(day.date), "EEEE d MMMM")}
                      <span className="ml-2 font-semibold text-[#8A7A69]">
                        {day.items.length} lesson{day.items.length === 1 ? "" : "s"}
                      </span>
                    </h2>
                    {toReview.length > 1 && (
                      <button
                        onClick={() => handleMarkDayReviewed(toReview)}
                        className="text-xs font-bold text-brand-sage hover:underline"
                      >
                        ✓ Mark all {toReview.length} reviewed
                      </button>
                    )}
                  </div>

                  <div className="brand-card divide-y divide-brand-line overflow-hidden">
                    {day.items.map(entry => {
                      const entryFeedback = getFeedbackForEntry(entry.id);
                      const isOpen = feedbackOpen === entry.id;
                      const isReviewed = reviewedEntryIds.has(entry.id);
                      const needsReview = needsReviewFor(entry);
                      const shareUrl = oakShareUrl(entry.completed_work_url);
                      const quiz = shareUrl ? quizResults[shareUrl] : undefined;
                      const hasStarter = quiz?.starter_score != null && quiz.starter_total != null;
                      const hasExit = quiz?.exit_score != null && quiz.exit_total != null;
                      const showDetails = detailsOpen === entry.id;

                      return (
                        <div
                          key={entry.id}
                          id={`entry-${entry.id}`}
                          className={`p-4 sm:px-5 ${needsReview ? "bg-[#FFFBF8]" : ""} ${
                            highlightId === entry.id ? "ring-2 ring-inset ring-brand-softsage" : ""
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${subjectColor(entry.lesson.subject)}`}>
                                  {entry.lesson.subject}
                                </span>
                                {children.length > 1 && (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0ECE6] text-[#6E6256] font-semibold">
                                    {childName(entry)}
                                  </span>
                                )}
                                {needsReview ? (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAE4DA] text-[#A85F46] font-bold">Needs review</span>
                                ) : entryFeedback.length > 0 ? (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-tint text-brand-sage font-bold">Feedback sent</span>
                                ) : isReviewed ? (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-tint text-brand-sage font-bold">Reviewed</span>
                                ) : entry.is_complete ? (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-tint text-brand-sage font-bold">Completed</span>
                                ) : (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0ECE6] text-[#8A7A69] font-semibold">Not done yet</span>
                                )}
                              </div>
                              <h3 className="mt-1.5 font-bold text-[#2E342F] leading-snug">
                                <button
                                  type="button"
                                  onClick={() => setDetailsOpen(showDetails ? null : entry.id)}
                                  aria-expanded={showDetails}
                                  aria-controls={`details-${entry.id}`}
                                  title={showDetails ? "Hide the details" : "See scores, notes and details"}
                                  className="group inline-flex items-start gap-1.5 text-left hover:text-brand-sage"
                                >
                                  <span className="group-hover:underline">{entry.lesson.title}</span>
                                  <span aria-hidden className={`mt-0.5 shrink-0 text-xs text-brand-softsage transition-transform ${showDetails ? "rotate-180" : ""}`}>▾</span>
                                </button>
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                {hasExit && (
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor(quiz!.exit_score!, quiz!.exit_total!)}`}>
                                    Exit quiz {quiz!.exit_score}/{quiz!.exit_total}
                                  </span>
                                )}
                                {entry.completed_work_url && (
                                  <a href={entry.completed_work_url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#B07F1F] hover:underline">
                                    <Emoji e="📎" /> Their work
                                  </a>
                                )}
                                {entry.lesson.lesson_url && (
                                  <a href={entry.lesson.lesson_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-sage hover:underline">
                                    Lesson
                                  </a>
                                )}
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-2">
                              {!isOpen && (
                                <button
                                  onClick={() => {
                                    setFeedbackOpen(entry.id);
                                    setFeedbackMsg("");
                                    setFeedbackEmoji("⭐");
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark"
                                >
                                  {entryFeedback.length > 0 ? "Add feedback" : "Leave feedback"}
                                </button>
                              )}
                              {entry.completed_work_url && entryFeedback.length === 0 && (
                                isReviewed ? (
                                  <button
                                    onClick={() => handleMarkUnreviewed(entry.id)}
                                    disabled={reviewingEntryId === entry.id}
                                    className="px-3.5 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-[#6E5A46] text-sm font-bold hover:border-brand-softsage disabled:opacity-50"
                                  >
                                    {reviewingEntryId === entry.id ? "Saving…" : "Undo reviewed"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleMarkReviewed(entry.id)}
                                    disabled={reviewingEntryId === entry.id}
                                    className="px-3.5 py-2 rounded-xl border border-brand-softsage bg-brand-tint text-brand-sage text-sm font-bold hover:bg-brand-mist disabled:opacity-50"
                                    title="Mark as looked at, with no feedback needed"
                                  >
                                    {reviewingEntryId === entry.id ? "Saving…" : "✓ Reviewed"}
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          {showDetails && (
                            <div id={`details-${entry.id}`} className="mt-3 rounded-2xl border border-brand-line bg-brand-cream p-4">
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                                <Fact label="Planned for">{format(parseISO(entry.scheduled_date), "EEE d MMM yyyy")}</Fact>
                                <Fact label="Finished">
                                  {entry.completed_at ? format(parseISO(entry.completed_at), "EEE d MMM, HH:mm") : entry.is_complete ? "Yes" : "Not done yet"}
                                </Fact>
                                <Fact label="Who">{childName(entry)}</Fact>
                                <Fact label="Kind">
                                  {entry.is_extra ? "Extra work" : "Planned lesson"}
                                  {entry.lesson.duration_minutes ? `, ${entry.lesson.duration_minutes} min` : ""}
                                </Fact>
                              </dl>

                              <div className="mt-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7A69]">Quiz scores</p>
                                {hasStarter || hasExit ? (
                                  <div className="mt-1.5 flex flex-wrap gap-2">
                                    {hasStarter && (
                                      <span className={`rounded-xl px-3 py-1.5 text-sm font-bold ${scoreColor(quiz!.starter_score!, quiz!.starter_total!)}`}>
                                        Starter quiz: {quiz!.starter_score} out of {quiz!.starter_total} ({percent(quiz!.starter_score!, quiz!.starter_total!)}%)
                                      </span>
                                    )}
                                    {hasExit && (
                                      <span className={`rounded-xl px-3 py-1.5 text-sm font-bold ${scoreColor(quiz!.exit_score!, quiz!.exit_total!)}`}>
                                        Exit quiz: {quiz!.exit_score} out of {quiz!.exit_total} ({percent(quiz!.exit_score!, quiz!.exit_total!)}%)
                                      </span>
                                    )}
                                  </div>
                                ) : shareUrl ? (
                                  <p className="mt-1 text-sm text-[#6E5A46]">
                                    The scores haven&apos;t been collected from Oak yet.{" "}
                                    <button onClick={checkScores} disabled={checkingScores} className="font-bold text-brand-sage underline disabled:opacity-50">
                                      {checkingScores ? "Checking..." : "Check now"}
                                    </button>
                                  </p>
                                ) : (
                                  <p className="mt-1 text-sm text-[#6E5A46]">
                                    {entry.completed_work_url
                                      ? "No quiz scores for this one. Scores appear when the work handed in is an Oak results link."
                                      : "No quiz scores, because no work has been handed in for this lesson."}
                                  </p>
                                )}
                              </div>

                              {(entry.lesson.objectives || entry.lesson.description) && (
                                <div className="mt-4">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7A69]">About the lesson</p>
                                  <p className="mt-1 whitespace-pre-line text-sm text-[#4A3B2C]">
                                    {(entry.lesson.objectives || entry.lesson.description || "").slice(0, 600)}
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                                {entry.completed_work_url && (
                                  <a href={entry.completed_work_url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#E3CF9E] bg-[#FBF4E2] px-3 py-1.5 font-bold text-[#8A6A22] hover:bg-[#F8EDD0]">
                                    <Emoji e="📎" /> Open their work
                                  </a>
                                )}
                                {entry.lesson.lesson_url && (
                                  <a href={entry.lesson.lesson_url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#D8D1C4] bg-brand-white px-3 py-1.5 font-bold text-brand-sage hover:border-brand-softsage">
                                    Open the lesson
                                  </a>
                                )}
                              </div>
                              {!entry.completed_note && entryFeedback.length === 0 && (
                                <p className="mt-3 text-xs text-[#8A7A69]">No note from your child and no feedback from you yet.</p>
                              )}
                            </div>
                          )}

                          {entry.completed_note && (
                            <p className="mt-3 rounded-xl bg-brand-cream border border-brand-line px-3 py-2 text-sm text-[#6E5A46]">
                              <span className="font-bold text-brand-softsage">Their note: </span>
                              {entry.completed_note}
                            </p>
                          )}

                          {entryFeedback.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                              {entryFeedback.map(fb => (
                                <div key={fb.id} className="flex items-start gap-2 rounded-xl bg-[#F4F6EF] px-3 py-2">
                                  {fb.emoji && <span className="shrink-0">{fb.emoji}</span>}
                                  <p className="min-w-0 flex-1 text-sm text-[#2E342F]">
                                    {fb.message}
                                    <span className="ml-2 text-xs text-[#8A7A69]">{format(parseISO(fb.created_at), "d MMM")}</span>
                                  </p>
                                  <button
                                    onClick={() => handleDeleteFeedback(fb.id)}
                                    className="text-[#C4BBB0] hover:text-[#A85F46] leading-none shrink-0"
                                    aria-label="Delete feedback"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {isOpen && (
                            <div className="mt-3 rounded-2xl bg-brand-cream border border-brand-line p-3 sm:p-4">
                              <div className="flex flex-wrap gap-1">
                                {EMOJIS.map(e => (
                                  <button
                                    key={e}
                                    onClick={() => setFeedbackEmoji(e)}
                                    className={`text-lg rounded-lg p-1.5 transition-all ${
                                      feedbackEmoji === e ? "bg-brand-tint ring-1 ring-brand-softsage" : "hover:bg-[#EEE6D9]"
                                    }`}
                                  >
                                    {e}
                                  </button>
                                ))}
                              </div>
                              <textarea
                                rows={3}
                                value={feedbackMsg}
                                onChange={e => setFeedbackMsg(e.target.value)}
                                placeholder="What went well? What should they try next?"
                                autoFocus
                                className="w-full mt-2 text-sm border border-[#D8D1C4] bg-brand-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-softsage resize-none"
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleSendFeedback(entry.id)}
                                  disabled={sendingFeedback || !feedbackMsg.trim()}
                                  className="px-4 py-2 rounded-xl bg-brand-sage text-white text-sm font-bold hover:bg-brand-sagedark disabled:opacity-50"
                                >
                                  {sendingFeedback ? "Sending…" : "Send feedback"}
                                </button>
                                <button
                                  onClick={() => setFeedbackOpen(null)}
                                  className="px-4 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-[#6E5A46] text-sm font-bold hover:border-brand-softsage"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > PAGE_SIZE && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
            <p className="text-sm text-[#6E5A46]">
              Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={safePage === 0}
                className="px-4 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage text-sm font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-[#8A7A69] px-2">
                Page {safePage + 1} of {pageCount}
              </span>
              <button
                onClick={() => { setPage(p => Math.min(pageCount - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={safePage >= pageCount - 1}
                className="px-4 py-2 rounded-xl border border-[#D8D1C4] bg-brand-white text-brand-sage text-sm font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
