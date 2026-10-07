"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import WorksheetPicture from "@/components/worksheets/WorksheetPicture";
import { NewBadge } from "@/components/NewEveryMonth";
import { getMySheets, type SheetProgress } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { isNew } from "@/lib/newContent";
import { WORKSHEETS } from "@/lib/worksheets";

/** The worksheet shelf: every Bright Roots worksheet, with how far this child has got on each. */
export default function WorksheetsPage() {
  const router = useRouter();
  const [mine, setMine] = useState<Record<string, SheetProgress>>({});
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    if (getRole() !== "child") return;
    getMySheets()
      .then((res) => setMine(Object.fromEntries(res.data.filter((s) => s.kind === "worksheet").map((s) => [s.slug, s]))))
      .catch(() => {});
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="worksheets" tint={0}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Saplings · ages 5 to 10</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Worksheets</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            Short maths sheets to fill in on screen or print out. Each one is marked for you, and you can try again as often as you like.
          </p>
        </PageHero>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSHEETS.map((sheet) => {
            const progress = mine[sheet.slug];
            const done = progress?.score != null && progress.total != null;
            return (
              <Link
                key={sheet.slug}
                href={`/worksheets/${sheet.slug}`}
                className="group overflow-hidden rounded-2xl border border-brand-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative">
                  <WorksheetPicture sheet={sheet} className="h-36 w-full" />
                  {isNew(sheet.slug) && <NewBadge className="absolute right-2 top-2" />}
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: sheet.color }}>
                    {sheet.subject} · ages {sheet.ages}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold leading-tight text-brand-charcoal">{sheet.title}</h2>
                  <p className="mt-0.5 text-sm text-brand-earth/80">{sheet.topic}</p>
                  <p className="mt-3 text-sm font-bold">
                    {done ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
                        Best score: {progress.score} out of {progress.total}
                      </span>
                    ) : progress?.in_progress ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">Started. Carry on?</span>
                    ) : (
                      <span className="text-brand-sage group-hover:underline">{sheet.questions.length} questions →</span>
                    )}
                    {done && progress.in_progress && <span className="ml-2 text-xs font-semibold text-amber-800">Trying again</span>}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
