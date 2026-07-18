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
      className="hero-panel relative aspect-[4/3] w-full overflow-hidden rounded-[28px] shadow-window"
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
      {/* Bordure identique en pixels sur les 4 côtés : la carte prend
          tout l'espace restant → elle suit le format paysage du cadre. */}
      <div className="hero-card absolute inset-8 flex flex-col items-center justify-center gap-5 rounded-[26px] sm:inset-12">
        <svg
          viewBox="0 0 132 104"
          className="h-16 w-auto sm:h-20"
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
          <span className="text-3xl font-extrabold tracking-[0.13em] text-foreground sm:text-4xl">
            MAILYS
          </span>
          <span className="mt-2 text-xs font-semibold tracking-[0.44em] text-coral sm:text-sm">
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
