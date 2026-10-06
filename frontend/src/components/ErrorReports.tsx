"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/errorReports";

/** Listens for anything that breaks on a page and tells the owner (see lib/errorReports). */
export default function ErrorReports() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      // "Script error." with nothing else is the browser hiding a problem inside a script that isn't ours
      // (a phone's content blocker or add-on, or a script from another address). There is nothing in it to act on.
      if (!event.error && /^script error\.?$/i.test(String(event.message || "").trim())) return;
      reportError(event.error || event.message, "window");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      // A failed request to our own server (wrong password, signed out...) is normal, not a broken page.
      if (event.reason?.isAxiosError) return;
      reportError(event.reason, "promise");
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
