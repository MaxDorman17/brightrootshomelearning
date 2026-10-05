"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MakeDetail, MakePhoto } from "@/components/make/common";
import Emoji from "@/components/Emoji";
import { getMakeItem } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { hand, serif } from "@/lib/fonts";

/** A Little Roots fridge card: one A5 page with the picture, what you need, the steps and things to say. */
export default function FridgeCardPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [item, setItem] = useState<MakeDetail | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    getMakeItem(id)
      .then((res) => setItem(res.data))
      .catch(() => setMissing(true));
  }, [id, router]);

  return (
    <div className="min-h-screen print:min-h-0">
      <style>{`@media print { @page { size: A5 portrait; margin: 7mm; } }`}</style>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 print:max-w-none print:p-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <Link href={`/make/${id}`} className="text-sm font-bold text-brand-sage hover:underline">
              ← Back to the activity
            </Link>
            <h1 className="mt-1 text-2xl font-extrabold text-brand-charcoal">Fridge card</h1>
            <p className="text-sm text-brand-earth/80">Prints on one A5 sheet, or choose A5 in your printer settings. Pop it on the fridge for later.</p>
          </div>
          <button
            onClick={() => window.print()}
            disabled={!item}
            className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark disabled:opacity-60"
          >
            🖨️ Print the card
          </button>
        </div>

        {missing ? (
          <p className="text-sm font-bold text-brand-charcoal">We couldn&apos;t find that activity.</p>
        ) : !item ? (
          <p className="text-sm text-brand-earth/70">Loading...</p>
        ) : (
          <article className="mx-auto w-full max-w-[148mm] rounded-3xl border-2 border-[#E3D8C1] bg-[#FDF9F0] p-6 text-brand-charcoal shadow-sm print:max-w-none print:rounded-2xl print:p-5 print:shadow-none [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
            <header className="flex items-center gap-4">
              <MakePhoto item={item} className="h-24 w-24 shrink-0 rounded-2xl print:h-[26mm] print:w-[26mm]" />
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-softsage">
                  Little Roots{item.category ? ` · ${item.category}` : ""} · {item.minutes || 10} min
                </p>
                <h2 className={`${serif.className} text-[26px] font-semibold leading-tight text-[#24452C]`}>
                  <Emoji e={item.emoji} /> {item.title}
                </h2>
                {item.summary && <p className="mt-1 text-[12px] leading-snug">{item.summary}</p>}
              </div>
            </header>

            {item.materials.length > 0 && (
              <section className="mt-4">
                <h3 className="text-[13px] font-extrabold text-[#24452C]">You&apos;ll need</h3>
                <ul className="mt-1 columns-2 gap-4 text-[12px] leading-snug">
                  {item.materials.map((m, i) => (
                    <li key={i} className="mb-0.5 break-inside-avoid">
                      ☐ {m.qty && `${m.qty} `}
                      {m.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-4">
              <h3 className="text-[13px] font-extrabold text-[#24452C]">What to do</h3>
              <ol className="mt-1 space-y-1 text-[12px] leading-snug">
                {item.steps.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF0E4] text-[11px] font-extrabold text-[#24452C]">{i + 1}</span>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ol>
            </section>

            {item.talk && item.talk.length > 0 && (
              <section className="mt-4 rounded-2xl bg-[#EAF0E4] px-4 py-3">
                <h3 className="text-[13px] font-extrabold text-[#24452C]">Say or ask</h3>
                <ul className={`${hand.className} mt-0.5 text-[19px] leading-tight text-[#24452C]`}>
                  {item.talk.map((t, i) => (
                    <li key={i}>&ldquo;{t}&rdquo;</li>
                  ))}
                </ul>
              </section>
            )}

            {(item.more || item.easier) && (
              <section className="mt-3 grid gap-3 text-[11.5px] leading-snug sm:grid-cols-2 print:grid-cols-2">
                {item.more && (
                  <p>
                    <b>Ready for more?</b> {item.more}
                  </p>
                )}
                {item.easier && (
                  <p>
                    <b>Tired today?</b> {item.easier}
                  </p>
                )}
              </section>
            )}

            {item.tips && (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-snug">
                <b>Keep it safe:</b> {item.tips}
              </p>
            )}

            <footer className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#E3D8C1] pt-3 text-[12px]">
              <span className="font-bold">
                We did it! ☐ &nbsp;☆ ☆ ☆ ☆ ☆
              </span>
              <span className="text-[10px] text-brand-earth/70">brightrootshomelearning.co.uk</span>
            </footer>
          </article>
        )}
      </main>
    </div>
  );
}
