"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe, login } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { applyTheme } from "@/lib/theme";

// Fixed colours here (not the theme variables), so the login page always looks the same
// whatever theme the last person on this device picked.
const GREEN = "#2F5D3A";
const EARTH = "#6E5A46";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(username, password);
      setAuth(res.data.role, res.data.username);
      getMe().then((me) => applyTheme(me.data.family_theme)).catch(() => {});
      if (res.data.role === "parent" && !res.data.email_verified) {
        router.push("/account");
      } else if (res.data.role === "parent" && !res.data.onboarding_completed) {
        router.push("/onboarding");
      } else if (res.data.billing_required) {
        router.push("/membership-required");
      } else {
        router.push(res.data.role === "parent" ? "/parent/dashboard" : "/child");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-xl border-2 border-[#E4DCCD] bg-white px-4 py-3 font-medium text-[#2E342F] outline-none transition-colors placeholder:text-[#B5A994] focus:border-[#6EA76E]";

  return (
    <div className="min-h-screen bg-[#FDFAF3] lg:grid lg:grid-cols-[1.15fr_1fr]">
      {/* Illustration */}
      <div className="relative h-56 overflow-hidden sm:h-72 lg:h-auto lg:min-h-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/login.jpg" alt="Children learning together in a cosy treehouse" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A26]/80 via-[#1F3A26]/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden p-10 text-white lg:block">
          <p className="text-3xl font-extrabold leading-tight drop-shadow">Less time organising.<br />More time learning together.</p>
          <p className="mt-3 max-w-md text-white/85">Plan the week, give each child their own space to learn, and keep a record of everything they achieve.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-start justify-center px-5 py-8 sm:py-12 lg:items-center lg:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-2xl border border-[#E4DCCD]" />
            <span>
              <span className="block text-xl font-extrabold" style={{ color: GREEN }}>Bright Roots</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: EARTH }}>Home Learning</span>
            </span>
          </Link>

          <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl" style={{ color: GREEN }}>Welcome back 👋</h1>
          <p className="mt-2" style={{ color: EARTH }}>Log in to your family&apos;s learning. Children use the username their grown-up made for them.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-bold text-[#2E342F]">Username</label>
              <input id="username" type="text" required autoComplete="username" autoCapitalize="none" value={username}
                onChange={(e) => setUsername(e.target.value)} placeholder="Your username" className={input} />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-bold text-[#2E342F]">Password</label>
                <Link href="/forgot-password" className="text-sm font-bold hover:underline" style={{ color: GREEN }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${input} pr-16`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-bold hover:bg-[#F3EDE2]" style={{ color: EARTH }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl py-3.5 text-base font-extrabold text-white shadow-lg shadow-green-900/15 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: GREEN }}>
              {loading ? "Logging in…" : "Log in →"}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-[#E4DCCD] bg-white p-5 text-sm" style={{ color: EARTH }}>
            <p className="font-bold text-[#2E342F]">New to Bright Roots?</p>
            <p className="mt-1">Try everything free for 7 days. No card needed.</p>
            <Link href="/signup" className="mt-3 inline-block font-extrabold hover:underline" style={{ color: GREEN }}>Start your free trial →</Link>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: EARTH }}>
            <Link href="/" className="hover:underline">← Back to the home page</Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
