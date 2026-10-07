"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Visual from "@/components/worksheets/Visual";
import { isAuthenticated } from "@/lib/auth";
import { answerText, shuffled, worksheetBySlug, type Question, type Worksheet } from "@/lib/worksheets";

const box = "inline-block h-9 min-w-[3.5rem] rounded-md border-2 border-brand-charcoal/70 align-middle";

/** A worksheet on paper: the questions with room to write, then an answer page for the grown-up. */
export default function WorksheetPrintPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const sheet = worksheetBySlug(slug);
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  if (!sheet) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-brand-earth">We couldn&apos;t find that worksheet.</p>
          <Link href="/worksheets" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to the worksheets
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen print:min-h-0">
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } }`}</style>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 print:max-w-none print:p-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <Link href={`/worksheets/${sheet.slug}`} className="text-sm font-bold text-brand-sage hover:underline">
              ← Back to the worksheet
            </Link>
            <h1 className="mt-1 text-2xl font-extrabold text-brand-charcoal">Print this sheet</h1>
            <p className="text-sm text-brand-earth/80">Prints on A4. The answers come out on their own page at the end, so you can keep them back.</p>
          </div>
          <button onClick={() => window.print()} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark">
            Print
          </button>
        </div>

        <article className="rounded-3xl border border-brand-line bg-white p-6 text-brand-charcoal shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <Heading sheet={sheet} />
          <div className="mt-3 flex flex-wrap gap-x-10 gap-y-2 text-sm font-bold">
            <span>
              Name <span className="inline-block w-48 border-b-2 border-brand-charcoal/60 align-bottom">&nbsp;</span>
            </span>
            <span>
              Date <span className="inline-block w-32 border-b-2 border-brand-charcoal/60 align-bottom">&nbsp;</span>
            </span>
          </div>
          <p className="mt-3 text-[15px] leading-snug">{sheet.intro}</p>

          <ol className="mt-4 space-y-5">
            {sheet.questions.map((q, i) => (
              <li key={i} className="break-inside-avoid">
                <p className="text-base font-bold leading-snug">
                  {i + 1}. {paperWording(q)}
                </p>
                {q.visual && (
                  <div className="mt-2">
                    <Visual
                      visual={q.visual}
                      color={sheet.color}
                      className={q.visual.kind === "numberline" ? "w-full max-w-xl" : q.visual.kind === "blocks" ? "h-28" : "h-24"}
                    />
                  </div>
                )}
                <div className="mt-2">
                  <PaperAnswer q={q} seed={`${sheet.slug}-${i}`} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm font-bold">
            Score <span className={box} /> out of {sheet.questions.length}
          </p>
          <Footer />

          {/* The answers, on a page of their own. */}
          <section className="mt-10 border-t-2 border-dashed border-brand-line pt-6 print:mt-0 print:break-before-page print:border-0 print:pt-0">
            <Heading sheet={sheet} answers />
            <ol className="mt-4 space-y-2 text-[15px]">
              {sheet.questions.map((q, i) => (
                <li key={i} className="break-inside-avoid leading-snug">
                  <span className="font-extrabold">
                    {i + 1}. {answerText(q)}
                  </span>
                  {q.why && <span className="text-brand-earth"> · {q.why}</span>}
                </li>
              ))}
            </ol>
            <Footer />
          </section>
        </article>
      </main>
    </div>
  );
}

function Heading({ sheet, answers }: { sheet: Worksheet; answers?: boolean }) {
  return (
    <header className="border-b-2 pb-2" style={{ borderColor: sheet.color }}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: sheet.color }}>
        Bright Roots · {sheet.subject} · ages {sheet.ages}
      </p>
      <h2 className="text-2xl font-extrabold leading-tight">
        {sheet.title}
        {answers && ": answers for the grown-up"}
      </h2>
    </header>
  );
}

function Footer() {
  return <p className="mt-6 text-[10px] text-brand-earth/70">© Bright Roots Home Learning · brightrootshomelearning.co.uk</p>;
}

/** On screen a child taps; on paper they circle, write or draw a line. */
function paperWording(q: Question): string {
  if (q.type === "order") return q.q.replace(/\btap\b/g, "write").replace(/\bTap\b/g, "Write");
  if (q.type === "match") return `${q.q} Draw a line to join them.`;
  return q.q;
}

function PaperAnswer({ q, seed }: { q: Question; seed: string }) {
  switch (q.type) {
    case "choice":
    case "pick":
      return (
        <p className="flex flex-wrap gap-x-8 gap-y-2 text-base">
          <span className="text-sm text-brand-earth">{q.type === "pick" ? "Circle every right one:" : "Circle one:"}</span>
          {q.options.map((option, i) => (
            <span key={i} className="font-bold">
              {typeof option === "string" ? option : `Picture ${i + 1}`}
            </span>
          ))}
        </p>
      );
    case "type":
      return (
        <p className="text-base font-bold">
          <span className={box} /> {q.after}
        </p>
      );
    case "gap": {
      const pieces = q.text.split("___");
      return (
        <div>
          <p className="text-lg font-bold leading-loose">
            {pieces.map((piece, i) => (
              <span key={i}>
                {piece}
                {i < pieces.length - 1 && <span className={`${box} mx-1`} />}
              </span>
            ))}
          </p>
          <p className="mt-1 text-sm text-brand-earth">
            Choose from: <span className="font-bold text-brand-charcoal">{q.bank.join("   ·   ")}</span>
          </p>
        </div>
      );
    }
    case "match": {
      const rights = shuffled(q.pairs.map(([, r]) => r), seed);
      return (
        <div className="grid max-w-md grid-cols-2 gap-x-24 gap-y-3 text-base font-bold">
          {q.pairs.map(([left], i) => (
            <div key={left} className="contents">
              <span className="flex items-center justify-between gap-2">
                {left} <span className="h-2.5 w-2.5 rounded-full bg-brand-charcoal" />
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-charcoal" /> {rights[i]}
              </span>
            </div>
          ))}
        </div>
      );
    }
    case "order":
      return (
        <div>
          <p className="text-base font-bold">{shuffled(q.items, seed).join("   ·   ")}</p>
          <ol className="mt-2 space-y-2">
            {q.items.map((_, i) => (
              <li key={i} className="flex items-end gap-2 text-sm font-bold">
                {i + 1}. <span className="inline-block w-72 border-b-2 border-brand-charcoal/60">&nbsp;</span>
              </li>
            ))}
          </ol>
        </div>
      );
  }
}
