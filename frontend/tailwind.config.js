/** @type {import('tailwindcss').Config} */

// Brand colours come from CSS variables (see globals.css) so the family theme can swap them.
const themed = (name) => `rgb(var(--brand-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sage: themed("sage"),
          sagedark: themed("sagedark"),
          deep: themed("deep"),
          softsage: themed("softsage"),
          leaf: themed("leaf"),
          lime: themed("lime"),
          tint: themed("tint"),
          mist: themed("mist"),
          wash: themed("wash"),
          cream: themed("cream"),
          white: themed("white"),
          line: themed("line"),
          terracotta: "#D88C64",
          gold: "#E3B554",
          earth: "#6E5A46",
          charcoal: "#2E342F",
        },
      },
    },
  },
  plugins: [],
};
