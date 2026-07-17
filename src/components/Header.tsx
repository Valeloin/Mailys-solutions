import Link from "next/link";
import Logo from "@/components/Logo";
import { SERVICES } from "@/lib/services";

const NAV = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Réalisations", href: "/realisations" },
  { name: "À propos", href: "/a-propos" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

// Sous-pages du menu Services (dérivées de la source de vérité).
const SERVICE_LINKS = [
  { name: "Tous les services", href: "/services" },
  ...SERVICES.map((s) => ({ name: s.name, href: `/services/${s.slug}` })),
];

// Header 100 % HTML/CSS (aucun JavaScript envoyé au navigateur).
// Composition en trois zones : logo | navigation centrée | action.
// Navigation en petites capitales espacées (épuré mais travaillé),
// soulignement dégradé au survol, filet signature en couronnement.
// L'onglet Services ouvre un menu déroulant (survol + focus clavier).
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
          {NAV.map((item) =>
            item.name === "Services" ? (
              // Onglet Services : menu déroulant CSS (survol + focus-within)
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="nav-link flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors hover:text-foreground group-hover:text-foreground group-focus-within:text-foreground"
                  aria-haspopup="true"
                >
                  {item.name}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 transition-transform duration-200 group-hover:-rotate-180 group-focus-within:-rotate-180"
                  >
                    <path
                      d="M2.5 4.5 6 8l3.5-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                {/* Panneau : invisible par défaut, révélé au survol/focus.
                    Le pont haut évite la coupure du survol sous le filet. */}
                <div className="invisible absolute left-1/2 top-full z-20 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="w-72 overflow-hidden rounded-xl border border-border bg-background shadow-[0_24px_48px_-24px_rgb(var(--bordeaux)/0.35)]">
                    <span aria-hidden="true" className="brand-hairline block h-0.5" />
                    <div className="p-2">
                      {SERVICE_LINKS.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface hover:text-coral"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-[13px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            )
          )}
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
              {NAV.map((item) =>
                item.name === "Services" ? (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface"
                    >
                      {item.name}
                    </Link>
                    {/* Sous-pages de services, légèrement en retrait */}
                    <div className="ml-3 border-l border-border pl-2">
                      {SERVICE_LINKS.slice(1).map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block rounded-lg px-3.5 py-2 text-[13px] font-medium text-muted hover:bg-surface hover:text-foreground"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface"
                  >
                    {item.name}
                  </Link>
                )
              )}
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
