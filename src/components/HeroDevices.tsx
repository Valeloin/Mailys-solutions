// ============================================================
// Scène « appareils » du hero — portée depuis la MethodShowcase du
// site OHIHO, mais REMANIÉE aux couleurs de Mailys Solutions.
// Un téléphone + un ordinateur portable, vus de trois quarts
// (projection orthographique, cf. le transform plus bas), dont les
// dalles jouent 4 saynètes qui défilent en boucle :
//   1. Échange initial        (bulles de conversation)
//   2. Maquette & devis        (le cadre se trace, le montant s'inscrit)
//   3. Développement           (les lignes de code s'écrivent, jalons cochés)
//   4. Mise en ligne & suivi   (la jauge se remplit, l'enveloppe arrive)
// L'emblème Mailys apparaît au centre des écrans à la mise en ligne.
// 100 % CSS (classes mv-* / mv-scene-* dans globals.css), aucun JS :
// reste un server component. Décoratif → aria-hidden.
// prefers-reduced-motion : seule la scène 1 reste affichée, figée.
// ============================================================

// Palette Mailys. RAIL = structure/inactif (taupe chaud, lisible sur la
// dalle sombre) ; le trio corail / rouge / orange porte les accents et
// l'emblème, comme le logo.
const RAIL = "#9d6b64";
const CORAL = "#ff6b6b";
const ACCENT = "#e11d2a";
const ORANGE = "#f97316";

/* Emblème Mailys, redessiné ici (le composant Logo porte son propre SVG,
   l'inclure dans celui-ci ferait un SVG imbriqué inutile). Même géométrie
   que le logo officiel : deux barres inclinées à -22°, deux points. Posé
   DANS les écrans, il subit la perspective du SVG comme le reste — c'est
   bien le logo du site en train de naître qui s'affiche. */
function Emblem({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const W = 2.6 * r; // largeur cible de la marque
  const s = W / 132; // la marque est dessinée dans une boîte de 132×104
  const H = 104 * s;
  return (
    <g transform={`translate(${cx - W / 2} ${cy - H / 2}) scale(${s})`}>
      <circle cx="15" cy="87" r="14" fill={ORANGE} />
      <rect x="30" y="6" width="30" height="92" rx="15" fill={CORAL} transform="rotate(-22 45 52)" />
      <rect x="72" y="6" width="30" height="92" rx="15" fill={ACCENT} transform="rotate(-22 87 52)" />
      <circle cx="117" cy="17" r="14" fill={ORANGE} />
    </g>
  );
}

/* 01 — Échange initial : la conversation s'installe. */
function Echange() {
  return (
    <g>
      <g className="mv mv-bubble-1">
        <rect x="24" y="34" width="96" height="18" rx="9" fill={RAIL} />
      </g>
      <g className="mv mv-bubble-2">
        <rect x="112" y="58" width="80" height="18" rx="9" fill={CORAL} opacity="0.85" />
      </g>
      <g className="mv mv-bubble-3">
        <rect x="24" y="82" width="110" height="18" rx="9" fill={RAIL} />
      </g>
    </g>
  );
}

/* 02 — Maquette & devis : le cadre se trace, le montant s'inscrit. */
function Maquette() {
  return (
    <g>
      <rect
        className="mv mv-draw"
        x="24"
        y="28"
        width="120"
        height="72"
        rx="6"
        pathLength={1}
        fill="none"
        stroke={CORAL}
        strokeWidth="2"
      />
      <rect x="158" y="34" width="58" height="6" rx="3" fill={RAIL} />
      <rect x="158" y="48" width="42" height="6" rx="3" fill={RAIL} />
      <rect className="mv mv-amount" x="158" y="70" width="58" height="10" rx="5" fill={ORANGE} />
    </g>
  );
}

/* 03 — Développement : les lignes de code s'écrivent à gauche, une
   colonne de jalons se coche à droite (les points d'étape). */
function Developpement() {
  const lignes = [
    { y: 32, w: 92, x: 24, fill: RAIL, delay: "0s" },
    { y: 48, w: 68, x: 38, fill: CORAL, delay: "-0.1s" },
    { y: 64, w: 104, x: 38, fill: RAIL, delay: "-0.2s" },
    { y: 80, w: 54, x: 52, fill: ACCENT, delay: "-0.3s" },
    { y: 96, w: 84, x: 24, fill: RAIL, delay: "-0.4s" },
  ];
  const jalons = [
    { y: 36, delay: "-0.1s" },
    { y: 60, delay: "-0.25s" },
    { y: 84, delay: "-0.4s" },
  ];
  return (
    <g>
      {lignes.map((l) => (
        <rect
          key={l.y}
          className="mv mv-code"
          x={l.x}
          y={l.y}
          width={l.w}
          height="7"
          rx="3.5"
          fill={l.fill}
          style={{ animationDelay: l.delay }}
        />
      ))}

      {/* Colonne des points d'étape, séparée du code par un filet. */}
      <path d="M152 28v80" stroke={RAIL} strokeWidth="1.5" opacity="0.6" />
      {jalons.map((j) => (
        <g key={j.y}>
          <rect x="168" y={j.y} width="48" height="6" rx="3" fill={RAIL} />
          <path
            className="mv mv-code"
            d={`M${164} ${j.y + 3}l3 3 5 -6`}
            transform="translate(-8 0)"
            pathLength={1}
            fill="none"
            stroke={ORANGE}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animationDelay: j.delay }}
          />
        </g>
      ))}
    </g>
  );
}

/* 04 — Mise en ligne & suivi : la jauge se remplit et se valide, puis
   l'enveloppe arrive (le suivi qui prend le relais). Le milieu de
   l'écran est laissé libre pour l'emblème qui apparaît entre les deux. */
function EnLigne() {
  return (
    <g>
      <rect x="24" y="6" width="150" height="10" rx="5" fill={RAIL} />
      <rect className="mv mv-deploy" x="24" y="6" width="150" height="10" rx="5" fill={ORANGE} />
      <path
        className="mv mv-done"
        d="M190 11l7 7 14 -14"
        pathLength={1}
        fill="none"
        stroke={ORANGE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g className="mv mv-follow" style={{ animationDelay: "0.35s" }}>
        <rect x="105" y="102" width="34" height="20" rx="4" fill="none" stroke={CORAL} strokeWidth="2" />
        <path
          d="M105 105l17 10 17 -10"
          fill="none"
          stroke={CORAL}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

/* Échos sur le téléphone : la même étape, réduite à l'essentiel. */
function TelEchange() {
  return (
    <g>
      <g className="mv mv-bubble-1">
        <rect x="8" y="14" width="36" height="9" rx="4.5" fill={RAIL} />
      </g>
      <g className="mv mv-bubble-2">
        <rect x="18" y="29" width="30" height="9" rx="4.5" fill={CORAL} opacity="0.85" />
      </g>
      <g className="mv mv-bubble-3">
        <rect x="8" y="44" width="40" height="9" rx="4.5" fill={RAIL} />
      </g>
    </g>
  );
}
function TelMaquette() {
  return (
    <g>
      <rect
        className="mv mv-draw"
        x="8"
        y="12"
        width="40"
        height="30"
        rx="4"
        pathLength={1}
        fill="none"
        stroke={CORAL}
        strokeWidth="2"
      />
      <rect className="mv mv-amount" x="8" y="50" width="40" height="7" rx="3.5" fill={ORANGE} />
    </g>
  );
}
function TelDeveloppement() {
  const l = [
    { y: 14, w: 42, x: 8, delay: "0s" },
    { y: 26, w: 30, x: 14, delay: "-0.2s" },
    { y: 38, w: 38, x: 14, delay: "-0.4s" },
  ];
  return (
    <g>
      {l.map((x) => (
        <rect
          key={x.y}
          className="mv mv-code"
          x={x.x}
          y={x.y}
          width={x.w}
          height="6"
          rx="3"
          fill={x.y === 26 ? CORAL : RAIL}
          style={{ animationDelay: x.delay }}
        />
      ))}
    </g>
  );
}
function TelEnLigne() {
  return (
    <g>
      <rect x="8" y="4" width="44" height="8" rx="4" fill={RAIL} />
      <rect className="mv mv-deploy" x="8" y="4" width="44" height="8" rx="4" fill={ORANGE} />
      <path
        className="mv mv-done"
        d="M20 22l6 6 12 -12"
        pathLength={1}
        fill="none"
        stroke={ORANGE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

const SCENES = [Echange, Maquette, Developpement, EnLigne];
const SCENES_TEL = [TelEchange, TelMaquette, TelDeveloppement, TelEnLigne];

export default function HeroDevices() {
  return (
    // ⚠️ AUCUNE `perspective` sur le parent : CSS projette alors les
    // rotations 3D en ORTHOGRAPHIQUE (pas de point de fuite), donc le
    // contenu prend exactement le même angle que le châssis qui l'affiche.
    <svg
      viewBox="-96 0 416 198"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full origin-center drop-shadow-[0_22px_38px_rgba(20,4,8,0.55)] [transform:rotateY(-30deg)_rotateX(8deg)]"
    >
      <defs>
        {/* Dalle allumée, réchauffée : un dégradé bordeaux → noir chaud,
            éclairé par le haut-gauche comme un écran dans une pièce sombre. */}
        <linearGradient id="hd-screen" x1="0" y1="0" x2="0.7" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#3a1a20" />
          <stop offset="0.55" stopColor="#241016" />
          <stop offset="1" stopColor="#16080d" />
        </linearGradient>

        {/* Reflet de verre : bande claire diagonale par-dessus le contenu. */}
        <linearGradient id="hd-glare" x1="0" y1="0" x2="0.9" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="0.75" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Détourages : le contenu ne peut pas déborder de sa dalle. */}
        <clipPath id="hd-clip-tel">
          <rect x="-88" y="60" width="74" height="132" rx="12" />
        </clipPath>
        <clipPath id="hd-clip-portable">
          <rect x="30" y="26" width="260" height="132" rx="10" />
        </clipPath>
      </defs>

      {/* ---- Téléphone, devant et à gauche du portable ---- */}
      <rect x="-88" y="60" width="74" height="132" rx="12" fill="url(#hd-screen)" stroke={RAIL} strokeWidth="2" />
      <path d="M-64 70h26" stroke={RAIL} strokeWidth="3" strokeLinecap="round" />
      <g clipPath="url(#hd-clip-tel)">
        {/* Chrome permanent : en-tête + barre d'accueil, hors des étapes. */}
        <rect x="-76" y="76" width="30" height="6" rx="3" fill={RAIL} opacity="0.8" />
        <circle cx="-22" cy="79" r="3" fill={RAIL} />
        <rect x="-62" y="184" width="24" height="3" rx="1.5" fill={RAIL} />

        {/* Emblème centré, DERRIÈRE la scène. */}
        <g className="mv-brand">
          <Emblem cx={-51} cy={146} r={18} />
        </g>
        <g transform="translate(-84 82)">
          {SCENES_TEL.map((Scene, i) => (
            <g key={i} className={`mv-scene-${i + 1}`}>
              <Scene />
            </g>
          ))}
        </g>
        <rect x="-88" y="60" width="74" height="132" rx="12" fill="url(#hd-glare)" />
      </g>

      {/* ---- Ordinateur portable ---- */}
      {/* Pied de l'écran (col + piètement), même matière que le châssis.
          Dessiné AVANT le châssis pour que le bas de celui-ci recouvre le
          haut du col (jointure nette). Tout est DANS le plan de l'écran :
          un disque de socle aurait sous-entendu un sol horizontal absent de
          cette vue à plat — d'où un piètement plat, évasé, qui se plie à la
          même inclinaison que l'écran. */}
      <g>
        {/* Col central */}
        <path d="M153 157 h14 l4 13 h-22 z" fill="#1c0b12" stroke={RAIL} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Socle : barre évasée, arêtes adoucies */}
        <path d="M126 169 h68 q6 0 8 5 l2 4 q1 3 -3 3 h-82 q-4 0 -3 -3 l2 -4 q2 -5 8 -5 z" fill="#231016" stroke={RAIL} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Arête supérieure éclairée du socle */}
        <path d="M128 170 h64" stroke="#3a1a20" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <rect x="30" y="8" width="260" height="150" rx="10" fill="#16080d" stroke={RAIL} strokeWidth="2" />
      <rect x="30" y="26" width="260" height="132" fill="url(#hd-screen)" />
      {/* Barre de fenêtre */}
      <path d="M30 26h260" stroke={RAIL} strokeWidth="2" />
      <circle cx="44" cy="17" r="2.5" fill={RAIL} />
      <circle cx="53" cy="17" r="2.5" fill={RAIL} />
      <circle cx="62" cy="17" r="2.5" fill={RAIL} />
      <rect x="74" y="13.5" width="82" height="7" rx="3.5" fill={RAIL} opacity="0.7" />

      <g clipPath="url(#hd-clip-portable)">
        {/* Chrome d'application : barre latérale, page active en corail. */}
        <path d="M58 26v132" stroke={RAIL} strokeWidth="1.5" opacity="0.5" />
        <rect x="38" y="42" width="12" height="12" rx="3" fill={CORAL} opacity="0.9" />
        <rect x="38" y="62" width="12" height="12" rx="3" fill={RAIL} />
        <rect x="38" y="82" width="12" height="12" rx="3" fill={RAIL} />
        <rect x="38" y="102" width="12" height="12" rx="3" fill={RAIL} />
        <circle cx="44" cy="144" r="7" fill={RAIL} />

        {/* Emblème centré dans la dalle, derrière les scènes. */}
        <g className="mv-brand">
          <Emblem cx={160} cy={90} r={25} />
        </g>

        <g transform="translate(38 30)">
          {SCENES.map((Scene, i) => (
            <g key={i} className={`mv-scene-${i + 1}`}>
              <Scene />
            </g>
          ))}
        </g>

        <rect x="30" y="26" width="260" height="132" fill="url(#hd-glare)" />
      </g>
    </svg>
  );
}
