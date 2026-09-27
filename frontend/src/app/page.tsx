"use client";

import Link from "next/link";
import HomeDemo from "@/components/HomeDemo";
import NewsletterSignup from "@/components/NewsletterSignup";
import { PublicFooter, PublicHeader, useMemberHome } from "@/components/PublicSite";

const featureGroups = [
  {
    name: "Plan",
    blurb: "Get the week sorted in one sitting.",
    items: [
      ["🗓️", "Weekly planner", "Plan by day, child and subject, and move work around when life happens."],
      ["⏰", "Your timetable", "Set your family's subjects and times once, then build on it every week."],
      ["📝", "Lesson plans", "Write your own lessons with steps, resources and notes, and reuse them."],
      ["🌳", "Oak National Academy", "Browse Oak units and add lessons straight into your week."],
      ["🖨️", "Print the week", "A tidy printable plan for the fridge or the folder."],
    ],
  },
  {
    name: "Learn",
    blurb: "Everything the children need, in their own space.",
    items: [
      ["👧", "Child dashboards", "Each child logs in to see just today's learning and ticks it off themselves."],
      ["📚", "Reading log", "Track books, chapters and reading time for every child."],
      ["🔤", "Spellings", "Weekly word lists, practice rounds and the tricky words to revisit."],
      ["🎮", "Learning games", "Spelling Bee, times tables, maths sprints and more, using their own words."],
      ["⏱️", "Study timer", "A friendly focus timer that logs how long they worked."],
    ],
  },
  {
    name: "Progress",
    blurb: "See how they're really getting on.",
    items: [
      ["📊", "Results", "Quiz scores, test results and spelling scores in one place."],
      ["💬", "Review & feedback", "Look over finished work and leave encouraging notes they'll see."],
      ["📄", "Reports", "Clear progress reports you can print or save as a PDF."],
      ["🏛️", "Council report", "Pull your records into a report for your local authority in minutes."],
      ["📷", "Moments & photos", "Capture the baking, the nature walks and the proud moments as they happen."],
    ],
  },
  {
    name: "Family",
    blurb: "Keep everyone motivated and on track.",
    items: [
      ["⭐", "Stars & rewards", "Children earn stars for their learning and swap them for rewards you choose."],
      ["🏅", "Badges", "Milestone badges to celebrate effort and streaks."],
      ["🔔", "Reminders", "Daily reminders and an optional summary email so nothing slips."],
      ["🎨", "Their own look", "Children design an avatar and pick colours to make it feel like theirs."],
    ],
  },
];

const steps = [
  ["Start your free trial", "Create your family account in a couple of minutes. No card needed."],
  ["Add your children", "Give each child their own simple login, avatar and colours."],
  ["Set your timetable", "Choose your subjects and when you like to teach them."],
  ["Plan your first week", "Add lessons, Oak units or your own plans, and you're away."],
];

const faqs = [
  [
    "How many children can I add?",
    "As many as you need. One family membership covers every child in your home, each with their own login.",
  ],
  [
    "Do my children need their own email address?",
    "No. You create a simple username and password for each child from your parent account.",
  ],
  [
    "Do I have to follow a set curriculum?",
    "Not at all. You choose the subjects and plan the lessons. Oak National Academy lessons are there if you want them, but you can plan everything yourself.",
  ],
  [
    "Can it help with my local authority?",
    "Yes. The council report pulls together the work, results, reading and notes you've already recorded, so you have a clear summary to share.",
  ],
  [
    "What happens when my free trial ends?",
    "You can choose monthly or yearly membership from your account. If you decide not to carry on, you won't be charged, because no card is taken for the trial.",
  ],
  [
    "Is my family's information safe?",
    "Your family's data is private to your account, passwords are stored securely, and we never sell or share your information.",
  ],
  [
    "Does it work on a phone or tablet?",
    "Yes. Bright Roots works in any modern browser on a phone, tablet or computer, so children can use a tablet while you plan on your laptop.",
  ],
];

const examples = [
  ["Monday", "Maths", "Fractions & percentages", "Complete"],
  ["Monday", "English", "Persuasive writing", "In progress"],
  ["Tuesday", "Science", "Forces and motion", "Planned"],
];

function Eyebrow({ children, className = "text-brand-softsage" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${className}`}>{children}</p>;
}

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
                Less time organising.
                <span className="text-brand-sage"> More time learning together.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E5A46]">
                Bright Roots is a home learning planner for families. Plan the week, give each
                child their own space to learn, and build a record of everything they achieve,
                all in one calm place.
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

        <section id="story" className="scroll-mt-16 bg-brand-cream py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:items-center">
            <div className="lg:col-span-3">
              <Eyebrow>Our story</Eyebrow>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Made by a family, for families</h2>
              <div className="mt-5 space-y-4 leading-7 text-[#6E5A46]">
                <p>
                  When we started home learning with our own children, we had notebooks, printouts,
                  spreadsheets, bookmarks and sticky notes everywhere. Every evening went on working out
                  what was next, what had been finished and where we&apos;d written it down.
                </p>
                <p>
                  We realised we were spending more time organising the learning than actually being
                  with our children, teaching, exploring and learning alongside them. That wasn&apos;t
                  why we chose home education.
                </p>
                <p>
                  So we built Bright Roots: one calm place for the plan, the learning and the record of
                  it all. It&apos;s the tool we wished we&apos;d had, and we use it with our own family
                  every week.
                </p>
              </div>
              <Link href="/about" className="mt-6 inline-block text-sm font-extrabold text-brand-sage hover:underline">
                Read more about Bright Roots →
              </Link>
            </div>
            <div className="grid gap-4 lg:col-span-2">
              {[
                ["Before", "Evenings spent juggling notebooks, tabs and printouts."],
                ["After", "A plan in minutes, and more time together at the kitchen table."],
              ].map(([label, text], i) => (
                <div
                  key={label}
                  className={`rounded-2xl border p-6 ${i ? "border-brand-mist bg-brand-tint" : "border-brand-line bg-brand-white"}`}
                >
                  <p className={`text-xs font-extrabold uppercase tracking-wider ${i ? "text-brand-sage" : "text-[#6E5A46]/70"}`}>
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-extrabold">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Everything your home learning needs</h2>
              <p className="mt-4 text-[#6E5A46]">
                Not another pile of disconnected trackers. Bright Roots connects the plan, the work
                and the record of what happened, for every child in your family.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {featureGroups.map((group) => (
                <div key={group.name} className="rounded-3xl border border-brand-line bg-brand-cream p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-2xl font-black text-brand-sage">{group.name}</h3>
                    <p className="text-sm font-semibold text-[#6E5A46]">{group.blurb}</p>
                  </div>
                  <ul className="mt-5 space-y-4">
                    {group.items.map(([icon, title, text]) => (
                      <li key={title} className="flex gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-white text-xl">
                          {icon}
                        </span>
                        <div>
                          <p className="font-extrabold">{title}</p>
                          <p className="text-sm leading-6 text-[#6E5A46]">{text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-16 bg-brand-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <Eyebrow>A day with Bright Roots</Eyebrow>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Something for everyone at the table</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                {
                  who: "For parents",
                  icon: "☕",
                  points: [
                    "Plan the whole week in one sitting, for every child.",
                    "See at a glance what's done, what's next and who needs a hand.",
                    "Leave feedback and approve reward requests from your phone.",
                    "Have reports and your council record ready whenever you need them.",
                  ],
                },
                {
                  who: "For children",
                  icon: "🎒",
                  points: [
                    "Log in to their own space and see exactly what today looks like.",
                    "Tick off lessons, log reading and practise spellings themselves.",
                    "Earn stars and badges, and play learning games when the work's done.",
                    "Make it theirs with an avatar and favourite colours.",
                  ],
                },
              ].map((panel) => (
                <div key={panel.who} className="rounded-3xl border border-brand-line bg-brand-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-2xl">{panel.icon}</span>
                    <h3 className="text-2xl font-black">{panel.who}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {panel.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[#6E5A46]">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-black text-brand-sage">
                          ✓
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 max-w-2xl">
              <Eyebrow>Try it</Eyebrow>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Have a click around</h2>
              <p className="mt-4 text-[#6E5A46]">
                This is an example family with two children. Mark lessons done in the child&apos;s view
                and watch the planner and progress update, just like the real thing.
              </p>
            </div>
            <HomeDemo />
          </div>
        </section>

        <section id="get-started" className="scroll-mt-16 bg-brand-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <Eyebrow>Getting started</Eyebrow>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Up and running in four steps</h2>
              <p className="mt-4 text-[#6E5A46]">
                Most families have their first week planned in one evening. A checklist on your home
                page walks you through it.
              </p>
            </div>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([title, text], i) => (
                <li key={title} className="rounded-2xl border border-brand-line bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sage font-black text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-extrabold">{title}</h3>
                  <p className="mt-1 text-sm text-[#6E5A46]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-16 bg-[#2E342F] py-20 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <Eyebrow className="text-brand-lime">Pricing</Eyebrow>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Simple family pricing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              One membership for the whole family, with every feature and every child included.
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
                <span>✓ Unlimited child accounts</span>
                <span>✓ Weekly planner & timetable</span>
                <span>✓ Lesson plans & Oak lessons</span>
                <span>✓ Reading, spellings & games</span>
                <span>✓ Results, reports & council report</span>
                <span>✓ Stars, rewards & badges</span>
                <span>✓ Moments & photo gallery</span>
                <span>✓ Reminders & summary emails</span>
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

        <section id="faq" className="scroll-mt-16 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Frequently asked questions</h2>
            <div className="mt-8 space-y-3">
              {faqs.map(([q, a]) => (
                <details key={q} className="group rounded-2xl border border-brand-line bg-white p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold">
                    {q}
                    <span className="text-xl text-brand-sage transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#6E5A46]">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSignup />

        <section className="border-t border-brand-line py-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-black">Ready to spend more time learning together?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#6E5A46]">
              Bright Roots gives your family one home for the week ahead and the record behind you.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              {!memberHome && (
                <Link
                  href="/signup"
                  className="rounded-xl bg-brand-sage px-6 py-3.5 text-sm font-extrabold text-white hover:bg-brand-sagedark"
                >
                  Start 7-day free trial
                </Link>
              )}
              <Link
                href={memberHome || "/login"}
                className={
                  memberHome
                    ? "rounded-xl bg-brand-sage px-6 py-3.5 text-sm font-extrabold text-white hover:bg-brand-sagedark"
                    : "rounded-xl border border-[#D9D1C4] bg-white px-6 py-3.5 text-sm font-extrabold text-brand-sage hover:bg-brand-cream"
                }
              >
                {memberHome ? "Open your dashboard" : "Member login"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
