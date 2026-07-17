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

/** Item de liste « problème » : pastille ronde au dégradé de marque
    (corail → orange → rouge) avec un halo qui respire et le triangle
    qui bat doucement. Aucune bordure colorée, fond blanc, ombre neutre.
    Décoratif, non cliquable. Animations coupées par
    prefers-reduced-motion (pastille et halo restent colorés). */
export function ProblemItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="problem-item reveal group flex items-center gap-3.5 rounded-2xl border border-border bg-background px-4 py-3.5 shadow-[0_4px_16px_-8px_rgb(var(--bordeaux)/0.2)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-16px_rgb(var(--bordeaux)/0.28)]">
      {/* Badge rond en tons chauds doux (même famille que les pastilles
          kicker orange/10) ; le triangle est tracé au dégradé de marque
          corail → orange → rouge, et bat doucement. */}
      <span
        aria-hidden="true"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-coral/[0.18] to-orange/[0.14] ring-1 ring-orange/20 transition-[box-shadow,background] duration-200 group-hover:ring-orange/40 group-hover:from-coral/[0.24] group-hover:to-orange/[0.18]"
      >
        <svg viewBox="0 0 24 24" className="pv-alert-mark h-[18px] w-[18px]" fill="none">
          <defs>
            <linearGradient id="pi-tri" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgb(var(--coral))" />
              <stop offset="0.55" stopColor="rgb(var(--orange))" />
              <stop offset="1" stopColor="rgb(var(--accent))" />
            </linearGradient>
          </defs>
          <path
            d="M12 5 20 18.5H4L12 5z"
            fill="url(#pi-tri)"
            fillOpacity="0.16"
            stroke="url(#pi-tri)"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <path d="M12 10.4v3" stroke="url(#pi-tri)" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="12" cy="16.2" r="1.05" fill="url(#pi-tri)" />
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
