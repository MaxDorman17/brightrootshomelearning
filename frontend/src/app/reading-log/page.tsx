"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getBooks, addBook, updateBook, deleteBook, getWorksheets, addWorksheet, deleteWorksheet } from "@/lib/api";
import { ReadingLogBook, ReadingWorksheet } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

type Status = "all" | "reading" | "completed" | "wishlist";
type SortKey = "recent" | "title" | "rating";

const STATUS_CONFIG = {
  wishlist:  { label: "Wishlist",  icon: "📋", badge: "bg-gray-100 text-gray-700",    bar: "bg-gray-400",    card: "border-gray-200 bg-gray-50/50" },
  reading:   { label: "Reading",   icon: "📖", badge: "bg-blue-100 text-blue-800",    bar: "bg-blue-500",    card: "border-blue-200 bg-blue-50/50" },
  completed: { label: "Completed", icon: "✅", badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500", card: "border-emerald-200 bg-emerald-50/50" },
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
  const [fStatus, setFStatus] = useState<string>("wishlist");
  const [fStartDate, setFStartDate] = useState("");
  const [fFinishDate, setFFinishDate] = useState("");
  const [fNotes, setFNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Worksheets
  const [worksheets, setWorksheets] = useState<ReadingWorksheet[]>([]);
  const [addingWsFor, setAddingWsFor] = useState<number | null>(null);
  const [wsTitle, setWsTitle] = useState("");
  const [wsUrl, setWsUrl] = useState("");
  const [savingWs, setSavingWs] = useState(false);

  // Inline child note editing
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState<number | null>(null);

  const isParent = role === "parent";

  const load = useCallback(async () => {
    const [booksRes, wsRes] = await Promise.all([getBooks(), getWorksheets()]);
    setBooks(booksRes.data);
    setWorksheets(wsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setRole(getRole() || "");
    load();
  }, [load, router]);

  const openAdd = () => {
    setEditing(null);
    setFTitle(""); setFAuthor(""); setFPages(""); setFStatus("wishlist");
    setFStartDate(""); setFFinishDate(""); setFNotes("");
    setModal(true);
  };

  const openEdit = (book: ReadingLogBook) => {
    setEditing(book);
    setFTitle(book.title);
    setFAuthor(book.author ?? "");
    setFPages(book.pages?.toString() ?? "");
    setFStatus(book.status);
    setFStartDate(book.start_date ?? "");
    setFFinishDate(book.finish_date ?? "");
    setFNotes(book.notes ?? "");
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    if (!fTitle.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: fTitle.trim(),
        author: fAuthor.trim() || undefined,
        pages: fPages ? parseInt(fPages) : undefined,
        status: fStatus,
        start_date: fStartDate || undefined,
        finish_date: fFinishDate || undefined,
        notes: fNotes.trim() || undefined,
      };
      if (editing) {
        await updateBook(editing.id, payload);
      } else {
        await addBook(payload);
      }
      await load();
      closeModal();
    } finally { setSaving(false); }
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
    if (!wsTitle.trim() || !wsUrl.trim()) return;
    setSavingWs(true);
    try {
      const res = await addWorksheet(bookId, { title: wsTitle.trim(), url: wsUrl.trim() });
      setWorksheets(prev => [...prev, res.data]);
      setWsTitle(""); setWsUrl(""); setAddingWsFor(null);
    } finally { setSavingWs(false); }
  };

  const handleDeleteWorksheet = async (id: number) => {
    await deleteWorksheet(id);
    setWorksheets(prev => prev.filter(w => w.id !== id));
  };

  // Monthly stats: completed books per month over last 6 months
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(new Date(), 5 - i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const finished = books.filter(b =>
      b.status === "completed" && b.finish_date &&
      isWithinInterval(parseISO(b.finish_date), { start, end })
    );
    const pages = finished.reduce((s, b) => s + (b.pages ?? 0), 0);
    return { label: format(monthDate, "MMM"), count: finished.length, pages };
  });
  const maxBooks = Math.max(...monthlyStats.map(m => m.count), 1);
  const totalPages = books.filter(b => b.status === "completed").reduce((s, b) => s + (b.pages ?? 0), 0);

  const displayed = books
    .filter(b => filter === "all" || b.status === filter)
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === "reading").length,
    completed: books.filter(b => b.status === "completed").length,
    wishlist: books.filter(b => b.status === "wishlist").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">📚 Reading Log</h1>
            <p className="text-gray-500 font-medium mt-1">
              {isParent ? "Track books Oscar is reading" : "Your books — past, present and future reads"}
            </p>
          </div>
          {isParent && (
            <button onClick={openAdd} className="gradient-btn px-5 py-2.5 text-sm">
              + Add Book
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "from-[#2F5D3A] to-[#6EA76E]", shadow: "shadow-green-200" },
            { label: "Reading",  value: stats.reading,  color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200" },
            { label: "Done",     value: stats.completed, color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200" },
            { label: "Wishlist", value: stats.wishlist,  color: "from-gray-400 to-gray-500",    shadow: "shadow-gray-200" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-lg ${s.shadow} text-center`}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-white/80 font-bold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly stats chart */}
        {stats.completed > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Books Finished — Last 6 Months</h2>
              {totalPages > 0 && (
                <span className="text-xs font-bold text-[#2F5D3A] bg-[#A8C67A]/10 px-3 py-1 rounded-full">
                  📄 {totalPages.toLocaleString()} pages read
                </span>
              )}
            </div>
            <div className="flex items-end gap-3 h-24">
              {monthlyStats.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-gray-600">{m.count > 0 ? m.count : ""}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: "64px" }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${m.count > 0 ? "bg-gradient-to-t from-[#2F5D3A] to-[#6EA76E]" : "bg-gray-100"}`}
                      style={{ height: `${m.count === 0 ? 4 : Math.max(8, Math.round((m.count / maxBooks) * 64))}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-semibold">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters + sort */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex gap-1.5">
            {(["all", "reading", "completed", "wishlist"] as Status[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all capitalize ${
                  filter === f
                    ? "bg-[#2F5D3A] text-white shadow-md"
                    : "bg-white/80 backdrop-blur-sm border border-white/60 text-gray-600 hover:border-[#A8C67A] shadow-sm"
                }`}>
                {f === "all" ? "All" : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG].icon + " " + STATUS_CONFIG[f as keyof typeof STATUS_CONFIG].label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-1.5">
            {([["recent", "Recent"], ["title", "A–Z"], ["rating", "★ Rating"]] as [SortKey, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sort === k ? "bg-[#A8C67A]/20 text-[#2F5D3A] border border-[#A8C67A]/30" : "bg-white/70 text-gray-500 border border-white/60 hover:border-gray-300"
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Book list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-lg">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm p-12 text-center">
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
                  className={`rounded-2xl border-2 p-5 transition-all shadow-sm ${cfg.card}`}>

                  {/* Top row: status badge + parent edit/delete */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${cfg.badge}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    {isParent && (
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(book)}
                          className="text-xs text-gray-400 hover:text-[#6EA76E] transition-colors font-bold px-2 py-0.5 rounded-lg hover:bg-[#A8C67A]/10">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(book.id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors font-bold px-2 py-0.5 rounded-lg hover:bg-red-50">
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title + author */}
                  <h3 className="font-extrabold text-gray-900 leading-snug">{book.title}</h3>
                  {book.author && <p className="text-sm text-gray-500 font-medium mt-0.5">by {book.author}</p>}

                  {/* Meta: pages + dates */}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-gray-400 font-medium">
                    {book.pages && <span>📄 {book.pages} pages</span>}
                    {book.start_date && <span>Started {format(parseISO(book.start_date), "d MMM yyyy")}</span>}
                    {book.finish_date && <span>Finished {format(parseISO(book.finish_date), "d MMM yyyy")}</span>}
                  </div>

                  {/* Rating */}
                  <div className="mt-3">
                    <Stars
                      rating={book.rating}
                      onRate={!isParent ? (n) => handleRate(book, n) : undefined}
                    />
                    {!book.rating && !isParent && book.status === "completed" && (
                      <p className="text-xs text-gray-400 mt-0.5">Tap a star to rate!</p>
                    )}
                  </div>

                  {/* Notes */}
                  {book.notes && editingNote !== book.id && (
                    <p className="text-sm text-gray-600 bg-white/60 rounded-xl px-3 py-2 mt-3 border border-white/80 leading-relaxed">
                      {book.notes}
                    </p>
                  )}

                  {/* Child: inline note editor */}
                  {!isParent && editingNote === book.id && (
                    <div className="mt-3">
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
                                  <a
                                    href={ws.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-sm font-semibold text-[#6EA76E] hover:text-[#2F5D3A] hover:underline truncate"
                                  >
                                    📄 {ws.title}
                                  </a>
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
                              <input
                                autoFocus
                                value={wsTitle}
                                onChange={e => setWsTitle(e.target.value)}
                                placeholder="Worksheet name"
                                className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                              />
                              <input
                                value={wsUrl}
                                onChange={e => setWsUrl(e.target.value)}
                                placeholder="https://… (Google Doc, PDF link, etc.)"
                                type="url"
                                className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddWorksheet(book.id)}
                                  disabled={savingWs || !wsTitle.trim() || !wsUrl.trim()}
                                  className="text-xs px-3 py-1.5 gradient-btn disabled:opacity-50"
                                >
                                  {savingWs ? "…" : "Add"}
                                </button>
                                <button
                                  onClick={() => { setAddingWsFor(null); setWsTitle(""); setWsUrl(""); }}
                                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setAddingWsFor(book.id); setWsTitle(""); setWsUrl(""); }}
                              className="text-xs font-bold text-[#6EA76E] hover:text-[#2F5D3A] transition-colors"
                            >
                              + Add worksheet
                            </button>
                          )
                        )}
                      </div>
                    ) : null;
                  })()}

                  {/* Child action buttons */}
                  {!isParent && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/60">
                      {book.status === "wishlist" && (
                        <button onClick={() => handleStatusChange(book, "reading")}
                          className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-bold shadow-sm">
                          📖 Start Reading
                        </button>
                      )}
                      {book.status === "reading" && (
                        <button onClick={() => handleStatusChange(book, "completed")}
                          className="text-xs px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold shadow-sm">
                          ✅ Mark Done
                        </button>
                      )}
                      {book.status === "completed" && (
                        <button onClick={() => handleStatusChange(book, "reading")}
                          className="text-xs px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg font-bold hover:bg-gray-50">
                          ↩ Re-reading
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingNote(book.id);
                          setNoteText(book.notes ?? "");
                        }}
                        className="text-xs px-3 py-1.5 border-2 border-[#A8C67A]/40 text-[#6EA76E] rounded-lg font-bold hover:bg-[#A8C67A]/10">
                        📝 {book.notes ? "Edit Note" : "Add Note"}
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
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                  <select value={fStatus} onChange={e => setFStatus(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors">
                    <option value="wishlist">📋 Wishlist</option>
                    <option value="reading">📖 Reading</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
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
