import Link from "next/link";
import Logo from "@/components/Logo";

const NAV = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Réalisations", href: "/realisations" },
  { name: "À propos", href: "/a-propos" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

// Header 100 % HTML/CSS (aucun JavaScript envoyé au navigateur).
// Composition en trois zones : logo | navigation centrée | action.
// Navigation en petites capitales espacées (épuré mais travaillé),
// soulignement dégradé au survol, filet signature en couronnement.
// Le menu mobile repose sur <details>, natif et accessible.
export default function Header() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-border/80 bg-background">
      {/* Filet signature de marque : corail → rouge → orange */}
      <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-0.5" />
      {/* Progression de lecture : la barre grandit avec le défilement */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 z-10 h-[3px]" />
      <div className="mx-auto grid h-[4.25rem] max-w-content grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start">
          <Logo />
        </Link>

        {/* Navigation desktop, centrée — petites capitales espacées */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-[13px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action, séparée par un filet vertical */}
        <div className="hidden items-center gap-5 justify-self-end lg:flex">
          <span aria-hidden="true" className="h-5 w-px bg-border" />
          <Link
            href="/contact"
            className="btn-cta rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          >
            Demander un devis
          </Link>
        </div>

        {/* Navigation mobile/tablette — <details> natif, sans JavaScript */}
        <details className="relative justify-self-end lg:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border transition-colors hover:border-coral [&::-webkit-details-marker]:hidden"
            aria-label="Ouvrir le menu"
          >
            <span aria-hidden="true" className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-foreground"></span>
              <span className="block h-0.5 w-5 bg-foreground"></span>
              <span className="block h-0.5 w-5 bg-foreground"></span>
            </span>
          </summary>
          <nav
            aria-label="Navigation mobile"
            className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-border bg-background shadow-[0_24px_48px_-24px_rgb(var(--bordeaux)/0.3)]"
          >
            <span aria-hidden="true" className="brand-hairline block h-0.5" />
            <div className="p-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="btn-cta mt-2 block rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Demander un devis
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
