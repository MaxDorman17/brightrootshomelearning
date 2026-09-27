"use client";

import { useEffect } from "react";
import { getMe } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { applyTheme } from "@/lib/theme";

/** Loads the family's saved theme once per page load and applies it. */
export default function ThemeSync() {
  useEffect(() => {
    if (!isAuthenticated()) return;
    getMe()
      .then((res) => applyTheme(res.data.family_theme))
      .catch(() => {});
  }, []);

  return null;
}
