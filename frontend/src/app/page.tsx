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
    items: ["Weekly planner", "Your timetable", "Ready-made starter week", "Works with Oak, Twinkl, White Rose and more", "Or just log what you did", "Repeat lessons & copy a week", "Lesson plans", "Calendar sync", "Print the week"],
  },
  {
    name: "Learn",
    art: "/home/learn.png",
    emoji: "📚",
    tint: "#F5EFE1",
    blurb: "Everything the children need, in their own space.",
    items: ["Child dashboards", "Little Roots for ages 3 to 4", "Reading log & spellings", "Languages", "Learning games", "Cookbook, crafts & life skills", "P.E., Outdoors & clubs", "Saplings for ages 5 to 10", "Teen Corner for ages 11 to 16", "GCSE exam planner"],
  },
  {
    name: "Progress",
    art: "/home/progress.png",
    emoji: "🌱",
    tint: "#E7EADE",
    blurb: "See how they're really getting on.",
    items: ["Results & quiz scores", "Review & feedback", "Printable reports", "Council report", "Moments & photos", "Trips & days out"],
  },
  {
    name: "Family",
    art: "/home/family.png",
    emoji: "🏡",
    tint: "#F5EFE1",
    blurb: "Keep everyone motivated and on track.",
    items: ["Stars & rewards", "Badges, plus your own", "Printable certificates", "Notes from home", "Logins for both parents", "Reminders & phone notifications", "Avatars & colour themes"],
  },
];

// "Why Bright Roots?": the same five worries, before and after.
const beforeAfter: [string, string][] = [
  ["Plans scattered across notebooks, printouts and bookmarks", "One calm family home page for the whole week"],
  ["Reading records and spelling lists that go missing", "Reading, spellings and lessons kept together"],
  ["No clear picture of how each child is getting on", "Progress builds itself as things are ticked off"],
  ["A scramble when the council gets in touch", "A report ready whenever you need one"],
  ["More evenings organising than days enjoying it", "More time learning together"],
];

// Real screens from the app, taken with a made-up family. Each one also lists what lives in that part of Bright Roots.
const screens = [
  {
    src: "/home/shots/parent-home.jpg",
    width: 1600,
    height: 994,
    alt: "The parent home page: a welcome, something a child did by themselves waiting for an OK, and a box to note down what the family did today",
    eyebrow: "Your home page",
    title: "Everything that needs you, in one place",
    text: "See what is waiting for you, jot down what you did today and check how the week is going. No hunting through notebooks.",
    group: "Family",
  },
  {
    src: "/home/shots/planner.jpg",
    width: 1600,
    height: 885,
    alt: "The weekly planner: a column for each day with colour-coded lessons, the scheme each one comes from, and scores",
    eyebrow: "Weekly planner",
    title: "A home education planner that fits your week",
    text: "Plan a week in one sitting from whatever you use, or log things as they happen. Move a day along when life gets in the way.",
    group: "Plan",
  },
  {
    src: "/home/shots/child-today.jpg",
    width: 1600,
    height: 1035,
    alt: "A child's own page: a greeting, what is up next, their star jar and the week ahead",
    eyebrow: "Your child's page",
    title: "Their own space, and only what they need today",
    text: "Each child logs in to a simple page with today's learning, what is up next and the stars they have earned.",
    group: "Learn",
  },
];

// The three age sections. One shows at a time, chosen with the "pick an age" buttons.
type AgeId = "little-roots" | "ages-5-to-10" | "teens";
const AGES: { id: AgeId; label: string; ages: string }[] = [
  { id: "little-roots", label: "Little Roots", ages: "Ages 3 to 4" },
  { id: "ages-5-to-10", label: "Saplings", ages: "Ages 5 to 10" },
  { id: "teens", label: "Teens", ages: "Ages 11 to 16" },
];

const steps = [
  ["Start your free trial", "Set up your family account in minutes. No card needed."],
  ["Add your children", "Give each child their own simple login."],
  ["Set your timetable", "Choose your subjects and when you teach them."],
  ["Plan your week, or just log it", "Add a ready-made week, bring in the scheme you already use, or simply note down what you do each day."],
];

const faqs = [
  ["How many children can I add?", "One family membership covers every child in your home, each with their own login, up to 10 children. Up to four grown-ups can have a login too."],
  ["Do my children need their own email address?", "No. You create a simple login name and password for each child from your parent account."],
  ["Can both parents use it?", "Yes. The parent who signs up can add the other parent, a guardian or a grandparent, each with their own login. Everyone sees the same family, and it's all covered by one membership."],
  ["Is there anything for teenagers?", "Yes. The Teens menu has cooking, projects, P.E., outdoor skills and life skills written for ages 11 to 16, from making dinner to wiring a plug. Younger children get their own versions, and you choose which each child sees."],
  ["I'm new to home education. Where do I start?", "Tell us which school year each child is working at and Bright Roots fills your first week with free Oak National Academy lessons for every subject on your timetable. You can change any of them, and the how-to guides walk you through the rest."],
  ["Is there anything for my 3 or 4 year old?", "Yes. Little Roots has short, playful activities to do together, each one a picture book with a little story, what you need and what to say. There's a new set of three activities and a rhyme every week, and little ones don't need a login: you do it together from your account, and their stars and progress are still saved."],
  ["My teenager is working towards GCSEs. Can it help?", "Yes. The exam planner keeps each exam's centre, entry deadline, date and fee in one place, counts down the days, and adds revision sessions to the planner."],
  ["Do I have to follow a set curriculum?", "Not at all. You choose the subjects and plan the lessons. Oak National Academy lessons are there if you want them, but you can plan everything yourself."],
  ["We're child-led and don't plan lessons. Is it still for us?", "Yes. You don't have to plan anything. On your home page, type what you did today, pick the subject and who did it, and it is saved as learning done. Walks, books, baking, museum trips and long conversations all count, and they build into the same record and council report as planned lessons."],
  ["My child has additional needs. Will it suit us?", "Many families home educate for exactly that reason. You choose the level for each subject rather than going by age, plan as little as suits the day, and move a day along when it isn't happening. Children see a short list for today rather than the whole week, and stars and rewards are yours to use or leave out. Our free guide has more ideas."],
  ["We're in Scotland, Wales or Northern Ireland. Does it fit?", "Yes. The planner, records and report work the same wherever you live, with whatever subjects and curriculum you follow. The exam planner covers National 5s and Highers as well as GCSEs. The built-in Oak lessons follow England's curriculum and year names, so go by your child's age and ability when you pick a level, or use your own materials instead."],
  ["We use Twinkl or White Rose Maths, not Oak. Will it work for us?", "Yes. Add any lesson with a link to where it lives and the name of the scheme, and it sits in your planner like any other. You can type in a score for a worksheet or test, and it all shows in your records and council report. Bright Roots keeps the link and your notes; the materials stay on the scheme's own site."],
  ["Can it help with my local authority?", "Yes. The council report pulls together the work, results, reading and notes you've already recorded, so you have a clear summary to share. There is a sample report on this site if you would like to see one first."],
  ["What happens when my free trial ends?", "You can choose monthly or yearly membership from your account. If you decide not to carry on, you won't be charged, because no card is taken for the trial."],
  ["Is my family's information safe?", "Yes. Each family can only see its own information, passwords are stored in scrambled form, and the site only works over a secure connection. Your records are kept in the Netherlands, inside the European Union, with a backup made every night. We never sell your information, show adverts or track you around the web. You can download everything, or delete your whole account, from your Account page at any time."],
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



export default function HomePage() {
  const memberHome = useMemberHome();
  const [deleted, setDeleted] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [age, setAge] = useState<AgeId>("ages-5-to-10");

  // Show one age group and bring the "pick an age" buttons into view.
  const showAge = (id: AgeId) => {
    setAge(id);
    document.getElementById("ages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("deleted")) setDeleted(true);
    if (window.location.hash === "#demo") setDemoOpen(true);
    // A link straight to one age group (such as /#teens) opens that one.
    const wanted = AGES.find((a) => `#${a.id}` === window.location.hash);
    if (wanted) setAge(wanted.id);
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
                A calm place for home learning. Plan the week ahead, or simply note down what you did. Give each
                child their own space to learn, and keep a record of everything they achieve.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={memberHome || "/signup"} className={primaryBtn} style={{ background: C.green }}>
                  {memberHome ? "Open your dashboard" : "Start your free trial"} <span aria-hidden>→</span>
                </Link>
                <a href="#demo" onClick={() => setDemoOpen(true)} className={ghostBtn} style={{ borderColor: C.line, color: C.green }}>
                  Try the demo
                </a>
              </div>
              <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm" style={{ color: C.earth }}>
                <span className="font-bold" style={{ color: C.deep }}>For every stage:</span>
                {(
                  [
                    ["Early years", "little-roots"],
                    ["Primary", "ages-5-to-10"],
                    ["Secondary", "teens"],
                    ["GCSE preparation", "teens"],
                  ] as [string, AgeId][]
                ).map(([label, id]) => (
                  <a
                    key={label}
                    href="#ages"
                    onClick={(e) => {
                      e.preventDefault();
                      showAge(id);
                    }}
                    className="rounded-full border bg-white/70 px-3 py-1 text-xs font-bold transition-colors hover:bg-white"
                    style={{ borderColor: C.line, color: C.green }}
                  >
                    ✓ {label}
                  </a>
                ))}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold" style={{ color: C.earth }}>
                {[
                  { src: "/home/icons/weekly-planning.png", fallback: "🗓️", label: "Plan it or log it" },
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/our-family.jpg"
                  alt="The family behind Bright Roots, two parents and three children, smiling outdoors at sunset"
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <p className={`${hand.className} mt-3 text-center text-xl leading-6`} style={{ color: C.earth }}>
                  That&apos;s us. Learning looks different here ♡
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

        {/* Why Bright Roots: before and after */}
        <section id="why" className="relative scroll-mt-16 py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 text-center">
              <Sprig className="h-12 w-auto" />
              <H2>Why Bright Roots?</H2>
              <Sprig className="h-12 w-auto" flip />
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-center" style={{ color: C.earth }}>
              Whether you call it home education or homeschooling, a notebook or a spreadsheet can hold a plan. It can&apos;t give each child their own page, keep the reading log, count the
              stars and write the report as well. Bright Roots does all of it in one place, so it saves time instead of adding a job.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border p-6 sm:p-7" style={{ background: C.paper, borderColor: C.line }}>
                <h3 className={`${serif.className} text-2xl font-semibold`} style={{ color: C.earth }}>Before Bright Roots</h3>
                <ul className="mt-4 space-y-3">
                  {beforeAfter.map(([before]) => (
                    <li key={before} className="flex gap-3 text-sm leading-6" style={{ color: C.earth }}>
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFE6D6] text-[11px] font-black text-[#8C7B66]" aria-hidden>–</span>
                      {before}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl p-6 shadow-sm sm:p-7" style={{ background: C.sage }}>
                <h3 className={`${serif.className} text-2xl font-semibold`} style={{ color: C.deep }}>With Bright Roots</h3>
                <ul className="mt-4 space-y-3">
                  {beforeAfter.map(([, after]) => (
                    <li key={after} className="flex gap-3 text-sm font-semibold leading-6" style={{ color: C.ink }}>
                      <Check />
                      {after}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* See inside: real screens from the app */}
        <section id="features" className="scroll-mt-16 border-t py-14" style={{ background: C.paper, borderColor: C.line }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <H2>See inside</H2>
              <p className="mx-auto mt-3 max-w-2xl" style={{ color: C.earth }}>
                These are real screens from Bright Roots, shown with a made-up family. What you see is what you get.
              </p>
            </div>
            <div className="mt-10 space-y-10 lg:space-y-14">
              {screens.map((shot, i) => {
                const group = featureGroups.find((g) => g.name === shot.group);
                return (
                  <div key={shot.src} className={"grid items-center gap-5 lg:gap-10 " + (i % 2 ? "lg:grid-cols-[1fr_1.45fr]" : "lg:grid-cols-[1.45fr_1fr]")}>
                    <figure className={"overflow-hidden rounded-2xl border bg-white shadow-xl shadow-[#6E5A46]/10 " + (i % 2 ? "lg:order-2" : "")} style={{ borderColor: C.line }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" className="h-auto w-full" />
                    </figure>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#6E8B62" }}>{shot.eyebrow}</p>
                      <h3 className={`${serif.className} mt-2 text-2xl font-semibold leading-snug sm:text-[1.7rem]`} style={{ color: C.deep }}>{shot.title}</h3>
                      <p className="mt-3 leading-7" style={{ color: C.earth }}>{shot.text}</p>
                      {group && (
                        <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
                          {group.items.map((item) => (
                            <li key={item} className="rounded-full border bg-white px-3 py-1 text-xs font-semibold" style={{ borderColor: C.line, color: C.earth }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={memberHome || "/signup"} className={primaryBtn} style={{ background: C.green }}>
                {memberHome ? "Open your dashboard" : "Start your free trial"} <span aria-hidden>→</span>
              </Link>
              <a href="#demo" onClick={() => setDemoOpen(true)} className={ghostBtn} style={{ borderColor: C.line, color: C.green }}>
                Try the demo
              </a>
            </div>
          </div>
        </section>

        {/* The council report */}
        <section id="reports" className="scroll-mt-16 py-14" style={{ background: C.sage }}>
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#6E8B62" }}>Home education record keeping</p>
              <H2 className="mt-2">Be ready when you&apos;re asked</H2>
              <p className="mt-4 leading-7" style={{ color: C.earth }}>
                If your council asks how home education is going, it is much less stressful when the answer is already written
                down. Bright Roots keeps the record as you go, then puts it together for you.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "Lessons, reading, results and days out, recorded as they happen",
                  "A report for each child, for any dates you choose",
                  "You decide which sections go in, and write your own approach in your own words",
                  "Print it, or save it as a PDF",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm leading-6" style={{ color: C.earth }}>
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/sample-report" className={primaryBtn} style={{ background: C.green }}>
                  See a sample report <span aria-hidden>→</span>
                </Link>
                <Link href="/guides/keeping-records" className={ghostBtn} style={{ borderColor: C.line, color: C.green }}>
                  Read our record keeping guide
                </Link>
              </div>
              <p className="mt-4 text-xs leading-5" style={{ color: C.earth }}>
                Bright Roots helps you keep and present your records. It isn&apos;t legal advice, and what your council asks for is between you and them.
              </p>
              <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
                {(featureGroups.find((g) => g.name === "Progress")?.items ?? []).map((item) => (
                  <li key={item} className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold" style={{ borderColor: C.line, color: C.earth }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/sample-report" className="hidden rotate-[1.5deg] overflow-hidden rounded-2xl border bg-white shadow-xl sm:block shadow-[#6E5A46]/15 transition-transform hover:rotate-0" style={{ borderColor: C.line }} aria-label="See a sample council report">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/shots/report.jpg" alt="A home education report showing days of recorded learning, lessons completed and subjects covered" width={1600} height={935} loading="lazy" className="h-auto w-full" />
            </Link>
          </div>
        </section>

        {/* Pick an age: the three sections below take turns, so the page stays short on a phone */}
        <section id="ages" className="scroll-mt-16 pb-6 pt-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <H2>Something for every age</H2>
            <p className="mt-3" style={{ color: C.earth }}>
              One membership covers every child. Pick an age to see what is inside for them.
            </p>
            <div role="tablist" aria-label="Pick an age" className="mt-5 inline-flex flex-wrap justify-center gap-2 rounded-3xl border p-1.5" style={{ background: C.paper, borderColor: C.line }}>
              {AGES.map((a) => {
                const on = age === a.id;
                return (
                  <button
                    key={a.id}
                    role="tab"
                    aria-selected={on}
                    aria-controls={a.id}
                    onClick={() => setAge(a.id)}
                    className="rounded-2xl px-4 py-2 text-sm font-bold transition-colors"
                    style={on ? { background: C.green, color: "#fff" } : { color: C.earth }}
                  >
                    {a.label}
                    <span className="block text-[11px] font-semibold opacity-80">{a.ages}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Little Roots: ages 3 to 4 */}
        <section id="little-roots" role="tabpanel" className={"scroll-mt-16 pb-14" + (age === "little-roots" ? "" : " hidden")}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]" style={{ background: "#FDF6E3" }}>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="relative rotate-[2deg] bg-white p-3 pb-4 shadow-xl shadow-[#6E5A46]/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/make-photos/little-teddys-tea-party.jpg" alt="A child and a grown-up having a teddy bears' tea party" className="aspect-square w-full object-cover" />
                  <p className={`${hand.className} mt-3 text-center text-xl leading-6`} style={{ color: C.earth }}>
                    One for Teddy, one for Bunny ♡
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: C.earth }}>New · ages 3 to 4</p>
                <H2 className="mt-2">Little Roots: story books to do together</H2>
                <p className="mt-4 leading-7" style={{ color: C.earth }}>
                  Ten-minute activities for little ones, with things you already have at home. Each one is a picture book you
                  read together, with a little story, what you need, what to say and an easier version for tired days.
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    "A new set every week: three activities and a rhyme, planned in one click",
                    "Counting, sounds, moving, making and the world around us",
                    "No login needed for little ones, but their stars and progress are still saved",
                    "Print any activity as a fridge card",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-6" style={{ color: C.earth }}>
                      <Check />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href={memberHome ? "/make/little-roots" : "/signup"} className={primaryBtn} style={{ background: C.green }}>
                    {memberHome ? "Open Little Roots" : "Start your free trial"} <span aria-hidden>→</span>
                  </Link>
                  <Link href="/guides/three-and-four-year-olds" className={ghostBtn} style={{ borderColor: C.green, color: C.green }}>
                    Read our guide for 3 and 4 year olds
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ages 5 to 10 */}
        <section id="ages-5-to-10" role="tabpanel" className={"scroll-mt-16 pb-14" + (age === "ages-5-to-10" ? "" : " hidden")}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]" style={{ background: C.sand }}>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: C.earth }}>Saplings · ages 5 to 10</p>
                <H2 className="mt-2">Learning, making and getting outside</H2>
                <p className="mt-4 leading-7" style={{ color: C.earth }}>
                  Each child gets their own simple login and a dashboard showing today&apos;s learning. Lessons for every
                  subject, plus plenty of hands-on things to do away from the screen.
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    "Lessons from whatever you use: free Oak National Academy lessons built in, or your own from Twinkl, White Rose Maths and more",
                    "Reading log, spellings, languages and learning games",
                    "Ten comic heroes who teach maths, English, science, geography and history",
                    "Cookbook and Craft Corner, with grown-up jobs clearly marked",
                    "P.E. and Outdoors: den building, bug hotels, sports day and more",
                    "Life skills: tying laces, telling the time and crossing the road",
                    "Stars, rewards and badges to keep them going",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-6" style={{ color: C.earth }}>
                      <Check />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href={memberHome || "/signup"} className={primaryBtn} style={{ background: C.green }}>
                    {memberHome ? "Open your dashboard" : "Start your free trial"} <span aria-hidden>→</span>
                  </Link>
                  <Link href="/guides/first-week" className={ghostBtn} style={{ borderColor: C.green, color: C.green }}>
                    Read our first week guide
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="relative rotate-[-2deg] bg-white p-3 pb-4 shadow-xl shadow-[#6E5A46]/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/make-photos/out-den-building.jpg" alt="Two children peeping out of a den made from sticks" className="aspect-square w-full object-cover" />
                  <p className={`${hand.className} mt-3 text-center text-xl leading-6`} style={{ color: C.earth }}>
                    Our den in the woods!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teens: ages 11 to 16 */}
        <section id="teens" role="tabpanel" className={"scroll-mt-16 pb-14" + (age === "teens" ? "" : " hidden")}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]" style={{ background: C.sage }}>
              <div className="lg:order-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: C.earth }}>Ages 11 to 16</p>
                <H2 className="mt-2">Teens: real skills, their own way</H2>
                <p className="mt-4 leading-7" style={{ color: C.earth }}>
                  Teenagers get their own menu, written for them rather than for little ones. Proper meals to cook from start to
                  finish, projects with real skills, training they can plan themselves, and the everyday jobs nobody teaches you.
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    "Cooking: dinners, bakes and a budget dinner challenge",
                    "Projects: printmaking, textiles, woodwork and stop-motion film",
                    "P.E. and outdoors: couch to 5K, circuits, map reading and bushcraft",
                    "Life skills: washing, ironing, budgeting, first aid and wiring a plug",
                    "A GCSE exam planner for entries, deadlines, fees and revision",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-6" style={{ color: C.earth }}>
                      <Check />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href={memberHome ? "/teens" : "/signup"} className={primaryBtn} style={{ background: C.green }}>
                    {memberHome ? "Open Teen Corner" : "Start your free trial"} <span aria-hidden>→</span>
                  </Link>
                  <Link href="/guides/gcses-at-home" className={ghostBtn} style={{ borderColor: C.green, color: C.green }}>
                    Read our GCSE guide
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-sm lg:order-1">
                <div className="relative rotate-[2deg] bg-white p-3 pb-4 shadow-xl shadow-[#6E5A46]/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/make-photos/teen-pizza-from-scratch.jpg" alt="Kneading pizza dough on a floured worktop" className="aspect-[4/3] w-full object-cover" />
                  <p className={`${hand.className} mt-3 text-center text-xl leading-6`} style={{ color: C.earth }}>
                    Pizza from scratch, all by themselves
                  </p>
                </div>
              </div>
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
                  Click through one day with an example family, from the morning plan to bedtime. Tick off lessons,
                  log an unplanned walk, OK a child&apos;s own idea, and watch the day&apos;s record write itself.
                </p>
                <button onClick={() => setDemoOpen(!demoOpen)} className={`${primaryBtn} mt-6`} style={{ background: C.green }}>
                  {demoOpen ? "Hide the demo" : "Try the demo"} <span aria-hidden>{demoOpen ? "↑" : "→"}</span>
                </button>
                <p className="mt-4 text-sm" style={{ color: C.earth }}>
                  Or{" "}
                  <Link href="/sample-report" className="font-bold underline" style={{ color: C.green }}>
                    see a sample council report
                  </Link>
                  , made from an example family&apos;s records.
                </p>
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

        {/* Early members */}
        <section id="early" className="scroll-mt-16 py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-3xl border p-7 sm:p-10" style={{ background: C.sand, borderColor: C.line }}>
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#8A6A22" }}>New, and built by one family</p>
                  <H2 className="mt-2">Help shape Bright Roots</H2>
                  <p className="mt-4 leading-7" style={{ color: C.earth }}>
                    We are a home-educating family in the UK, not a big company, and Bright Roots is still young. That means the people who
                    join now have a real say in what it becomes. Tell us what would make your week easier and there is a good
                    chance we will build it.
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    ["Ask for what you need", "Feature requests go straight to the people who build it."],
                    ["Talk to us directly", "Help and feedback is one click away inside the app, and we read every message."],
                    ["New things often", "We add and improve things regularly, and tell you what is new."],
                  ].map(([title, text]) => (
                    <li key={title} className="flex gap-3">
                      <Check />
                      <span className="text-sm leading-6" style={{ color: C.earth }}>
                        <strong style={{ color: C.ink }}>{title}.</strong> {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section id="pricing" className="relative scroll-mt-16 overflow-hidden py-12 text-white" style={{ background: "#2D3D32" }}>
          <Sprig className="absolute -left-2 bottom-2 hidden h-36 w-auto opacity-40 lg:block" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr_0.3fr]">
            <div>
              <h2 className={`${serif.className} text-3xl font-semibold`}>Simple family membership</h2>
              <p className="mt-3 max-w-md text-white/75">Every feature and every child included. Try it free for 14 days, no card needed, and cancel any time.</p>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFFDF8] px-6 py-3 text-sm font-bold" style={{ color: C.deep }}>
                Start your free trial <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid overflow-hidden rounded-2xl bg-[#FFFDF8] sm:grid-cols-[1.2fr_1fr]" style={{ color: C.ink }}>
              <ul className="space-y-2.5 p-6 text-sm">
                {["Every child included, up to 10", "Planner, timetable & lesson plans", "Reading, spellings & games", "Reports & council report", "Stars, rewards & badges"].map((t) => (
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
                <p className="mt-1 text-sm" style={{ color: C.earth }}>
                  or £59 a year, <strong style={{ color: C.deep }}>about two months free</strong>
                </p>
                <Link href="/signup" className="mt-4 w-full rounded-full py-2.5 text-sm font-bold text-white" style={{ background: C.green }}>
                  Try it free
                </Link>
                <p className="mt-3 text-xs leading-5" style={{ color: C.earth }}>
                  No card needed for the trial. Cancel any time, in a couple of clicks.
                </p>
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
