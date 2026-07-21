import type { Metadata } from "next";
import Link from "next/link";
import Rich from "@/components/Rich";
import ServicePreview from "@/components/ServicePreview";
import HeroShowcase from "@/components/HeroShowcase";
import HeroDevices from "@/components/HeroDevices";
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

// Intitulés courts par service, façon OHIHO (« UNE PAGE UNIQUE,
// EFFICACE »). Posés au-dessus du titre de chaque rangée. Clés = slug.
const SERVICE_TAGS: Record<string, string> = {
  "developpement-application-metier": "Sur mesure, pour vos process",
  "modernisation-application": "Moderniser sans tout refaire",
  "digitalisation-processus": "Du papier au numérique",
  "maintenance-windev-webdev": "Votre appli entre de bonnes mains",
};

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
              <div className="card reveal relative border border-border bg-background p-6 sm:p-8 lg:p-10">
                <div className="rise rise-1 order-1">
                  <Kicker>{c.hero.kicker}</Kicker>
                </div>
                <h1 className="order-2 mt-6 max-w-2xl text-balance text-[clamp(1.65rem,4.6vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-foreground">
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
                {/* Scène « appareils » (MethodShowcase d'OHIHO recolorée
                    Mailys) posée dans la partie droite — longtemps vide —
                    de la carte. En absolu : ne touche pas au flux du texte.
                    Masquée sous lg, où la carte se réempile et où la vitrine
                    défilante occupe déjà l'écran. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] items-center pr-4 lg:flex"
                >
                  <HeroDevices />
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
              <div className="relative rounded-2xl border border-border bg-background p-2 shadow-window">
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
          {/* En-tête sur deux colonnes : titre + kicker à gauche, intro
              déplacée à droite (elle comblait un vide en haut à droite) et
              resserrée. Alignés par le bas pour que l'intro accompagne la
              dernière ligne du titre. En dessous de lg, tout se réempile. */}
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div className="lg:max-w-xl">
              <Kicker>{c.services.kicker}</Kicker>
              <h2
                id="services-title"
                className="mt-4 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl sm:normal-case"
              >
                {c.services.title}
              </h2>
            </div>
            <p className="mt-4 max-w-sm text-muted lg:mt-0 lg:shrink-0">
              {c.services.intro}
            </p>
          </div>

          {/* Agencement repris d'OHIHO : deux services par rangée,
              disposés EN MIROIR — texte | vitrine ‖ vitrine | texte. Les
              maquettes animées se rejoignent au centre, encadrées par
              les intitulés. Chaque service est une sous-grille 2 colonnes
              où la VITRINE prend le plus de place (0.5fr texte / 1fr
              vitrine ≈ deux tiers) : ce sont les animations qu'on veut
              mettre en avant, le texte se resserre autour. L'item de
              droite inverse l'ordre CSS pour poser sa vitrine côté
              centre. Les vitrines ne sont pas sur une card à dégradé :
              c'est l'animation qui porte la couleur, sur la nappe sombre. */}
          <div className="mt-14 grid gap-x-8 gap-y-14 lg:mt-20 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
            {services.map((s, i) => {
              // Item de gauche d'une rangée (i pair) : texte puis vitrine.
              // Item de droite (i impair) : miroir — vitrine côté centre,
              // texte à l'extérieur, obtenu par l'ordre CSS. Le texte
              // reste en PREMIER dans le DOM pour que l'empilement mobile
              // garde le titre au-dessus de la maquette.
              const mirror = i % 2 === 1;
              return (
                <div
                  key={s.slug}
                  className={`reveal grid items-center gap-6 sm:gap-8 ${
                    mirror
                      ? "sm:grid-cols-[1fr_0.5fr]"
                      : "sm:grid-cols-[0.5fr_1fr]"
                  }`}
                >
                  {/* Texte : numéro + intitulé court + titre + desc + lien */}
                  <div className={mirror ? "sm:order-2" : ""}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-extrabold text-orange-text sm:text-3xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-8 bg-orange/40" aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                        {SERVICE_TAGS[s.slug] ?? "Notre expertise"}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      <Link
                        href={`/services/${s.slug}`}
                        className="transition-colors hover:text-orange-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        {s.name}
                      </Link>
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">
                      {s.heroSubtitle}
                    </p>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group/l mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-text"
                    >
                      Découvrir ce service
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-200 group-hover/l:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>

                  {/* Vitrine animée */}
                  <div
                    aria-hidden="true"
                    className={`overflow-hidden rounded-2xl border border-border shadow-[0_24px_50px_-28px_rgb(0_0_0/0.7)] ${
                      mirror ? "sm:order-1" : ""
                    }`}
                  >
                    <ServicePreview slug={s.slug} />
                  </div>
                </div>
              );
            })}
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
        {/* Décor : barres fantômes du logo, inclinées à -22° */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-24 hidden h-72 w-20 -rotate-[22deg] rounded-full bg-coral/[0.05] lg:block" />
          <div className="absolute -right-12 -top-10 hidden h-72 w-16 -rotate-[22deg] rounded-full bg-orange/[0.05] lg:block" />
        </div>

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

      <MobileCtaBar />
    </>
  );
}
