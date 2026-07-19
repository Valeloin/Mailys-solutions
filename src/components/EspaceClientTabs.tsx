"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
// Onglets de l'espace client.
// Composant client parce qu'il lui faut connaître l'URL courante
// pour marquer l'onglet actif — le reste de la coque reste rendu
// côté serveur.
// ============================================================

const ONGLETS = [
  { href: "/espace-client", label: "Tableau de bord" },
  { href: "/espace-client/tickets", label: "Mes tickets" },
  { href: "/espace-client/applications", label: "Mes applications" },
  { href: "/espace-client/documents", label: "Documents" },
  { href: "/espace-client/compte", label: "Mon compte" },
];

export default function EspaceClientTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections de votre espace"
      className="mt-8 flex flex-wrap gap-2 border-b border-border pb-px"
    >
      {ONGLETS.map((o) => {
        // Le tableau de bord ne doit pas s'allumer sur toutes les sous-pages :
        // son chemin est le préfixe de tous les autres.
        const actif =
          o.href === "/espace-client"
            ? pathname === "/espace-client"
            : pathname.startsWith(o.href);

        return (
          <Link
            key={o.href}
            href={o.href}
            aria-current={actif ? "page" : undefined}
            className={`relative rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              actif
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {o.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity ${
                actif ? "bg-accent opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
