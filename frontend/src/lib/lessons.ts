import type { Question } from "@/lib/worksheets";
import { planSheets } from "@/lib/api";
import { romansLessons } from "@/lib/lesson-units/romans";
import { kitchenScience } from "@/lib/lesson-units/kitchen-science";
import { rivers } from "@/lib/lesson-units/rivers";

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
  /** Three or four warm-up questions, often about the last lesson. Not saved. */
  starter?: Question[];
  learn: { cards: LessonCard[]; words?: LessonWord[] };
  /** A few practice questions on screen. Not saved. */
  practice?: { intro: string; questions: Question[] };
  /** A Bright Roots worksheet to do as well, by its slug. */
  worksheet?: string;
  /** The hands-on part, away from the screen. */
  task?: { title: string; intro: string; need?: string[]; steps: string[] };
  /** Four to six questions. Finishing it saves the score and finishes the lesson. */
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
  /** The topic pack that goes with this unit, if there is one. */
  topicPack?: string;
  lessons: BrLesson[];
};

/** A unit that's planned but not written yet. It shows as "Coming soon". */
export type ComingUnit = { title: string; subject: string; emoji: string };

export const UNITS: LessonUnit[] = [romansLessons, kitchenScience, rivers];

export const COMING_UNITS: ComingUnit[] = [
  { title: "Ancient Egypt", subject: "History", emoji: "🏺" },
  { title: "Light and shadows", subject: "Science", emoji: "🔦" },
  { title: "The UK and our local area", subject: "Geography", emoji: "🗺️" },
];

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
