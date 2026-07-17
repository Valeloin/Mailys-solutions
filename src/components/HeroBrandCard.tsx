// ============================================================
// Carte de marque du hero — pièce maîtresse de l'accueil.
// Le logo Mailys Solutions posé sur un dégradé chaud
// (corail → rouge → orange), une carte blanche qui « flotte ».
// Vie discrète : halos qui scintillent (opacité), points du
// logo qui pulsent. Climax lent : un reflet balaie toute la
// carte et révèle « Mailys Solutions » en lumière.
// 100 % CSS, décoratif (aria-hidden). Animations coupées par
// prefers-reduced-motion → carte figée, logo net, zéro CLS.
// (Remplace l'ancienne vitrine HeroShowcase, désormais réservée
//  à la page Services — ne rien y toucher.)
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
      {/* Barres fantômes du logo, inclinées à -22° */}
      <div className="hero-ghost hero-ghost-1" />
      <div className="hero-ghost hero-ghost-2" />

      {/* Reflet : « Mailys Solutions » en lumière, révélé par le
          balayage — placé derrière la carte, dans le bas du panneau */}
      <span className="hero-word-ghost">Mailys Solutions</span>
      <span className="hero-word">Mailys Solutions</span>

      {/* Carte blanche centrale : le logo complet qui flotte */}
      <div className="hero-card absolute left-1/2 top-[42%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-[22px] bg-white px-9 py-8 sm:px-11 sm:py-9">
        <svg
          viewBox="0 0 132 104"
          className="h-14 w-auto sm:h-16"
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
          <span className="text-2xl font-extrabold tracking-[0.14em] text-bordeaux">
            MAILYS
          </span>
          <span className="mt-1.5 text-[11px] font-semibold tracking-[0.42em] text-coral">
            SOLUTIONS
          </span>
        </div>
      </div>

      {/* Gloss : la même lumière balaie toute la surface (calée sur
          le reflet du texte → tout s'illumine ensemble) */}
      <div className="hero-gloss" />
    </div>
  );
}
