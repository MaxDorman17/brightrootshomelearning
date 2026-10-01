"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import Avatar from "@/components/Avatar";
import Emoji from "@/components/Emoji";
import { deleteNote, FamilyNote, getChildren, getNotes, readNote, sendNote } from "@/lib/api";
import { Child } from "@/types";
import { DEFAULT_PARENT_AVATAR } from "@/lib/avatar";

const REACTIONS = ["❤️", "😊", "👍", "🎉"];

function ago(iso: string | null) {
  return iso ? formatDistanceToNow(parseISO(iso), { addSuffix: true }) : "";
}

// Lined notepad paper, like a note stuck on the fridge
const paper: React.CSSProperties = {
  backgroundColor: "#FFF9E6",
  backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #F1E3B8 27px, #F1E3B8 28px)",
};

function Author({ note }: { note: FamilyNote }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar username={note.author.username} avatar={note.author.avatar ?? DEFAULT_PARENT_AVATAR} size="md" />
      <div>
        <p className="text-sm font-extrabold text-[#5B4630]">From {note.author.username}</p>
        <p className="text-xs text-[#8A7358]">
          {note.author.relationship ? `${note.author.relationship} · ` : ""}
          {ago(note.created_at)}
        </p>
      </div>
    </div>
  );
}

/** The notepad on the child's Today page. Hidden until a grown-up has left a note. */
export function ChildNotesCard() {
  const [notes, setNotes] = useState<FamilyNote[]>([]);
  const [showOlder, setShowOlder] = useState(false);

  const load = useCallback(() => {
    getNotes()
      .then((res) => setNotes(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  if (notes.length === 0) return null;
  const [latest, ...older] = notes;

  const react = async (note: FamilyNote, reaction?: string) => {
    const res = await readNote(note.id, reaction).catch(() => null);
    if (res) setNotes((all) => all.map((n) => (n.id === note.id ? res.data : n)));
  };

  return (
    <section className="mb-6" aria-label="Notes from home">
      <div className="relative rounded-2xl border border-[#EADBB0] p-5 pt-6 shadow-md" style={paper}>
        {/* a bit of tape holding the note up */}
        <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-[#E9DFC6]/90 shadow-sm" aria-hidden />
        <div className="flex items-start justify-between gap-3">
          <Author note={latest} />
          {!latest.read_at && (
            <span className="rounded-full bg-[#D9534F] px-2.5 py-0.5 text-xs font-extrabold text-white">New</span>
          )}
        </div>
        <p className="mt-4 whitespace-pre-wrap text-lg leading-7 text-[#3E3226]">{latest.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {REACTIONS.map((r) => (
            <button
              key={r}
              onClick={() => react(latest, r)}
              aria-label={`Reply with ${r}`}
              className={
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl transition-transform hover:scale-110 " +
                (latest.reaction === r ? "border-[#D19A32] bg-white" : "border-transparent bg-white/70")
              }
            >
              <Emoji e={r} />
            </button>
          ))}
          {!latest.read_at && (
            <button onClick={() => react(latest)} className="ml-1 text-sm font-bold text-[#8A7358] hover:underline">
              Got it
            </button>
          )}
        </div>
        {older.length > 0 && (
          <div className="mt-4 border-t border-[#EADBB0] pt-3">
            <button onClick={() => setShowOlder((v) => !v)} className="text-sm font-bold text-[#8A7358] hover:underline">
              {showOlder ? "Hide older notes" : `Older notes (${older.length})`}
            </button>
            {showOlder && (
              <ul className="mt-3 space-y-3">
                {older.map((n) => (
                  <li key={n.id} className="rounded-xl bg-white/60 p-3">
                    <p className="text-xs font-bold text-[#8A7358]">
                      From {n.author.username} · {ago(n.created_at)}
                      {n.reaction ? <> · <Emoji e={n.reaction} /></> : null}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#3E3226]">{n.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** "Leave a note" on the parent dashboard, with what each child has seen. */
export function ParentNotesCard() {
  const [kids, setKids] = useState<Child[]>([]);
  const [notes, setNotes] = useState<FamilyNote[]>([]);
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(() => {
    getNotes()
      .then((res) => setNotes(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    getChildren()
      .then((res) => {
        setKids(res.data);
        setPicked(res.data.map((k: Child) => k.id));
      })
      .catch(() => {});
    load();
  }, [load]);

  if (kids.length === 0) return null;

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return setError("Write a message first.");
    if (picked.length === 0) return setError("Pick who the note is for.");
    setSending(true);
    setError("");
    try {
      await sendNote(text.trim(), picked);
      setText("");
      load();
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "That didn't send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Remove this note? It will disappear from your child's page.")) return;
    await deleteNote(id).catch(() => {});
    load();
  };

  const shown = showAll ? notes : notes.slice(0, 4);

  return (
    <section className="brand-card mb-8 p-6" aria-label="Leave a note">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={send}>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-terracotta">Notes from home</p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">Leave a note</h2>
          <p className="mt-1 text-sm text-[#6E5A46]">It shows on the notepad at the top of their Today page, with your picture and name.</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="e.g. Good luck with your spelling test today! Love, Dad x"
            className="mt-4 w-full rounded-xl border-2 border-brand-line px-4 py-3 text-base leading-7 outline-none focus:border-brand-softsage"
            style={paper}
          />
          {kids.length > 1 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-brand-charcoal">For</span>
              {kids.map((k) => {
                const on = picked.includes(k.id);
                return (
                  <button
                    type="button"
                    key={k.id}
                    onClick={() => setPicked(on ? picked.filter((x) => x !== k.id) : [...picked, k.id])}
                    className={
                      "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                      (on ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-earth")
                    }
                  >
                    {on ? "✓ " : ""}
                    {k.username}
                  </button>
                );
              })}
            </div>
          )}
          {error && <p className="mt-2 text-sm font-semibold text-[#A64F42]">{error}</p>}
          <button
            type="submit"
            disabled={sending}
            className="mt-4 rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark disabled:opacity-60"
          >
            {sending ? "Sending…" : kids.length > 1 && picked.length > 1 ? "Send to all" : "Send note"}
          </button>
        </form>

        <div>
          <p className="text-sm font-extrabold text-brand-charcoal">Sent notes</p>
          {notes.length === 0 ? (
            <p className="mt-2 text-sm text-[#6E5A46]">No notes yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-brand-line">
              {shown.map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm text-[#2E342F]">{n.body}</p>
                    <p className="mt-0.5 text-xs text-[#6E5A46]">
                      To {n.child} · {ago(n.created_at)} ·{" "}
                      {n.read_at ? (
                        <span className="font-bold text-brand-sage">
                          Seen{n.reaction ? <> <Emoji e={n.reaction} /></> : null}
                        </span>
                      ) : (
                        "Not seen yet"
                      )}
                    </p>
                  </div>
                  <button onClick={() => remove(n.id)} className="shrink-0 text-xs font-bold text-[#A64F42] hover:underline">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {notes.length > 4 && (
            <button onClick={() => setShowAll((v) => !v)} className="mt-1 text-xs font-bold text-brand-sage hover:underline">
              {showAll ? "Show fewer" : `Show all ${notes.length}`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
