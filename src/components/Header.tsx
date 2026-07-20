"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
// « Tous les services » est traité à part, en pied de menu.
const SERVICE_LINKS = SERVICES.map((s) => ({
  name: s.name,
  href: `/services/${s.slug}`,
}));

// Onglets mobiles : 4 repères de navigation rapide sur téléphone,
// affichés côte à côte avec le logo sur la même ligne du header.
type MobileOnglet = {
  href: string;
  label: string;
  icon: React.ReactNode;
  prefixe?: boolean;
};

const ONGLETS_MOBILE: MobileOnglet[] = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6 10v9h12v-9" />
      </>
    ),
  },
  {
    href: "/services",
    label: "Services",
    prefixe: true,
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.6" />
        <rect x="13" y="4" width="7" height="7" rx="1.6" />
        <rect x="4" y="13" width="7" height="7" rx="1.6" />
        <rect x="13" y="13" width="7" height="7" rx="1.6" />
      </>
    ),
  },
  {
    href: "/realisations",
    label: "Projets",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="13" rx="2" />
        <path d="M3.5 14l4.5-4 3.5 3 3-3.5 6 5.5" />
      </>
    ),
  },
  {
    href: "/blog",
    label: "Blog",
    prefixe: true,
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </>
    ),
  },
  // Contact en fin de barre : c'est l'action de conversion, et sur
  // téléphone elle n'existait nulle part dans la navigation.
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <>
        <path d="M4 6.5h16v11H4z" />
        <path d="m4.6 7.2 7.4 5.4 7.4-5.4" />
      </>
    ),
  },
];

function MobileOnglets() {
  const pathname = usePathname();

  return (
    // Cinq colonnes : Contact rejoint la barre. Sur téléphone, le seul
    // chemin vers le formulaire passait par le pied de page ou un CTA en
    // cours de lecture — l'action de conversion principale du site était
    // absente de la navigation.
    <div className="grid grid-cols-5 gap-0.5 lg:hidden">
      {ONGLETS_MOBILE.map((o) => {
        const actif = o.prefixe
          ? pathname.startsWith(o.href)
          : pathname === o.href;
        return (
          <Link
            key={o.href}
            href={o.href}
            aria-current={actif ? "page" : undefined}
            // h-11 = 44 px, la cible tactile minimale. Les onglets
            // étaient à 36 px : c'est la barre la plus sollicitée du
            // site sur téléphone, et elle était sous le seuil.
            className={`relative flex h-11 flex-col items-center justify-center gap-0.5 rounded transition-colors ${
              actif ? "text-coral" : "text-white/75"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {o.icon}
            </svg>
            <span className="text-[10px] font-semibold">
              {o.label}
            </span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-1.5 bottom-0 h-[2px] rounded-t-full transition-opacity duration-200 ${
                actif ? "bg-accent opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}

// Header 100 % HTML/CSS (aucun JavaScript envoyé au navigateur).
// Composition en trois zones : logo | navigation centrée | action.
// Navigation en petites capitales espacées (épuré mais travaillé),
// soulignement dégradé au survol, filet signature en couronnement.
// L'onglet Services ouvre un menu déroulant (survol + focus clavier).
// Sur téléphone : logo + bandeau des 4 onglets (MobileTabBar).
export default function Header() {
  return (
    // Opaque, et non translucide. La transparence laissait remonter la
    // nappe chaude derrière les libellés : leur contraste variait selon
    // ce qui défilait dessous, et l'ensemble paraissait délavé. Un fond
    // sombre plein tient les libellés à un contraste constant.
    // Les liens passent en blanc à 90 % au lieu du gris secondaire.
    <header className="relative sticky top-0 z-50 border-b border-border bg-[#150c0f]">
      {/* Progression de lecture : la barre grandit avec le défilement */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 z-10 h-[3px]" />
      {/* Header sur une seule ligne : logo compact + 4 onglets côte à côte,
          tout rentre dans h-11 (44 px). */}
      <div className="mx-auto grid h-11 max-w-content grid-cols-[auto_1fr] gap-1.5 items-center px-2 sm:px-4 lg:h-[4.25rem] lg:grid-cols-[1fr_auto_1fr] lg:gap-7 lg:px-6">
        <Link
          href="/"
          className="origin-left scale-[0.8] sm:scale-85 lg:scale-100 justify-self-start shrink-0"
        >
          <Logo />
        </Link>

        {/* Onglets mobiles : Accueil / Services / Projets / Blog sur une ligne
            avec le logo. Masqués sur desktop (lg:) où la nav complète s'affiche. */}
        <MobileOnglets />

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
                  className="nav-link flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.11em] text-white/90 transition-colors hover:text-foreground group-hover:text-foreground group-focus-within:text-foreground"
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
                className="nav-link text-[13px] font-semibold uppercase tracking-[0.11em] text-white/90 transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        {/* Accès client, séparé de la navigation par un filet vertical.
            whitespace-nowrap : sans lui le libellé se casse en plusieurs
            lignes dès que la barre se resserre. */}
        <div className="hidden items-center gap-4 justify-self-end lg:flex">
          <span aria-hidden="true" className="h-5 w-px bg-border" />
          <Link
            href="/espace-client"
            className="nav-link whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.11em] text-white/90 transition-colors hover:text-foreground"
          >
            Espace client
          </Link>
        </div>

      </div>
    </header>
  );
}
