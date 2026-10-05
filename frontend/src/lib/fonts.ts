import { Bangers, Caveat, Fraunces } from "next/font/google";

/** Serif for headings on the public pages. */
export const serif = Fraunces({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-serif" });

/** Handwriting for the little notes scattered round the public pages. */
export const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], display: "swap" });

/** Big, bold comic-book lettering for the Saplings comics. */
export const comic = Bangers({ subsets: ["latin"], weight: "400", display: "swap" });
