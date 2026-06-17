"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getTodayEntries, toggleComplete } from "@/lib/api";
import { PlannerEntry } from "@/types";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = Number(params.entryId);

  const [entry, setEntry] = useState<PlannerEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

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

  const oakUrl = entry.lesson.lesson_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <button onClick={() => router.push("/child")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          ← Back to today&apos;s lessons
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                  {entry.lesson.subject}
                </span>
                {oakUrl && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    🔗 Has Link
                  </span>
                )}
                <span className="text-xs text-gray-400">{format(new Date(), "EEEE, d MMMM")}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{entry.lesson.title}</h1>
            </div>
            <button
              onClick={handleToggle}
              disabled={completing}
              className={`shrink-0 px-5 py-2 rounded-xl font-medium text-sm transition-colors ${entry.is_complete ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
            >
              {completing ? "…" : entry.is_complete ? "✓ Completed" : "Mark Done"}
            </button>
          </div>

          {entry.lesson.description && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">From Max</p>
              <p className="text-sm text-amber-900">{entry.lesson.description}</p>
            </div>
          )}
        </div>

        {/* Oak Academy content */}
        {oakUrl ? (
          <div className="space-y-4">
            <a
              href={oakUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-6 transition-colors shadow-sm"
            >
              <span className="text-4xl">▶️</span>
              <div>
                <p className="font-bold text-lg">Open Lesson</p>
                <p className="text-indigo-200 text-sm">Click to open the lesson link</p>
              </div>
              <span className="ml-auto text-2xl">→</span>
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-gray-500">This is a custom lesson from Max.</p>
            {entry.lesson.description && (
              <p className="text-sm text-gray-400 mt-2">Check the notes above for instructions.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
