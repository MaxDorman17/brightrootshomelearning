"use client";
import { useEffect, useState } from "react";

/**
 * Returns false during SSR and the first client render, then true after mount.
 *
 * Guard any time-dependent output (new Date(), greetings by hour, "today"
 * labels, etc.) with this. Otherwise the value baked into the statically
 * pre-rendered HTML at build time won't match what the browser renders on
 * hydration, causing React hydration errors (#418 / #423 / #425).
 *
 * Usage:  const mounted = useMounted();
 *         {mounted ? format(new Date(), "EEEE, d MMMM yyyy") : ""}
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
