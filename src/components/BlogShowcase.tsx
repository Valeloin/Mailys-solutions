// ============================================================
// Décor animé du hero Blog — une pile de cartes d'article :
// deux fantômes qui lévitent derrière, une carte « à la une »
// devant dont le contenu se rédige (lignes qui poussent), avec
// bandeau de couverture, tag de rubrique, barre de lecture qui
// progresse et balayage lumineux. 100 % SVG/CSS, aria-hidden.
// ============================================================

export default function BlogShowcase() {
  return (
    <svg
      viewBox="0 0 460 380"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full [filter:drop-shadow(0_30px_60px_rgb(91_15_26/0.18))]"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="blog-cover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--coral))" />
          <stop offset="0.55" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--orange))" />
        </linearGradient>
        <linearGradient id="blog-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="blog-card-clip">
          <rect x="70" y="44" width="320" height="300" rx="18" />
        </clipPath>
      </defs>

      {/* --- Cartes fantômes derrière, en lévitation --- */}
      <g className="pv-float-slow" style={{ transformOrigin: "230px 200px" }}>
        <rect
          x="104"
          y="70"
          width="300"
          height="270"
          rx="18"
          fill="#fff"
          stroke="rgb(var(--border))"
          transform="rotate(6 254 205)"
          opacity="0.55"
        />
      </g>
      <g className="pv-float" style={{ transformOrigin: "210px 200px" }}>
        <rect
          x="56"
          y="66"
          width="300"
          height="270"
          rx="18"
          fill="#fff"
          stroke="rgb(var(--border))"
          transform="rotate(-5 206 201)"
          opacity="0.8"
        />
      </g>

      {/* --- Carte « à la une » --- */}
      <g>
        <rect x="70" y="44" width="320" height="300" rx="18" fill="#fff" stroke="rgb(var(--border))" />
        <g clipPath="url(#blog-card-clip)">
          {/* Bandeau de couverture */}
          <rect x="70" y="44" width="320" height="104" fill="url(#blog-cover)" />
          {/* Motif : barres du logo en filigrane sur le bandeau */}
          <rect x="330" y="20" width="20" height="90" rx="10" fill="#fff" opacity="0.12" transform="rotate(-22 340 65)" />
          <rect x="356" y="26" width="20" height="90" rx="10" fill="#fff" opacity="0.1" transform="rotate(-22 366 71)" />
          {/* Tag de rubrique */}
          <rect x="88" y="118" width="92" height="20" rx="10" fill="#fff" />
          <circle cx="100" cy="128" r="3" fill="rgb(var(--accent))" />
          <rect x="108" y="125" width="60" height="6" rx="3" fill="rgb(var(--bordeaux) / 0.35)" />

          {/* Titre de l'article (deux barres épaisses) */}
          <rect x="88" y="164" width="220" height="12" rx="6" fill="rgb(var(--bordeaux) / 0.75)" />
          <rect x="88" y="184" width="150" height="12" rx="6" fill="rgb(var(--bordeaux) / 0.55)" />

          {/* Corps qui se rédige (lignes qui poussent) */}
          <g style={{ transformOrigin: "88px 0" }}>
            <rect className="pv-write" x="88" y="214" width="284" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.14)" style={{ transformBox: "fill-box", transformOrigin: "left" }} />
            <rect className="pv-write" x="88" y="230" width="284" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.14)" style={{ transformBox: "fill-box", transformOrigin: "left", animationDelay: "0.5s" }} />
            <rect className="pv-write" x="88" y="246" width="220" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.14)" style={{ transformBox: "fill-box", transformOrigin: "left", animationDelay: "1s" }} />
          </g>

          {/* Pied : avatar + méta + barre de lecture */}
          <circle cx="98" cy="292" r="10" fill="rgb(var(--coral) / 0.25)" />
          <rect x="116" y="286" width="70" height="6" rx="3" fill="rgb(var(--bordeaux) / 0.22)" />
          <rect x="116" y="297" width="46" height="5" rx="2.5" fill="rgb(var(--bordeaux) / 0.12)" />
          <rect x="88" y="318" width="284" height="6" rx="3" fill="rgb(var(--bordeaux) / 0.08)" />
          <rect className="pv-read" x="88" y="318" width="284" height="6" rx="3" fill="rgb(var(--accent) / 0.8)" style={{ transformBox: "fill-box", transformOrigin: "left" }} />

          {/* Balayage lumineux */}
          <rect className="pv-sweep" x="70" y="44" width="90" height="300" fill="url(#blog-sweep)" style={{ transformBox: "fill-box" }} />
        </g>
      </g>
    </svg>
  );
}
