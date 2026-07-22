// Le modèle de blocs Simple Dev.
// Source de vérité : docs/modele-simple-dev.md

export type BlockType =
  | "header"
  | "footer"
  | "section"
  | "titre"
  | "texte"
  | "bouton"
  | "image"
  | "forme"
  | "groupe"
  | "animation"
  | "interrupteur"
  | "icone"
  | "champ"
  | "zonetexte";

/** Une animation = une entrée du catalogue + ses réglages. */
export interface Animation {
  effet: string; // clé du catalogue (ex: "apparition-fondu", "translation")
  declencheur?: "au-chargement" | "au-survol" | "au-defilement";
  duree?: number; // millisecondes
  delai?: number; // millisecondes
  boucle?: boolean;
  // paramètres libres selon l'effet
  [param: string]: unknown;
}

/** L'unité de base. Identité stable via `id`. */
export interface Block {
  id: string;
  type: BlockType;
  style?: Record<string, string | number>;
  content?: Record<string, unknown>;
  animations?: Animation[]; // porté surtout par les blocs "animation"
  // Style brut (objet CSS camelCase) produit par l'extension au moment d'enregistrer.
  // Appliqué tel quel par-dessus les défauts → aller-retour écran ↔ données fidèle.
  css?: Record<string, string>;
  // Style appliqué AU SURVOL de la souris (objet CSS camelCase). Rendu via une
  // règle `[data-sd-id]:hover{…}` car un pseudo-état n'existe pas en style inline.
  hover?: Record<string, string>;
  // Exceptions appliquées sur MOBILE (≤ 767px), via une règle @media. Ne touchent
  // jamais la version ordinateur.
  mobile?: Record<string, string>;
  // Bloc verrouillé : structure native de la page, insupprimable dans l'extension.
  verrou?: boolean;
  children?: Block[];
}

/** Une page = une liste ordonnée de blocs racine. */
export interface Page {
  id: string;
  titre: string;
  blocks: Block[];
}
