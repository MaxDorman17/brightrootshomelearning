import type { Question } from "@/lib/worksheets";
import { planSheets } from "@/lib/api";
import { romansLessons } from "@/lib/lesson-units/romans";
import { kitchenScience } from "@/lib/lesson-units/kitchen-science";
import { rivers } from "@/lib/lesson-units/rivers";
import { colourAndArtists } from "@/lib/lesson-units/colour-and-artists";
import { feelingsAndFriendships } from "@/lib/lesson-units/feelings-and-friendships";
import { festivalsOfLight } from "@/lib/lesson-units/festivals-of-light";
import { ancientEgypt } from "@/lib/lesson-units/ancient-egypt";
import { lightAndShadows } from "@/lib/lesson-units/light-and-shadows";

/**
 * Bright Roots lessons: lessons a child does on screen, step by step, in the same way as an Oak lesson. Written for
 * Bright Roots. Each lesson has a short starter quiz, a "Learn" part told in picture cards, something to try on screen,
 * a hands-on task away from the screen, and an exit quiz. The grown-up gets notes the child doesn't see.
 *
 * Lessons come in units, a handful of lessons on one topic in teaching order. The units live in src/lib/lesson-units,
 * one file per unit. To add one, copy romans.ts, then add it to UNITS below. Give every lesson its own slug and never
 * change it once the unit is live: planned lessons open by their slug (/lessons/<slug>).
 *
 * A grown-up puts a whole unit into the planner from the Bright Roots Lessons page. The exit quiz is the lesson's score:
 * finishing it saves the best score, shows it in Test Results, and ticks the lesson off in the planner.
 * Science lessons only use things most homes already have.
 */

export type LessonCard = {
  heading?: string;
  text: string[];
  /** A picture from /public, e.g. "/topics/romans/lesson-1.jpg". */
  picture?: string;
  alt?: string;
};

export type LessonWord = { word: string; meaning: string };

export type BrLesson = {
  /** Never change once live. */
  slug: string;
  title: string;
  emoji: string;
  minutes: number;
  /** What the child can do by the end, starting "I can". */
  goal: string;
  /** Six warm-up questions, often about the last lesson. Not saved. */
  starter?: Question[];
  learn: { cards: LessonCard[]; words?: LessonWord[] };
  /** A few practice questions on screen. Not saved. */
  practice?: { intro: string; questions: Question[] };
  /** A Bright Roots worksheet to do as well, by its slug. */
  worksheet?: string;
  /** The hands-on part, away from the screen. */
  task?: { title: string; intro: string; need?: string[]; steps: string[] };
  /** Six questions. Finishing it saves the score and finishes the lesson. */
  exit: Question[];
  /** For the grown-up only. */
  grownUp: { need?: string[]; tips: string[]; younger?: string; older?: string };
};

export type LessonUnit = {
  slug: string;
  title: string;
  /** A short name for the planner, e.g. "Romans" makes "Romans 1: Who were the Romans?". */
  short: string;
  subject: string;
  ages: string;
  emoji: string;
  color: string;
  summary: string;
  /** The unit's square cover picture. Without one, the topic pack's cover or the emoji is shown. */
  cover?: string;
  /** The topic pack that goes with this unit, if there is one. */
  topicPack?: string;
  lessons: BrLesson[];
};

/** A unit that's planned but not written yet. It shows as "Coming soon". */
export type ComingUnit = { title: string; subject: string; emoji: string };

export const UNITS: LessonUnit[] = [
  romansLessons,
  ancientEgypt,
  kitchenScience,
  lightAndShadows,
  rivers,
  colourAndArtists,
  feelingsAndFriendships,
  festivalsOfLight,
];

export const COMING_UNITS: ComingUnit[] = [
  { title: "The UK and our local area", subject: "Geography", emoji: "🗺️" },
  { title: "Drawing and sketching", subject: "Art & Design", emoji: "✏️" },
  { title: "Keeping healthy", subject: "RSHE (PSHE)", emoji: "🍎" },
  { title: "Special places of worship", subject: "Religious Education", emoji: "🕌" },
  { title: "The Vikings", subject: "History", emoji: "⛵" },
];

/** The subjects on the Bright Roots Lessons page, in order. `name` matches each unit's `subject`. */
export type LessonSubject = { slug: string; name: string; emoji: string; color: string; blurb: string; cover?: string };

export const LESSON_SUBJECTS: LessonSubject[] = [
  { slug: "history", name: "History", emoji: "🏛️", color: "#B5523B", blurb: "Romans, Egyptians, Vikings and more, told as stories.", cover: "/lessons/covers/history.jpg" },
  { slug: "science", name: "Science", emoji: "🔬", color: "#2F7A8C", blurb: "Experiments with things you already have at home.", cover: "/lessons/covers/science.jpg" },
  { slug: "geography", name: "Geography", emoji: "🌍", color: "#2C6FA6", blurb: "Rivers, maps, weather and places near and far.", cover: "/lessons/covers/geography.jpg" },
  { slug: "art", name: "Art & Design", emoji: "🎨", color: "#B0457B", blurb: "Colour, drawing, making, and great artists.", cover: "/lessons/covers/art.jpg" },
  { slug: "computing", name: "Computing", emoji: "💻", color: "#3D6B5A", blurb: "How computers work, staying safe online, and coding." },
  { slug: "rshe", name: "RSHE (PSHE)", emoji: "💛", color: "#C7892B", blurb: "Feelings, friendships, keeping healthy and staying safe.", cover: "/lessons/covers/rshe.jpg" },
  { slug: "re", name: "Religious Education", emoji: "🪔", color: "#7B4FA3", blurb: "Festivals, beliefs and stories from many faiths.", cover: "/lessons/covers/re.jpg" },
];

export const subjectBySlug = (slug: string) => LESSON_SUBJECTS.find((s) => s.slug === slug);
export const subjectOf = (unit: LessonUnit) => LESSON_SUBJECTS.find((s) => s.name === unit.subject);
export const unitsIn = (subject: LessonSubject) => UNITS.filter((u) => u.subject === subject.name);
export const comingIn = (subject: LessonSubject) => COMING_UNITS.filter((c) => c.subject === subject.name);

/** Where a unit is listed: its subject's page, scrolled to the unit. */
export const unitLink = (unit: LessonUnit) => {
  const subject = subjectOf(unit);
  return subject ? `/lessons/subject/${subject.slug}#${unit.slug}` : `/lessons#${unit.slug}`;
};

/** The school years an age range roughly matches, for families who think in years. */
const YEARS: Record<string, string> = {
  "4 to 5": "Reception · P1",
  "5 to 7": "Years 1 and 2 · P2 and P3",
  "7 to 9": "Years 3 and 4 · P4 and P5",
  "9 to 11": "Years 5 and 6 · P6 and P7",
  "7 to 11": "Years 3 to 6 · P4 to P7",
  "11 to 14": "Years 7 to 9 · S1 to S3",
};
/** Lower-case words of a search box, ignoring very short ones. */
const searchWords = (q: string) => q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);

const lessonText = (l: BrLesson) => [l.title, l.goal, ...(l.learn.words ?? []).map((w) => w.word)].join(" ").toLowerCase();

/**
 * Units matching a search. A unit whose title or summary matches shows all its lessons;
 * otherwise it shows only the lessons that match (`lessons`), and units with none are left out.
 */
export function searchUnits(units: LessonUnit[], q: string): { unit: LessonUnit; lessons?: Set<string> }[] {
  const words = searchWords(q);
  if (words.length === 0) return units.map((unit) => ({ unit }));
  const has = (text: string) => words.every((w) => text.includes(w));
  const out: { unit: LessonUnit; lessons?: Set<string> }[] = [];
  for (const unit of units) {
    const unitText = [unit.title, unit.short, unit.summary, unit.subject].join(" ").toLowerCase();
    if (has(unitText)) {
      out.push({ unit });
      continue;
    }
    const lessons = unit.lessons.filter((l) => has(`${unitText} ${lessonText(l)}`));
    if (lessons.length > 0) out.push({ unit, lessons: new Set(lessons.map((l) => l.slug)) });
  }
  return out;
}

export const yearsFor = (ages: string) => YEARS[ages];

/** Where a lesson opens, and what the planner stores as its link. */
export const lessonLink = (slug: string) => `/lessons/${slug}`;

const LINK_RE = /^\/lessons\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/** The lesson a planner link points to, if it is a Bright Roots lesson. */
export function lessonForLink(url?: string | null): { unit: LessonUnit; lesson: BrLesson; number: number } | null {
  const slug = url?.match(LINK_RE)?.[1];
  return slug ? lessonBySlug(slug) : null;
}

export function lessonBySlug(slug: string): { unit: LessonUnit; lesson: BrLesson; number: number } | null {
  for (const unit of UNITS) {
    const i = unit.lessons.findIndex((l) => l.slug === slug);
    if (i >= 0) return { unit, lesson: unit.lessons[i], number: i + 1 };
  }
  return null;
}

/** The name a lesson has in the planner and in results, e.g. "Romans 2: The Romans come to Britain". */
export const plannerTitle = (unit: LessonUnit, number: number) => `${unit.short} ${number}: ${unit.lessons[number - 1].title}`;

/** Puts a whole unit into the planner, in order, on the days `subject` is on the timetable. For PlanSheets' `plan`. */
export const planUnit = (unit: LessonUnit) => (day: string, childIds: number[], subject: string) =>
  planSheets(
    unit.lessons.map((l, i) => ({ kind: "lesson" as const, slug: l.slug, title: plannerTitle(unit, i + 1), subject, intro: "", minutes: l.minutes })),
    day,
    childIds
  );
