import Link from "next/link";
import { serif } from "@/lib/fonts";

/*
 * The look of the login page, shared by the other pages people reach from an email or the login form
 * (forgot password, reset password, email verification), so they all feel like one place.
 * Fixed colours (not the theme variables), so these pages always look the same whatever theme the last
 * person on this device picked.
 */
export const GREEN = "#2F5D3A";
export const EARTH = "#6E5A46";

export const authInput =
  "w-full rounded-2xl border border-[#E4DCCD] bg-white/90 px-4 py-3.5 font-medium text-[#2E342F] outline-none transition-colors placeholder:text-[#B5A994] focus:border-[#6EA76E] focus:bg-white";

export const authLabel = "mb-1.5 block text-sm font-bold text-[#2E342F]";

export const authButton =
  "block w-full rounded-2xl py-3.5 text-center text-lg font-bold text-white shadow-lg shadow-green-900/20 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60";

export function AuthMessage({ kind, children }: { kind: "success" | "error"; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
        kind === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F6EEDF] px-4 py-10 [@media(max-height:820px)]:py-4">
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
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-center" style={{ color: EARTH }}>{subtitle}</p>}

          <div className="mt-7 [@media(max-height:820px)]:mt-4">{children}</div>

          {footer && (
            <div className="mt-7 border-t border-[#E4DCCD] pt-5 text-center [@media(max-height:820px)]:mt-4 [@media(max-height:820px)]:pt-3" style={{ color: EARTH }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
