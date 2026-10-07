import type { WorksheetSet } from "@/lib/worksheets";

/** Time: the sheets are in teaching order, easiest first. Add new ones where they belong in that order. */
export const time: WorksheetSet = {
  slug: "time",
  title: "Time",
  subject: "Maths",
  summary: "Reading a clock and knowing how long things take.",
  sheets: [
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
  ],
};
