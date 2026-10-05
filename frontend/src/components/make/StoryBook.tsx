"use client";

import { useEffect, useRef, useState } from "react";
import { hand, serif } from "@/lib/fonts";
import { MakeDetail, MakePhoto } from "./common";
import Emoji from "@/components/Emoji";

type Page =
  | { kind: "cover" }
  | { kind: "opening" }
  | { kind: "need" }
  | { kind: "step"; index: number; talk: string | null }
  | { kind: "chat" }
  | { kind: "more" }
  | { kind: "end" };

/** Spread the "what to say or ask" prompts across the steps, one per step at most, never repeated. */
function talkForSteps(steps: number, talk: string[]): (string | null)[] {
  const out: (string | null)[] = [];
  let last = -1;
  for (let i = 0; i < steps; i++) {
    const j = talk.length ? Math.floor((i * talk.length) / steps) : -1;
    out.push(j >= 0 && j !== last ? talk[j] : null);
    last = j;
  }
  return out;
}

/**
 * Little Roots "Start": the activity as a picture book a grown-up reads with their child.
 * Cover, what we need, one page per step with something to say, then "The End" with stars to tap.
 */
export default function StoryBook({ item, onClose, onFinish }: { item: MakeDetail; onClose: () => void; onFinish: () => void }) {
  const talk = talkForSteps(item.steps.length, item.talk || []);
  // The story: first line opens the book, last line ends it, the ones between go with each step.
  const story = item.story || [];
  const opening = story.length >= 2 ? story[0] : null;
  const ending = story.length >= 2 ? story[story.length - 1] : null;
  const storyFor = (i: number) => (story.length >= 3 ? story[1 + i] ?? null : null);
  const pages: Page[] = [
    { kind: "cover" },
    ...(opening ? [{ kind: "opening" } as Page] : []),
    ...(item.materials.length || item.tips ? [{ kind: "need" } as Page] : []),
    ...item.steps.map((_, i) => ({ kind: "step", index: i, talk: talk[i] }) as Page),
    { kind: "chat" },
    ...(item.more || item.easier ? [{ kind: "more" } as Page] : []),
    { kind: "end" },
  ];
  const [at, setAt] = useState(0);
  const [turn, setTurn] = useState<"next" | "back">("next");
  const [stars, setStars] = useState(0);
  const [got, setGot] = useState<Set<number>>(new Set());
  const touchX = useRef<number | null>(null);

  const go = (to: number) => {
    const next = Math.max(0, Math.min(pages.length - 1, to));
    if (next === at) return;
    setTurn(next > at ? "next" : "back");
    setAt(next);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Re-attached each render so the arrow keys always turn from the current page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(at + 1);
      if (e.key === "ArrowLeft") go(at - 1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const page = pages[at];
  const title = `${serif.className} font-semibold text-[#24452C]`;
  const reading = `${serif.className} text-[clamp(22px,3.2vw,34px)] leading-snug text-[#2E342F]`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#EFE6D2]" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, #F6EFDF 0, transparent 50%), radial-gradient(circle at 80% 90%, #E8DCC2 0, transparent 55%)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className={`${serif.className} min-w-0 truncate text-lg font-semibold text-[#24452C]`}>
          <Emoji e={item.emoji} /> {item.title}
        </p>
        <button onClick={onClose} className="shrink-0 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-brand-earth hover:bg-white">
          ✕ Close the book
        </button>
      </div>

      <div
        className="flex flex-1 items-center justify-center overflow-y-auto px-3 pb-3 sm:px-6"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(at + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {/* The open book: two pages and a spine. On a phone the pages stack. */}
        <div
          key={at}
          className={`storybook-page relative grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#FDF9F0] shadow-[0_20px_50px_-20px_rgba(60,45,20,0.45)] md:min-h-[520px] md:grid-cols-2 ${turn === "next" ? "storybook-next" : "storybook-back"}`}
        >
          <div aria-hidden className={`pointer-events-none absolute inset-y-0 left-1/2 w-16 ${page.kind === "end" ? "hidden" : "hidden md:block"} -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(120,95,50,0.14)_45%,rgba(120,95,50,0.22)_50%,rgba(120,95,50,0.14)_55%,transparent)]`} />

          {page.kind === "cover" ? (
            <>
              <div className="flex items-center justify-center p-6 md:p-10">
                <MakePhoto item={item} big className="aspect-square w-full max-w-sm rounded-2xl" />
              </div>
              <div className="flex flex-col items-center justify-center p-6 text-center md:p-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-brand-softsage">A Little Roots story{item.category ? ` · ${item.category}` : ""}</p>
                <h2 className={`${title} mt-3 text-[clamp(34px,5vw,56px)] leading-tight`}>{item.title}</h2>
                {item.summary && <p className={`${hand.className} mt-4 max-w-sm text-[clamp(22px,2.6vw,30px)] leading-tight text-brand-earth`}>{item.summary}</p>}
                <p className="mt-6 text-sm font-bold text-brand-earth/70">
                  Read it together · about {item.minutes || 10} minutes
                </p>
                <button onClick={() => go(1)} className="mt-6 rounded-full bg-brand-sage px-8 py-3.5 text-lg font-extrabold text-white shadow-md hover:bg-brand-sagedark">
                  Open the book →
                </button>
              </div>
            </>
          ) : page.kind === "opening" ? (
            <>
              <div className="flex items-center justify-center p-6 md:p-10">
                <MakePhoto item={item} className="aspect-square w-full max-w-xs rounded-2xl md:max-w-sm" />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className={`${serif.className} text-[clamp(56px,7vw,88px)] font-semibold leading-none text-[#C9B27E]`}>&ldquo;</p>
                <p className={`${reading} -mt-4`}>{opening}</p>
              </div>
            </>
          ) : page.kind === "need" ? (
            <>
              <div className="p-7 md:p-12">
                <h2 className={`${title} text-[clamp(28px,3.6vw,40px)]`}>What we need</h2>
                <ul className="mt-5 space-y-3">
                  {item.materials.map((m, i) => (
                    <li key={i} className="border-b border-dashed border-[#E3D8C1] pb-2">
                      <button
                        onClick={() =>
                          setGot((prev) => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i);
                            else next.add(i);
                            return next;
                          })
                        }
                        className={`${hand.className} flex w-full items-baseline gap-3 text-left text-[clamp(24px,2.8vw,32px)] leading-tight ${got.has(i) ? "text-brand-earth/40 line-through" : "text-[#2E342F]"}`}
                      >
                        <span className={got.has(i) ? "text-brand-sage" : "text-brand-softsage"}>{got.has(i) ? "✔" : "✿"}</span>
                        <span>
                          {m.qty && `${m.qty} `}
                          {m.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className={`${reading}`}>Can you help find everything? Tap each one when you&apos;ve found it.</p>
                {item.tips && (
                  <div className="mt-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-brand-charcoal">
                    <b>For the grown-up: keep it safe.</b> {item.tips}
                  </div>
                )}
              </div>
            </>
          ) : page.kind === "step" ? (
            <>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className={`${serif.className} text-[clamp(64px,9vw,110px)] font-semibold leading-none text-[#D9C9A3]`}>{page.index + 1}</p>
                {storyFor(page.index) ? (
                  <>
                    {/* The story line is read aloud to the child; the step underneath is for the grown-up. */}
                    <p className={`${reading} mt-3`}>{storyFor(page.index)}</p>
                    <div className="mt-6 rounded-2xl bg-white/70 px-5 py-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-softsage">For the grown-up</p>
                      <p className="mt-1 text-base leading-relaxed text-brand-charcoal">{item.steps[page.index].text}</p>
                    </div>
                  </>
                ) : (
                  <p className={`${reading} mt-3`}>{item.steps[page.index].text}</p>
                )}
              </div>
              <div className="flex flex-col items-center justify-center gap-6 p-7 md:p-12">
                {page.talk ? (
                  <div className="relative w-full max-w-sm rounded-[32px] bg-[#EAF0E4] px-7 py-6 shadow-sm">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-sage">Say or ask</p>
                    <p className={`${hand.className} mt-2 text-[clamp(26px,3vw,36px)] leading-tight text-[#24452C]`}>&ldquo;{page.talk}&rdquo;</p>
                    <span aria-hidden className="absolute -bottom-3 left-10 h-6 w-6 rotate-45 bg-[#EAF0E4]" />
                  </div>
                ) : null}
                {/* Every page of a picture book has a picture */}
                <MakePhoto item={item} className="hidden aspect-square w-full max-w-[240px] rounded-2xl opacity-95 md:block" />
                {item.steps[page.index].grown_up && (
                  <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-extrabold text-amber-800">
                    <Emoji e="🧑" /> Grown-up job
                  </span>
                )}
              </div>
            </>
          ) : page.kind === "chat" ? (
            <>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <h2 className={`${title} text-[clamp(28px,3.2vw,40px)]`}>
                  <Emoji e="💬" /> Let&apos;s talk about it
                </h2>
                <p className={`${reading} mt-4 !text-[clamp(20px,2.6vw,28px)]`}>Snuggle up and remember what you did together.</p>
              </div>
              <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
                {["What was your favourite part?", "What was a bit tricky?", "What shall we do next time?"].map((q) => (
                  <div key={q} className="rounded-[28px] bg-[#EAF0E4] px-6 py-4">
                    <p className={`${hand.className} text-[clamp(24px,2.8vw,32px)] leading-tight text-[#24452C]`}>&ldquo;{q}&rdquo;</p>
                  </div>
                ))}
              </div>
            </>
          ) : page.kind === "more" ? (
            <>
              <div className="flex flex-col justify-center p-7 md:p-12">
                {item.more && (
                  <>
                    <h2 className={`${title} text-[clamp(26px,3.2vw,36px)]`}>
                      <Emoji e="🚀" /> Ready for more?
                    </h2>
                    <p className={`${reading} mt-3 !text-[clamp(20px,2.6vw,28px)]`}>{item.more}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                {item.easier && (
                  <>
                    <h2 className={`${title} text-[clamp(26px,3.2vw,36px)]`}>
                      <Emoji e="🌙" /> Tired today?
                    </h2>
                    <p className={`${reading} mt-3 !text-[clamp(20px,2.6vw,28px)]`}>{item.easier}</p>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center md:col-span-2 md:p-12">
              {ending && <p className={`${reading} mb-6 max-w-2xl`}>{ending}</p>}
              <h2 className={`${title} text-[clamp(48px,7vw,84px)] italic`}>The End</h2>
              <p className={`${hand.className} mt-2 text-[clamp(24px,3vw,34px)] text-brand-earth`}>You did it together! Tap the stars.</p>
              <div className="mt-6 flex gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setStars(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    className={`transition-transform duration-200 ${n <= stars ? "scale-110" : "opacity-30 grayscale hover:opacity-60"}`}
                  >
                    <Emoji e="⭐" className="h-14 w-14 sm:h-20 sm:w-20" />
                  </button>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={onFinish} className="rounded-full bg-brand-sage px-6 py-3 text-lg font-extrabold text-white hover:bg-brand-sagedark">
                  <Emoji e="📸" /> Share a photo
                </button>
                <button onClick={() => go(0)} className="rounded-full border-2 border-brand-line bg-white px-6 py-3 text-lg font-extrabold text-brand-sage">
                  Read it again
                </button>
              </div>
            </div>
          )}

          {page.kind !== "cover" && (
            <p className="pointer-events-none absolute bottom-3 right-6 text-xs font-bold text-brand-earth/40">{at}</p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            onClick={() => go(at - 1)}
            disabled={at === 0}
            className="whitespace-nowrap rounded-full bg-white/80 px-4 py-3 text-base font-extrabold sm:px-5 sm:text-lg text-brand-earth shadow-sm disabled:opacity-0"
          >
            ← Back
          </button>
          <span className="text-sm font-bold text-brand-earth/60 sm:hidden">
            {at + 1} of {pages.length}
          </span>
          <div className="hidden flex-wrap justify-center gap-1.5 sm:flex">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Page ${i + 1}`}
                className={"h-2.5 rounded-full transition-all " + (i === at ? "w-6 bg-brand-sage" : "w-2.5 " + (i < at ? "bg-brand-softsage" : "bg-[#D9CDB3]"))}
              />
            ))}
          </div>
          <button
            onClick={() => go(at + 1)}
            disabled={at === pages.length - 1}
            className="whitespace-nowrap rounded-full bg-brand-sage px-5 py-3 text-base font-extrabold text-white shadow-sm disabled:opacity-0 sm:px-6 sm:text-lg"
          >
            <span className="sm:hidden">Next →</span>
            <span className="hidden sm:inline">Turn the page →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
