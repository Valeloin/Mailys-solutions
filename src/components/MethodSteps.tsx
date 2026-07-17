import { StepNumber } from "@/components/ui";

// ============================================================
// Les 7 étapes de la méthode — version compacte (tient dans un
// écran desktop) : pastille numérotée + pictogramme + titre +
// texte resserré. Utilisée sur l'accueil, les pages services
// et À propos. Pictogrammes décoratifs (aria-hidden).
// ============================================================

const ICON_COLORS = [
  "--coral",
  "--orange",
  "--accent",
  "--coral",
  "--orange",
  "--accent",
  "--coral",
];

const ICONS: ((color: string) => React.ReactNode)[] = [
  // 1 — Découverte : la loupe
  (c) => (
    <>
      <circle cx="10" cy="10" r="6" stroke={c} strokeWidth="2" fill="none" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  // 2 — Analyse : le mini graphique
  (c) => (
    <>
      <path d="M4 20h16" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="6" y="11" width="3" height="6" rx="1" fill={c} />
      <rect x="11" y="6" width="3" height="11" rx="1" fill={c} opacity="0.75" />
      <rect x="16" y="13" width="3" height="4" rx="1" fill={c} opacity="0.55" />
    </>
  ),
  // 3 — Conception : le crayon
  (c) => (
    <path
      d="M4 20l1.6-5.2L16 4.4a2.1 2.1 0 013 3L8.6 17.8 4 20z"
      stroke={c}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 4 — Développement : les chevrons de code
  (c) => (
    <path
      d="M9 6l-6 6 6 6M15 6l6 6-6 6"
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 5 — Tests : la coche validée
  (c) => (
    <>
      <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="2" fill="none" />
      <path d="M8.5 12l2.5 2.5 4.5-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  // 6 — Déploiement : la flèche d'envol
  (c) => (
    <path
      d="M12 19V5M5.5 11.5L12 5l6.5 6.5"
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 7 — Accompagnement : la bulle de dialogue
  (c) => (
    <path
      d="M20 4.5H4v11h4.5V20l5-4.5H20v-11z"
      stroke={c}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  ),
];

function MethodIcon({ index }: { index: number }) {
  const color = `rgb(var(${ICON_COLORS[index % ICON_COLORS.length]}))`;
  const Icon = ICONS[index % ICONS.length];
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
      {Icon(color)}
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
          className="card reveal rounded-2xl border border-border bg-background p-5"
        >
          <div className="flex items-center gap-2.5">
            <StepNumber size="sm">{String(i + 1).padStart(2, "0")}</StepNumber>
            <MethodIcon index={i} />
          </div>
          <h3 className="mt-2.5 font-bold text-bordeaux">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-snug text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
