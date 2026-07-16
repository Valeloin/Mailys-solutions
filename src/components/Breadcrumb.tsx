import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

type Crumb = { name: string; href: string };

// Fil d'Ariane : visible pour l'utilisateur + balisé Schema.org
// (BreadcrumbList) pour apparaître dans les résultats Google.
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
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">›</span>}
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-accent underline-offset-2 hover:underline">
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
