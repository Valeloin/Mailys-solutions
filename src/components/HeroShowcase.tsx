import {
  Chrome,
  AppMetier,
  Modernisation,
  Digitalisation,
  Maintenance,
} from "@/components/ServicePreview";

// ============================================================
// Vitrine du hero : les 4 vignettes dédiées des services se
// succèdent en boucle (fondus croisés doux toutes les 8,4 s —
// classes pv-scene-* dans globals.css). Pur CSS, décoratif
// (aria-hidden). Sans animation : la scène 1 reste affichée.
// Pas d'interstitiel : on passe directement d'une vignette à
// l'autre, chacune racontant son service.
// ============================================================
export default function HeroShowcase() {
  return (
    <svg
      viewBox="0 0 400 220"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full rounded-xl"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="220" fill="#ffffff" />
      <g className="pv-scene-1">
        <AppMetier />
      </g>
      <g className="pv-scene-2">
        <Modernisation />
      </g>
      <g className="pv-scene-3">
        <Digitalisation />
      </g>
      <g className="pv-scene-4">
        <Maintenance />
      </g>
      <Chrome url="votre-solution.fr" />
    </svg>
  );
}
