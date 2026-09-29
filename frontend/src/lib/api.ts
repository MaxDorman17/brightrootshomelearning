import axios from "axios";

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
export const addMoment = (fields: { note: string; moment_date: string; subject: string; child_ids: number[] }, files: File[]) => {
  const form = new FormData();
  form.append("note", fields.note);
  form.append("moment_date", fields.moment_date);
  form.append("subject", fields.subject);
  form.append("child_ids", fields.child_ids.join(","));
  files.forEach((f) => form.append("files", f));
  return api.post("/api/moments/", form);
};
export const updateMoment = (id: number, body: { note: string; moment_date: string; subject: string; child_ids: number[] }) =>
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
export const getNewsletterAdmin = () => api.get("/api/newsletter/admin");
export const previewNewsletter = (subject: string, body: string) => api.post("/api/newsletter/admin/preview", { subject, body });
export const testNewsletter = (subject: string, body: string) => api.post("/api/newsletter/admin/test", { subject, body });
export const sendNewsletter = (subject: string, body: string) => api.post("/api/newsletter/admin/send", { subject, body });
export const saveGameScore = (game: string, score: number, detail?: string) =>
  api.post("/api/games/scores", { game, score, detail });
export const getGamesSummary = (child_id?: number) =>
  api.get("/api/games/summary", { params: child_id != null ? { child_id } : {} });
export const getPendingRewardCount = () => api.get("/api/rewards/pending-count");
export const saveFamilyTheme = (theme: string) => api.put("/api/auth/theme", { theme });
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
export const getAllEntries = () => api.get("/api/planner/all");
export const getSubmissionCount = () => api.get("/api/planner/submission-count");
export const getPendingFeedback = () => api.get("/api/planner/pending-feedback");
export const getAllMyEntries = () => api.get("/api/planner/mine");
export const createPlannerEntry = (data: { lesson_id: number; scheduled_date: string; assigned_to?: number; is_extra?: boolean }) =>
  api.post("/api/planner/", data);
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
export const addChild = (data: { username: string; email?: string; password: string }) =>
  api.post("/api/children/", data);
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
export const upsertUnit = (data: { subject: string; title: string; unit_url?: string; notes?: string }) =>
  api.post("/api/units/", data);
export const deleteUnit = (subject: string) => api.delete(`/api/units/${encodeURIComponent(subject)}`);
export const getUnitQueue = () => api.get("/api/units/queue");
export const addQueuedUnit = (data: { subject: string; title: string; unit_url?: string; notes?: string }) =>
  api.post("/api/units/queue", data);
export const updateQueuedUnit = (id: number, data: { title?: string; unit_url?: string; notes?: string }) =>
  api.put(`/api/units/queue/${id}`, data);
export const deleteQueuedUnit = (id: number) => api.delete(`/api/units/queue/${id}`);
export const promoteQueuedUnit = (id: number) => api.post(`/api/units/queue/${id}/promote`);

// Timetable
export const getTimetable = () => api.get("/api/timetable/");
export const saveTimetable = (config: Record<string, string[]>) => api.put("/api/timetable/", { config });

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
export type MakeKind = "recipe" | "craft";
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
export const addItemToShopping = (id: number, names?: string[]) => api.post(`/api/make/items/${id}/shopping`, { names: names ?? null });
export const getShopping = () => api.get("/api/make/shopping");
export const getShoppingCount = () => api.get("/api/make/shopping/count");
export const addShopping = (name: string, qty = "") => api.post("/api/make/shopping", { name, qty });
export const updateShopping = (id: number, body: { done?: boolean; name?: string; qty?: string }) =>
  api.patch(`/api/make/shopping/${id}`, body);
export const deleteShopping = (id: number) => api.delete(`/api/make/shopping/${id}`);
export const clearShopping = (doneOnly = true) => api.post("/api/make/shopping/clear", null, { params: { done_only: doneOnly } });
