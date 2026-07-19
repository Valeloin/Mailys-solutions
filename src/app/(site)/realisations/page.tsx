import type { Metadata } from "next";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import { Kicker } from "@/components/ui";
import { getRealisationsContent } from "@/lib/sections";

// ============================================================
// RÉALISATIONS — en attente des études de cas du client.
// ⚠️ noindex tant que le contenu réel n'est pas publié
// (une page vide indexée pénaliserait le site entier).
// Retirer `robots` et ajouter la page au sitemap dès publication.
//
// Le contenu est chargé mais n'était pas rendu : la page ne montrait
// qu'un div vide suivi du bandeau CTA, alors qu'un bouton pointe vers
// elle depuis TOUTES les pages du site. Le visiteur qui cherchait la
// preuve de compétence tombait sur un cul-de-sac.
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
      <section aria-labelledby="realisations-title" className="sec sec-clean">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <Kicker>Nos projets</Kicker>
          <h1
            id="realisations-title"
            className="mt-4 max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground sm:text-5xl"
          >
            {c.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {c.intro}
          </p>

          {/* Encart provisoire, sur le modèle de l'état « à venir » du blog :
              on annonce ce qui manque et on propose la suite, plutôt que de
              laisser un vide qui ressemble à une panne. */}
          <div className="card mt-10 max-w-3xl rounded-2xl border border-dashed border-border bg-background p-8 sm:p-10">
            <h2 className="text-xl font-bold text-foreground">
              {c.placeholderTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              {c.placeholderText}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="btn-cta w-full rounded-xl px-7 py-3.5 text-center font-semibold text-white sm:w-auto"
              >
                Parlons de votre projet
              </Link>
              <Link
                href="/services"
                className="btn-ghost w-full rounded-xl border border-border bg-background px-7 py-3.5 text-center font-semibold sm:w-auto"
              >
                Voir nos services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau propre à la page : le bandeau générique renverrait vers
          /realisations, c'est-à-dire ici même. */}
      <CtaSection title={c.cta.title} text={c.cta.text} hideSecondary />
    </>
  );
}
