"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clearAuth, getUsername, getRole } from "@/lib/auth";
import { getUnreadFeedbackCount } from "@/lib/api";

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
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsername(getUsername() || "");
    const r = getRole() || "";
    setRole(r);
    if (r === "child") {
      getUnreadFeedbackCount().then(res => setUnreadCount(res.data.count)).catch(() => {});
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
    <nav className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-1 min-w-0">
            <Link href={home} className="flex items-center gap-2 text-white font-extrabold text-lg shrink-0 mr-2">
              <span className="text-2xl">🏫</span>
              <span className="hidden sm:block">Homeschool</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {mainLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive(link.href)
                      ? "bg-white/25 text-white shadow-inner"
                      : "text-white/70 hover:bg-white/15 hover:text-white"
                  }`}>
                  {link.label}
                  {/* Notification dot on "Today" for child when there's unread feedback */}
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
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${
                      moreActive || moreOpen
                        ? "bg-white/25 text-white shadow-inner"
                        : "text-white/70 hover:bg-white/15 hover:text-white"
                    }`}>
                    More
                    <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {moreOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {moreLinks.map(link => (
                        <Link key={link.href} href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                            isActive(link.href)
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-700 hover:bg-gray-50"
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
              <div className="flex items-center gap-2 bg-white/15 rounded-full pl-1 pr-3 py-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}>
                  {username[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-white font-semibold hidden sm:block">{username}</span>
              </div>
            )}
            <button onClick={handleLogout}
              className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/15 transition-all font-semibold">
              Log out
            </button>
            <button onClick={() => setMenuOpen(v => !v)}
              className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/15 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown — all links flat */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-white/20 pt-2 space-y-0.5">
            {allLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                  isActive(link.href)
                    ? "bg-white/25 text-white"
                    : "text-white/75 hover:bg-white/15 hover:text-white"
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
