// ============================================================
// Micro-animations des cartes « Pourquoi nous choisir » :
// un pictogramme discret par argument, animé en pur CSS,
// en adéquation avec le texte de la carte. Décoratif (aria-hidden).
// L'ordre suit les 6 arguments (accompagnement, sur mesure,
// compréhension, interlocuteur, suivi, évolutif).
// ============================================================

const MOTIFS: (() => React.ReactNode)[] = [
  // 0 — Un accompagnement de A à Z : le point fait tout le trajet
  () => (
    <>
      <line x1="8" y1="12" x2="56" y2="12" stroke="rgb(var(--bordeaux) / 0.15)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="12" r="3" fill="rgb(var(--coral))" />
      <circle cx="56" cy="12" r="3" fill="rgb(var(--accent))" />
      {/* Part exactement du point A (cx=8) et va jusqu'au point Z (cx=56),
          en recouvrant chaque extrémité — de A à Z, jusqu'au bout. */}
      <circle className="pv-wu-travel" cx="8" cy="12" r="4" fill="rgb(var(--orange))" />
    </>
  ),
  // 1 — Du vrai sur mesure : trois curseurs de réglage dont les
  //     boutons glissent doucement vers leur position idéale,
  //     chacun à son rythme — on ajuste finement, sur mesure.
  () => (
    <>
      <rect x="12" y="3.2" width="40" height="2.6" rx="1.3" fill="rgb(var(--bordeaux) / 0.12)" />
      <circle className="pv-wu-knob-1" cx="20" cy="4.5" r="2.6" fill="rgb(var(--coral))" stroke="var(--background)" strokeWidth="1.4" />
      <rect x="12" y="10.7" width="40" height="2.6" rx="1.3" fill="rgb(var(--bordeaux) / 0.12)" />
      <circle className="pv-wu-knob-2" cx="38" cy="12" r="2.6" fill="rgb(var(--orange))" stroke="var(--background)" strokeWidth="1.4" />
      <rect x="12" y="18.2" width="40" height="2.6" rx="1.3" fill="rgb(var(--bordeaux) / 0.12)" />
      <circle className="pv-wu-knob-3" cx="26" cy="19.5" r="2.6" fill="rgb(var(--accent))" stroke="var(--background)" strokeWidth="1.4" />
    </>
  ),
  // 2 — La compréhension métier d'abord : la loupe balaye le texte
  () => (
    <>
      <rect x="10" y="8" width="44" height="3" rx="1.5" fill="rgb(var(--bordeaux) / 0.1)" />
      <rect x="10" y="14" width="32" height="3" rx="1.5" fill="rgb(var(--bordeaux) / 0.1)" />
      <g className="pv-wu-scan">
        <circle cx="30" cy="10" r="6" fill="none" stroke="rgb(var(--accent))" strokeWidth="2" />
        <line x1="34.5" y1="14.5" x2="39" y2="19" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </>
  ),
  // 3 — Un interlocuteur unique : l'onde émane d'un seul point
  () => (
    <>
      <circle className="pv-wu-ping" cx="32" cy="12" r="9" fill="none" stroke="rgb(var(--coral))" strokeWidth="2" />
      <circle className="pv-wu-ping" style={{ animationDelay: "1.6s" }} cx="32" cy="12" r="9" fill="none" stroke="rgb(var(--orange))" strokeWidth="2" />
      <circle cx="32" cy="12" r="3.5" fill="rgb(var(--accent))" />
    </>
  ),
  // 4 — Un suivi long terme : le pointillé avance sans jamais s'arrêter
  () => (
    <>
      <path
        className="pv-wu-line"
        d="M6 14l12 0 6 -7 8 10 6 -5 20 0"
        fill="none"
        stroke="rgb(var(--accent) / 0.8)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 6"
      />
      <circle cx="58" cy="12" r="3" fill="rgb(var(--orange))" />
    </>
  ),
  // 5 — Un logiciel évolutif : les marches montent (données vivantes)
  () => (
    <>
      <rect className="pv-bar pv-bar-a" x="18" y="12" width="6" height="8" rx="2" fill="rgb(var(--coral) / 0.8)" />
      <rect className="pv-bar pv-bar-b" x="30" y="7" width="6" height="13" rx="2" fill="rgb(var(--orange) / 0.8)" />
      <rect className="pv-bar pv-bar-c" x="42" y="3" width="6" height="17" rx="2" fill="rgb(var(--accent) / 0.8)" />
      <line x1="14" y1="20" x2="52" y2="20" stroke="rgb(var(--bordeaux) / 0.15)" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
];

export default function WhyUsMotif({ index }: { index: number }) {
  const Motif = MOTIFS[index % MOTIFS.length];
  return (
    <svg
      viewBox="0 0 64 24"
      className="mb-4 h-6 w-16"
      aria-hidden="true"
      focusable="false"
    >
      <Motif />
    </svg>
  );
}
