import { useEffect, useState } from "react";
import { CHANGE_EVENT, DEFAULT_DISPLAY, savedDisplay, type DisplayPrefs } from "@/lib/display";

/** The saved display settings, kept up to date when the server's copy arrives (ThemeSync) or the person changes them. */
export function useDisplay(): DisplayPrefs {
  const [prefs, setPrefs] = useState<DisplayPrefs>(DEFAULT_DISPLAY);
  useEffect(() => {
    const update = () => setPrefs(savedDisplay());
    update();
    window.addEventListener(CHANGE_EVENT, update);
    return () => window.removeEventListener(CHANGE_EVENT, update);
  }, []);
  return prefs;
}
