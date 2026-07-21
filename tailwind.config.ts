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
        "orange-text": "rgb(var(--orange-text) / <alpha-value>)",
      },
      maxWidth: {
        // Largeur maîtresse des sections. Élargie (72 → 100rem) pour que le
        // contenu respire davantage et laisse moins de marges vides sur
        // grand écran. Un seul point de réglage : agit sur tout le site.
        content: "100rem",
      },
    },
  },
  plugins: [],
};
export default config;
