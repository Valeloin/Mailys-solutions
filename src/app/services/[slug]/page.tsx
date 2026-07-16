import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, METHOD_STEPS, WHY_US, getService } from "@/lib/services";
import { SITE } from "@/lib/site";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";

// ============================================================
// GABARIT DES 4 PAGES SERVICES — structure PAS en 9 blocs :
// Hero → Problèmes → Conséquences → Solution → Bénéfices
// → Méthode → Pourquoi nous → FAQ → CTA final.
// Généré en statique : Google reçoit du HTML complet.
// ============================================================

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const siblings = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* Schema.org : Service + FAQPage */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.metaDescription,
          url: `${SITE.url}/services/${service.slug}`,
          areaServed: "FR",
          provider: {
            "@type": "ProfessionalService",
            name: SITE.name,
            url: SITE.url,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />

      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb
          items={[
            { name: "Services", href: "/services" },
            { name: service.name, href: `/services/${service.slug}` },
          ]}
        />
      </div>

      {/* ========== 1. HERO ========== */}
      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-bordeaux sm:text-5xl">
          {service.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {service.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Demander un devis gratuit
          </Link>
          <a
            href="#methode"
            className="rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-coral"
          >
            Voir notre méthode
          </a>
        </div>
      </section>

      {/* ========== 2. LES PROBLÉMATIQUES ========== */}
      <section aria-labelledby="problemes" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="problemes"
            className="max-w-2xl text-3xl font-bold tracking-tight text-bordeaux"
          >
            {service.problemsIntro}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {service.problems.map((p) => (
              <li
                key={p}
                className="flex gap-3 rounded-xl bg-background p-4 shadow-sm"
              >
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"></span>
                <span className="text-foreground">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold text-bordeaux">
            Si vous vous reconnaissez dans plusieurs de ces situations, la
            suite va vous intéresser.
          </p>
        </div>
      </section>

      {/* ========== 3. LES CONSÉQUENCES ========== */}
      <section aria-labelledby="consequences">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="consequences"
            className="max-w-2xl text-3xl font-bold tracking-tight text-bordeaux"
          >
            Ce que cela coûte vraiment à votre entreprise
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{service.consequencesIntro}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {service.consequences.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border p-6">
                <h3 className="font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 4. LA SOLUTION ========== */}
      <section aria-labelledby="solution" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="solution"
            className="max-w-3xl text-3xl font-bold tracking-tight text-bordeaux"
          >
            {service.solutionTitle}
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-muted">
            {service.solutionParagraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {service.solutionPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden="true" className="mt-1 font-bold text-orange">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Parler de votre projet
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 5. LES BÉNÉFICES ========== */}
      <section aria-labelledby="benefices">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="benefices"
            className="text-3xl font-bold tracking-tight text-bordeaux"
          >
            Les bénéfices concrets pour vos équipes
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border p-5">
                <h3 className="flex items-center gap-2 font-bold">
                  <span aria-hidden="true" className="text-orange">✓</span>
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 6. NOTRE MÉTHODE ========== */}
      <section id="methode" aria-labelledby="methode-titre" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="methode-titre"
            className="text-3xl font-bold tracking-tight text-bordeaux"
          >
            Notre méthode : 7 étapes, zéro mauvaise surprise
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METHOD_STEPS.map((step, i) => (
              <li key={step.title} className="rounded-2xl bg-background p-5 shadow-sm">
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

      {/* ========== 7. POURQUOI NOUS CHOISIR ========== */}
      <section aria-labelledby="pourquoi">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="pourquoi"
            className="text-3xl font-bold tracking-tight text-bordeaux"
          >
            Pourquoi choisir Mailys Solutions
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border p-5">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 8. FAQ ========== */}
      <section aria-labelledby="faq" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2 id="faq" className="text-3xl font-bold tracking-tight text-bordeaux">
            Questions fréquentes
          </h2>
          <div className="mt-8 max-w-3xl space-y-3">
            {service.faq.map((f) => (
              <details
                key={f.question}
                className="group rounded-xl border border-border bg-background p-5 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold">{f.question}</h3>
                  <span
                    aria-hidden="true"
                    className="text-xl text-orange transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Maillage interne : services voisins ========== */}
      <section aria-labelledby="autres-services">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
          <h2
            id="autres-services"
            className="text-2xl font-bold tracking-tight text-bordeaux"
          >
            Nos autres services
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-xl border border-border p-5 transition-colors hover:border-coral"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="mt-1 block text-sm text-accent">
                  Découvrir <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 9. CTA FINAL ========== */}
      <CtaSection />
    </>
  );
}
