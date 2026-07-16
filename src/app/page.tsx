import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, METHOD_STEPS, WHY_US } from "@/lib/services";
import CtaSection from "@/components/CtaSection";

// ============================================================
// ACCUEIL — requête principale :
// « développement d'application métier sur mesure » (PME)
// ============================================================

export const metadata: Metadata = {
  title:
    "Développement d'application métier sur mesure pour PME | Mailys Solutions",
  description:
    "Mailys Solutions développe des applications métier sur mesure pour PME : fini Excel et les ressaisies. Digitalisation, modernisation, maintenance WINDEV / WEBDEV.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      {/* En moins de 5 secondes : qui, quoi, pour qui, différence, contact. */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
            Applications métier pour PME
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-bordeaux sm:text-5xl">
            Développement d&apos;applications métier sur mesure pour PME
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Remplacez les fichiers Excel, les ressaisies et les processus
            manuels par un logiciel conçu pour <strong className="text-foreground">votre</strong> façon
            de travailler. Nous concevons, modernisons et maintenons les
            applications qui font tourner votre entreprise.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Demander un devis gratuit
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-border bg-background px-6 py-3 font-semibold transition-colors hover:border-coral"
            >
              Découvrir nos services
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-muted">
            {[
              "Du vrai sur mesure",
              "Un interlocuteur unique",
              "Un suivi long terme",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-orange"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section aria-labelledby="services-title">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
            Nos services
          </p>
          <h2
            id="services-title"
            className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-bordeaux"
          >
            Quatre façons de simplifier le quotidien de votre entreprise
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Que votre besoin soit de créer un outil, de sauver un logiciel
            vieillissant ou d&apos;en finir avec le papier, nous partons
            toujours du même point : comprendre votre métier.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <article
                key={s.slug}
                className="group rounded-2xl border border-border p-6 transition-colors hover:border-coral"
              >
                <h3 className="text-lg font-bold">
                  <Link
                    href={`/services/${s.slug}`}
                    className="after:absolute after:inset-0 relative"
                  >
                    {s.name}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {s.heroSubtitle}
                </p>
                <p className="mt-4 text-sm font-semibold text-accent">
                  Découvrir <span aria-hidden="true">→</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROBLÈME → SOLUTION (PAS condensé) ================= */}
      <section aria-labelledby="probleme-title" className="bg-surface">
        <div className="mx-auto grid max-w-content gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <h2
              id="probleme-title"
              className="text-3xl font-bold tracking-tight text-bordeaux"
            >
              Vos outils vous ralentissent au lieu de vous aider ?
            </h2>
            <ul className="mt-6 space-y-3 text-muted">
              {[
                "Des fichiers Excel partout, jamais à jour",
                "Les mêmes informations ressaisies plusieurs fois",
                "Un logiciel vieillissant que plus personne n'ose toucher",
                "Des processus qui ne tiennent que grâce aux habitudes",
                "Aucune visibilité fiable pour piloter l'activité",
              ].map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent"></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold">
              Un logiciel qui épouse vos processus — pas l&apos;inverse
            </h3>
            <p className="mt-4 leading-relaxed text-muted">
              Les logiciels génériques imposent leur logique : c&apos;est à vos
              équipes de s&apos;adapter, de contourner, de bricoler. Nous
              faisons le chemin inverse : nous étudions votre fonctionnement
              réel, puis nous développons{" "}
              <Link
                href="/services/developpement-application-metier"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                l&apos;application métier
              </Link>{" "}
              qui l&apos;épouse exactement.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Votre logiciel actuel a de la valeur mais vieillit mal ? Nous le{" "}
              <Link
                href="/services/modernisation-application"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                modernisons
              </Link>{" "}
              sans perdre vos données. Vos équipes croulent sous le papier et
              les e-mails ? Nous{" "}
              <Link
                href="/services/digitalisation-processus"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                digitalisons vos processus
              </Link>
              . Votre application WINDEV n&apos;a plus de développeur ? Nous en{" "}
              <Link
                href="/services/maintenance-windev-webdev"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                reprenons la maintenance
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ================= MÉTHODE ================= */}
      <section aria-labelledby="methode-title">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
            Notre méthode
          </p>
          <h2
            id="methode-title"
            className="mt-3 text-3xl font-bold tracking-tight text-bordeaux"
          >
            Un projet mené en 7 étapes, sans jargon et sans surprise
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD_STEPS.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-border p-5">
                <p className="text-sm font-bold text-orange">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= POURQUOI NOUS ================= */}
      <section aria-labelledby="pourquoi-title" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
          <h2
            id="pourquoi-title"
            className="text-3xl font-bold tracking-tight text-bordeaux"
          >
            Pourquoi les PME nous font confiance
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item) => (
              <div key={item.title} className="rounded-2xl bg-background p-6 shadow-sm">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
