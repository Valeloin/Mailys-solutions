import Link from "next/link";
import { SECTIONS } from "@/lib/sections";
import { getSectionsRaw } from "@/lib/content";

// Liste des sections de contenu éditables.
export default async function AdminContenusPage() {
  const edited = await getSectionsRaw(SECTIONS.map((s) => s.key));

  return (
    <>
      <h1 className="text-2xl font-bold text-bordeaux">Contenus du site</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Tous les textes du site, section par section. Les modifications sont
        visibles en ligne en quelques secondes. Les adresses des pages (URL)
        et la structure ne changent jamais — votre référencement est protégé.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/contenus/${encodeURIComponent(s.key)}`}
            className="card rounded-2xl border border-border bg-background p-5 hover:border-coral"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold">{s.label}</p>
              {edited[s.key] !== undefined && (
                <span className="shrink-0 rounded-full bg-orange/10 px-2.5 py-1 text-xs font-bold text-orange-text">
                  Modifié
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{s.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
