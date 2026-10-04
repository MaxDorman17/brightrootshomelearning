import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/PublicSite";

export const metadata: Metadata = {
  title: "Your first week of home education: a simple plan",
  description:
    "New to home education in the UK? What to do in your first week, how long a day really needs to be, and a sample week of lessons you can copy.",
};

const WEEK: { day: string; morning: string; afternoon: string }[] = [
  { day: "Monday", morning: "Maths, then reading together", afternoon: "A walk, and talk about what you'd both like to learn" },
  { day: "Tuesday", morning: "English, then maths practice", afternoon: "Science: one simple experiment at the kitchen table" },
  { day: "Wednesday", morning: "Maths, then writing a few sentences", afternoon: "Art, craft or making something" },
  { day: "Thursday", morning: "English, then maths games", afternoon: "History or geography: a video and a chat, or a library trip" },
  { day: "Friday", morning: "A short review of the week", afternoon: "Cooking, sport or a trip out" },
];

const h2 = "mt-12 text-2xl font-black text-brand-charcoal sm:text-3xl";
const p = "mt-4 leading-8 text-[#4A3B2C]";

export default function FirstWeekGuide() {
  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-bold text-brand-sage">
          <Link href="/guides" className="hover:underline">← All guides</Link>
        </p>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Free guide · 6 minute read</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Your first week of home education: a simple plan</h1>
        <p className="mt-6 text-lg leading-8 text-[#6E5A46]">
          The first week is the hardest, mostly because nobody tells you what it should look like. This is the plan I wish
          I&apos;d had when I started home educating my son. It is deliberately gentle.
        </p>

        <h2 className={h2}>First, take the pressure off</h2>
        <p className={p}>
          You don&apos;t have to copy school. There is no bell, no six-hour day and nobody checking your timetable on
          Monday morning. Working one-to-one is far quicker than teaching a class of thirty, so a lot gets done in a
          short time.
        </p>
        <p className={p}>
          Many families find that two or three hours of focused work a day is plenty for a primary-age child, and a
          little more for a teenager. The rest of the day still counts: reading, cooking, building, walking and talking
          are all learning.
        </p>
        <p className={p}>
          If your child has had a hard time at school, they may need a few quiet weeks before they&apos;re ready for
          much structure. That is normal, and it isn&apos;t falling behind.
        </p>

        <h2 className={h2}>What to do in week one</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-[#4A3B2C]">
          <li>
            <strong>Start small.</strong> Maths and English most mornings, and one other thing in the afternoon. That&apos;s
            enough.
          </li>
          <li>
            <strong>Find out where they are.</strong> Don&apos;t assume the school year tells you. Try a lesson a year
            below and one at their level, and see which feels right. Confidence first.
          </li>
          <li>
            <strong>Ask what they want to learn.</strong> One topic they&apos;ve chosen themselves, whether it&apos;s
            volcanoes or football stats, will carry a lot of reading, writing and maths with it.
          </li>
          <li>
            <strong>Get out of the house.</strong> The library, a park, a museum. It breaks up the day and it&apos;s
            learning too.
          </li>
          <li>
            <strong>Write down what you did.</strong> A line a day is fine. It shows you how much you&apos;re really
            covering, and it&apos;s useful if your council asks about your child&apos;s education.
          </li>
        </ol>

        <h2 className={h2}>A sample first week</h2>
        <p className={p}>Use this as a starting point and change anything that doesn&apos;t suit your family.</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-brand-tint text-brand-charcoal">
              <tr>
                <th className="px-4 py-3 font-extrabold">Day</th>
                <th className="px-4 py-3 font-extrabold">Morning (about 1 to 2 hours)</th>
                <th className="px-4 py-3 font-extrabold">Afternoon</th>
              </tr>
            </thead>
            <tbody>
              {WEEK.map((row) => (
                <tr key={row.day} className="border-t border-brand-line align-top text-[#4A3B2C]">
                  <td className="px-4 py-3 font-bold text-brand-charcoal">{row.day}</td>
                  <td className="px-4 py-3">{row.morning}</td>
                  <td className="px-4 py-3">{row.afternoon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={p}>
          Keep lessons short: 20 to 30 minutes for younger children, 40 to 45 for teenagers, with a proper break in
          between. Stop while it&apos;s still going well.
        </p>

        <h2 className={h2}>Where to find free lessons</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#4A3B2C]">
          <li>
            <strong>Oak National Academy</strong> has free video lessons with quizzes for every school year and most
            subjects, in order, so you always know what comes next.
          </li>
          <li>
            <strong>BBC Bitesize</strong> is good for short explanations and revision.
          </li>
          <li>
            <strong>Your local library</strong> is free, and librarians are usually glad to help you find books on a
            topic.
          </li>
          <li>
            <strong>Local home education groups</strong>, often on Facebook, are where you&apos;ll find meet-ups, trips
            and parents a year or two ahead of you.
          </li>
        </ul>

        <h2 className={h2}>The paperwork</h2>
        <p className={p}>
          The rules for taking a child out of school are different in England, Wales, Scotland and Northern Ireland, so
          check what applies where you live before you start. Your council&apos;s website will have a page on home
          education, and{" "}
          <a href="https://www.gov.uk/home-education" className="font-bold text-brand-sage underline">gov.uk/home-education</a>{" "}
          is the official starting point.
        </p>

        <h2 className={h2}>What not to worry about yet</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-8 text-[#4A3B2C]">
          <li>Covering every subject. Add them one at a time over the first term.</li>
          <li>Buying a curriculum. Try the free lessons first and see what your child enjoys.</li>
          <li>Exams. If your child is under 13, you have years. If they&apos;re older, you still have time to plan.</li>
          <li>Doing it perfectly. Every family changes their plan in the first few months.</li>
        </ul>

        <div className="mt-14 rounded-3xl bg-[#2F5D3A] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-black sm:text-3xl">Want your first week planned for you?</h2>
          <p className="mt-3 max-w-xl leading-7 text-white/85">
            Bright Roots was built by a home-educating parent to do the organising. Tell it which school year your child
            is working at, and it fills your first week with free Oak National Academy lessons for every subject on your
            timetable. Your child gets their own login, and you get a record you can print for the council.
          </p>
          <Link href="/signup" className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#2F5D3A] hover:opacity-95">
            Try it free for 14 days →
          </Link>
          <p className="mt-3 text-sm text-white/70">No card needed. £5.99 a month afterwards for the whole family.</p>
        </div>
      </article>
    </PublicShell>
  );
}
