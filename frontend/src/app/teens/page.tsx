"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getMakeItems } from "@/lib/api";
import { getRole, isAuthenticated } from "@/lib/auth";
import { inAudience, MakePhoto, MakeSummary, MetaChips, TEEN_TABS } from "@/components/make/common";
import Emoji, { EmojiText } from "@/components/Emoji";

function Card({ item }: { item: MakeSummary }) {
  return (
    <Link href={`/make/${item.id}`} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
      <MakePhoto item={item} className="h-40 w-full" />
      <div className="p-4">
        {item.category && <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{item.category}</p>}
        <h3 className="mt-0.5 text-lg font-extrabold text-brand-charcoal group-hover:text-brand-sage">{item.title}</h3>
        {item.summary && <p className="mt-1 line-clamp-2 text-sm text-brand-earth/70">{item.summary}</p>}
        <div className="mt-3">
          <MetaChips item={item} />
        </div>
      </div>
    </Link>
  );
}

/** Cooking, projects, P.E., outdoor skills and life skills for ages 11 to 16, all in one place. */
export default function TeenCornerPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [items, setItems] = useState<MakeSummary[] | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setRole(getRole() || "");
    getMakeItems()
      .then((res) => setItems((res.data as MakeSummary[]).filter((i) => inAudience(i, "teen"))))
      .catch(() => setItems([]));
  }, [router]);

  const recipes = (items || []).filter((i) => i.kind === "recipe");
  const projects = (items || []).filter((i) => i.kind === "craft");
  const fitness = (items || []).filter((i) => i.kind === "pe");
  const outdoors = (items || []).filter((i) => i.kind === "outdoor");
  const life = (items || []).filter((i) => i.kind === "life");

  const section = (title: string, blurb: string, list: MakeSummary[], more: string) => list.length === 0 ? null : (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-charcoal">{title}</h2>
          <p className="text-sm text-brand-earth/70">{blurb}</p>
        </div>
        <Link href={more} className="text-sm font-bold text-brand-sage hover:underline">
          See all {list.length} →
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, 6).map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-line bg-[#FDF9F0] shadow-xl shadow-green-900/10">
          {/* Wide banner: cream on the left, the illustration on the right. Sized by height so it never stretches. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/teen-hero.jpg" alt="" className="absolute right-0 top-0 h-full w-auto max-w-none" />
          {/* On narrower screens the picture sits behind the words, so soften it. */}
          <div className="absolute inset-0 bg-[#FDF9F0]/85 lg:hidden" />
          <div className="relative flex min-h-[220px] flex-col justify-center p-6 sm:p-10 lg:min-h-[300px]">
            <div className="lg:max-w-[40%]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6E5A46]/70">Ages 11–16</p>
              <h1 className="mt-1 text-3xl font-extrabold text-[#2F5D3A] sm:text-4xl"><Emoji e="🚀" /> Teen Corner</h1>
              <p className="mt-3 text-[#4A3B2C]">
                Real meals, projects with real skills, training plans and outdoor skills, written for you to do on your own.
                {role === "child" ? " Tap \"I'd love to make this\" on anything you want to try." : ""}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-[#2F5D3A]">
                <span className="rounded-full bg-white/85 px-3 py-1.5 shadow-sm"><Emoji e="🍳" /> {recipes.length || "–"} recipes</span>
                <span className="rounded-full bg-white/85 px-3 py-1.5 shadow-sm">🛠️ {projects.length || "–"} projects</span>
                <span className="rounded-full bg-white/85 px-3 py-1.5 shadow-sm">🏃 {fitness.length || "–"} P.E.</span>
                <span className="rounded-full bg-white/85 px-3 py-1.5 shadow-sm">🌳 {outdoors.length || "–"} outdoors</span>
                <span className="rounded-full bg-white/85 px-3 py-1.5 shadow-sm">🧺 {life.length || "–"} life skills</span>
              </div>
            </div>
          </div>
        </div>

        {items === null ? (
          <p className="mt-10 text-sm text-brand-earth/70">Loading...</p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {TEEN_TABS.map((t) => (
                <Link key={t.kind} href={t.path} className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-extrabold text-brand-earth hover:bg-brand-tint">
                  <EmojiText text={t.label} />
                </Link>
              ))}
              <Link href="/teens/exams" className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-extrabold text-brand-earth hover:bg-brand-tint">
                <EmojiText text="📝 Exams" />
              </Link>
            </div>
            {section("Cook", "Dinners, bakes and a budget challenge.", recipes, "/teens/cooking")}
            {section("Make and create", "Printmaking, textiles, woodwork, film and more.", projects, "/teens/projects")}
            {section("Get fit", "Running, circuits, sport skills and designing your own workout.", fitness, "/teens/pe")}
            {section("Get outdoors", "Map reading, geocaching, bushcraft and leading a hike.", outdoors, "/teens/outdoors")}
            {section("Life skills", "Washing, ironing, wiring a plug, budgeting, first aid and getting about on your own.", life, "/teens/life-skills")}
          </>
        )}
      </div>
    </div>
  );
}
