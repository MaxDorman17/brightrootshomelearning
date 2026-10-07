import type { WorksheetSet } from "@/lib/worksheets";

/** Place value: the sheets are in teaching order, easiest first. Add new ones where they belong in that order. */
export const placeValue: WorksheetSet = {
  slug: "place-value",
  title: "Place value",
  subject: "Maths",
  summary: "What each digit in a number is worth.",
  sheets: [
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
  ],
};
