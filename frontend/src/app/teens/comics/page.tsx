"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { isAuthenticated } from "@/lib/auth";
import { comic as comicFont } from "@/lib/fonts";

/** Teen comics: not written yet, so the Teens menu has somewhere to point. */
export default function TeenComicsPage() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHero art="comics" tint={3}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Teens · ages 11 to 14</p>
          <h1 className={`${comicFont.className} mt-1 text-4xl tracking-wide text-brand-charcoal sm:text-5xl`}>Comics</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-earth/70">Comics written for teenagers are coming soon.</p>
        </PageHero>
        <div className="brand-card mt-6 p-6">
          <p className="text-lg font-extrabold text-brand-charcoal">Coming soon</p>
          <p className="mt-1 text-brand-earth">
            Until then, the{" "}
            <Link href="/make/comics" className="font-bold text-brand-sage underline">
              Saplings comics
            </Link>{" "}
            are there for anyone who wants them.
          </p>
        </div>
      </main>
    </div>
  );
}
