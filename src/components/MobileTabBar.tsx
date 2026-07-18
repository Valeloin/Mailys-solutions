"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
// Barre d'onglets — navigation principale sur téléphone.
//
// Sur mobile, une barre d'onglets fixe en bas est le repère de
// navigation attendu : toujours à portée du pouce, elle indique en
// permanence où l'on se trouve. Elle remplace la barre CTA collante,
// qui n'offrait qu'une seule action et masquait le bas de page.
//
// L'action « Devis » occupe le centre, en pastille surélevée : c'est
// l'équivalent du bouton d'action proéminent des applications, et
// c'est la conversion du site.
//
// Le header garde son panneau complet pour les pages secondaires
// (à propos, blog, mentions) : la barre ne porte que les 4 chemins
// les plus fréquents, comme il est d'usage.
// ============================================================

type Onglet = {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Actif aussi sur les sous-pages (/services/xxx) */
  prefixe?: boolean;
};

const ONGLETS: Onglet[] = [
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
];

function Picto({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function MobileTabBar() {
  const pathname = usePathname();
  const estActif = (o: Onglet) =>
    o.prefixe ? pathname.startsWith(o.href) : pathname === o.href;

  // Deux onglets, l'action centrale, puis les deux autres
  const gauche = ONGLETS.slice(0, 2);
  const droite = ONGLETS.slice(2);

  return (
    <>
      {/* Espaceur en flux : réserve la hauteur, donc aucun décalage
          de mise en page (CLS) ni contenu masqué en bas de page. */}
      <div aria-hidden="true" className="h-[4.5rem] lg:hidden" />

      <nav
        aria-label="Navigation rapide"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-1.5">
          {gauche.map((o) => (
            <TabLink key={o.href} onglet={o} actif={estActif(o)} />
          ))}

          {/* Action centrale, surélevée */}
          <Link
            href="/contact"
            aria-label="Demander un devis gratuit"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="flex flex-col items-center gap-1 pb-1.5"
          >
            <span className="btn-cta -mt-5 flex h-[52px] w-[52px] items-center justify-center rounded-full text-white shadow-[0_10px_22px_-8px_rgb(var(--accent)/0.6)] transition-transform duration-200 active:scale-95">
              <svg
                viewBox="0 0 24 24"
                className="h-[23px] w-[23px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6h16v12H4z" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
              Devis
            </span>
          </Link>

          {droite.map((o) => (
            <TabLink key={o.href} onglet={o} actif={estActif(o)} />
          ))}
        </div>
      </nav>
    </>
  );
}

/** Onglet simple : filet actif, pictogramme, libellé. Zone tactile
    de 56 px de haut sur toute la colonne — confortable au pouce. */
function TabLink({ onglet, actif }: { onglet: Onglet; actif: boolean }) {
  return (
    <Link
      href={onglet.href}
      aria-current={actif ? "page" : undefined}
      className={`relative flex h-14 flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
        actif ? "text-accent" : "text-muted"
      }`}
    >
      {/* Filet de marque au-dessus de l'onglet actif */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 top-0 h-0.5 rounded-full transition-opacity duration-200 ${
          actif ? "brand-hairline opacity-100" : "opacity-0"
        }`}
      />
      <Picto>{onglet.icon}</Picto>
      <span className="text-[10px] font-semibold tracking-[0.03em]">
        {onglet.label}
      </span>
    </Link>
  );
}
