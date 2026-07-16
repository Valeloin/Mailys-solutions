import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE } from "@/lib/site";
import { StepNumber } from "@/components/ui";

// ============================================================
// CONTACT — page de conversion.
// Le formulaire (avec envoi email + stockage) arrive avec la
// phase backend/admin ; en attendant : CTA email direct,
// promesse de réponse et déroulé des étapes (réassurance).
// ============================================================

export const metadata: Metadata = {
  title: "Contact : parlons de votre projet d'application métier",
  description:
    "Décrivez-nous votre projet d'application métier ou votre besoin de maintenance WINDEV / WEBDEV : réponse rapide, devis gratuit et sans engagement.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Contact", href: "/contact" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-bordeaux sm:text-5xl">
              Parlons de votre projet
            </h1>
            <p className="rise rise-2 mt-6 text-lg leading-relaxed text-muted">
              Application métier à créer, logiciel à moderniser, processus à
              digitaliser ou application WINDEV à reprendre : décrivez-nous
              votre situation en quelques lignes. Nous revenons vers vous
              rapidement avec un premier avis honnête —{" "}
              <strong className="text-foreground">
                gratuit et sans engagement
              </strong>
              .
            </p>

            <a
              href={`mailto:${SITE.email}?subject=Demande de devis`}
              className="btn-cta mt-8 inline-block rounded-xl px-7 py-3.5 font-semibold text-white"
            >
              Écrivez-nous : {SITE.email}
            </a>

            <p className="mt-4 text-sm text-muted">
              Réponse sous 24 h ouvrées — vos informations restent
              strictement confidentielles.
            </p>
          </div>

          <div className="card relative overflow-hidden rounded-2xl border border-border bg-surface p-8">
            <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-1" />
            <h2 className="text-xl font-bold text-bordeaux">
              Ce qui se passe ensuite
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                {
                  title: "Un premier échange",
                  text: "30 minutes par téléphone ou visio pour comprendre votre besoin, votre contexte et vos priorités.",
                },
                {
                  title: "Un avis honnête",
                  text: "Nous vous disons ce que nous ferions à votre place — même si la réponse est « pas besoin de développement ».",
                },
                {
                  title: "Un devis clair et détaillé",
                  text: "Périmètre, étapes, délais, budget : tout est écrit noir sur blanc, sans surprise en cours de route.",
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <StepNumber size="sm">{i + 1}</StepNumber>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
