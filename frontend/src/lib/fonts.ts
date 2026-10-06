/**
 * The site's fonts. The font files live in public/fonts and their styles in src/app/fonts.css, so a
 * build never has to fetch anything from Google (a hiccup there once stopped a deploy).
 * Each font here offers a class that sets the font, and where needed one that sets a CSS variable.
 */
type SiteFont = { className: string; variable: string };

/** The everyday font for the whole site. */
export const nunito: SiteFont = { className: "font-nunito", variable: "" };

/** Serif for headings on the public pages. */
export const serif: SiteFont = { className: "font-fraunces", variable: "font-fraunces-var" };

/** Handwriting for the little notes scattered round the public pages. */
export const hand: SiteFont = { className: "font-caveat", variable: "" };

/** An easy-read font for anyone who finds the usual letters hard to tell apart. Switched on in a person's settings. */
export const easyRead: SiteFont = { className: "font-atkinson", variable: "font-atkinson-var" };

/** Big, bold comic-book lettering for the Saplings comics. */
export const comic: SiteFont = { className: "font-bangers", variable: "" };
