import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";

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

export default function RealisationsPage() {
  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Réalisations", href: "/realisations" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-bordeaux">
          Nos réalisations
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Chaque projet raconte la même histoire : une entreprise freinée par
          ses outils, un logiciel conçu pour ses processus réels, des équipes
          qui respirent. Nos premières études de cas détaillées arrivent très
          prochainement.
        </p>

        <div className="mt-12 rounded-2xl border border-dashed border-coral bg-surface p-8 text-center">
          <p className="font-semibold text-bordeaux">
            Études de cas en cours de rédaction
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Nous documentons actuellement plusieurs projets récents
            (secteurs, problématiques, résultats obtenus). En attendant,
            parlons directement du vôtre : c&apos;est encore plus concret.
          </p>
        </div>
      </section>

      <CtaSection
        title="Votre projet sera peut-être notre prochaine réalisation"
        text="Décrivez-nous votre besoin : nous vous répondons rapidement avec un premier avis honnête, gratuit et sans engagement."
      />
    </>
  );
}
