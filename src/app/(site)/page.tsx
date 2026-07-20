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
import { Kicker, MobileCtaBar, ProblemItem } from "@/components/ui";

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
      <section className="sec sec-warm relative overflow-hidden border-b border-border">
        {/* Décor du hero en portrait. Les barres inclinées ont disparu,
            ici comme partout ailleurs : posées à 5 % d'opacité, elles se
            fondaient dans l'ancien fond blanc, mais deviennent des
            traînées franches en travers du fond sombre. Restent les
            halos et les points, qui diffusent au lieu de trancher. */}
        <div aria-hidden="true" className="hero-decor lg:hidden">
          <span className="hero-halo-1" />
          <span className="hero-halo-2" />
          <span className="hero-dot-1" />
          <span className="hero-dot-2" />
        </div>
        {/* Structure reprise du hero de la page Services : colonne
            texte + vitrine défilante, puis sommaire des 4 expertises.
            Seul le contenu texte reste celui de l'accueil. */}
        <div className="relative mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-0 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-12">
            {/* Colonne texte. En mobile, `contents` la dissout : ses enfants
                deviennent des cellules de la grille, ce qui permet de glisser
                la vitrine entre le titre et le texte (ordre 3). Sans cela elle
                se retrouve sous les boutons, hors écran sur téléphone.
                Dès lg, la colonne se reforme et les ordres n'ont plus cours. */}
            <div className="contents lg:block">
              <div className="card reveal relative rounded-3xl border border-border bg-background p-6 sm:p-8 lg:p-10">
                <div className="rise rise-1 order-1">
                  <Kicker>{c.hero.kicker}</Kicker>
                </div>
                {/* Le calibrage précédent — clamp(1.65rem, 4.6vw, 2.6rem) —
                    inversait la hiérarchie : à 660 px le h1 tombait à
                    30,4 px alors que ses propres h2 sont à 36 px. Le titre
                    de la page était plus petit que ses sous-titres, donc
                    l'œil entrait par le mauvais endroit.
                    La borne basse (2,25 rem) tient au-dessus des h2 mobiles
                    à 30 px, et 6 vw garantit la domination dès 640 px, où
                    les h2 passent à 36 px. */}
                <h1 className="order-2 mt-6 max-w-2xl text-balance text-[clamp(2.25rem,6vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.028em] text-foreground">
                  {c.hero.h1}
                </h1>
                <p className="rise rise-2 order-4 mt-6 max-w-xl text-lg leading-relaxed text-muted">
                  <Rich text={c.hero.subtitle} />
                </p>
                <div className="rise rise-3 order-5 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  href="/contact"
                  className="btn-cta w-full rounded-xl px-7 py-3.5 text-center font-semibold text-white sm:w-auto"
                >
                  {c.hero.ctaPrimary}
                </Link>
                <Link
                  href="/services"
                  className="btn-ghost w-full rounded-xl border border-border bg-background px-7 py-3.5 text-center font-semibold sm:w-auto"
                >
                  {c.hero.ctaSecondary}
                </Link>
              </div>
              </div>
            </div>

            {/* Vitrine défilante : titre et onglets segmentés
                synchronisés (mêmes horloges CSS).
                Ordre 3 en mobile → juste sous le titre, donc vue d'emblée. */}
            <div
              className="relative order-3 mt-8 lg:order-none lg:mt-0"
              aria-hidden="true"
            >
              <div className="glow-warm absolute -inset-12 rounded-full" />
              {/* Titre de la scène en cours (cross-slide pv-title-N) */}
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
              {/* La vitrine flotte, sans cadre. Elle était enfermée dans
                  une bordure + un fond + 8 px de marge : sur l'ancien
                  fond blanc le cadre se confondait avec la page, sur le
                  fond sombre il dessine un rectangle net autour de
                  l'animation et l'enferme. L'animation porte déjà sa
                  propre forme, elle n'a pas besoin qu'on la délimite. */}
              <div className="relative">
                <HeroShowcase />
              </div>
            </div>
          </div>

          {/* Sommaire cliquable : les 4 expertises, chacune vers sa page
              (sur l'accueil il n'y a pas d'ancre interne à viser). */}
          <nav
            aria-label="Nos services"
            className="rise rise-4 mt-10 flex flex-wrap gap-2.5"
          >
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-muted shadow-[0_2px_8px_-4px_rgb(var(--bordeaux)/0.12)] transition-colors hover:border-coral hover:text-foreground"
              >
                <span
                  className="num-pop font-bold text-orange-text"
                  style={{ animationDelay: `${i * 1.2}s` }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section aria-labelledby="services-title" className="sec sec-clean">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <Kicker>{c.services.kicker}</Kicker>
          <h2
            id="services-title"
            className="mt-4 max-w-2xl text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl sm:normal-case"
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
      {/* Même grammaire que le hero : décor de barres fantômes, kicker,
          panneau chaud premium (dégradé + halo + reflet animé), ombrages. */}
      <section
        aria-labelledby="probleme-title"
        className="sec sec-deep relative overflow-hidden"
      >

        <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2">
          {/* ---------- GAUCHE : le constat ---------- */}
          <div>
            <Kicker>Le constat</Kicker>
            <h2
              id="probleme-title"
              className="mt-5 text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl sm:normal-case"
            >
              {c.probleme.title}
            </h2>
            <ul className="mt-8 space-y-3 text-muted">
              {c.probleme.items.map((p, i) => (
                // Chaque point de douleur posé en question (écho du H2)
                <ProblemItem key={p} index={i}>
                  {/[?!.]$/.test(p) ? p : `${p} ?`}
                </ProblemItem>
              ))}
            </ul>
          </div>

          {/* ---------- DROITE : la réponse (panneau premium chaud, épuré) ---------- */}
          <div className="reveal group relative overflow-hidden rounded-3xl border border-orange/20 bg-background p-8 shadow-[0_30px_70px_-32px_rgb(var(--accent)/0.3)] sm:p-10">
            {/* Décor chaud, net : lavis diagonal + halo orangé en haut à
                droite (sans barre fantôme ni reflet — comme la maquette). */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange/[0.08] to-transparent" />
              <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-orange/[0.16] blur-3xl" />
            </div>
            <div className="relative">
              {/* Badge « la réponse » : pilule + les deux points du logo */}
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange/25 bg-orange/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-orange-text">
                <span aria-hidden="true" className="pv-dot h-1.5 w-1.5 rounded-full bg-orange" />
                <span
                  aria-hidden="true"
                  className="pv-dot h-1.5 w-1.5 rounded-full bg-coral"
                  style={{ animationDelay: "0.4s" }}
                />
                La réponse
              </p>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                {c.probleme.solutionTitle}
              </h3>
              {c.probleme.solutionParagraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-muted">
                  <Rich text={p} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MÉTHODE ================= */}
      <section aria-labelledby="methode-title" className="sec sec-warm">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
          <Kicker>{c.methode.kicker}</Kicker>
          <h2
            id="methode-title"
            className="mt-3 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl sm:normal-case"
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
      <section aria-labelledby="pourquoi-title" className="sec sec-clean">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-24">
          <h2
            id="pourquoi-title"
            className="text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl sm:normal-case"
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
                <h3 className="font-bold text-foreground">{item.title}</h3>
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
