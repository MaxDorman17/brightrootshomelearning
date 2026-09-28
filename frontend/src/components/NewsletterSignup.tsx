"use client";

import { FormEvent, useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import { serif } from "@/lib/fonts";

/** Public "get tips by email" box. A confirmation email is sent before anyone is added. */
export default function NewsletterSignup({ variant = "box" }: { variant?: "box" | "strip" }) {
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

  if (variant === "strip") {
    return (
      <section className="border-t border-[#E4DCCD] bg-[#E9EEE1] py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 sm:px-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="hidden text-3xl sm:block" aria-hidden>✉️</span>
            <div>
              <p className={`${serif.className} text-xl font-semibold text-[#24452C]`}>Home learning ideas, straight to your inbox</p>
              <p className="text-sm text-[#6E5A46]">Tips, free resources and Bright Roots news. Unsubscribe any time.</p>
            </div>
          </div>
          {message ? (
            <p className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#2F5D3A]">{message}</p>
          ) : (
            <form onSubmit={submit} className="flex w-full max-w-sm items-center gap-2 rounded-full border border-[#E4DCCD] bg-white p-1.5 pl-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <button type="submit" disabled={busy} aria-label="Sign up" className="flex h-9 shrink-0 items-center justify-center rounded-full bg-[#2F5D3A] px-4 text-sm font-bold text-white disabled:opacity-60">
                {busy ? "..." : "Sign up →"}
              </button>
            </form>
          )}
        </div>
        {error && <p className="mt-2 text-center text-sm font-semibold text-[#A64F42]">{error}</p>}
      </section>
    );
  }

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
