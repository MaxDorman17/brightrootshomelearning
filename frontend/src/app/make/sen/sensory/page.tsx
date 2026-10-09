"use client";

import { useEffect, useRef, useState } from "react";
import { PrintButton, PrintTitle, SenFrame, SenPage, useSenRole } from "@/components/SenCards";
import Emoji from "@/components/Emoji";
import ReadAloud from "@/components/ReadAloud";
import { SENSE_HELP, SENSES, SENSORY, type Sense, type SensoryActivity, sensoryArt } from "@/lib/sensory";

const STEPS = [
  { key: "need", label: "You need" },
  { key: "how", label: "How" },
  { key: "windDown", label: "Wind down" },
  { key: "safety", label: "Safety" },
] as const;

function Picture({ a, className }: { a: SensoryActivity; className: string }) {
  const art = sensoryArt(a);
  // eslint-disable-next-line @next/next/no-img-element
  return art ? <img src={art} alt="" className={className + " object-contain"} /> : <Emoji e={a.emoji} className={className + " text-6xl"} />;
}

/** One activity as a printed card: picture, title and the four steps. */
function PrintActivity({ a, big }: { a: SensoryActivity; big?: boolean }) {
  return (
    <div className="flex break-inside-avoid flex-col rounded-xl border-[3px] border-black p-4">
      <div className={big ? "flex flex-col items-center text-center" : "flex items-center gap-4"}>
        <Picture a={a} className={big ? "h-[10cm] w-[10cm]" : "h-24 w-24"} />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">{a.sense}</p>
          <p className={"font-extrabold " + (big ? "text-5xl" : "text-2xl")}>{a.title}</p>
        </div>
      </div>
      <dl className={big ? "mt-6 space-y-3 text-2xl" : "mt-3 space-y-1.5 text-sm"}>
        {STEPS.map((s) => (
          <div key={s.key}>
            <dt className="inline font-extrabold">{s.label}: </dt>
            <dd className="inline">{a[s.key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The Sensory Activities Pack: activity cards grouped by sense, each one printable on its own. */
export default function SensoryPage() {
  const role = useSenRole();
  const [sense, setSense] = useState<Sense | "">("");
  const [open, setOpen] = useState<SensoryActivity | null>(null);
  const shown = SENSORY.filter((a) => !sense || a.sense === sense);
  const detail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) detail.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [open]);

  return (
    <SenFrame
      printable={
        <div className="p-6">
          {open ? (
            <>
              <PrintTitle title="Sensory activity" />
              <PrintActivity a={open} big />
            </>
          ) : (
            <>
              <PrintTitle title={sense ? `${sense} activities` : "Sensory activities"} />
              <div className="grid grid-cols-2 gap-3">
                {shown.map((a) => (
                  <PrintActivity key={a.slug} a={a} />
                ))}
              </div>
            </>
          )}
        </div>
      }
    >
      <SenPage
        title="Sensory activities"
        intro={
          role === "child"
            ? "Fun things to touch, hear, see, smell and do. Pick one with a grown-up."
            : "Simple sensory play using things you already have at home. Each card says what you need, how to play, how to wind down and how to keep it safe. Tap one to open it."
        }
      >
        <div className="flex flex-wrap gap-2">
          {(["", ...SENSES] as const).map((s) => (
            <button
              key={s || "all"}
              onClick={() => {
                setSense(s);
                setOpen(null);
              }}
              className={
                "rounded-xl px-4 py-2 text-sm font-extrabold " +
                (sense === s ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
              }
            >
              {s || "Everything"}
            </button>
          ))}
          <button
            onClick={() => setOpen(shown[Math.floor(Math.random() * shown.length)])}
            className="rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage"
          >
            🎲 Pick one for me
          </button>
          <PrintButton label={open ? "🖨️ Print this card" : "🖨️ Print these cards"} />
        </div>
        {sense && (
          <p className="mt-2 text-sm text-brand-earth/70">
            {sense}: {SENSE_HELP[sense]}.
          </p>
        )}

        {open && (
          <div ref={detail} className="brand-card mx-auto mt-6 max-w-2xl scroll-mt-24 p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Picture a={open} className="h-48 w-48 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">{open.sense}</p>
                <h2 className="text-2xl font-extrabold text-brand-charcoal">{open.title}</h2>
                <dl className="mt-3 space-y-2 text-brand-earth/90">
                  {STEPS.map((s) => (
                    <div key={s.key}>
                      <dt className="text-sm font-extrabold text-brand-charcoal">{s.label}</dt>
                      <dd>{open[s.key]}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ReadAloud text={`${open.title}. ${STEPS.map((s) => `${s.label}: ${open[s.key]}`).join(" ")}`} />
                  <button onClick={() => setOpen(null)} className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-extrabold text-brand-earth hover:bg-brand-tint">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((a) => (
            <button
              key={a.slug}
              onClick={() => setOpen(a)}
              aria-pressed={open?.slug === a.slug}
              className={
                "brand-card flex flex-col items-center p-4 text-center transition-shadow hover:shadow-md " +
                (open?.slug === a.slug ? "ring-2 ring-brand-sage/50" : "")
              }
            >
              <Picture a={a} className="h-28 w-28" />
              <p className="mt-2 font-extrabold text-brand-charcoal">{a.title}</p>
              <p className="mt-1 text-sm text-brand-earth/70">{a.how}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-softsage">{a.sense}</p>
            </button>
          ))}
        </div>
      </SenPage>
    </SenFrame>
  );
}
