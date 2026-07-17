import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import ServicePreview from "@/components/ServicePreview";
import HeroShowcase from "@/components/HeroShowcase";
import { getServicesHubContent, getMergedServices } from "@/lib/sections";
import { Kicker, MobileCtaBar, StepNumber } from "@/components/ui";

// ============================================================
// HUB SERVICES — page carrefour du cocon sémantique :
// elle distribue le jus SEO vers les 4 pages services.
// Habillage repris de l'accueil : hero décoré (barres fantômes
// du logo + kicker) puis blocs éditoriaux en zigzag, chacun
// portant sa vignette animée en pur CSS (mêmes scènes que
// l'accueil, aucune image, coupées par prefers-reduced-motion).
// Textes éditables dans /admin/contenus.
// ============================================================

export async function generateMetadata(): Promise<Metadata> {
  const c = await getServicesHubContent();
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: "/services" },
  };
}

export default async function ServicesPage() {
  const [c, SERVICES] = await Promise.all([
    getServicesHubContent(),
    getMergedServices(),
  ]);

  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Services", href: "/services" }]} />
      </div>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        {/* Décor : les barres fantômes du logo, inclinées à -22° */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-28 -left-14 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-coral/[0.06] lg:block" />
          <div className="absolute -bottom-36 left-10 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-accent/[0.05] lg:block" />
          <div className="absolute -top-16 right-[14%] hidden h-56 w-14 -rotate-[22deg] rounded-full bg-orange/[0.05] lg:block" />
        </div>

        <div className="relative mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,30rem)]">
            {/* Colonne texte */}
            <div>
              <div className="rise rise-1">
                <Kicker>Nos expertises</Kicker>
              </div>
              <h1 className="mt-6 max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-bordeaux sm:text-5xl">
                {c.h1}
              </h1>
              <p className="rise rise-2 mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {c.intro}
              </p>
              <div className="rise rise-3 mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
                >
                  Demander un devis gratuit
                </Link>
                <a
                  href="#nos-services"
                  className="btn-ghost rounded-xl border border-border bg-background px-7 py-3.5 font-semibold"
                >
                  Découvrir nos services
                </a>
              </div>
            </div>

            {/* Vitrine défilante : mêmes 4 vignettes que l'accueil, titre
                et onglets segmentés synchronisés (mêmes horloges CSS) */}
            <div className="relative" aria-hidden="true">
              <div className="glow-warm absolute -inset-12 rounded-full" />
              {/* Titre de la scène en cours (cross-slide pv-title-N) */}
              <div className="relative mb-3 h-9 max-[374px]:h-14">
                {SERVICES.map((s, i) => (
                  <span
                    key={s.slug}
                    className={`pv-title-${i + 1} absolute inset-0 flex items-center justify-center text-center text-2xl font-bold leading-tight tracking-tight text-orange`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
              {/* Onglets segmentés : le segment actif suit la scène */}
              <div className="mb-5 flex justify-center gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <span
                    key={n}
                    className="relative h-1.5 w-8 overflow-hidden rounded-full bg-bordeaux/10"
                  >
                    <span className={`pv-scene-${n} absolute inset-0 rounded-full bg-accent/70`} />
                  </span>
                ))}
              </div>
              <div className="relative rounded-2xl border border-border bg-background p-2 shadow-window">
                <HeroShowcase />
              </div>
            </div>
          </div>

          {/* Sommaire cliquable : les 4 expertises, chacune saute à son bloc */}
          <nav
            aria-label="Nos services"
            className="rise rise-4 mt-10 flex flex-wrap gap-2.5"
          >
            {SERVICES.map((s, i) => (
              <a
                key={s.slug}
                href={`#service-${s.slug}`}
                className="group flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-muted shadow-[0_2px_8px_-4px_rgb(var(--bordeaux)/0.12)] transition-colors hover:border-coral hover:text-bordeaux"
              >
                <span className="font-bold text-orange-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ================= LES 4 BLOCS ================= */}
      <section
        id="nos-services"
        aria-label="Détail de nos services"
        className="scroll-mt-8"
      >
        <div className="mx-auto max-w-content space-y-8 px-4 py-16 sm:px-6 sm:py-20">
          {SERVICES.map((s, i) => (
            <article
              key={s.slug}
              id={`service-${s.slug}`}
              className="card reveal group relative scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-background p-6 hover:border-coral sm:p-8 lg:p-10"
            >
              {/* Filet dégradé signature révélé au survol */}
              <span
                aria-hidden="true"
                className="brand-hairline absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              />
              <div
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-last" : ""
                }`}
              >
                {/* Vignette animée : la maquette du service en action */}
                <div aria-hidden="true" className="relative">
                  <div className="glow-warm absolute -inset-6 rounded-full" />
                  <div className="relative overflow-hidden rounded-2xl border border-border shadow-window">
                    <ServicePreview slug={s.slug} />
                  </div>
                </div>

                {/* Contenu */}
                <div>
                  <div className="flex items-center gap-3">
                    <StepNumber size="lg">
                      {String(i + 1).padStart(2, "0")}
                    </StepNumber>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-text">
                      Expertise
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-bordeaux transition-colors group-hover:text-accent sm:text-3xl">
                    <Link
                      href={`/services/${s.slug}`}
                      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {s.name}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted">
                    {s.heroSubtitle}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.solutionPoints.slice(0, 3).map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-coral"
                        />
                        {point.split(" : ")[0]}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-6 inline-block font-semibold text-accent underline-offset-2 hover:underline"
                  >
                    En savoir plus sur {s.name.toLowerCase()}{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaSection title={c.cta.title} text={c.cta.text} />
      <MobileCtaBar />
    </>
  );
}
