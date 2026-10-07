import type { WorksheetSet } from "@/lib/worksheets";

/** Fractions: the sheets are in teaching order, easiest first. Add new ones where they belong in that order. */
export const fractions: WorksheetSet = {
  slug: "fractions",
  title: "Fractions",
  subject: "Maths",
  summary: "Sharing a whole into equal parts.",
  sheets: [
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
  ],
};
