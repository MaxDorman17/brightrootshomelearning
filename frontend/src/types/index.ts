export interface Lesson {
  id: number;
  title: string;
  subject: string;
  description: string | null;
  lesson_url: string | null;
  created_by: number;
  created_at: string;
}

export interface PlannerEntry {
  id: number;
  lesson_id: number;
  assigned_to: number | null;
  scheduled_date: string;
  is_complete: boolean;
  completed_at: string | null;
  completed_work_url: string | null;
  completed_note: string | null;
  is_extra: boolean;
  lesson: Lesson;
}

export interface OakQuizResult {
  url: string;
  starter_score: number | null;
  starter_total: number | null;
  exit_score: number | null;
  exit_total: number | null;
}

export interface WeekQuizDay {
  date: string;
  day_name: string;
  is_today: boolean;
  entries: WeekQuizEntry[];
  total: number;
  completed: number;
  starter_score: number | null;
  starter_total: number | null;
  exit_score: number | null;
  exit_total: number | null;
  total_score: number | null;
  total_possible: number;
}

export interface WeekQuizEntry {
  entry_id: number;
  child_id: number;
  lesson_title: string;
  subject: string;
  scheduled_date: string;
  is_complete: boolean;
  has_share_url: boolean;
  starter_score: number | null;
  starter_total: number | null;
  exit_score: number | null;
  exit_total: number | null;
}

export interface WeekQuizScores {
  days: WeekQuizDay[];
  grand_total: number;
  grand_completed: number;
  grand_starter_score: number;
  grand_starter_total: number;
  grand_exit_score: number;
  grand_exit_total: number;
  grand_total_score: number;
  grand_total_possible: number;
}

export interface Unit {
  id: number;
  subject: string;
  title: string;
  unit_url: string | null;
  notes: string | null;
  updated_at: string;
}

export interface WorkFeedback {
  id: number;
  entry_id: number;
  message: string;
  emoji: string | null;
  read_at: string | null;
  created_at: string;
}

export interface DayOff {
  id: number;
  date: string;
  reason: string | null;
  created_at: string;
}

export interface ReadingWorksheet {
  id: number;
  book_id: number;
  title: string;
  url: string;
  created_at: string;
}

export interface ReadingLogBook {
  id: number;
  title: string;
  author: string | null;
  pages: number | null;
  status: "wishlist" | "reading" | "completed";
  start_date: string | null;
  finish_date: string | null;
  rating: number | null;
  notes: string | null;
  added_by: number;
  child_id: number | null;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: "parent" | "child";
  parent_id: number | null;
  created_at: string;
}

export interface Child {
  id: number;
  username: string;
  email: string;
  role: "child";
  created_at: string;
}

export interface JournalEntry {
  id: number;
  entry_date: string;
  content: string;
  created_by: number;
  created_at: string;
  updated_at: string | null;
}

export interface WeeklyGoal {
  id: number;
  week_start: string;
  title: string;
  is_complete: boolean;
  completed_at: string | null;
  assigned_to: number | null;
  created_by: number;
  created_at: string;
}
