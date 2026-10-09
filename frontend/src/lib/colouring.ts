/**
 * The colouring sheets. Each one is an A4 PDF in public/colouring/<slug>.pdf with a small
 * picture of it at public/colouring/<slug>.jpg for the card.
 *
 * To add a sheet: drop the PDF and its picture into public/colouring, add a line here, and add
 * the slug and date to lib/newContent.ts so it shows "New" for a month.
 */
export type ColouringSheet = { slug: string; title: string; theme: string };

export const COLOURING_SHEETS: ColouringSheet[] = [
  { slug: "garden-adventure", title: "Garden Adventure", theme: "Gardens & nature" },
  { slug: "pond-adventure", title: "Pond Adventure", theme: "Gardens & nature" },
  { slug: "woodland-greenhouse", title: "Woodland Greenhouse", theme: "Gardens & nature" },
  { slug: "scarecrow-garden", title: "Scarecrow Garden", theme: "Gardens & nature" },
  { slug: "seaside-seal", title: "Seaside Seal", theme: "Sea & seaside" },
  { slug: "underwater-adventure", title: "Underwater Adventure", theme: "Sea & seaside" },
  { slug: "dinosaur-valley", title: "Dinosaur Valley", theme: "Dinosaurs" },
  { slug: "space-adventure", title: "Space Adventure", theme: "Space" },
];

export const sheetPdf = (s: ColouringSheet) => `/colouring/${s.slug}.pdf`;
export const sheetPicture = (s: ColouringSheet) => `/colouring/${s.slug}.jpg`;
