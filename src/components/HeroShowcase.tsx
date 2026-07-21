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
      {/* Transition entre les scènes : voile blanc + spinner qui
          tourne, puis coche validée — dans la fin de chaque quart */}
      <g className="pv-trans">
        <rect x="0" y="26" width="400" height="194" fill="#ffffff" opacity="0.94" />
      </g>
      {/* Spinner = pièce signature de la DA : le logo Mailys NET, ceint
          d'un anneau dégradé (corail → rouge → orange) en rotation —
          même identité, et mêmes principes, que le spinner global de
          changement de page. Le logo ne se déforme pas ; seul l'anneau
          tourne. */}
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
          {/* Le logo Mailys, NET et à sa vraie inclinaison (-22°, même
              géométrie que le composant officiel et que HeroBrandCard).
              L'inclinaison est portée en dur par transform=rotate, et non
              plus par un CSS .pt-bar-* aujourd'hui supprimé — sans quoi
              les barres retombaient à la verticale et le logo se trouvait
              déformé. Le mouvement de chargement vient de l'anneau qui
              tourne au-dessus ; le logo, lui, ne se déforme jamais. */}
          <circle cx="15" cy="87" r="14" fill="rgb(var(--orange))" />
          <rect x="30" y="6" width="30" height="92" rx="15" fill="rgb(var(--coral))" transform="rotate(-22 45 52)" />
          <rect x="72" y="6" width="30" height="92" rx="15" fill="rgb(var(--accent))" transform="rotate(-22 87 52)" />
          <circle cx="117" cy="17" r="14" fill="rgb(var(--orange))" />
        </svg>
      </g>
      {/* Feu d'artifice : grands rayons qui jaillissent de la coche
          dans toutes les directions (ça pétille !) */}
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
      <Chrome url="votre-solution.fr" />
    </svg>
  );
}
