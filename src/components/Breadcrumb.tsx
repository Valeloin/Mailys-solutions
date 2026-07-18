import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

type Crumb = { name: string; href: string };

// Petite maison (lien Accueil) — trait fin, hérite de la couleur du lien.
function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
      <path
        d="M3 9.6 10 4l7 5.6M4.8 8.4V16h10.4V8.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Séparateur : chevron fin aux tons de la DA (corail).
function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-coral/70" fill="none" aria-hidden="true">
      <path
        d="M4.5 2.5 8 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Fil d'Ariane : visible pour l'utilisateur + balisé Schema.org
// (BreadcrumbList) pour apparaître dans les résultats Google.
// Habillage DA : pastille épurée (hairline + fond chaud), maison,
// chevrons corail, page courante en bordeaux précédée d'un point
// dégradé (écho des points du logo). Survol signature (nav-link).
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const crumbs: Crumb[] = [{ name: "Accueil", href: "/" }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${SITE.url}${c.href === "/" ? "" : c.href}`,
          })),
        }}
      />
      <nav aria-label="Fil d'Ariane">
        <ol className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm shadow-[0_2px_10px_-6px_rgb(var(--bordeaux)/0.18)]">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <Chevron />}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="flex items-center gap-1.5 font-semibold text-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-orange to-accent"
                    />
                    {c.name}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="nav-link flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-accent"
                  >
                    {i === 0 && <HomeIcon />}
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
