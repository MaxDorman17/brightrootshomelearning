"use client";

import { useEffect, useState } from "react";
import { KIND_INFO, MakeDetail } from "./common";

/** "Make it together": one big step at a time, easy to follow on a tablet at the table. */
export default function CookAlong({ item, onClose, onFinish }: { item: MakeDetail; onClose: () => void; onFinish: () => void }) {
  // Step 0 is "get everything ready"; the last page is the celebration.
  const total = item.steps.length + 2;
  const [page, setPage] = useState(0);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, total - 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [total, onClose]);

  const step = page >= 1 && page <= item.steps.length ? item.steps[page - 1] : null;
  const last = page === total - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-brand-white">
      <div className="flex items-center justify-between gap-3 border-b border-brand-line px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-sm font-extrabold text-brand-charcoal">
          {item.emoji} {item.title}
        </p>
        <div className="flex shrink-0 gap-2">
          {item.materials.length > 0 && (
            <button onClick={() => setShowList(!showList)} className="rounded-xl bg-brand-cream px-3 py-2 text-sm font-bold text-brand-earth">
              {showList ? "Hide list" : KIND_INFO[item.kind].materials}
            </button>
          )}
          <button onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-bold text-brand-earth/70 hover:bg-brand-cream">
            ✕ Close
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          {showList ? (
            <ul className="w-full max-w-md space-y-2 text-left">
              {item.materials.map((m, i) => (
                <li key={i} className="rounded-xl bg-brand-cream px-4 py-3 text-lg">
                  {m.qty && <b>{m.qty} </b>}
                  {m.name}
                </li>
              ))}
            </ul>
          ) : page === 0 ? (
            <>
              <p className="text-7xl">{item.emoji || "✨"}</p>
              <h2 className="mt-4 text-3xl font-black text-brand-charcoal sm:text-4xl">Let&apos;s make {item.title.toLowerCase()}!</h2>
              <p className="mt-3 max-w-md text-lg text-brand-earth/80">
                {item.kind === "recipe"
                  ? "Wash your hands, put on an apron and get your ingredients ready."
                  : "Clear a space, cover the table if it's messy, and gather everything you need."}
              </p>
              {item.materials.length > 0 && (
                <button onClick={() => setShowList(true)} className="mt-5 rounded-xl border-2 border-brand-line bg-white px-5 py-2.5 font-bold text-brand-sage">
                  See what you need
                </button>
              )}
            </>
          ) : step ? (
            <>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-softsage">
                Step {page} of {item.steps.length}
              </p>
              {step.grown_up && (
                <span className="mt-3 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-extrabold text-amber-800">🧑 Grown-up job</span>
              )}
              <p className="mt-5 text-2xl font-extrabold leading-snug text-brand-charcoal sm:text-4xl">{step.text}</p>
            </>
          ) : (
            <>
              <p className="text-7xl">🎉</p>
              <h2 className="mt-4 text-3xl font-black text-brand-charcoal sm:text-4xl">You did it!</h2>
              <p className="mt-3 text-lg text-brand-earth/80">Take a photo so you can remember it.</p>
              <button onClick={onFinish} className="mt-6 rounded-xl bg-brand-sage px-6 py-3 text-lg font-extrabold text-white">
                📸 We made this!
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-brand-line px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            onClick={() => {
              setShowList(false);
              setPage((p) => Math.max(p - 1, 0));
            }}
            disabled={page === 0}
            className="rounded-2xl border-2 border-brand-line bg-white px-5 py-3 text-lg font-extrabold text-brand-earth disabled:opacity-30"
          >
            ← Back
          </button>
          <div className="hidden flex-wrap justify-center gap-1.5 sm:flex">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={"h-2.5 w-2.5 rounded-full " + (i === page ? "bg-brand-sage" : i < page ? "bg-brand-softsage" : "bg-brand-line")} />
            ))}
          </div>
          {last ? (
            <button onClick={onClose} className="rounded-2xl bg-brand-charcoal px-5 py-3 text-lg font-extrabold text-white">
              Finish
            </button>
          ) : (
            <button
              onClick={() => {
                setShowList(false);
                setPage((p) => Math.min(p + 1, total - 1));
              }}
              className="rounded-2xl bg-brand-sage px-6 py-3 text-lg font-extrabold text-white"
            >
              {page === 0 ? "Start →" : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
