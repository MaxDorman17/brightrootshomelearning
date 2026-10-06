/** How a person likes their screens to read: bigger text and an easy-read font. */
export type TextSize = "normal" | "large" | "larger";
export type DisplayPrefs = { text_size: TextSize; easy_font: boolean };

export const DEFAULT_DISPLAY: DisplayPrefs = { text_size: "normal", easy_font: false };

export const TEXT_SIZES: { id: TextSize; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "large", label: "Bigger" },
  { id: "larger", label: "Biggest" },
];

const STORAGE_KEY = "display_prefs";

function clean(value: Partial<DisplayPrefs> | null | undefined): DisplayPrefs {
  const size = TEXT_SIZES.some((s) => s.id === value?.text_size) ? (value!.text_size as TextSize) : "normal";
  return { text_size: size, easy_font: !!value?.easy_font };
}

/** Apply the settings to the page and remember them, so the next visit paints the right way first time. */
export function applyDisplay(value: Partial<DisplayPrefs> | null | undefined) {
  if (typeof document === "undefined") return;
  const prefs = clean(value);
  const root = document.documentElement;
  if (prefs.text_size === "normal") delete root.dataset.text;
  else root.dataset.text = prefs.text_size;
  if (prefs.easy_font) root.dataset.font = "easy";
  else delete root.dataset.font;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export function clearDisplay() {
  if (typeof document === "undefined") return;
  delete document.documentElement.dataset.text;
  delete document.documentElement.dataset.font;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// Runs in <head> before the page paints, to avoid a jump in text size.
export const DISPLAY_BOOT_SCRIPT = `try{var d=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"null");if(d){if(d.text_size==="large"||d.text_size==="larger")document.documentElement.dataset.text=d.text_size;if(d.easy_font)document.documentElement.dataset.font="easy";}}catch(e){}`;
