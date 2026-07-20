import Link from "next/link";
import { getCtaContent } from "@/lib/sections";

// CTA final réutilisable — présent en bas de chaque page (conversion).
// Textes par défaut éditables dans /admin/contenus (« Bandeau contact ») ;
// certaines pages passent un titre/texte spécifique en props.
// Panneau chaud : dégradé orange → rouge de la DA, composition soignée
// (barres du logo en triptyque, halo, filet signature). Les animations
// vivent sur la CARTE (points du kicker, flèche du CTA, survol), pas
// dans le fond.

// Petite coche blanche — la coche orange de ui.tsx serait invisible
// sur le dégradé chaud.
function CheckWhite() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <path
        d="M4 10.5l4 4 8-9"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function CtaSection({
  title,
  text,
  buttonLabel,
  hideSecondary = false,
}: {
  title?: string;
  text?: string;
  buttonLabel?: string;
  /** Masque le bouton « Voir nos réalisations » — utile sur cette page. */
  hideSecondary?: boolean;
}) {
  const c = await getCtaContent();
  const heading = title ?? c.title;
  const body = text ?? c.text;
  const button = buttonLabel ?? c.buttonLabel;

  return (
    <section aria-label="Contactez-nous" className="bg-background">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div
          className="group relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-[0_28px_70px_-30px_rgb(var(--accent)/0.6)] ring-1 ring-white/10 sm:px-12 sm:py-20"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgb(var(--orange)) 0%, rgb(var(--accent)) 48%, rgb(var(--accent-dark)) 100%)",
          }}
        >
          {/* ---------- Décors (calmes, dans le fond) ---------- */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* Filet clair, arête haute nette */}
            <span className="absolute inset-x-0 top-0 h-px bg-white/30" />
            {/* Sheen : halo blanc diffus, haut-centre */}
            <div className="absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
            {/* Triptyque des barres du logo, à droite */}
            <div className="absolute -right-12 -top-24 h-80 w-24 -rotate-[22deg] rounded-full bg-white/[0.07]" />
            <div className="absolute -right-2 -top-28 h-80 w-24 -rotate-[22deg] rounded-full bg-white/[0.10]" />
            <div className="absolute right-20 -top-14 h-56 w-14 -rotate-[22deg] rounded-full bg-white/[0.06]" />
            {/* Écho discret en bas à gauche */}
            <div className="absolute -bottom-24 -left-10 h-64 w-16 -rotate-[22deg] rounded-full bg-white/[0.06]" />
            {/* Voile sombre chaud en bas : garantit le contraste du texte
                sur la zone orange claire du dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--accent-dark)/0.35)] to-transparent" />
          </div>

          {/* ---------- Contenu (la carte : animations ici) ---------- */}
          <div className="relative">
            {/* Kicker : pilule + les deux points du logo (pulsation douce) */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              <span aria-hidden="true" className="pv-dot h-1.5 w-1.5 rounded-full bg-white" />
              <span
                aria-hidden="true"
                className="pv-dot h-1.5 w-1.5 rounded-full bg-white/70"
                style={{ animationDelay: "0.6s" }}
              />
              Parlons-en
            </p>
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgb(var(--accent-dark)/0.5)] sm:text-4xl">
              {heading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/90">
              {body}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              {/* Primaire : blanc plein → contraste maximal sur le chaud */}
              <Link
                href="/contact"
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-foreground shadow-[0_10px_30px_-10px_rgb(var(--accent-dark)/0.7)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {button}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1"
                >
                  →
                </span>
              </Link>
              {/* Secondaire : contour clair renforcé. Masqué sur la page
                  /realisations elle-même, où il renverrait au même endroit. */}
              {!hideSecondary && (
                <Link
                  href="/realisations"
                  className="rounded-xl border border-white/50 px-7 py-3.5 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  {c.secondaryLabel}
                </Link>
              )}
            </div>
            {/* Réassurance : agencement plus travaillé, conversion */}
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/85">
              {["Devis gratuit", "Sans engagement", "Réponse personnalisée"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckWhite />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
