"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { serif } from "@/lib/fonts";
import { registerParent } from "@/lib/api";
import { countEvent } from "@/components/VisitorStats";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerParent(email.trim(), username.trim(), password, newsletter);
      countEvent("signup");
      setMessage(
        res.data.message ||
          "Account created. Check your email to verify your account."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Extra room at the bottom on phones, so the button can be scrolled clear of the cookie notice.
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F6EEDF] px-4 pb-44 pt-20 sm:py-12">
      {/* The same warm room as the log-in page. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/login-bg-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[15%_50%] md:object-center" />
      <div className="absolute inset-0 bg-[#FDFAF3]/45" />

      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#FDFAF3]/90 px-4 py-2 text-sm font-bold text-[#2F5D3A] shadow-md shadow-[#6E5A46]/15 ring-1 ring-[#E4DCCD] backdrop-blur-sm transition-colors hover:bg-white sm:left-6 sm:top-6"
      >
        ← Back to home
      </Link>

      <div className="relative w-full max-w-lg">
        <div className="mb-6 text-center">
          <span className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FDFAF3] shadow-lg shadow-[#6E5A46]/15 ring-1 ring-[#E4DCCD]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/house-mark.png" alt="Bright Roots" className="h-14 w-auto" />
          </span>
          <h1 className={`${serif.className} text-4xl font-bold leading-tight text-[#2F5D3A]`}>Start your free trial</h1>
          <p className="mt-2 text-sm font-semibold text-[#4A3B2C]">
            14 days free, no card needed. Then £5.99 a month or £59 a year for the whole family.
          </p>
        </div>

        <div className="rounded-3xl bg-[#FDFAF3]/95 p-6 shadow-xl shadow-[#6E5A46]/20 ring-1 ring-[#E4DCCD] backdrop-blur-sm sm:p-8">
          {message ? (
            <div>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm font-semibold text-green-800">
                {message}
              </div>
              <p className="mt-4 text-sm text-[#6E5A46]">
                Once your email is verified, sign in and Bright Roots will guide you through adding your first child and timetable.
              </p>
              <Link
                href="/login"
                className="mt-6 block rounded-xl bg-brand-sage px-5 py-3 text-center text-sm font-extrabold text-white"
              >
                Go to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">
                  Parent email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E4DCCD] bg-white px-4 py-3 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">
                  Your name
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={50}
                  autoComplete="given-name"
                  placeholder="What should we call you?"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-[#E4DCCD] bg-white px-4 py-3 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E4DCCD] bg-white px-4 py-3 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#2E342F]">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E4DCCD] bg-white px-4 py-3 font-medium outline-none focus:border-[#6EA76E]"
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-[#6E5A46]">
                <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5 accent-brand-sage" />
                Send me the Bright Roots newsletter with home learning tips and news. You can unsubscribe any time.
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-sage py-3 text-sm font-extrabold text-white disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Start 14-day free trial"}
              </button>

              <p className="text-center text-xs text-[#6E5A46]">
                No card is taken at this step. By creating an account you agree to our{" "}
                <Link href="/terms" className="underline hover:text-brand-sage">terms</Link> and{" "}
                <Link href="/privacy" className="underline hover:text-brand-sage">privacy policy</Link>.
              </p>
            </form>
          )}

          <div className="mt-6 border-t border-[#E4DCCD] pt-5 text-center text-sm text-[#6E5A46]">
            Already a member?{" "}
            <Link href="/login" className="font-extrabold text-brand-sage hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
