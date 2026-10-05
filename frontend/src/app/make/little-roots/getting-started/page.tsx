"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Emoji from "@/components/Emoji";
import { isAuthenticated } from "@/lib/auth";

const AREAS: { area: string; what: string; eyfs: string; scotland: string }[] = [
  { area: "Talk", what: "New words, taking turns, telling stories", eyfs: "Communication and language", scotland: "Literacy and English: listening and talking" },
  { area: "Early maths", what: "Counting, one each, more and fewer, shapes and sizes", eyfs: "Mathematics", scotland: "Numeracy and mathematics" },
  { area: "Letters and sounds", what: "Listening, first sounds, rhyme", eyfs: "Literacy", scotland: "Literacy and English" },
  { area: "Moving", what: "Balance, jumping, big arm movements, stopping on a signal", eyfs: "Physical development", scotland: "Health and wellbeing: physical activity" },
  { area: "Creating", what: "Mark making, making pictures, pretend play", eyfs: "Expressive arts and design", scotland: "Expressive arts" },
  { area: "The world around us", what: "Nature, light and dark, how things work", eyfs: "Understanding the world", scotland: "Sciences and social studies" },
  { area: "Rhymes and songs", what: "Rhythm, counting rhymes, actions", eyfs: "Communication and language, and Literacy", scotland: "Literacy and English, and Expressive arts" },
];

const h2 = "text-xl font-extrabold text-brand-charcoal";
const p = "mt-2 text-sm leading-relaxed text-brand-earth";

/** For grown-ups: what Little Roots is, how the story books work and why short and playful works at 3 and 4. */
export default function LittleRootsGettingStarted() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHero art="children" tint={2}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Little Roots · ages 3 to 4</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Getting started</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
            Ten or fifteen minutes of play together, a few times a week. Here&apos;s how it works.
          </p>
        </PageHero>

        <div className="mt-6 grid gap-5">
          <section className="brand-card p-5 sm:p-6">
            <h2 className={h2}>
              <Emoji e="🌱" /> What Little Roots is
            </h2>
            <p className={p}>
              Short, playful activities for 3 and 4 year olds that you do together. There&apos;s nothing to buy: everything uses
              things you already have at home. Each one comes as a picture book you read together on a phone, tablet or computer,
              with a little story running through it.
            </p>
            <p className={p}>
              At this age, children learn best by playing, talking and moving with someone they love. You don&apos;t need to
              teach. You just need to join in, chat and have fun.
            </p>
          </section>

          <section className="brand-card p-5 sm:p-6">
            <h2 className={h2}>
              <Emoji e="📖" /> How a story book works
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-brand-earth">
              <li>
                <b>Open the activity and press Start.</b> The cover and the opening of the story come first.
              </li>
              <li>
                <b>What we need.</b> Hunt for everything together and tap each thing when you&apos;ve found it. The safety note for
                you is on the same page.
              </li>
              <li>
                <b>One page for each step.</b> Read the big words aloud: that&apos;s the story. The box underneath, &quot;For the
                grown-up&quot;, tells you what to do, and the speech bubble gives you something to say or ask.
              </li>
              <li>
                <b>Let&apos;s talk about it.</b> Snuggle up and chat about what you did.
              </li>
              <li>
                <b>Ready for more, or tired today?</b> A harder idea if they&apos;re flying, and an easier one for days when
                they&apos;re not.
              </li>
              <li>
                <b>The End.</b> Your child taps the stars. Choose who did it, add what they said if you like, and press
                &quot;We did it!&quot;. The stars go into their star jar, the planner ticks itself off, and their words go into
                your learning journal.
              </li>
            </ol>
          </section>

          <section className="brand-card p-5 sm:p-6">
            <h2 className={h2}>
              <Emoji e="📅" /> A simple week
            </h2>
            <p className={p}>
              The Little Roots page has <b>This week</b>: three activities and a rhyme, a different set each week. Press{" "}
              <b>Plan this week</b> and they go into your planner on Monday, Wednesday and Friday. Swap days around whenever you
              like. Three short sessions a week is plenty. Some families do one a day, and that&apos;s fine too.
            </p>
            <p className={p}>
              Want it on paper? Every activity has <b>Print a fridge card</b>: one A5 sheet with the steps and things to say.
            </p>
          </section>

          <section className="brand-card p-5 sm:p-6">
            <h2 className={h2}>
              <Emoji e="🧒" /> Adding your little one
            </h2>
            <p className={p}>
              In <Link href="/parent/children" className="font-bold text-brand-sage underline">Children</Link>, add them and choose{" "}
              <b>Little Roots</b>. They don&apos;t need a login name or a password, because you do everything together from your
              own account. They still get their own planner, star jar and reports. When they&apos;re ready for their own login, edit
              them, choose Younger and set a password.
            </p>
          </section>

          <section className="brand-card p-5 sm:p-6">
            <h2 className={h2}>
              <Emoji e="💡" /> Tips that help
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-earth">
              <li><b>Stop while it&apos;s still fun.</b> Ten happy minutes beats twenty tearful ones.</li>
              <li><b>Follow their lead.</b> If the tea party turns into a picnic for dinosaurs, go with it.</li>
              <li><b>Repeat favourites.</b> Little ones love doing the same thing again, and they learn more each time.</li>
              <li><b>Talk more than you ask.</b> Say what you see (&quot;You put the red one on top!&quot;) as well as asking questions.</li>
              <li><b>Choose your moment.</b> After a snack and before they&apos;re tired works best for most children.</li>
              <li><b>Stay close.</b> Every activity has a safety note. Under 5s need a grown-up with them the whole time.</li>
            </ul>
          </section>

          <section className="brand-card p-5 sm:p-6">
            <h2 className={h2}>
              <Emoji e="🌍" /> The areas, and how they match the early years guidance
            </h2>
            <p className={p}>
              Each activity belongs to one area. They line up with the early years frameworks, which helps if your council asks
              how you cover early learning. In England that&apos;s the EYFS. In Scotland it&apos;s Curriculum for Excellence early
              level, with the Realising the Ambition guidance. Getting on with others, feelings and taking turns run through all of
              them.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-brand-line text-xs uppercase tracking-wider text-brand-softsage">
                    <th className="py-2 pr-3">Little Roots area</th>
                    <th className="py-2 pr-3">What it covers</th>
                    <th className="py-2 pr-3">EYFS (England)</th>
                    <th className="py-2">Early level (Scotland)</th>
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((a) => (
                    <tr key={a.area} className="border-b border-brand-line/60 align-top text-brand-earth">
                      <td className="py-2 pr-3 font-bold text-brand-charcoal">{a.area}</td>
                      <td className="py-2 pr-3">{a.what}</td>
                      <td className="py-2 pr-3">{a.eyfs}</td>
                      <td className="py-2">{a.scotland}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-brand-earth/70">
              The activities and stories are written for Bright Roots. Only the area names follow the frameworks.
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href="/make/little-roots" className="rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-sagedark">
              See the activities →
            </Link>
            <Link href="/parent/children" className="rounded-xl border-2 border-brand-line bg-white px-5 py-3 text-sm font-extrabold text-brand-sage">
              Add a little one
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
