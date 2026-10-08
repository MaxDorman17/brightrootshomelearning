"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { checkSession } from "@/lib/api";
import { serif } from "@/lib/fonts";
import { FACEBOOK_URL } from "@/lib/site";

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
  { href: "/guides", label: "Guides" },
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

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
    </svg>
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
          <Link href="/guides" className="hover:text-[#2F5D3A]">Guides</Link>
          <Link href="/#demo" className="hover:text-[#2F5D3A]">Demo</Link>
          <Link href="/#pricing" className="hover:text-[#2F5D3A]">Pricing</Link>
          <Link href="/contact" className="hover:text-[#2F5D3A]">Contact</Link>
          <Link href="/safeguarding" className="hover:text-[#2F5D3A]">Safeguarding</Link>
          <Link href="/login" className="hover:text-[#2F5D3A]">Login</Link>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bright Roots on Facebook (opens in a new tab)"
            className="flex items-center gap-1.5 hover:text-[#2F5D3A]"
          >
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </a>
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
