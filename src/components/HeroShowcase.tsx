import {
  Chrome,
  AppMetier,
  Modernisation,
  Digitalisation,
  Maintenance,
} from "@/components/ServicePreview";

// ============================================================
// Vitrine du hero : les 4 scènes des services se succèdent en
// boucle sans fin (fondus croisés toutes les 7 s — classes
// pv-scene-* dans globals.css). Pur CSS, décoratif (aria-hidden).
// Sans animation : la scène 1 (tableau de bord) reste affichée.
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
      {/* Transition entre les scènes : voile blanc + spinner qui
          tourne, puis coche validée — dans la fin de chaque quart */}
      <g className="pv-trans">
        <rect x="0" y="26" width="400" height="194" fill="#ffffff" opacity="0.94" />
      </g>
      <g className="pv-spin-vis">
        <g className="pv-rotate">
          <circle
            cx="200"
            cy="118"
            r="16"
            stroke="rgb(var(--bordeaux) / 0.12)"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M200 102a16 16 0 0 1 16 16"
            stroke="rgb(var(--accent))"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>
      {/* Feu d'artifice : grands rayons + étincelles qui jaillissent
          de la coche dans toutes les directions (ça pétille !) */}
      <g className="pv-burst" stroke="none" fill="none">
        <g strokeWidth="3" strokeLinecap="round">
          <path d="M226 118h22" stroke="rgb(var(--coral))" />
          <path d="M218 100l16 -16" stroke="rgb(var(--orange))" />
          <path d="M200 92v-22" stroke="rgb(var(--accent))" />
          <path d="M182 100l-16 -16" stroke="rgb(var(--coral))" />
          <path d="M174 118h-22" stroke="rgb(var(--orange))" />
          <path d="M182 136l-16 16" stroke="rgb(var(--accent))" />
          <path d="M200 144v22" stroke="rgb(var(--coral))" />
          <path d="M218 136l16 16" stroke="rgb(var(--orange))" />
        </g>
        <circle cx="238" cy="88" r="3" fill="rgb(var(--orange))" />
        <circle cx="162" cy="88" r="3" fill="rgb(var(--coral))" />
        <circle cx="162" cy="148" r="3" fill="rgb(var(--accent))" />
        <circle cx="238" cy="148" r="3" fill="rgb(var(--orange))" />
        <circle cx="200" cy="80" r="2.5" fill="rgb(var(--coral))" />
        <circle cx="200" cy="156" r="2.5" fill="rgb(var(--orange))" />
      </g>
      <g className="pv-ok">
        <circle cx="200" cy="118" r="16" fill="rgb(var(--orange) / 0.15)" />
        <path
          d="M191 118l6 6 12 -12"
          stroke="rgb(var(--orange))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      <Chrome url="mailys-solutions.fr" />
    </svg>
  );
}
