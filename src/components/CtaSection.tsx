import Link from "next/link";
import { getCtaContent } from "@/lib/sections";

// CTA final réutilisable — présent en bas de chaque page (conversion).
// Textes par défaut éditables dans /admin/contenus (« Bandeau contact ») ;
// certaines pages passent un titre/texte spécifique en props.
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
        <div className="relative overflow-hidden rounded-3xl bg-bordeaux px-6 py-14 text-center sm:px-12 sm:py-16">
          {/* Décors : filet signature + barres du logo + points, tous statiques */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="brand-hairline absolute inset-x-0 top-0 h-1" />
            <div className="absolute -right-10 -top-24 h-72 w-20 -rotate-[22deg] rounded-full bg-white/[0.06]" />
            <div className="absolute -right-2 -top-28 h-72 w-20 -rotate-[22deg] rounded-full bg-coral/[0.12]" />
            <div className="absolute bottom-8 left-10 h-3 w-3 rounded-full bg-orange/60" />
            <div className="absolute bottom-14 left-16 h-2 w-2 rounded-full bg-coral/50" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">{body}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
