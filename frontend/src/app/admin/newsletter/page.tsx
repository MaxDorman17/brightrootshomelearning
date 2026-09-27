"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getNewsletterAdmin, previewNewsletter, sendNewsletter, testNewsletter } from "@/lib/api";

type Overview = {
  email_enabled: boolean;
  counts: { subscribed: number; members: number; visitors: number; pending: number; unsubscribed: number };
  newsletters: { id: number; subject: string; status: string; recipients: number; sent_count: number; created_at: string | null }[];
};

const DRAFT_KEY = "newsletter_draft";
const input = "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

export default function NewsletterAdminPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [denied, setDenied] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getNewsletterAdmin();
      setData(res.data);
    } catch {
      setDenied(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    load();
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved) {
        setSubject(saved.subject || "");
        setBody(saved.body || "");
      }
    } catch {}
  }, [load, router]);

  // Keep the draft safe if the page is closed.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ subject, body }));
    } catch {}
  }, [subject, body]);

  // Refresh while a newsletter is sending so the count updates.
  useEffect(() => {
    if (!data?.newsletters.some((n) => n.status === "sending")) return;
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [data, load]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
    } catch (err) {
      setError(errorText(err, "Something went wrong."));
    } finally {
      setBusy(false);
    }
  };

  const preview = () =>
    run(async () => {
      const res = await previewNewsletter(subject, body);
      setPreviewHtml(res.data.html);
    });

  const test = () =>
    run(async () => {
      const res = await testNewsletter(subject, body);
      setMessage(res.data.message);
    });

  const send = () =>
    run(async () => {
      const n = data?.counts.subscribed ?? 0;
      if (!confirm(`Send "${subject}" to ${n} subscriber${n === 1 ? "" : "s"} now? This can't be undone.`)) return;
      const res = await sendNewsletter(subject, body);
      setMessage(`Sending to ${res.data.recipients} subscribers. You can leave this page.`);
      setSubject("");
      setBody("");
      setPreviewHtml("");
      load();
    });

  if (denied) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-[#6E5A46]">This page is only for the owner of Bright Roots.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Owner</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Newsletter</h1>

        {data && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [data.counts.subscribed, "Subscribers"],
              [data.counts.members, "Members"],
              [data.counts.visitors, "Website visitors"],
              [data.counts.pending, "Awaiting confirmation"],
            ].map(([value, label]) => (
              <div key={label as string} className="brand-card p-4">
                <p className="text-2xl font-black text-brand-sage">{value}</p>
                <p className="text-xs font-bold text-[#6E5A46]">{label}</p>
              </div>
            ))}
          </div>
        )}

        {data && !data.email_enabled && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Email isn&apos;t set up on the server, so newsletters can&apos;t be sent yet.
          </div>
        )}

        <section className="brand-card mt-6 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-brand-charcoal">Write a newsletter</h2>
          <div className="mt-4 space-y-3">
            <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} placeholder="Subject, e.g. New: rewards and learning moments" className={input} />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              placeholder={"# A heading\n\nWrite a paragraph here. Use **bold**, *italic* and [a link](https://brightrootshomelearning.co.uk).\n\n- A bullet point\n- Another one"}
              className={input + " font-mono"}
            />
            <p className="text-xs text-[#6E5A46]">
              Formatting: <code># Heading</code>, <code>## Smaller heading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>- bullet</code>,{" "}
              <code>[link text](https://...)</code>. A blank line starts a new paragraph. An unsubscribe link is added automatically.
            </p>
          </div>
          {error && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{error}</p>}
          {message && <p className="mt-3 text-sm font-semibold text-brand-sage">{message}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={preview} disabled={busy || !subject.trim() || !body.trim()} className="rounded-xl border border-brand-line bg-white px-4 py-2.5 text-sm font-bold text-brand-sage disabled:opacity-40">
              Preview
            </button>
            <button onClick={test} disabled={busy || !subject.trim() || !body.trim() || !data?.email_enabled} className="rounded-xl border border-brand-line bg-white px-4 py-2.5 text-sm font-bold text-brand-sage disabled:opacity-40">
              Send me a test
            </button>
            <button
              onClick={send}
              disabled={busy || !subject.trim() || !body.trim() || !data?.email_enabled || !data?.counts.subscribed}
              className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              Send to {data?.counts.subscribed ?? 0} subscriber{data?.counts.subscribed === 1 ? "" : "s"}
            </button>
          </div>
        </section>

        {previewHtml && (
          <section className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-softsage">Preview</p>
            <iframe title="Newsletter preview" srcDoc={previewHtml} sandbox="" className="h-[32rem] w-full rounded-2xl border border-brand-line bg-white" />
          </section>
        )}

        {data && data.newsletters.length > 0 && (
          <section className="brand-card mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-brand-charcoal">Sent newsletters</h2>
            <div className="mt-2 divide-y divide-brand-line">
              {data.newsletters.map((n) => (
                <div key={n.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <span className="font-bold text-brand-charcoal">{n.subject}</span>
                  <span className="text-[#6E5A46]">
                    {n.created_at ? format(parseISO(n.created_at), "d MMM yyyy, HH:mm") : ""} ·{" "}
                    {n.status === "sending" ? `sending ${n.sent_count}/${n.recipients}...` : `sent to ${n.sent_count} of ${n.recipients}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
