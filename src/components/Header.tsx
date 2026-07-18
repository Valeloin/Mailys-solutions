import Link from "next/link";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
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
// « Tous les services » est traité à part, en pied de menu.
const SERVICE_LINKS = SERVICES.map((s) => ({
  name: s.name,
  href: `/services/${s.slug}`,
}));

// Header 100 % HTML/CSS (aucun JavaScript envoyé au navigateur).
// Composition en trois zones : logo | navigation centrée | action.
// Navigation en petites capitales espacées (épuré mais travaillé),
// soulignement dégradé au survol, filet signature en couronnement.
// L'onglet Services ouvre un menu déroulant (survol + focus clavier).
// Sur téléphone : logo + bandeau des 4 onglets (MobileTabBar).
export default function Header() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-border/80 bg-background">
      {/* Filet signature de marque : corail → rouge → orange */}
      <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-0.5" />
      {/* Progression de lecture : la barre grandit avec le défilement */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 z-10 h-[3px]" />
      {/* Ligne 1 nettement plus basse sur téléphone : 56 px au lieu de 68.
          Le header est sticky — chaque pixel gagné ici l'est sur toute la
          hauteur de lecture, en permanence. */}
      <div className="mx-auto grid h-14 max-w-content grid-cols-[1fr_auto] items-center px-3 sm:px-6 lg:h-[4.25rem] lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="origin-left scale-[0.88] justify-self-start sm:scale-95 lg:scale-100"
        >
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
                  <div className="w-[19.5rem] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_28px_56px_-28px_rgb(var(--bordeaux)/0.4)]">
                    {/* Filet signature, comme en couronnement du header */}
                    <span aria-hidden="true" className="brand-hairline block h-1" />
                    <div className="p-2.5">
                      {/* Label façon kicker : même grammaire que la DA */}
                      <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-text">
                        Nos expertises
                      </p>
                      {SERVICE_LINKS.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="group/i flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface hover:text-accent"
                        >
                          {/* Point dégradé : écho des points du logo */}
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-orange to-accent opacity-60 transition-opacity group-hover/i:opacity-100"
                          />
                          {sub.name}
                        </Link>
                      ))}
                      <span aria-hidden="true" className="my-2 block h-px bg-border" />
                      {/* Pied de menu : capitales espacées, comme la nav */}
                      <Link
                        href="/services"
                        className="group/a flex items-center justify-between rounded-lg px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-surface"
                      >
                        Tous les services
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-200 group-hover/a:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
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

      </div>

      {/* Bandeau d'onglets : navigation rapide, téléphone et tablette */}
      <MobileTabBar />
    </header>
  );
}
