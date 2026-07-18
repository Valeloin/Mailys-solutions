import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import Rich from "@/components/Rich";
import { getAproposContent, getMethodSteps } from "@/lib/sections";
import { BrandDots } from "@/components/ui";
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
      <section aria-labelledby="valeurs" className="sec sec-clean">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
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

      <section aria-labelledby="apropos-methode" className="sec sec-deep">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
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
