"use client";

import { useEffect, useRef, useState } from "react";
import { serif } from "@/lib/fonts";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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

// The younger activity pages. Hidden when every child in the family is set to see only the teen ones.
const YOUNG_PAGES = ["/make/cookbook", "/make/crafts", "/make/life-skills", "/make/pe", "/make/outdoors", "/make/little-roots", "/make/new?kind=little"];

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
      { href: "/make/life-skills", label: "Life Skills" },
      { href: "/make/shopping", label: "Shopping List" },
    ],
  },
  {
    label: "Active",
    items: [
      { href: "/make/pe", label: "P.E." },
      { href: "/make/outdoors", label: "Outdoors" },
      { href: "/clubs", label: "Clubs & Activities" },
      { href: "/moments?tab=trips", label: "Trips & days out" },
    ],
  },
  // Ages 3 to 4: short activities a grown-up does with the child. Not in the children's menus.
  {
    label: "Little Roots",
    items: [
      { href: "/make/little-roots", label: "Activities" },
      { href: "/make/new?kind=little", label: "Add your own" },
    ],
  },
  // Ages 11 to 16: the same four kinds of activity, written for teenagers. Make and Active show the younger ones.
  {
    label: "Teens",
    items: [
      { href: "/teens", label: "Teen Corner" },
      { href: "/teens/cooking", label: "Cooking" },
      { href: "/teens/projects", label: "Projects" },
      { href: "/teens/pe", label: "P.E." },
      { href: "/teens/outdoors", label: "Outdoors" },
      { href: "/teens/life-skills", label: "Life skills" },
      { href: "/teens/exams", label: "Exams" },
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
      { href: "/parent/feedback", label: "Help & feedback" },
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
      { href: "/make/life-skills", label: "Life Skills" },
      { href: "/account", label: "My Look" },
    ],
  },
  {
    label: "Active",
    items: [
      { href: "/make/pe", label: "P.E." },
      { href: "/make/outdoors", label: "Outdoors" },
      { href: "/clubs", label: "Clubs & Activities" },
      { href: "/moments?tab=trips", label: "Trips & days out" },
    ],
  },
  {
    label: "Teens",
    items: [
      { href: "/teens", label: "Teen Corner" },
      { href: "/teens/cooking", label: "Cooking" },
      { href: "/teens/projects", label: "Projects" },
      { href: "/teens/pe", label: "P.E." },
      { href: "/teens/outdoors", label: "Outdoors" },
      { href: "/teens/life-skills", label: "Life skills" },
      { href: "/teens/exams", label: "Exams" },
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
  // Which activity pages suit this child, or this parent's children ("young", "teen", "both"). Everything until loaded.
  const [levels, setLevels] = useState<string[]>(["both"]);
  const [notifOpen, setNotifOpen] = useState(false);
  // On the Moments page, the Trips tab belongs to the Active menu.
  const [onTrips, setOnTrips] = useState(false);

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

    const loadLevels = () =>
      checkSession()
        .then((res) => setLevels(res.data.activity_levels?.length ? res.data.activity_levels : ["both"]))
        .catch(() => {});
    loadLevels();
    window.addEventListener("activity-levels-changed", loadLevels);

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

    return () => {
      window.removeEventListener("avatar-changed", loadAvatar);
      window.removeEventListener("activity-levels-changed", loadLevels);
    };
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

  useEffect(() => {
    const check = () => setOnTrips(window.location.pathname === "/moments" && window.location.search.includes("tab=trips"));
    check();
    window.addEventListener("moments-tab-changed", check);
    return () => window.removeEventListener("moments-tab-changed", check);
  }, [pathname]);

  const isActive = (href: string) =>
    (href === "/moments?tab=trips" && onTrips) ||
    (pathname === href && !(href === "/moments" && onTrips)) ||
    (ALSO_ACTIVE[href] ?? []).includes(pathname) ||
    // A single recipe or craft, or the add/edit form, lights up the Make menu.
    (href === "/make/cookbook" && /^\/make\/(\d+|new)/.test(pathname));

  const showTeen = levels.some((l) => l !== "young");
  const showYoung = levels.some((l) => l !== "teen");

  const visible = (link: NavLink) => {
    if (link.href.startsWith("/teens") && !showTeen) return false;
    if (YOUNG_PAGES.includes(link.href) && !showYoung) return false;
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
      if (entry.label === "Family" && isAdmin) items = [...items, { href: "/admin/newsletter", label: "Newsletter (owner)" }, { href: "/admin/backups", label: "Backups (owner)" }];
      return { ...entry, items };
    })
    .filter((entry) => !isGroup(entry) || entry.items.length > 0);

  const groupActive = (group: NavGroup) => group.items.some((item) => isActive(item.href));

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-brand-softsage/20 bg-brand-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">

            <div className="flex min-w-0 items-center gap-3 xl:gap-5">
              <Link
                href={home}
                className="flex shrink-0 items-center gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/house-mark.png" alt="Bright Roots" className="h-9 w-auto" />
                <span className={`${serif.className} hidden text-xl font-semibold text-[#24452C] sm:block`}>Bright Roots</span>
              </Link>

              <div ref={menusRef} className="hidden items-center gap-0.5 lg:flex xl:gap-1">
                {nav.map((entry) =>
                  isGroup(entry) ? (
                    <div key={entry.label} className="relative">
                      <button
                        onClick={() => setOpenMenu((value) => (value === entry.label ? null : entry.label))}
                        aria-expanded={openMenu === entry.label}
                        className={`flex items-center gap-1 rounded-xl px-2 py-2 text-sm font-bold transition-colors xl:px-3 ${
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
                      className={`relative rounded-xl px-2 py-2 text-sm font-bold transition-colors xl:px-3 ${
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

                  <span className="pr-2 text-sm font-bold text-brand-charcoal lg:hidden xl:inline">
                    {username}
                  </span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold text-brand-earth/70 transition-colors hover:bg-brand-softsage/15 hover:text-brand-sage sm:block"
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
            // The bar is stuck to the top of the screen, so a long menu scrolls inside itself (4rem is the bar's height).
            <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-brand-softsage/15 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
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
