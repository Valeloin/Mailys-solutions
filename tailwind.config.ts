import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Toutes les couleurs viennent des variables CSS de globals.css :
      // un seul endroit à modifier pour changer la palette du site.
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        border: "var(--border)",
        muted: "var(--muted)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-dark": "rgb(var(--accent-dark) / <alpha-value>)",
        bordeaux: "rgb(var(--bordeaux) / <alpha-value>)",
        coral: "rgb(var(--coral) / <alpha-value>)",
        orange: "rgb(var(--orange) / <alpha-value>)",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};
export default config;
