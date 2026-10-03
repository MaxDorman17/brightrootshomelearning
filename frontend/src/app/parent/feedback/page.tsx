"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { deleteSupportMessage, getMe, getSupportMessages, sendSupportMessage, SupportMessage } from "@/lib/api";
import { getRole, getUsername, isAuthenticated } from "@/lib/auth";
import { SUPPORT_EMAIL } from "@/lib/site";

const KINDS: { value: string; label: string; hint: string; placeholder: string }[] = [
  { value: "problem", label: "Something isn't working", hint: "Tell us what you were doing and what happened.", placeholder: "e.g. When I press Add lesson on Tuesday, nothing happens." },
  { value: "question", label: "I have a question", hint: "Ask us anything about using Bright Roots.", placeholder: "e.g. How do I move a whole week of lessons?" },
  { value: "suggestion", label: "I have a suggestion", hint: "Something you'd like added or changed.", placeholder: "e.g. It would help if I could copy last week's plan." },
  { value: "review", label: "Leave a review", hint: "Tell us how Bright Roots is working for your family.", placeholder: "e.g. It has saved me hours each week and my son loves ticking off his lessons." },
];
const KIND_LABEL: Record<string, string> = { problem: "Problem", question: "Question", suggestion: "Suggestion", review: "Review" };
const input = "w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1" role={onChange ? "radiogroup" : undefined} aria-label="Stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          aria-pressed={value === n}
          className={(onChange ? "text-3xl " : "text-base ") + (n <= value ? "text-[#E3A72F]" : "text-[#D9D1C4]")}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/** Help and feedback: a parent sends the owner a problem, a question, a suggestion or a review. */
export default function FeedbackPage() {
  const router = useRouter();
  const [kind, setKind] = useState("problem");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [canPublish, setCanPublish] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [inbox, setInbox] = useState<SupportMessage[] | null>(null);

  const loadInbox = useCallback(() => getSupportMessages().then((res) => setInbox(res.data)).catch(() => setInbox(null)), []);

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }
    setDisplayName(getUsername() || "");
    // The owner also sees what families have sent.
    getMe().then((res) => res.data.is_admin && loadInbox()).catch(() => {});
  }, [router, loadInbox]);

  const chosen = KINDS.find((k) => k.value === kind) ?? KINDS[0];
  const isReview = kind === "review";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (isReview && !rating) return setError("Choose how many stars.");
    setSending(true);
    setError("");
    try {
      await sendSupportMessage({
        kind,
        message: message.trim(),
        rating: isReview ? rating : null,
        can_publish: isReview && canPublish,
        display_name: isReview && canPublish ? displayName.trim() : null,
        page: document.referrer ? new URL(document.referrer).pathname : null,
      });
      setSent(isReview ? "Thank you for your review. It means a lot." : "Thank you, your message has been sent. We'll reply by email.");
      setMessage("");
      setRating(0);
      setCanPublish(false);
      if (inbox) loadInbox();
    } catch (err) {
      setError(errorText(err, "Could not send your message. Please try again, or email us."));
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await deleteSupportMessage(id);
    loadInbox();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <PageHero art="review" tint={0}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">We&apos;re here to help</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Help and feedback</h1>
          <p className="mt-2 text-sm text-[#6E5A46] sm:text-base">
            Tell us about a problem, ask a question, share an idea or leave a review. A real person reads every message.
          </p>
        </PageHero>

        <form onSubmit={submit} className="brand-card p-5 sm:p-6">
          <p className="text-sm font-bold text-brand-charcoal">What would you like to do?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => {
                  setKind(k.value);
                  setSent("");
                  setError("");
                }}
                aria-pressed={kind === k.value}
                className={
                  "rounded-xl border-2 px-4 py-3 text-left text-sm font-bold " +
                  (kind === k.value ? "border-brand-sage bg-brand-tint text-brand-sage" : "border-brand-line bg-white text-brand-charcoal hover:border-brand-softsage")
                }
              >
                {k.label}
              </button>
            ))}
          </div>

          {isReview && (
            <div className="mt-5">
              <p className="mb-1 text-sm font-bold text-brand-charcoal">How many stars?</p>
              <Stars value={rating} onChange={(n) => { setRating(n); setError(""); }} />
            </div>
          )}

          <label className="mt-5 block text-sm font-bold text-brand-charcoal">
            {isReview ? "Your review" : "Your message"}
            <span className="mt-0.5 block font-normal text-[#6E5A46]">{chosen.hint}</span>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSent("");
              }}
              required
              minLength={5}
              maxLength={5000}
              rows={6}
              placeholder={chosen.placeholder}
              className={input + " mt-2"}
            />
          </label>

          {isReview && (
            <div className="mt-4 rounded-xl bg-brand-cream/70 p-4">
              <label className="flex items-start gap-2 text-sm text-brand-charcoal">
                <input type="checkbox" checked={canPublish} onChange={(e) => setCanPublish(e.target.checked)} className="mt-0.5 accent-brand-sage" />
                <span>You may show my review on the Bright Roots website. Leave this unticked to keep it private.</span>
              </label>
              {canPublish && (
                <label className="mt-3 block text-sm font-bold text-brand-charcoal">
                  Name to show with it
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} placeholder="e.g. Sam, home-educating mum of two" className={input + " mt-1.5"} />
                </label>
              )}
            </div>
          )}

          {error && <p className="mt-4 text-sm font-semibold text-[#A64F42]">{error}</p>}
          {sent && <p className="mt-4 rounded-xl border border-brand-mist bg-brand-wash px-4 py-3 text-sm font-semibold text-brand-sage">{sent}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={sending || message.trim().length < 5} className="rounded-xl bg-brand-sage px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark disabled:opacity-50">
              {sending ? "Sending..." : isReview ? "Send my review" : "Send message"}
            </button>
            <p className="text-xs text-[#6E5A46]">
              We reply to the email address on your account. Looking for how to do something? Try the{" "}
              <Link href="/parent/help" className="font-bold text-brand-sage underline">how-to guides</Link>.
            </p>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-[#6E5A46]">
          Prefer email? Write to <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand-sage underline">{SUPPORT_EMAIL}</a>.
        </p>

        {inbox && (
          <section className="brand-card mt-8 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Owner only</p>
            <h2 className="mt-1 text-lg font-extrabold text-brand-charcoal">Messages from families ({inbox.length})</h2>
            {inbox.length === 0 ? (
              <p className="mt-3 text-sm text-[#6E5A46]">Nothing yet.</p>
            ) : (
              <div className="mt-2 divide-y divide-brand-line">
                {inbox.map((m) => (
                  <div key={m.id} className="py-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex flex-wrap items-center gap-2 font-bold text-brand-charcoal">
                        <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-xs text-brand-sage">{KIND_LABEL[m.kind] ?? m.kind}</span>
                        {m.from_name}
                        {m.from_email && (
                          <a href={`mailto:${m.from_email}`} className="font-normal text-brand-sage underline">{m.from_email}</a>
                        )}
                      </span>
                      <span className="text-xs text-[#6E5A46]">
                        {m.created_at ? format(parseISO(m.created_at), "d MMM yyyy, HH:mm") : ""}
                        <button onClick={() => remove(m.id)} className="ml-3 font-bold text-[#A64F42] hover:underline">Delete</button>
                      </span>
                    </div>
                    {m.rating ? <div className="mt-1"><Stars value={m.rating} /></div> : null}
                    <p className="mt-1 whitespace-pre-line text-brand-charcoal">{m.message}</p>
                    <p className="mt-1 text-xs text-[#6E5A46]">
                      {m.kind === "review" && (m.can_publish ? `May be shown on the website as "${m.display_name || m.from_name}". ` : "Private review, not for the website. ")}
                      {m.page ? `Sent from ${m.page}. ` : ""}
                      {!m.emailed && <span className="font-bold text-[#A64F42]">Not emailed to you.</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
