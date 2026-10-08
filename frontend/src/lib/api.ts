import axios from "axios";
import type { AvatarChoice } from "@/lib/avatar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined") {
      if (err.config?.skipAuthRedirect) {
        // Quiet session checks (e.g. on public pages) handle a signed-out visitor themselves.
      } else if (err.response?.status === 401 && !err.config?.url?.includes("/auth/login")) {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        window.location.href = "/login";
      } else if (err.response?.status === 402) {
        const allowedExpiredPaths = [
          "/membership-required",
          "/billing",
          "/account",
        ];
        const onAllowedExpiredPath = allowedExpiredPaths.some(
          (path) =>
            window.location.pathname === path ||
            window.location.pathname.startsWith(path + "/")
        );

        if (!onAllowedExpiredPath) {
          window.location.href = "/membership-required";
        }
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerParent = (email: string, username: string, password: string, newsletter = false) =>
  api.post("/api/auth/register", { email, username, password, newsletter });

export const login = (username: string, password: string) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  return api.post("/api/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
export const logout = () => api.post("/api/auth/logout");
export const getMe = () => api.get("/api/auth/me");
// Like getMe, but a signed-out visitor stays on the page instead of being sent to /login.
export const checkSession = () => api.get("/api/auth/me", { skipAuthRedirect: true } as any);
export type TestResultBody = {
  child_id: number;
  subject: string;
  title: string;
  taken_on: string;
  score: number;
  total: number;
  notes: string | null;
};
// Parents pass child_id; children get their own results.
export const getResultsOverview = (child_id?: number) =>
  api.get("/api/test-results/overview", { params: child_id != null ? { child_id } : {} });
export const addTestResult = (body: TestResultBody) => api.post("/api/test-results/", body);
export const updateTestResult = (id: number, body: TestResultBody) => api.put(`/api/test-results/${id}`, body);
export const deleteTestResult = (id: number) => api.delete(`/api/test-results/${id}`);
export const getCouncilReport = (child_id: number, start_date: string, end_date: string) =>
  api.get("/api/council-report/", { params: { child_id, start_date, end_date } });
export const saveEheApproach = (approach: string) => api.put("/api/council-report/approach", { approach });
export type RewardRuleBody = { kind: string; threshold_pct?: number | null; stars: number; is_active: boolean };
export type RewardItemBody = { title: string; emoji?: string | null; cost: number; is_active: boolean };
export const getRewardsSetup = () => api.get("/api/rewards/setup");
export const addRewardRule = (body: RewardRuleBody) => api.post("/api/rewards/rules", body);
export const updateRewardRule = (id: number, body: RewardRuleBody) => api.put(`/api/rewards/rules/${id}`, body);
export const deleteRewardRule = (id: number) => api.delete(`/api/rewards/rules/${id}`);
export const addRewardItem = (body: RewardItemBody) => api.post("/api/rewards/items", body);
export const updateRewardItem = (id: number, body: RewardItemBody) => api.put(`/api/rewards/items/${id}`, body);
export const deleteRewardItem = (id: number) => api.delete(`/api/rewards/items/${id}`);
export const awardStars = (child_id: number, stars: number, reason: string) =>
  api.post("/api/rewards/award", { child_id, stars, reason });
export const approveRewardClaim = (id: number) => api.post(`/api/rewards/claims/${id}/approve`);
export const declineRewardClaim = (id: number) => api.post(`/api/rewards/claims/${id}/decline`);
export const markRewardGiven = (id: number) => api.post(`/api/rewards/claims/${id}/given`);
export const getMyStars = () => api.get("/api/rewards/me");
export const getStarJars = () => api.get("/api/rewards/jars");
export const requestReward = (reward_id: number, quantity = 1) => api.post("/api/rewards/claims", { reward_id, quantity });
export const cancelRewardRequest = (id: number) => api.delete(`/api/rewards/claims/${id}`);
export type ChallengeBody = {
  title: string;
  kind: string;
  target: number;
  threshold_pct: number | null;
  mode: "each" | "team";
  start_date: string;
  end_date: string;
  bonus_stars: number;
};
export const getFamilyOverview = () => api.get("/api/family/overview");
export const addChallenge = (body: ChallengeBody) => api.post("/api/family/challenges", body);
export const removeChallenge = (id: number) => api.delete(`/api/family/challenges/${id}`);
export const tickChallenge = (id: number, child_id: number) => api.post(`/api/family/challenges/${id}/tick`, { child_id });
export const untickChallenge = (id: number, child_id: number) =>
  api.delete(`/api/family/challenges/${id}/tick`, { params: { child_id } });
export const saveStudySession = (body: {
  planned_minutes: number;
  minutes: number;
  completed: boolean;
  subject: string | null;
  label: string | null;
  entry_id: number | null;
}) => api.post("/api/study/sessions", body);
export const getStudySummary = (child_id?: number) =>
  api.get("/api/study/summary", { params: child_id != null ? { child_id } : {} });
export const getDisplayPrefs = (child_id?: number) =>
  api.get<{ text_size: "normal" | "large" | "larger"; easy_font: boolean }>("/api/profile/display", { params: child_id != null ? { child_id } : {} });
export const saveDisplayPrefs = (body: { text_size: string; easy_font: boolean }, child_id?: number) =>
  api.put("/api/profile/display", body, { params: child_id != null ? { child_id } : {} });
export const saveAvatar = (avatar: { emoji: string; bg: string; frame: string }, child_id?: number) =>
  api.put("/api/profile/avatar", avatar, { params: child_id != null ? { child_id } : {} });
export const saveChildColours = (theme: string | null, subject_colors: Record<string, string>, child_id?: number) =>
  api.put("/api/profile/colours", { theme, subject_colors }, { params: child_id != null ? { child_id } : {} });
export const uploadChildPhoto = (child_id: number, file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/api/profile/photo", form, { params: { child_id } });
};
export const deleteChildPhoto = (child_id: number) => api.delete("/api/profile/photo", { params: { child_id } });
export const getChildPhoto = (child_id: number) => api.get(`/api/profile/photo/${child_id}`, { responseType: "blob" });
export const getResources = () => api.get("/api/resources/");
export const addResourceLink = (body: { folder: string; title: string; url: string; note?: string; visible_to_children: boolean }) =>
  api.post("/api/resources/links", body);
export const uploadResourceFile = (folder: string, file: File, title: string, note: string, visible: boolean) => {
  const form = new FormData();
  form.append("folder", folder);
  form.append("title", title);
  form.append("note", note);
  form.append("visible_to_children", visible ? "true" : "false");
  form.append("file", file);
  return api.post("/api/resources/files", form);
};
export const updateResource = (id: number, body: { folder: string; title: string; note?: string | null; visible_to_children: boolean }) =>
  api.put(`/api/resources/${id}`, body);
export const deleteResource = (id: number) => api.delete(`/api/resources/${id}`);
export const downloadResource = (id: number) => api.get(`/api/resources/${id}/file`, { responseType: "blob" });
export const addResourceFolder = (name: string) => api.post("/api/resources/folders", { name });
export const renameResourceFolder = (old_name: string, new_name: string) => api.put("/api/resources/folders", { old_name, new_name });
export const deleteResourceFolder = (name: string) => api.delete(`/api/resources/folders/${encodeURIComponent(name)}`);
export const getMoments = () => api.get("/api/moments/");
export type MomentFields = { note: string; moment_date: string; subject: string; child_ids: number[]; trip_place?: string };
export const addMoment = (fields: MomentFields, files: File[]) => {
  const form = new FormData();
  form.append("note", fields.note);
  if (fields.trip_place) form.append("trip_place", fields.trip_place);
  form.append("moment_date", fields.moment_date);
  form.append("subject", fields.subject);
  form.append("child_ids", fields.child_ids.join(","));
  files.forEach((f) => form.append("files", f));
  return api.post("/api/moments/", form);
};
export const updateMoment = (id: number, body: MomentFields) =>
  api.put(`/api/moments/${id}`, body);
export const deleteMoment = (id: number) => api.delete(`/api/moments/${id}`);
export const addMomentPhotos = (id: number, files: File[]) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return api.post(`/api/moments/${id}/photos`, form);
};
export const deleteMomentPhoto = (id: number, photoId: number) => api.delete(`/api/moments/${id}/photos/${photoId}`);
export const reactToMoment = (id: number, emoji: string) => api.post(`/api/moments/${id}/react`, { emoji });
export const commentOnMoment = (id: number, text: string) => api.post(`/api/moments/${id}/comments`, { text });
export const deleteMomentComment = (commentId: number) => api.delete(`/api/moments/comments/${commentId}`);
export const getMomentPhoto = (photoId: number) => api.get(`/api/moments/photos/${photoId}`, { responseType: "blob" });
export type ReminderBody = {
  kind: "spellings" | "extra_work" | "custom";
  text?: string | null;
  child_id: number | null;
  time: string;
  days: string[];
  email_child: boolean;
  is_active: boolean;
};
export const getReminders = () => api.get("/api/reminders/");
export const addReminder = (body: ReminderBody) => api.post("/api/reminders/", body);
export const updateReminder = (id: number, body: ReminderBody) => api.put(`/api/reminders/${id}`, body);
export const deleteReminder = (id: number) => api.delete(`/api/reminders/${id}`);
export const setSummaryEmail = (time: string | null) => api.put("/api/reminders/summary", { time });
export const getMyReminders = () => api.get("/api/reminders/today");
export const markReminderDone = (id: number) => api.post(`/api/reminders/${id}/done`);
// Public newsletter calls: a signed-out visitor must stay on the page, not be sent to /login.
export const subscribeNewsletter = (email: string) => api.post("/api/newsletter/subscribe", { email }, { skipAuthRedirect: true } as any);
export const confirmNewsletter = (token: string) => api.post("/api/newsletter/confirm", { token }, { skipAuthRedirect: true } as any);
export const unsubscribeNewsletter = (token: string) => api.post("/api/newsletter/unsubscribe", { token }, { skipAuthRedirect: true } as any);
export const getMyNewsletter = () => api.get("/api/newsletter/me");
export const setMyNewsletter = (subscribed: boolean) => api.put("/api/newsletter/me", { subscribed });
export const removeNewsletterSubscriber = (id: number) => api.delete(`/api/newsletter/admin/subscribers/${id}`);
export const getNewsletterAdmin = () => api.get("/api/newsletter/admin");
export const previewNewsletter = (subject: string, body: string) => api.post("/api/newsletter/admin/preview", { subject, body });
export const testNewsletter = (subject: string, body: string) => api.post("/api/newsletter/admin/test", { subject, body });
export const sendNewsletter = (subject: string, body: string) => api.post("/api/newsletter/admin/send", { subject, body });
export const saveGameScore = (game: string, score: number, detail?: string) =>
  api.post("/api/games/scores", { game, score, detail });
export const getGamesSummary = (child_id?: number) =>
  api.get("/api/games/summary", { params: child_id != null ? { child_id } : {} });
// Bright Roots worksheets and comic quizzes. Only children save answers and scores.
export type SheetRef = { kind: "worksheet" | "comic"; slug: string; title: string; subject: string };
export type SheetProgress = SheetRef & {
  score: number | null;
  total: number | null;
  tries: number;
  in_progress: boolean;
  finished_at: string | null;
  answers?: Record<string, unknown> | null;
};
export const getMySheets = () => api.get<SheetProgress[]>("/api/worksheets/mine");
export const getMySheet = (kind: SheetRef["kind"], slug: string) => api.get<SheetProgress | null>(`/api/worksheets/mine/${kind}/${slug}`);
export const saveSheetProgress = (sheet: SheetRef, answers: Record<string, unknown>) =>
  api.put<SheetProgress>("/api/worksheets/progress", { ...sheet, answers });
export const finishSheet = (sheet: SheetRef, score: number, total: number) =>
  api.post<SheetProgress & { first_time: boolean; new_best: boolean; ticked_off: boolean }>("/api/worksheets/finish", { ...sheet, score, total });
// A grown-up puts one sheet, or a topic set in order, into the planner. A set goes one sheet a day, skipping weekends.
export const planSheets = (sheets: (SheetRef & { intro: string })[], scheduled_date: string, child_ids: number[]) =>
  api.post<{ planned: number; first_day: string; last_day: string }>("/api/worksheets/plan", { sheets, scheduled_date, child_ids });
// Oak lessons done inside Bright Roots. Quizzes are marked on the server; only a child's quiz is saved.
export type OakQuizScores = { starter_score: number | null; starter_total: number | null; exit_score: number | null; exit_total: number | null };
export type OakLessonPage =
  | { available: false }
  | {
      available: true;
      title: string;
      subject: string | null;
      outcome: string | null;
      keywords: { word: string; meaning: string }[];
      guidance: unknown;
      starter: import("@/lib/worksheets").Question[];
      exit: import("@/lib/worksheets").Question[];
      video_url: string | null;
      has_captions: boolean;
      has_worksheet: boolean;
      oak_url: string;
      licence_url: string;
      attempt: OakQuizScores;
    };
export const getOakLesson = (entryId: number) => api.get<OakLessonPage>(`/api/oak-lessons/entry/${entryId}`);
export const getOakCaptions = (entryId: number) => api.get<string>(`/api/oak-lessons/entry/${entryId}/captions`, { responseType: "text" });
export const oakWorksheetUrl = (entryId: number) => `${API_URL}/api/oak-lessons/entry/${entryId}/worksheet`;
export type DayWorksheet = { entry_id: number; subject: string; title: string; child: string | null };
export const getDayWorksheets = (day: string, childId?: number) =>
  api.get<DayWorksheet[]>("/api/oak-lessons/day-worksheets", { params: { day, child_id: childId } });
export const dayWorksheetsPdfUrl = (day: string, childId?: number) =>
  `${API_URL}/api/oak-lessons/day-worksheets.pdf?day=${day}${childId ? `&child_id=${childId}` : ""}`;
export const submitOakQuiz = (entryId: number, which: "starter" | "exit", answers: Record<string, unknown>) =>
  api.post<{ score: number; total: number; right: boolean[]; first_time: boolean; new_best: boolean; lesson_complete: boolean; attempt: OakQuizScores }>(
    `/api/oak-lessons/entry/${entryId}/quiz/${which}`,
    { answers }
  );
// The Oak lesson finder, for grown-ups: Oak's subjects, units and lessons, and adding them to the planner.
export type OakSubject = { slug: string; title: string; years: number[]; courses: { slug: string; years: number[]; label: string }[] };
export type OakUnitGroup = { label: string; units: { slug: string; title: string }[] };
export type OakUnit = { slug: string; title: string; description: string; year: number | null; lessons: { slug: string; title: string }[] };
export const getOakSubjects = () => api.get<OakSubject[]>("/api/oak-finder/subjects");
export const getOakUnits = (course: string, year: number) => api.get<{ groups: OakUnitGroup[] }>("/api/oak-finder/units", { params: { course, year } });
export const getOakUnit = (slug: string) => api.get<OakUnit>(`/api/oak-finder/unit/${slug}`);
export const planOakLessons = (body: { lessons: { slug: string; title: string }[]; subject: string; unit_title: string; scheduled_date: string; child_ids: number[] }) =>
  api.post<{ planned: number; first_day: string; last_day: string }>("/api/oak-finder/plan", body);
// Lessons still to do that are sitting on a day off, and moving them (and what follows) to the next free days.
export const getLessonsOnDaysOff = () => api.get<{ count: number }>("/api/planner/on-days-off");
export const moveLessonsOffDaysOff = () => api.post<{ moved: number }>("/api/planner/move-off-days-off");
export const getPendingRewardCount = () => api.get("/api/rewards/pending-count");
export const saveFamilyTheme = (theme: string) => api.put("/api/auth/theme", { theme });
export const saveFamilySchemes = (schemes: string[]) => api.put<{ schemes: string[] }>("/api/auth/schemes", { schemes });
export const changePassword = (current_password: string, new_password: string) =>
  api.post("/api/auth/change-password", { current_password, new_password });
export const forgotPassword = (email: string) =>
  api.post("/api/auth/forgot-password", { email });
export const resetPassword = (token: string, new_password: string) =>
  api.post("/api/auth/reset-password", { token, new_password });
export const requestEmailVerification = () =>
  api.post("/api/auth/request-email-verification");
export const verifyEmail = (token: string) =>
  api.post("/api/auth/verify-email", { token });
export const completeOnboarding = () =>
  api.post("/api/auth/complete-onboarding");
export const createBillingCheckout = (plan: "monthly" | "yearly") =>
  api.post("/api/billing/checkout", { plan });
export const createBillingPortal = () =>
  api.post("/api/billing/portal");
export const syncBillingSubscription = () =>
  api.post("/api/billing/sync");
// Public self-registration is disabled server-side (see backend/routers/auth.py) —
// no register() helper here since nothing should call it.

// Lessons
export const getLessons = () => api.get("/api/lessons/");
export type LessonFields = {
  title?: string;
  subject?: string;
  description?: string | null;
  lesson_url?: string | null;
  scheme?: string | null;
  objectives?: string;
  steps?: string[];
  duration_minutes?: number | null;
  resource_ids?: number[];
};
export const createLesson = (data: LessonFields & { title: string; subject: string }) => api.post("/api/lessons/", data);
export const updateLesson = (id: number, data: LessonFields) => api.put(`/api/lessons/${id}`, data);
export const getLessonLibrary = () => api.get("/api/lesson-plans/library");
export const getLessonPlans = () => api.get("/api/lesson-plans/");
export const createLessonPlan = (body: { title: string; subject?: string; description?: string; lesson_ids: number[] }) =>
  api.post("/api/lesson-plans/", body);
export const updateLessonPlan = (id: number, body: { title: string; subject?: string; description?: string; lesson_ids: number[] }) =>
  api.put(`/api/lesson-plans/${id}`, body);
export const deleteLessonPlan = (id: number) => api.delete(`/api/lesson-plans/${id}`);
export const scheduleLessonPlan = (
  id: number,
  body: { start_date: string; assigned_to: number | null; mode: "timetable" | "days"; days: string[] }
) => api.post(`/api/lesson-plans/${id}/schedule`, body);
export const deleteLesson = (id: number) => api.delete(`/api/lessons/${id}`);

// Planner
export const getWeekEntries = (startDate?: string, childId?: number) =>
  api.get("/api/planner/week", {
    params: { ...(startDate ? { start_date: startDate } : {}), ...(childId ? { child_id: childId } : {}) },
  });
export const getTodayEntries = () => api.get("/api/planner/today");
// Every planned lesson, newest first. Pages that don't need the whole history can ask for less:
// only lessons since a day ("yyyy-MM-dd"), or only the newest few.
export const getAllEntries = (only?: { since?: string; limit?: number }) => api.get("/api/planner/all", { params: only ?? {} });
export const getSubmissionCount = () => api.get("/api/planner/submission-count");
export const getPendingFeedback = () => api.get("/api/planner/pending-feedback");
export const getTodayNotifications = () => api.get("/api/notifications/today");
export const getAllMyEntries = () => api.get("/api/planner/mine");
export const createPlannerEntry = (data: { lesson_id: number; scheduled_date: string; assigned_to?: number; is_extra?: boolean }) =>
  api.post("/api/planner/", data);
// Put a lesson on the same weekday for the next few weeks, or copy one whole week onto another
export const repeatPlannerEntry = (id: number, weeks: number) =>
  api.post<{ added: number; skipped: number; last: string | null }>(`/api/planner/${id}/repeat`, { weeks });
export const copyPlannerWeek = (from_start: string, to_start: string, child_id?: number) =>
  api.post<{ copied: number; skipped: number; start_date: string }>("/api/planner/copy-week", { from_start, to_start, child_id });
// A child tells their grown-up about something they did by themselves; it waits for the grown-up's OK
export const childDidIt = (body: { title: string; subject?: string; note?: string }) => api.post("/api/planner/i-did", body);
// Record something already done, with no planning first
export const logLearning = (body: { title: string; subject: string; child_ids: number[]; day?: string; note?: string }) =>
  api.post<{ logged: number; entry_ids: number[]; day: string }>("/api/planner/log", body);
export const updatePlannerEntry = (id: number, data: { scheduled_date?: string; assigned_to?: number | null }) =>
  api.put(`/api/planner/${id}`, data);
export const deletePlannerEntry = (id: number) => api.delete(`/api/planner/${id}`);
export const shiftDay = (from_date: string, to_date: string, direction: "forward" | "backward" = "forward") =>
  api.post("/api/planner/shift-day", { from_date, to_date, direction });
export const movePlannerEntry = (id: number, direction: "forward" | "backward") =>
  api.post(`/api/planner/${id}/move`, { direction });
export const toggleComplete = (id: number) => api.patch(`/api/planner/${id}/complete`);
export const submitWorkUrl = (id: number, completed_work_url: string) =>
  api.patch(`/api/planner/${id}/submit-work`, { completed_work_url });
export const submitNote = (id: number, completed_note: string) =>
  api.patch(`/api/planner/${id}/note`, { completed_note });

// Feedback
export const getFeedback = () => api.get("/api/feedback/");
export const getUnreadFeedbackCount = () => api.get("/api/feedback/unread-count");
export const createFeedback = (data: { entry_id: number; message: string; emoji?: string }) =>
  api.post("/api/feedback/", data);
export const markFeedbackRead = (id: number) => api.patch(`/api/feedback/${id}/read`);
export const deleteFeedback = (id: number) => api.delete(`/api/feedback/${id}`);
export const getReviewedEntryIds = () => api.get("/api/feedback/reviewed-entry-ids");
export const markEntryReviewed = (entryId: number) => api.post(`/api/feedback/review/${entryId}`);
export const markEntryUnreviewed = (entryId: number) => api.delete(`/api/feedback/review/${entryId}`);

// Coding Progress (DB-backed, per-user)
export const getCodingProgress = (childId?: number) =>
  api.get("/api/coding-progress/", { params: childId ? { child_id: childId } : {} });
export const markCodingComplete = (lessonId: string, childId?: number) =>
  api.post(`/api/coding-progress/${lessonId}`, undefined, { params: childId ? { child_id: childId } : {} });
export const markCodingIncomplete = (lessonId: string, childId?: number) =>
  api.delete(`/api/coding-progress/${lessonId}`, { params: childId ? { child_id: childId } : {} });

// Days Off
export const getDaysOff = () => api.get("/api/days-off/");
export const addDayOff = (data: { date: string; reason?: string }) => api.post("/api/days-off/", data);
export const removeDayOff = (id: number) => api.delete(`/api/days-off/${id}`);

// Reading Log
export const getBooks = (childId?: number) =>
  api.get("/api/reading/", { params: childId ? { child_id: childId } : {} });
export const addBook = (data: { title: string; author?: string; pages?: number; total_chapters?: number; status?: string; start_date?: string; finish_date?: string; notes?: string; child_id?: number | null }) =>
  api.post("/api/reading/", data);
export const updateBook = (id: number, data: { title?: string; author?: string; pages?: number; total_chapters?: number; completed_chapters?: number; reading_journal?: string; question_1_answer?: string; question_2_answer?: string; question_3_answer?: string; status?: string; start_date?: string; finish_date?: string; finish_date_clear?: boolean; rating?: number; notes?: string }) =>
  api.patch(`/api/reading/${id}`, data);
export const deleteBook = (id: number) => api.delete(`/api/reading/${id}`);
export const getReadingChapterSummary = (params?: { child_id?: number; start_date?: string; end_date?: string }) =>
  api.get("/api/reading/chapter-summary", { params: params ?? {} });

// Reading Worksheets
export const setWorksheetDone = (id: number, done: boolean) => api.put(`/api/reading/worksheets/${id}/done`, { done });
export const getWorksheets = () => api.get("/api/reading/worksheets");
export const addWorksheet = (bookId: number, data: { title: string; url: string }) =>
  api.post(`/api/reading/${bookId}/worksheets`, data);
export const uploadWorksheet = (bookId: number, title: string, file: File) => {
  const form = new FormData();
  form.append("title", title);
  form.append("file", file);
  return api.post(`/api/reading/${bookId}/worksheets/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
// GET /api/reading/files/{filename} now requires auth, so uploaded worksheets
// must be fetched through the authenticated client (as a blob) rather than
// linked to directly with a plain <a href> — a bare link can't carry the
// Bearer token.
export const downloadReadingFile = (url: string) => api.get(url, { responseType: "blob" });
export const deleteWorksheet = (worksheetId: number) =>
  api.delete(`/api/reading/worksheets/${worksheetId}`);

// Polish / Duolingo
export const getPolishSessions = () => api.get("/api/polish/");
export const logPolishSession = (data: { date: string; xp?: number; notes?: string }) =>
  api.post("/api/polish/", data);
export const deletePolishSession = (id: number) => api.delete(`/api/polish/${id}`);

// Children
export const getChildren = () => api.get("/api/children/");
export const addChild = (data: { username: string; login_name?: string; email?: string; password?: string; activity_level?: string }) =>
  api.post("/api/children/", data);
export const updateChild = (id: number, data: { username?: string; login_name?: string; activity_level?: string }) =>
  api.put(`/api/children/${id}`, data);
/** Is this login name free, and which ones could a child with this name use? */
export const checkChildLoginName = (name: string, login_name = "") =>
  api.get<{ login_name: string; available: boolean; suggestions: string[] }>("/api/children/login-name", { params: { name, login_name } });
export const removeChild = (id: number) => api.delete(`/api/children/${id}`);
export const resetChildPassword = (id: number, new_password: string) =>
  api.post(`/api/children/${id}/reset-password`, { new_password });

// Journal
export const getJournalEntries = () => api.get("/api/journal/");
export const getJournalEntry = (date: string) => api.get(`/api/journal/${date}`);
export const upsertJournalEntry = (date: string, content: string) =>
  api.put(`/api/journal/${date}`, { content });
export const deleteJournalEntry = (date: string) => api.delete(`/api/journal/${date}`);

// Weekly Goals
export const getGoals = (params?: { week_start?: string; assigned_to?: number }) =>
  api.get("/api/goals/", { params });
export const createGoal = (data: { week_start: string; title: string; assigned_to?: number }) =>
  api.post("/api/goals/", data);
export const toggleGoal = (id: number) => api.patch(`/api/goals/${id}/toggle`);
export const deleteGoal = (id: number) => api.delete(`/api/goals/${id}`);

// Units
export const getUnits = () => api.get("/api/units/");
export const upsertUnit = (data: { subject: string; title: string; unit_url?: string; scheme?: string; notes?: string }) =>
  api.post("/api/units/", data);
export const deleteUnit = (subject: string) => api.delete(`/api/units/${encodeURIComponent(subject)}`);
export const getUnitQueue = () => api.get("/api/units/queue");
export const addQueuedUnit = (data: { subject: string; title: string; unit_url?: string; scheme?: string; notes?: string }) =>
  api.post("/api/units/queue", data);
export const updateQueuedUnit = (id: number, data: { title?: string; unit_url?: string; scheme?: string; notes?: string }) =>
  api.put(`/api/units/queue/${id}`, data);
export const deleteQueuedUnit = (id: number) => api.delete(`/api/units/queue/${id}`);
export const promoteQueuedUnit = (id: number) => api.post(`/api/units/queue/${id}/promote`);

// Timetable
// The family timetable, or (with a child's id) the week that child follows: their own if they have one.
// A child who is logged in always gets their own week.
export const getTimetable = (childId?: number) => api.get("/api/timetable/", { params: childId != null ? { child_id: childId } : {} });
// Every subject the family teaches: on the family timetable or on any child's own.
export const getFamilySubjects = () => api.get<{ subjects: string[] }>("/api/timetable/subjects");
// The children who have a timetable of their own, by child id.
export const getChildTimetables = () => api.get<Record<string, Record<string, string[]>>>("/api/timetable/children");
export const resetChildTimetable = (childId: number) => api.delete("/api/timetable/", { params: { child_id: childId } });
export const saveTimetable = (config: Record<string, string[]>, childId?: number) =>
  api.put("/api/timetable/", { config }, { params: childId != null ? { child_id: childId } : {} });

// Oak National Academy
export const searchOakLessons = (q: string, subject: string, year: string) =>
  api.get("/api/oak/search", { params: { q, subject, year } });
export const importOakUnit = (unit_url: string) =>
  api.post("/api/oak/import-unit", { unit_url });
export const getOakQuizResults = () => api.get("/api/oak/quiz-results");
export const refreshOakQuizResults = () => api.post("/api/oak/quiz-results/refresh");
export const exportOakResults = (params?: { child_id?: number; start_date?: string; end_date?: string }) =>
  api.get("/api/oak/export", { params, responseType: "blob" });
export const getTodayOakQuizResults = (childId?: number) =>
  api.get("/api/oak/today-quiz-results", {
    params: childId ? { child_id: childId } : {},
  });
export const getWeekQuizScores = (startDate: string, endDate: string, childId?: number) =>
  api.get("/api/oak/week-scores", {
    params: { start_date: startDate, end_date: endDate, ...(childId ? { child_id: childId } : {}) },
  });
// Scores a parent gives a planned lesson, whichever scheme it comes from
export const getLessonScores = (params?: { start_date?: string; end_date?: string }) =>
  api.get("/api/test-results/lesson-scores", { params });
export const setLessonScore = (entryId: number, body: { child_id: number; score: number; total: number }) =>
  api.put(`/api/test-results/lesson/${entryId}`, body);
export const clearLessonScore = (entryId: number, childId: number) =>
  api.delete(`/api/test-results/lesson/${entryId}`, { params: { child_id: childId } });
export const checkOakWorksheet = (lesson_url: string) =>
  api.get("/api/oak/has-worksheet", { params: { lesson_url } });

// Spellings
export const getSpellingWords = (week_start: string) =>
  api.get("/api/spellings/words", { params: { week_start } });
export const addSpellingWord = (data: { week_start: string; word: string }) =>
  api.post("/api/spellings/words", data);
export const deleteSpellingWord = (id: number) =>
  api.delete(`/api/spellings/words/${id}`);
export const saveSpellingResult = (data: { week_start: string; score: number; total: number; wrong_words: string[]; child_id?: number; is_practice_round?: boolean }) =>
  api.post("/api/spellings/results", data);
export const getSpellingResults = (params?: { week_start?: string; child_id?: number }) =>
  api.get("/api/spellings/results", { params });
export const getWeakWords = (child_id: number, limit?: number) =>
  api.get("/api/spellings/weak-words", { params: { child_id, ...(limit ? { limit } : {}) } });

// Account data
export const exportAccount = () => api.get("/api/account/export", { responseType: "blob" });
export const deleteAccount = (password: string, confirm: string) =>
  api.post("/api/account/delete", { password, confirm });

// Phone notifications
export const getPushKey = () => api.get("/api/push/key");
export const getPushStatus = (endpoint: string) => api.post("/api/push/status", { endpoint });
export const pushSubscribe = (subscription: PushSubscriptionJSON) => api.post("/api/push/subscribe", subscription);
export const pushUnsubscribe = (endpoint: string) => api.post("/api/push/unsubscribe", { endpoint });
export const sendTestPush = () => api.post("/api/push/test");

// Cookbook and Craft Corner
export type MakeKind = "recipe" | "craft" | "pe" | "outdoor" | "life" | "little";
export type MakeMaterial = { name: string; qty: string };
export type MakeStep = { text: string; grown_up: boolean };
export type MakeItemBody = {
  kind: MakeKind;
  title: string;
  emoji?: string | null;
  summary?: string | null;
  category?: string | null;
  minutes?: number | null;
  difficulty?: string | null;
  age_from?: number | null;
  serves?: string | null;
  materials: MakeMaterial[];
  steps: MakeStep[];
  tips?: string | null;
  // Little Roots only
  talk?: string[];
  more?: string | null;
  easier?: string | null;
  story?: string[];
};
export const getMakeItems = (kind?: MakeKind) => api.get("/api/make/items", { params: kind ? { kind } : {} });
export const getMakeItem = (id: number) => api.get(`/api/make/items/${id}`);
export const addMakeItem = (body: MakeItemBody) => api.post("/api/make/items", body);
export const updateMakeItem = (id: number, body: MakeItemBody) => api.put(`/api/make/items/${id}`, body);
export const copyMakeItem = (id: number) => api.post(`/api/make/items/${id}/copy`);
export const deleteMakeItem = (id: number) => api.delete(`/api/make/items/${id}`);
export const uploadMakePhoto = (id: number, file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post(`/api/make/items/${id}/photo`, form);
};
export const deleteMakePhoto = (id: number) => api.delete(`/api/make/items/${id}/photo`);
export const getMakePhoto = (id: number) => api.get(`/api/make/items/${id}/photo`, { responseType: "blob" });
export const toggleMakeWish = (id: number) => api.post(`/api/make/items/${id}/wish`);
export const clearMakeWishes = (id: number) => api.delete(`/api/make/wishes/${id}`);
export const planMakeItem = (id: number, body: { scheduled_date: string; subject: string; child_ids: number[] }) =>
  api.post(`/api/make/items/${id}/plan`, body);
/** Little Roots "We did it!": stars for each child, the planner ticked off, and what they said in the journal. */
export const saveLittleDidIt = (id: number, body: { child_ids: number[]; stars: number; said?: string; day: string }) =>
  api.post(`/api/make/items/${id}/did-it`, body);
export const getLittleWeek = (offset = 0) => api.get("/api/make/little/week", { params: { offset } });
export const planLittleWeek = (monday: string, childIds: number[]) =>
  api.post("/api/make/little/week/plan", { monday, child_ids: childIds });
export const addItemToShopping = (id: number, names?: string[]) => api.post(`/api/make/items/${id}/shopping`, { names: names ?? null });
export const getShopping = () => api.get("/api/make/shopping");
export const getShoppingCount = () => api.get("/api/make/shopping/count");
export const addShopping = (name: string, qty = "") => api.post("/api/make/shopping", { name, qty });
export const updateShopping = (id: number, body: { done?: boolean; name?: string; qty?: string }) =>
  api.patch(`/api/make/shopping/${id}`, body);
export const deleteShopping = (id: number) => api.delete(`/api/make/shopping/${id}`);
export const clearShopping = (doneOnly = true) => api.post("/api/make/shopping/clear", null, { params: { done_only: doneOnly } });

// Clubs and the activity diary (P.E., Outdoors and clubs)
export type ActivityKind = "club" | "pe" | "outdoor";
export type Club = {
  id: number;
  name: string;
  activity: string;
  emoji: string | null;
  schedule: string | null;
  place: string | null;
  minutes: number | null;
  child_ids: number[];
  children: string[];
  notes: string | null;
  is_active: boolean;
  sessions: number;
  session_minutes: number;
  last_session: string | null;
};
export type ClubIn = Omit<Club, "id" | "children" | "sessions" | "session_minutes" | "last_session">;
export type ActivityLogEntry = {
  id: number;
  kind: ActivityKind;
  title: string;
  club_id: number | null;
  make_item_id: number | null;
  done_on: string;
  minutes: number | null;
  note: string | null;
  child_id: number;
  child: string;
  can_remove: boolean;
};
export type ActiveSummary = {
  totals: { sessions: number; days: number; minutes: number; pe: number; outdoor: number; club: number };
  clubs: { name: string; activity: string; emoji: string | null; schedule: string | null; place: string | null; is_active: boolean; children: string[]; sessions: number; minutes: number; notes: string | null }[];
  pe: { title: string; times: number; minutes: number; last: string }[];
  outdoor: { title: string; times: number; minutes: number; last: string }[];
  log: { date: string; kind: ActivityKind; kind_label: string; title: string; child: string; minutes: number | null; note: string | null }[];
};
export const getClubs = () => api.get<Club[]>("/api/activities/clubs");
export const addClub = (body: ClubIn) => api.post<Club>("/api/activities/clubs", body);
export const updateClub = (id: number, body: ClubIn) => api.put<Club>(`/api/activities/clubs/${id}`, body);
export const deleteClub = (id: number) => api.delete(`/api/activities/clubs/${id}`);
export const getActivityLog = (params: { child_id?: number; kind?: ActivityKind; start_date?: string; end_date?: string } = {}) =>
  api.get<ActivityLogEntry[]>("/api/activities/", { params });
export const logActivity = (body: {
  kind: ActivityKind;
  title?: string;
  club_id?: number;
  make_item_id?: number;
  done_on: string;
  minutes?: number | null;
  note?: string;
  child_ids: number[];
}) => api.post<ActivityLogEntry[]>("/api/activities/", body);
export const deleteActivity = (id: number) => api.delete(`/api/activities/${id}`);
export const getActiveSummary = (params: { child_id?: number; start_date?: string; end_date?: string }) =>
  api.get<ActiveSummary>("/api/activities/summary", { params });

// Languages: a practice diary for any language
export type LanguageLogEntry = {
  id: number;
  language: string;
  done_on: string;
  minutes: number | null;
  xp: number | null;
  how: string | null;
  note: string | null;
  child_id: number;
  child: string;
  can_remove: boolean;
};
export type LanguageSummary = {
  totals: { sessions: number; days: number; minutes: number; xp: number; languages: number; current_streak: number; best_streak: number };
  languages: {
    language: string;
    sessions: number;
    days: number;
    minutes: number;
    xp: number;
    current_streak: number;
    best_streak: number;
    last: string;
    children: string[];
    ways: string[];
  }[];
  log: { date: string; language: string; child: string; minutes: number | null; xp: number | null; how: string | null; note: string | null }[];
};
export const getLanguageLog = (params: { child_id?: number; language?: string; start_date?: string; end_date?: string } = {}) =>
  api.get<LanguageLogEntry[]>("/api/languages/", { params });
export const logLanguage = (body: {
  language: string;
  done_on: string;
  minutes?: number | null;
  xp?: number | null;
  how?: string;
  note?: string;
  child_ids: number[];
}) => api.post<LanguageLogEntry[]>("/api/languages/", body);
export const deleteLanguageLog = (id: number) => api.delete(`/api/languages/${id}`);
export const getLanguageSummary = (params: { child_id?: number; start_date?: string; end_date?: string } = {}) =>
  api.get<LanguageSummary>("/api/languages/summary", { params });

// Notes from home: messages from a grown-up shown on the child's Today page
export type FamilyNote = {
  id: number;
  body: string;
  created_at: string | null;
  read_at: string | null;
  reaction: string | null;
  author: { id: number; username: string; relationship: string | null; avatar: AvatarChoice | null };
  child_id: number;
  child: string;
};
export const getNotes = () => api.get<FamilyNote[]>("/api/notes/");
export const sendNote = (body: string, child_ids: number[]) => api.post<FamilyNote[]>("/api/notes/", { body, child_ids });
export const readNote = (id: number, reaction?: string) => api.post<FamilyNote>(`/api/notes/${id}/read`, { reaction: reaction ?? null });
export const deleteNote = (id: number) => api.delete(`/api/notes/${id}`);

// The grown-ups on a family account (the main parent plus any others they add)
export type FamilyAdult = {
  id: number;
  username: string;
  login_name: string | null;
  relationship: string | null;
  avatar: AvatarChoice | null;
  is_owner: boolean;
  is_you: boolean;
};
export const getAdults = () => api.get<{ adults: FamilyAdult[]; can_manage: boolean; max_extra: number }>("/api/family/adults");
export const addAdult = (body: { name: string; email: string; password: string; relationship?: string; newsletter?: boolean }) =>
  api.post<FamilyAdult>("/api/family/adults", body);
export const setAdultRelationship = (id: number, relationship: string) =>
  api.put<FamilyAdult>(`/api/family/adults/${id}`, { relationship });
export const resetAdultPassword = (id: number, new_password: string) =>
  api.post(`/api/family/adults/${id}/reset-password`, { new_password });
export const removeAdult = (id: number) => api.delete(`/api/family/adults/${id}`);

// A family's own badges, made by the grown-ups with their own pictures
export type FamilyBadge = {
  id: number;
  title: string;
  description: string | null;
  emoji: string | null;
  has_image: boolean;
  image_version: string | null;
  awarded_to: number[];
  earned: boolean | null; // for a child: whether they have it
};
const badgeForm = (body: { title: string; description?: string; emoji?: string; file?: File | null; remove_image?: boolean }) => {
  const form = new FormData();
  form.append("title", body.title);
  if (body.description) form.append("description", body.description);
  if (body.emoji) form.append("emoji", body.emoji);
  if (body.remove_image) form.append("remove_image", "true");
  if (body.file) form.append("file", body.file);
  return form;
};
export const getFamilyBadges = () => api.get<FamilyBadge[]>("/api/badges/");
export const addFamilyBadge = (body: Parameters<typeof badgeForm>[0]) =>
  api.post<FamilyBadge>("/api/badges/", badgeForm(body), { headers: { "Content-Type": "multipart/form-data" } });
export const updateFamilyBadge = (id: number, body: Parameters<typeof badgeForm>[0]) =>
  api.put<FamilyBadge>(`/api/badges/${id}`, badgeForm(body), { headers: { "Content-Type": "multipart/form-data" } });
export const deleteFamilyBadge = (id: number) => api.delete(`/api/badges/${id}`);
export const setFamilyBadgeAwards = (id: number, child_ids: number[]) =>
  api.put<FamilyBadge>(`/api/badges/${id}/awards`, { child_ids });
export const getFamilyBadgeImage = (id: number) => api.get(`/api/badges/${id}/image`, { responseType: "blob" });

// Exams for teens sitting GCSEs and similar as private candidates
export type Exam = {
  id: number;
  child_id: number;
  child: string;
  subject: string;
  qualification: string;
  board: string | null;
  paper: string | null;
  exam_date: string | null;
  exam_time: string | null;
  centre: string | null;
  entry_deadline: string | null;
  fee: string | null;
  status: "planning" | "entered" | "sat" | "result";
  result: string | null;
  notes: string | null;
  days_to_go: number | null;
};
export type ExamBody = Omit<Exam, "id" | "child" | "days_to_go">;
export const getExams = () => api.get<Exam[]>("/api/exams/");
export const addExam = (body: ExamBody) => api.post<Exam>("/api/exams/", body);
export const updateExam = (id: number, body: ExamBody) => api.put<Exam>(`/api/exams/${id}`, body);
export const deleteExam = (id: number) => api.delete(`/api/exams/${id}`);
export const planRevision = (id: number, body: { weekdays: number[]; minutes: number; start_date?: string }) =>
  api.post<{ sessions: number; first: string | null; last: string | null }>(`/api/exams/${id}/revision`, body);

// A ready-made sample week for families just starting out
// `years` is the school year (1 to 11) each child is working at; those children get Oak National Academy lessons.
export const addStarterWeek = (child_ids: number[], start_date?: string, years: Record<number, number> = {}) =>
  api.post<{ lessons: number; from_oak: number; level: string; start_date: string }>("/api/planner/starter-week", { child_ids, start_date, years });

// Calendar sync: a private feed address for Google, Apple or Outlook calendars
export const getCalendarLink = () => api.get<{ token: string | null }>("/api/calendar/link");
export const makeCalendarLink = () => api.post<{ token: string }>("/api/calendar/link");
export const removeCalendarLink = () => api.delete("/api/calendar/link");
export const calendarFeedUrl = (token: string) => `${API_URL.replace(/\/$/, "")}/api/calendar/${token}.ics`;

// Help and feedback: a parent's problem, question, suggestion or review, sent to the site owner
export type SupportMessage = {
  id: number;
  kind: string;
  message: string;
  rating: number | null;
  can_publish: boolean;
  display_name: string | null;
  page: string | null;
  from_name: string | null;
  from_email: string | null;
  emailed: boolean;
  created_at: string | null;
};
export const sendSupportMessage = (body: { kind: string; message: string; rating?: number | null; can_publish?: boolean; display_name?: string | null; page?: string | null }) =>
  api.post<{ id: number; emailed: boolean }>("/api/support/messages", body);
// Whether to ask this family how it is going (a couple of weeks in, until they have answered)
export const getReviewPrompt = () => api.get<{ show: boolean }>("/api/support/review-prompt");
// Owner only
export const getSupportMessages = () => api.get<SupportMessage[]>("/api/support/messages", { skipAuthRedirect: true } as any);
export const deleteSupportMessage = (id: number) => api.delete(`/api/support/messages/${id}`);

// Owner only: off-site backups
export type BackupRun = { id: number; kind: string; status: "running" | "ok" | "failed"; detail: string | null; started_at: string | null; finished_at: string | null };
export type BackupStatus = { configured: boolean; bucket: string | null; endpoint: string | null; keep_days: number; hour: number; last_ok: BackupRun | null; runs: BackupRun[] };
export const getBackupStatus = () => api.get<BackupStatus>("/api/backup/status", { skipAuthRedirect: true } as any);
export const runBackupNow = () => api.post("/api/backup/run");
// Owner only: data left behind by children removed before removing tidied up after itself.
export type Leftovers = { total: number; tables: Record<string, number>; files: number };
export const getLeftovers = () => api.get<Leftovers>("/api/backup/leftovers", { skipAuthRedirect: true } as any);
export const removeLeftovers = () => api.post<Leftovers>("/api/backup/leftovers/remove");
// Fails on purpose, so the owner can check that error reports reach GlitchTip.
export const sendTestErrorReport = () => api.post("/api/backup/test-error-report");
