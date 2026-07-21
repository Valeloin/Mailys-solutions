import { StepNumber } from "@/components/ui";

// ============================================================
// Les 8 étapes de la méthode — version compacte (tient dans un
// écran desktop) : pastille numérotée + pictogramme + titre +
// texte resserré. Utilisée sur l'accueil, les pages services
// et À propos.
// Pictogrammes décoratifs (aria-hidden) animés en pur CSS
// (classes pv-mi-* dans globals.css) : chacun illustre son étape,
// discrètement, et se fige à l'état de repos sous
// prefers-reduced-motion.
// ============================================================

const ICON_COLORS = [
  "--coral",
  "--orange",
  "--accent",
  "--coral",
  "--orange",
  "--accent",
  "--coral",
  "--orange",
];

const ICONS: ((color: string) => React.ReactNode)[] = [
  // 1 — Découverte : la loupe qui balaye
  (c) => (
    <g className="pv-mi-scan">
      <circle cx="10" cy="10" r="6" stroke={c} strokeWidth="2" fill="none" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  // 2 — Analyse : les barres du mini graphique qui respirent
  (c) => (
    <>
      <path d="M4 20h16" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect className="pv-mi-bar" x="6" y="11" width="3" height="6" rx="1" fill={c} />
      <rect className="pv-mi-bar" style={{ animationDelay: "0.5s" }} x="11" y="6" width="3" height="11" rx="1" fill={c} opacity="0.75" />
      <rect className="pv-mi-bar" style={{ animationDelay: "1s" }} x="16" y="13" width="3" height="4" rx="1" fill={c} opacity="0.55" />
    </>
  ),
  // 3 — Cadrage : la cible qui se resserre (anneau + centre pulsés)
  (c) => (
    <>
      <circle className="pv-mi-pulse" cx="12" cy="12" r="8" stroke={c} strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3.5" stroke={c} strokeWidth="2" fill="none" />
      <circle className="pv-dot" cx="12" cy="12" r="1.4" fill={c} />
    </>
  ),
  // 4 — Conception : le crayon qui esquisse (léger va-et-vient)
  (c) => (
    <g className="pv-mi-wiggle">
      <path
        d="M4 20l1.6-5.2L16 4.4a2.1 2.1 0 013 3L8.6 17.8 4 20z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  ),
  // 5 — Développement : les chevrons de code qui s'écartent
  (c) => (
    <>
      <path className="pv-mi-chev-l" d="M9 6l-6 6 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path className="pv-mi-chev-r" d="M15 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  // 6 — Tests : la coche qui se trace, encore et encore
  (c) => (
    <>
      <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="2" fill="none" />
      <path className="pv-mi-draw" d="M8.5 12l2.5 2.5 4.5-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  // 7 — Déploiement : les trois flèches qui partent l'une après l'autre
  (c) => (
    <g stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path className="pv-mi-nudge" d="M4 6h9m0 0l-3-3m3 3l-3 3" />
      <path className="pv-mi-nudge" style={{ animationDelay: "0.18s" }} d="M4 12h14m0 0l-3-3m3 3l-3 3" />
      <path className="pv-mi-nudge" style={{ animationDelay: "0.36s" }} d="M4 18h6m0 0l-3-3m3 3l-3 3" />
    </g>
  ),
  // 8 — Accompagnement : la bulle de dialogue qui « tape » (3 points)
  (c) => (
    <>
      <path
        d="M20 4.5H4v11h4.5V20l5-4.5H20v-11z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <circle className="pv-mi-type" cx="8.5" cy="10" r="1.1" fill={c} />
      <circle className="pv-mi-type" style={{ animationDelay: "0.25s" }} cx="12" cy="10" r="1.1" fill={c} />
      <circle className="pv-mi-type" style={{ animationDelay: "0.5s" }} cx="15.5" cy="10" r="1.1" fill={c} />
    </>
  ),
];

function MethodIcon({ index }: { index: number }) {
  // Icône BLANCHE, sans pastille. Elle était en --coral / --orange /
  // --accent — les couleurs du dégradé qui la porte, donc invisible. Le
  // blanc se détache du dégradé. Pas de pastille : elle enfermait
  // l'animation (la loupe qui balaye sortait du cercle et paraissait
  // coupée). Libre, l'animation a toute sa place.
  const Icon = ICONS[index % ICONS.length];
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
      {Icon("#ffffff")}
    </svg>
  );
}

export default function MethodSteps({
  steps,
}: {
  steps: readonly { title: string; text: string }[];
}) {
  return (
    <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-4 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="card reveal group rounded-2xl border border-border bg-background p-5"
        >
          <div className="flex items-center gap-2.5">
            <StepNumber size="sm">{String(i + 1).padStart(2, "0")}</StepNumber>
            <MethodIcon index={i} />
          </div>
          <h3 className="mt-2.5 font-bold text-foreground transition-colors group-hover:text-accent">
            {step.title}
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
