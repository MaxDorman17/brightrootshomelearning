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
  { slug: "under-the-sea", name: "Under the Sea", cover: true },
  { slug: "dinosaur-world", name: "Dinosaur World", cover: true },
  { slug: "space-adventure", name: "Space Adventure", cover: true },
  { slug: "garden-and-growing", name: "Garden & Growing", cover: true },
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
  { slug: "dinosaur-valley", title: "Dinosaur Valley", theme: "dinosaur-world" },
  { slug: "dinosaur-nest", title: "Dinosaur Nest", theme: "dinosaur-world" },
  { slug: "stegosaurus-garden", title: "Stegosaurus Garden", theme: "dinosaur-world" },
  { slug: "lakeside-fliers", title: "Lakeside Fliers", theme: "dinosaur-world" },
  { slug: "dinosaur-picnic", title: "Dinosaur Picnic", theme: "dinosaur-world" },
  { slug: "fossil-dig", title: "Fossil Dig", theme: "dinosaur-world" },
  { slug: "river-crossing", title: "River Crossing", theme: "dinosaur-world" },
  { slug: "leaf-gathering", title: "Leaf Gathering", theme: "dinosaur-world" },
  { slug: "stargazing", title: "Stargazing", theme: "dinosaur-world" },
  { slug: "prehistoric-celebration", title: "Prehistoric Celebration", theme: "dinosaur-world" },
  { slug: "space-adventure", title: "Space Adventure", theme: "space-adventure" },
  { slug: "moon-rocket", title: "Moon Rocket", theme: "space-adventure" },
  { slug: "planet-rover", title: "Planet Rover", theme: "space-adventure" },
  { slug: "space-station", title: "Space Station", theme: "space-adventure" },
  { slug: "asteroid-garden", title: "Asteroid Garden", theme: "space-adventure" },
  { slug: "alien-picnic", title: "Alien Picnic", theme: "space-adventure" },
  { slug: "star-map", title: "Star Map", theme: "space-adventure" },
  { slug: "satellite-repair", title: "Satellite Repair", theme: "space-adventure" },
  { slug: "cosmic-race", title: "Cosmic Race", theme: "space-adventure" },
  { slug: "galaxy-celebration", title: "Galaxy Celebration", theme: "space-adventure" },
  { slug: "garden-adventure", title: "Garden Adventure", theme: "garden-and-growing" },
  { slug: "scarecrow-garden", title: "Scarecrow Garden", theme: "garden-and-growing" },
  { slug: "vegetable-harvest", title: "Vegetable Harvest", theme: "garden-and-growing" },
  { slug: "garden-critters", title: "Garden Critters", theme: "garden-and-growing" },
  { slug: "planting-seeds", title: "Planting Seeds", theme: "garden-and-growing" },
  { slug: "greenhouse-care", title: "Greenhouse Care", theme: "garden-and-growing" },
  { slug: "garden-picnic", title: "Garden Picnic", theme: "garden-and-growing" },
  { slug: "rainy-day-garden", title: "Rainy Day Garden", theme: "garden-and-growing" },
  { slug: "orchard-picking", title: "Orchard Picking", theme: "garden-and-growing" },
  { slug: "garden-celebration", title: "Garden Celebration", theme: "garden-and-growing" },
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
