"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/errorReports";

/** Listens for anything that breaks on a page and tells the owner (see lib/errorReports). */
export default function ErrorReports() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => reportError(event.error || event.message, "window");
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
