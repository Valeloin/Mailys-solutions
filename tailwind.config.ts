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
        // Largeur maîtresse des sections. Resserrée à 84rem : 110rem
        // étirait tout (carte du hero démesurée, intro des services
        // projetée loin à droite, grandes bandes vides). 84rem garde des
        // marges franches sur grand écran sans distendre les blocs.
        // L'agencement interne de chaque section est inchangé — ce levier
        // ne fait que rapprocher les bords.
        // NB : toute modif de cette valeur exige un REDÉMARRAGE du serveur
        // de dev — Tailwind ne lit sa config qu'au démarrage.
        content: "84rem",
      },
    },
  },
  plugins: [],
};
export default config;
