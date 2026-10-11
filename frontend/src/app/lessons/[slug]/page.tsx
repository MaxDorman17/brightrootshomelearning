"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BrightRootsLesson from "@/components/BrightRootsLesson";
import { getRole, isAuthenticated } from "@/lib/auth";
import { lessonBySlug, plannerTitle } from "@/lib/lessons";

/** One Bright Roots lesson. A grown-up opens it from the planner or the lessons page to look through it; a child can do it here too. */
export default function LessonPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const found = lessonBySlug(slug);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);

  if (!found) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <p className="text-brand-earth">We couldn&apos;t find that lesson.</p>
          <Link href="/lessons" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to Bright Roots Lessons
          </Link>
        </main>
      </div>
    );
  }

  const { unit, lesson, number } = found;
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href={role === "child" ? "/child" : `/lessons#${unit.slug}`} className="mb-6 inline-block text-sm text-brand-earth hover:text-brand-sage">
          ← {role === "child" ? "Back to today's lessons" : `Back to ${unit.title}`}
        </Link>
        <div className="mb-6 rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-lime/20 px-2 py-0.5 text-xs font-medium text-brand-deep">{unit.subject}</span>
            <span className="rounded-full bg-brand-mist px-2 py-0.5 text-xs font-medium text-brand-deep">Bright Roots lesson</span>
            <span className="text-xs text-brand-earth/70">
              Lesson {number} of {unit.lessons.length} · about {lesson.minutes} minutes
            </span>
          </div>
          <h1 className="text-xl font-bold text-brand-charcoal">{plannerTitle(unit, number)}</h1>
        </div>
        {role && <BrightRootsLesson unit={unit} lesson={lesson} number={number} isChild={role === "child"} />}
      </main>
    </div>
  );
}
