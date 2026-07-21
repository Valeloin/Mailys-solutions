// ============================================================
// Vignettes animées des 4 services — même langage visuel que le
// mockup du hero (fenêtre stylisée, 100 % SVG, aucune image) et
// que les vignettes du site OHIHO dont elles s'inspirent, mais :
// - aux couleurs de la DA Mailys (thème clair)
// - animées en PUR CSS (classes pv-* dans globals.css, zéro JS)
// - coupées par prefers-reduced-motion (état final affiché)
// Décoratives : aria-hidden, le texte des cartes porte le sens.
// ============================================================

export function Chrome({
  url,
  urlSwap,
}: {
  url?: string;
  /** [avant, après] : l'URL change en même temps que la scène
      bascule (mêmes horloges pv-old / pv-new de 8,4 s). */
  urlSwap?: [string, string];
}) {
  return (
    <>
      <rect width="400" height="26" fill="rgb(var(--coral) / 0.22)" />
      <circle className="pv-dot" cx="16" cy="13" r="4" fill="rgb(var(--coral))" />
      <circle className="pv-dot" style={{ animationDelay: "0.4s" }} cx="30" cy="13" r="4" fill="rgb(var(--orange))" />
      <circle className="pv-dot" style={{ animationDelay: "0.8s" }} cx="44" cy="13" r="4" fill="rgb(var(--accent))" />
      {url || urlSwap ? (
        <>
          <rect x="130" y="5" width="160" height="16" rx="8" fill="rgb(var(--orange) / 0.22)" />
          {urlSwap ? (
            <>
              <text
                className="pv-old"
                x="210"
                y="16.5"
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="rgb(var(--accent) / 0.65)"
              >
                {urlSwap[0]}
              </text>
              <text
                className="pv-new"
                x="210"
                y="16.5"
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="rgb(var(--coral) / 0.65)"
              >
                {urlSwap[1]}
              </text>
            </>
          ) : (
            <text
              x="210"
              y="16.5"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="rgb(var(--orange) / 0.65)"
            >
              {url}
            </text>
          )}
        </>
      ) : (
        <rect x="150" y="7" width="120" height="12" rx="6" fill="rgb(var(--accent) / 0.22)" />
      )}
    </>
  );
}

/* --- 1. Application métier : le menu change d'onglet, le contenu
       bascule (tuiles + barres → courbe qui se trace) --- */
export function AppMetier() {
  // Variantes a/b/c + délais irréguliers = mouvement anarchique de
  // données vivantes (jamais de vague synchronisée).
  const bars = [
    { x: 205, h: 56, fill: "rgb(var(--coral) / 0.7)", variant: "pv-bar-a", delay: "0s" },
    { x: 237, h: 40, fill: "rgb(var(--coral) / 0.9)", variant: "pv-bar-c", delay: "0.6s" },
    { x: 269, h: 62, fill: "rgb(var(--orange) / 0.8)", variant: "pv-bar-b", delay: "0.15s" },
    { x: 301, h: 46, fill: "rgb(var(--accent) / 0.85)", variant: "pv-bar-a", delay: "1.1s" },
    { x: 333, h: 58, fill: "rgb(var(--accent) / 0.65)", variant: "pv-bar-c", delay: "0.35s" },
  ];
  return (
    <>
      {/* Barre latérale : l'indicateur d'onglet actif se déplace */}
      <rect x="0" y="26" width="60" height="194" fill="rgb(var(--coral) / 0.22)" />
      <rect className="pv-side" x="8" y="41" width="44" height="14" rx="7" fill="rgb(var(--accent) / 0.15)" />
      {/* La couleur active suit l'indicateur d'onglet */}
      <rect className="pv-tab-1" x="13" y="44" width="34" height="8" rx="4" fill="rgb(var(--accent) / 0.7)" />
      <rect className="pv-tab-2" x="13" y="64" width="34" height="7" rx="3.5" fill="rgb(var(--orange) / 0.5)" />
      <rect x="13" y="80" width="34" height="7" rx="3.5" fill="rgb(var(--accent) / 0.5)" />
      <rect x="13" y="96" width="34" height="7" rx="3.5" fill="rgb(var(--coral) / 0.5)" />
      {/* En-tête */}
      <rect x="76" y="42" width="120" height="12" rx="6" fill="rgb(var(--orange) / 0.7)" />
      <circle cx="360" cy="48" r="10" fill="rgb(var(--accent) / 0.22)" />

      {/* VUE 1 — tuiles KPI + barres */}
      <g className="pv-old">
        {[76, 178, 280].map((x, i) => (
          <g key={x}>
            <rect x={x} y="68" width="92" height="46" rx="8" fill="#ffffff" stroke="rgb(var(--coral) / 0.5)" />
            <rect x={x + 12} y="80" width="38" height="6" rx="3" fill="rgb(var(--orange) / 0.5)" />
            <rect
              x={x + 12}
              y="94"
              width={i === 0 ? 52 : i === 1 ? 44 : 48}
              height="10"
              rx="5"
              fill={
                i === 0
                  ? "rgb(var(--accent) / 0.8)"
                  : i === 1
                    ? "rgb(var(--accent) / 0.8)"
                    : "rgb(var(--orange) / 0.8)"
              }
            />
          </g>
        ))}
        <rect x="76" y="128" width="296" height="84" rx="8" fill="#ffffff" stroke="rgb(var(--coral) / 0.5)" />
        {bars.map((b) => (
          <rect
            key={b.x}
            className={`pv-bar ${b.variant}`}
            style={{ animationDelay: b.delay }}
            x={b.x}
            y={204 - b.h}
            width="18"
            height={b.h}
            rx="3"
            fill={b.fill}
          />
        ))}
      </g>

      {/* VUE 2 — la courbe se trace et grimpe */}
      <g className="pv-new">
        <rect x="76" y="68" width="296" height="144" rx="8" fill="#ffffff" stroke="rgb(var(--orange) / 0.5)" />
        {[100, 132, 164].map((y) => (
          <line key={y} x1="92" y1={y} x2="356" y2={y} stroke="rgb(var(--accent) / 0.22)" strokeWidth="1.5" />
        ))}
        {/* 1. Les 5 points des sommets apparaissent un à un… */}
        <circle className="pv-peak-1" cx="142" cy="158" r="5" fill="rgb(var(--coral))" />
        <circle className="pv-peak-2" cx="186" cy="172" r="5" fill="rgb(var(--orange))" />
        <circle className="pv-peak-3" cx="232" cy="124" r="5" fill="rgb(var(--coral))" />
        <circle className="pv-peak-4" cx="270" cy="142" r="5" fill="rgb(var(--orange))" />
        <circle className="pv-peak-5" cx="322" cy="96" r="5" fill="rgb(var(--accent))" />
        {/* 2. …puis la courbe se trace à travers eux */}
        <path
          className="pv-line"
          d="M96 190 L142 158 L186 172 L232 124 L270 142 L322 96"
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  );
}

/* --- 2. Modernisation : avant (terne) / après (DA Mailys) --- */
export function Modernisation() {
  return (
    <>
      {/* AVANT — terne et tassé, dans la teinte la plus foncée du
          gradient DA (bordeaux) plutôt qu'un gris neutre. */}
      <g className="pv-old" fill="rgb(var(--accent))">
        <rect x="28" y="40" width="120" height="10" rx="1" fillOpacity="0.3" />
        <rect x="300" y="38" width="42" height="14" rx="1" fillOpacity="0.25" />
        <rect x="28" y="58" width="344" height="6" rx="1" fillOpacity="0.13" />
        <rect x="28" y="70" width="344" height="6" rx="1" fillOpacity="0.13" />
        <rect x="28" y="88" width="166" height="58" rx="1" fillOpacity="0.1" />
        <rect x="206" y="88" width="166" height="58" rx="1" fillOpacity="0.1" />
        <rect x="28" y="156" width="344" height="6" rx="1" fillOpacity="0.13" />
        <rect x="28" y="168" width="298" height="6" rx="1" fillOpacity="0.13" />
        <rect x="28" y="180" width="212" height="6" rx="1" fillOpacity="0.13" />
        {/* Étiquette en pastille, marge garantie avec le bord bas */}
        <rect x="28" y="192" width="58" height="20" rx="10" fillOpacity="0.1" />
        <text x="57" y="206" textAnchor="middle" fontSize="12" fontWeight="700" fillOpacity="0.5">
          Avant
        </text>
      </g>
      {/* APRÈS — aéré, arrondi, couleurs DA. Contrairement à l'Avant
          figé, tout arrive en cascade avec un léger grossissement,
          et des micro-animations continuent à l'intérieur. */}
      <g className="pv-new">
        <rect className="pv-in-1" x="40" y="46" width="150" height="15" rx="6" fill="rgb(var(--coral) / 0.75)" />
        <rect className="pv-in-2" x="40" y="70" width="96" height="8" rx="4" fill="rgb(var(--orange) / 0.75)" />
        <rect className="pv-in-3" x="40" y="90" width="76" height="20" rx="10" fill="rgb(var(--accent))" />
        <g className="pv-in-2">
          <rect x="250" y="44" width="122" height="88" rx="12" fill="rgb(var(--orange) / 0.22)" />
          {/* Scintillement interne */}
          <rect className="pv-dot" x="264" y="58" width="60" height="8" rx="4" fill="rgb(var(--coral) / 0.8)" />
        </g>
        {/* 3 cartes riches : icône colorée, contenu, micro-barre qui
            se charge — le site modernisé est vivant et optimisé.
            Apparition décalée (pv-in-4/5/6), jamais au-delà de 100 %. */}
        {[
          { x: 40, color: "--coral" },
          { x: 154, color: "--orange" },
          { x: 268, color: "--accent" },
        ].map((card, i) => (
          <g key={card.x} className={`pv-in-${4 + i}`}>
            <rect x={card.x} y="146" width="104" height="40" rx="10" fill="rgb(var(--accent) / 0.22)" />
            <circle cx={card.x + 18} cy="160" r="5" fill={`rgb(var(${card.color}))`} />
            <rect x={card.x + 30} y="152" width="48" height="6" rx="3" fill="rgb(var(--coral) / 0.7)" />
            <rect x={card.x + 30} y="162" width="34" height="4" rx="2" fill="rgb(var(--orange) / 0.5)" />
            <rect
              className="pv-spark"
              x={card.x + 12}
              y="174"
              width="80"
              height="4"
              rx="2"
              fill={`rgb(var(${card.color}) / 0.55)`}
            />
          </g>
        ))}
        {/* Étiquette en pastille, marge garantie avec le bord bas */}
        <g className="pv-in-3">
          <rect x="306" y="192" width="66" height="20" rx="10" fill="rgb(var(--accent) / 0.12)" />
          <text x="339" y="206" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(var(--accent))">
            Après
          </text>
        </g>
        {/* Reflet « tout neuf » : bande lumineuse qui balaye l'écran */}
        <defs>
          <linearGradient id="pv-shine-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          className="pv-shine"
          x="-90"
          y="26"
          width="80"
          height="194"
          fill="url(#pv-shine-grad)"
        />
      </g>
    </>
  );
}

/* --- 3. Digitalisation : les tâches se cochent, la progression avance --- */
export function Digitalisation() {
  const rows = [44, 84, 124, 164];
  return (
    <>
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="36" y={y} width="328" height="30" rx="8" fill="#ffffff" stroke="rgb(var(--accent) / 0.5)" />
          <rect x="48" y={y + 9} width="12" height="12" rx="3" fill="rgb(var(--coral) / 0.5)" />
          <rect x="72" y={y + 9} width={140 - i * 14} height="7" rx="3.5" fill="rgb(var(--coral) / 0.7)" />
          <rect x="72" y={y + 19} width={90 - i * 8} height="4" rx="2" fill="rgb(var(--orange) / 0.5)" />
          {/* Cochage séquentiel — tout se décoche ensemble en fin de cycle */}
          <g className={`pv-pop-${i + 1}`}>
            <circle cx="340" cy={y + 15} r="10" fill="rgb(var(--orange) / 0.15)" />
            <path
              d={`M334 ${y + 15}l4 4 8 -8`}
              stroke="rgb(var(--orange))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </g>
      ))}
      {/* Progression */}
      <rect x="36" y="204" width="328" height="8" rx="4" fill="rgb(var(--accent) / 0.22)" />
      <rect className="pv-fill" x="36" y="204" width="328" height="8" rx="4" fill="rgb(var(--accent) / 0.8)" />
    </>
  );
}

/* --- 4. Maintenance : le fichier défile (scroll vers le bas),
       s'arrête sur la ligne fautive, erreur ✕, puis corrigée ✓ --- */
export function Maintenance() {
  // Un long fichier de code : 13 rangées, la fautive est la 9e (y=222).
  // Le groupe .pv-scroll remonte de 110 px → elle s'arrête pile à y=112.
  const widths = [150, 210, 180, 226, 130, 194, 168, 204, 0, 176, 148, 216, 186];
  return (
    <>
      {/* Fenêtre de défilement : tout ce qui sort de la zone de
          contenu est coupé net — aucun chevauchement avec le haut. */}
      <defs>
        <clipPath id="pv-scroll-clip">
          <rect x="0" y="40" width="400" height="180" />
        </clipPath>
      </defs>
      <g clipPath="url(#pv-scroll-clip)">
        <g className="pv-scroll">
        {widths.map((w, k) => {
          const y = 46 + k * 22;
          return (
            <g key={y}>
              {/* Gouttière : numéro de ligne */}
              <rect x="24" y={y} width="14" height="7" rx="3.5" fill="rgb(var(--coral) / 0.5)" />
              {w > 0 ? (
                <rect
                  x="56"
                  y={y}
                  width={w}
                  height="9"
                  rx="4.5"
                  fill="rgb(var(--orange) / 0.5)"
                  opacity={k % 2 ? 0.8 : 1}
                />
              ) : (
                /* LA ligne fautive : normale pendant le scroll,
                   clignote en rouge à l'arrêt, puis validée */
                <rect className="pv-code" x="56" y={y} width="240" height="9" rx="4.5" fill="rgb(var(--accent) / 0.5)" />
              )}
            </g>
          );
        })}
        </g>
      </g>
      {/* Pastille erreur (✕) pendant le clignotement… */}
      <g className="pv-err">
        <circle cx="330" cy="116" r="12" fill="rgb(var(--accent) / 0.15)" />
        <path
          d="M325 111l10 10M335 111l-10 10"
          stroke="rgb(var(--accent))"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* …puis correction validée (✓) une fois la ligne saine */}
      <g className="pv-fix">
        <circle cx="330" cy="116" r="12" fill="rgb(var(--orange) / 0.15)" />
        <path
          d="M323 116l5 5 9 -9"
          stroke="rgb(var(--orange))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      {/* Badge maintenance en bas à droite (fond opaque : le code
          défile dessous sans le traverser) */}
      <rect x="284" y="182" width="88" height="24" rx="12" fill="#ffffff" />
      <rect x="284" y="182" width="88" height="24" rx="12" fill="rgb(var(--accent) / 0.1)" />
      <circle cx="298" cy="194" r="4" fill="rgb(var(--accent) / 0.8)" />
      <rect x="308" y="190" width="52" height="8" rx="4" fill="rgb(var(--accent) / 0.35)" />
    </>
  );
}

const PREVIEWS: Record<string, () => React.ReactNode> = {
  "developpement-application-metier": AppMetier,
  "modernisation-application": Modernisation,
  "digitalisation-processus": Digitalisation,
  "maintenance-windev-webdev": Maintenance,
};

// Fausses URLs des vignettes : elles rendent la fenêtre plus réelle.
// Modernisation : l'URL bascule avec la scène (obsolète → nouvelle).
const CHROME_PROPS: Record<
  string,
  { url?: string; urlSwap?: [string, string] }
> = {
  "developpement-application-metier": { url: "votre-application.fr" },
  "modernisation-application": {
    urlSwap: ["application-obsolete.fr", "nouvelle-application.fr"],
  },
};

export default function ServicePreview({ slug }: { slug: string }) {
  const Preview = PREVIEWS[slug];
  if (!Preview) return null;
  return (
    <svg
      viewBox="0 0 400 220"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="220" fill="var(--preview-bg)" />
      <Preview />
      <Chrome {...(CHROME_PROPS[slug] ?? {})} />
    </svg>
  );
}
