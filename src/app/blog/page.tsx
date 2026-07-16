import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";

// ============================================================
// BLOG — pilier SEO longue traîne (articles gérés via l'admin,
// phase CMS). ⚠️ noindex tant qu'aucun article n'est publié.
// Retirer `robots` et ajouter au sitemap dès le premier article.
// ============================================================

export const metadata: Metadata = {
  title: "Blog : digitalisation et applications métier pour PME",
  description:
    "Conseils, retours d'expérience et guides pratiques sur la digitalisation des PME, les applications métier sur mesure et la maintenance WINDEV / WEBDEV.",
  alternates: { canonical: "/blog" },
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Blog", href: "/blog" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-bordeaux sm:text-5xl">
          Le blog de la digitalisation des PME
        </h1>
        <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Guides pratiques, retours d&apos;expérience et conseils concrets
          pour digitaliser votre entreprise : applications métier,
          automatisation des processus, modernisation de logiciels et
          maintenance WINDEV / WEBDEV.
        </p>

        <div className="mt-12 rounded-2xl border border-dashed border-coral bg-surface p-8 text-center">
          <p className="font-semibold text-bordeaux">
            Les premiers articles arrivent bientôt
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Nous préparons une série de guides pratiques répondant aux
            questions que se posent les dirigeants de PME. Une question en
            particulier ? Posez-la nous directement.
          </p>
        </div>
      </section>

      <CtaSection
        title="Une question sur votre projet ?"
        text="Inutile d'attendre l'article : posez-nous directement votre question, nous y répondons avec plaisir."
        buttonLabel="Poser ma question"
      />
    </>
  );
}
