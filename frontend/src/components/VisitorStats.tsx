"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { STATS_HOSTS, STATS_SCRIPT, STATS_WEBSITE_ID } from "@/lib/site";

// Only these public pages are counted. Anything a signed-in family or child sees is never
// counted, and neither is any page whose address carries a private link (email
// verification, password reset, newsletter links).
const COUNTED = [
  "/",
  "/guides",
  "/sample-report",
  "/about",
  "/contact",
  "/signup",
  "/login",
  "/privacy",
  "/cookies",
  "/terms",
  "/refunds",
  "/acceptable-use",
  "/safeguarding",
  "/complaints",
];

function counted(pathname: string) {
  return COUNTED.some((page) => pathname === page || (page !== "/" && pathname.startsWith(`${page}/`)));
}

type Umami = { track: (payload?: unknown, data?: unknown) => void };

function umami(): Umami | undefined {
  return (window as unknown as { umami?: Umami }).umami;
}

/** Counts something a visitor did on a public page, such as creating an account. No personal details are sent. */
export function countEvent(name: string) {
  try {
    umami()?.track(name);
  } catch {
    // Statistics must never get in the way of the site.
  }
}

/**
 * Cookie-free visitor statistics for the public pages, sent to our own Umami server.
 * Pages are counted by hand (auto-track is off) so only the list above is ever sent,
 * and only the page's path, never anything after a "?".
 */
export default function VisitorStats() {
  const pathname = usePathname() || "/";
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLive(STATS_HOSTS.includes(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!ready || !counted(pathname)) return;
    try {
      umami()?.track((props: Record<string, unknown>) => ({ ...props, url: pathname }));
    } catch {
      // Statistics must never get in the way of the site.
    }
  }, [ready, pathname]);

  if (!live) return null;
  return (
    <Script
      src={STATS_SCRIPT}
      data-website-id={STATS_WEBSITE_ID}
      data-auto-track="false"
      data-do-not-track="true"
      strategy="afterInteractive"
      onLoad={() => setReady(true)}
    />
  );
}
