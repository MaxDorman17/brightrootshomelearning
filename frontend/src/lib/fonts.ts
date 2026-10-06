import { Atkinson_Hyperlegible, Bangers, Caveat, Fraunces } from "next/font/google";

/** Serif for headings on the public pages. */
export const serif = Fraunces({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-serif" });

/** Handwriting for the little notes scattered round the public pages. */
export const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], display: "swap" });

/** An easy-read font for anyone who finds the usual letters hard to tell apart. Switched on in a person's settings. */
export const easyRead = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-easy" });

/** Big, bold comic-book lettering for the Saplings comics. */
export const comic = Bangers({ subsets: ["latin"], weight: "400", display: "swap" });
