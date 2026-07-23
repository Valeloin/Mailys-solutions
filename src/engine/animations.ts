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

function parDeclencheur(anims: Animation[] | undefined, declencheur: NonNullable<Animation["declencheur"]>): Animation[] {
  return (anims ?? []).filter((a) => (a.declencheur ?? "au-chargement") === declencheur);
}

function empiler(anims: Animation[]): string | undefined {
  const parts = anims.map(animationEnCss).filter(Boolean) as string[];
  return parts.length ? parts.join(", ") : undefined;
}

/** Empile les animations qui se jouent AU CHARGEMENT (le défaut) en une valeur CSS. */
export function animationsEnCss(anims?: Animation[]): string | undefined {
  return empiler(parDeclencheur(anims, "au-chargement"));
}

/** Animations à jouer au SURVOL — appliquées via une règle `:hover`, jamais en style inline. */
export function animationsSurvolEnCss(anims?: Animation[]): string | undefined {
  return empiler(parDeclencheur(anims, "au-survol"));
}

/** Animations à jouer au DÉFILEMENT — déclenchées quand le bloc entre dans le viewport. */
export function animationsDefilementEnCss(anims?: Animation[]): string | undefined {
  return empiler(parDeclencheur(anims, "au-defilement"));
}
