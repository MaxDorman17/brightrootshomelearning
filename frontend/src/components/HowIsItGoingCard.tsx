"use client";

import { FormEvent, useEffect, useState } from "react";
import { getReviewPrompt, sendSupportMessage } from "@/lib/api";

const SNOOZE_KEY = "review_prompt_snoozed_until";
const SNOOZE_DAYS = 30;

const input =
  "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

/**
 * Asks a family how they are finding Bright Roots, once they have used it for a couple of weeks.
 * What they write goes to the owner's Help and feedback inbox. Nothing is ever shown on the website
 * unless they tick the box, and even then only when the owner chooses to add it.
 */
export default function HowIsItGoingCard({ name }: { name: string }) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [canPublish, setCanPublish] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem(SNOOZE_KEY) || 0);
      if (until > Date.now()) return;
    } catch {}
    getReviewPrompt()
      .then((res) => setShow(!!res.data.show))
      .catch(() => {});
  }, []);

  // The name box starts with their first name, filled in at the moment they agree to share.
  const agree = (yes: boolean) => {
    setCanPublish(yes);
    if (yes && !displayName.trim()) setDisplayName(name.split(" ")[0] || "");
  };

  const snooze = () => {
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000));
    } catch {}
    setShow(false);
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) return setError("Please write a line or two first.");
    setSending(true);
    setError("");
    try {
      await sendSupportMessage({
        kind: "review",
        message: message.trim(),
        rating: rating || null,
        can_publish: canPublish,
        display_name: canPublish ? displayName.trim() || null : null,
        page: "/parent/dashboard",
      });
      setSent(true);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Could not send that. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!show) return null;

  if (sent) {
    return (
      <section className="mb-8 rounded-3xl border border-brand-line bg-brand-tint p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-brand-charcoal">Thank you ♡</h2>
        <p className="mt-1 text-sm text-[#6E5A46]">
          We read every one of these ourselves. {canPublish ? "Thank you for letting us share it." : "It stays between us."}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-8 rounded-3xl border border-brand-line bg-brand-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand-softsage">A quick question</p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-charcoal">How is it going?</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#6E5A46]">
            You have been with us a couple of weeks. What is working, and what would you change? We are a family too and
            we read every reply.
          </p>
        </div>
        <button type="button" onClick={snooze} className="shrink-0 text-xs font-bold text-[#8A7A69] hover:text-brand-charcoal">
          Not now
        </button>
      </div>

      <form onSubmit={send} className="mt-4 space-y-3">
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Stars out of five, if you like">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              onClick={() => setRating(rating === n ? 0 : n)}
              className={"text-2xl leading-none transition-colors " + (n <= rating ? "text-[#D19A32]" : "text-[#D9D1C4] hover:text-[#E6C989]")}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-xs text-[#8A7A69]">Stars are optional</span>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={5000}
          placeholder="Tell us in your own words"
          aria-label="Your thoughts"
          className={input}
        />

        <label className="flex items-start gap-2.5 text-sm text-[#4A3B2C]">
          <input type="checkbox" checked={canPublish} onChange={(e) => agree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-sage" />
          <span>
            You may share this on the Bright Roots website.
            <span className="block text-xs text-[#8A7A69]">Leave this unticked and it stays private. We never show your email or your children&apos;s names.</span>
          </span>
        </label>

        {canPublish && (
          <div className="max-w-xs">
            <label className="mb-1 block text-xs font-bold text-[#6E5A46]">Name to show with it</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Sam, mum of two"
              aria-label="Name to show with it"
              className={input}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={sending} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {sending ? "Sending..." : "Send"}
          </button>
          {error && <p className="text-sm font-semibold text-[#A64F42]">{error}</p>}
        </div>
      </form>
    </section>
  );
}
