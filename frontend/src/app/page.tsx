"use client";

import Link from "next/link";
import HomeDemo from "@/components/HomeDemo";
import { PublicFooter, PublicHeader, useMemberHome } from "@/components/PublicSite";

const features = [
  {
    title: "Weekly Planner",
    text: "Plan lessons by day, child and subject, then move work around without rebuilding the whole week.",
  },
  {
    title: "Progress & Results",
    text: "See completed work, Oak quiz scores, spelling results, reading progress and feedback in one place.",
  },
  {
    title: "Child Accounts",
    text: "Each child gets their own simple view for today’s learning, progress, achievements and extra work.",
  },
  {
    title: "Reading & Spellings",
    text: "Track books, chapter progress, worksheets, weekly spelling lists, practice rounds and weak words.",
  },
  {
    title: "Oak Learning",
    text: "Organise Oak units and lessons, pull quiz results into Bright Roots and keep learning records together.",
  },
  {
    title: "Reports & Records",
    text: "Turn day-to-day home learning into a clear record you can review, print and keep for the future.",
  },
];

const examples = [
  ["Monday", "Maths", "Fractions & percentages", "Complete"],
  ["Monday", "English", "Persuasive writing", "In progress"],
  ["Tuesday", "Science", "Forces and motion", "Planned"],
];

export default function HomePage() {
  const memberHome = useMemberHome();

  return (
    <div className="min-h-screen bg-brand-white text-[#2E342F]">
      <PublicHeader memberHome={memberHome} />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-tint blur-3xl" />
          <div className="absolute -right-24 top-36 h-80 w-80 rounded-full bg-[#F1D9C9] opacity-60 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-brand-mist bg-brand-tint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-brand-sage">
                Home learning, organised
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                One calm place for your family&apos;s
                <span className="text-brand-sage"> home learning.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E5A46]">
                Bright Roots brings planning, lessons, progress, reading, spellings,
                results, feedback and records together so home learning feels less
                scattered and more manageable.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-xl bg-brand-sage px-6 py-3.5 text-center text-sm font-extrabold text-white hover:bg-brand-sagedark"
                >
                  Start 7-day free trial
                </Link>
                <a
                  href="#demo"
                  className="rounded-xl border border-[#D9D1C4] bg-white px-6 py-3.5 text-center text-sm font-extrabold text-brand-sage hover:bg-brand-cream"
                >
                  Try the demo
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#6E5A46]">
                <span>✓ Parent & child accounts</span>
                <span>✓ Secure family data</span>
                <span>✓ Works on phone, tablet & computer</span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-brand-line bg-white p-4 shadow-2xl shadow-brand-sage/10 sm:p-6">
              <div className="rounded-2xl bg-brand-cream p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-brand-softsage">This week</p>
                    <h2 className="mt-1 text-xl font-extrabold">Family Planner</h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-sage">
                    8 lessons
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {examples.map(([day, subject, title, state]) => (
                    <div key={title} className="rounded-xl border border-brand-line bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-brand-softsage">{day} · {subject}</p>
                          <p className="mt-1 font-extrabold">{title}</p>
                        </div>
                        <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[10px] font-extrabold text-brand-sage">
                          {state}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  ["12", "Completed"],
                  ["84%", "Quiz score"],
                  ["5", "Books read"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-brand-line p-4">
                    <p className="text-2xl font-black text-brand-sage">{value}</p>
                    <p className="mt-1 text-xs font-bold text-[#6E5A46]/70">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 bg-brand-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">
                Everything in one place
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Built around how home learning actually works
              </h2>
              <p className="mt-4 text-[#6E5A46]">
                Not another pile of disconnected trackers. Bright Roots connects the
                plan, the work and the record of what happened.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-brand-line bg-brand-white p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint font-black text-brand-sage">
                    BR
                  </div>
                  <h3 className="text-lg font-extrabold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6E5A46]">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Try it</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Have a click around</h2>
              <p className="mt-4 text-[#6E5A46]">
                This is an example family with two children. Mark lessons done in the child&apos;s view
                and watch the planner and progress update, just like the real thing.
              </p>
            </div>
            <HomeDemo />
          </div>
        </section>

        <section id="how-it-works" className="bg-brand-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">How it works</p>
                <h2 className="mt-3 text-3xl font-black sm:text-4xl">From Monday morning to your end-of-term record.</h2>
                <p className="mt-4 text-[#6E5A46]">
                  Plan the week, let each child see what they need to do, record
                  completion and results, then review progress without piecing it
                  together from five different apps.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  ["1", "Plan", "Build the week by child, day and subject."],
                  ["2", "Learn", "Children open their own dashboard and work through what is assigned."],
                  ["3", "Record", "Completion, notes, feedback and results become part of the learning record."],
                  ["4", "Review", "Parents can see progress, reports and areas that need attention."],
                ].map(([num, title, text]) => (
                  <div key={num} className="flex gap-4 rounded-2xl border border-brand-line bg-white p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-sage font-black text-white">{num}</div>
                    <div>
                      <h3 className="font-extrabold">{title}</h3>
                      <p className="mt-1 text-sm text-[#6E5A46]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-16 bg-[#2E342F] py-20 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-lime">Pricing</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Simple family pricing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              One membership for the whole family, with parent tools and multiple child accounts included.
            </p>

            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-8 text-left">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wider text-brand-lime">Family membership</p>
                  <h3 className="mt-2 text-2xl font-black">Bright Roots Family</h3>
                  <p className="mt-2 text-sm text-white/60">7-day free trial · cancel anytime</p>
                </div>

                <div className="sm:text-right">
                  <div className="text-4xl font-black">
                    £5.99
                    <span className="text-base font-bold text-white/60">/month</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-brand-lime">
                    or £59/year
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 text-sm text-white/85 sm:grid-cols-2">
                <span>✓ Parent dashboard</span>
                <span>✓ Multiple child accounts</span>
                <span>✓ Weekly planning</span>
                <span>✓ Progress & reports</span>
                <span>✓ Reading & spellings</span>
                <span>✓ Oak lesson tools</span>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70">
                Annual membership saves £12.88 compared with paying monthly for a full year.
              </div>
            </div>

            <Link
              href="/signup"
              className="mt-8 inline-block rounded-xl bg-brand-lime px-6 py-3.5 text-sm font-extrabold text-[#243128] hover:bg-brand-lime"
            >
              Start 7-day free trial
            </Link>
            <p className="mt-4 text-sm text-white/60">
              No card is needed to create your trial account.
            </p>
          </div>
        </section>

        <section className="border-t border-brand-line py-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-black">Ready to make home learning feel more organised?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#6E5A46]">
              Bright Roots gives your family one home for the week ahead and the record behind you.
            </p>
            <Link
              href={memberHome || "/login"}
              className="mt-7 inline-block rounded-xl bg-brand-sage px-6 py-3.5 text-sm font-extrabold text-white hover:bg-brand-sagedark"
            >
              {memberHome ? "Open your dashboard" : "Member login"}
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
