import Link from "next/link";
import { notFound } from "next/navigation";
import { getSectionDef } from "@/lib/sections";
import { getSectionData } from "@/lib/content";
import SectionEditor from "../section-editor";

// Édition d'une section : le formulaire est généré depuis le
// schéma de la section (src/lib/sections.ts).
export default async function EditSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ saved?: string; reset?: string; error?: string }>;
}) {
  const { key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  const { saved, reset, error } = await searchParams;

  const def = getSectionDef(key);
  if (!def) notFound();

  // Défauts + éventuelles modifications déjà enregistrées.
  const data = await getSectionData(key, def.defaults);

  return (
    <>
      <Link
        href="/admin/contenus"
        className="text-sm font-semibold text-muted hover:text-foreground"
      >
        ← Tous les contenus
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-bordeaux">{def.label}</h1>
      <p className="mt-1 text-sm text-muted">{def.description}</p>

      {saved === "1" && (
        <p role="status" className="mt-4 rounded-lg border border-border bg-background p-3 text-sm font-semibold text-bordeaux">
          ✓ Contenu enregistré — le site public est à jour.
        </p>
      )}
      {reset === "1" && (
        <p role="status" className="mt-4 rounded-lg border border-border bg-background p-3 text-sm font-semibold text-bordeaux">
          Textes d&apos;origine restaurés.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm font-semibold text-accent-dark">
          Erreur lors de l&apos;enregistrement. Réessayez.
        </p>
      )}

      <SectionEditor
        sectionKey={key}
        fields={def.fields}
        initialData={data as Record<string, unknown>}
      />
    </>
  );
}
