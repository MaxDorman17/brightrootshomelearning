"use client";

import { STORE_OPEN } from "@/lib/store";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { SEN_SECTIONS } from "@/lib/senSections";

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

// `short` is shown instead of `label` on the desktop bar below 2xl, where space is tight.
type NavLink = { href: string; label: string; short?: string };
// A group is a dropdown; a group inside a group opens to the side (or folds open on a phone).
// `stage` hides a whole group when no child is at that stage.
type NavGroup = { label: string; short?: string; items: NavEntry[]; stage?: "seedling" | "young" | "teen" };
type NavEntry = NavLink | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;
const entryKey = (entry: NavEntry) => (isGroup(entry) ? `group:${entry.label}` : `${entry.label}:${entry.href}`);

// Coding holds one family's own content, so it only shows when the family has that
// subject on their timetable.
const OPTIONAL_PAGES: Record<string, (subjects: string[]) => boolean> = {
  "/coding": (subjects) => subjects.some((s) => /comput|coding|programming/i.test(s)),
};

// The younger activity pages (ages 5 to 11). Hidden when no child is set to Seedlings, Saplings or Everything.
const YOUNG_PAGES = ["/make/comics", "/make/cookbook", "/make/crafts", "/make/colouring", "/make/life-skills", "/make/pe", "/make/outdoors"];
// The Little Roots pages (ages 3 to 4). Hidden when every child is set to Teens.
const LITTLE_PAGES = ["/make/little-roots", "/make/little-roots/getting-started", "/make/outdoors?age=little", "/make/new?kind=little"];

// The subjects in the Seedlings, Saplings and Teens menus. `lesson` is the Bright Roots Lessons subject
// (lib/lessons.ts) and `sheet` the worksheet subject (lib/worksheets.ts).
const SUBJECTS = [
  { label: "Maths", lesson: "maths", sheet: "Maths" },
  { label: "English", lesson: "english", sheet: "English" },
  { label: "Science", lesson: "science", sheet: "Science" },
  { label: "History", lesson: "history", sheet: "History" },
  { label: "Geography", lesson: "geography", sheet: "Geography" },
  { label: "R.E.", lesson: "re", sheet: "RE" },
  { label: "Art & Design", lesson: "art", sheet: "Art & Design" },
  { label: "Wellbeing", lesson: "rshe", sheet: "Wellbeing" },
];
const lessonsFor = (subject: string, ages: string) => `/lessons/subject/${subject}?ages=${ages}`;
const agesLabel = (ages: string) => `Ages ${ages}`;

// The make-and-do pages for each stage, after the subjects. Seedlings opens the shared pages at the
// 3 to 6 activities and Saplings at the 7 to 10 ones (components/make/common.tsx, inAgeBand).
type Activities = { pe: string; outdoors: string; lifeSkills: string; cook: string; craft: string; comics: string; extra?: NavLink[] };
const SEEDLINGS_ACTIVITIES: Activities = {
  pe: "/make/pe?age=little",
  outdoors: "/make/outdoors?age=little",
  lifeSkills: "/make/life-skills?age=little",
  cook: "/make/cookbook?age=little",
  craft: "/make/crafts?age=little",
  comics: "/make/comics?for=seedlings",
};
const SAPLINGS_ACTIVITIES: Activities = {
  pe: "/make/pe?age=junior",
  outdoors: "/make/outdoors?age=junior",
  lifeSkills: "/make/life-skills?age=junior",
  cook: "/make/cookbook?age=junior",
  craft: "/make/crafts?age=junior",
  comics: "/make/comics",
};
const TEEN_ACTIVITIES: Activities = {
  pe: "/teens/pe",
  outdoors: "/teens/outdoors",
  lifeSkills: "/teens/life-skills",
  cook: "/teens/cooking",
  craft: "/teens/projects",
  comics: "/teens/comics",
  extra: [{ href: "/teens/exams", label: "Exams" }],
};

/**
 * One stage's menu: This term, then the subjects in the order families asked for, with P.E. and Outdoors after R.E.
 * and the make-and-do pages last. A stage with more than one age range gives each subject a menu of its ages.
 */
function stageMenu(label: string, ages: string[], activities: Activities, stage: NavGroup["stage"]): NavGroup {
  const subject = (s: (typeof SUBJECTS)[number]): NavEntry =>
    ages.length === 1
      ? { href: lessonsFor(s.lesson, ages[0]), label: s.label }
      : { label: s.label, items: ages.map((a) => ({ href: lessonsFor(s.lesson, a), label: agesLabel(a) })) };
  const subjects = SUBJECTS.map(subject);
  // This season's topics in every subject (lib/terms.ts).
  const thisTerm: NavEntry =
    ages.length === 1
      ? { href: `/lessons/term?ages=${ages[0]}`, label: "This term" }
      : { label: "This term", items: ages.map((a) => ({ href: `/lessons/term?ages=${a}`, label: agesLabel(a) })) };
  return {
    label,
    stage,
    items: [
      thisTerm,
      ...subjects.slice(0, 6),
      { href: activities.pe, label: "P.E." },
      { href: activities.outdoors, label: "Outdoors" },
      ...subjects.slice(6),
      { href: activities.lifeSkills, label: "Life Skills" },
      { href: activities.cook, label: "Cook Book" },
      { href: activities.craft, label: "Craft Book" },
      { href: activities.comics, label: "Comics" },
      ...(activities.extra ?? []),
    ],
  };
}

const WORKSHEET_AGES = ["5-7", "7-9", "9-11", "11-14"];

// The grown-up's bar. Home is the logo.
const PARENT_NAV: NavEntry[] = [
  {
    label: "Plan",
    items: [
      { href: "/parent", label: "Planner" },
      { href: "/parent/timetable", label: "Timetable" },
      { href: "/parent/lessons", label: "My Lessons" },
      {
        label: "Progress",
        items: [
          { href: "/parent/results", label: "Test Results" },
          { href: "/parent/progress", label: "Review & Feedback" },
          { href: "/parent/report", label: "Reports" },
          { href: "/parent/council-report", label: "Council Reports" },
          { href: "/parent/journal", label: "Journal" },
          { href: "/moments", label: "Moments & Photos" },
          { href: "/clubs", label: "Clubs & Activities" },
          { href: "/moments?tab=trips", label: "Trips & Days Out" },
        ],
      },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/reading-log", label: "Reading" },
      { href: "/spellings", label: "Spellings" },
      { href: "/coding", label: "Coding" },
      { href: "/languages", label: "Languages" },
      { href: "/make/topics", label: "Topic Packs" },
      { href: "/make/colouring", label: "Colouring" },
      {
        label: "Worksheets",
        items: [
          { href: "/worksheets", label: "All worksheets" },
          ...SUBJECTS.map((s) => ({
            label: s.label,
            items: WORKSHEET_AGES.map((a) => ({ href: `/worksheets?subject=${encodeURIComponent(s.sheet)}&ages=${a}`, label: agesLabel(a) })),
          })),
        ],
      },
    ],
  },
  // Ages 3 to 4: short activities a grown-up does with the child. Not in the children's menus.
  {
    label: "Little Roots",
    items: [
      { href: "/make/little-roots", label: "Activities" },
      { href: "/make/little-roots/getting-started", label: "Getting started" },
      { href: "/make/outdoors?age=little", label: "Outdoors" },
      { href: "/make/new?kind=little", label: "Add your own" },
    ],
  },
  stageMenu("Seedlings", ["5-7"], SEEDLINGS_ACTIVITIES, "seedling"),
  stageMenu("Saplings", ["7-9", "9-11"], SAPLINGS_ACTIVITIES, "young"),
  stageMenu("Teens", ["11-14"], TEEN_ACTIVITIES, "teen"),
  // Its own menu so families who need it don't have to hunt for it. The sections live in lib/sen.ts.
  {
    label: "SEN Support",
    short: "SEN",
    items: [{ href: "/make/sen", label: "All SEN support" }, ...SEN_SECTIONS.map((s) => ({ href: `/make/sen/${s.slug}`, label: s.name }))],
  },
  {
    label: "Family",
    items: [
      { href: "/parent/children", label: "Children" },
      { href: "/parent/rewards", label: "Rewards & Badges" },
      { href: "/parent/reminders", label: "Reminders" },
      { href: "/make/shopping", label: "Shopping List" },
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
      { href: "/worksheets", label: "Worksheets" },
      { href: "/lessons", label: "Bright Roots Lessons" },
      { href: "/child/resources", label: "Resources" },
      { href: "/coding", label: "Coding" },
      { href: "/languages", label: "Languages" },
      { href: "/make/topics", label: "Topic Packs" },
    ],
  },
  {
    label: "Play",
    items: [
      { href: "/child/games", label: "Games" },
      { href: "/make/comics", label: "Comics" },
      { href: "/make/cookbook", label: "Cookbook" },
      { href: "/make/crafts", label: "Craft Corner" },
      { href: "/make/colouring", label: "Colouring" },
      { href: "/make/life-skills", label: "Life Skills" },
      { href: "/make/sen", label: "Picture cards" },
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
  // The menus open inside the open dropdown, one per level.
  const [openSub, setOpenSub] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[] | null>(null);
  // Which activity pages suit this child, or this parent's children ("young", "teen", "both"). Everything until loaded.
  const [levels, setLevels] = useState<string[]>(["both"]);
  const [notifOpen, setNotifOpen] = useState(false);
  // The page's query string, so links like /moments?tab=trips or a subject's age range light up.
  // Read from the window rather than useSearchParams, which would make every page need a Suspense boundary.
  const [search, setSearch] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
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
        .then((res) => {
          setLevels(res.data.activity_levels?.length ? res.data.activity_levels : ["both"]);
          setIsDemo(!!res.data.is_demo);
        })
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
        setOpenSub([]);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(target)
      ) {
        setNotifOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setOpenSub([]);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
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
    const check = () => setSearch(window.location.search);
    check();
    window.addEventListener("moments-tab-changed", check);
    window.addEventListener("popstate", check);
    return () => {
      window.removeEventListener("moments-tab-changed", check);
      window.removeEventListener("popstate", check);
    };
  }, [pathname]);

  const onTrips = pathname === "/moments" && search.includes("tab=trips");

  // A link with a query string is active when the page has every one of its values.
  const queryMatches = (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    const have = new URLSearchParams(search);
    return Array.from(new URLSearchParams(query)).every(([key, value]) => have.get(key) === value);
  };

  // Following a link closes the menus. Moving between two age ranges of one subject keeps the same
  // path, so the new query string is noted here too.
  const followed = (href: string) => {
    setOpenMenu(null);
    setOpenSub([]);
    setMobileOpen(false);
    setSearch(href.includes("?") ? `?${href.split("?")[1]}` : "");
  };

  const isActive = (href: string) =>
    (href.includes("?") && queryMatches(href)) ||
    (pathname === href && !(href === "/moments" && onTrips)) ||
    (ALSO_ACTIVE[href] ?? []).includes(pathname) ||
    (href === "/make/comics" && pathname.startsWith("/make/comics/")) ||
    (href === "/worksheets" && pathname.startsWith("/worksheets/")) ||
    (href === "/lessons" && pathname.startsWith("/lessons/")) ||
    // A single SEN tool lights up "All SEN support"; a section page lights up its own item instead.
    (href === "/make/sen" && pathname.startsWith("/make/sen/") && !SEN_SECTIONS.some((s) => pathname === `/make/sen/${s.slug}`)) ||
    // A single recipe or craft, or the add/edit form, lights up the Saplings menu.
    (href === "/make/cookbook" && /^\/make\/(\d+|new)/.test(pathname));

  const showTeen = levels.some((l) => l === "teen" || l === "both");
  const showSeedling = levels.some((l) => l === "seedling" || l === "both");
  const showYoung = levels.some((l) => l === "young" || l === "both");
  const showLittle = levels.some((l) => l !== "teen");

  const visible = (link: NavLink) => {
    if (link.href.startsWith("/teens") && !showTeen) return false;
    if (YOUNG_PAGES.includes(link.href) && !showYoung && !showSeedling) return false;
    if (LITTLE_PAGES.includes(link.href) && !showLittle) return false;
    const rule = OPTIONAL_PAGES[link.href];
    // Until the timetable has loaded, keep optional pages hidden rather than flashing them.
    return !rule || (subjects !== null && rule(subjects));
  };

  // Drops the links and stages this family doesn't need, then any menu left empty.
  const prune = (entries: NavEntry[]): NavEntry[] =>
    entries.flatMap((entry): NavEntry[] => {
      if (!isGroup(entry)) return visible(entry) ? [entry] : [];
      if ((entry.stage === "seedling" && !showSeedling) || (entry.stage === "young" && !showYoung) || (entry.stage === "teen" && !showTeen)) return [];
      const items = prune(entry.items);
      return items.length ? [{ ...entry, items }] : [];
    });

  const baseNav = role === "parent" ? PARENT_NAV : role === "child" ? CHILD_NAV : [];
  const nav: NavEntry[] = prune(baseNav).map((entry) =>
    // The site owner also gets the newsletter tools.
    isGroup(entry) && entry.label === "Family" && isAdmin
      ? { ...entry, items: [...entry.items, { href: "/admin/newsletter", label: "Newsletter (owner)" }, { href: "/admin/backups", label: "Backups (owner)" }, { href: "/admin/free-accounts", label: "Free accounts (owner)" }, { href: "/admin/colouring", label: "Colouring uploads (owner)" }] }
      : entry
  );
  // The Store: only the site owner sees it until it opens (lib/store.ts).
  if (role === "parent" && (STORE_OPEN || isAdmin)) nav.push({ href: "/store", label: STORE_OPEN ? "Store" : "Store (owner)" });

  const groupActive = (group: NavGroup): boolean => group.items.some((item) => (isGroup(item) ? groupActive(item) : isActive(item.href)));

  // Opens the menu `key` at `depth` inside the open dropdown, closing anything deeper.
  const openAt = (depth: number, key: string | null) => setOpenSub((path) => [...path.slice(0, depth), ...(key ? [key] : [])]);

  // A dropdown's rows. A row that is itself a menu opens to the right on hover, a tap or a key press.
  const desktopRows = (items: NavEntry[], depth: number): ReactNode =>
    items.map((item) => {
      const key = entryKey(item);
      if (!isGroup(item)) {
        return (
          <Link
            key={key}
            href={item.href}
            onClick={() => followed(item.href)}
            onPointerEnter={(e) => e.pointerType === "mouse" && openAt(depth, null)}
            className={`block whitespace-nowrap px-4 py-2.5 text-sm font-semibold hover:bg-brand-cream ${
              isActive(item.href) ? "bg-brand-tint text-brand-sage" : "text-brand-charcoal"
            }`}
          >
            {item.label}
          </Link>
        );
      }
      const open = openSub[depth] === key;
      return (
        <div key={key} className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && openAt(depth, key)}>
          <button
            type="button"
            onClick={() => openAt(depth, key)}
            aria-expanded={open}
            className={`flex w-full items-center justify-between gap-3 whitespace-nowrap px-4 py-2.5 text-left text-sm font-semibold hover:bg-brand-cream ${
              open ? "bg-brand-cream" : ""
            } ${groupActive(item) ? "text-brand-sage" : "text-brand-charcoal"}`}
          >
            {item.label}
            <span aria-hidden="true" className="text-[10px]">▸</span>
          </button>
          {open && (
            <div className="absolute left-full top-0 -mt-1.5 ml-1 min-w-[11rem] rounded-2xl border border-brand-softsage/20 bg-brand-white py-1.5 shadow-lg">
              {desktopRows(item.items, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  // On a phone, every menu folds open in place. The one holding the current page starts open.
  const mobileItems = (items: NavEntry[], nested: boolean): ReactNode => (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) =>
        isGroup(item) ? (
          <details key={entryKey(item)} open={groupActive(item)} className={`col-span-2 rounded-xl ${nested ? "bg-brand-white" : "bg-brand-cream"}`}>
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-brand-charcoal [&::-webkit-details-marker]:hidden">
              {item.label}
              <span aria-hidden="true" className="text-[10px] transition-transform [details[open]>summary>&]:rotate-180">▾</span>
            </summary>
            <div className="px-2 pb-2">{mobileItems(item.items, !nested)}</div>
          </details>
        ) : (
          <Link
            key={entryKey(item)}
            href={item.href}
            onClick={() => followed(item.href)}
            className={`rounded-xl px-3 py-2.5 text-sm font-bold ${
              isActive(item.href) ? "bg-brand-sage text-white" : nested ? "bg-brand-white text-brand-charcoal" : "bg-brand-cream text-brand-charcoal"
            }`}
          >
            {item.label}
          </Link>
        )
      )}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-brand-softsage/20 bg-brand-white/95 backdrop-blur-md">
        {isDemo && (
          <div className="bg-[#2F5D3A] px-4 py-2 text-center text-sm font-semibold text-white">
            You&apos;re looking round the demo family. Anything you change is cleared overnight.{" "}
            <Link href="/login" className="underline underline-offset-2">Try someone else</Link>
            {" · "}
            <Link href="/signup" className="underline underline-offset-2">Start your free trial</Link>
          </div>
        )}
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
                        onClick={() => {
                          setOpenMenu((value) => (value === entry.label ? null : entry.label));
                          setOpenSub([]);
                        }}
                        aria-expanded={openMenu === entry.label}
                        className={`flex items-center gap-1 whitespace-nowrap rounded-xl px-2 py-2 text-sm font-bold transition-colors xl:px-3 ${
                          groupActive(entry) || openMenu === entry.label
                            ? "bg-brand-sage text-white"
                            : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                        }`}
                      >
                        {entry.short ? (
                          <>
                            <span className="2xl:hidden">{entry.short}</span>
                            <span className="hidden 2xl:inline">{entry.label}</span>
                          </>
                        ) : (
                          entry.label
                        )}
                        <span aria-hidden="true" className="text-[10px]">▾</span>
                      </button>

                      {openMenu === entry.label && (
                        // Not overflow-hidden: the menus inside open out to the side.
                        <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-brand-softsage/20 bg-brand-white py-1.5 shadow-lg">
                          {desktopRows(entry.items, 0)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      className={`relative whitespace-nowrap rounded-xl px-2 py-2 text-sm font-bold transition-colors xl:px-3 ${
                        isActive(entry.href)
                          ? "bg-brand-sage text-white"
                          : "text-brand-charcoal/70 hover:bg-brand-softsage/15 hover:text-brand-sage"
                      }`}
                    >
                      {entry.short ? (
                        <>
                          <span className="2xl:hidden">{entry.short}</span>
                          <span className="hidden 2xl:inline">{entry.label}</span>
                        </>
                      ) : (
                        entry.label
                      )}
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
              <div className="space-y-2">
                {nav.map((entry) =>
                  isGroup(entry) ? (
                    // Each menu folds, so the list stays short enough to find things in.
                    <details key={entryKey(entry)} open={groupActive(entry)}>
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-1 py-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-earth/70 [&::-webkit-details-marker]:hidden">
                        {entry.label}
                        <span aria-hidden="true" className="text-xs transition-transform [details[open]>summary>&]:rotate-180">▾</span>
                      </summary>
                      <div className="pb-2">{mobileItems(entry.items, false)}</div>
                    </details>
                  ) : (
                    <div key={entryKey(entry)}>{mobileItems([entry], false)}</div>
                  )
                )}
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
