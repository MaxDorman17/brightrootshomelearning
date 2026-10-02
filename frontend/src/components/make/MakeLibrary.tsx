"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { getMakeItems, getShoppingCount, MakeKind } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { AGE_BANDS, AgeBand, Audience, inAgeBand, inAudience, KIND_FAMILY, KIND_INFO, MakePhoto, MakeSummary, MetaChips, TEEN_TABS } from "./common";
import Emoji, { EmojiText } from "@/components/Emoji";

/**
 * The Cookbook, Craft Corner, P.E. or Outdoors: browse, search and filter.
 * `audience` picks the younger activities (the Make and Active menus) or the 11 to 16 ones (the Teens menu).
 */
export default function MakeLibrary({ kind, audience = "young" }: { kind: MakeKind; audience?: Audience }) {
  const router = useRouter();
  const info = KIND_INFO[kind];
  const teen = audience === "teen";
  const teenTab = TEEN_TABS.find((t) => t.kind === kind)!;
  const [role, setRole] = useState("");
  const [items, setItems] = useState<MakeSummary[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [quick, setQuick] = useState(false);
  const [wishedOnly, setWishedOnly] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);
  const [shopCount, setShopCount] = useState(0);
  const [age, setAge] = useState<AgeBand | "">("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const fromUrl = new URLSearchParams(window.location.search).get("age");
    if (fromUrl === "teen" && !teen) {
      // Older links: the teen activities now have their own pages.
      router.replace(teenTab.path);
      return;
    }
    if (!teen && (fromUrl === "little" || fromUrl === "junior")) setAge(fromUrl);
    const r = getRole() || "";
    setRole(r);
    getMakeItems(kind)
      .then((res) => setItems((res.data as MakeSummary[]).filter((i) => inAudience(i, audience))))
      .catch(() => setItems([]));
    if (r === "parent") {
      getShoppingCount()
        .then((res) => setShopCount(res.data.count))
        .catch(() => {});
    }
  }, [kind, router, audience, teen, teenTab.path]);

  const categories = useMemo(
    () =>
      Array.from(new Set((items || []).filter((i) => inAgeBand(i, age)).map((i) => i.category).filter(Boolean) as string[])).sort(),
    [items, age]
  );

  const chooseAge = (band: AgeBand | "") => {
    setAge(band);
    setCategory("");
    const url = new URL(window.location.href);
    if (band) url.searchParams.set("age", band);
    else url.searchParams.delete("age");
    window.history.replaceState(null, "", url.toString());
  };
  const wishCount = (items || []).filter((i) => i.wished_by.length).length;

  const shown = (items || []).filter((i) => {
    const q = search.trim().toLowerCase();
    if (q && !`${i.title} ${i.summary || ""} ${i.category || ""}`.toLowerCase().includes(q)) return false;
    if (!inAgeBand(i, age)) return false;
    if (category && i.category !== category) return false;
    if (quick && !(i.minutes && i.minutes <= 30)) return false;
    if (wishedOnly && !i.wished_by.length) return false;
    if (mineOnly && !i.is_own) return false;
    return true;
  });

  const chip = (active: boolean) =>
    "rounded-full border px-3 py-1.5 text-sm font-bold transition-colors " +
    (active ? "border-brand-sage bg-brand-sage text-white" : "border-brand-line bg-white text-brand-earth hover:border-brand-softsage");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero
          art={{ recipe: "shopping", craft: "lessons", pe: "pe", outdoor: "wellies", life: "account" }[kind]}
          tint={{ recipe: 1, craft: 4, pe: 0, outdoor: 0, life: 3 }[kind]}
        >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">{teen ? "Teens · ages 11 to 16" : "Make together"}</p>
            <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">
              
              {teen ? teenTab.name : info.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-brand-earth/70">
              {teen
                ? {
                    recipe: "Real meals and proper bakes to cook from start to finish on your own.",
                    craft: "Projects with real skills: printmaking, textiles, woodwork, film and more.",
                    pe: "Training you can plan and track yourself: running, circuits, sport skills and your own workout plan.",
                    outdoor: "Map reading, bushcraft, photography and leading a hike. Skills for getting out on your own.",
                    life: "The everyday jobs nobody teaches you: washing, ironing, wiring a plug, budgeting, first aid and getting about on your own.",
                  }[kind]
                : kind === "recipe"
                ? "Simple recipes to cook together, with steps children can follow and jobs marked for grown-ups."
                : kind === "pe"
                  ? "Get moving! P.E. ideas for one child on their own and for a group, indoors and out. Add your own too."
                  : kind === "outdoor"
                    ? "Pull on your wellies! Bug trails and dens for little explorers, maps, stargazing and bushcraft for older ones. Add your own too."
                  : "Crafts and makes with easy steps, what you'll need, and ideas for every age."}
            </p>
        </PageHero>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {teen ? (
              <>
                <Link href="/teens" className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-extrabold text-indigo-700 hover:bg-indigo-100">
                  <Emoji e="🚀" /> Teen Corner
                </Link>
                {TEEN_TABS.map((t) => (
                  <Link
                    key={t.kind}
                    href={t.path}
                    aria-current={t.kind === kind ? "page" : undefined}
                    className={
                      "rounded-xl px-4 py-2 text-sm font-extrabold " +
                      (t.kind === kind ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
                    }
                  >
                    <EmojiText text={t.label} />
                  </Link>
                ))}
              </>
            ) : (
              <>
                {KIND_FAMILY[kind].map((k) => (
                  <Link
                    key={k}
                    href={KIND_INFO[k].path + (age ? `?age=${age}` : "")}
                    aria-current={k === kind ? "page" : undefined}
                    className={
                      "rounded-xl px-4 py-2 text-sm font-extrabold " +
                      (k === kind ? "bg-brand-charcoal text-white" : "bg-brand-cream text-brand-earth hover:bg-brand-tint")
                    }
                  >
                    <EmojiText text={{ recipe: "🍳 Cookbook", craft: "🎨 Craft Corner", pe: "🏃 P.E.", outdoor: "🌳 Outdoors", life: "🧺 Life skills" }[k]} />
                  </Link>
                ))}
                {/* The 11 to 16 version of this page */}
                <Link href={teenTab.path} className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-extrabold text-indigo-700 hover:bg-indigo-100">
                  <Emoji e="🚀" /> For teens
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {role === "parent" && (
              <>
                {kind !== "life" && (
                  <Link href="/make/shopping" className="rounded-xl border-2 border-brand-line bg-white px-4 py-2.5 text-sm font-extrabold text-brand-sage hover:border-brand-softsage">
                    🛒 Shopping list{shopCount ? ` (${shopCount})` : ""}
                  </Link>
                )}
                <Link href={`/make/new?kind=${kind}${teen ? "&teen=1" : ""}`} className="rounded-xl bg-brand-sage px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-sagedark">
                  + Add your own {info.one}
                </Link>
              </>
            )}
          </div>
        </div>

        {!teen && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-earth/60">Age</span>
            <button onClick={() => chooseAge("")} className={chip(!age)}>
              All
            </button>
            {AGE_BANDS.filter((b) => b.id !== "teen").map((b) => (
              <button key={b.id} onClick={() => chooseAge(age === b.id ? "" : b.id)} className={chip(age === b.id)}>
                {b.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 space-y-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={{ recipe: "Search recipes, e.g. muffins", craft: "Search crafts, e.g. paper", pe: "Search activities, e.g. relay", outdoor: "Search activities, e.g. bugs", life: "Search life skills, e.g. washing" }[kind]}
            className="w-full rounded-xl border-2 border-brand-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-softsage sm:max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategory("")} className={chip(!category)}>
              All
            </button>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(category === c ? "" : c)} className={chip(category === c)}>
                {c}
              </button>
            ))}
            <button onClick={() => setQuick(!quick)} className={chip(quick)}>
              ⏱️ 30 min or less
            </button>
            {wishCount > 0 && (
              <button onClick={() => setWishedOnly(!wishedOnly)} className={chip(wishedOnly)}>
                ❤️ {role === "child" ? "My wish list" : "Wished for"} ({wishCount})
              </button>
            )}
            {(items || []).some((i) => i.is_own) && (
              <button onClick={() => setMineOnly(!mineOnly)} className={chip(mineOnly)}>
                🏠 Our own
              </button>
            )}
          </div>
        </div>

        {items === null ? (
          <p className="mt-10 text-sm text-brand-earth/70">Loading...</p>
        ) : shown.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-brand-line p-8 text-center text-sm text-brand-earth/70">
            Nothing matches those filters.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => (
              <Link key={item.id} href={`/make/${item.id}`} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative">
                  <MakePhoto item={item} className="h-40 w-full" />
                  {item.wished_by.length > 0 && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-rose-600">
                      ❤️ {role === "child" ? "On my wish list" : item.wished_by.join(", ")}
                    </span>
                  )}
                  {item.is_own && (
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-brand-sage">
                      🏠 Our own
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {item.category && <p className="text-xs font-bold uppercase tracking-wider text-brand-softsage">{item.category}</p>}
                  <h2 className="mt-0.5 text-lg font-extrabold text-brand-charcoal group-hover:text-brand-sage">{item.title}</h2>
                  {item.summary && <p className="mt-1 line-clamp-2 text-sm text-brand-earth/70">{item.summary}</p>}
                  <div className="mt-3">
                    <MetaChips item={item} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
