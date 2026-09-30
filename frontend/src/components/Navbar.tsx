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
  checkSession,
  getTodayNotifications,
  getTimetable,
  getUnreadFeedbackCount,
  logout,
} from "@/lib/api";
import { subjectsInTimetable } from "@/lib/subjects";
import Avatar from "@/components/Avatar";
import Emoji from "@/components/Emoji";
import TimerBadge from "@/components/TimerBadge";
import { AvatarChoice } from "@/lib/avatar";

interface BellItem {
  key: string;
  kind: "review" | "lesson" | "reading" | "spelling";
  child: string | null;
  title: string;
  detail: string;
  link: string;
}

const BELL_ICON: Record<BellItem["kind"], string> = { review: "📎", lesson: "✅", reading: "📖", spelling: "🔤" };
const BELL_SEEN_KEY = "bell_seen";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; items: NavLink[] };
type NavEntry = NavLink | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

// Coding holds one family's own content, so it only shows when the family has that
// subject on their timetable.
const OPTIONAL_PAGES: Record<string, (subjects: string[]) => boolean> = {
  "/coding": (subjects) => subjects.some((s) => /comput|coding|programming/i.test(s)),
};

const PARENT_NAV: NavEntry[] = [
  { href: "/parent/dashboard", label: "Home" },
  {
    label: "Plan",
    items: [
      { href: "/parent", label: "Planner" },
      { href: "/parent/timetable", label: "Timetable" },
      { href: "/parent/lessons", label: "My Lessons" },
      { href: "/units", label: "Oak Units" },
      { href: "/parent/extra-work", label: "Extra Work" },
      { href: "/parent/resources", label: "Resources" },
      { href: "/parent/print", label: "Print Week" },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/reading-log", label: "Reading" },
      { href: "/spellings", label: "Spellings" },
      { href: "/coding", label: "Coding" },
      { href: "/languages", label: "Languages" },
    ],
  },
  {
    label: "Progress",
    items: [
      { href: "/parent/results", label: "Test Results" },
      { href: "/parent/progress", label: "Review & Feedback" },
      { href: "/parent/report", label: "Reports" },
      { href: "/parent/council-report", label: "Council Report" },
      { href: "/parent/journal", label: "Journal" },
      { href: "/moments", label: "Moments & Photos" },
    ],
  },
  {
    label: "Make",
    items: [
      { href: "/make/cookbook", label: "Cookbook" },
      { href: "/make/crafts", label: "Craft Corner" },
      { href: "/make/teens", label: "Teen Corner" },
      { href: "/make/shopping", label: "Shopping List" },
    ],
  },
  {
    label: "Active",
    items: [
      { href: "/make/pe", label: "P.E." },
      { href: "/make/outdoors", label: "Outdoors" },
      { href: "/clubs", label: "Clubs & Activities" },
    ],
  },
  {
    label: "Family",
    items: [
      { href: "/parent/children", label: "Children" },
      { href: "/parent/rewards", label: "Rewards & Badges" },
      { href: "/parent/reminders", label: "Reminders" },
      { href: "/account", label: "Account" },
      { href: "/parent/help", label: "How-to guides" },
    ],
  },
];

const CHILD_NAV: NavEntry[] = [
  { href: "/child", label: "Today" },
  {
    label: "My Learning",
    items: [
      { href: "/reading-log", label: "Reading" },
      { href: "/spellings", label: "Spellings" },
      { href: "/child/extra-work", label: "Extra Work" },
      { href: "/child/resources", label: "Resources" },
      { href: "/coding", label: "Coding" },
      { href: "/languages", label: "Languages" },
    ],
  },
  {
    label: "Play",
    items: [
      { href: "/child/games", label: "Games" },
      { href: "/make/cookbook", label: "Cookbook" },
      { href: "/make/crafts", label: "Craft Corner" },
      { href: "/make/teens", label: "Teen Corner" },
      { href: "/account", label: "My Look" },
    ],
  },
  {
    label: "Active",
    items: [
      { href: "/make/pe", label: "P.E." },
      { href: "/make/outdoors", label: "Outdoors" },
      { href: "/clubs", label: "Clubs & Activities" },
    ],
  },
  { href: "/child/stars", label: "My Stars" },
  { href: "/moments", label: "Moments" },
  { href: "/child/progress", label: "Progress" },
];

// Pages that belong to a menu entry without being listed in it, so the right tab lights up.
const ALSO_ACTIVE: Record<string, string[]> = {
  "/child/stars": ["/achievements"],
  "/parent/rewards": ["/achievements"],
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[] | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [myAvatar, setMyAvatar] = useState<{ id: number; avatar: AvatarChoice | null; has_photo: boolean } | null>(null);
  const [bell, setBell] = useState<BellItem[]>([]);
  const [bellSeen, setBellSeen] = useState<string[]>([]);
  const [bellDate, setBellDate] = useState("");

  const menusRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsername(getUsername() || "");
    const r = getRole() || "";
    setRole(r);

    const loadAvatar = () =>
      checkSession()
        .then((res) => setMyAvatar({ id: res.data.id, avatar: res.data.avatar, has_photo: res.data.has_photo }))
        .catch(() => {});

    if (r === "child") {
      loadAvatar();
      window.addEventListener("avatar-changed", loadAvatar);
      getUnreadFeedbackCount()
        .then((res) => setUnreadCount(res.data.count))
        .catch(() => {});
    }

    if (r === "parent") {
      checkSession()
        .then((res) => {
          setIsAdmin(!!res.data.is_admin);
          setMyAvatar({ id: res.data.id, avatar: res.data.avatar, has_photo: false });
        })
        .catch(() => {});
      window.addEventListener("avatar-changed", loadAvatar);
      getTodayNotifications()
        .then((res) => {
          setBell(res.data.items);
          setBellDate(res.data.date);
          // What's already been looked at today, so the badge only counts new things.
          try {
            const saved = JSON.parse(localStorage.getItem(BELL_SEEN_KEY) || "{}");
            setBellSeen(saved.date === res.data.date ? saved.keys || [] : []);
          } catch {}
        })
        .catch(() => {});
    }

    if (r) {
      getTimetable()
        .then((res) => setSubjects(subjectsInTimetable(res.data.config || {})))
        .catch(() => setSubjects([]));
    }

    return () => window.removeEventListener("avatar-changed", loadAvatar);
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        menusRef.current &&
        !menusRef.current.contains(target)
      ) {
        setOpenMenu(null);
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

  const openBellItem = (item: BellItem) => {
    setNotifOpen(false);
    router.push(item.link);
  };

  const unseen = bell.filter((i) => !bellSeen.includes(i.key)).length;

  const toggleBell = () => {
    setNotifOpen((open) => {
      if (!open && bell.length) {
        // Opening the bell counts as seeing everything in it.
        const keys = bell.map((i) => i.key);
        setBellSeen(keys);
        try {
          localStorage.setItem(BELL_SEEN_KEY, JSON.stringify({ date: bellDate, keys }));
        } catch {}
      }
      return !open;
    });
  };

  const home =
    role === "parent"
      ? "/parent/dashboard"
      : "/child";

  const isActive = (href: string) =>
    pathname === href ||
    (ALSO_ACTIVE[href] ?? []).includes(pathname) ||
    // A single recipe or craft, or the add/edit form, lights up the Make menu.
    (href === "/make/cookbook" && /^\/make\/(\d+|new)/.test(pathname));

  const visible = (link: NavLink) => {
    const rule = OPTIONAL_PAGES[link.href];
    // Until the timetable has loaded, keep optional pages hidden rather than flashing them.
    return !rule || (subjects !== null && rule(subjects));
  };

  const baseNav = role === "parent" ? PARENT_NAV : role === "child" ? CHILD_NAV : [];
  const nav: NavEntry[] = baseNav
    .map((entry) => {
      if (!isGroup(entry)) return entry;
      let items = entry.items.filter(visible);
      // The site owner also gets the newsletter tools.
      if (entry.label === "Family" && isAdmin) items = [...items, { href: "/admin/newsletter", label: "Newsletter (owner)" }];
      return { ...entry, items };
    })
    .filter((entry) => !isGroup(entry) || entry.items.length > 0);

  const groupActive = (group: NavGroup) => group.items.some((item) => isActive(item.href));

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

              <div ref={menusRef} className="hidden items-center gap-1 lg:flex">
                {nav.map((entry) =>
                  isGroup(entry) ? (
                    <div key={entry.label} className="relative">
                      <button
                        onClick={() => setOpenMenu((value) => (value === entry.label ? null : entry.label))}
                        aria-expanded={openMenu === entry.label}
                        className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                          groupActive(entry) || openMenu === entry.label
                            ? "bg-brand-sage text-white"
                            : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                        }`}
                      >
                        {entry.label}
                        <span aria-hidden="true" className="text-[10px]">▾</span>
                      </button>

                      {openMenu === entry.label && (
                        <div className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-brand-softsage/20 bg-brand-white shadow-lg">
                          {entry.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className={`block px-4 py-3 text-sm font-semibold hover:bg-brand-cream ${
                                isActive(item.href) ? "bg-brand-tint text-brand-sage" : "text-brand-charcoal"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      className={`relative rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                        isActive(entry.href)
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      {entry.label}
                      {entry.href === "/child" && unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-terracotta px-1 text-[9px] font-extrabold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  )
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
                    onClick={toggleBell}
                    className="relative rounded-xl p-2 text-brand-sage transition-colors hover:bg-brand-softsage/15"
                    title="Today's learning"
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

                    {unseen > 0 && (
                      <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-terracotta px-1 text-[9px] font-extrabold text-white">
                        {unseen > 9 ? "9+" : unseen}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-brand-softsage/20 bg-brand-white shadow-lg">
                      <div className="border-b border-brand-softsage/15 px-4 py-3">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-brand-earth/70">
                          Today
                        </p>
                      </div>

                      {bell.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-brand-earth/60">
                          Nothing yet today. Finished lessons, reading and spelling tests will show here.
                        </p>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {bell.map((item) => (
                            <button
                              key={item.key}
                              onClick={() => openBellItem(item)}
                              className="flex w-full items-start gap-3 border-b border-brand-softsage/10 px-4 py-3 text-left transition-colors hover:bg-brand-cream"
                            >
                              <Emoji e={BELL_ICON[item.kind]} className="mt-0.5 h-6 w-6 shrink-0 text-lg" />
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-bold text-brand-charcoal">
                                  {item.child ? `${item.child}: ` : ""}
                                  {item.title}
                                </span>
                                <span className={`mt-0.5 block text-xs ${item.kind === "review" ? "font-bold text-brand-terracotta" : "text-brand-earth/60"}`}>
                                  {item.detail}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {role === "child" && <TimerBadge />}

              {username && (
                <Link
                  href="/account"
                  title={role === "child" ? "Change my avatar and colours" : "Account settings"}
                  className="hidden items-center gap-2 rounded-full bg-brand-cream px-2 py-1 hover:bg-brand-tint sm:flex"
                >
                  <Avatar
                    username={username}
                    avatar={myAvatar?.avatar}
                    hasPhoto={myAvatar?.has_photo}
                    childId={myAvatar?.id}
                    size="sm"
                  />

                  <span className="pr-2 text-sm font-bold text-brand-charcoal">
                    {username}
                  </span>
                </Link>
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
                className="rounded-xl p-2 text-brand-sage hover:bg-brand-softsage/15 lg:hidden"
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
            <div className="border-t border-brand-softsage/15 py-3 lg:hidden">
              <div className="space-y-3">
                {nav.map((entry) => {
                  const links = isGroup(entry) ? entry.items : [entry];
                  return (
                    <div key={isGroup(entry) ? entry.label : entry.href}>
                      {isGroup(entry) && (
                        <p className="mb-1.5 px-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-earth/60">{entry.label}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {links.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`rounded-xl px-3 py-2.5 text-sm font-bold ${
                              isActive(item.href) ? "bg-brand-sage text-white" : "bg-brand-cream text-brand-charcoal"
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
