import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Free home education guides",
  description: "Plain, practical guides for UK families who are new to home education, from a parent who has been there.",
};

export default function GuidesPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Free guides</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Help for families starting out.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6E5A46]">
          Short, practical guides for families who are new to home education. No sign-up needed.
        </p>

        <div className="mt-10 space-y-4">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block rounded-3xl border border-brand-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">{guide.minutes} minute read</p>
              <h2 className="mt-1 text-2xl font-black text-brand-charcoal">{guide.title}</h2>
              <p className="mt-2 leading-7 text-[#6E5A46]">{guide.summary}</p>
              <p className="mt-3 text-sm font-bold text-brand-sage">Read the guide →</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
