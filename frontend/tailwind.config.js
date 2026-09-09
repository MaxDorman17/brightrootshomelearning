/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sage: "#3F5D46",
          softsage: "#8FA382",
          cream: "#F7F2E8",
          white: "#FFFDF8",
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
