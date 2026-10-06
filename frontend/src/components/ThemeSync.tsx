"use client";

import { useEffect } from "react";
import { checkSession } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { applyTheme, clearTheme } from "@/lib/theme";
import { applyDisplay, clearDisplay } from "@/lib/display";

/** Loads the family's saved theme, and this person's text size and font, once per page load and applies them. */
export default function ThemeSync() {
  useEffect(() => {
    if (!isAuthenticated()) return;
    checkSession()
      .then((res) => {
        applyTheme(res.data.family_theme);
        applyDisplay(res.data.display);
      })
      .catch((err) => {
        // Signed out (e.g. the session expired): go back to the default colours and text.
        if (err.response?.status === 401) {
          clearTheme();
          clearDisplay();
        }
      });
  }, []);

  return null;
}
