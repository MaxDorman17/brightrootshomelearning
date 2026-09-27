"use client";

import { useEffect } from "react";
import { checkSession } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { applyTheme, clearTheme } from "@/lib/theme";

/** Loads the family's saved theme once per page load and applies it. */
export default function ThemeSync() {
  useEffect(() => {
    if (!isAuthenticated()) return;
    checkSession()
      .then((res) => applyTheme(res.data.family_theme))
      .catch((err) => {
        // Signed out (e.g. the session expired): go back to the default colours.
        if (err.response?.status === 401) clearTheme();
      });
  }, []);

  return null;
}
