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
          <>Set your week under <L href="/parent/timetable">Plan, then Timetable</L>: add the subjects you teach on each day, and tick the schemes you use at the bottom of that page. Units you add use the timetable to decide which days lessons go on.</>,
          <>Fill your planner with lessons: add a whole unit from the scheme you use (see below), or click an empty slot in the <L href="/parent">Planner</L> to add one lesson.</>,
        ],
        tip: <>Not sure where to start? When a week in the <L href="/parent">Planner</L> is empty, press <b>Add the starter week</b> for a ready-made week of lessons you can change.</>,
      },
      {
        id: "grown-ups",
        emoji: "🏠",
        title: "Adding another parent or guardian",
        intro: "Both parents, a guardian or a grandparent can each have their own login for the same family.",
        steps: [
          <>Open <L href="/account">Family, then Account</L> and find <b>Grown-ups on this account</b>.</>,
          <>Press <b>+ Add another grown-up</b>, enter their name, email address and a password, and say who they are to the children (Mum, Dad, Guardian and so on).</>,
          "They log in on the normal login page with their email address and see everything you do. They can change their own password and picture.",
          "Notes left for the children show who they're from.",
          "Only the main account holder can manage billing, add or remove grown-ups, or delete the account.",
        ],
      },
      {
        id: "edit-child",
        emoji: "🧒",
        title: "Change a child's name, login or activities",
        intro: "Fix a spelling, give them an easier login name, or choose whether they see the younger or teen activities.",
        steps: [
          <>Open <L href="/parent/children">Family, then Children</L> and press <b>Edit</b> next to the child.</>,
          "Change their name. Two children can have the same name, even in different families.",
          "Change their login name if you like. The page tells you if it's free and suggests others if it isn't. Their password stays the same.",
          <>Under <b>Which activities should they see?</b>, pick Little Roots, Saplings, Teens or Everything. This decides which age menus show for them: Little Roots (3 to 4), Saplings (5 to 10) or Teens (11 to 16).</>,
          "Press Save changes. Your own menu updates too: if none of your children are set to Teens, the Teens menu is hidden for you as well, and the same goes for Saplings and Little Roots.",
        ],
        tip: "We ask which activities to show rather than a date of birth, so you choose what suits your child.",
      },
      {
        id: "children-login",
        emoji: "🔑",
        title: "How children log in",
        intro: "Children use the same login page as you, with their own login name and password.",
        steps: [
          <>Each child has a <b>login name</b>, shown under their name on <L href="/parent/children">Family, then Children</L>. Two children can share a name, but every login name is different.</>,
          "Go to the Bright Roots login page and enter the child's login name and password.",
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
        id: "child-timetable",
        emoji: "🗓️",
        title: "Give a child their own timetable",
        intro: "For families whose children don't all follow the same week. Everyone starts on the family timetable.",
        steps: [
          <>Open <L href="/parent/timetable">Plan, then Timetable</L>. Under <b>Whose timetable?</b> pick the child.</>,
          "You'll see the family timetable to start from. Add, remove or reorder subjects on each day.",
          <>Press <b>Save as their own</b>. The family timetable, and your other children, are not changed.</>,
          <>From then on the Planner (when you view that child), their own page, and any units or lesson plans you add for them follow their timetable.</>,
        ],
        tip: "Changed your mind? Pick the child again and press Go back to the family timetable. Lessons already planned stay where they are.",
      },
      {
        id: "log-today",
        emoji: "📝",
        title: "Log what you did, with no plan",
        intro: "For child-led days, trips, and anything that just happened. Nothing needs planning first.",
        steps: [
          <>On your <L href="/parent/dashboard">Home</L> page, find <b>What did you do today?</b></>,
          "Type what you did, pick a subject (or type your own) and who did it.",
          <>Press <b>Save as done</b>. To add a note or log it for an earlier day, press <b>Add a note or change the day</b> first.</>,
          <>It appears in the planner as a finished lesson and counts in <L href="/parent/council-report">your council report</L>.</>,
        ],
        tip: "You can mix both ways: plan maths and English, and log everything else as it happens.",
      },
      {
        id: "child-added",
        emoji: "🙋",
        title: "When your child adds something themselves",
        intro: "Children can tell you about things they did by themselves. Nothing counts until you say OK.",
        steps: [
          <>On their Today page, your child types what they did under <b>Did something else today?</b> and presses <b>Tell them</b>.</>,
          <>It appears at the top of your <L href="/parent/dashboard">Home</L> page under <b>Waiting for your OK</b>.</>,
          <>Press <b>OK</b> and it becomes a finished lesson, with stars and a place in your records. Press <b>Remove</b> and it goes.</>,
        ],
        tip: "A child can have up to five waiting at once, so the list never runs away.",
      },
      {
        id: "repeat-copy",
        emoji: "🔁",
        title: "Repeat a lesson or copy last week",
        intro: "For things that happen every week, like swimming on Tuesdays or reading every day.",
        steps: [
          <>To repeat one lesson, click it in the <L href="/parent">Planner</L>, choose how many more weeks under <b>Repeat</b>, and press <b>Repeat</b>.</>,
          <>To repeat a whole week, go to the new week in the Planner and press <b>Copy Last Week</b>.</>,
          "Days off are skipped, and anything already planned is left alone, so it is safe to press twice.",
        ],
      },
      {
        id: "add-unit",
        emoji: "📚",
        title: "Add a whole unit from any scheme",
        intro: "For Twinkl, White Rose Maths, a workbook or your own plan. List the lessons once and they are spread across your timetable.",
        steps: [
          <>In the <L href="/parent">Planner</L>, press <b>Add a Unit</b>. Or on <L href="/units">Plan, then Units</L>, press <b>Plan this unit</b> under a subject&apos;s current unit.</>,
          "Type or paste the lesson titles, one on each line. If a lesson has its own web page, paste the link after its title.",
          <>Fill in the <b>Scheme</b>, and a link to the unit if there is one. Lessons without their own link use the unit&apos;s link.</>,
          "Choose the subject, the date to start from, and which child (or all children).",
          <>Check the preview, then press <b>Add lessons to planner</b>. Each lesson goes on the next day that subject is on your timetable, skipping days off.</>,
        ],
        tip: "Only the titles and links you type are kept. The worksheets and videos stay on the scheme's own site, and your child opens them from the link.",
      },
      {
        id: "worksheets",
        emoji: "📝",
        title: "Bright Roots worksheets",
        intro: "Short sheets of about ten questions that your child fills in on screen. They are marked automatically, and every one can be printed.",
        steps: [
          <>Open <L href="/worksheets">Saplings, then Worksheets</L>. Sheets are grouped by topic, in teaching order. Use the age buttons or the search box to narrow them down.</>,
          <>Open a sheet and press <b>Add to planner</b>, then choose the day and who it&apos;s for. For a topic with several sheets, <b>Add this topic to the planner</b> puts in one sheet a day, skipping weekends and your days off.</>,
          "Your child opens the sheet from their Today page, or from Worksheets in their own menu, where they are shown one sheet to do next.",
          "They tap or type their answers. Answers save as they go, so they can stop and come back.",
          <>When they press <b>Check my answers</b>, the sheet is marked and shows what was right. They can try the ones they missed, and a planned sheet ticks itself off.</>,
          <>Their best score appears in <L href="/parent/results">Progress, then Test Results</L>, and counts for stars under the rule for scores.</>,
          <>To use paper instead, open a sheet and press <b>Print this sheet</b>. The answers print on a separate page for you.</>,
        ],
        tip: "You can open any sheet yourself to try it. Nothing is saved while you're signed in as a grown-up. A sheet only earns stars once, however many times it's done.",
      },
      {
        id: "oak-finder",
        emoji: "🌳",
        title: "Find and add Oak National Academy lessons",
        intro: "Browse Oak's free lessons by subject and school year, and add one lesson or a whole unit. There are no links to copy.",
        steps: [
          <>Open <L href="/parent/oak">Plan, then Oak Lessons</L>.</>,
          "Pick a subject, then a school year. The ages are shown beside each year, as these are England's school years. Go by what your child is ready for.",
          "For Years 10 and 11, also pick the exam board and the course, such as Biology Higher.",
          "Open a unit to read what it covers and see its lessons in order.",
          <>Press <b>Add</b> beside one lesson, or <b>Add the whole unit</b>. Choose the day to start and who it&apos;s for, then press <b>Add to planner</b>.</>,
          <>A whole unit goes in one lesson a day, skipping weekends and your days off. You can move lessons afterwards in the <L href="/parent">Planner</L>.</>,
        ],
        tip: "The page remembers the subject and year you last chose, so next time you can go straight to the units.",
      },
      {
        id: "oak-lesson",
        emoji: "🎬",
        title: "How your child does an Oak lesson",
        intro: "Oak lessons happen inside Bright Roots, one step at a time, so your child doesn't need to leave for Oak's website.",
        steps: [
          "Your child opens the lesson from their Today page.",
          "Starter quiz: a few warm-up questions, marked straight away.",
          "Watch: the lesson video plays on the page, with captions and the key words underneath.",
          "Worksheet: a button opens Oak's worksheet to do on screen or print.",
          "Exit quiz: handing this in marks the lesson as done. They can try a quiz again, and their best score is kept.",
          <>Both scores show in your Planner and in <L href="/parent/results">Progress, then Test Results</L>, and can earn stars.</>,
        ],
        tip: "A few Oak lessons can't be shown inside Bright Roots because of copyright. Those have an Open Lesson button that goes to Oak's website instead, and a step Oak doesn't have for a lesson is simply left out.",
      },
      {
        id: "oak-unit",
        emoji: "🔗",
        title: "Import an Oak unit by pasting its link",
        intro: "Another way to bring in a whole Oak unit, spread across your timetable by subject. Most families will find Oak Lessons (above) quicker.",
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
        intro: "For one-off lessons, your own activities, or a lesson from any scheme: Twinkl, White Rose Maths, Oak, BBC Bitesize.",
        steps: [
          <>In the <L href="/parent">Planner</L>, click the slot for that day and subject.</>,
          "Give it a title, and paste a link if there is one (a Twinkl resource, a White Rose video, an Oak lesson, a worksheet).",
          <>In <b>Scheme</b>, say where it comes from. It shows as a tag on the lesson and in your council report.</>,
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
        id: "starter-week",
        emoji: "🌱",
        title: "Start with a ready-made week",
        intro: "A week of lessons so your planner isn't empty while you find your feet: free Oak National Academy lessons, or simple ones of our own.",
        steps: [
          <>Open the <L href="/parent">Planner</L> on a week with nothing planned. A <b>Start with a ready-made week?</b> card appears at the top.</>,
          <>Choose the school year each child is working at for Oak lessons. Pick the year that suits them, not just their age. If you don&apos;t use Oak, choose <b>Our own simple lessons (no Oak)</b> instead.</>,
          <>Press <b>Add the starter week</b>. Every slot on your timetable gets a lesson: a free Oak National Academy lesson for that subject and year, with a video and quizzes, or a short hands-on lesson of ours.</>,
          "They're ordinary lessons, so change, move or delete any of them.",
        ],
        tip: "It follows your own timetable, so set that up first if you teach different subjects. Where Oak has no lesson for a subject, such as Life Skills, we add a simple one of our own.",
      },
      {
        id: "calendar",
        emoji: "📅",
        title: "See your plans in Google, Apple or Outlook calendar",
        intro: "Lessons, exams and days off can show up in the calendar on your phone.",
        steps: [
          <>Open <L href="/account">Family, then Account</L> and press <b>Turn on calendar sync</b>.</>,
          <>Press <b>Add to Apple Calendar</b> or <b>Add to Google Calendar</b>, or copy the address and paste it into your calendar app. <b>How do I add it?</b> shows the steps for each one.</>,
          "Changes in Bright Roots show up in your calendar on their own, usually within a few hours.",
          <>Keep the address private. If it gets shared by mistake, press <b>Make a new address</b>, or <b>Turn off</b> to stop it completely.</>,
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
        id: "lesson-scores",
        emoji: "✏️",
        title: "Give any lesson a score",
        intro: "For a worksheet, quiz or test from any scheme. You type in the mark, and it counts like any other result.",
        steps: [
          <>In the <L href="/parent">Planner</L>, click the lesson. Or open its details in <L href="/parent/progress">Progress, then Review &amp; Feedback</L>.</>,
          <>Under <b>Score</b>, type what your child got and what it was out of, for example 8 out of 10, then press <b>Save score</b>.</>,
          <>The score shows on the lesson, in <L href="/parent/results">Progress, then Test Results</L>, and in your council report.</>,
        ],
        tip: <>In <L href="/parent/rewards">Rewards</L> you can add a rule so a good score earns stars: choose &quot;A lesson or test score you mark&quot;.</>,
      },
      {
        id: "oak-scores",
        emoji: "🎯",
        title: "Get Oak quiz scores into Bright Roots",
        intro: "Oak lessons have a starter and an exit quiz. When the lesson is done inside Bright Roots, the scores are saved by themselves.",
        steps: [
          "For a lesson done inside Bright Roots, there is nothing to do: both quiz scores are saved as your child hands each quiz in.",
          <>The scores show on the lesson in your Planner, in <L href="/parent/results">Progress, then Test Results</L>, and on their Progress page. They can also earn stars (see Rewards).</>,
          "For a lesson that opens on Oak's own website, your child does both quizzes there. At the end, Oak offers a link to share their results. Copy that link.",
          <>Back in Bright Roots, your child opens the lesson from their Today page and pastes the link into <b>Paste a link to your work or results</b>, then marks the lesson done.</>,
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
          <>Both reports include P.E., Outdoors and clubs from the <L href="/clubs">activity diary</L>, and practice from <L href="/languages">Languages</L>.</>,
          <>Keep notes and photos along the way in <L href="/parent/journal">Journal</L> and <L href="/moments">Moments &amp; Photos</L>. They make the reports richer.</>,
          "The council report has its own sections for trips and visits, and for exams.",
        ],
      },
      {
        id: "trips",
        emoji: "🚌",
        title: "Trips and days out",
        intro: "Museums, farms, castles, nature reserves: keep a record of where you went and what you learned.",
        steps: [
          <>Open <L href="/moments?tab=trips">Active, then Trips &amp; days out</L> and press <b>+ Add a trip</b>.</>,
          "Say where you went, add the date, a few photos and what the children saw and learned.",
          "Pick a subject if it fits, like History for a castle or Science for a museum, and tick who went.",
          "Trips show on the Moments page too, and in their own Trips and visits section of the council report.",
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
          <>In <L href="/parent/rewards">Family, then Rewards &amp; Badges</L>, set how stars are earned (lessons, Oak quiz scores, scores you mark yourself, spelling tests, books, games).</>,
          "Add rewards and their star cost, like 10 minutes of screen time.",
          "When a child asks for a reward, approve it from the star jar on your home page.",
          "Once they've had it, tick it off so it drops off the list.",
        ],
        tip: "Stars count from when a rule is added or changed. You can give bonus stars by hand on the Rewards page.",
      },
    ],
  },
  {
    group: "Badges",
    guides: [
      {
        id: "own-badges",
        emoji: "🏅",
        title: "Make your own badges",
        intro: "Alongside the built-in badges, make your own for anything you like: kindness, swimming a length, tidying up without being asked.",
        steps: [
          <>Open <L href="/achievements">Family, then Rewards &amp; Badges, then Badges</L> and scroll to <b>Our family&apos;s badges</b> at the bottom.</>,
          <>Press <b>+ Make a badge</b>. Give it a name and say what it&apos;s for.</>,
          "Upload your own picture (a square PNG or JPG works best), or pick a symbol instead.",
          "Tick each child who has earned it. Untick to take it back.",
          "Use Edit to change a badge, or Remove to delete it for everyone.",
        ],
        tip: "Children see the family badges on their own Badges page, and earned ones count towards their total.",
      },
      {
        id: "certificates",
        emoji: "🏆",
        title: "Print a badge certificate",
        intro: "Turn an earned badge into a certificate for the fridge or the record folder.",
        steps: [
          <>On the <L href="/achievements">Badges</L> page, pick the child at the top, then press <b>Print certificate</b> under an earned badge.</>,
          <>For your own family badges, press <b>Certificate for</b> and the child&apos;s name.</>,
          <>Check the name and date, then press <b>Print</b>. It prints on one landscape A4 page, or choose Save as PDF.</>,
        ],
      },
    ],
  },
  {
    group: "Make together",
    guides: [
      {
        id: "make",
        emoji: "🍳",
        title: "Cookbook, Craft Corner, P.E. and Outdoors",
        intro: "Ready-made recipes, crafts, active games and outdoor adventures, plus your own.",
        steps: [
          <>Browse <L href="/make/cookbook">Cookbook</L>, <L href="/make/crafts">Craft Corner</L>, <L href="/make/pe">P.E.</L> and <L href="/make/outdoors">Outdoors</L>, all under Saplings, by age or type.</>,
          <>Press <b>Add to shopping list</b> on anything you&apos;ll make, then print or share the <L href="/make/shopping">Shopping List</L> (under Family).</>,
          "Add your own with '+ Add your own', or copy a ready-made one and change it.",
          "Any of them can be added to the planner as a lesson.",
          <>After a P.E. or Outdoors activity, press <b>We did this</b> to add it to the activity diary.</>,
        ],
      },
      {
        id: "life-skills",
        emoji: "🧺",
        title: "Life skills",
        intro: "Everyday skills with step-by-step instructions, for younger children and for teenagers.",
        steps: [
          <>For younger children, open <L href="/make/life-skills">Saplings, then Life Skills</L>: tying laces, making the bed, telling the time, crossing the road and more.</>,
          <>For 11 to 16, open <L href="/teens/life-skills">Teens, then Life skills</L>: using a washing machine, wiring a plug, ironing, budgeting, first aid and planning a journey.</>,
          <>Press <b>Plan it</b> to add one to the planner as a Life Skills lesson.</>,
          "Steps marked 'Grown-up job' are the ones to do together or check.",
          "Add your own with '+ Add your own life skill'.",
        ],
      },
      {
        id: "teens",
        emoji: "🚀",
        title: "The Teens menu",
        intro: "Cooking, projects, P.E., outdoor skills and life skills written for ages 11 to 16 to do on their own.",
        steps: [
          <>Open <L href="/teens">Teens, then Teen Corner</L> to see everything, or go straight to Cooking, Projects, P.E., Outdoors or Life skills.</>,
          "The Saplings menu shows the versions for ages 5 to 10.",
          "Anything marked from age 10 appears in both, because it suits both.",
          <>To hide the Teens menu for a younger child (or the younger pages for a teenager), press <b>Edit</b> on <L href="/parent/children">Family, then Children</L>.</>,
        ],
      },
      {
        id: "exams",
        emoji: "📝",
        title: "Planning GCSEs and other exams",
        intro: "Keep track of exams sat as a private candidate: the centre, entry deadline, date and revision.",
        steps: [
          <>Open <L href="/teens/exams">Teens, then Exams</L> and press <b>+ Add an exam</b>. Add one for each paper.</>,
          "Fill in what you know: the board, the centre, the entry deadline and fee, and the date and time when they're published.",
          "Until you mark an exam as Entered, its entry deadline shows on the card, in red when it's close.",
          <>Press <b>Plan revision</b> to put revision sessions in the planner on the days you choose, up to the day before the exam.</>,
          "Your teenager sees their exams and a countdown on the same page. Add the result when it comes in.",
        ],
        tip: "Exams and entry deadlines also appear in your calendar if you've turned on calendar sync.",
      },
      {
        id: "languages",
        emoji: "💬",
        title: "Languages",
        intro: "Keep a record of language practice in any language, from French to British Sign Language.",
        steps: [
          <>Open <L href="/languages">Learn, then Languages</L> and press <b>+ Log practice</b>. Pick the language, who practised, and how long.</>,
          "Add Duolingo or other app XP if you like, and a few words about what they practised.",
          <>Children can press <b>I practised!</b> themselves. Practising every day builds a streak.</>,
          <>Streaks, days and XP earn language badges on the <L href="/achievements">Badges</L> page.</>,
          "All practice shows in the learning report and the council report.",
        ],
      },
      {
        id: "clubs",
        emoji: "🏅",
        title: "Clubs and the activity diary",
        intro: "Record clubs like chess, football or swimming, so they count in your reports.",
        steps: [
          <>Open <L href="/clubs">Active, then Clubs &amp; Activities</L> and press <b>+ Add a club</b>. Pick the type, add when and where, and who goes.</>,
          <>After each session, press <b>Log a session</b> on the club&apos;s card. Children can press <b>I went!</b> themselves.</>,
          <>Use <b>Log an activity</b> for anything else active, like a bike ride or a beach clean.</>,
          "When a child stops going, edit the club and tick 'finished'. Its sessions stay in the reports.",
          "Everything in the diary shows in the learning report and the council report.",
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
      {
        id: "feedback",
        emoji: "💬",
        title: "Get help, make a suggestion or leave a review",
        intro: "Send us a message without leaving Bright Roots.",
        steps: [
          <>Open <L href="/parent/feedback">Family, then Help &amp; feedback</L>.</>,
          "Choose what it's about: something isn't working, a question, a suggestion or a review.",
          "Write your message and press Send. We reply to the email address on your account.",
          "For a review, pick your stars. Tick the box only if you're happy for it to be shown on the website, and choose the name to show.",
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
