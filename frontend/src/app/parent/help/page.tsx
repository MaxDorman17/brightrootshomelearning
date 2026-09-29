"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { getRole, isAuthenticated } from "@/lib/auth";
import { SUPPORT_EMAIL } from "@/lib/site";

type Guide = { id: string; emoji: string; title: string; intro: string; steps: React.ReactNode[]; tip?: React.ReactNode };

const L = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-bold text-brand-sage underline">
    {children}
  </Link>
);

const GUIDES: { group: string; guides: Guide[] }[] = [
  {
    group: "Getting started",
    guides: [
      {
        id: "first-steps",
        emoji: "🌱",
        title: "Your first 10 minutes",
        intro: "Do these three things in this order and the rest of Bright Roots falls into place.",
        steps: [
          <>Add each child under <L href="/parent/children">Family, then Children</L>. Give them a username and a password they can remember.</>,
          <>Set your week under <L href="/parent/timetable">Plan, then Timetable</L>: add the subjects you teach on each day. Oak imports use this to decide which days lessons go on.</>,
          <>Fill your planner with lessons: import an Oak unit (see below), or click an empty slot in the <L href="/parent">Planner</L> to add your own.</>,
        ],
      },
      {
        id: "children-login",
        emoji: "🔑",
        title: "How children log in",
        intro: "Children use the same login page as you, with their own username and password.",
        steps: [
          "Go to the Bright Roots login page and enter the child's username and password.",
          "They land on their Today page, which shows only their lessons for the day.",
          <>Forgotten password? Reset it on <L href="/parent/children">Family, then Children</L>.</>,
        ],
        tip: "On a tablet or phone, add Bright Roots to the home screen so it opens like an app (look for the 'Get the Bright Roots app' card on your home page).",
      },
    ],
  },
  {
    group: "Planning lessons",
    guides: [
      {
        id: "oak-unit",
        emoji: "🌳",
        title: "Import a whole Oak National Academy unit",
        intro: "Bring in every lesson from an Oak unit and have them spread across your timetable automatically.",
        steps: [
          <>On <a href="https://www.thenational.academy/pupils" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-sage underline">Oak&apos;s pupil site</a>, find the subject, year and unit you want.</>,
          "Open the unit (the page that lists all its lessons) and copy the web address from the address bar. It looks like thenational.academy/pupils/programmes/.../units/...",
          <>In the <L href="/parent">Planner</L>, press <b>Oak Unit</b> and paste the address, then press <b>Fetch unit</b>.</>,
          "Choose which timetable subject the lessons belong to, the date to start from, and which child (or all children).",
          "Check the schedule preview: each lesson goes on the next day that subject is on your timetable.",
          <>Press <b>Add lessons to planner</b>. They appear in your planner, week by week.</>,
        ],
        tip: "If the preview is empty, that subject isn't on your timetable yet. Add it in Timetable and try again.",
      },
      {
        id: "single-lesson",
        emoji: "➕",
        title: "Add a single lesson",
        intro: "For one-off lessons, your own activities, or a single Oak lesson.",
        steps: [
          <>In the <L href="/parent">Planner</L>, click the slot for that day and subject.</>,
          "Give it a title, and paste a link if there is one (an Oak lesson, a YouTube video, a worksheet).",
          "Add any notes for your child, choose who it's for, and save.",
        ],
        tip: <>Lessons you use again and again can live in <L href="/parent/lessons">My Lessons</L>, and you can group them into plans to schedule in one go.</>,
      },
      {
        id: "quick-import",
        emoji: "⚡",
        title: "One-click import from any website",
        intro: "Send the lesson you're looking at straight to your planner, from Oak, BBC Bitesize, YouTube or anywhere else.",
        steps: [
          <>In the <L href="/parent">Planner</L>, press <b>Quick Import</b>.</>,
          <>Drag the <b>Add to Bright Roots</b> button up onto your browser&apos;s bookmarks bar (on a computer).</>,
          "When you're on a lesson page anywhere, click that bookmark. The title and link are sent to your planner for you to place.",
        ],
      },
      {
        id: "days-off",
        emoji: "🏞️",
        title: "Holidays, sick days and moving lessons",
        intro: "Life happens. Move the week around without re-planning everything.",
        steps: [
          <>For school holidays, press <b>Holidays</b> in the Planner. Type your own dates, load UK bank holidays, or upload your council&apos;s calendar file.</>,
          <>For a single day, use <b>Sick day</b> or <b>Holiday</b> at the top of that day.</>,
          <><b>Shift forward</b> and <b>Shift back</b> move a whole day&apos;s lessons along. <b>Move forward</b> and <b>Move back</b> under a lesson move just that one.</>,
        ],
      },
      {
        id: "print",
        emoji: "🖨️",
        title: "Print the week",
        intro: "A paper copy for the fridge or a folder.",
        steps: [<>Go to <L href="/parent/print">Plan, then Print Week</L>, choose the week and child, and print.</>],
      },
    ],
  },
  {
    group: "Following progress",
    guides: [
      {
        id: "oak-scores",
        emoji: "🎯",
        title: "Get Oak quiz scores into Bright Roots",
        intro: "Oak lessons have a starter and an exit quiz. Bright Roots can pick up the scores automatically.",
        steps: [
          "Your child does the Oak lesson as normal, including both quizzes.",
          "At the end, Oak offers a link to share their results. Copy that link.",
          <>Back in Bright Roots, your child opens the lesson from their Today page and pastes the link into <b>Paste your results link</b>, then marks the lesson done.</>,
          <>The scores show on the lesson in your Planner, in <L href="/parent/results">Progress, then Test Results</L>, and on their Progress page. They can also earn stars (see Rewards).</>,
        ],
      },
      {
        id: "review",
        emoji: "📎",
        title: "Look at work and leave feedback",
        intro: "When a child hands in work, it waits for you in one place.",
        steps: [
          <>The bell at the top shows what your children finished today. Work to look at is marked in orange.</>,
          <>Open <L href="/parent/progress">Progress, then Review &amp; Feedback</L> to see everything handed in, grouped by day.</>,
          <>Press <b>Leave feedback</b> to send a message and an emoji (your child sees it on their Today page), or <b>Reviewed</b> if no comment is needed.</>,
        ],
      },
      {
        id: "reports",
        emoji: "📋",
        title: "Reports and the council report",
        intro: "Show what's been covered, for your own records or for your local authority.",
        steps: [
          <><L href="/parent/report">Progress, then Reports</L> gives a summary of lessons, results and reading for the period you pick.</>,
          <><L href="/parent/council-report">Council Report</L> puts together a tidy report for a local authority, ready to print or save as a PDF.</>,
          <>Keep notes and photos along the way in <L href="/parent/journal">Journal</L> and <L href="/moments">Moments &amp; Photos</L>. They make the reports richer.</>,
        ],
      },
    ],
  },
  {
    group: "Reading, spellings and rewards",
    guides: [
      {
        id: "reading",
        emoji: "📚",
        title: "Reading log",
        intro: "Keep track of books being read, finished and wished for.",
        steps: [
          <>Add books in <L href="/reading-log">Learn, then Reading</L>, and choose which child they&apos;re for.</>,
          "Children tick off chapters as they read and answer a few questions when they finish.",
          "Finished books count towards stars if you've set that up.",
        ],
      },
      {
        id: "spellings",
        emoji: "🔤",
        title: "Weekly spellings",
        intro: "Set a list each week and let children learn and test themselves.",
        steps: [
          <>In <L href="/spellings">Learn, then Spellings</L>, add this week&apos;s words.</>,
          "Children practise with the listen-and-spell tool, then take the test when ready.",
          "Scores and tricky words appear in their results so you can see what to practise.",
        ],
      },
      {
        id: "rewards",
        emoji: "⭐",
        title: "Stars and rewards",
        intro: "Children earn stars for learning and spend them on rewards you choose.",
        steps: [
          <>In <L href="/parent/rewards">Family, then Rewards &amp; Badges</L>, set how stars are earned (lessons, Oak quiz scores, spelling tests, books, games).</>,
          "Add rewards and their star cost, like 10 minutes of screen time.",
          "When a child asks for a reward, approve it from the star jar on your home page.",
          "Once they've had it, tick it off so it drops off the list.",
        ],
        tip: "Stars count from when a rule is added or changed. You can give bonus stars by hand on the Rewards page.",
      },
    ],
  },
  {
    group: "Make together",
    guides: [
      {
        id: "make",
        emoji: "🍳",
        title: "Cookbook, Craft Corner and P.E.",
        intro: "Ready-made recipes, crafts and active games, plus your own.",
        steps: [
          <>Browse <L href="/make/cookbook">Cookbook</L>, <L href="/make/crafts">Craft Corner</L> and <L href="/make/pe">P.E.</L> by age or type.</>,
          <>Press <b>Add to shopping list</b> on anything you&apos;ll make, then print or share the <L href="/make/shopping">Shopping List</L>.</>,
          "Add your own with '+ Add your own', or copy a ready-made one and change it.",
          "Any of them can be added to the planner as a lesson.",
        ],
      },
    ],
  },
  {
    group: "Your account",
    guides: [
      {
        id: "account",
        emoji: "🏠",
        title: "Membership, your data and settings",
        intro: "Everything about your account in one place.",
        steps: [
          <>Change your plan or cancel on the <L href="/billing">Billing</L> page.</>,
          <>Change your password, avatar and colours, download all your family&apos;s data, or delete your account on the <L href="/account">Account</L> page.</>,
          <>Set up reminders for your children in <L href="/parent/reminders">Family, then Reminders</L>.</>,
        ],
      },
    ],
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>("first-steps");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    const hash = window.location.hash.slice(1);
    if (hash) setOpen(hash);
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="journal" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Help</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">How-to guides</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
            Step-by-step help with everything in Bright Roots. Tap a guide to open it.
          </p>
        </PageHero>

        <div className="space-y-8">
          {GUIDES.map((section) => (
            <section key={section.group}>
              <h2 className="mb-3 text-lg font-extrabold text-brand-charcoal">{section.group}</h2>
              <div className="space-y-2">
                {section.guides.map((g) => {
                  const isOpen = open === g.id;
                  return (
                    <div key={g.id} id={g.id} className="brand-card scroll-mt-20 overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : g.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-brand-cream sm:px-5"
                      >
                        <Emoji e={g.emoji} className="h-8 w-8 shrink-0 text-2xl" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-extrabold text-brand-charcoal">{g.title}</span>
                          <span className="block text-sm text-[#6E5A46]">{g.intro}</span>
                        </span>
                        <span className="shrink-0 text-brand-sage">{isOpen ? "▾" : "▸"}</span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-brand-line px-4 pb-5 pt-4 sm:px-5">
                          <ol className="space-y-3">
                            {g.steps.map((step, i) => (
                              <li key={i} className="flex gap-3 text-sm leading-6 text-brand-charcoal">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-sage text-xs font-black text-white">
                                  {i + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                          {g.tip && (
                            <p className="mt-4 rounded-xl bg-brand-cream px-4 py-3 text-sm text-[#6E5A46]">
                              <Emoji e="💡" /> <b>Tip:</b> {g.tip}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-[#E3E7D9] p-5 text-sm text-[#4A3B2C]">
          <b>Still stuck?</b> Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          and we&apos;ll help.
        </div>
      </div>
    </div>
  );
}
