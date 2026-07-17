// ============================================================
// Carte de marque du hero — pièce maîtresse de l'accueil.
// Structure : un grand carré blanc (le logo) qui flotte dans
// un rectangle au dégradé chaud travaillé (corail → rouge →
// orange, avec halos, pastilles et barres fantômes de la DA).
// Climax lent : un reflet balaie toute la carte et fait glisser
// la lumière sur le lettrage « MAILYS SOLUTIONS ».
// 100 % CSS, décoratif (aria-hidden). Animations coupées par
// prefers-reduced-motion → carte figée, logo net, zéro CLS.
// (Remplace l'ancienne vitrine HeroShowcase, réservée à la
//  page Services — ne rien y toucher.)
// ============================================================
export default function HeroBrandCard() {
  return (
    <div
      aria-hidden="true"
      className="hero-panel relative aspect-square w-full overflow-hidden rounded-[28px] shadow-window"
    >
      {/* Halos chauds qui respirent (scintillement d'opacité, pas de scale) */}
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      {/* Spot doux qui soulève la carte */}
      <div className="hero-spot" />
      {/* Barres fantômes du logo, inclinées à -22° */}
      <div className="hero-ghost hero-ghost-1" />
      <div className="hero-ghost hero-ghost-2" />

      {/* Carte blanche centrale : grand carré, le logo complet */}
      <div className="hero-card absolute left-1/2 top-1/2 flex aspect-square w-[66%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-6 rounded-[26px]">
        <svg
          viewBox="0 0 132 104"
          className="h-24 w-auto sm:h-28"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className="hero-dot hero-dot-1"
            cx="15"
            cy="87"
            r="14"
            fill="rgb(var(--orange))"
          />
          <rect
            x="30"
            y="6"
            width="30"
            height="92"
            rx="15"
            fill="rgb(var(--coral))"
            transform="rotate(-22 45 52)"
          />
          <rect
            x="72"
            y="6"
            width="30"
            height="92"
            rx="15"
            fill="rgb(var(--accent))"
            transform="rotate(-22 87 52)"
          />
          <circle
            className="hero-dot hero-dot-2"
            cx="117"
            cy="17"
            r="14"
            fill="rgb(var(--orange))"
          />
        </svg>
        <div className="flex flex-col items-center leading-none">
          <span className="text-4xl font-extrabold tracking-[0.13em] text-bordeaux sm:text-5xl">
            MAILYS
          </span>
          <span className="mt-2.5 text-sm font-semibold tracking-[0.44em] text-coral sm:text-base">
            SOLUTIONS
          </span>
        </div>
      </div>

      {/* Liseré interne : arête de lumière en haut + hairline (détail premium) */}
      <div className="hero-ring" />
      {/* Reflet : la lumière balaie toute la surface — carte comprise —
          et fait glisser un éclat sur le lettrage (mix-blend screen) */}
      <div className="hero-gloss" />
    </div>
  );
}
