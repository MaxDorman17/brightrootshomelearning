"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  clearAuth,
  getRole,
  getUsername,
} from "@/lib/auth";
import {
  getPendingFeedback,
  getUnreadFeedbackCount,
  logout,
} from "@/lib/api";

interface PendingItem {
  entry_id: number;
  title: string;
  subject: string;
  date: string;
  child: string | null;
}

const PARENT_MAIN = [
  { href: "/parent/dashboard", label: "Home" },
  { href: "/parent", label: "Planner" },
  { href: "/parent/report", label: "Reports" },
  { href: "/parent/children", label: "Children" },
];

const PARENT_LEARNING = [
  { href: "/units", label: "Oak Units" },
  { href: "/reading-log", label: "Reading" },
  { href: "/spellings", label: "Spellings" },
  { href: "/coding", label: "Coding" },
  { href: "/polish", label: "Languages" },
  { href: "/parent/extra-work", label: "Extra Work" },
];

const PARENT_MORE = [
  { href: "/parent/progress", label: "Review & Feedback" },
  { href: "/parent/journal", label: "Journal" },
  { href: "/parent/timetable", label: "Timetable" },
  { href: "/achievements", label: "Achievements" },
  { href: "/parent/print", label: "Print Week" },
];

const CHILD_MAIN = [
  { href: "/child", label: "Today" },
  { href: "/units", label: "Learning" },
  { href: "/child/progress", label: "Progress" },
];

const CHILD_MORE = [
  { href: "/reading-log", label: "Reading" },
  { href: "/spellings", label: "Spellings" },
  { href: "/coding", label: "Coding" },
  { href: "/polish", label: "Languages" },
  { href: "/child/extra-work", label: "Extra Work" },
  { href: "/achievements", label: "Achievements" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [pending, setPending] = useState<PendingItem[]>([]);

  const learningRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsername(getUsername() || "");
    const r = getRole() || "";
    setRole(r);

    if (r === "child") {
      getUnreadFeedbackCount()
        .then((res) => setUnreadCount(res.data.count))
        .catch(() => {});
    }

    if (r === "parent") {
      getPendingFeedback()
        .then((res) => setPending(res.data))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        learningRef.current &&
        !learningRef.current.contains(target)
      ) {
        setLearningOpen(false);
      }

      if (
        moreRef.current &&
        !moreRef.current.contains(target)
      ) {
        setMoreOpen(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(target)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  const openPendingEntry = (item: PendingItem) => {
    setNotifOpen(false);
    router.push(
      `/parent/progress?filter=submitted&entry=${item.entry_id}`
    );
  };

  const home =
    role === "parent"
      ? "/parent/dashboard"
      : "/child";

  const isActive = (href: string) =>
    pathname === href;

  const parentLearningActive =
    PARENT_LEARNING.some((item) =>
      pathname === item.href
    );

  const parentMoreActive =
    PARENT_MORE.some((item) =>
      pathname === item.href
    );

  const childMoreActive =
    CHILD_MORE.some((item) =>
      pathname === item.href
    );

  const mobileLinks =
    role === "parent"
      ? [
          ...PARENT_MAIN,
          ...PARENT_LEARNING,
          ...PARENT_MORE,
        ]
      : [
          ...CHILD_MAIN,
          ...CHILD_MORE,
        ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-brand-softsage/20 bg-brand-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">

            <div className="flex min-w-0 items-center gap-5">
              <Link
                href={home}
                className="flex shrink-0 items-center gap-2"
              >
                <Image
                  src="/logo.png"
                  alt="Bright Roots"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />

                <div className="hidden sm:block leading-tight">
                  <p className="font-extrabold text-brand-sage">
                    Bright Roots
                  </p>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-brand-earth/60">
                    LEARN · GROW · BELONG
                  </p>
                </div>
              </Link>

              <div className="hidden items-center gap-1 md:flex">

                {role === "parent" &&
                  PARENT_MAIN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        isActive(item.href)
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                {role === "parent" && (
                  <div
                    ref={learningRef}
                    className="relative"
                  >
                    <button
                      onClick={() =>
                        setLearningOpen(
                          (value) => !value
                        )
                      }
                      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        parentLearningActive ||
                        learningOpen
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      Learning
                    </button>

                    {learningOpen && (
                      <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-brand-softsage/20 bg-brand-white shadow-lg">
                        {PARENT_LEARNING.map(
                          (item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() =>
                                setLearningOpen(false)
                              }
                              className="block px-4 py-3 text-sm font-semibold text-brand-charcoal hover:bg-brand-cream"
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {role === "parent" && (
                  <div
                    ref={moreRef}
                    className="relative"
                  >
                    <button
                      onClick={() =>
                        setMoreOpen(
                          (value) => !value
                        )
                      }
                      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        parentMoreActive ||
                        moreOpen
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      More
                    </button>

                    {moreOpen && (
                      <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-brand-softsage/20 bg-brand-white shadow-lg">
                        {PARENT_MORE.map(
                          (item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() =>
                                setMoreOpen(false)
                              }
                              className="block px-4 py-3 text-sm font-semibold text-brand-charcoal hover:bg-brand-cream"
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {role === "child" &&
                  CHILD_MAIN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        isActive(item.href)
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      {item.label}

                      {item.href === "/child" &&
                        unreadCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-terracotta px-1 text-[9px] font-extrabold text-white">
                            {unreadCount > 9
                              ? "9+"
                              : unreadCount}
                          </span>
                        )}
                    </Link>
                  ))}

                {role === "child" && (
                  <div
                    ref={moreRef}
                    className="relative"
                  >
                    <button
                      onClick={() =>
                        setMoreOpen(
                          (value) => !value
                        )
                      }
                      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        childMoreActive ||
                        moreOpen
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      More
                    </button>

                    {moreOpen && (
                      <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-brand-softsage/20 bg-brand-white shadow-lg">
                        {CHILD_MORE.map(
                          (item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() =>
                                setMoreOpen(false)
                              }
                              className="block px-4 py-3 text-sm font-semibold text-brand-charcoal hover:bg-brand-cream"
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            <div className="flex items-center gap-2">

              {role === "parent" && (
                <div
                  ref={notifRef}
                  className="relative"
                >
                  <button
                    onClick={() =>
                      setNotifOpen(
                        (value) => !value
                      )
                    }
                    className="relative rounded-xl p-2 text-brand-sage transition-colors hover:bg-brand-softsage/15"
                    title="Work waiting for feedback"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>

                    {pending.length > 0 && (
                      <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-terracotta px-1 text-[9px] font-extrabold text-white">
                        {pending.length > 9
                          ? "9+"
                          : pending.length}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-brand-softsage/20 bg-brand-white shadow-lg">
                      <div className="border-b border-brand-softsage/15 px-4 py-3">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-brand-earth/70">
                          Waiting for feedback
                        </p>
                      </div>

                      {pending.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-brand-earth/60">
                          Nothing waiting for review.
                        </p>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {pending
                            .slice(0, 10)
                            .map((item) => (
                              <button
                                key={
                                  item.entry_id
                                }
                                onClick={() =>
                                  openPendingEntry(
                                    item
                                  )
                                }
                                className="w-full border-b border-brand-softsage/10 px-4 py-3 text-left transition-colors hover:bg-brand-cream"
                              >
                                <p className="truncate text-sm font-bold text-brand-charcoal">
                                  {item.title}
                                </p>

                                <p className="mt-0.5 text-xs text-brand-earth/60">
                                  {item.subject}
                                  {item.child
                                    ? ` · ${item.child}`
                                    : ""}
                                  {` · ${item.date}`}
                                </p>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {username && (
                <div className="hidden items-center gap-2 rounded-full bg-brand-cream px-2 py-1 sm:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-xs font-extrabold text-brand-charcoal">
                    {username[0]?.toUpperCase()}
                  </div>

                  <span className="pr-2 text-sm font-bold text-brand-charcoal">
                    {username}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="hidden rounded-xl px-3 py-2 text-sm font-bold text-brand-earth/70 transition-colors hover:bg-brand-softsage/15 hover:text-brand-sage sm:block"
              >
                Log out
              </button>

              <button
                onClick={() =>
                  setMobileOpen(
                    (value) => !value
                  )
                }
                className="rounded-xl p-2 text-brand-sage hover:bg-brand-softsage/15 md:hidden"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="border-t border-brand-softsage/15 py-3 md:hidden">
              <div className="grid grid-cols-2 gap-2">
                {mobileLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold ${
                      isActive(item.href)
                        ? "bg-brand-sage text-white"
                        : "bg-brand-cream text-brand-charcoal"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-xl border border-brand-softsage/20 px-3 py-2.5 text-sm font-bold text-brand-earth"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
