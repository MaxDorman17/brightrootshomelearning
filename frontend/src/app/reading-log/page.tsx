"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getBooks, addBook, updateBook, deleteBook, getWorksheets, addWorksheet, uploadWorksheet, deleteWorksheet, downloadReadingFile, getChildren } from "@/lib/api";
import { ReadingLogBook, ReadingWorksheet, Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

type Status = "all" | "reading" | "completed" | "wishlist";
type SortKey = "recent" | "title" | "rating";

const STATUS_CONFIG = {
  wishlist: {
    label: "Wishlist",
    icon: "○",
    badge: "bg-[#EFE9DF] text-[#6E5A46]",
    bar: "bg-[#C8BBAA]",
    card: "border-[#DDD3C4] bg-[#FFFDF8]",
  },
  reading: {
    label: "Reading",
    icon: "◐",
    badge: "bg-[#E5ECE2] text-[#3F5D46]",
    bar: "bg-[#8FA382]",
    card: "border-[#C9D4C5] bg-[#FFFDF8]",
  },
  completed: {
    label: "Completed",
    icon: "✓",
    badge: "bg-[#E7EFE7] text-[#3F5D46]",
    bar: "bg-[#3F5D46]",
    card: "border-[#BFD0BE] bg-[#FFFDF8]",
  },
} as const;

function Stars({ rating, onRate }: { rating: number | null; onRate?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onRate?.(n)}
          onMouseEnter={() => onRate && setHover(n)}
          onMouseLeave={() => onRate && setHover(0)}
          className={`text-lg transition-transform ${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"} ${
            n <= (hover || rating || 0) ? "text-yellow-400" : "text-gray-200"
          }`}
          disabled={!onRate}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReadingLogPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [books, setBooks] = useState<ReadingLogBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>("all");
  const [sort, setSort] = useState<SortKey>("recent");

  // Add/edit modal state
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<ReadingLogBook | null>(null);
  const [fTitle, setFTitle] = useState("");
  const [fAuthor, setFAuthor] = useState("");
  const [fPages, setFPages] = useState("");
  const [fTotalChapters, setFTotalChapters] = useState("");
  const [fStatus, setFStatus] = useState<string>("wishlist");
  const [fStartDate, setFStartDate] = useState("");
  const [fFinishDate, setFFinishDate] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [journeyBookId, setJourneyBookId] = useState<number | null>(null);
  const [journeyJournal, setJourneyJournal] = useState("");
  const [journeyQ1, setJourneyQ1] = useState("");
  const [journeyQ2, setJourneyQ2] = useState("");
  const [journeyQ3, setJourneyQ3] = useState("");
  const [savingJourney, setSavingJourney] = useState(false);

  // Worksheets
  const [worksheets, setWorksheets] = useState<ReadingWorksheet[]>([]);
  const [addingWsFor, setAddingWsFor] = useState<number | null>(null);
  const [wsMode, setWsMode] = useState<"url" | "upload">("url");
  const [wsTitle, setWsTitle] = useState("");
  const [wsUrl, setWsUrl] = useState("");
  const [wsFile, setWsFile] = useState<File | null>(null);
  const [savingWs, setSavingWs] = useState(false);

  // Inline child note editing
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState<number | null>(null);

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [fChildId, setFChildId] = useState<number | null>(null);

  const isParent = role === "parent";

  const load = useCallback(async () => {
    const [booksRes, wsRes] = await Promise.all([getBooks(), getWorksheets()]);
    setBooks(booksRes.data);
    setWorksheets(wsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    const r = getRole() || "";
    setRole(r);
    if (r === "parent") {
      getChildren().then(res => setChildren(res.data)).catch(() => {});
    }
    load();
  }, [load, router]);

  const openAdd = () => {
    setEditing(null);
    setFTitle(""); setFAuthor(""); setFPages(""); setFTotalChapters(""); setFStatus("wishlist");
    setFStartDate(""); setFFinishDate(""); setFNotes("");
    setFChildId(selectedChildId);
    setModal(true);
  };

  const openEdit = (book: ReadingLogBook) => {
    setEditing(book);
    setFTitle(book.title);
    setFAuthor(book.author ?? "");
    setFPages(book.pages?.toString() ?? "");
    setFTotalChapters(book.total_chapters?.toString() ?? "");
    setFStatus(book.status);
    setFStartDate(book.start_date ?? "");
    setFFinishDate(book.finish_date ?? "");
    setFNotes(book.notes ?? "");
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const openJourney = (book: ReadingLogBook) => {
    setJourneyBookId(book.id);
    setJourneyJournal(book.reading_journal ?? "");
    setJourneyQ1(book.question_1_answer ?? "");
    setJourneyQ2(book.question_2_answer ?? "");
    setJourneyQ3(book.question_3_answer ?? "");
  };

  const handleSave = async () => {
    if (!fTitle.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: fTitle.trim(),
        author: fAuthor.trim() || undefined,
        pages: fPages ? parseInt(fPages) : undefined,
        total_chapters: fTotalChapters ? parseInt(fTotalChapters) : undefined,
        status: fStatus,
        start_date: fStartDate || undefined,
        finish_date: fFinishDate || undefined,
        notes: fNotes.trim() || undefined,
        child_id: fChildId ?? undefined,
      };
      if (editing) {
        await updateBook(editing.id, payload);
      } else {
        await addBook(payload);
      }
      await load();
      closeModal();
    } finally { setSaving(false); }
  };  const handleChapterProgress = async (book: ReadingLogBook, chapter: number) => {
    const current = book.completed_chapters ?? 0;
    const next = chapter <= current ? chapter - 1 : chapter;
    const res = await updateBook(book.id, { completed_chapters: next });
    setBooks(prev => prev.map(b => b.id === book.id ? res.data : b));
  };

  const handleSaveJourney = async (book: ReadingLogBook) => {
    setSavingJourney(true);
    try {
      const res = await updateBook(book.id, {
        reading_journal: journeyJournal,
        question_1_answer: journeyQ1,
        question_2_answer: journeyQ2,
        question_3_answer: journeyQ3,
      });
      setBooks(prev => prev.map(b => b.id === book.id ? res.data : b));
    } finally {
      setSavingJourney(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this book from the log?")) return;
    await deleteBook(id);
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleStatusChange = async (book: ReadingLogBook, status: string) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const patch: Record<string, unknown> = { status };
    if (status === "reading" && !book.start_date) patch.start_date = today;
    if (status === "completed") {
      if (!book.start_date) patch.start_date = today;
      patch.finish_date = today;
    }
    if (status === "wishlist") patch.finish_date_clear = true;
    const res = await updateBook(book.id, patch);
    setBooks(prev => prev.map(b => b.id === book.id ? res.data : b));
  };

  const handleRate = async (book: ReadingLogBook, rating: number) => {
    const res = await updateBook(book.id, { rating });
    setBooks(prev => prev.map(b => b.id === book.id ? res.data : b));
  };

  const handleSaveNote = async (id: number) => {
    if (!noteText.trim()) return;
    setSavingNote(id);
    try {
      const res = await updateBook(id, { notes: noteText.trim() });
      setBooks(prev => prev.map(b => b.id === id ? res.data : b));
      setEditingNote(null);
    } finally { setSavingNote(null); }
  };

  const handleAddWorksheet = async (bookId: number) => {
    if (!wsTitle.trim()) return;
    if (wsMode === "url" && !wsUrl.trim()) return;
    if (wsMode === "upload" && !wsFile) return;
    setSavingWs(true);
    try {
      let res;
      if (wsMode === "upload" && wsFile) {
        res = await uploadWorksheet(bookId, wsTitle.trim(), wsFile);
      } else {
        res = await addWorksheet(bookId, { title: wsTitle.trim(), url: wsUrl.trim() });
      }
      setWorksheets(prev => [...prev, res.data]);
      setWsTitle(""); setWsUrl(""); setWsFile(null); setWsMode("url"); setAddingWsFor(null);
    } finally { setSavingWs(false); }
  };

  const handleDeleteWorksheet = async (id: number) => {
    await deleteWorksheet(id);
    setWorksheets(prev => prev.filter(w => w.id !== id));
  };

  const handleDownloadWorksheet = async (ws: ReadingWorksheet) => {
    try {
      const res = await downloadReadingFile(ws.url);
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const ext = ws.url.includes(".") ? ws.url.split(".").pop() : "";
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = ext ? `${ws.title}.${ext}` : ws.title;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      alert("Could not download this file.");
    }
  };

  const visibleBooks = isParent && selectedChildId
    ? books.filter(b => b.child_id === selectedChildId || b.child_id === null)
    : books;

  // Monthly stats: completed books per month over last 6 months
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(new Date(), 5 - i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const finished = visibleBooks.filter(b =>
      b.status === "completed" && b.finish_date &&
      isWithinInterval(parseISO(b.finish_date), { start, end })
    );
    const pages = finished.reduce((s, b) => s + (b.pages ?? 0), 0);
    return { label: format(monthDate, "MMM"), count: finished.length, pages };
  });
  const maxBooks = Math.max(...monthlyStats.map(m => m.count), 1);
  const totalPages = visibleBooks.filter(b => b.status === "completed").reduce((s, b) => s + (b.pages ?? 0), 0);

  const displayed = visibleBooks
    .filter(b => filter === "all" || b.status === filter)
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: visibleBooks.length,
    reading: visibleBooks.filter(b => b.status === "reading").length,
    completed: visibleBooks.filter(b => b.status === "completed").length,
    wishlist: visibleBooks.filter(b => b.status === "wishlist").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="brand-card p-6 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D88C64]">Reading</p>
              <h1 className="brand-heading text-3xl mt-1">Reading Log</h1>
              <p className="text-[#6E5A46] mt-2 max-w-2xl">
                {isParent ? "Track reading progress, books, worksheets and Reading Journeys." : "Keep your books, progress and Reading Journeys all in one place."}
              </p>
            </div>
            {isParent && (
              <button
                onClick={openAdd}
                className="inline-flex items-center justify-center rounded-xl bg-[#3F5D46] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#334C39]"
              >
                + Add Book
              </button>
            )}
          </div>
        </div>

        {/* Child selector (parent only) */}
        {isParent && children.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedChildId(null)}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
                !selectedChildId
                  ? "border-[#3F5D46] bg-[#3F5D46] text-white"
                  : "border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] hover:border-[#8FA382]"
              }`}
            >
              All children
            </button>
            {children.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
                  selectedChildId === c.id
                    ? "border-[#3F5D46] bg-[#3F5D46] text-white"
                    : "border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] hover:border-[#8FA382]"
                }`}
              >
                {c.username}
              </button>
            ))}
          </div>
        )}

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total, accent: "bg-[#3F5D46]" },
            { label: "Reading", value: stats.reading, accent: "bg-[#8FA382]" },
            { label: "Completed", value: stats.completed, accent: "bg-[#D88C64]" },
            { label: "Wishlist", value: stats.wishlist, accent: "bg-[#E3B554]" },
          ].map(s => (
            <div key={s.label} className="brand-card p-4">
              <div className={`mb-3 h-1.5 w-10 rounded-full ${s.accent}`} />
              <p className="text-2xl font-extrabold text-[#2E342F]">{s.value}</p>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#6E5A46]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly stats chart */}
        {stats.completed > 0 && (
          <div className="brand-card p-5 mb-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D88C64]">Reading History</p>
                <h2 className="text-lg font-extrabold text-[#2E342F] mt-1">Books finished in the last 6 months</h2>
              </div>
              {totalPages > 0 && (
                <span className="self-start rounded-full bg-[#E5ECE2] px-3 py-1 text-xs font-bold text-[#3F5D46]">
                  {totalPages.toLocaleString()} pages read
                </span>
              )}
            </div>
            <div className="flex items-end gap-3 h-28">
              {monthlyStats.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-[#6E5A46]">{m.count > 0 ? m.count : ""}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: "72px" }}>
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${m.count > 0 ? "bg-[#8FA382]" : "bg-[#EFE9DF]"}`}
                      style={{ height: `${m.count === 0 ? 4 : Math.max(8, Math.round((m.count / maxBooks) * 72))}px` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#8A7A69]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Filters + sort */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#DDD3C4] bg-[#FFFDF8] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "reading", "completed", "wishlist"] as Status[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
                  filter === f
                    ? "border-[#3F5D46] bg-[#3F5D46] text-white"
                    : "border-[#D8D1C4] bg-white text-[#6E5A46] hover:border-[#8FA382]"
                }`}
              >
                {f === "all" ? "All" : `${STATUS_CONFIG[f as keyof typeof STATUS_CONFIG].icon} ${STATUS_CONFIG[f as keyof typeof STATUS_CONFIG].label}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {([["recent", "Recent"], ["title", "A-Z"], ["rating", "★ Rating"]] as [SortKey, string][]).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                  sort === k
                    ? "border-[#D88C64] bg-[#F5E4DA] text-[#9A5E3E]"
                    : "border-[#D8D1C4] bg-white text-[#6E5A46] hover:border-[#8FA382]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {/* Book list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-lg">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="brand-card p-12 text-center">
            <p className="text-5xl mb-3">📚</p>
            <p className="text-gray-500 font-semibold">
              {filter === "all" ? (isParent ? "No books yet — click \"Add Book\" to get started!" : "No books in the log yet — ask Max to add some!") : `No ${filter} books.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map(book => {
              const cfg = STATUS_CONFIG[book.status] || STATUS_CONFIG.wishlist;
              return (
                <div key={book.id}
                  className={`rounded-2xl border p-5 transition-colors ${cfg.card}`}>

                  {/* Top row: status badge + parent edit/delete */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}>
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </span>

                    {isParent && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(book)}
                          className="rounded-lg border border-[#D8D1C4] bg-white px-2.5 py-1.5 text-xs font-bold text-[#3F5D46] transition-colors hover:border-[#8FA382] hover:bg-[#F7F2E8]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="rounded-lg border border-[#E5CFC3] bg-white px-2.5 py-1.5 text-xs font-bold text-[#A85F46] transition-colors hover:bg-[#FAEEE8]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title + author */}
                  <h3 className="text-lg font-extrabold leading-snug text-[#2E342F]">{book.title}</h3>
                  {book.author && (
                    <p className="mt-1 text-sm font-medium text-[#6E5A46]">by {book.author}</p>
                  )}

                  {/* Meta: pages + chapters + dates */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#7A6B5C]">
                    {book.pages && (
                      <span className="rounded-full bg-[#F7F2E8] px-2.5 py-1">
                        {book.pages} pages
                      </span>
                    )}
                    {book.total_chapters && (
                      <span className="rounded-full bg-[#E5ECE2] px-2.5 py-1 text-[#3F5D46]">
                        {book.total_chapters} chapters
                      </span>
                    )}
                    {book.start_date && (
                      <span className="rounded-full bg-white px-2.5 py-1 border border-[#E6DED2]">
                        Started {format(parseISO(book.start_date), "d MMM yyyy")}
                      </span>
                    )}
                    {book.finish_date && (
                      <span className="rounded-full bg-white px-2.5 py-1 border border-[#E6DED2]">
                        Finished {format(parseISO(book.finish_date), "d MMM yyyy")}
                      </span>
                    )}
                  </div>
                  {/* Rating */}
                  <div className="mt-4">
                    <Stars
                      rating={book.rating}
                      onRate={!isParent ? (n) => handleRate(book, n) : undefined}
                    />
                    {!book.rating && !isParent && book.status === "completed" && (
                      <p className="text-xs text-gray-400 mt-0.5">Tap a star to rate!</p>
                    )}                  </div>

                  {book.total_chapters && book.total_chapters > 0 && (
                    <div className="mt-4 rounded-xl border border-[#C9D4C5] bg-[#F7F2E8] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-[#3F5D46]">Reading Journey</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {book.completed_chapters ?? 0} of {book.total_chapters} chapters complete
                          </p>
                        </div>
                        <button
                          onClick={() => journeyBookId === book.id ? setJourneyBookId(null) : openJourney(book)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#3F5D46] text-white font-bold hover:bg-[#2F4B37] transition-colors"
                        >
                          {journeyBookId === book.id ? "Close Journey" : "Open Journey"}
                        </button>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#E6E0D5] overflow-hidden">
                        <div
                          className="h-full bg-[#8FA382] transition-all"
                          style={{ width: `${Math.min(100, ((book.completed_chapters ?? 0) / book.total_chapters) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {journeyBookId === book.id && book.total_chapters && book.total_chapters > 0 && (
                    <div className="mt-3 rounded-2xl border border-[#8FA382]/30 bg-[#FFFDF8] p-4 space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <h4 className="font-extrabold text-[#2E342F]">Chapter Progress</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Tick each chapter as you finish it.
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#3F5D46] bg-[#8FA382]/15 px-2.5 py-1 rounded-full">
                            {book.completed_chapters ?? 0}/{book.total_chapters}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: book.total_chapters }, (_, i) => i + 1).map(chapter => {
                            const complete = chapter <= (book.completed_chapters ?? 0);
                            return (
                              <button
                                key={chapter}
                                type="button"
                                disabled={isParent}
                                onClick={() => handleChapterProgress(book, chapter)}
                                className={`min-w-10 h-10 px-2 rounded-xl text-sm font-bold border transition-colors ${
                                  complete
                                    ? "bg-[#3F5D46] border-[#3F5D46] text-white"
                                    : "bg-white border-[#8FA382]/40 text-[#3F5D46] hover:bg-[#8FA382]/10"
                                } disabled:cursor-default`}
                                title={`Chapter ${chapter}`}
                              >
                                {complete ? "✓" : chapter}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2">
                          <h4 className="font-extrabold text-[#2E342F]">My Reading Journal</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Write about the story, characters, favourite parts, or anything you noticed.
                          </p>
                        </div>
                        <div className="bg-white border border-[#D8D1C4] rounded-xl shadow-sm overflow-hidden">
                          <div className="h-8 border-b border-[#E8E2D8] bg-[#F7F2E8] flex items-center px-3">
                            <span className="text-[11px] font-semibold text-[#6E5A46]">Reading Journal</span>
                          </div>
                          <textarea
                            value={journeyJournal}
                            onChange={e => setJourneyJournal(e.target.value)}
                            readOnly={isParent}
                            rows={12}
                            placeholder="Start writing here..."
                            className="w-full px-5 py-4 text-sm leading-7 text-[#2E342F] bg-white focus:outline-none resize-y read-only:bg-[#FFFDF8]"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-extrabold text-[#2E342F]">Reading Questions</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Answer these in your own words.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-[#3F5D46] mb-1.5">
                            1. What happened in this part of the book?
                          </label>
                          <textarea
                            value={journeyQ1}
                            onChange={e => setJourneyQ1(e.target.value)}
                            readOnly={isParent}
                            rows={3}
                            placeholder="Write your answer..."
                            className="w-full border border-[#D8D1C4] rounded-xl px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-[#8FA382] resize-y read-only:bg-[#FFFDF8]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-[#3F5D46] mb-1.5">
                            2. What did you think about it and why?
                          </label>
                          <textarea
                            value={journeyQ2}
                            onChange={e => setJourneyQ2(e.target.value)}
                            readOnly={isParent}
                            rows={3}
                            placeholder="Write your answer..."
                            className="w-full border border-[#D8D1C4] rounded-xl px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-[#8FA382] resize-y read-only:bg-[#FFFDF8]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-[#3F5D46] mb-1.5">
                            3. What do you think will happen next?
                          </label>
                          <textarea
                            value={journeyQ3}
                            onChange={e => setJourneyQ3(e.target.value)}
                            readOnly={isParent}
                            rows={3}
                            placeholder="Write your answer..."
                            className="w-full border border-[#D8D1C4] rounded-xl px-3.5 py-3 text-sm bg-white focus:outline-none focus:border-[#8FA382] resize-y read-only:bg-[#FFFDF8]"
                          />
                        </div>
                      </div>

                      {!isParent && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveJourney(book)}
                            disabled={savingJourney}
                            className="px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#2F4B37] disabled:opacity-50 transition-colors"
                          >
                            {savingJourney ? "Saving..." : "Save Reading Journey"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {book.notes && editingNote !== book.id && (
                    <p className="text-sm text-gray-600 bg-white/60 rounded-xl px-3 py-2 mt-3 border border-white/80 leading-relaxed">
                      {book.notes}
                    </p>
                  )}

                  {/* Child: inline note editor */}
                  {!isParent && editingNote === book.id && (
                    <div className="mt-4">
                      <textarea
                        rows={2}
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="What did you think?"
                        className="w-full text-sm border-2 border-[#A8C67A]/40 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#6EA76E] font-medium bg-white resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-1.5">
                        <button onClick={() => handleSaveNote(book.id)}
                          disabled={savingNote === book.id || !noteText.trim()}
                          className="text-xs px-3 py-1.5 bg-gradient-to-r from-[#2F5D3A] to-[#6EA76E] text-white rounded-lg font-bold disabled:opacity-40">
                          {savingNote === book.id ? "…" : "Save"}
                        </button>
                        <button onClick={() => setEditingNote(null)}
                          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 font-bold">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Worksheets */}
                  {(() => {
                    const bookWs = worksheets.filter(w => w.book_id === book.id);
                    return (bookWs.length > 0 || isParent) ? (
                      <div className="mt-3 pt-3 border-t border-white/60">
                        {bookWs.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">📄 Worksheets</p>
                            <div className="space-y-1.5">
                              {bookWs.map(ws => (
                                <div key={ws.id} className="flex items-center gap-2">
                                  {ws.url.startsWith("/api/reading/files/") ? (
                                    <button
                                      onClick={() => handleDownloadWorksheet(ws)}
                                      className="flex-1 text-left text-sm font-semibold text-[#6EA76E] hover:text-[#2F5D3A] hover:underline truncate"
                                    >
                                      📥 {ws.title}
                                    </button>
                                  ) : (
                                    <a
                                      href={ws.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 text-sm font-semibold text-[#6EA76E] hover:text-[#2F5D3A] hover:underline truncate"
                                    >
                                      📄 {ws.title}
                                    </a>
                                  )}
                                  {isParent && (
                                    <button
                                      onClick={() => handleDeleteWorksheet(ws.id)}
                                      className="text-gray-300 hover:text-red-400 text-xs shrink-0 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Parent: add worksheet */}
                        {isParent && (
                          addingWsFor === book.id ? (
                            <div className="space-y-2">
                              {/* Mode toggle */}
                              <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                                <button
                                  onClick={() => { setWsMode("url"); setWsFile(null); }}
                                  className={`flex-1 text-xs py-1 rounded-md font-semibold transition-all ${wsMode === "url" ? "bg-white shadow-sm text-[#2F5D3A]" : "text-gray-500 hover:text-gray-700"}`}>
                                  Paste link
                                </button>
                                <button
                                  onClick={() => { setWsMode("upload"); setWsUrl(""); }}
                                  className={`flex-1 text-xs py-1 rounded-md font-semibold transition-all ${wsMode === "upload" ? "bg-white shadow-sm text-[#2F5D3A]" : "text-gray-500 hover:text-gray-700"}`}>
                                  Upload file
                                </button>
                              </div>
                              <input
                                autoFocus
                                value={wsTitle}
                                onChange={e => setWsTitle(e.target.value)}
                                placeholder="Worksheet name"
                                className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                              />
                              {wsMode === "url" ? (
                                <input
                                  value={wsUrl}
                                  onChange={e => setWsUrl(e.target.value)}
                                  placeholder="https://… (Google Doc, PDF link, etc.)"
                                  type="url"
                                  className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                                />
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                                    onChange={e => setWsFile(e.target.files?.[0] ?? null)}
                                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#A8C67A]/20 file:text-[#2F5D3A] hover:file:bg-[#A8C67A]/30 cursor-pointer"
                                  />
                                  <p className="text-[10px] text-gray-400 mt-0.5">PDF, Word, or image · max 10 MB</p>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddWorksheet(book.id)}
                                  disabled={savingWs || !wsTitle.trim() || (wsMode === "url" ? !wsUrl.trim() : !wsFile)}
                                  className="text-xs px-3 py-1.5 gradient-btn disabled:opacity-50"
                                >
                                  {savingWs ? "…" : "Add"}
                                </button>
                                <button
                                  onClick={() => { setAddingWsFor(null); setWsTitle(""); setWsUrl(""); setWsFile(null); setWsMode("url"); }}
                                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setAddingWsFor(book.id); setWsTitle(""); setWsUrl(""); setWsMode("url"); setWsFile(null); }}
                              className="text-xs font-bold text-[#6EA76E] hover:text-[#2F5D3A] transition-colors"
                            >
                              + Add worksheet
                            </button>
                          )
                        )}
                      </div>
                    ) : null;
                  })()}                  {/* Child action buttons */}
                  {!isParent && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E6DED2] pt-4">
                      {book.status === "wishlist" && (
                        <button
                          onClick={() => handleStatusChange(book, "reading")}
                          className="rounded-xl bg-[#3F5D46] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#334C39]"
                        >
                          Start Reading
                        </button>
                      )}
                      {book.status === "reading" && (
                        <button
                          onClick={() => handleStatusChange(book, "completed")}
                          className="rounded-xl bg-[#3F5D46] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#334C39]"
                        >
                          Mark Done
                        </button>
                      )}
                      {book.status === "completed" && (
                        <button
                          onClick={() => handleStatusChange(book, "reading")}
                          className="rounded-xl border border-[#C9D4C5] bg-[#E5ECE2] px-3.5 py-2 text-xs font-bold text-[#3F5D46] transition-colors hover:bg-[#DCE6D9]"
                        >
                          Read Again
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingNote(book.id);
                          setNoteText(book.notes ?? "");
                        }}
                        className="rounded-xl border border-[#D8D1C4] bg-white px-3.5 py-2 text-xs font-bold text-[#6E5A46] transition-colors hover:border-[#8FA382] hover:bg-[#F7F2E8]"
                      >
                        {book.notes ? "Edit Note" : "Add Note"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit modal (parent only) */}
      {modal && isParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-gray-900 mb-5">
              {editing ? "Edit Book" : "Add Book"}
            </h3>

            <div className="space-y-4">
              {children.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">For</label>
                  <select value={fChildId ?? ""} onChange={e => setFChildId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors">
                    <option value="">All children</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Title *</label>
                <input autoFocus value={fTitle} onChange={e => setFTitle(e.target.value)}
                  placeholder="e.g. Charlie and the Chocolate Factory"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Author</label>
                <input value={fAuthor} onChange={e => setFAuthor(e.target.value)}
                  placeholder="e.g. Roald Dahl"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Pages</label>
                    <input type="number" min={1} value={fPages} onChange={e => setFPages(e.target.value)}
                      placeholder="e.g. 224"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Chapters</label>
                    <input type="number" min={1} value={fTotalChapters} onChange={e => setFTotalChapters(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                  <select value={fStatus} onChange={e => setFStatus(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors">
                    <option value="wishlist">📋 Wishlist</option>
                    <option value="reading">📖 Reading</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Start date</label>
                  <input type="date" value={fStartDate} onChange={e => setFStartDate(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Finish date</label>
                  <input type="date" value={fFinishDate} onChange={e => setFFinishDate(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Notes</label>
                <textarea rows={2} value={fNotes} onChange={e => setFNotes(e.target.value)}
                  placeholder="Any notes about this book…"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !fTitle.trim()}
                className="flex-1 gradient-btn py-2.5 disabled:opacity-50">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Book"}
              </button>
              <button onClick={closeModal}
                className="px-5 py-2.5 border-2 border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
