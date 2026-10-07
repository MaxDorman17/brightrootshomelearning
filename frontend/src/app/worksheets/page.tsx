"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import PlanSheets from "@/components/worksheets/PlanSheets";
import WorksheetPicture from "@/components/worksheets/WorksheetPicture";
import { NewBadge } from "@/components/NewEveryMonth";
import { getMySheets, type SheetProgress } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { isNew } from "@/lib/newContent";
import { WORKSHEETS, WORKSHEET_SETS, nextUp, type Worksheet, type WorksheetSet } from "@/lib/worksheets";

type Mine = Record<string, SheetProgress>;

const AGES = [...new Set(WORKSHEETS.map((w) => w.ages))].sort();

/**
 * The worksheets. However many there are, a child sees one sheet to do next and the topics tucked
 * away underneath; a grown-up gets the whole library to browse by age, topic or a search.
 */
export default function WorksheetsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [mine, setMine] = useState<Mine>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const who = getRole();
    setRole(who);
    if (who !== "child") {
      setLoaded(true);
      return;
    }
    getMySheets()
      .then((res) => setMine(Object.fromEntries(res.data.filter((s) => s.kind === "worksheet").map((s) => [s.slug, s]))))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <PageHero art="worksheets" tint={0}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Saplings · ages 5 to 10</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Worksheets</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            {role === "child"
              ? "Short sheets to fill in on screen. Each one is marked for you, and you can try again as often as you like."
              : "Short sheets children fill in on screen, or you can print. Each one is marked automatically and the score goes to their Test Results."}
          </p>
        </PageHero>
        {loaded && (role === "child" ? <ForChild mine={mine} /> : <ForGrownUp />)}
      </main>
    </div>
  );
}

const finishedSlugs = (mine: Mine) => new Set(Object.values(mine).filter((s) => s.score != null).map((s) => s.slug));

/** One thing to do next, then the topics, closed until asked for. */
function ForChild({ mine }: { mine: Mine }) {
  const finished = useMemo(() => finishedSlugs(mine), [mine]);
  // A sheet already started comes before a new one.
  const started = WORKSHEETS.filter((w) => mine[w.slug]?.in_progress);
  const upNext = started.length ? started.slice(0, 1) : nextUp(finished);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <>
      <section aria-labelledby="next-up">
        <h2 id="next-up" className="text-sm font-extrabold uppercase tracking-widest text-brand-softsage">
          {started.length ? "Carry on" : "Next up"}
        </h2>
        {upNext.length === 0 ? (
          <p className="mt-2 rounded-3xl border border-brand-line bg-white p-6 text-brand-earth">
            You&apos;ve done every sheet. Well done! Pick any topic below to have another go.
          </p>
        ) : (
          <div className="mt-2 space-y-4">
            {upNext.map((sheet) => (
              <Link
                key={sheet.slug}
                href={`/worksheets/${sheet.slug}`}
                className="group block overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex"
              >
                <WorksheetPicture sheet={sheet} className="h-40 w-full shrink-0 sm:h-auto sm:w-64" />
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: sheet.color }}>
                    {sheet.subject}
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold leading-tight text-brand-charcoal">{sheet.title}</h3>
                  <p className="mt-1 text-brand-earth">{sheet.topic}</p>
                  <span className="mt-4 inline-block rounded-xl bg-brand-sage px-5 py-2.5 text-base font-extrabold text-white group-hover:bg-brand-sagedark">
                    {mine[sheet.slug]?.in_progress ? "Carry on" : "Start"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="topics" className="mt-10">
        <h2 id="topics" className="text-sm font-extrabold uppercase tracking-widest text-brand-softsage">
          All topics
        </h2>
        <div className="mt-2 space-y-3">
          {WORKSHEET_SETS.map((set) => {
            const done = set.sheets.filter((w) => finished.has(w.slug)).length;
            const isOpen = open.has(set.slug);
            return (
              <div key={set.slug} className="rounded-2xl border border-brand-line bg-white">
                <button
                  type="button"
                  onClick={() => toggle(set.slug)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left hover:bg-brand-cream"
                >
                  <span className="w-4 text-brand-sage" aria-hidden>
                    {isOpen ? "▾" : "▸"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-extrabold text-brand-charcoal">{set.title}</span>
                    <span className="block text-sm text-brand-earth/80">{set.summary}</span>
                  </span>
                  {/* Only what's been done, never what's left. */}
                  {done > 0 && <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">{done} done</span>}
                </button>
                {isOpen && (
                  <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                    {set.sheets.map((sheet) => (
                      <SheetCard key={sheet.slug} sheet={sheet} progress={mine[sheet.slug]} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/** The whole library, narrowed by age or a search. */
function ForGrownUp() {
  const [age, setAge] = useState("");
  const [query, setQuery] = useState("");
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (set: WorksheetSet, sheet: Worksheet) =>
    (!age || sheet.ages === age) &&
    words.every((word) => `${sheet.title} ${sheet.topic} ${set.title} ${sheet.subject}`.toLowerCase().includes(word));
  const sets = WORKSHEET_SETS.map((set) => ({ set, sheets: set.sheets.filter((sheet) => matches(set, sheet)) })).filter((s) => s.sheets.length);
  const pill = (on: boolean) =>
    `rounded-full border-2 px-4 py-1.5 text-sm font-bold ${
      on ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-brand-earth hover:border-brand-softsage"
    }`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an age">
          <button type="button" aria-pressed={!age} onClick={() => setAge("")} className={pill(!age)}>
            All ages
          </button>
          {AGES.map((a) => (
            <button key={a} type="button" aria-pressed={age === a} onClick={() => setAge(a)} className={pill(age === a)}>
              Ages {a}
            </button>
          ))}
        </div>
        <label className="ml-auto flex min-w-[12rem] flex-1 items-center sm:max-w-xs">
          <span className="sr-only">Search the worksheets</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, e.g. times tables"
            className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm text-brand-charcoal focus:border-brand-softsage focus:outline-none"
          />
        </label>
      </div>

      {sets.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-brand-line bg-white p-6 text-sm text-brand-earth">
          Nothing matches that yet. Try a different word, or choose All ages.
        </p>
      ) : (
        sets.map(({ set, sheets }) => (
          <section key={set.slug} aria-labelledby={`set-${set.slug}`} className="mt-8">
            <h2 id={`set-${set.slug}`} className="text-xl font-extrabold text-brand-charcoal">
              {set.title}
              <span className="ml-2 text-xs font-bold uppercase tracking-widest text-brand-softsage">{set.subject}</span>
            </h2>
            <p className="text-sm text-brand-earth/80">{set.summary}</p>
            {/* Only offered for the whole topic, so a narrowed list never plans half a set by surprise. */}
            {sheets.length === set.sheets.length && set.sheets.length > 1 && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <PlanSheets
                  sheets={set.sheets}
                  what={`${set.title}: ${set.sheets.length} sheets`}
                  label="Add this topic to the planner"
                  className="text-sm font-bold text-brand-sage hover:underline"
                />
              </div>
            )}
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sheets.map((sheet) => (
                <SheetCard key={sheet.slug} sheet={sheet} showAges />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}

function SheetCard({ sheet, progress, showAges }: { sheet: Worksheet; progress?: SheetProgress; showAges?: boolean }) {
  const done = progress?.score != null && progress.total != null;
  return (
    <Link
      href={`/worksheets/${sheet.slug}`}
      className="group overflow-hidden rounded-2xl border border-brand-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative">
        <WorksheetPicture sheet={sheet} className="h-28 w-full" />
        {isNew(sheet.slug) && <NewBadge className="absolute right-2 top-2" />}
      </div>
      <div className="p-3.5">
        {showAges && (
          <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: sheet.color }}>
            Ages {sheet.ages}
          </p>
        )}
        <h3 className="text-base font-extrabold leading-tight text-brand-charcoal">{sheet.title}</h3>
        <p className="mt-0.5 text-sm text-brand-earth/80">{sheet.topic}</p>
        {done ? (
          <p className="mt-2 text-sm font-bold">
            <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">
              Best: {progress.score} out of {progress.total}
            </span>
          </p>
        ) : progress?.in_progress ? (
          <p className="mt-2 text-sm font-bold">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">Started</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
