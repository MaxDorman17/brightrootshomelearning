"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getLessonScores, getTodayEntries, toggleComplete } from "@/lib/api";
import { LessonScore, PlannerEntry } from "@/types";
import Navbar from "@/components/Navbar";
import StudyTimer from "@/components/StudyTimer";
import { useMounted } from "@/lib/useMounted";
import { useParentName } from "@/lib/useParentName";
import LessonGuide from "@/components/LessonGuide";
import { format } from "date-fns";
import Emoji from "@/components/Emoji";
import { schemeOf } from "@/lib/schemes";

export default function LessonDetailPage() {
  const parentName = useParentName();
  const router = useRouter();
  const params = useParams();
  const mounted = useMounted();
  const entryId = Number(params.entryId);

  const [entry, setEntry] = useState<PlannerEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [myScore, setMyScore] = useState<LessonScore | null>(null);

  useEffect(() => {
    getLessonScores()
      .then(res => setMyScore((res.data as LessonScore[]).find(s => s.entry_id === entryId) ?? null))
      .catch(() => {});
  }, [entryId]);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "child") { router.replace("/login"); return; }
    (async () => {
      try {
        const res = await getTodayEntries();
        const found = res.data.find((e: PlannerEntry) => e.id === entryId);
        if (!found) { router.replace("/child"); return; }
        setEntry(found);
      } finally {
        setLoading(false);
      }
    })();
  }, [entryId, router]);

  const handleToggle = async () => {
    if (!entry) return;
    setCompleting(true);
    try {
      const res = await toggleComplete(entry.id);
      setEntry(res.data);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex items-center justify-center pt-32 text-gray-400">Loading…</div>
    </div>
  );

  if (!entry) return null;

  const lessonUrl = entry.lesson.lesson_url;
  const scheme = schemeOf(entry.lesson.scheme, lessonUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <button onClick={() => router.push("/child")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-leaf mb-6 transition-colors">
          ← Back to today&apos;s lessons
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-brand-lime/20 text-brand-deep px-2 py-0.5 rounded-full font-medium">
                  {entry.lesson.subject}
                </span>
                {scheme && (
                  <span className="text-xs bg-brand-mist text-brand-deep px-2 py-0.5 rounded-full font-medium">
                    {scheme}
                  </span>
                )}
                {lessonUrl && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    🔗 Has Link
                  </span>
                )}
                {myScore && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Your score: {myScore.score} out of {myScore.total}
                  </span>
                )}
                <span className="text-xs text-gray-400">{mounted ? format(new Date(), "EEEE, d MMMM") : " "}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{entry.lesson.title}</h1>
            </div>
            <button
              onClick={handleToggle}
              disabled={completing}
              className={`shrink-0 px-5 py-2 rounded-xl font-medium text-sm transition-colors ${entry.is_complete ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-brand-deep text-white hover:bg-brand-leaf"}`}
            >
              {completing ? "…" : entry.is_complete ? "✓ Completed" : "Mark Done"}
            </button>
          </div>

          <LessonGuide entryId={entry.id} lesson={entry.lesson} />

          <a
            href={`/child/resources?folder=${encodeURIComponent(entry.lesson.subject)}`}
            className="mb-4 mr-2 inline-flex items-center gap-2 rounded-xl border-2 border-brand-mist bg-white px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-brand-wash"
          >
            📂 Lesson aids for {entry.lesson.subject}
          </a>


          {entry.lesson.description && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">From {parentName}</p>
              <p className="text-sm text-amber-900">{entry.lesson.description}</p>
            </div>
          )}
        </div>

        {/* The lesson itself, on whichever site it comes from */}
        {lessonUrl ? (
          <div className="space-y-4">
            <a
              href={lessonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-brand-deep hover:bg-brand-leaf text-white rounded-2xl p-6 transition-colors shadow-sm"
            >
              <span className="text-4xl">▶️</span>
              <div>
                <p className="font-bold text-lg">Open Lesson</p>
                <p className="text-white/60 text-sm">{scheme ? `Opens on ${scheme}` : "Click to open the lesson link"}</p>
              </div>
              <span className="ml-auto text-2xl">→</span>
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <Emoji e="📚" className="mx-auto mb-3 h-16 w-16" />
            <p className="text-gray-500">This is a custom lesson from {parentName}.</p>
            {entry.lesson.description && (
              <p className="text-sm text-gray-400 mt-2">Check the notes above for instructions.</p>
            )}
          </div>
        )}

        {/* Study timer for this lesson */}
        <section id="timer" className="mt-6 scroll-mt-20">
          <StudyTimer subject={entry.lesson.subject} label={entry.lesson.title} entryId={entry.id} />
        </section>
      </div>
    </div>
  );
}
