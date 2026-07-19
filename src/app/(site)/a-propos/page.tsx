import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import Rich from "@/components/Rich";
import { getAproposContent, getMethodSteps } from "@/lib/sections";
import { BrandDots, Kicker } from "@/components/ui";
import MethodSteps from "@/components/MethodSteps";

// ============================================================
// À PROPOS — page de réassurance (E-E-A-T) : qui nous sommes,
// comment nous travaillons, ce que nous croyons.
// Textes éditables dans /admin/contenus.
// ============================================================

export async function generateMetadata(): Promise<Metadata> {
  const c = await getAproposContent();
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: { canonical: "/a-propos" },
    openGraph: { title: c.meta.title, description: c.meta.description, url: "/a-propos" },
  };
}

export default async function AProposPage() {
  const [c, METHOD_STEPS] = await Promise.all([
    getAproposContent(),
    getMethodSteps(),
  ]);

  return (
    <>
      {/* La page ouvrait directement sur « Ce qui guide notre façon de
          travailler » : aucun h1, aucune présentation. Le titre et les
          trois paragraphes existaient dans les contenus, ils n'étaient
          simplement jamais rendus — une page « À propos » qui ne disait
          pas qui nous sommes, et un sommaire de titres sans racine. */}
      <section aria-labelledby="apropos-title" className="sec sec-clean">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <Kicker>Qui nous sommes</Kicker>
          <h1
            id="apropos-title"
            className="mt-4 max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground sm:text-5xl"
          >
            {c.h1}
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
            {c.paragraphs.map((p, i) => (
              <p key={i}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="valeurs" className="sec sec-deep">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="valeurs" className="text-3xl font-bold tracking-tight text-foreground">
            {c.valeursTitle}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {c.valeurs.map((v) => (
              <div
                key={v.title}
                className="card reveal rounded-2xl border border-border/60 bg-background p-7"
              >
                <BrandDots />
                <h3 className="font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternance des tons reprise de l'accueil : clair → profond →
          chaud. Deux bandes identiques côte à côte se lisaient comme une
          seule section, et la méthode est « chaude » sur l'accueil. */}
      <section aria-labelledby="apropos-methode" className="sec sec-warm">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="apropos-methode"
            className="text-3xl font-bold tracking-tight text-foreground"
          >
            {c.methodeTitle}
          </h2>
          <MethodSteps steps={METHOD_STEPS} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
