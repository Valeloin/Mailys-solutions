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
      {/* Spinner = pièce signature de la DA : le logo Mailys animé
          (barres qui respirent, points qui pulsent) ceint d'un
          anneau dégradé en rotation — même identité que le spinner
          global de changement de page. */}
      <g className="pv-spin-vis">
        <svg x="160" y="80" width="80" height="76" viewBox="-38 -46 208 196">
          <defs>
            <linearGradient id="pv-ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgb(var(--coral))" />
              <stop offset="0.5" stopColor="rgb(var(--accent))" />
              <stop offset="1" stopColor="rgb(var(--orange))" />
            </linearGradient>
          </defs>
          <g className="pv-rotate">
            <circle
              cx="66"
              cy="52"
              r="90"
              fill="none"
              stroke="url(#pv-ring-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="215 350"
            />
          </g>
          {/* Le logo Mailys : barres verticales (le -22° et la
              respiration viennent des keyframes pt-bar), points pulsants */}
          <circle className="pt-dot-1" cx="15" cy="87" r="14" fill="rgb(var(--orange))" />
          <rect className="pt-bar-1" x="30" y="6" width="30" height="92" rx="15" fill="rgb(var(--coral))" />
          <rect className="pt-bar-2" x="72" y="6" width="30" height="92" rx="15" fill="rgb(var(--accent))" />
          <circle className="pt-dot-2" cx="117" cy="17" r="14" fill="rgb(var(--orange))" />
        </svg>
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
