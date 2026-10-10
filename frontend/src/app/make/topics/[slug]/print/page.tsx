"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PaperAnswer, paperBox, paperWording } from "@/components/worksheets/PaperQuestion";
import { getRole, isAuthenticated } from "@/lib/auth";
import { answerText } from "@/lib/worksheets";
import { packBySlug, type TopicPack, type TopicSheet } from "@/lib/topics";

type Part = { id: string; label: string; grownUp?: boolean };

/** A topic pack on paper. Pick the parts to print: each starts on a new page, and quiz answers come on their own page. */
export default function TopicPrintPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const pack = packBySlug(slug);
  const [role, setRole] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Set<string>>(new Set(["organiser", "cards", ...(pack?.sheets.map((s) => s.slug) ?? [])]));

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
    setRole(getRole());
  }, [router]);

  if (!pack) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-brand-earth">We couldn&apos;t find that topic pack.</p>
          <Link href="/make/topics" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to the topic packs
          </Link>
        </main>
      </div>
    );
  }

  const isChild = role === "child";
  const parts: Part[] = [
    { id: "organiser", label: "Knowledge organiser (key facts, timeline and words)" },
    { id: "cards", label: "Word cards to cut out" },
    ...pack.sheets.map((s) => ({ id: s.slug, label: `${s.title}, with answers` })),
    { id: "lessons", label: "Lesson plans", grownUp: true },
    { id: "background", label: "Background notes and book list", grownUp: true },
  ].filter((p) => !(isChild && p.grownUp));
  const on = (id: string) => chosen.has(id) && parts.some((p) => p.id === id);
  const toggle = (id: string) =>
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen print:min-h-0">
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } }`}</style>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 print:max-w-none print:p-0">
        <div className="mb-5 print:hidden">
          <Link href={`/make/topics/${pack.slug}`} className="text-sm font-bold text-brand-sage hover:underline">
            ← Back to {pack.title}
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-charcoal">Print the pack</h1>
          <p className="text-sm text-brand-earth/80">Tick what you want. Each part starts on a new A4 page, and quiz answers come on their own page so you can keep them back.</p>
          <div className="mt-3 space-y-2 rounded-2xl border border-brand-line bg-white p-4">
            {parts.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 text-sm font-bold text-brand-charcoal">
                <input type="checkbox" checked={chosen.has(p.id)} onChange={() => toggle(p.id)} className="h-5 w-5 accent-current" />
                {p.label}
                {p.grownUp && <span className="text-xs font-bold text-brand-earth/60">for you</span>}
              </label>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            disabled={!parts.some((p) => chosen.has(p.id))}
            className="mt-4 rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark disabled:opacity-50"
          >
            Print
          </button>
        </div>

        <div className="space-y-8 print:space-y-0">
          {on("organiser") && <Organiser pack={pack} />}
          {on("cards") && <WordCards pack={pack} />}
          {pack.sheets.filter((s) => on(s.slug)).map((s) => <Sheet key={s.slug} pack={pack} sheet={s} />)}
          {on("lessons") && <Lessons pack={pack} />}
          {on("background") && <Notes pack={pack} />}
        </div>
      </main>
    </div>
  );
}

/** One printed part: a white page on screen, a fresh sheet of paper when printed. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-brand-line bg-white p-6 text-brand-charcoal shadow-sm print:break-before-page print:rounded-none print:border-0 print:p-0 print:shadow-none print:first:break-before-auto">
      {children}
      <p className="mt-6 text-[10px] text-brand-earth/70">© Bright Roots Home Learning · brightrootshomelearning.co.uk</p>
    </article>
  );
}

function Heading({ pack, title }: { pack: TopicPack; title: string }) {
  return (
    <header className="border-b-2 pb-2" style={{ borderColor: pack.color }}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: pack.color }}>
        Bright Roots · {pack.title}
      </p>
      <h2 className="text-2xl font-extrabold leading-tight">{title}</h2>
    </header>
  );
}

function Organiser({ pack }: { pack: TopicPack }) {
  return (
    <Page>
      <Heading pack={pack} title="Knowledge organiser" />
      <h3 className="mt-4 font-extrabold" style={{ color: pack.color }}>
        Key facts
      </h3>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-snug">
        {pack.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <h3 className="mt-4 font-extrabold" style={{ color: pack.color }}>
        Timeline
      </h3>
      <table className="mt-1 w-full text-[13px] leading-snug">
        <tbody>
          {pack.timeline.map((t) => (
            <tr key={t.when} className="border-b border-brand-line">
              <td className="w-28 py-1 pr-3 align-top font-extrabold">{t.when}</td>
              <td className="py-1">{t.what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="mt-4 font-extrabold" style={{ color: pack.color }}>
        Words to know
      </h3>
      <dl className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 text-[12px] leading-snug">
        {pack.words.map((w) => (
          <div key={w.word} className="break-inside-avoid">
            <dt className="inline font-extrabold">{w.word}: </dt>
            <dd className="inline">{w.meaning}</dd>
          </div>
        ))}
      </dl>
    </Page>
  );
}

function WordCards({ pack }: { pack: TopicPack }) {
  return (
    <Page>
      <Heading pack={pack} title="Word cards" />
      <p className="mt-2 text-sm text-brand-earth">Cut them out along the dashed lines. Cover the meaning and say what the word means, or fold each card so the meaning is on the back.</p>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 print:grid-cols-3">
        {pack.words.map((w) => (
          <div key={w.word} className="flex min-h-[6.5rem] break-inside-avoid flex-col justify-center border border-dashed border-brand-charcoal/50 p-3 text-center">
            <p className="text-lg font-extrabold" style={{ color: pack.color }}>
              {w.word}
            </p>
            <p className="mt-1 text-[11px] leading-snug">{w.meaning}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

function Sheet({ pack, sheet }: { pack: TopicPack; sheet: TopicSheet }) {
  return (
    <>
      <Page>
        <Heading pack={pack} title={sheet.title} />
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
              <div className="mt-2">
                <PaperAnswer q={q} seed={`${pack.slug}-${sheet.slug}-${i}`} />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm font-bold">
          Score <span className={paperBox} /> out of {sheet.questions.length}
        </p>
      </Page>
      <Page>
        <Heading pack={pack} title={`${sheet.title}: answers for the grown-up`} />
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
      </Page>
    </>
  );
}

function Lessons({ pack }: { pack: TopicPack }) {
  return (
    <>
      {pack.lessons.map((l, i) => (
        <Page key={l.title}>
          <Heading pack={pack} title={`Lesson ${i + 1}: ${l.title}`} />
          <p className="mt-3 text-sm font-bold">By the end, your child should {l.aim.charAt(0).toLowerCase() + l.aim.slice(1)}</p>
          <p className="mt-2 text-sm">
            <strong>You&apos;ll need:</strong> {l.need.join("; ")}.
          </p>
          <h3 className="mt-3 font-extrabold" style={{ color: pack.color }}>
            Tell the story
          </h3>
          {l.say.map((x) => (
            <p key={x} className="mt-1 text-[13px] leading-snug">
              {x}
            </p>
          ))}
          <h3 className="mt-3 font-extrabold" style={{ color: pack.color }}>
            Do it
          </h3>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-[13px] leading-snug">
            {l.doIt.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
          <h3 className="mt-3 font-extrabold" style={{ color: pack.color }}>
            Talk about it
          </h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-snug">
            {l.ask.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {l.younger && (
            <p className="mt-3 text-[13px] leading-snug">
              <strong>Younger child:</strong> {l.younger}
            </p>
          )}
          {l.older && (
            <p className="mt-1 text-[13px] leading-snug">
              <strong>Older or keen child:</strong> {l.older}
            </p>
          )}
        </Page>
      ))}
    </>
  );
}

function Notes({ pack }: { pack: TopicPack }) {
  return (
    <Page>
      <Heading pack={pack} title="Before you start: notes for the grown-up" />
      {pack.background.map((b) => (
        <div key={b.heading} className="mt-3 break-inside-avoid">
          <h3 className="font-extrabold" style={{ color: pack.color }}>
            {b.heading}
          </h3>
          {b.text.map((t) => (
            <p key={t} className="mt-1 text-[13px] leading-snug">
              {t}
            </p>
          ))}
        </div>
      ))}
      <h3 className="mt-4 font-extrabold" style={{ color: pack.color }}>
        Books
      </h3>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-snug">
        {pack.books.map((b) => (
          <li key={b.title}>
            <strong>{b.title}</strong>
            {b.by && ` by ${b.by}`}. {b.note}
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-extrabold" style={{ color: pack.color }}>
        Places to visit
      </h3>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-snug">
        {pack.visits.map((v) => (
          <li key={v.title}>
            <strong>{v.title}</strong>
            {v.by && `, ${v.by}`}. {v.note}
          </li>
        ))}
      </ul>
    </Page>
  );
}
