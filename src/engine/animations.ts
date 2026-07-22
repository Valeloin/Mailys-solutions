import type { Animation } from "./types";

// Le catalogue d'animations. Extensible : ajouter une entrée ici suffit
// (voir docs/modele-simple-dev.md §14). Chaque effet pointe une keyframe CSS
// définie dans src/engine/engine.css.

export interface CatalogueEntry {
  cle: string;
  nom: string;
  categorie: string;
  keyframe: string;
  dureeDefaut: number; // ms
  easing: string;
}

export const CATALOGUE: Record<string, CatalogueEntry> = {
  "apparition-fondu": {
    cle: "apparition-fondu",
    nom: "Apparition (fondu)",
    categorie: "apparition",
    keyframe: "sd-fade",
    dureeDefaut: 600,
    easing: "ease",
  },
  translation: {
    cle: "translation",
    nom: "Translation",
    categorie: "mouvement",
    keyframe: "sd-slide-x",
    dureeDefaut: 1200,
    easing: "linear",
  },
  rebond: {
    cle: "rebond",
    nom: "Rebond",
    categorie: "mouvement",
    keyframe: "sd-bounce",
    dureeDefaut: 800,
    easing: "ease-in-out",
  },
  clignotement: {
    cle: "clignotement",
    nom: "Clignotement",
    categorie: "attention",
    keyframe: "sd-blink",
    dureeDefaut: 1000,
    easing: "ease-in-out",
  },
};

/** Traduit une animation en valeur CSS `animation` (shorthand). */
export function animationEnCss(anim: Animation): string | null {
  const entry = CATALOGUE[anim.effet];
  if (!entry) return null; // filet anti-bug : effet inconnu → ignoré, jamais d'erreur
  const duree = anim.duree ?? entry.dureeDefaut;
  const delai = anim.delai ?? 0;
  const iterations = anim.boucle ? "infinite" : "1";
  const direction = anim.boucle ? "alternate" : "normal";
  const fill = anim.boucle ? "none" : "both";
  return `${entry.keyframe} ${duree}ms ${entry.easing} ${delai}ms ${iterations} ${direction} ${fill}`;
}

/** Empile plusieurs animations en une seule valeur CSS (elles se jouent ensemble). */
export function animationsEnCss(anims?: Animation[]): string | undefined {
  if (!anims || anims.length === 0) return undefined;
  const parts = anims.map(animationEnCss).filter(Boolean) as string[];
  return parts.length ? parts.join(", ") : undefined;
}
