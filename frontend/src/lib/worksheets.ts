/**
 * Bright Roots worksheets: short sheets a child fills in on screen, or prints. Written for Bright Roots.
 * Each sheet teaches one thing in about ten questions. Topics are worded so they suit both Scotland's
 * Curriculum for Excellence and England's national curriculum.
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

type Shared = {
  q: string;
  visual?: Visual;
  /** A short explanation shown once the sheet has been checked. */
  why?: string;
};

export type Question =
  /** Tap the right answer. */
  | (Shared & { type: "choice"; options: string[]; answer: number })
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
  switch (q.type) {
    case "choice":
      return q.options[q.answer];
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

export const WORKSHEETS: Worksheet[] = [
  {
    slug: "number-bonds-to-10",
    title: "Number bonds to 10",
    subject: "Maths",
    topic: "Pairs of numbers that make 10",
    ages: "5 to 7",
    color: "#E8573C",
    intro: "Two numbers that add up to 10 are called a number bond. Find the partner for each number.",
    cover: { kind: "tenframe", filled: 7 },
    comic: "captain-ten",
    questions: [
      {
        type: "choice",
        q: "There are 7 counters in the ten frame. How many more make 10?",
        visual: { kind: "tenframe", filled: 7 },
        options: ["2", "3", "4"],
        answer: 1,
        why: "There are 3 empty boxes. 7 and 3 make 10.",
      },
      { type: "type", q: "4 + ? = 10. What is the missing number?", answer: "6", why: "4 and 6 make 10." },
      { type: "type", q: "10 take away 8 is…", answer: "2", why: "8 and 2 make 10, so 10 take away 8 leaves 2." },
      {
        type: "match",
        q: "Match the partners that make 10.",
        pairs: [["1", "9"], ["2", "8"], ["3", "7"], ["5", "5"]],
      },
      {
        type: "gap",
        q: "Fill the gaps.",
        text: "6 + ___ = 10  and  0 + ___ = 10",
        bank: ["4", "5", "6", "10"],
        answers: ["4", "10"],
      },
      {
        type: "choice",
        q: "Half of the ten frame is full. Which sum does it show?",
        visual: { kind: "tenframe", filled: 5 },
        options: ["5 + 5 = 10", "4 + 6 = 10", "5 + 4 = 10"],
        answer: 0,
        why: "5 boxes are full and 5 are empty.",
      },
      { type: "type", q: "Captain Ten has 10 planks. He uses 1. How many are left?", answer: "9", why: "1 and 9 make 10." },
      {
        type: "choice",
        q: "Which pair does not make 10?",
        options: ["7 and 3", "6 and 5", "8 and 2"],
        answer: 1,
        why: "6 and 5 make 11. The partner for 6 is 4.",
      },
      { type: "type", q: "3 + 7 = ?", answer: "10" },
      {
        type: "type",
        q: "Milo has 10p. A sticker costs 6p. How much change does he get?",
        answer: "4",
        after: "p",
        why: "6 and 4 make 10, so he gets 4p back.",
      },
    ],
  },
  {
    slug: "adding-and-taking-away-to-20",
    title: "Adding and taking away to 20",
    subject: "Maths",
    topic: "Addition and subtraction within 20",
    ages: "5 to 7",
    color: "#3F7FBF",
    intro: "Use the number line to jump forwards when you add and backwards when you take away.",
    cover: { kind: "numberline", from: 0, to: 20, jump: [8, 13] },
    questions: [
      {
        type: "type",
        q: "Start at 8 and jump on 5. Where do you land?",
        visual: { kind: "numberline", from: 0, to: 20, jump: [8, 13] },
        answer: "13",
      },
      { type: "type", q: "9 + 6 = ?", answer: "15", why: "9 and 1 make 10, then 5 more makes 15." },
      {
        type: "type",
        q: "14 take away 5 is…",
        visual: { kind: "numberline", from: 0, to: 20, jump: [14, 9] },
        answer: "9",
      },
      { type: "choice", q: "Which sum makes 12?", options: ["7 + 5", "6 + 5", "8 + 3"], answer: 0, why: "6 + 5 and 8 + 3 both make 11." },
      { type: "gap", q: "Fill the gap.", text: "7 + ___ = 15", bank: ["6", "7", "8", "9"], answers: ["8"] },
      {
        type: "match",
        q: "Match each double to its answer.",
        pairs: [["6 + 6", "12"], ["7 + 7", "14"], ["8 + 8", "16"], ["9 + 9", "18"]],
      },
      { type: "type", q: "There are 17 birds on a fence. 4 fly away. How many are left?", answer: "13" },
      { type: "choice", q: "20 − 7 = ?", options: ["12", "13", "14"], answer: 1 },
      { type: "type", q: "Sam has 8 red cars and 7 blue cars. How many cars altogether?", answer: "15" },
      {
        type: "order",
        q: "Work out each sum, then tap them from the smallest answer to the largest.",
        items: ["5 + 4", "6 + 6", "20 − 3", "10 + 10"],
        why: "The answers are 9, 12, 17 and 20.",
      },
    ],
  },
  {
    slug: "times-tables-2-5-10",
    title: "2, 5 and 10 times tables",
    subject: "Maths",
    topic: "Multiplying by 2, 5 and 10",
    ages: "6 to 8",
    color: "#7A5BB5",
    intro: "Times means “lots of”. 3 × 5 is 3 lots of 5. Counting in 2s, 5s and 10s will help you.",
    cover: { kind: "dots", rows: 3, cols: 5 },
    questions: [
      {
        type: "type",
        q: "There are 3 rows of 5 dots. How many dots altogether?",
        visual: { kind: "dots", rows: 3, cols: 5 },
        answer: "15",
        why: "5, 10, 15. 3 × 5 = 15.",
      },
      { type: "type", q: "2 × 7 = ?", answer: "14" },
      { type: "type", q: "10 × 6 = ?", answer: "60" },
      { type: "choice", q: "5 × 4 = ?", options: ["9", "20", "25"], answer: 1, why: "5, 10, 15, 20." },
      {
        type: "gap",
        q: "Count in 5s and fill the gaps.",
        text: "5, 10, ___, 20, ___",
        bank: ["12", "15", "25", "30"],
        answers: ["15", "25"],
      },
      {
        type: "match",
        q: "Match each sum to its answer.",
        pairs: [["2 × 9", "18"], ["5 × 5", "25"], ["10 × 3", "30"], ["5 × 8", "40"]],
      },
      { type: "type", q: "Each bike has 2 wheels. How many wheels are on 6 bikes?", answer: "12", why: "6 × 2 = 12." },
      {
        type: "choice",
        q: "Which number is in the 10 times table?",
        options: ["25", "52", "70"],
        answer: 2,
        why: "Numbers in the 10 times table end in 0.",
      },
      {
        type: "choice",
        q: "There are 2 rows of 8 dots. Which sum matches the picture?",
        visual: { kind: "dots", rows: 2, cols: 8 },
        options: ["2 × 8 = 16", "2 + 8 = 10", "8 × 8 = 64"],
        answer: 0,
      },
      { type: "type", q: "There are 5 pencils in a pack. How many pencils are in 9 packs?", answer: "45", why: "9 × 5 = 45." },
    ],
  },
  {
    slug: "halves-and-quarters",
    title: "Halves and quarters",
    subject: "Maths",
    topic: "Finding a half and a quarter",
    ages: "6 to 8",
    color: "#D9822B",
    intro: "A half is one of 2 equal parts. A quarter is one of 4 equal parts. The parts must be the same size.",
    cover: { kind: "fraction", shape: "circle", parts: 4, shaded: 1 },
    comic: "fen-the-fraction-fox",
    questions: [
      {
        type: "choice",
        q: "How much of the circle is coloured?",
        visual: { kind: "fraction", shape: "circle", parts: 2, shaded: 1 },
        options: ["one half", "one quarter", "one whole"],
        answer: 0,
        why: "There are 2 equal parts and 1 is coloured.",
      },
      {
        type: "choice",
        q: "How much of the bar is coloured?",
        visual: { kind: "fraction", shape: "bar", parts: 4, shaded: 1 },
        options: ["one half", "one quarter", "three quarters"],
        answer: 1,
        why: "There are 4 equal parts and 1 is coloured.",
      },
      { type: "type", q: "Half of 8 is…", answer: "4", why: "4 and 4 make 8." },
      { type: "type", q: "Half of 14 is…", answer: "7", why: "7 and 7 make 14." },
      { type: "type", q: "A quarter of 12 is…", answer: "3", why: "Share 12 into 4 equal groups. Each group has 3." },
      {
        type: "choice",
        q: "Two quarters are coloured. That is the same as…",
        visual: { kind: "fraction", shape: "circle", parts: 4, shaded: 2 },
        options: ["one half", "one quarter", "one whole"],
        answer: 0,
        why: "Two quarters cover half of the circle.",
      },
      {
        type: "match",
        q: "Match each one to its answer.",
        pairs: [["half of 10", "5"], ["half of 20", "10"], ["a quarter of 8", "2"], ["a quarter of 16", "4"]],
      },
      { type: "type", q: "Fen shares 6 berries equally with a friend. How many do they get each?", answer: "3" },
      {
        type: "gap",
        q: "Fill the gaps.",
        text: "A pizza cut into 4 equal slices has ___ quarters. Two of the slices make one ___.",
        bank: ["2", "4", "half", "quarter"],
        answers: ["4", "half"],
      },
      {
        type: "choice",
        q: "How much of the bar is coloured?",
        visual: { kind: "fraction", shape: "bar", parts: 4, shaded: 3 },
        options: ["one quarter", "one half", "three quarters"],
        answer: 2,
      },
    ],
  },
  {
    slug: "telling-the-time",
    title: "O’clock and half past",
    subject: "Maths",
    topic: "Telling the time",
    ages: "6 to 8",
    color: "#2F8F83",
    intro: "The short hand shows the hour. The long hand shows the minutes: at 12 for o’clock and at 6 for half past.",
    cover: { kind: "clock", hour: 3, minute: 0 },
    comic: "clockwork-clara",
    questions: [
      {
        type: "choice",
        q: "What time does the clock show?",
        visual: { kind: "clock", hour: 3, minute: 0 },
        options: ["3 o’clock", "12 o’clock", "half past 3"],
        answer: 0,
        why: "The long hand is at 12 and the short hand is at 3.",
      },
      {
        type: "choice",
        q: "What time does the clock show?",
        visual: { kind: "clock", hour: 7, minute: 30 },
        options: ["half past 6", "half past 7", "7 o’clock"],
        answer: 1,
        why: "The long hand is at 6, and the short hand is half way past the 7.",
      },
      { type: "choice", q: "At 5 o’clock, which number does the long hand point to?", options: ["5", "6", "12"], answer: 2 },
      { type: "choice", q: "At half past, which number does the long hand point to?", options: ["3", "6", "12"], answer: 1 },
      {
        type: "choice",
        q: "What time does the clock show?",
        visual: { kind: "clock", hour: 10, minute: 30 },
        options: ["half past 10", "half past 11", "6 o’clock"],
        answer: 0,
      },
      { type: "type", q: "How many minutes are there in one hour?", answer: "60" },
      { type: "type", q: "How many minutes are there in half an hour?", answer: "30", why: "Half of 60 is 30." },
      {
        type: "match",
        q: "Match the clock numbers to the words.",
        pairs: [["9:00", "9 o’clock"], ["9:30", "half past 9"], ["2:30", "half past 2"], ["12:00", "12 o’clock"]],
      },
      {
        type: "order",
        q: "Put Clara’s day in order, starting with the morning.",
        items: ["Breakfast at 8 o’clock in the morning", "Lunch at half past 12", "Home at half past 3", "Bed at 7 o’clock at night"],
      },
      { type: "type", q: "It is 4 o’clock. What time will it be in one hour?", answer: "5", after: "o’clock" },
    ],
  },
  {
    slug: "tens-and-ones",
    title: "Tens and ones",
    subject: "Maths",
    topic: "Place value to 100",
    ages: "6 to 8",
    color: "#4C8C4A",
    intro: "In a two-digit number, the first digit tells you how many tens and the second tells you how many ones.",
    cover: { kind: "blocks", tens: 3, ones: 4 },
    questions: [
      {
        type: "type",
        q: "Each long stick is 10 and each small cube is 1. What number do the blocks show?",
        visual: { kind: "blocks", tens: 3, ones: 4 },
        answer: "34",
        why: "3 tens are 30, and 4 ones make 34.",
      },
      { type: "choice", q: "How many tens are in 52?", options: ["2", "5", "7"], answer: 1 },
      { type: "gap", q: "Fill the gaps.", text: "47 = ___ tens and ___ ones", bank: ["4", "7", "11", "40"], answers: ["4", "7"] },
      {
        type: "type",
        q: "What number do the blocks show?",
        visual: { kind: "blocks", tens: 6, ones: 0 },
        answer: "60",
        why: "6 tens and no ones is 60.",
      },
      { type: "choice", q: "Which number is the biggest?", options: ["39", "41", "14"], answer: 1, why: "41 has the most tens." },
      { type: "order", q: "Tap the numbers from smallest to largest.", items: ["18", "27", "72", "81"] },
      { type: "type", q: "What is 10 more than 45?", answer: "55", why: "One more ten: 4 tens become 5 tens." },
      { type: "type", q: "What is 10 less than 30?", answer: "20" },
      {
        type: "match",
        q: "Match the words to the number.",
        pairs: [["2 tens and 5 ones", "25"], ["5 tens and 2 ones", "52"], ["7 tens", "70"], ["7 ones", "7"]],
      },
      { type: "choice", q: "In the number 86, what is the 8 worth?", options: ["8", "80", "800"], answer: 1, why: "The 8 is in the tens place: 8 tens are 80." },
    ],
  },
];

export const worksheetBySlug = (slug: string) => WORKSHEETS.find((w) => w.slug === slug);
