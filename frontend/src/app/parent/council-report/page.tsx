"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import MomentImage from "@/components/MomentImage";
import { isAuthenticated, getRole } from "@/lib/auth";
import { ActiveSummary, LanguageSummary, getChildren, getCouncilReport, saveEheApproach } from "@/lib/api";

type Child = { id: number; username: string };

type Report = {
  child: { id: number; username: string };
  parent: { username: string; email: string | null };
  period: { start: string; end: string };
  approach: string;
  summary: {
    learning_days: number;
    lessons_completed: number;
    extra_activities: number;
    subjects_covered: number;
    minutes_studied: number;
    study_sessions: number;
  };
  subjects: { subject: string; lessons: number; examples: string[] }[];
  results: {
    spelling_tests: number;
    spelling_average: number | null;
    oak_quizzes: number;
    oak_exit_average: number | null;
    tests: { subject: string; title: string; taken_on: string; score: number; total: number; percent: number | null; notes: string | null }[];
  };
  reading: { finished: { title: string; author: string | null; finish_date: string | null }[]; reading_now: { title: string; author: string | null }[] };
  work_samples: { date: string; subject: string; title: string; url: string | null; is_oak_result: boolean; note: string | null }[];
  extra: { date: string; subject: string; title: string }[];
  journal: { date: string; content: string }[];
  moments: { date: string; subject: string | null; note: string | null; photo_ids: number[] }[];
  active?: ActiveSummary;
  languages?: LanguageSummary;
};

type PeriodKey = "term" | "year" | "last-year" | "custom";
type SectionKey = "approach" | "summary" | "subjects" | "results" | "reading" | "work" | "moments" | "active" | "languages" | "extra" | "journal";

const SECTIONS: { key: SectionKey; label: string; defaultOn: boolean }[] = [
  { key: "approach", label: "Our approach", defaultOn: true },
  { key: "summary", label: "Summary", defaultOn: true },
  { key: "subjects", label: "Subjects covered", defaultOn: true },
  { key: "results", label: "Results", defaultOn: true },
  { key: "reading", label: "Reading", defaultOn: true },
  { key: "work", label: "Examples of work", defaultOn: true },
  { key: "active", label: "P.E., outdoors and clubs", defaultOn: true },
  { key: "languages", label: "Languages", defaultOn: true },
  { key: "moments", label: "Learning moments", defaultOn: true },
  { key: "extra", label: "Extra learning", defaultOn: true },
  { key: "journal", label: "Journal highlights", defaultOn: false },
];

const iso = (d: Date) => format(d, "yyyy-MM-dd");

/** UK school year runs September to August; terms start in September, January and April. */
function periodDates(key: PeriodKey, today = new Date()): { start: string; end: string } {
  const y = today.getFullYear();
  const m = today.getMonth();
  const yearStart = m >= 8 ? y : y - 1;
  if (key === "year") return { start: iso(new Date(yearStart, 8, 1)), end: iso(today) };
  if (key === "last-year") return { start: iso(new Date(yearStart - 1, 8, 1)), end: iso(new Date(yearStart, 7, 31)) };
  const termStart = m >= 8 ? new Date(y, 8, 1) : m >= 3 ? new Date(y, 3, 1) : new Date(y, 0, 1);
  return { start: iso(termStart), end: iso(today) };
}

const fmt = (d: string) => format(parseISO(d), "d MMMM yyyy");
const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} hour${h === 1 ? "" : "s"}` : "", m ? `${m} minute${m === 1 ? "" : "s"}` : ""].filter(Boolean).join(" ");
};
const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 break-inside-avoid-page">
      <h2 className="mb-3 border-b-2 border-brand-sage pb-1 text-lg font-extrabold text-brand-charcoal print:border-gray-500 print:text-black">
        {title}
      </h2>
      {children}
    </section>
  );
}

const timesText = (n: number) => (n === 1 ? "once" : n === 2 ? "twice" : `${n} times`);

function ActiveSection({ active }: { active: ActiveSummary }) {
  const { totals, clubs, pe, outdoor } = active;
  const sessionClubs = clubs.filter((c) => c.sessions > 0 || c.is_active);
  return (
    <ReportSection title="Physical activity, outdoor learning and clubs">
      {totals.sessions === 0 && sessionClubs.length === 0 ? (
        <p>No P.E., outdoor learning or club sessions were recorded in this period.</p>
      ) : (
        <>
          <p>
            {totals.sessions} recorded session{totals.sessions === 1 ? "" : "s"} of physical activity, outdoor learning and clubs
            {totals.minutes > 0 ? <>, adding up to at least <strong>{formatDuration(totals.minutes)}</strong></> : null}:{" "}
            {[
              totals.pe ? `${totals.pe} P.E.` : "",
              totals.outdoor ? `${totals.outdoor} outdoor learning` : "",
              totals.club ? `${totals.club} club session${totals.club === 1 ? "" : "s"}` : "",
            ]
              .filter(Boolean)
              .join(", ")}
            .
          </p>

          {sessionClubs.length > 0 && (
            <>
              <p className="mt-4 font-bold">Clubs and classes</p>
              <table className="mt-1 w-full text-left">
                <thead>
                  <tr className="text-xs text-[#6E5A46] print:text-gray-600">
                    <th className="py-1.5 pr-3 font-bold">Club</th>
                    <th className="py-1.5 pr-3 font-bold">When</th>
                    <th className="py-1.5 font-bold">Sessions attended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line print:divide-gray-300">
                  {sessionClubs.map((c, i) => (
                    <tr key={i} className="align-top">
                      <td className="py-2 pr-3">
                        <span className="font-bold">{c.activity}</span>: {c.name}
                        {c.place ? `, ${c.place}` : ""}
                        {c.notes ? <span className="block text-xs text-[#6E5A46] print:text-gray-600">{c.notes}</span> : null}
                      </td>
                      <td className="py-2 pr-3">{c.schedule || ""}</td>
                      <td className="py-2 whitespace-nowrap">
                        {c.sessions}
                        {c.minutes ? ` (${formatDuration(c.minutes)})` : ""}
                        {!c.is_active ? " · finished" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {pe.length > 0 && (
            <>
              <p className="mt-4 font-bold">Physical education</p>
              <p>{pe.map((a) => `${a.title} (${timesText(a.times)})`).join("; ")}.</p>
            </>
          )}
          {outdoor.length > 0 && (
            <>
              <p className="mt-4 font-bold">Outdoor learning</p>
              <p>{outdoor.map((a) => `${a.title} (${timesText(a.times)})`).join("; ")}.</p>
            </>
          )}
        </>
      )}
    </ReportSection>
  );
}

function LanguagesSection({ languages }: { languages: LanguageSummary }) {
  const { totals } = languages;
  return (
    <ReportSection title="Modern languages">
      {totals.days === 0 ? (
        <p>No language practice was recorded in this period.</p>
      ) : (
        <>
          <p>
            Practised {totals.languages === 1 ? "one language" : `${totals.languages} languages`} on {totals.days} day{totals.days === 1 ? "" : "s"}
            {totals.minutes > 0 ? <>, adding up to at least <strong>{formatDuration(totals.minutes)}</strong></> : null}
            {totals.best_streak > 1 ? `, with a longest run of ${totals.best_streak} days in a row` : ""}.
          </p>
          <table className="mt-3 w-full text-left">
            <thead>
              <tr className="text-xs text-[#6E5A46] print:text-gray-600">
                <th className="py-1.5 pr-3 font-bold">Language</th>
                <th className="py-1.5 pr-3 font-bold">How</th>
                <th className="py-1.5 font-bold">Practice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line print:divide-gray-300">
              {languages.languages.map((l) => (
                <tr key={l.language} className="align-top">
                  <td className="py-2 pr-3 font-bold">{l.language}</td>
                  <td className="py-2 pr-3">{l.ways.join(", ")}</td>
                  <td className="py-2 whitespace-nowrap">
                    {l.days} day{l.days === 1 ? "" : "s"}
                    {l.minutes ? ` (${formatDuration(l.minutes)})` : ""}
                    {l.xp ? ` · ${l.xp} XP` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {languages.log.some((e) => e.note) && (
            <>
              <p className="mt-4 font-bold">Topics covered</p>
              <p>
                {Array.from(new Set(languages.log.filter((e) => e.note).map((e) => `${e.note} (${e.language})`))).slice(0, 12).join("; ")}.
              </p>
            </>
          )}
        </>
      )}
    </ReportSection>
  );
}

export default function CouncilReportPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [periodKey, setPeriodKey] = useState<PeriodKey>("year");
  const [start, setStart] = useState(periodDates("year").start);
  const [end, setEnd] = useState(periodDates("year").end);
  const [sections, setSections] = useState<Record<SectionKey, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.key, s.defaultOn])) as Record<SectionKey, boolean>
  );
  const [report, setReport] = useState<Report | null>(null);
  const [approach, setApproach] = useState("");
  const [approachSaved, setApproachSaved] = useState("");
  const [approachMessage, setApproachMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    getChildren()
      .then((res) => {
        const list: Child[] = res.data || [];
        setChildren(list);
        setChildId(list[0]?.id ?? null);
        if (list.length === 0) setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const load = useCallback(async () => {
    if (childId == null || !start || !end) return;
    setLoading(true);
    setError("");
    try {
      const res = await getCouncilReport(childId, start, end);
      setReport(res.data);
      setApproach(res.data.approach);
      setApproachSaved(res.data.approach);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not build the report.");
    } finally {
      setLoading(false);
    }
  }, [childId, start, end]);

  useEffect(() => {
    load();
  }, [load]);

  const choosePeriod = (key: PeriodKey) => {
    setPeriodKey(key);
    if (key !== "custom") {
      const dates = periodDates(key);
      setStart(dates.start);
      setEnd(dates.end);
    }
  };

  const saveApproach = async () => {
    setApproachMessage("");
    try {
      await saveEheApproach(approach);
      setApproachSaved(approach.trim());
      setApproachMessage("Saved. It will be used in every report.");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setApproachMessage(typeof detail === "string" ? detail : "Could not save.");
    }
  };

  const downloadPdf = async () => {
    if (approach.trim() !== approachSaved) await saveApproach();
    window.print();
  };

  const on = (key: SectionKey) => sections[key];

  return (
    <div className="min-h-screen print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
        <div className="print:hidden">
          <PageHero art="council" tint={0}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Records</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Council Report</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
            A home education report for your local authority, built from your Bright Roots records.
            Choose a child and period, then download it as a PDF.
          </p>
          </PageHero>

          {children.length === 0 && !loading && (
            <div className="brand-card mt-6 p-6 text-center text-sm text-[#6E5A46]">
              Add a child on the Children page to create a report.
            </div>
          )}

          {children.length > 0 && (
            <div className="brand-card mt-6 space-y-5 p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-bold text-brand-charcoal">Child</p>
                  <div className="flex flex-wrap gap-2">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setChildId(child.id)}
                        className={
                          "rounded-xl border px-4 py-2 text-sm font-semibold " +
                          (child.id === childId
                            ? "border-brand-softsage bg-brand-tint text-brand-sage"
                            : "border-brand-line bg-white text-[#6E5A46]")
                        }
                      >
                        {child.username}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold text-brand-charcoal">Period</p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      ["term", "This term"],
                      ["year", "This school year"],
                      ["last-year", "Last school year"],
                      ["custom", "Custom dates"],
                    ] as [PeriodKey, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => choosePeriod(key)}
                        className={
                          "rounded-xl border px-4 py-2 text-sm font-semibold " +
                          (periodKey === key
                            ? "border-brand-softsage bg-brand-tint text-brand-sage"
                            : "border-brand-line bg-white text-[#6E5A46]")
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {periodKey === "custom" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-xl border border-[#D9D1C4] bg-white px-3 py-2" />
                      <span className="text-[#6E5A46]">to</span>
                      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-xl border border-[#D9D1C4] bg-white px-3 py-2" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-brand-charcoal">Include</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {SECTIONS.map((s) => (
                    <label key={s.key} className="flex items-center gap-2 text-sm text-[#6E5A46]">
                      <input
                        type="checkbox"
                        checked={sections[s.key]}
                        onChange={(e) => setSections({ ...sections, [s.key]: e.target.checked })}
                        className="accent-brand-sage"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>

              {on("approach") && (
                <div>
                  <p className="text-sm font-bold text-brand-charcoal">Our approach to home education</p>
                  <p className="mb-2 text-xs text-[#6E5A46]">
                    A few sentences on how and why you home educate: your style, resources, routine and goals.
                    Write it once and it&apos;s reused in every report.
                  </p>
                  <textarea
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    rows={5}
                    maxLength={5000}
                    placeholder="e.g. We follow a structured morning routine using Oak National Academy lessons for Maths, English and Science, with project-based learning, reading and outdoor activities in the afternoons..."
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-softsage"
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={saveApproach}
                      disabled={approach.trim() === approachSaved}
                      className="rounded-xl border border-brand-line bg-white px-4 py-2 text-sm font-bold text-brand-sage disabled:opacity-50"
                    >
                      Save approach
                    </button>
                    {approachMessage && <span className="text-xs font-semibold text-[#6E5A46]">{approachMessage}</span>}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-brand-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#6E5A46]">
                  In the print window, choose <strong>Save as PDF</strong> as the destination.
                </p>
                <button
                  onClick={downloadPdf}
                  disabled={!report || loading}
                  className="rounded-xl bg-brand-sage px-6 py-3 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3 text-sm font-semibold text-[#A64F42]">{error}</div>
          )}
          {loading && children.length > 0 && <p className="mt-6 text-sm text-[#6E5A46]">Building report...</p>}
          {report && !loading && <p className="mb-3 mt-8 text-xs font-bold uppercase tracking-wider text-brand-softsage">Preview</p>}
        </div>

        {report && !loading && (
          <article className="rounded-2xl border border-brand-line bg-white p-6 text-sm leading-6 text-[#2E342F] sm:p-10 print:rounded-none print:border-0 print:p-0 print:text-black">
            <header className="border-b border-brand-line pb-5 print:border-gray-400">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage print:text-gray-600">Elective home education report</p>
              <h1 className="mt-1 text-2xl font-black">{report.child.username}</h1>
              <p className="mt-1 text-[#6E5A46] print:text-gray-700">
                {fmt(report.period.start)} to {fmt(report.period.end)}
              </p>
              <p className="mt-1 text-xs text-[#6E5A46] print:text-gray-600">
                Prepared by {report.parent.username}
                {report.parent.email ? ` (${report.parent.email})` : ""} on {format(new Date(), "d MMMM yyyy")} using Bright Roots Home Learning
              </p>
            </header>

            {on("approach") && (
              <ReportSection title="Our approach to home education">
                {approach.trim() ? (
                  <p className="whitespace-pre-line">{approach.trim()}</p>
                ) : (
                  <p className="italic text-[#8A7A69] print:hidden">Write your approach above to include it here.</p>
                )}
              </ReportSection>
            )}

            {on("summary") && (
              <ReportSection title="Summary">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    [report.summary.learning_days, "Days of recorded learning"],
                    [report.summary.lessons_completed, "Lessons completed"],
                    [report.summary.subjects_covered, "Subjects covered"],
                    [report.summary.extra_activities, "Extra learning activities"],
                  ].map(([value, label]) => (
                    <div key={label as string} className="rounded-xl border border-brand-line p-3 print:border-gray-300">
                      <p className="text-xl font-black">{value}</p>
                      <p className="text-xs text-[#6E5A46] print:text-gray-600">{label}</p>
                    </div>
                  ))}
                </div>
                {report.summary.minutes_studied > 0 && (
                  <p className="mt-3">
                    Time spent learning with the study timer: <strong>{formatDuration(report.summary.minutes_studied)}</strong> across{" "}
                    {report.summary.study_sessions} session{report.summary.study_sessions === 1 ? "" : "s"}.
                  </p>
                )}
              </ReportSection>
            )}

            {on("subjects") && (
              <ReportSection title="Subjects covered">
                {report.subjects.length === 0 ? (
                  <p>No completed lessons were recorded in this period.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-[#6E5A46] print:text-gray-600">
                        <th className="w-40 py-1.5 pr-3 font-bold">Subject</th>
                        <th className="w-20 py-1.5 pr-3 font-bold">Lessons</th>
                        <th className="py-1.5 font-bold">Examples of topics studied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line print:divide-gray-300">
                      {report.subjects.map((s) => (
                        <tr key={s.subject} className="align-top">
                          <td className="py-2 pr-3 font-bold">{s.subject}</td>
                          <td className="py-2 pr-3">{s.lessons}</td>
                          <td className="py-2">{s.examples.join("; ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </ReportSection>
            )}

            {on("results") && (
              <ReportSection title="Results and assessment">
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Spelling: {report.results.spelling_tests} weekly test{report.results.spelling_tests === 1 ? "" : "s"}
                    {report.results.spelling_average != null ? `, average ${report.results.spelling_average}%` : ""}
                  </li>
                  <li>
                    Oak National Academy lesson quizzes: {report.results.oak_quizzes} completed
                    {report.results.oak_exit_average != null ? `, average exit quiz score ${report.results.oak_exit_average}%` : ""}
                  </li>
                </ul>
                {report.results.tests.length > 0 && (
                  <table className="mt-4 w-full text-left">
                    <thead>
                      <tr className="text-xs text-[#6E5A46] print:text-gray-600">
                        <th className="py-1.5 pr-3 font-bold">Date</th>
                        <th className="py-1.5 pr-3 font-bold">Subject</th>
                        <th className="py-1.5 pr-3 font-bold">Assessment</th>
                        <th className="py-1.5 font-bold">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line print:divide-gray-300">
                      {report.results.tests.map((t, i) => (
                        <tr key={i} className="align-top">
                          <td className="py-2 pr-3 whitespace-nowrap">{format(parseISO(t.taken_on), "d MMM yyyy")}</td>
                          <td className="py-2 pr-3">{t.subject}</td>
                          <td className="py-2 pr-3">
                            {t.title}
                            {t.notes ? <span className="block text-xs text-[#6E5A46] print:text-gray-600">{t.notes}</span> : null}
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            {num(t.score)}/{num(t.total)}{t.percent != null ? ` (${t.percent}%)` : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </ReportSection>
            )}

            {on("reading") && (
              <ReportSection title="Reading">
                {report.reading.finished.length === 0 && report.reading.reading_now.length === 0 ? (
                  <p>No books were recorded in this period.</p>
                ) : (
                  <>
                    {report.reading.finished.length > 0 && (
                      <>
                        <p className="font-bold">Books finished ({report.reading.finished.length})</p>
                        <ul className="mb-3 list-disc pl-5">
                          {report.reading.finished.map((b, i) => (
                            <li key={i}>
                              {b.title}
                              {b.author ? ` by ${b.author}` : ""}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {report.reading.reading_now.length > 0 && (
                      <>
                        <p className="font-bold">Currently reading</p>
                        <ul className="list-disc pl-5">
                          {report.reading.reading_now.map((b, i) => (
                            <li key={i}>
                              {b.title}
                              {b.author ? ` by ${b.author}` : ""}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </ReportSection>
            )}

            {on("work") && (
              <ReportSection title="Examples of work">
                {report.work_samples.length === 0 ? (
                  <p>No submitted work was recorded in this period.</p>
                ) : (
                  <ul className="space-y-2">
                    {report.work_samples.map((w, i) => (
                      <li key={i}>
                        <span className="font-bold">{format(parseISO(w.date), "d MMM yyyy")} · {w.subject}:</span> {w.title}
                        {w.note && <span className="block text-[#6E5A46] print:text-gray-700">&ldquo;{w.note}&rdquo;</span>}
                        {w.url && (
                          <a href={w.url} target="_blank" rel="noopener noreferrer" className="block break-all text-xs text-brand-sage underline print:text-gray-700">
                            {w.is_oak_result ? "Oak quiz results: " : "Work: "}
                            {w.url}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </ReportSection>
            )}

            {on("active") && report.active && <ActiveSection active={report.active} />}

            {on("languages") && report.languages && <LanguagesSection languages={report.languages} />}

            {on("moments") && report.moments.length > 0 && (
              <ReportSection title="Learning moments">
                <div className="space-y-4">
                  {report.moments.map((m, i) => (
                    <div key={i} className="break-inside-avoid">
                      <p className="font-bold">
                        {format(parseISO(m.date), "d MMM yyyy")}
                        {m.subject ? ` · ${m.subject}` : ""}
                      </p>
                      {m.note && <p className="whitespace-pre-line">{m.note}</p>}
                      {m.photo_ids.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {m.photo_ids.map((id) => (
                            <MomentImage key={id} photoId={id} alt={m.note ?? "Learning moment photo"} className="aspect-square w-full rounded-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ReportSection>
            )}

            {on("extra") && report.extra.length > 0 && (
              <ReportSection title="Extra learning">
                <ul className="list-disc pl-5">
                  {report.extra.map((x, i) => (
                    <li key={i}>
                      {format(parseISO(x.date), "d MMM yyyy")} · {x.subject}: {x.title}
                    </li>
                  ))}
                </ul>
              </ReportSection>
            )}

            {on("journal") && report.journal.length > 0 && (
              <ReportSection title="Journal highlights">
                <div className="space-y-3">
                  {report.journal.map((j, i) => (
                    <div key={i}>
                      <p className="font-bold">{fmt(j.date)}</p>
                      <p className="whitespace-pre-line">{j.content}</p>
                    </div>
                  ))}
                </div>
              </ReportSection>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
