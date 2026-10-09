/**
 * The printable sheets, grouped into themes. Each sheet is an A4 PDF at
 * public/colouring/<theme>/<slug>.pdf with a small picture of it at public/colouring/<theme>/<slug>.jpg.
 * Each theme's square cover art lives at public/colouring/covers/<theme>.jpg; until a theme has
 * one (cover: true), its tile shows the top of its first sheet instead.
 *
 * To add a sheet: drop the PDF and its picture into the theme's folder, add a line to SHEETS, and
 * add the slug and date to lib/newContent.ts so it shows "New" for a month.
 */
export type Theme = { slug: string; name: string; cover?: boolean };

export const THEMES: Theme[] = [
  { slug: "woodland-friends", name: "Woodland Friends", cover: true },
  { slug: "farmyard-fun", name: "Farmyard Fun", cover: true },
  { slug: "under-the-sea", name: "Under the Sea" },
  { slug: "dinosaur-world", name: "Dinosaur World" },
  { slug: "space-adventure", name: "Space Adventure" },
  { slug: "garden-and-growing", name: "Garden & Growing" },
  { slug: "seasonal-fun", name: "Seasonal Fun" },
  { slug: "fairy-tale-adventures", name: "Fairy-Tale Adventures" },
  { slug: "vehicles-and-building", name: "Vehicles & Building" },
  { slug: "creative-learning", name: "Creative Learning" },
];

export type SheetKind = "colouring" | "word-search";
export type Sheet = { slug: string; title: string; theme: string; kind?: SheetKind };

export const KIND_LABEL: Record<SheetKind, string> = { colouring: "Colouring", "word-search": "Word searches" };

/** In the order they're shown within each theme. */
export const SHEETS: Sheet[] = [
  { slug: "forest-picnic", title: "Forest Picnic", theme: "woodland-friends" },
  { slug: "pond-adventure", title: "Pond Adventure", theme: "woodland-friends" },
  { slug: "woodland-greenhouse", title: "Woodland Greenhouse", theme: "woodland-friends" },
  { slug: "woodland-picnic", title: "Woodland Picnic", theme: "woodland-friends" },
  { slug: "stream-bridge", title: "Stream Bridge", theme: "woodland-friends" },
  { slug: "treehouse-play", title: "Treehouse Play", theme: "woodland-friends" },
  { slug: "autumn-gathering", title: "Autumn Gathering", theme: "woodland-friends" },
  { slug: "rainy-day", title: "Rainy Day", theme: "woodland-friends" },
  { slug: "moonlit-story", title: "Moonlit Story", theme: "woodland-friends" },
  { slug: "woodland-celebration", title: "Woodland Celebration", theme: "woodland-friends" },
  { slug: "friendly-farm", title: "Friendly Farm", theme: "farmyard-fun" },
  { slug: "tractor-harvest", title: "Tractor Harvest", theme: "farmyard-fun" },
  { slug: "morning-feeding", title: "Morning Feeding", theme: "farmyard-fun" },
  { slug: "egg-collecting", title: "Egg Collecting", theme: "farmyard-fun" },
  { slug: "pony-paddock", title: "Pony Paddock", theme: "farmyard-fun" },
  { slug: "apple-picking", title: "Apple Picking", theme: "farmyard-fun" },
  { slug: "duck-pond", title: "Duck Pond", theme: "farmyard-fun" },
  { slug: "sheep-care", title: "Sheep Care", theme: "farmyard-fun" },
  { slug: "dairy-morning", title: "Dairy Morning", theme: "farmyard-fun" },
  { slug: "farmyard-celebration", title: "Farmyard Celebration", theme: "farmyard-fun" },
  { slug: "seaside-seal", title: "Seaside Seal", theme: "under-the-sea" },
  { slug: "underwater-adventure", title: "Underwater Adventure", theme: "under-the-sea" },
  { slug: "coral-reef", title: "Coral Reef", theme: "under-the-sea" },
  { slug: "dolphin-adventure", title: "Dolphin Adventure", theme: "under-the-sea" },
  { slug: "octopus-garden", title: "Octopus Garden", theme: "under-the-sea" },
  { slug: "whale-family", title: "Whale Family", theme: "under-the-sea" },
  { slug: "submarine-expedition", title: "Submarine Expedition", theme: "under-the-sea" },
  { slug: "mermaid-treasure", title: "Mermaid Treasure", theme: "under-the-sea" },
  { slug: "penguin-sea-lion", title: "Penguin & Sea Lion", theme: "under-the-sea" },
  { slug: "ocean-celebration", title: "Ocean Celebration", theme: "under-the-sea" },
];

export const kindOf = (s: Sheet): SheetKind => s.kind ?? "colouring";
export const sheetsIn = (theme: string) => SHEETS.filter((s) => s.theme === theme);
export const sheetPdf = (s: Sheet) => `/colouring/${s.theme}/${s.slug}.pdf`;
export const sheetPicture = (s: Sheet) => `/colouring/${s.theme}/${s.slug}.jpg`;

/** The theme's square cover, or the first sheet's picture until the cover art is in. */
export function themeCover(t: Theme): string | null {
  if (t.cover) return `/colouring/covers/${t.slug}.jpg`;
  const first = sheetsIn(t.slug)[0];
  return first ? sheetPicture(first) : null;
}
