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

/** Item de liste « problème » : liseré rouge + picto d'alerte
    (clairement non cliquable), fond blanc contrasté + ombre douce. */
export function ProblemItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="reveal flex gap-3 rounded-xl border border-border border-l-4 border-l-accent/70 bg-background px-4 py-3.5 shadow-[0_2px_10px_-6px_rgb(var(--bordeaux)/0.25)]">
      <svg
        viewBox="0 0 20 20"
        className="mt-0.5 h-5 w-5 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 3 2.5 16.5h15L10 3z"
          fill="rgb(var(--accent) / 0.1)"
          stroke="rgb(var(--accent) / 0.8)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 8.5v3.5" stroke="rgb(var(--accent))" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="14.4" r="1" fill="rgb(var(--accent))" />
      </svg>
      <span className="text-foreground">{children}</span>
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

/** Barre CTA mobile sticky : l'espaceur en flux réserve la hauteur (zéro CLS) */
export function MobileCtaBar() {
  return (
    <>
      <div aria-hidden="true" className="h-16 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Link
          href="/contact"
          className="btn-cta block rounded-xl px-6 py-3 text-center font-semibold text-white"
        >
          Demander un devis gratuit
        </Link>
      </div>
    </>
  );
}
