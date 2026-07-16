import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import { METHOD_STEPS } from "@/lib/services";

// ============================================================
// À PROPOS — page de réassurance (E-E-A-T) : qui nous sommes,
// comment nous travaillons, ce que nous croyons.
// ============================================================

export const metadata: Metadata = {
  title: "À propos : votre partenaire digitalisation PME",
  description:
    "Mailys Solutions accompagne les PME dans leur transformation digitale : applications métier sur mesure, modernisation et maintenance WINDEV / WEBDEV.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "À propos", href: "/a-propos" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-bordeaux">
          Le partenaire digital des PME qui veulent des outils à leur mesure
        </h1>

        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Mailys Solutions est née d&apos;un constat simple : les PME
            méritent mieux que des logiciels génériques qui les obligent à
            tordre leur organisation — et mieux que des fichiers Excel qui
            craquent de partout.
          </p>
          <p>
            Notre métier : concevoir des{" "}
            <Link
              href="/services/developpement-application-metier"
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              applications métier sur mesure
            </Link>{" "}
            qui simplifient réellement le quotidien des équipes,{" "}
            <Link
              href="/services/modernisation-application"
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              moderniser des applications existantes
            </Link>{" "}
            et assurer la{" "}
            <Link
              href="/services/maintenance-windev-webdev"
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              maintenance évolutive d&apos;applications WINDEV et WEBDEV
            </Link>
            .
          </p>
          <p>
            Notre conviction : un bon logiciel commence par une bonne
            compréhension. Avant de développer, nous passons du temps dans
            votre réalité — vos équipes, vos contraintes, vos habitudes. C&apos;est
            ce travail-là qui fait qu&apos;un outil est adopté au lieu d&apos;être subi.
          </p>
        </div>
      </section>

      <section aria-labelledby="valeurs" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2 id="valeurs" className="text-3xl font-bold tracking-tight text-bordeaux">
            Ce qui guide notre façon de travailler
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "La franchise",
                text: "Si un développement ne se justifie pas, nous vous le disons. Un client bien conseillé aujourd'hui est un client qui revient demain.",
              },
              {
                title: "La simplicité",
                text: "Pas de jargon, pas d'usine à gaz. Le meilleur logiciel est celui que vos équipes utilisent sans y penser.",
              },
              {
                title: "L'engagement long terme",
                text: "Nous ne livrons pas puis disparaissons : nous restons responsables de ce que nous construisons, année après année.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl bg-background p-6 shadow-sm">
                <h3 className="font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="apropos-methode">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="apropos-methode"
            className="text-3xl font-bold tracking-tight text-bordeaux"
          >
            Notre méthode en 7 étapes
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD_STEPS.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-border p-5">
                <p className="text-sm font-bold text-orange">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
