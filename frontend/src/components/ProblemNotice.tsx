"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tells people when something didn't save or the internet has gone, so a failed save is never silent.
 * It catches any request a page didn't deal with itself, so pages that already show their own
 * message are left alone.
 */

type FailedRequest = {
  isAxiosError?: boolean;
  config?: { method?: string; url?: string };
  response?: { status?: number; data?: { detail?: unknown } };
};

function messageFor(err: FailedRequest): string | null {
  const method = (err.config?.method || "get").toLowerCase();
  const saving = method !== "get";
  const status = err.response?.status;

  if (!err.response) {
    return saving
      ? "That didn't go through, so it hasn't been saved. Check your internet and try again."
      : "We couldn't load that. Check your internet and try again.";
  }
  // Signed out or membership ended: the page moves on by itself.
  if (status === 401 || status === 402) return null;
  if (!saving) return null;
  if (status && status >= 500) return "Something went wrong on our side, so that wasn't saved. Please try again.";

  const detail = err.response.data?.detail;
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") {
    return detail[0].msg.replace(/^Value error, /, "");
  }
  return "That couldn't be saved. Please check it and try again.";
}

export default function ProblemNotice() {
  const [message, setMessage] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const show = (text: string) => {
      setMessage(text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), 9000);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const err = event.reason as FailedRequest | undefined;
      if (!err || !err.isAxiosError) return;
      const text = messageFor(err);
      if (text) show(text);
    };
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    setOffline(typeof navigator !== "undefined" && navigator.onLine === false);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!message && !offline) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1000] flex flex-col items-center gap-2 px-4 print:hidden">
      {offline && (
        <div role="status" className="pointer-events-auto max-w-md rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-lg">
          You&apos;re offline. Anything you change won&apos;t be saved until the internet is back.
        </div>
      )}
      {message && (
        <div role="alert" className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900 shadow-lg">
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Close this message"
            className="-mr-1 -mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-base leading-none text-red-900 hover:bg-red-100"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
