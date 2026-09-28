"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HomeDemo from "@/components/HomeDemo";
import NewsletterSignup from "@/components/NewsletterSignup";
import { PublicFooter, PublicHeader, useMemberHome } from "@/components/PublicSite";
import { HandNote, Sprig } from "@/components/Decor";
import { hand, serif } from "@/lib/fonts";

// Fixed colours for the public pages, so they never pick up a family's theme.
const C = {
  green: "#2F5D3A",
  deep: "#24452C",
  earth: "#6E5A46",
  ink: "#2E342F",
  cream: "#FBF6EC",
  paper: "#FFFDF8",
  sage: "#E9EEE1",
  sand: "#F4EBDB",
  line: "#E4DCCD",
};

const featureGroups = [
  {
    name: "Plan",
    icon: "🗓️",
    tint: "#E7EEE0",
    blurb: "Get the week sorted in one sitting.",
    items: ["Weekly planner", "Your timetable", "Lesson plans", "Oak National Academy lessons", "Print the week"],
  },
  {
    name: "Learn",
    icon: "📚",
    tint: "#F3EBDD",
    blurb: "Everything the children need, in their own space.",
    items: ["Child dashboards", "Reading log", "Spellings", "Learning games", "Cookbook & Craft Corner"],
  },
  {
    name: "Progress",
    icon: "🌱",
    tint: "#E7EEE0",
    blurb: "See how they're really getting on.",
    items: ["Results & quiz scores", "Review & feedback", "Printable reports", "Council report", "Moments & photos"],
  },
  {
    name: "Family",
    icon: "🏡",
    tint: "#F3EBDD",
    blurb: "Keep everyone motivated and on track.",
    items: ["Stars & rewards", "Badges", "Reminders & phone notifications", "Avatars & colour themes"],
  },
];

const steps = [
  ["Start your free trial", "Create your family account in a couple of minutes. No card needed."],
  ["Add your children", "Give each child their own simple login, avatar and colours."],
  ["Set your timetable", "Choose your subjects and when you like to teach them."],
  ["Plan your first week", "Add lessons, Oak units or your own plans, and you're away."],
];

const faqs = [
  ["How many children can I add?", "As many as you need. One family membership covers every child in your home, each with their own login."],
  ["Do my children need their own email address?", "No. You create a simple username and password for each child from your parent account."],
  ["Do I have to follow a set curriculum?", "Not at all. You choose the subjects and plan the lessons. Oak National Academy lessons are there if you want them, but you can plan everything yourself."],
  ["Can it help with my local authority?", "Yes. The council report pulls together the work, results, reading and notes you've already recorded, so you have a clear summary to share."],
  ["What happens when my free trial ends?", "You can choose monthly or yearly membership from your account. If you decide not to carry on, you won't be charged, because no card is taken for the trial."],
  ["Is my family's information safe?", "Your family's data is private to your account, passwords are stored securely, and we never sell or share your information."],
  ["Does it work on a phone or tablet?", "Yes. Bright Roots works on any phone, tablet or computer, and you can add it to your home screen like an app."],
];

const week = [
  ["Mon", [["#FBE3DA", "Maths"], ["#E4ECF7", "English"], ["#FBF0D0", "Reading"]]],
  ["Tue", [["#EDE4F6", "Science"], ["#E3EFE3", "Art"]]],
  ["Wed", [["#FBE3DA", "Maths"], ["#FBF0D0", "Spellings"], ["#E3EFE3", "Nature walk"]]],
  ["Thu", [["#E4ECF7", "History"], ["#EDE4F6", "Coding"]]],
  ["Fri", [["#E3EFE3", "Baking"], ["#FBE3DA", "Maths"]]],
] as const;

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`${serif.className} text-3xl font-semibold leading-tight sm:text-4xl ${className}`} style={{ color: C.deep }}>
      {children}
    </h2>
  );
}

function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white" style={{ background: C.green }}>
      ✓
    </span>
  );
}

/** The little week planner shown on the laptop in the hero and in "See it in action". */
function MiniWeek({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <p className="mb-2 text-xs font-bold" style={{ color: C.ink }}>This week</p>
      <div className="grid grid-cols-5 gap-1.5">
        {week.map(([day, items]) => (
          <div key={day}>
            <p className="mb-1 text-[10px] font-bold text-[#8C7B66]">{day}</p>
            <div className="space-y-1">
              {items.slice(0, compact ? 2 : 3).map(([bg, label], i) => (
                <div key={i} className="truncate rounded-md px-1.5 py-1 text-[9px] font-semibold text-[#4A3B2C]" style={{ background: bg }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const memberHome = useMemberHome();
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("deleted")) setDeleted(true);
  }, []);

  const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-green-900/15 transition-opacity hover:opacity-95";
  const ghostBtn = "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold transition-colors hover:bg-white";

  return (
    <div className="min-h-screen" style={{ background: C.cream, color: C.ink }}>
      <PublicHeader memberHome={memberHome} />

      <main>
        {deleted && (
          <div className="border-b px-4 py-3 text-center text-sm font-semibold" style={{ background: C.sage, borderColor: C.line, color: C.green }}>
            Your account and all your family&apos;s information have been deleted. Thank you for using Bright Roots.
          </div>
        )}

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-16 lg:pt-14">
            <Sprig className="absolute left-0 top-60 hidden h-40 w-auto opacity-80 2xl:block" />
            <div className="relative lg:pl-4 2xl:pl-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: C.earth }}>Home learning that feels like home</p>
              <h1 className={`${serif.className} mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-[2.75rem] xl:text-[3.1rem]`} style={{ color: C.deep }}>
                <span className="lg:whitespace-nowrap">Plan less. Learn more.</span>
                <br />
                Grow together.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8" style={{ color: C.earth }}>
                Bright Roots is a calm home learning planner for families. Plan the week, give each child their own
                space to learn, and keep a record of everything they achieve.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={memberHome || "/signup"} className={primaryBtn} style={{ background: C.green }}>
                  {memberHome ? "Open your dashboard" : "Start your free trial"} <span aria-hidden>→</span>
                </Link>
                <a href="#demo" className={ghostBtn} style={{ borderColor: C.line, color: C.green }}>
                  Try the demo
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold" style={{ color: C.earth }}>
                <span>🗓️ Weekly planning</span>
                <span>👨‍👩‍👧 Parent & child logins</span>
                <span>📱 Phone, tablet & computer</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-[#6E5A46]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/login-bg-2.jpg" alt="A sunny home learning desk with books, a mug and plants" className="h-[320px] w-full object-cover object-center sm:h-[420px]" />
                {/* The "laptop" showing a week in Bright Roots */}
                <div className="absolute left-1/2 top-1/2 w-[78%] max-w-md -translate-x-1/2 -translate-y-[45%]">
                  <div className="rounded-t-2xl border-[6px] border-[#2B2F2C] bg-[#F7F3EA] p-2 shadow-2xl">
                    <MiniWeek />
                  </div>
                  <div className="mx-auto h-3 w-[112%] -translate-x-[5.5%] rounded-b-xl bg-gradient-to-b from-[#C9C4BA] to-[#9D988E]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section id="story" className="relative scroll-mt-16 overflow-hidden py-16 sm:py-20" style={{ background: C.sage }}>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative mx-auto w-full max-w-sm">
              <Sprig className="absolute -left-10 bottom-4 h-36 w-auto" />
              <Sprig className="absolute -right-8 bottom-10 h-28 w-auto" flip />
              <div className="relative rotate-[-3deg] bg-white p-3 pb-4 shadow-xl shadow-[#6E5A46]/20">
                <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-[#E8D9B8]/80" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero/story.jpg" alt="Children reading and drawing together" className="aspect-[4/3] w-full object-cover" />
                <p className={`${hand.className} mt-3 text-center text-xl leading-6`} style={{ color: C.earth }}>
                  Learning looks different here, and that&apos;s a good thing ♡
                </p>
              </div>
            </div>
            <div className="relative">
              <H2>Made by a family, for families</H2>
              <div className="mt-5 space-y-4 leading-7" style={{ color: C.earth }}>
                <p>
                  When we started home learning with our own children, we had notebooks, printouts, spreadsheets and
                  sticky notes everywhere. Every evening went on working out what was next and where we&apos;d written it down.
                </p>
                <p>
                  We were spending more time organising the learning than being with our children. So we built Bright
                  Roots: one calm place for the plan, the learning and the record of it all.
                </p>
              </div>
              <Link href="/about" className={`${ghostBtn} mt-7`} style={{ borderColor: C.green, color: C.green }}>
                Read our story <span aria-hidden>→</span>
              </Link>
              <HandNote className="mt-6 hidden rotate-[-4deg] text-right sm:block">
                Curious children, brighter tomorrows
              </HandNote>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative scroll-mt-16 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 text-center">
              <Sprig className="hidden h-12 w-auto sm:block" />
              <H2>Everything your home learning needs</H2>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-center" style={{ color: C.earth }}>
              Not another pile of disconnected trackers. The plan, the work and the record of what happened, for every child.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featureGroups.map((g) => (
                <div key={g.name} className="flex flex-col rounded-3xl p-6 text-center shadow-sm" style={{ background: g.tint }}>
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-4xl shadow-sm">{g.icon}</span>
                  <h3 className={`${serif.className} mt-4 text-2xl font-semibold`} style={{ color: C.deep }}>{g.name}</h3>
                  <p className="mt-1 text-sm font-semibold" style={{ color: C.earth }}>{g.blurb}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 text-sm" style={{ color: C.earth }}>
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For parents / children */}
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3">
              <Sprig className="h-10 w-auto" />
              <H2>A space for everyone</H2>
              <Sprig className="h-10 w-auto" flip />
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                {
                  who: "For parents",
                  art: "☕",
                  bg: C.sand,
                  points: [
                    "Plan the whole week in one sitting, for every child",
                    "See what's done, what's next and who needs a hand",
                    "Reports and your council record ready whenever you need them",
                  ],
                },
                {
                  who: "For children",
                  art: "🌈",
                  bg: C.sage,
                  points: [
                    "Their own space showing exactly what today looks like",
                    "Tick off lessons, log reading and practise spellings",
                    "Earn stars and badges, play games and make it their own",
                  ],
                },
              ].map((p) => (
                <div key={p.who} className="relative flex items-center gap-4 overflow-hidden rounded-3xl p-7" style={{ background: p.bg }}>
                  <div className="flex-1">
                    <h3 className={`${serif.className} text-2xl font-semibold`} style={{ color: C.deep }}>{p.who}</h3>
                    <ul className="mt-4 space-y-3">
                      {p.points.map((t) => (
                        <li key={t} className="flex gap-3 text-sm leading-6" style={{ color: C.earth }}>
                          <Check />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="hidden text-7xl sm:block" aria-hidden>{p.art}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="scroll-mt-16 border-y py-16 sm:py-20" style={{ background: C.paper, borderColor: C.line }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <H2>See it in action</H2>
                <p className="mt-3 max-w-2xl" style={{ color: C.earth }}>
                  This is an example family with two children. Mark lessons done in the child&apos;s view and watch the
                  planner and progress update, just like the real thing.
                </p>
              </div>
              <p className={`${hand.className} hidden text-2xl lg:block`} style={{ color: "#4F6B4A" }}>A tiny peek inside ↓</p>
            </div>
            <div className="mt-8">
              <HomeDemo />
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="get-started" className="relative scroll-mt-16 overflow-hidden py-14" style={{ background: C.sage }}>
          <Sprig className="absolute bottom-0 left-2 hidden h-28 w-auto lg:block" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:items-center">
              <div>
                <H2>Four simple steps</H2>
                <p className="mt-2" style={{ color: C.earth }}>Most families have their first week planned in one evening.</p>
              </div>
              <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map(([title, text], i) => (
                  <li key={title} className="relative">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: C.deep }}>
                      {i + 1}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="absolute left-14 top-1.5 hidden text-xl lg:block" style={{ color: C.earth }} aria-hidden>→</span>
                    )}
                    <p className="mt-3 font-bold" style={{ color: C.deep }}>{title}</p>
                    <p className="mt-1 text-sm" style={{ color: C.earth }}>{text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <p className={`${hand.className} mt-6 text-right text-2xl`} style={{ color: "#4F6B4A" }}>You&apos;ve got this ♡</p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative scroll-mt-16 overflow-hidden py-16 text-white sm:py-20" style={{ background: C.deep }}>
          <Sprig className="absolute -left-2 bottom-4 hidden h-40 w-auto opacity-40 lg:block" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className={`${serif.className} text-3xl font-semibold sm:text-4xl`}>Simple family membership</h2>
              <p className="mt-3 max-w-md text-white/75">
                One membership for the whole family, with every feature and every child included. Try it free for 7
                days, with no card needed.
              </p>
              <Link href="/signup" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FFFDF8] px-6 py-3.5 text-sm font-bold" style={{ color: C.deep }}>
                Start your free trial <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid overflow-hidden rounded-3xl bg-[#FFFDF8] sm:grid-cols-[1.2fr_1fr]" style={{ color: C.ink }}>
              <ul className="space-y-2.5 p-7 text-sm">
                {[
                  "Unlimited child accounts",
                  "Planner, timetable & lesson plans",
                  "Reading, spellings & games",
                  "Results, reports & council report",
                  "Stars, rewards & badges",
                  "Cookbook, crafts & moments",
                ].map((t) => (
                  <li key={t} className="flex gap-3" style={{ color: C.earth }}>
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center justify-center border-t p-7 text-center sm:border-l sm:border-t-0" style={{ borderColor: C.line }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/house-mark.png" alt="" className="h-12 w-auto" />
                <p className={`${serif.className} mt-3 text-4xl font-bold`} style={{ color: C.deep }}>
                  £5.99<span className="text-base font-semibold" style={{ color: C.earth }}>/month</span>
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: C.earth }}>or £59 a year, saving £12.88</p>
                <Link href="/signup" className="mt-5 w-full rounded-full py-3 text-sm font-bold text-white" style={{ background: C.green }}>
                  Try it free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative scroll-mt-16 overflow-hidden py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative">
              <H2>Questions, answered</H2>
              <p className="mt-3" style={{ color: C.earth }}>
                Anything else? <Link href="/contact" className="font-bold underline" style={{ color: C.green }}>Get in touch</Link>, we&apos;re
                a family too and always happy to help.
              </p>
              <Sprig className="mt-8 hidden h-40 w-auto lg:block" />
            </div>
            <div className="space-y-3">
              {faqs.map(([q, a]) => (
                <details key={q} className="group rounded-2xl border bg-white px-5 py-4" style={{ borderColor: C.line }}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold" style={{ color: C.ink }}>
                    {q}
                    <span className="text-xl transition-transform group-open:rotate-45" style={{ color: C.green }}>+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6" style={{ color: C.earth }}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSignup variant="strip" />
      </main>

      <PublicFooter />
    </div>
  );
}
