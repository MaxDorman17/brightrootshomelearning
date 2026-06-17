import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined" && !err.config?.url?.includes("/auth/login")) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (username: string, password: string) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  return api.post("/api/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};
export const register = (data: { email: string; username: string; password: string; role: string }) =>
  api.post("/api/auth/register", data);

// Lessons
export const getLessons = () => api.get("/api/lessons/");
export const createLesson = (data: { title: string; subject: string; description?: string; lesson_url?: string }) =>
  api.post("/api/lessons/", data);
export const updateLesson = (id: number, data: { title?: string; subject?: string; description?: string; lesson_url?: string }) =>
  api.put(`/api/lessons/${id}`, data);
export const deleteLesson = (id: number) => api.delete(`/api/lessons/${id}`);

// Planner
export const getWeekEntries = (startDate?: string, childId?: number) =>
  api.get("/api/planner/week", {
    params: { ...(startDate ? { start_date: startDate } : {}), ...(childId ? { child_id: childId } : {}) },
  });
export const getTodayEntries = () => api.get("/api/planner/today");
export const getAllEntries = () => api.get("/api/planner/all");
export const getSubmissionCount = () => api.get("/api/planner/submission-count");
export const getAllMyEntries = () => api.get("/api/planner/mine");
export const createPlannerEntry = (data: { lesson_id: number; scheduled_date: string; assigned_to?: number }) =>
  api.post("/api/planner/", data);
export const updatePlannerEntry = (id: number, data: { scheduled_date?: string; assigned_to?: number | null }) =>
  api.put(`/api/planner/${id}`, data);
export const deletePlannerEntry = (id: number) => api.delete(`/api/planner/${id}`);
export const shiftDay = (from_date: string, to_date: string, direction: "forward" | "backward" = "forward") =>
  api.post("/api/planner/shift-day", { from_date, to_date, direction });
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

// Coding Progress (DB-backed, per-user)
export const getCodingProgress = (childId?: number) =>
  api.get("/api/coding-progress/", { params: childId ? { child_id: childId } : {} });
export const markCodingComplete = (lessonId: string) => api.post(`/api/coding-progress/${lessonId}`);
export const markCodingIncomplete = (lessonId: string) => api.delete(`/api/coding-progress/${lessonId}`);

// Days Off
export const getDaysOff = () => api.get("/api/days-off/");
export const addDayOff = (data: { date: string; reason?: string }) => api.post("/api/days-off/", data);
export const removeDayOff = (id: number) => api.delete(`/api/days-off/${id}`);

// Reading Log
export const getBooks = (childId?: number) =>
  api.get("/api/reading/", { params: childId ? { child_id: childId } : {} });
export const addBook = (data: { title: string; author?: string; pages?: number; status?: string; start_date?: string; finish_date?: string; notes?: string; child_id?: number | null }) =>
  api.post("/api/reading/", data);
export const updateBook = (id: number, data: { title?: string; author?: string; pages?: number; status?: string; start_date?: string; finish_date?: string; finish_date_clear?: boolean; rating?: number; notes?: string }) =>
  api.patch(`/api/reading/${id}`, data);
export const deleteBook = (id: number) => api.delete(`/api/reading/${id}`);

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
export const deleteWorksheet = (worksheetId: number) =>
  api.delete(`/api/reading/worksheets/${worksheetId}`);

// Polish / Duolingo
export const getPolishSessions = () => api.get("/api/polish/");
export const logPolishSession = (data: { date: string; xp?: number; notes?: string }) =>
  api.post("/api/polish/", data);
export const deletePolishSession = (id: number) => api.delete(`/api/polish/${id}`);

// Children
export const getChildren = () => api.get("/api/children/");
export const addChild = (data: { username: string; email: string; password: string }) =>
  api.post("/api/children/", data);
export const removeChild = (id: number) => api.delete(`/api/children/${id}`);

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

// Timetable
export const getTimetable = () => api.get("/api/timetable/");
export const saveTimetable = (config: Record<string, string[]>) => api.put("/api/timetable/", { config });
