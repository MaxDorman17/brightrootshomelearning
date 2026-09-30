"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { checkSession } from "@/lib/api";
import { serif } from "@/lib/fonts";

/** Where a signed-in visitor should go, or null if they aren't signed in. */
export function useMemberHome() {
  const [memberHome, setMemberHome] = useState<string | null>(null);

  useEffect(() => {
    checkSession()
      .then((res) => {
        if (res.data.role === "parent" && !res.data.email_verified_at) {
          setMemberHome("/account");
        } else if (res.data.role === "parent" && !res.data.onboarding_completed_at) {
          setMemberHome("/onboarding");
        } else {
          setMemberHome(res.data.role === "parent" ? "/parent/dashboard" : "/child");
        }
      })
      .catch(() => {});
  }, []);

  return memberHome;
}

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#demo", label: "Demo" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function PublicHeader({ memberHome }: { memberHome: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E4DCCD] bg-[#FBF6EC]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/house-mark.png" alt="" className="h-9 w-auto" />
          <span className={`${serif.className} text-xl font-semibold text-[#24452C]`}>Bright Roots</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#6E5A46] md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#2F5D3A]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={memberHome || "/login"}
            className="shrink-0 rounded-full bg-[#2F5D3A] px-5 py-2.5 text-sm font-bold text-white hover:opacity-95"
          >
            {memberHome ? "Open Bright Roots" : "Log in"}
          </Link>
          {/* On phones the page links fold into this menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="public-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DCCD] text-[#2F5D3A] md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="public-menu" className="border-t border-[#E4DCCD] px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-3 text-base font-semibold text-[#4A3B2C] hover:bg-[#E9EEE1]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

/** Header, page content and footer for public pages that don't need their own member logic. */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const memberHome = useMemberHome();
  return (
    <div className="min-h-screen bg-[#FBF6EC] text-[#2E342F]">
      <PublicHeader memberHome={memberHome} />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

const LEGAL_LINKS: [string, string][] = [
  ["/privacy", "Privacy policy"],
  ["/privacy/children", "Privacy for children"],
  ["/cookies", "Cookies"],
  ["/terms", "Terms"],
  ["/refunds", "Cancelling and refunds"],
  ["/acceptable-use", "Acceptable use"],
  ["/safeguarding", "Safeguarding"],
  ["/complaints", "Complaints"],
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[#E4DCCD] bg-[#FBF6EC]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#6E5A46] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/house-mark.png" alt="" className="h-8 w-auto" />
          <span>
            <span className={`${serif.className} block text-lg font-semibold text-[#24452C]`}>Bright Roots</span>
            <span className="block text-xs text-[#6E5A46]/70">© {new Date().getFullYear()} Bright Roots Home Learning</span>
          </span>
        </Link>
        <div className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-[#2F5D3A]">About</Link>
          <Link href="/#demo" className="hover:text-[#2F5D3A]">Demo</Link>
          <Link href="/#pricing" className="hover:text-[#2F5D3A]">Pricing</Link>
          <Link href="/contact" className="hover:text-[#2F5D3A]">Contact</Link>
          <Link href="/safeguarding" className="hover:text-[#2F5D3A]">Safeguarding</Link>
          <Link href="/login" className="hover:text-[#2F5D3A]">Login</Link>
        </div>
      </div>
      <nav
        aria-label="Policies"
        className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2 border-t border-[#E4DCCD] px-4 py-4 text-xs text-[#6E5A46]/80 sm:px-6"
      >
        {LEGAL_LINKS.map(([href, label]) => (
          <Link key={href} href={href} className="hover:text-[#2F5D3A] hover:underline">
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
