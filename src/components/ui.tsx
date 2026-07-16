import Link from "next/link";

// ============================================================
// Petites briques visuelles partagées de la grammaire DA :
// badge kicker (pilule + points du logo), coche orange,
// pastille numérotée, barre CTA mobile sticky.
// 100 % statiques — aucun JavaScript côté navigateur.
// ============================================================

/** Badge « kicker » système : pilule + les deux points du logo */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-orange/25 bg-orange/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-orange-text">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-orange"></span>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-coral"></span>
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

/** Item de liste « problème » : croix rouge en pastille + texte */
export function ProblemItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="reveal flex gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10"
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="rgb(var(--accent))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-foreground">{children}</span>
    </li>
  );
}

/** Motif « deux points du logo » (tête des cartes de réassurance) */
export function BrandDots() {
  return (
    <div aria-hidden="true" className="mb-4 flex gap-1.5">
      <span className="h-2 w-2 rounded-full bg-orange" />
      <span className="h-2 w-2 rounded-full bg-coral" />
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
