import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";

// ============================================================
// HUB SERVICES — page carrefour du cocon sémantique :
// elle distribue le jus SEO vers les 4 pages services.
// ============================================================

export const metadata: Metadata = {
  title: "Nos services : développement, modernisation, digitalisation",
  description:
    "Développement d'applications métier sur mesure, modernisation d'applications, digitalisation des processus et maintenance WINDEV / WEBDEV pour PME.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Services", href: "/services" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-bordeaux">
          Nos services pour digitaliser votre PME
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Création d&apos;applications métier sur mesure, modernisation de
          logiciels existants, digitalisation des processus et maintenance
          WINDEV / WEBDEV : quatre expertises, une seule approche — comprendre
          votre métier avant de développer.
        </p>

        <div className="mt-12 space-y-8">
          {SERVICES.map((s, i) => (
            <article
              key={s.slug}
              className="grid gap-6 rounded-2xl border border-border p-6 sm:p-8 md:grid-cols-[auto_1fr]"
            >
              <p aria-hidden="true" className="text-2xl font-extrabold text-orange">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="text-2xl font-bold">
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-accent"
                  >
                    {s.name}
                  </Link>
                </h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                  {s.heroSubtitle}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                  {s.solutionPoints.slice(0, 3).map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-coral"></span>
                      {point.split(" : ")[0]}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-5 inline-block font-semibold text-accent underline-offset-2 hover:underline"
                >
                  En savoir plus sur {s.name.toLowerCase()}{" "}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaSection
        title="Vous ne savez pas par où commencer ?"
        text="Décrivez-nous simplement votre situation : nous vous orientons vers la bonne approche, même si elle est plus modeste que ce que vous imaginiez."
      />
    </>
  );
}
