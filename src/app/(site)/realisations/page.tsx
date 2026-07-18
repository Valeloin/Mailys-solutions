import type { Metadata } from "next";
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
        {/* En attente du contenu */}
      </div>
      <CtaSection />
    </>
  );
}
