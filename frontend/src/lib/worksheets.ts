import { addingAndTakingAway } from "@/lib/worksheet-sets/adding-and-taking-away";
import { placeValue } from "@/lib/worksheet-sets/place-value";
import { multiplying } from "@/lib/worksheet-sets/multiplying";
import { fractions } from "@/lib/worksheet-sets/fractions";
import { time } from "@/lib/worksheet-sets/time";

/**
 * Bright Roots worksheets: short sheets a child fills in on screen, or prints. Written for Bright Roots.
 * Each sheet teaches one thing in about ten questions. Topics are worded so they suit both Scotland's
 * Curriculum for Excellence and England's national curriculum.
 *
 * The sheets live in src/lib/worksheet-sets, one file per topic set. A set is a handful of sheets on one
 * topic, in teaching order; the sets below are in teaching order too. Together they make the path a
 * child follows, so they only ever need to be shown what comes next.
 *
 * A cover picture can be added at /public/worksheet-covers/<slug>.jpg; until then the sheet's own drawing shows.
 * When you add a sheet, add its slug and date to src/lib/newContent.ts so it gets a "New" badge.
 */

/** A maths drawing, made by the page itself so it is always sharp on screen and on paper. */
export type Visual =
  | { kind: "tenframe"; filled: number }
  | { kind: "dots"; rows: number; cols: number }
  | { kind: "numberline"; from: number; to: number; jump?: [number, number] }
  | { kind: "fraction"; shape: "bar" | "circle"; parts: number; shaded: number }
  | { kind: "clock"; hour: number; minute: number }
  | { kind: "blocks"; tens: number; ones: number };

/** A picture from somewhere else, used by Oak's quiz questions. */
export type Picture = { url: string; alt: string; width?: number | null; height?: number | null };
/** Something to choose: words, or a picture. */
export type Option = string | { image: Picture };

type Shared = {
  q: string;
  visual?: Visual;
  image?: Picture;
  /** A short explanation shown once the sheet has been checked. */
  why?: string;
};

export type Question =
  /** Tap the right answer. */
  | (Shared & { type: "choice"; options: Option[]; answer: number })
  /** Tap every right answer: there is more than one. */
  | (Shared & { type: "pick"; options: Option[]; answers: number[] })
  /** Type a number or a word. `after` is shown after the box, e.g. "p" or "o'clock". */
  | (Shared & { type: "type"; answer: string | string[]; after?: string })
  /** Fill each ___ in `text` from the word bank. */
  | (Shared & { type: "gap"; text: string; bank: string[]; answers: string[] })
  /** Tap one from each side to match them. */
  | (Shared & { type: "match"; pairs: [string, string][] })
  /** Tap them in the right order. `items` is the right order; the page shuffles them. */
  | (Shared & { type: "order"; items: string[] });

export type Worksheet = {
  slug: string;
  title: string;
  subject: string;
  topic: string;
  ages: string;
  color: string;
  intro: string;
  cover: Visual;
  /** The comic that teaches the same thing, if there is one. */
  comic?: string;
  questions: Question[];
};

/** A handful of sheets on one topic, in teaching order. Aim for about five to a set. */
export type WorksheetSet = {
  slug: string;
  title: string;
  subject: string;
  summary: string;
  sheets: Worksheet[];
};

/** What a child has put for each question, keyed by the question's position. */
export type Answers = Record<string, unknown>;

// ---------- marking ----------

const tidy = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

function sameText(given: string, wanted: string): boolean {
  const a = tidy(given);
  const b = tidy(wanted);
  if (a === b) return true;
  // "07" and "7" are the same number.
  return a !== "" && b !== "" && !Number.isNaN(Number(a)) && Number(a) === Number(b);
}

export function isAnswered(q: Question, a: unknown): boolean {
  switch (q.type) {
    case "choice":
      return typeof a === "number";
    case "pick":
      return Array.isArray(a) && a.length > 0;
    case "type":
      return typeof a === "string" && a.trim() !== "";
    case "gap":
      return Array.isArray(a) && a.length === q.answers.length && a.every((v) => typeof v === "string" && v !== "");
    case "match":
      return !!a && typeof a === "object" && Object.keys(a as object).length === q.pairs.length;
    case "order":
      return Array.isArray(a) && a.length === q.items.length;
  }
}

export function isRight(q: Question, a: unknown): boolean {
  if (!isAnswered(q, a)) return false;
  switch (q.type) {
    case "choice":
      return a === q.answer;
    case "pick":
      return (a as number[]).length === q.answers.length && q.answers.every((i) => (a as number[]).includes(i));
    case "type":
      return ([] as string[]).concat(q.answer).some((wanted) => sameText(a as string, wanted));
    case "gap":
      return q.answers.every((wanted, i) => (a as string[])[i] === wanted);
    case "match":
      return q.pairs.every(([left, right]) => (a as Record<string, string>)[left] === right);
    case "order":
      return q.items.every((item, i) => (a as string[])[i] === item);
  }
}

/** The right answer in words, for the feedback line and the printed answer page. */
export function answerText(q: Question): string {
  const said = (option: Option, i: number) => (typeof option === "string" ? option : `picture ${i + 1}`);
  switch (q.type) {
    case "choice":
      return said(q.options[q.answer], q.answer);
    case "pick":
      return q.answers.map((i) => said(q.options[i], i)).join(" and ");
    case "type":
      return `${([] as string[]).concat(q.answer)[0]}${q.after ? (/^[a-z]$/i.test(q.after) ? q.after : ` ${q.after}`) : ""}`;
    case "gap":
      return q.answers.join(", ");
    case "match":
      return q.pairs.map(([left, right]) => `${left} → ${right}`).join(";  ");
    case "order":
      return q.items.join(", ");
  }
}

/** The same shuffle every time for the same seed, so a saved half-done sheet looks the same when reopened. */
export function shuffled<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const random = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Never hand back the right order by accident.
  if (out.length > 1 && out.every((v, i) => v === items[i])) out.push(out.shift() as T);
  return out;
}

// ---------- the sheets ----------

/** Every topic set, in the order a child meets them. */
export const WORKSHEET_SETS: WorksheetSet[] = [addingAndTakingAway, placeValue, multiplying, fractions, time];

/** Every sheet, in path order. */
export const WORKSHEETS: Worksheet[] = WORKSHEET_SETS.flatMap((set) => set.sheets);

export const worksheetBySlug = (slug: string) => WORKSHEETS.find((w) => w.slug === slug);
export const setOfSheet = (slug: string) => WORKSHEET_SETS.find((set) => set.sheets.some((w) => w.slug === slug));

/** The sheet that follows this one on the path, in the same subject. */
export function nextSheet(slug: string): Worksheet | undefined {
  const sheet = worksheetBySlug(slug);
  const path = WORKSHEETS.filter((w) => w.subject === sheet?.subject);
  return path[path.findIndex((w) => w.slug === slug) + 1];
}

/** The first sheet in each subject that this child hasn't finished yet. `finished` holds the slugs they have. */
export function nextUp(finished: Set<string>): Worksheet[] {
  const subjects = [...new Set(WORKSHEETS.map((w) => w.subject))];
  return subjects.flatMap((subject) => WORKSHEETS.find((w) => w.subject === subject && !finished.has(w.slug)) ?? []);
}
