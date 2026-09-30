"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HomeDemo from "@/components/HomeDemo";
import NewsletterSignup from "@/components/NewsletterSignup";
import { PublicFooter, PublicHeader, useMemberHome } from "@/components/PublicSite";
import { HandNote, Sprig } from "@/components/Decor";
import { hand, serif } from "@/lib/fonts";
import Emoji from "@/components/Emoji";

// Fixed colours for the public pages, so they never pick up a family's theme.
const C = {
  green: "#2F5D3A",
  deep: "#24452C",
  earth: "#6E5A46",
  ink: "#2E342F",
  cream: "#FBF8F1",
  paper: "#FFFDF8",
  sage: "#E3E7D9",
  sand: "#F3EAD7",
  line: "#E4DCCD",
};

// Pictures live in /public/home. Each falls back to an emoji until the artwork is added.
const featureGroups = [
  {
    name: "Plan",
    art: "/home/plan.png",
    emoji: "🗓️",
    tint: "#E7EADE",
    blurb: "Get the whole week sorted in one sitting.",
    items: ["Weekly planner", "Your timetable", "Lesson plans", "Oak National Academy lessons", "Print the week"],
  },
  {
    name: "Learn",
    art: "/home/learn.png",
    emoji: "📚",
    tint: "#F5EFE1",
    blurb: "Everything the children need, in their own space.",
    items: ["Child dashboards", "Reading log", "Spellings", "Learning games", "Cookbook & Craft Corner"],
  },
  {
    name: "Progress",
    art: "/home/progress.png",
    emoji: "🌱",
    tint: "#E7EADE",
    blurb: "See how they're really getting on.",
    items: ["Results & quiz scores", "Review & feedback", "Printable reports", "Council report", "Moments & photos"],
  },
  {
    name: "Family",
    art: "/home/family.png",
    emoji: "🏡",
    tint: "#F5EFE1",
    blurb: "Keep everyone motivated and on track.",
    items: ["Stars & rewards", "Badges", "Reminders & phone notifications", "Avatars & colour themes"],
  },
];

const steps = [
  ["Start your free trial", "Set up your family account in minutes. No card needed."],
  ["Add your children", "Give each child their own simple login."],
  ["Set your timetable", "Choose your subjects and when you teach them."],
  ["Plan your first week", "Add lessons and you're away."],
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
    <h2 className={`${serif.className} text-3xl font-semibold leading-tight sm:text-[2.1rem] ${className}`} style={{ color: C.deep }}>
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

/** A picture from /public/home, or a stand-in (emoji or older picture) until that file exists. */
function Art({ src, className = "", fallback }: { src: string; className?: string; fallback: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(true);
    img.src = src;
  }, [src]);
  // eslint-disable-next-line @next/next/no-img-element
  return ok ? <img src={src} alt="" className={className} /> : <>{fallback}</>;
}

/** The little week planner shown on the laptop and in "See it in action". */
function MiniWeek() {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="mb-2 text-xs font-bold" style={{ color: C.ink }}>This week</p>
      <div className="grid grid-cols-5 gap-1.5">
        {week.map(([day, items]) => (
          <div key={day}>
            <p className="mb-1 text-[10px] font-bold text-[#8C7B66]">{day}</p>
            <div className="space-y-1">
              {items.map(([bg, label], i) => (
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

/** Stacked book spines, like the ones on the shelf in the mock-up. */
function BookStack({ words, className = "" }: { words: string[]; className?: string }) {
  const colours = ["#F4ECDC", "#E9EEE1", "#EFE3CF", "#E3EADB"];
  return (
    <div className={`flex flex-col items-center ${className}`} aria-hidden>
      {words.map((w, i) => (
        <span
          key={w}
          className="rounded-sm border border-[#D9CCB4] px-4 py-0.5 text-[11px] font-bold tracking-[0.2em] shadow-sm"
          style={{ background: colours[i % 4], color: C.deep, width: `${128 - (i % 2) * 10}px`, marginLeft: `${(i % 2) * 10}px`, textAlign: "center" }}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

function FeatureCard({ g }: { g: (typeof featureGroups)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center rounded-3xl p-6 text-center shadow-sm" style={{ background: g.tint }}>
      <div className="flex h-24 items-end justify-center">
        <Art src={g.art} className="h-24 w-auto object-contain" fallback={<span className="text-6xl" aria-hidden>{g.emoji}</span>} />
      </div>
      <h3 className={`${serif.className} mt-3 text-2xl font-semibold`} style={{ color: C.deep }}>{g.name}</h3>
      <p className="mt-1 text-sm" style={{ color: C.earth }}>{g.blurb}</p>
      {open && (
        <ul className="mt-3 space-y-1 text-sm font-semibold" style={{ color: C.earth }}>
          {g.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`${open ? "Hide" : "Show"} what's in ${g.name}`}
        className="mt-4 flex h-8 w-12 items-center justify-center rounded-full text-sm font-bold text-white transition-transform"
        style={{ background: C.green }}
      >
        <span className={open ? "rotate-90" : ""} style={{ display: "inline-block", transition: "transform .2s" }}>→</span>
      </button>
    </div>
  );
}

export default function HomePage() {
  const memberHome = useMemberHome();
  const [deleted, setDeleted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("deleted")) setDeleted(true);
    if (window.location.hash === "#demo") setDemoOpen(true);
  }, []);

  const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md shadow-green-900/15 transition-opacity hover:opacity-95";
  const ghostBtn = "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-colors hover:bg-white";

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: C.cream, color: C.ink }}>
      <PublicHeader memberHome={memberHome} />

      <main>
        {deleted && (
          <div className="border-b px-4 py-3 text-center text-sm font-semibold" style={{ background: C.sage, borderColor: C.line, color: C.green }}>
            Your account and all your family&apos;s information have been deleted. Thank you for using Bright Roots.
          </div>
        )}

        {/* Hero: words on the left, the picture filling the right-hand side */}
        <section className="relative lg:min-h-[480px]">
          <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:py-16">
            <Art src="/home/leaf-hero.png" className="absolute -left-2 top-36 hidden h-48 w-auto xl:block" fallback={<Sprig className="absolute left-0 top-44 hidden h-44 w-auto xl:block" />} />
            <div className="max-w-xl lg:max-w-[46%] xl:pl-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: C.earth }}>Home learning that feels like home</p>
              <h1 className={`${serif.className} mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[2.9rem]`} style={{ color: C.deep }}>
                <span className="xl:whitespace-nowrap">Plan less. Learn more.</span>
                <br />
                Grow together.
              </h1>
              <p className="mt-5 text-lg leading-8" style={{ color: C.earth }}>
                A calm home learning planner for families. Plan the week, give each child their own space to learn,
                and keep a record of everything they achieve.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={memberHome || "/signup"} className={primaryBtn} style={{ background: C.green }}>
                  {memberHome ? "Open your dashboard" : "Start your free trial"} <span aria-hidden>→</span>
                </Link>
                <a href="#demo" onClick={() => setDemoOpen(true)} className={ghostBtn} style={{ borderColor: C.line, color: C.green }}>
                  Try the demo
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold" style={{ color: C.earth }}>
                {[
                  { src: "/home/icons/weekly-planning.png", fallback: "🗓️", label: "Weekly planning" },
                  { src: "/home/icons/family-logins.png", fallback: "👨‍👩‍👧", label: "Parent & child logins" },
                  { src: "/home/icons/any-device.png", fallback: "📱", label: "Any device" },
                ].map((f) => (
                  <span key={f.label} className="flex items-center gap-2">
                    <Art src={f.src} className="h-8 w-8 object-contain" fallback={<span aria-hidden>{f.fallback}</span>} />
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-10 h-[300px] sm:h-[380px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[52%]">
            {/* Until /home/hero.jpg is added, the sunny desk with a laptop drawn on top stands in. */}
            <Art src="/home/hero.jpg" className="absolute inset-0 h-full w-full object-cover" fallback={<HeroFallback />} />
            {/* Fades the picture into the cream on its left edge, like the mock-up */}
            <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-[#FBF6EC] to-transparent lg:block" />
          </div>
        </section>

        {/* Story */}
        <section id="story" className="relative scroll-mt-16 overflow-hidden py-14" style={{ background: C.sage }}>
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr_0.4fr]">
            <div className="relative mx-auto w-full max-w-xs">
              <Sprig className="absolute -left-12 bottom-0 h-36 w-auto" />
              <Sprig className="absolute -right-10 bottom-6 h-24 w-auto" flip />
              <div className="relative rotate-[-4deg] bg-white p-3 pb-4 shadow-xl shadow-[#6E5A46]/25">
                <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 bg-[#E3CFA3]/80" />
                <Art
                  src="/home/story.jpg"
                  className="aspect-[4/3] w-full object-cover"
                  fallback={
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/hero/story.jpg" alt="Children reading and drawing together" className="aspect-[4/3] w-full object-cover" />
                  }
                />
                <p className={`${hand.className} mt-3 text-center text-xl leading-6`} style={{ color: C.earth }}>
                  Learning looks different here, and that&apos;s a good thing ♡
                </p>
              </div>
            </div>
            <div>
              <H2>Made by a family, for families</H2>
              <p className="mt-4 leading-7" style={{ color: C.earth }}>
                We were spending more time organising our children&apos;s learning than actually being with them. So we
                built Bright Roots: one calm place for the plan, the learning and the record of it all.
              </p>
              <Link href="/about" className={`${ghostBtn} mt-6`} style={{ borderColor: C.green, color: C.green }}>
                Read our story <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <HandNote className="rotate-[-8deg]">Curious children, brighter tomorrows</HandNote>
              <Sprig className="ml-auto mt-4 h-28 w-auto" flip />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative scroll-mt-16 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative flex items-center justify-center gap-3 text-center">
              <Sprig className="h-12 w-auto" />
              <H2>Everything your home learning needs</H2>
              <Art src="/home/books.png" className="absolute right-0 top-1/2 hidden h-24 w-auto -translate-y-1/2 xl:block" fallback={<BookStack words={["PLAY", "EXPLORE", "LEARN", "BELONG"]} className="absolute right-0 top-1/2 hidden -translate-y-1/2 xl:flex" />} />
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featureGroups.map((g) => (
                <FeatureCard key={g.name} g={g} />
              ))}
            </div>
          </div>
        </section>

        {/* For parents / children */}
        <section className="pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3">
              <Sprig className="h-10 w-auto" />
              <H2>A space for everyone</H2>
              <Sprig className="h-10 w-auto" flip />
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                {
                  who: "For parents",
                  art: "/home/parents.png",
                  emoji: "☕",
                  bg: C.sand,
                  points: ["Plan the whole week in one sitting", "See what's done and who needs a hand", "Reports ready whenever you need them"],
                },
                {
                  who: "For children",
                  art: "/home/children.png",
                  emoji: "🌈",
                  bg: C.sage,
                  points: ["Their own space for today's learning", "Tick things off and earn stars", "Games, badges and their own look"],
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
                  <div className="hidden h-32 w-40 shrink-0 items-center justify-center sm:flex">
                    <Art src={p.art} className="h-36 w-auto object-contain" fallback={<span className="text-7xl" aria-hidden><Emoji e={p.emoji} /></span>} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* See it in action */}
        <section id="demo" className="scroll-mt-16 border-t py-14" style={{ background: C.paper, borderColor: C.line }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr_0.3fr]">
              <div className="relative">
                <H2>See it in action</H2>
                <p className="mt-3" style={{ color: C.earth }}>
                  Have a click around an example family with two children. Mark lessons done and watch the planner and
                  progress update, just like the real thing.
                </p>
                <button onClick={() => setDemoOpen(!demoOpen)} className={`${primaryBtn} mt-6`} style={{ background: C.green }}>
                  {demoOpen ? "Hide the demo" : "Try the demo"} <span aria-hidden>{demoOpen ? "↑" : "→"}</span>
                </button>
                <p className={`${hand.className} mt-6 hidden rotate-[-6deg] text-2xl lg:block`} style={{ color: "#4F6B4A" }}>
                  A tiny peek inside ↗
                </p>
              </div>
              <div className="rounded-2xl border bg-[#F7F3EA] p-2 shadow-xl shadow-[#6E5A46]/10" style={{ borderColor: C.line }}>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-3 rounded-xl bg-white px-2.5 py-3 text-sm" aria-hidden>
                    <span>🏠</span>
                    <span>🗓️</span>
                    <span>📋</span>
                    <span>📈</span>
                  </div>
                  <div className="flex-1">
                    <MiniWeek />
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <HandNote className="rotate-[-8deg]">Simple days, brighter tomorrows</HandNote>
              </div>
            </div>
            {demoOpen && (
              <div className="mt-10">
                <HomeDemo />
              </div>
            )}
          </div>
        </section>

        {/* Steps */}
        <section id="get-started" className="relative scroll-mt-16 overflow-hidden py-12" style={{ background: C.sage }}>
          <Sprig className="absolute bottom-0 left-2 hidden h-28 w-auto lg:block" />
          <Sprig className="absolute bottom-0 right-2 hidden h-28 w-auto lg:block" flip />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_2.4fr_0.4fr] lg:items-start">
              <div>
                <H2>Four simple steps</H2>
                <p className="mt-2 text-sm" style={{ color: C.earth }}>Most families plan their first week in one evening.</p>
              </div>
              <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map(([title, text], i) => (
                  <li key={title} className="relative">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: C.deep }}>
                      {i + 1}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="absolute left-12 top-1 hidden text-xl lg:block" style={{ color: C.earth }} aria-hidden>→</span>
                    )}
                    <p className="mt-3 text-sm font-bold" style={{ color: C.deep }}>{title}</p>
                    <p className="mt-1 text-sm" style={{ color: C.earth }}>{text}</p>
                  </li>
                ))}
              </ol>
              <HandNote className="hidden rotate-[-8deg] lg:block">You&apos;ve got this</HandNote>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section id="pricing" className="relative scroll-mt-16 overflow-hidden py-12 text-white" style={{ background: "#2D3D32" }}>
          <Sprig className="absolute -left-2 bottom-2 hidden h-36 w-auto opacity-40 lg:block" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr_0.3fr]">
            <div>
              <h2 className={`${serif.className} text-3xl font-semibold`}>Simple family membership</h2>
              <p className="mt-3 max-w-md text-white/75">Every feature and every child included. Try it free for 7 days, no card needed.</p>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFFDF8] px-6 py-3 text-sm font-bold" style={{ color: C.deep }}>
                Start your free trial <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid overflow-hidden rounded-2xl bg-[#FFFDF8] sm:grid-cols-[1.2fr_1fr]" style={{ color: C.ink }}>
              <ul className="space-y-2.5 p-6 text-sm">
                {["Unlimited child accounts", "Planner, timetable & lesson plans", "Reading, spellings & games", "Reports & council report", "Stars, rewards & badges"].map((t) => (
                  <li key={t} className="flex gap-3" style={{ color: C.earth }}>
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center justify-center border-t p-6 text-center sm:border-l sm:border-t-0" style={{ borderColor: C.line }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/house-mark.png" alt="" className="h-10 w-auto" />
                <p className={`${serif.className} mt-2 text-4xl font-bold`} style={{ color: C.deep }}>
                  £5.99<span className="text-base font-semibold" style={{ color: C.earth }}>/month</span>
                </p>
                <p className="mt-1 text-sm" style={{ color: C.earth }}>or £59 a year</p>
                <Link href="/signup" className="mt-4 w-full rounded-full py-2.5 text-sm font-bold text-white" style={{ background: C.green }}>
                  Try it free
                </Link>
              </div>
            </div>
            <p className={`${hand.className} hidden rotate-[-8deg] text-2xl leading-7 text-white/80 lg:block`} aria-hidden>
              More learning, brighter lives
              <span className="block text-lg">♡</span>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative scroll-mt-16 overflow-hidden py-14">
          <Art src="/home/leaf-faq.png" className="absolute -bottom-2 left-2 hidden h-56 w-auto lg:block" fallback={<Sprig className="absolute -bottom-2 left-4 hidden h-48 w-auto lg:block" />} />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:pl-16">
              <H2>Questions, answered</H2>
              <p className="mt-3" style={{ color: C.earth }}>
                Anything else? <Link href="/contact" className="font-bold underline" style={{ color: C.green }}>Get in touch</Link>. We&apos;re a
                family too, and always happy to help.
              </p>
            </div>
            <div className="space-y-2.5">
              {faqs.map(([q, a]) => (
                <details key={q} className="group rounded-xl border bg-white px-5 py-3.5" style={{ borderColor: C.line }}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold" style={{ color: C.ink }}>
                    {q}
                    <span className="text-xl transition-transform group-open:rotate-45" style={{ color: C.green }}>+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-6" style={{ color: C.earth }}>{a}</p>
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

/** Stand-in for /home/hero.jpg: the sunny desk with a laptop showing the planner. */
function HeroFallback() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/login-bg-2.jpg" alt="A sunny home learning desk" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute left-1/2 top-1/2 w-[70%] max-w-md -translate-x-1/2 -translate-y-[40%]">
        <div className="rounded-t-2xl border-[6px] border-[#2B2F2C] bg-[#F7F3EA] p-2 shadow-2xl">
          <MiniWeek />
        </div>
        <div className="mx-auto h-3 w-[112%] -translate-x-[5.5%] rounded-b-xl bg-gradient-to-b from-[#C9C4BA] to-[#9D988E]" />
      </div>
    </>
  );
}
