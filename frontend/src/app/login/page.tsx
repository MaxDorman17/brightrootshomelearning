"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkSession, demoLogin, getDemoFamily, getMe, login, type DemoFamily } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import { applyTheme } from "@/lib/theme";
import { applyDisplay } from "@/lib/display";
import { serif } from "@/lib/fonts";


// Fixed colours here (not the theme variables), so the login page always looks the same
// whatever theme the last person on this device picked.
const GREEN = "#2F5D3A";
const EARTH = "#6E5A46";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState<DemoFamily | null>(null);

  // A child who is already logged in and wanders onto a parent page gets sent here. Take them back to their
  // own Today page rather than asking them to log in again.
  useEffect(() => {
    checkSession()
      .then((res) => {
        // Someone trying the demo comes back here to try it as someone else.
        if (res.data.role === "child" && !res.data.is_demo) {
          setAuth(res.data.role, res.data.username);
          router.replace("/child");
        }
      })
      .catch(() => {});
    getDemoFamily()
      .then((res) => {
        setDemo(res.data.enabled ? res.data : null);
        // A shared link to /login#demo goes straight to the demo buttons.
        if (res.data.enabled && window.location.hash === "#demo") {
          setTimeout(() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logIn(() => login(username, password));
  };

  const logIn = async (send: () => Promise<{ data: any }>) => {
    setError("");
    setLoading(true);
    try {
      const res = await send();
      setAuth(res.data.role, res.data.username);
      getMe()
        .then((me) => {
          applyTheme(me.data.family_theme);
          applyDisplay(me.data.display); // this person's text size and font
        })
        .catch(() => {});
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
    "w-full rounded-2xl border border-[#E4DCCD] bg-white/90 py-3.5 pl-12 pr-4 font-medium text-[#2E342F] outline-none transition-colors placeholder:text-[#B5A994] focus:border-[#6EA76E] focus:bg-white";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F6EEDF] px-4 py-10 [@media(max-height:820px)]:py-4">
      {/* Background: a warm, sunlit room. Swap /hero/login-bg-2.jpg for a new picture any time. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/login-bg-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[15%_50%] md:object-center" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253,250,243,0.55)_0%,rgba(253,250,243,0.15)_55%,rgba(253,250,243,0)_80%)]" />

      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#FDFAF3]/90 px-4 py-2 text-sm font-bold shadow-md shadow-[#6E5A46]/15 ring-1 ring-[#E4DCCD] backdrop-blur-sm transition-colors hover:bg-white sm:left-6 sm:top-6"
        style={{ color: GREEN }}
      >
        ← Back to home
      </Link>

      <div className="relative w-full max-w-[26rem] pt-10 sm:pt-0">
        <Link href="/" className="flex flex-col items-center text-center [@media(max-height:820px)]:flex-row [@media(max-height:820px)]:justify-center [@media(max-height:820px)]:gap-3 [@media(max-height:820px)]:text-left">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] [@media(max-height:820px)]:h-14 [@media(max-height:820px)]:w-14 [@media(max-height:820px)]:rounded-2xl bg-[#FDFAF3] shadow-lg shadow-[#6E5A46]/15 ring-1 ring-[#E4DCCD]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/house-mark.png" alt="" className="h-[4.5rem] w-auto [@media(max-height:820px)]:h-10" />
          </span>
          <span className="flex flex-col items-center [@media(max-height:820px)]:items-start">
            <span className={`${serif.className} mt-4 text-5xl font-bold leading-none tracking-tight [@media(max-height:820px)]:mt-0 [@media(max-height:820px)]:text-3xl`} style={{ color: GREEN }}>
              Bright Roots
            </span>
            <span className="mt-2 text-sm font-bold uppercase tracking-[0.3em] [@media(max-height:820px)]:mt-1 [@media(max-height:820px)]:text-[11px]" style={{ color: GREEN }}>
              Home Learning
            </span>
          </span>
        </Link>

        <div className="mt-8 rounded-[2rem] border border-white/70 bg-[#FDFAF3]/90 p-7 shadow-2xl shadow-[#6E5A46]/20 backdrop-blur-md sm:p-9 [@media(max-height:820px)]:mt-4 [@media(max-height:820px)]:p-6 sm:[@media(max-height:820px)]:p-6">
          <h1 className={`${serif.className} text-center text-4xl font-bold [@media(max-height:820px)]:text-3xl`} style={{ color: "#1F3A26" }}>
            Welcome back
          </h1>
          <p className="mt-1 text-center" style={{ color: EARTH }}>Log in to your family space</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5 [@media(max-height:820px)]:mt-4 [@media(max-height:820px)]:space-y-3">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-bold text-[#2E342F]">Email or login name</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7B66]"><UserIcon /></span>
                <input id="username" type="text" required autoComplete="username" autoCapitalize="none" value={username}
                  onChange={(e) => setUsername(e.target.value)} placeholder="Your email or login name" className={input} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-[#2E342F]">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7B66]"><LockIcon /></span>
                <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className={`${input} pr-16`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-bold hover:bg-[#F3EDE2]" style={{ color: EARTH }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm font-bold hover:underline" style={{ color: GREEN }}>Forgot password?</Link>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-2xl py-3.5 text-lg font-bold text-white shadow-lg shadow-green-900/20 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: GREEN }}>
              {loading ? "Logging in…" : "Log in →"}
            </button>
          </form>

          <div className="mt-7 border-t border-[#E4DCCD] pt-5 text-center [@media(max-height:820px)]:mt-4 [@media(max-height:820px)]:pt-3" style={{ color: EARTH }}>
            New to Bright Roots?{" "}
            <Link href="/signup" className="font-bold underline underline-offset-2" style={{ color: GREEN }}>Create an account</Link>
          </div>
        </div>

        {demo && (
          <div id="demo" className="mt-5 rounded-[1.5rem] border border-white/70 bg-[#FDFAF3]/90 p-5 text-center shadow-xl shadow-[#6E5A46]/15 backdrop-blur-md [@media(max-height:820px)]:mt-3 [@media(max-height:820px)]:p-4">
            <p className="font-bold text-[#1F3A26]">Just looking? Try our demo family</p>
            <p className="mt-0.5 text-sm" style={{ color: EARTH }}>No sign-up needed. Have a click around; it&apos;s all made up.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button type="button" disabled={loading} onClick={() => logIn(() => demoLogin())}
                className="rounded-full px-4 py-2 text-sm font-bold text-white disabled:opacity-60" style={{ background: GREEN }}>
                As {demo.parent_name || "the grown-up"}, the grown-up
              </button>
              {demo.children.map((child) => (
                <button key={child.id} type="button" disabled={loading} onClick={() => logIn(() => demoLogin(child.id))}
                  className="rounded-full border-2 bg-white px-4 py-2 text-sm font-bold disabled:opacity-60" style={{ borderColor: GREEN, color: GREEN }}>
                  As {child.name}{child.age ? `, ${child.age}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-center [@media(max-height:820px)]:mt-3">
          <span className="inline-block rounded-full bg-[#FDFAF3]/85 px-3 py-1 text-xs font-semibold backdrop-blur-sm" style={{ color: EARTH }}>
            Children log in with the login name their grown-up made for them.
          </span>
        </p>
      </div>
    </div>
  );
}
