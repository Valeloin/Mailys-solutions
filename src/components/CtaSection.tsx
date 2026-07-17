import Link from "next/link";
import { getCtaContent } from "@/lib/sections";

// CTA final réutilisable — présent en bas de chaque page (conversion).
// Textes par défaut éditables dans /admin/contenus (« Bandeau contact ») ;
// certaines pages passent un titre/texte spécifique en props.
// Seule inversion sombre du site : composition soignée — halo chaud
// derrière le titre, barres du logo en triptyque, constellation de
// points qui scintillent, reflet lent toutes les 12 s.
export default async function CtaSection({
  title,
  text,
  buttonLabel,
}: {
  title?: string;
  text?: string;
  buttonLabel?: string;
}) {
  const c = await getCtaContent();
  const heading = title ?? c.title;
  const body = text ?? c.text;
  const button = buttonLabel ?? c.buttonLabel;

  return (
    <section aria-label="Contactez-nous" className="bg-background">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-bordeaux px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* ---------- Décors (statiques + scintillements doux) ---------- */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* Filet signature */}
            <span className="brand-hairline absolute inset-x-0 top-0 h-1" />
            {/* Halo chaud derrière le titre */}
            <div className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-coral/10 blur-3xl" />
            {/* Triptyque des barres du logo, à droite */}
            <div className="absolute -right-12 -top-24 h-80 w-24 -rotate-[22deg] rounded-full bg-white/[0.05]" />
            <div className="absolute -right-2 -top-28 h-80 w-24 -rotate-[22deg] rounded-full bg-coral/[0.14]" />
            <div className="absolute right-20 -top-14 h-56 w-14 -rotate-[22deg] rounded-full bg-orange/[0.09]" />
            {/* Écho discret des barres, en bas à gauche */}
            <div className="absolute -bottom-24 -left-10 h-64 w-16 -rotate-[22deg] rounded-full bg-white/[0.04]" />
            {/* Constellation de points qui pétillent */}
            <div className="pv-dot absolute bottom-10 left-10 h-3 w-3 rounded-full bg-orange/70" />
            <div className="pv-dot absolute bottom-16 left-16 h-2 w-2 rounded-full bg-coral/60" style={{ animationDelay: "0.8s" }} />
            <div className="pv-dot absolute bottom-8 left-24 h-1.5 w-1.5 rounded-full bg-white/40" style={{ animationDelay: "1.7s" }} />
            <div className="pv-dot absolute bottom-14 right-24 h-2 w-2 rounded-full bg-coral/50" style={{ animationDelay: "2.4s" }} />
            <div className="pv-dot absolute right-40 top-12 h-1.5 w-1.5 rounded-full bg-orange/50" style={{ animationDelay: "1.2s" }} />
            <div className="pv-dot absolute left-1/3 top-9 h-1.5 w-1.5 rounded-full bg-white/30" style={{ animationDelay: "3s" }} />
            {/* Reflet lent qui traverse le panneau */}
            <div className="pv-cta-shine absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* ---------- Contenu ---------- */}
          <div className="relative">
            {/* Les deux points du logo, en ouverture */}
            <div aria-hidden="true" className="mb-5 flex justify-center gap-1.5">
              <span className="pv-dot h-2 w-2 rounded-full bg-orange" />
              <span className="pv-dot h-2 w-2 rounded-full bg-coral" style={{ animationDelay: "0.8s" }} />
            </div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {heading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/80">{body}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
              >
                {button}
              </Link>
              <Link
                href="/realisations"
                className="rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                {c.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
