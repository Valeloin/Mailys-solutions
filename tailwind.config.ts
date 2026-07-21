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
        // Largeur maîtresse des sections. Fortement élargie (72 → 110rem)
        // pour occuper l'essentiel des grands écrans et supprimer les
        // marges vides. Les lignes de texte restent capées ailleurs
        // (titres, paragraphes, colonnes 0.5fr), donc élargir ne fait
        // qu'écarter les blocs, pas rallonger les lignes.
        // NB : toute modif de cette valeur exige un REDÉMARRAGE du serveur
        // de dev — Tailwind ne lit sa config qu'au démarrage.
        content: "110rem",
      },
    },
  },
  plugins: [],
};
export default config;
