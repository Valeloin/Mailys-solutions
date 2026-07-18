// ============================================================
// Vitrine du hero — version téléphone.
//
// La vitrine desktop montre une fenêtre de navigateur (barre d'URL,
// menu latéral, tableau de bord large) : transposée telle quelle sur
// un téléphone, elle donne du « PC miniaturisé », illisible et hors
// sujet. Ici la scène est pensée pour le format portrait : une
// maquette de téléphone, peu d'éléments, gros aplats lisibles à
// 200 px de large.
//
// Les 4 services défilent avec les MÊMES horloges que la version
// desktop (classes pv-scene-1..4 de globals.css) : les deux vitrines
// restent synchronisées et il n'y a qu'un jeu d'animations à régler.
// Décoratif (aria-hidden) — sans animation, la scène 1 reste affichée.
// ============================================================

const C = {
  coral: "rgb(var(--coral))",
  accent: "rgb(var(--accent))",
  orange: "rgb(var(--orange))",
  trait: "rgb(var(--bordeaux) / 0.10)",
  plein: "rgb(var(--bordeaux) / 0.22)",
  fond: "rgb(var(--bordeaux) / 0.05)",
};

/** Ligne de liste : pastille + deux barres. Brique commune aux scènes. */
function Ligne({ y, accent }: { y: number; accent?: string }) {
  return (
    <>
      <rect x="26" y={y} width="148" height="26" rx="7" fill={accent ? "#fff" : C.fond} />
      {accent && (
        <rect x="26" y={y} width="148" height="26" rx="7" fill={accent} opacity="0.12" />
      )}
      <circle cx="40" cy={y + 13} r="6" fill={accent || C.plein} opacity={accent ? 1 : 0.5} />
      <rect x="54" y={y + 7} width="62" height="5" rx="2.5" fill={C.plein} />
      <rect x="54" y={y + 15} width="40" height="4" rx="2" fill={C.trait} />
    </>
  );
}

export default function HeroShowcaseMobile() {
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      {/* ---------- Châssis du téléphone ---------- */}
      <rect x="8" y="4" width="184" height="292" rx="26" fill="#fff" />
      <rect
        x="8"
        y="4"
        width="184"
        height="292"
        rx="26"
        fill="none"
        stroke="rgb(var(--bordeaux) / 0.16)"
        strokeWidth="2"
      />
      {/* Encoche */}
      <rect x="78" y="12" width="44" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.14)" />

      {/* ---------- Écran ---------- */}
      <clipPath id="ecran-tel">
        <rect x="16" y="26" width="168" height="248" rx="14" />
      </clipPath>
      <g clipPath="url(#ecran-tel)">
        <rect x="16" y="26" width="168" height="248" fill="#fff" />

        {/* ===== Scène 1 — Application métier ===== */}
        <g className="pv-scene-1">
          <rect x="16" y="26" width="168" height="42" fill={C.accent} opacity="0.10" />
          <rect x="28" y="40" width="74" height="8" rx="4" fill={C.accent} />
          <rect x="28" y="53" width="46" height="5" rx="2.5" fill={C.trait} />
          <circle cx="166" cy="47" r="10" fill={C.accent} opacity="0.16" />
          <Ligne y={80} accent={C.coral} />
          <Ligne y={114} />
          <Ligne y={148} />
          <Ligne y={182} />
          {/* Bouton d'action flottant */}
          <circle cx="158" cy="242" r="17" fill={C.accent} />
          <rect x="150" y="240" width="16" height="4" rx="2" fill="#fff" />
          <rect x="156" y="234" width="4" height="16" rx="2" fill="#fff" />
        </g>

        {/* ===== Scène 2 — Modernisation : l'ancien cède au neuf ===== */}
        <g className="pv-scene-2">
          <rect x="16" y="26" width="168" height="42" fill={C.orange} opacity="0.10" />
          <rect x="28" y="40" width="86" height="8" rx="4" fill={C.orange} />
          <rect x="28" y="53" width="38" height="5" rx="2.5" fill={C.trait} />
          {/* Avant : gris et anguleux */}
          <rect x="26" y="80" width="70" height="88" rx="4" fill={C.fond} />
          <rect x="34" y="92" width="44" height="5" rx="1" fill={C.plein} opacity="0.45" />
          <rect x="34" y="104" width="52" height="5" rx="1" fill={C.plein} opacity="0.45" />
          <rect x="34" y="116" width="38" height="5" rx="1" fill={C.plein} opacity="0.45" />
          <rect x="34" y="128" width="48" height="5" rx="1" fill={C.plein} opacity="0.45" />
          {/* Flèche de bascule */}
          <path
            d="M102 120 h12 m-4 -4 l4 4 l-4 4"
            stroke={C.orange}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Après : coloré et arrondi */}
          <rect x="120" y="80" width="56" height="88" rx="10" fill={C.orange} opacity="0.12" />
          <rect x="128" y="92" width="40" height="7" rx="3.5" fill={C.orange} />
          <rect x="128" y="105" width="30" height="6" rx="3" fill={C.coral} opacity="0.6" />
          <rect x="128" y="117" width="36" height="6" rx="3" fill={C.accent} opacity="0.5" />
          <rect x="128" y="140" width="40" height="18" rx="9" fill={C.orange} opacity="0.85" />
          <Ligne y={186} accent={C.orange} />
        </g>

        {/* ===== Scène 3 — Digitalisation : le papier devient coches ===== */}
        <g className="pv-scene-3">
          <rect x="16" y="26" width="168" height="42" fill={C.coral} opacity="0.10" />
          <rect x="28" y="40" width="80" height="8" rx="4" fill={C.coral} />
          <rect x="28" y="53" width="52" height="5" rx="2.5" fill={C.trait} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect
                x="26"
                y={82 + i * 38}
                width="148"
                height="30"
                rx="8"
                fill={i < 3 ? C.coral : C.fond}
                opacity={i < 3 ? 0.1 : 1}
              />
              {i < 3 ? (
                <>
                  <circle cx="44" cy={97 + i * 38} r="9" fill={C.coral} />
                  <path
                    d={`M39 ${97 + i * 38} l4 4 l7 -8`}
                    stroke="#fff"
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                <circle
                  cx="44"
                  cy={97 + i * 38}
                  r="9"
                  fill="none"
                  stroke={C.plein}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              )}
              <rect x="60" y={90 + i * 38} width="70" height="6" rx="3" fill={C.plein} />
              <rect x="60" y={101 + i * 38} width="44" height="4" rx="2" fill={C.trait} />
            </g>
          ))}
        </g>

        {/* ===== Scène 4 — Maintenance : tout est sous contrôle ===== */}
        <g className="pv-scene-4">
          <rect x="16" y="26" width="168" height="42" fill={C.accent} opacity="0.10" />
          <rect x="28" y="40" width="92" height="8" rx="4" fill={C.accent} />
          <rect x="28" y="53" width="44" height="5" rx="2.5" fill={C.trait} />
          {/* Carte d'état */}
          <rect x="26" y="82" width="148" height="72" rx="12" fill={C.accent} opacity="0.08" />
          <circle cx="62" cy="118" r="22" fill="#fff" />
          <circle cx="62" cy="118" r="22" fill={C.accent} opacity="0.14" />
          <path
            d="M53 118 l6 6 l12 -13"
            stroke={C.accent}
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="94" y="106" width="62" height="8" rx="4" fill={C.accent} opacity="0.75" />
          <rect x="94" y="120" width="44" height="6" rx="3" fill={C.trait} />
          {/* Barres de suivi */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={30 + i * 29}
              y={230 - [26, 40, 20, 48, 34][i]}
              width="18"
              height={[26, 40, 20, 48, 34][i]}
              rx="5"
              fill={[C.coral, C.accent, C.orange, C.accent, C.coral][i]}
              opacity="0.55"
            />
          ))}
          <rect x="26" y="238" width="148" height="4" rx="2" fill={C.trait} />
        </g>

        {/* Voile de transition entre les scènes (même horloge que desktop) */}
        <g className="pv-trans">
          <rect x="16" y="26" width="168" height="248" fill="#fff" opacity="0.94" />
        </g>
      </g>

      {/* Barre d'accueil */}
      <rect x="76" y="282" width="48" height="4" rx="2" fill="rgb(var(--bordeaux) / 0.18)" />
    </svg>
  );
}
