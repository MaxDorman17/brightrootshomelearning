"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import ComicPicture from "@/components/comics/ComicPicture";
import { COMICS, comicBySlug, type Comic } from "@/lib/comics";
import { isAuthenticated } from "@/lib/auth";
import { comic as comicFont } from "@/lib/fonts";

const frame = "rounded-2xl border-[3px] border-brand-charcoal bg-white shadow-[4px_4px_0_0_#2E342F]";

/** One comic: six panels, then a fact, a quick quiz and something to try at home. */
export default function ComicReader() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const comic = comicBySlug(slug);
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  if (!comic) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <p className="text-brand-earth">We couldn&apos;t find that comic.</p>
          <Link href="/make/comics" className="mt-4 inline-block font-bold text-brand-sage underline">
            Back to the comics
          </Link>
        </main>
      </div>
    );
  }

  const i = COMICS.indexOf(comic);
  const prev = COMICS[(i + COMICS.length - 1) % COMICS.length];
  const next = COMICS[(i + 1) % COMICS.length];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href="/make/comics" className="text-sm font-bold text-brand-sage hover:underline">
          ← All comics
        </Link>

        {/* Cover strip */}
        <header className={`${frame} mt-3 flex items-center gap-4 overflow-hidden p-0`}>
          <ComicPicture comic={comic} className="h-28 w-28 shrink-0 border-r-[3px] border-brand-charcoal sm:h-36 sm:w-36" />
          <div className="min-w-0 py-3 pr-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: comic.color }}>
              {comic.subject} · {comic.topic}
            </p>
            <h1 className={`${comicFont.className} mt-1 text-3xl leading-none tracking-wide text-brand-charcoal sm:text-5xl`}>
              {comic.hero.name}
            </h1>
            <p className={`${comicFont.className} mt-1 text-xl tracking-wide sm:text-2xl`} style={{ color: comic.color }}>
              {comic.title}
            </p>
            <p className="mt-1 text-xs text-brand-earth/70">Super power: {comic.hero.power}</p>
          </div>
        </header>

        {/* Panels */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {comic.panels.map((p, n) => (
            <figure key={n} className={`${frame} relative overflow-hidden`}>
              <ComicPicture comic={comic} panel={n + 1} className="aspect-[3/2] w-full" />
              <span className={`${comicFont.className} absolute right-2 top-2 rounded-md border-2 border-brand-charcoal bg-white px-2 text-sm`}>
                {n + 1}
              </span>
              <figcaption className="space-y-2 border-t-[3px] border-brand-charcoal p-3">
                {p.caption && (
                  <p className="inline-block rounded border-2 border-brand-charcoal bg-[#FCE38A] px-2 py-1 text-xs font-bold uppercase tracking-wide text-brand-charcoal">
                    {p.caption}
                  </p>
                )}
                {p.bubbles.map(([who, text], b) => (
                  <Bubble key={b} who={who} text={text} hero={comic.hero.name.includes(who)} comic={comic} />
                ))}
              </figcaption>
            </figure>
          ))}
        </div>

        <section className={`${frame} mt-8 p-5`} style={{ background: `${comic.color}14` }}>
          <h2 className={`${comicFont.className} text-2xl tracking-wide`} style={{ color: comic.color }}>
            Did you know?
          </h2>
          <p className="mt-1 text-brand-charcoal">{comic.fact}</p>
        </section>

        <Quiz comic={comic} />

        <section className={`${frame} mt-6 p-5`}>
          <h2 className={`${comicFont.className} text-2xl tracking-wide text-brand-charcoal`}>
            <Emoji e="🏠" /> Try this at home
          </h2>
          <p className="mt-1 text-brand-earth">{comic.tryThis}</p>
        </section>

        <nav className="mt-8 flex flex-wrap justify-between gap-3 text-sm font-bold">
          <Link href={`/make/comics/${prev.slug}`} className="text-brand-sage hover:underline">
            ← {prev.hero.name}
          </Link>
          <Link href={`/make/comics/${next.slug}`} className="text-brand-sage hover:underline">
            {next.hero.name} →
          </Link>
        </nav>
      </main>
    </div>
  );
}

function Bubble({ who, text, hero, comic }: { who: string; text: string; hero: boolean; comic: Comic }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-1 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
        style={{ background: hero ? comic.color : "#5B625C" }}
      >
        {who}
      </span>
      <p className="relative rounded-2xl border-2 border-brand-charcoal bg-white px-3 py-1.5 text-[15px] font-semibold leading-snug text-brand-charcoal">
        {text}
      </p>
    </div>
  );
}

function Quiz({ comic }: { comic: Comic }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => comic.quiz.map(() => null));
  useEffect(() => setPicked(comic.quiz.map(() => null)), [comic]);
  const done = picked.every((p) => p !== null);
  const score = picked.filter((p, i) => p === comic.quiz[i].answer).length;

  return (
    <section className={`${frame} mt-6 p-5`}>
      <h2 className={`${comicFont.className} text-2xl tracking-wide text-brand-charcoal`}>Quick quiz</h2>
      <ol className="mt-3 space-y-4">
        {comic.quiz.map((q, qi) => (
          <li key={qi}>
            <p className="font-bold text-brand-charcoal">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((o, oi) => {
                const chosen = picked[qi] === oi;
                const answered = picked[qi] !== null;
                const right = oi === q.answer;
                const style = !answered
                  ? "border-brand-charcoal/30 bg-white hover:border-brand-charcoal"
                  : right
                    ? "border-green-700 bg-green-100 text-green-900"
                    : chosen
                      ? "border-red-700 bg-red-100 text-red-900"
                      : "border-brand-charcoal/20 bg-white opacity-60";
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={answered}
                    onClick={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))}
                    className={`rounded-xl border-2 px-4 py-2 text-sm font-bold ${style}`}
                  >
                    {o}
                    {answered && right && " ✓"}
                  </button>
                );
              })}
            </div>
            {picked[qi] !== null && (
              <p className="mt-1 text-sm font-bold" style={{ color: picked[qi] === q.answer ? "#2f7d32" : "#b23b2e" }}>
                {picked[qi] === q.answer ? "Yes, well done!" : `Good try! The answer is ${q.options[q.answer]}.`}
              </p>
            )}
          </li>
        ))}
      </ol>
      {done && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className={`${comicFont.className} text-2xl tracking-wide`} style={{ color: comic.color }}>
            {score === comic.quiz.length ? `Super! ${score} out of ${score}!` : `${score} out of ${comic.quiz.length}. Great reading!`}
          </p>
          <button
            type="button"
            onClick={() => setPicked(comic.quiz.map(() => null))}
            className="rounded-xl border-2 border-brand-charcoal/30 px-3 py-1.5 text-sm font-bold text-brand-earth"
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
