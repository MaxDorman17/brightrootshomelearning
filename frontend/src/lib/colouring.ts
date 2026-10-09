/**
 * The printable sheets: colouring pictures and word searches. Each one is an A4 PDF in
 * public/colouring/<slug>.pdf with a small picture of it at public/colouring/<slug>.jpg for the card.
 *
 * To add a sheet: drop the PDF and its picture into public/colouring, add a line here, and add
 * the slug and date to lib/newContent.ts so it shows "New" for a month.
 */
export const THEMES = [
  "Woodland Friends",
  "Farmyard Fun",
  "Under the Sea",
  "Dinosaur World",
  "Space Adventure",
  "Garden & Growing",
  "Seasonal Fun",
  "Fairy-Tale Adventures",
  "Vehicles & Building",
  "Creative Learning",
] as const;

export type Theme = (typeof THEMES)[number];
export type SheetKind = "colouring" | "word-search";
export type ColouringSheet = { slug: string; title: string; theme: Theme; kind?: SheetKind };

export const KIND_LABEL: Record<SheetKind, string> = { colouring: "Colouring", "word-search": "Word searches" };

export const COLOURING_SHEETS: ColouringSheet[] = [
  { slug: "garden-adventure", title: "Garden Adventure", theme: "Garden & Growing" },
  { slug: "pond-adventure", title: "Pond Adventure", theme: "Woodland Friends" },
  { slug: "woodland-greenhouse", title: "Woodland Greenhouse", theme: "Garden & Growing" },
  { slug: "scarecrow-garden", title: "Scarecrow Garden", theme: "Garden & Growing" },
  { slug: "seaside-seal", title: "Seaside Seal", theme: "Under the Sea" },
  { slug: "underwater-adventure", title: "Underwater Adventure", theme: "Under the Sea" },
  { slug: "dinosaur-valley", title: "Dinosaur Valley", theme: "Dinosaur World" },
  { slug: "space-adventure", title: "Space Adventure", theme: "Space Adventure" },
  { slug: "friendly-farm", title: "Friendly Farm", theme: "Farmyard Fun" },
  { slug: "woodland-picnic", title: "Woodland Picnic", theme: "Woodland Friends" },
];

export const kindOf = (s: ColouringSheet): SheetKind => s.kind ?? "colouring";
export const sheetPdf = (s: ColouringSheet) => `/colouring/${s.slug}.pdf`;
export const sheetPicture = (s: ColouringSheet) => `/colouring/${s.slug}.jpg`;
