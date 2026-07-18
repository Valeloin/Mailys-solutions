import Link from "next/link";

// ============================================================
// Petites briques visuelles partagées de la grammaire DA :
// badge kicker (pilule + points du logo), coche orange,
// pastille numérotée, barre CTA mobile sticky.
// 100 % statiques — aucun JavaScript côté navigateur.
// ============================================================

/** Badge « kicker » système : pilule + les deux points du logo (pulsation douce) */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-orange/25 bg-orange/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-orange-text">
      <span aria-hidden="true" className="pv-dot h-1.5 w-1.5 rounded-full bg-orange"></span>
      <span
        aria-hidden="true"
        className="pv-dot h-1.5 w-1.5 rounded-full bg-coral"
        style={{ animationDelay: "0.4s" }}
      ></span>
      {children}
    </p>
  );
}

/** Coche orange (listes de bénéfices, réassurance) */
export function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`${className} shrink-0`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="rgb(var(--orange))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pastille numérotée — écho des points du logo (méthode, étapes).
    aria-hidden : le numéro est décoratif, la liste <ol> porte déjà l'ordre. */
const STEP_SIZES = {
  sm: "h-8 w-8 text-sm font-bold",
  md: "h-9 w-9 text-sm font-bold",
  lg: "h-11 w-11 text-base font-extrabold",
} as const;

export function StepNumber({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: keyof typeof STEP_SIZES;
}) {
  return (
    <p
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange-text ${STEP_SIZES[size]}`}
    >
      {children}
    </p>
  );
}

// ---------- Pictogrammes distincts des constats ----------
// Chaque item de « problème » reçoit son icône + son ton chaud
// (cyclés par index). Traits fins en currentColor → l'icône prend
// la couleur de sa pastille.
const PROBLEM_TONES = [
  "bg-coral/[0.15] text-[#D8494F]",
  "bg-orange/[0.15] text-orange-text",
  "bg-accent/[0.12] text-accent",
  "bg-bordeaux/[0.08] text-bordeaux",
] as const;

const PROBLEM_ICONS: React.ReactNode[] = [
  // Fichiers dispersés — tableurs éparpillés
  <>
    <rect x="3" y="4" width="8" height="6" rx="1.2" />
    <rect x="13.5" y="8" width="7.5" height="6" rx="1.2" />
    <rect x="6" y="14" width="8" height="6" rx="1.2" />
  </>,
  // Ressaisies — document dupliqué
  <>
    <rect x="4" y="4" width="11" height="13" rx="2" />
    <path d="M9 20h9a2 2 0 0 0 2-2V9" />
  </>,
  // Logiciel vieillissant — horloge
  <>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2.5" />
  </>,
  // Processus fragiles — maillons qui lâchent
  <>
    <path d="M10 8a3.2 3.2 0 0 0 0 6" />
    <path d="M14 16a3.2 3.2 0 0 0 0-6" />
    <path d="M9.5 11h2M12.5 13h2" />
  </>,
  // Aucune visibilité — œil barré
  <>
    <path d="M2.5 12S6 5.5 12 5.5s9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M4 4l16 16" />
  </>,
];

/** Item de liste « problème » : carte chaude + pictogramme distinct
    (index → icône + ton). Fond blanc, ombre douce, survol qui soulève
    et réchauffe la bordure. Aucune bordure colorée agressive. */
export function ProblemItem({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const tone = PROBLEM_TONES[index % PROBLEM_TONES.length];
  const icon = PROBLEM_ICONS[index % PROBLEM_ICONS.length];
  return (
    <li className="problem-item reveal group flex items-center gap-4 rounded-2xl border border-border bg-background px-4 py-3.5 shadow-[0_4px_16px_-8px_rgb(var(--bordeaux)/0.2)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-[0_16px_34px_-16px_rgb(var(--bordeaux)/0.28)]">
      <span
        aria-hidden="true"
        className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] ${tone}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </span>
      <span className="text-[15px] font-medium leading-snug text-foreground">
        {children}
      </span>
    </li>
  );
}

/** Motif « deux points du logo » (tête des cartes de réassurance) */
export function BrandDots() {
  return (
    <div aria-hidden="true" className="mb-4 flex gap-1.5">
      <span className="pv-dot h-2 w-2 rounded-full bg-orange" />
      <span className="pv-dot h-2 w-2 rounded-full bg-coral" style={{ animationDelay: "0.4s" }} />
    </div>
  );
}

/** Barre CTA mobile sticky : l'espaceur en flux réserve la hauteur (zéro CLS).
    Discrète par choix — le hero porte déjà le CTA principal : cette barre
    ne prend le relais qu'une fois celui-ci sorti de l'écran (voir la classe
    .mobile-cta dans globals.css, révélation pilotée par le défilement). */
export function MobileCtaBar() {
  return (
    <>
      <div aria-hidden="true" className="h-14 md:hidden" />
      <div className="mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Link
          href="/contact"
          className="btn-cta block rounded-lg px-5 py-2.5 text-center text-sm font-semibold text-white"
        >
          Demander un devis
        </Link>
      </div>
    </>
  );
}
