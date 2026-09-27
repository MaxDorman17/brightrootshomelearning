"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { checkSession } from "@/lib/api";

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
  { href: "/about", label: "About" },
];

export function PublicHeader({ memberHome }: { memberHome: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Bright Roots" width={42} height={42} className="rounded-xl" />
          <div className="leading-tight">
            <p className="font-extrabold text-brand-sage">Bright Roots</p>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#6E5A46]/60">
              HOME LEARNING
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-[#6E5A46] md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-sage">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={memberHome || "/login"}
          className="shrink-0 rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark"
        >
          {memberHome ? "Open Bright Roots" : "Member login"}
        </Link>
      </div>
    </header>
  );
}

/** Header, page content and footer for public pages that don't need their own member logic. */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const memberHome = useMemberHome();
  return (
    <div className="min-h-screen bg-brand-white text-[#2E342F]">
      <PublicHeader memberHome={memberHome} />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-brand-line bg-brand-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-[#6E5A46]/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Bright Roots Home Learning</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/about" className="hover:text-brand-sage">About</Link>
          <Link href="/#demo" className="hover:text-brand-sage">Demo</Link>
          <Link href="/#pricing" className="hover:text-brand-sage">Pricing</Link>
          <Link href="/login" className="hover:text-brand-sage">Login</Link>
        </div>
      </div>
    </footer>
  );
}
