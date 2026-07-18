"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
// Bandeau d'onglets du header — navigation rapide sur téléphone.
//
// Intégré au header (et non en barre flottante en bas) : la
// navigation reste groupée en un seul endroit, sous le logo, et ne
// recouvre plus le bas des pages.
//
// Ne porte que les 4 chemins les plus fréquents ; le panneau à cartes
// du header garde la navigation complète (à propos, contact, mentions)
// et le détail des 4 services.
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

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation rapide"
      className="border-t border-border/70 bg-background lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 px-2">
        {ONGLETS.map((o) => {
          const actif = o.prefixe
            ? pathname.startsWith(o.href)
            : pathname === o.href;
          return (
            <Link
              key={o.href}
              href={o.href}
              aria-current={actif ? "page" : undefined}
              className={`relative flex h-12 items-center justify-center gap-1.5 transition-colors ${
                actif ? "text-accent" : "text-muted"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px] shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {o.icon}
              </svg>
              <span className="text-[11.5px] font-semibold tracking-[0.01em]">
                {o.label}
              </span>
              {/* Filet de marque sous l'onglet actif */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-2.5 bottom-0 h-[2.5px] rounded-t-full transition-opacity duration-200 ${
                  actif ? "brand-hairline opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
