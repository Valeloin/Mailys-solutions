import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import {
  getMergedService,
  getMergedServices,
  getMethodSteps,
  getWhyUs,
} from "@/lib/sections";
import { SITE } from "@/lib/site";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { Check, Kicker, MobileCtaBar, ProblemItem } from "@/components/ui";
import WhyUsMotif from "@/components/WhyUsMotif";
import MethodSteps from "@/components/MethodSteps";

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
  const service = await getMergedService(slug);
  if (!service) return {};
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getMergedService(slug);
  if (!service) notFound();

  const [allServices, METHOD_STEPS, WHY_US] = await Promise.all([
    getMergedServices(),
    getMethodSteps(),
    getWhyUs(),
  ]);
  const siblings = allServices.filter((s) => s.slug !== service.slug);

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
      <section className="relative overflow-hidden">
        {/* Décor : les deux barres du logo, fantômes (desktop uniquement) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-14 -top-24 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-coral/[0.06] lg:block" />
          <div className="absolute -top-32 right-10 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-accent/[0.05] lg:block" />
        </div>
        <div className="relative mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-bordeaux sm:text-5xl">
            {service.h1}
          </h1>
          <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {service.heroSubtitle}
          </p>
          <div className="rise rise-3 mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
            >
              Demander un devis gratuit
            </Link>
            <a
              href="#methode"
              className="btn-ghost rounded-xl border border-border bg-background px-7 py-3.5 font-semibold"
            >
              Voir notre méthode
            </a>
          </div>
        </div>
      </section>

      {/* ========== 2. LES PROBLÉMATIQUES ========== */}
      {/* Même grammaire que l'accueil : décor de barres fantômes, kicker,
          cartes « problème » (pastille dégradée + halo animé). */}
      <section
        aria-labelledby="problemes"
        className="relative overflow-hidden bg-surface"
      >
        {/* Décor : barres fantômes du logo, inclinées à -22° */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-24 hidden h-72 w-20 -rotate-[22deg] rounded-full bg-coral/[0.05] lg:block" />
          <div className="absolute -right-12 -top-10 hidden h-72 w-16 -rotate-[22deg] rounded-full bg-orange/[0.05] lg:block" />
        </div>
        <div className="relative mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <Kicker>Le constat</Kicker>
          <h2
            id="problemes"
            className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            {service.problemsIntro}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {service.problems.map((p) => (
              <ProblemItem key={p}>{p}</ProblemItem>
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
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="consequences"
            className="max-w-2xl text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Ce que cela coûte vraiment à votre entreprise
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{service.consequencesIntro}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {service.consequences.map((c) => (
              <div
                key={c.title}
                className="card reveal rounded-2xl border border-border bg-background p-6"
              >
                <h3 className="font-bold text-bordeaux">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 4. LA SOLUTION ========== */}
      <section aria-labelledby="solution" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <div className="card relative overflow-hidden rounded-2xl border border-border bg-background p-8 sm:p-10">
            <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-1" />
            <h2
              id="solution"
              className="max-w-3xl text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
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
                  <Check className="mt-1 h-4 w-4" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                href="/contact"
                className="btn-cta inline-block rounded-xl px-7 py-3.5 font-semibold text-white"
              >
                Parler de votre projet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 5. LES BÉNÉFICES ========== */}
      <section aria-labelledby="benefices">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="benefices"
            className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Les bénéfices concrets pour vos équipes
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((b) => (
              <div
                key={b.title}
                className="card reveal rounded-2xl border border-border bg-background p-5"
              >
                <h3 className="flex items-center gap-2 font-bold text-bordeaux">
                  <Check />
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
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="methode-titre"
            className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Notre méthode, étape par étape et sans surprise
          </h2>
          {/* Fil conducteur : dégradé corail → orange → rouge */}
          <div
            aria-hidden="true"
            className="mt-6 hidden h-px bg-gradient-to-r from-coral/40 via-orange/40 to-accent/40 lg:block"
          />
          <MethodSteps steps={METHOD_STEPS} />
        </div>
      </section>

      {/* ========== 7. POURQUOI NOUS CHOISIR ========== */}
      <section aria-labelledby="pourquoi">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="pourquoi"
            className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Pourquoi choisir Mailys Solutions
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item, i) => (
              <div
                key={item.title}
                className="card reveal rounded-2xl border border-border/60 bg-background p-7"
              >
                <WhyUsMotif index={i} />
                <h3 className="font-bold text-bordeaux">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 8. FAQ ========== */}
      <section aria-labelledby="faq" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="faq"
            className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Questions fréquentes
          </h2>
          <div className="mt-8 max-w-3xl space-y-3">
            {service.faq.map((f) => (
              <details
                key={f.question}
                className="group rounded-xl border border-border bg-background p-5 transition-shadow open:shadow-[0_16px_40px_-24px_rgb(var(--bordeaux)/0.2)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold">{f.question}</h3>
                  <span
                    aria-hidden="true"
                    className="text-xl text-orange-text transition-transform group-open:rotate-45"
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
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
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
                className="card group rounded-xl border border-border bg-background p-5 hover:border-coral"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="mt-1 block text-sm font-semibold text-accent">
                  Découvrir{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 9. CTA FINAL ========== */}
      <CtaSection />
      <MobileCtaBar />
    </>
  );
}
