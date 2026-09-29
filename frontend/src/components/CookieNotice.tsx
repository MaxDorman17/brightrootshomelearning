"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SEEN_KEY = "cookie_notice_seen";

/**
 * Bright Roots only uses strictly necessary cookies, so the law doesn't require a consent banner.
 * This is a one-time notice so families know, with a link to the cookie policy.
 */
export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-[#E4DCCD] bg-[#FFFDF8] p-4 text-sm text-[#4A3B2C] shadow-xl shadow-black/10 sm:flex-row sm:items-center print:hidden"
    >
      <p className="flex-1">
        🍪 We only use essential cookies to keep you logged in and the site secure. No tracking, no adverts.{" "}
        <Link href="/cookies" className="font-bold text-[#2F5D3A] underline">
          Cookie policy
        </Link>
      </p>
      <button
        onClick={close}
        className="shrink-0 rounded-xl bg-[#2F5D3A] px-5 py-2 text-sm font-extrabold text-white hover:bg-[#24452C]"
      >
        OK
      </button>
    </div>
  );
}
