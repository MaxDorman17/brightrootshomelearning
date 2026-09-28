export type FamilyTheme = "sage" | "ocean" | "sunshine" | "berry";

export const DEFAULT_THEME: FamilyTheme = "sage";

// Swatch colours shown in the picker; the full palettes live in globals.css.
export const FAMILY_THEMES: { id: FamilyTheme; label: string; swatches: [string, string, string] }[] = [
  { id: "sage", label: "Sage", swatches: ["#3F5D46", "#8FA382", "#E8F0E8"] },
  { id: "ocean", label: "Ocean", swatches: ["#2F5F7A", "#769CB2", "#E3EEF4"] },
  { id: "sunshine", label: "Sunshine", swatches: ["#9A5B12", "#E5A823", "#FBF0D9"] },
  { id: "berry", label: "Berry", swatches: ["#7A3E62", "#B2548A", "#F5E6EF"] },
];

// Children can also pick one of these for their own screens.
export const CHILD_THEMES: { id: string; label: string; swatches: string[] }[] = [
  ...FAMILY_THEMES,
  { id: "sky", label: "Sky", swatches: ["#1D6FA3", "#38BDF8", "#E0F2FE"] },
  { id: "grape", label: "Grape", swatches: ["#5B3A9E", "#8B5CF6", "#EDE9FE"] },
  { id: "rainbow", label: "Rainbow", swatches: ["#DC2626", "#EA580C", "#EAB308", "#16A34A", "#2563EB", "#7C3AED"] },
];

const STORAGE_KEY = "family_theme";

export function isFamilyTheme(value: unknown): value is FamilyTheme {
  return FAMILY_THEMES.some((theme) => theme.id === value);
}

function isKnownTheme(value: unknown): value is string {
  return CHILD_THEMES.some((theme) => theme.id === value);
}

/** Apply a theme to the page and remember it so the next visit paints in the right colours. */
export function applyTheme(value: string | null | undefined) {
  if (typeof document === "undefined") return;
  const theme = isKnownTheme(value) ? value : DEFAULT_THEME;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

export function clearTheme() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = DEFAULT_THEME;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// Runs in <head> before the page paints, to avoid a flash of the default colours.
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t)document.documentElement.dataset.theme=t;}catch(e){}`;
