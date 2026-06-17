"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { clearAuth, getUsername, getRole } from "@/lib/auth";
import { getUnreadFeedbackCount, getSubmissionCount } from "@/lib/api";

const PARENT_MAIN = [
  { href: "/parent/dashboard", label: "Dashboard" },
  { href: "/parent", label: "Planner" },
  { href: "/units", label: "Units" },
  { href: "/parent/extra-work", label: "Extra Work" },
  { href: "/reading-log", label: "Reading" },
  { href: "/coding", label: "Coding" },
];
const PARENT_MORE = [
  { href: "/parent/report", label: "Report" },
  { href: "/parent/progress", label: "Progress" },
  { href: "/achievements", label: "Achievements" },
  { href: "/parent/journal", label: "Journal" },
  { href: "/parent/children", label: "Children" },
  { href: "/parent/timetable", label: "Timetable" },
];

const CHILD_MAIN = [
  { href: "/child", label: "Today" },
  { href: "/units", label: "Units" },
  { href: "/child/extra-work", label: "Extra Work" },
  { href: "/reading-log", label: "Reading" },
  { href: "/coding", label: "Coding" },
];
const CHILD_MORE = [
  { href: "/achievements", label: "Achievements" },
  { href: "/child/progress", label: "My Progress" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsername(getUsername() || "");
    const r = getRole() || "";
    setRole(r);
    if (r === "child") {
      getUnreadFeedbackCount().then(res => setUnreadCount(res.data.count)).catch(() => {});
    }
    if (r === "parent") {
      getSubmissionCount().then(res => setSubmissionCount(res.data.count)).catch(() => {});
    }
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { clearAuth(); router.push("/login"); };

  const mainLinks = role === "parent" ? PARENT_MAIN : role === "child" ? CHILD_MAIN : [];
  const moreLinks = role === "parent" ? PARENT_MORE : role === "child" ? CHILD_MORE : [];
  const allLinks = [...mainLinks, ...moreLinks];
  const home = role === "parent" ? "/parent/dashboard" : "/child";
  const moreActive = moreLinks.some(l => pathname === l.href);

  const avatarColor = role === "parent"
    ? "bg-yellow-300 text-yellow-900"
    : "bg-green-300 text-green-900";

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-[#A8C67A]/40 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-1 min-w-0">
            <Link href={home} className="flex items-center gap-2 font-extrabold text-lg shrink-0 mr-2 text-[#2F5D3A]">
              <Image src="/logo.png" alt="Bright Roots" width={36} height={36} className="rounded-lg" />
              <span className="hidden sm:block">Bright Roots</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {mainLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive(link.href)
                      ? "bg-[#2F5D3A] text-white shadow-sm"
                      : "text-[#2F5D3A]/70 hover:bg-[#A8C67A]/20 hover:text-[#2F5D3A]"
                  }`}>
                  {link.label}
                  {link.href === "/child" && unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              ))}
              {/* More dropdown */}
              {moreLinks.length > 0 && (
                <div ref={moreRef} className="relative">
                  <button
                    onClick={() => setMoreOpen(v => !v)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 relative ${
                      moreActive || moreOpen
                        ? "bg-[#2F5D3A] text-white shadow-sm"
                        : "text-[#2F5D3A]/70 hover:bg-[#A8C67A]/20 hover:text-[#2F5D3A]"
                    }`}>
                    More
                    {submissionCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                        {submissionCount > 9 ? "9+" : submissionCount}
                      </span>
                    )}
                    <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {moreOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-[#A8C67A]/30 overflow-hidden z-50">
                      {moreLinks.map(link => (
                        <Link key={link.href} href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                            isActive(link.href)
                              ? "bg-[#A8C67A]/20 text-[#2F5D3A]"
                              : "text-gray-700 hover:bg-[#F7F9F7]"
                          }`}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: avatar + logout */}
          <div className="flex items-center gap-2">
            {username && (
              <div className="flex items-center gap-2 bg-[#F7F9F7] rounded-full pl-1 pr-3 py-1 border border-[#A8C67A]/30">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}>
                  {username[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-[#2F5D3A] font-semibold hidden sm:block">{username}</span>
              </div>
            )}
            <button onClick={handleLogout}
              className="text-[#2F5D3A]/60 hover:text-[#2F5D3A] text-sm px-3 py-1.5 rounded-lg hover:bg-[#A8C67A]/20 transition-all font-semibold">
              Log out
            </button>
            <button onClick={() => setMenuOpen(v => !v)}
              className="md:hidden text-[#2F5D3A] p-1.5 rounded-lg hover:bg-[#A8C67A]/20 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-[#A8C67A]/30 pt-2 space-y-0.5">
            {allLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                  isActive(link.href)
                    ? "bg-[#2F5D3A] text-white"
                    : "text-[#2F5D3A]/70 hover:bg-[#A8C67A]/20 hover:text-[#2F5D3A]"
                }`}>
                {link.label}
                {link.href === "/child" && unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
