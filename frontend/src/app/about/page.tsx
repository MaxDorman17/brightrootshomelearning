import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";

export const metadata: Metadata = {
  title: "About",
  description: "Why Bright Roots exists, who it's for and how it helps families organise home learning.",
};

const principles = [
  {
    title: "Calm, not cluttered",
    text: "One place for the week ahead and the record behind you, instead of a pile of separate trackers, notebooks and spreadsheets.",
  },
  {
    title: "Parents stay in charge",
    text: "You choose the subjects, plan the lessons and decide what each child works on. Bright Roots fits around your approach, not the other way round.",
  },
  {
    title: "Children get their own space",
    text: "Each child has their own login and a simple view of today's learning, their progress and their achievements.",
  },
  {
    title: "A record you can use",
    text: "Completed work, notes, feedback, quiz scores, spellings and reading build up into a record you can review, print and keep.",
  },
];

const whoFor = [
  "Families who home educate full time",
  "Parents who want a clear weekly plan for one child or several",
  "Families who use Oak National Academy lessons and want the results in one place",
  "Anyone who needs a tidy record of learning to look back on or share",
];

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-tint blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:py-24">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">About Bright Roots</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Helping families grow a calm, organised home learning routine.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6E5A46]">
            Home learning involves a lot of moving parts: lesson plans, worksheets, reading, spellings,
            quiz results and keeping a record of it all. Bright Roots brings those parts together so
            you can spend less time organising and more time learning together.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-black">What we believe</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="rounded-2xl border border-brand-line bg-brand-white p-6">
                <h3 className="text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E5A46]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">Who it&apos;s for</h2>
            <ul className="mt-6 space-y-3">
              {whoFor.map((item) => (
                <li key={item} className="flex gap-3 text-[#6E5A46]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-black text-brand-sage">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-brand-line bg-brand-cream p-6 sm:p-8">
            <h2 className="text-2xl font-black">One membership for the whole family</h2>
            <p className="mt-3 text-[#6E5A46]">
              £5.99 a month or £59 a year, with parent tools and multiple child accounts included.
              Start with a 7-day free trial. No card is needed to create your trial account.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-xl bg-brand-sage px-6 py-3.5 text-center text-sm font-extrabold text-white hover:bg-brand-sagedark"
              >
                Start 7-day free trial
              </Link>
              <Link
                href="/#demo"
                className="rounded-xl border border-[#D9D1C4] bg-white px-6 py-3.5 text-center text-sm font-extrabold text-brand-sage hover:bg-brand-cream"
              >
                Try the demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
