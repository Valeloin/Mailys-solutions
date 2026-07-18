import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import { getRealisationsContent } from "@/lib/sections";

// ============================================================
// RÉALISATIONS — en attente des études de cas du client.
// ⚠️ noindex tant que le contenu réel n'est pas publié
// (une page vide indexée pénaliserait le site entier).
// Retirer `robots` et ajouter la page au sitemap dès publication.
// ============================================================

export const metadata: Metadata = {
  title: "Réalisations : applications métier développées pour des PME",
  description:
    "Découvrez des exemples d'applications métier sur mesure développées pour des PME : gains de temps, automatisation et pilotage simplifié.",
  alternates: { canonical: "/realisations" },
  robots: { index: false, follow: true },
};

export default async function RealisationsPage() {
  const c = await getRealisationsContent();
  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Réalisations", href: "/realisations" }]} />
      </div>

      <section className="sec sec-warm">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {c.h1}
        </h1>
        <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {c.intro}
        </p>

        <div className="mt-12 rounded-2xl border border-dashed border-coral bg-surface p-8 text-center">
          <p className="font-semibold text-foreground">{c.placeholderTitle}</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            {c.placeholderText}
          </p>
        </div>
        </div>
      </section>

      <CtaSection title={c.cta.title} text={c.cta.text} />
    </>
  );
}
