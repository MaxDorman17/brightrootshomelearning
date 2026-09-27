"use client";

import { useEffect } from "react";
// Imported here so the browser's install prompt is caught as soon as it fires.
import "@/lib/pwa";

/** Registers /sw.js so Bright Roots can be installed and show notifications. */
export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
