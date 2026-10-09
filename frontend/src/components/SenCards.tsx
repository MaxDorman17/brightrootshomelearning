"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji, { EmojiText } from "@/components/Emoji";
import { getRole, isAuthenticated } from "@/lib/auth";
import type { Card } from "@/lib/sen";

/** Logged-in check shared by the SEN pages; returns the role once known. */
export function useSenRole() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole());
  }, [router]);
  return role;
}

/** The screen part of an SEN tool page: navbar, back link and banner. Hidden when printing. */
export function SenPage({ eyebrow = "SEN & Signing", title, intro, children }: { eyebrow?: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 print:hidden">
      <Link href="/make/sen" className="mb-4 inline-block text-sm font-bold text-brand-sage hover:underline">
        ← SEN & Signing
      </Link>
      <PageHero art="sen" tint={2}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-earth/70">{intro}</p>
      </PageHero>
      {children}
    </div>
  );
}

export function SenFrame({ children, printable }: { children: React.ReactNode; printable?: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <Navbar />
      </div>
      {printable && <div className="hidden bg-white text-black print:block">{printable}</div>}
      {children}
    </div>
  );
}

export function PrintButton({ label = "🖨️ Print" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-extrabold text-white hover:bg-brand-sagedark">
      <EmojiText text={label} />
    </button>
  );
}

/** One picture card on screen. Pass onClick to make it a toggle. */
export function PictureCard({ card, picked, onClick, size = "md" }: { card: Card; picked?: boolean; onClick?: () => void; size?: "md" | "lg" }) {
  const body = (
    <>
      <Emoji e={card.emoji} className={size === "lg" ? "h-24 w-24 text-7xl" : "h-12 w-12 text-4xl"} />
      <span className={"mt-2 text-center font-extrabold text-brand-charcoal " + (size === "lg" ? "text-2xl" : "text-sm")}>{card.label}</span>
    </>
  );
  const cls =
    "flex flex-col items-center justify-center rounded-2xl border-2 bg-white p-3 " +
    (picked ? "border-brand-sage ring-2 ring-brand-sage/40" : "border-brand-line") +
    (size === "lg" ? " aspect-square" : "");
  return onClick ? (
    <button type="button" onClick={onClick} aria-pressed={picked} className={cls + " transition-shadow hover:shadow-md"}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** A printed cut-out card: thick border, big picture, big word. */
export function PrintCard({ card, note, big }: { card: Card; note?: string; big?: boolean }) {
  return (
    <div
      className="flex break-inside-avoid flex-col items-center justify-center rounded-xl border-[3px] border-black p-3 text-center"
      style={{ minHeight: big ? "11cm" : "5.2cm" }}
    >
      <Emoji e={card.emoji} className={big ? "h-40 w-40 text-[8rem]" : "h-20 w-20 text-6xl"} />
      <p className={"mt-2 font-extrabold " + (big ? "text-5xl" : "text-xl")}>{card.label}</p>
      {note && <p className="mt-1 text-sm leading-snug">{note}</p>}
    </div>
  );
}

export function PrintTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-end justify-between border-b-2 border-black pb-2">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-sm">Bright Roots</p>
    </div>
  );
}
