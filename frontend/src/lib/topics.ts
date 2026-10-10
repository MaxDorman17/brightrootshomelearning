import type { Question } from "@/lib/worksheets";
import { romans } from "@/lib/topic-packs/romans";

/**
 * Topic packs: everything a grown-up needs to teach one topic at home, in one place. Written for Bright Roots.
 * Each pack has background notes for the grown-up, the key facts, a timeline, the words to know, a short set of
 * ready-to-teach lessons, extra activities, books and places to visit, and quiz sheets a child can do on screen
 * or print. Topics are worded so they suit both Scotland's Curriculum for Excellence and England's national curriculum.
 *
 * The packs live in src/lib/topic-packs, one file per topic. To add one, copy romans.ts, then add it to PACKS below
 * and add its slug and date to lib/newContent.ts so it shows "New" for a month. Pictures go in
 * public/topics/<slug>/: cover.jpg for the tile (set cover: true), and lesson-<n>.jpg for each lesson (set art: true).
 * Colouring sheets and word searches for a topic go on the Colouring page as their own theme (see lib/colouring.ts);
 * set colouring to that theme's slug and they show in the pack too.
 */

export type TopicLesson = {
  title: string;
  emoji: string;
  /** Has its picture at public/topics/<pack>/lesson-<n>.jpg. */
  art?: boolean;
  minutes: number;
  /** What the child will know by the end, in one sentence. */
  aim: string;
  need: string[];
  /** The story to tell, in the grown-up's own words. */
  say: string[];
  /** The hands-on part. */
  doIt: string[];
  /** Questions to talk about together. */
  ask: string[];
  /** Making it easier for a younger brother or sister. */
  younger?: string;
  /** Stretching an older or keen child. */
  older?: string;
};

export type TopicActivity = { emoji: string; title: string; kind: string; text: string; steps?: string[] };
export type TopicLink = { title: string; by?: string; note: string; url?: string };
/** A quiz a child does on screen or on paper, marked the same way as the worksheets. */
export type TopicSheet = { slug: string; title: string; intro: string; questions: Question[] };

export type TopicPack = {
  slug: string;
  title: string;
  /** A short name for the planner, e.g. "Romans" makes "Romans 1: Who were the Romans?". */
  short: string;
  subject: string;
  ages: string;
  /** How long the lessons take, e.g. "6 lessons, about an hour each". */
  length: string;
  color: string;
  emoji: string;
  /** Has a square cover picture at public/topics/<slug>/cover.jpg. */
  cover?: boolean;
  /** One line for the tile. */
  summary: string;
  intro: string;
  curriculum: { england: string; scotland: string };
  /** Notes for the grown-up: what to read before teaching. */
  background: { heading: string; text: string[] }[];
  facts: string[];
  timeline: { when: string; what: string }[];
  words: { word: string; meaning: string }[];
  myths: { myth: string; truth: string }[];
  lessons: TopicLesson[];
  activities: TopicActivity[];
  books: TopicLink[];
  online: TopicLink[];
  visits: TopicLink[];
  sheets: TopicSheet[];
  /** The Colouring page theme holding this topic's colouring sheets and word searches, if it has one. */
  colouring?: string;
};

/** A topic that's planned but not written yet. It shows as a "Coming soon" tile. */
export type ComingTopic = { title: string; subject: string; emoji: string };

export const PACKS: TopicPack[] = [romans];

export const COMING: ComingTopic[] = [
  { title: "Ancient Egypt", subject: "History", emoji: "🏺" },
  { title: "The Vikings", subject: "History", emoji: "⛵" },
  { title: "Stone Age to Iron Age", subject: "History", emoji: "🪨" },
];

export const packBySlug = (slug: string) => PACKS.find((p) => p.slug === slug);
export const packCover = (pack: TopicPack) => (pack.cover ? `/topics/${pack.slug}/cover.jpg` : null);
export const lessonArt = (pack: TopicPack, n: number) => (pack.lessons[n - 1]?.art ? `/topics/${pack.slug}/lesson-${n}.jpg` : null);
export const lessonAnchor = (n: number) => `lesson-${n}`;
