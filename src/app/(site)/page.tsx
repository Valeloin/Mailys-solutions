import type { Metadata } from "next";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import Rich from "@/components/Rich";
import ServicePreview from "@/components/ServicePreview";
import HeroShowcase from "@/components/HeroShowcase";
import WhyUsMotif from "@/components/WhyUsMotif";
import MethodSteps from "@/components/MethodSteps";
import {
  getHomeContent,
  getMergedServices,
  getMethodSteps,
  getWhyUs,
} from "@/lib/sections";
import { Kicker, Check, MobileCtaBar, ProblemItem } from "@/components/ui";

// ============================================================
// ACCUEIL — requête principale :
// « développement d'application métier sur mesure » (PME)
// Textes éditables depuis /admin/contenus (défauts dans
// src/lib/sections.ts). Habillage 100 % CSS, zéro JavaScript.
// ============================================================

export async function generateMetadata(): Promise<Metadata> {
  const c = await getHomeContent();
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [c, services, methodSteps, whyUs] = await Promise.all([
    getHomeContent(),
    getMergedServices(),
    getMethodSteps(),
    getWhyUs(),
  ]);

  return (
    <>
      {/* ================= HERO ================= */}
      {/* En moins de 5 secondes : qui, quoi, pour qui, différence, contact. */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        {/* Décor : barres fantômes du logo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-28 -left-14 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-coral/[0.06] lg:block" />
          <div className="absolute -bottom-36 left-10 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-accent/[0.05] lg:block" />
          <div className="absolute -top-16 right-[16%] hidden h-56 w-14 -rotate-[22deg] rounded-full bg-orange/[0.05] lg:block" />
        </div>
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div className="relative">
            <div className="rise rise-1">
              <Kicker>{c.hero.kicker}</Kicker>
            </div>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-bordeaux sm:text-5xl">
              {c.hero.h1}
            </h1>
            <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              <Rich text={c.hero.subtitle} />
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
              >
                {c.hero.ctaPrimary}
              </Link>
              <Link
                href="/services"
                className="btn-ghost rounded-xl border border-border bg-background px-7 py-3.5 font-semibold"
              >
                {c.hero.ctaSecondary}
              </Link>
            </div>
            <ul className="rise rise-4 mt-10 flex flex-wrap gap-x-4 gap-y-3 text-sm font-medium text-muted">
              {c.hero.reassurance.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 shadow-[0_2px_8px_-4px_rgb(var(--bordeaux)/0.12)]"
                >
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Vitrine décorative : les 4 scènes des services en boucle,
              avec le titre du service synchronisé dessous.
              Visible aussi sur mobile : SVG inline pur, aucune image
              à charger, ratio fixe = zéro décalage de mise en page. */}
          <div className="relative lg:-mt-8" aria-hidden="true">
            <div className="glow-warm absolute -inset-12 rounded-full" />
            {/* Titre de la scène en cours + segments de progression,
                au-dessus de la vitrine */}
            {/* Titre de la scène : orange, sans puce, police unifiée */}
            <div className="relative mb-3 h-9 max-[374px]:h-14">
              {services.map((s, i) => (
                <span
                  key={s.slug}
                  className={`pv-title-${i + 1} absolute inset-0 flex items-center justify-center text-center text-2xl font-bold leading-tight tracking-tight text-orange`}
                >
                  {s.name}
                </span>
              ))}
            </div>
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
      </section>

      {/* ================= SERVICES ================= */}
      <section aria-labelledby="services-title">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <Kicker>{c.services.kicker}</Kicker>
          <h2
            id="services-title"
            className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-bordeaux sm:text-3xl"
          >
            {c.services.title}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">{c.services.intro}</p>
          {/* Cartes en format paysage dès lg : les 4 animations
              tiennent sur un seul écran, deux par deux */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {services.map((s) => (
              <article
                key={s.slug}
                className="group card reveal relative overflow-hidden rounded-2xl border border-border bg-surface p-5 hover:border-coral lg:flex lg:flex-row-reverse lg:items-center lg:gap-5"
              >
                {/* Vignette animée : la maquette du service en action */}
                <div
                  aria-hidden="true"
                  className="mb-4 overflow-hidden rounded-xl border border-border shadow-[0_8px_24px_-16px_rgb(var(--bordeaux)/0.25)] lg:mb-0 lg:w-[44%] lg:shrink-0"
                >
                  <ServicePreview slug={s.slug} />
                </div>
                <div className="lg:min-w-0">
                  <h3 className="text-lg font-bold transition-colors group-hover:text-accent">
                    {/* Lien « étendu » : le ::after se cale sur l'<article relative>
                        → toute la carte est cliquable */}
                    <Link
                      href={`/services/${s.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {s.name}
                    </Link>
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted lg:line-clamp-3">
                    {s.heroSubtitle}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-accent">
                    Découvrir{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROBLÈME → SOLUTION (PAS condensé) ================= */}
      <section aria-labelledby="probleme-title" className="bg-surface">
        <div className="mx-auto grid max-w-content gap-12 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2">
          <div>
            <h2
              id="probleme-title"
              className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
            >
              {c.probleme.title}
            </h2>
            <ul className="mt-6 space-y-3 text-muted">
              {c.probleme.items.map((p) => (
                <ProblemItem key={p}>{p}</ProblemItem>
              ))}
            </ul>
          </div>
          <div className="card relative overflow-hidden rounded-2xl border border-border bg-background p-8">
            <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-1" />
            <h3 className="text-xl font-bold text-bordeaux">
              {c.probleme.solutionTitle}
            </h3>
            {c.probleme.solutionParagraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-muted">
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MÉTHODE ================= */}
      <section aria-labelledby="methode-title">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
          <Kicker>{c.methode.kicker}</Kicker>
          <h2
            id="methode-title"
            className="mt-3 text-2xl font-bold tracking-tight text-bordeaux sm:text-3xl"
          >
            {c.methode.title}
          </h2>
          {/* Fil conducteur : dégradé corail → orange → rouge */}
          <div
            aria-hidden="true"
            className="mt-6 hidden h-px bg-gradient-to-r from-coral/40 via-orange/40 to-accent/40 lg:block"
          />
          <MethodSteps steps={methodSteps} />
        </div>
      </section>

      {/* ================= POURQUOI NOUS ================= */}
      <section aria-labelledby="pourquoi-title" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-24">
          <h2
            id="pourquoi-title"
            className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            {c.pourquoi.title}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item, i) => (
              <div
                key={item.title}
                className="card reveal rounded-2xl border border-border/60 bg-background p-7"
              >
                <WhyUsMotif index={i} />
                <h3 className="font-bold text-bordeaux">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
      <MobileCtaBar />
    </>
  );
}
