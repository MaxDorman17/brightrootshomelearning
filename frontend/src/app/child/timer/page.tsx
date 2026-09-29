"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** The study timer now lives on each lesson page. Old links here are sent on. */
export default function TimerPage() {
  const router = useRouter();
  useEffect(() => {
    const entry = Number(new URLSearchParams(window.location.search).get("entry"));
    router.replace(entry ? `/child/lesson/${entry}#timer` : "/child");
  }, [router]);
  return null;
}
