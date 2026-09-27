export const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Subjects offered as tick boxes during onboarding. Parents can add their own too.
export const SUBJECT_OPTIONS = [
  "Maths",
  "English",
  "Science",
  "History",
  "Geography",
  "Computing",
  "Art & Design",
  "Design and Technology",
  "Music",
  "PE",
  "Languages",
  "RSHE (PSHE)",
  "Cooking",
  "Life Skills",
];

export const DEFAULT_SELECTED_SUBJECTS = ["Maths", "English", "Science"];

// Taught every day when chosen.
const DAILY_SUBJECTS = ["Maths", "English"];

// Roughly how many non-daily lessons to fit into each day.
const OTHER_SLOTS_PER_DAY = 3;

/**
 * Build a starting Monday–Friday timetable from the chosen subjects.
 * Maths and English go on every day; every other subject is spread across
 * the week (up to three times each), always onto the least busy day.
 */
export function buildTimetable(subjects: string[]): Record<string, string[]> {
  const week: Record<string, string[]> = {};
  WEEK_DAYS.forEach((day) => {
    week[day] = DAILY_SUBJECTS.filter((subject) => subjects.includes(subject));
  });

  const others = subjects.filter((subject) => !DAILY_SUBJECTS.includes(subject));
  if (others.length === 0) return week;

  const timesEach = Math.max(1, Math.min(3, Math.floor((WEEK_DAYS.length * OTHER_SLOTS_PER_DAY) / others.length)));
  let startDay = 0;

  others.forEach((subject) => {
    for (let n = 0; n < timesEach; n++) {
      let bestDay: string | null = null;
      for (let i = 0; i < WEEK_DAYS.length; i++) {
        const day = WEEK_DAYS[(startDay + i) % WEEK_DAYS.length];
        if (week[day].includes(subject)) continue;
        if (bestDay === null || week[day].length < week[bestDay].length) bestDay = day;
      }
      if (bestDay === null) break;
      week[bestDay].push(subject);
    }
    startDay = (startDay + 1) % WEEK_DAYS.length;
  });

  return week;
}

/** Unique subjects in a timetable, in the order they first appear across the week. */
export function subjectsInTimetable(timetable: Record<string, string[]>): string[] {
  const seen: string[] = [];
  WEEK_DAYS.forEach((day) => {
    (timetable[day] || []).forEach((subject) => {
      if (!seen.includes(subject)) seen.push(subject);
    });
  });
  return seen;
}
