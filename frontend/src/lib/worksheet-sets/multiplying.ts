import type { WorksheetSet } from "@/lib/worksheets";

/** Multiplying: the sheets are in teaching order, easiest first. Add new ones where they belong in that order. */
export const multiplying: WorksheetSet = {
  slug: "multiplying",
  title: "Multiplying",
  subject: "Maths",
  summary: "Times tables and what “lots of” means.",
  sheets: [
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
  ],
};
