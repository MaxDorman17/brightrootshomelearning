"use client";

import Link from "next/link";
import StarIcon from "@/components/StarIcon";
import Emoji from "@/components/Emoji";

/** Joins stars/rewards and badges into one place: tabs across the top of both pages. */
export default function RewardsTabs({ role, current }: { role: "parent" | "child"; current: "stars" | "badges" }) {
  const tabs = [
    {
      id: "stars",
      href: role === "parent" ? "/parent/rewards" : "/child/stars",
      label: (
        <>
          <StarIcon /> {role === "parent" ? "Rewards" : "My Stars"}
        </>
      ),
    },
    { id: "badges", href: "/achievements", label: <><Emoji e="🏅" /> Badges</> },
  ];
  return (
    <div className="mb-6 flex w-fit gap-1 rounded-2xl bg-brand-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={current === tab.id ? "page" : undefined}
          className={
            "rounded-xl px-4 py-2 text-sm font-bold transition-colors " +
            (current === tab.id ? "bg-brand-sage text-white" : "text-[#6E5A46] hover:bg-brand-cream")
          }
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
