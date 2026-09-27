"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ResourceLibrary from "@/components/ResourceLibrary";
import { isAuthenticated, getRole } from "@/lib/auth";

export default function ResourcesPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-softsage">Learning</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-charcoal sm:text-4xl">Resources</h1>
        <p className="mb-6 mt-2 max-w-2xl text-sm text-[#6E5A46] sm:text-base">
          Links, worksheets and lesson aids, sorted into a folder for each subject. Choose what your children can see.
        </p>
        <ResourceLibrary isParent />
      </div>
    </div>
  );
}
