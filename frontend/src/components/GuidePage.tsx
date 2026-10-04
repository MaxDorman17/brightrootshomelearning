import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";

export const guideH2 = "mt-12 text-2xl font-black text-brand-charcoal sm:text-3xl";
export const guideP = "mt-4 leading-8 text-[#4A3B2C]";
export const guideList = "mt-4 list-disc space-y-2 pl-6 leading-8 text-[#4A3B2C]";
export const guideSteps = "mt-4 list-decimal space-y-3 pl-6 leading-8 text-[#4A3B2C]";

/** The shared frame for a free guide: back link, title, intro, the guide itself, then the free-trial box. */
export default function GuidePage({
  title,
  minutes,
  intro,
  offerTitle,
  offer,
  children,
}: {
  title: string;
  minutes: number;
  intro: React.ReactNode;
  offerTitle: string;
  offer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-bold text-brand-sage">
          <Link href="/guides" className="hover:underline">← All guides</Link>
        </p>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Free guide · {minutes} minute read</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-[#6E5A46]">{intro}</p>

        {children}

        <div className="mt-14 rounded-3xl bg-[#2F5D3A] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-black sm:text-3xl">{offerTitle}</h2>
          <p className="mt-3 max-w-xl leading-7 text-white/85">{offer}</p>
          <Link href="/signup" className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#2F5D3A] hover:opacity-95">
            Try it free for 14 days →
          </Link>
          <p className="mt-3 text-sm text-white/70">No card needed. £5.99 a month afterwards for the whole family.</p>
        </div>
      </article>
    </PublicShell>
  );
}
