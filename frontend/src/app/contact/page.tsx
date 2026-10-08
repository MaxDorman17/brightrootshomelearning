import type { Metadata } from "next";
import Link from "next/link";
import { FacebookIcon, PublicShell } from "@/components/PublicSite";
import { FACEBOOK_URL, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the family behind Bright Roots Home Learning.",
};

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-tint blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Contact</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">We&apos;d love to hear from you</h1>
          <p className="mt-6 text-lg leading-8 text-[#6E5A46]">
            Whether you have a question before signing up, need a hand with your account, or have an idea to make
            Bright Roots better, drop us an email. We&apos;re a family too, so we&apos;ll usually reply within a
            couple of days.
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-8 flex flex-col gap-1 rounded-3xl border border-brand-line bg-brand-cream p-6 hover:border-brand-mist sm:p-8"
          >
            <span className="text-sm font-extrabold uppercase tracking-wider text-brand-softsage">Email us</span>
            <span className="break-all text-xl font-black text-brand-sage sm:text-2xl">{SUPPORT_EMAIL}</span>
          </a>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-4 rounded-3xl border border-brand-line bg-white p-6 hover:border-brand-mist sm:p-8"
          >
            <FacebookIcon className="h-10 w-10 shrink-0 text-[#1877F2]" />
            <span className="flex flex-col gap-1">
              <span className="text-sm font-extrabold uppercase tracking-wider text-brand-softsage">Follow us</span>
              <span className="text-lg font-black text-brand-sage">Bright Roots on Facebook →</span>
            </span>
          </a>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["/#faq", "Common questions", "Answers about children, trials, the council report and more."],
              ["/privacy", "Your data", "How we look after your family's information, and your rights."],
            ].map(([href, title, text]) => (
              <Link key={href} href={href} className="rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-mist">
                <p className="font-extrabold">{title} →</p>
                <p className="mt-1 text-sm text-[#6E5A46]">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
