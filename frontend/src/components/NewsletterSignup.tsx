"use client";

import { FormEvent, useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

/** Public "get tips by email" box. A confirmation email is sent before anyone is added. */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await subscribeNewsletter(email.trim());
      setMessage(res.data.message);
      setEmail("");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Please enter a valid email address.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-brand-tint py-14">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-black text-brand-charcoal sm:text-3xl">Get home learning tips by email</h2>
        <p className="mt-2 text-[#6E5A46]">Ideas, free resources and Bright Roots news. No spam, and you can unsubscribe any time.</p>
        {message ? (
          <p className="mt-6 rounded-xl bg-white px-4 py-3 font-bold text-brand-sage">{message}</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm outline-none focus:border-brand-softsage"
            />
            <button type="submit" disabled={busy} className="rounded-xl bg-brand-sage px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60">
              {busy ? "Signing up..." : "Sign me up"}
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-sm font-semibold text-[#A64F42]">{error}</p>}
      </div>
    </section>
  );
}
