"use client";

import Link from "next/link";
import Emoji from "@/components/Emoji";
import ReadAloud from "@/components/ReadAloud";
import type { PlannerEntry } from "@/types";

// A picture for each subject, so a child who isn't reading yet can still tell what's now and next.
const SUBJECT_EMOJI: Record<string, string> = {
  Maths: "🔢",
  English: "✏️",
  Reading: "📚",
  Phonics: "🔤",
  Science: "🔬",
  History: "🏛️",
  Geography: "🌍",
  Computing: "💻",
  Cooking: "🧑‍🍳",
  "Art & Design": "🎨",
  Art: "🎨",
  "Design and Technology": "🔧",
  "Life Skills": "🧺",
  Languages: "🗣️",
  "RSHE (PSHE)": "💛",
  PE: "⚽",
  "P.E.": "⚽",
  Music: "🎵",
  RE: "🕊️",
};

const emojiFor = (subject: string) => SUBJECT_EMOJI[subject] ?? "📘";

/**
 * The day one lesson at a time: a big "Now" card, a smaller "Next" card, and how many are done.
 * Used on the child's Today page when their "One thing at a time" setting is on.
 */
export default function FocusDay({ entries, onOpen, onShowAll }: { entries: PlannerEntry[]; onOpen: (entry: PlannerEntry) => void; onShowAll: () => void }) {
  const todo = entries.filter((e) => !e.is_complete);
  const now = todo[0] ?? null;
  const next = todo[1] ?? null;
  const done = entries.length - todo.length;

  return (
    <div>
      {/* One dot per lesson, filled in as they're done */}
      <div className="mb-4 flex items-center justify-center gap-2" aria-label={`${done} of ${entries.length} lessons done`}>
        {entries.map((e) => (
          <span
            key={e.id}
            className={"h-3 w-3 rounded-full " + (e.is_complete ? "bg-brand-leaf" : e === now ? "bg-brand-sage ring-2 ring-brand-sage/30" : "bg-brand-mist")}
          />
        ))}
      </div>

      {!now ? (
        <div className="rounded-2xl border border-brand-mist bg-brand-wash p-8 text-center">
          <Emoji e="🌟" className="mx-auto h-16 w-16 text-5xl" />
          <p className="mt-3 text-2xl font-extrabold text-brand-deep">All done for today!</p>
          <p className="mt-1 text-sm text-[#6E5A46]">Every lesson is finished. Well done.</p>
        </div>
      ) : (
        <div className="grid items-stretch gap-4 sm:grid-cols-[3fr_2fr]">
          <div className="rounded-3xl border-2 border-brand-sage bg-white p-6 text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Now</p>
            <Emoji e={emojiFor(now.lesson.subject)} className="mx-auto mt-3 h-24 w-24 text-7xl" />
            <p className="mt-3 text-sm font-bold text-[#8A7A69]">{now.lesson.subject}</p>
            <p className="mt-1 text-2xl font-extrabold leading-snug text-brand-charcoal">{now.lesson.title}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button onClick={() => onOpen(now)} className="rounded-xl bg-brand-sage px-6 py-3 text-base font-extrabold text-white hover:bg-brand-sagedark">
                Start →
              </button>
              <ReadAloud text={`Now: ${now.lesson.subject}. ${now.lesson.title}.${next ? ` Next: ${next.lesson.subject}.` : ""}`} />
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border-2 border-dashed border-brand-line bg-brand-cream/60 p-5 text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand-softsage">Next</p>
            {next ? (
              <>
                <Emoji e={emojiFor(next.lesson.subject)} className="mx-auto mt-2 h-14 w-14 text-5xl" />
                <p className="mt-2 font-extrabold text-brand-charcoal">{next.lesson.subject}</p>
              </>
            ) : (
              <>
                <Emoji e="🎉" className="mx-auto mt-2 h-14 w-14 text-5xl" />
                <p className="mt-2 font-extrabold text-brand-charcoal">All done!</p>
              </>
            )}
            <Link href="/make/sen/breaks" className="mt-4 text-sm font-bold text-brand-sage hover:underline">
              🤸 Need a movement break first?
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button onClick={onShowAll} className="text-sm font-bold text-brand-sage hover:underline">
          See the whole day
        </button>
      </div>
    </div>
  );
}
