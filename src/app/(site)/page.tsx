import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, METHOD_STEPS, WHY_US } from "@/lib/services";
import CtaSection from "@/components/CtaSection";
import {
  Kicker,
  Check,
  StepNumber,
  BrandDots,
  MobileCtaBar,
  ProblemItem,
} from "@/components/ui";

// ============================================================
// ACCUEIL — requête principale :
// « développement d'application métier sur mesure » (PME)
// Habillage 100 % CSS (aucun JavaScript envoyé au navigateur).
// ============================================================

export const metadata: Metadata = {
  title:
    "Développement d'application métier sur mesure pour PME | Mailys Solutions",
  description:
    "Mailys Solutions développe des applications métier sur mesure pour PME : fini Excel et les ressaisies. Digitalisation, modernisation, maintenance WINDEV / WEBDEV.",
  alternates: { canonical: "/" },
};

// Icônes décoratives des cartes services (traits SVG, couleur accent)
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "developpement-application-metier": <path d="M8 6 3 12l5 6M16 6l5 6-5 6" />,
  "modernisation-application": <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />,
  "digitalisation-processus": (
    <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 14l2 2 4-4" />
  ),
  "maintenance-windev-webdev": (
    <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6L14 13l-3-3z" />
  ),
};

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      {/* En moins de 5 secondes : qui, quoi, pour qui, différence, contact. */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        {/* Décor : les deux barres du logo, fantômes (desktop uniquement) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-28 -left-14 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-coral/[0.06] lg:block" />
          <div className="absolute -bottom-36 left-10 hidden h-80 w-24 -rotate-[22deg] rounded-full bg-accent/[0.05] lg:block" />
        </div>
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div className="relative">
            <div className="rise rise-1">
              <Kicker>Applications métier pour PME</Kicker>
            </div>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-bordeaux sm:text-5xl">
              Développement d&apos;applications métier sur mesure pour PME
            </h1>
            <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Remplacez les fichiers Excel, les ressaisies et les processus
              manuels par un logiciel conçu pour <strong className="text-foreground">votre</strong> façon
              de travailler. Nous concevons, modernisons et maintenons les
              applications qui font tourner votre entreprise.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
              >
                Demander un devis gratuit
              </Link>
              <Link
                href="/services"
                className="btn-ghost rounded-xl border border-border bg-background px-7 py-3.5 font-semibold"
              >
                Découvrir nos services
              </Link>
            </div>
            <ul className="rise rise-4 mt-10 flex flex-wrap gap-x-4 gap-y-3 text-sm font-medium text-muted">
              {[
                "Du vrai sur mesure",
                "Un interlocuteur unique",
                "Un suivi long terme",
              ].map((item) => (
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

          {/* Mockup décoratif : une application métier, montrée plutôt que racontée */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="glow-warm absolute -inset-12 rounded-full" />
            <div className="relative rounded-2xl border border-border bg-background p-2 shadow-window">
              <svg viewBox="0 0 520 380" className="h-auto w-full rounded-xl">
                <rect width="520" height="380" rx="12" fill="#ffffff" />
                <rect width="520" height="44" fill="rgb(var(--bordeaux) / 0.04)" />
                <circle cx="24" cy="22" r="5" fill="rgb(var(--coral))" />
                <circle cx="42" cy="22" r="5" fill="rgb(var(--orange))" />
                <circle cx="60" cy="22" r="5" fill="rgb(var(--accent))" />
                <rect x="200" y="14" width="120" height="16" rx="8" fill="rgb(var(--bordeaux) / 0.06)" />
                <rect x="0" y="44" width="132" height="336" fill="rgb(var(--bordeaux) / 0.025)" />
                <rect x="18" y="68" width="86" height="10" rx="5" fill="rgb(var(--bordeaux) / 0.55)" />
                <rect x="18" y="96" width="96" height="8" rx="4" fill="rgb(var(--bordeaux) / 0.12)" />
                <rect x="18" y="118" width="72" height="8" rx="4" fill="rgb(var(--bordeaux) / 0.12)" />
                <rect x="18" y="140" width="88" height="8" rx="4" fill="rgb(var(--accent) / 0.55)" />
                <rect x="18" y="162" width="64" height="8" rx="4" fill="rgb(var(--bordeaux) / 0.12)" />
                <g>
                  <rect x="152" y="64" width="108" height="64" rx="10" fill="#fff" stroke="rgb(var(--bordeaux) / 0.08)" />
                  <rect x="164" y="78" width="48" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.15)" />
                  <rect x="164" y="96" width="64" height="12" rx="6" fill="rgb(var(--bordeaux) / 0.7)" />
                </g>
                <g>
                  <rect x="272" y="64" width="108" height="64" rx="10" fill="#fff" stroke="rgb(var(--bordeaux) / 0.08)" />
                  <rect x="284" y="78" width="48" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.15)" />
                  <rect x="284" y="96" width="56" height="12" rx="6" fill="rgb(var(--accent) / 0.8)" />
                </g>
                <g>
                  <rect x="392" y="64" width="108" height="64" rx="10" fill="#fff" stroke="rgb(var(--bordeaux) / 0.08)" />
                  <rect x="404" y="78" width="48" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.15)" />
                  <rect x="404" y="96" width="60" height="12" rx="6" fill="rgb(var(--orange) / 0.8)" />
                </g>
                <rect x="152" y="148" width="228" height="152" rx="10" fill="#fff" stroke="rgb(var(--bordeaux) / 0.08)" />
                <rect x="172" y="240" width="22" height="44" rx="4" fill="rgb(var(--coral) / 0.55)" />
                <rect x="204" y="216" width="22" height="68" rx="4" fill="rgb(var(--coral) / 0.75)" />
                <rect x="236" y="196" width="22" height="88" rx="4" fill="rgb(var(--orange) / 0.75)" />
                <rect x="268" y="228" width="22" height="56" rx="4" fill="rgb(var(--orange) / 0.55)" />
                <rect x="300" y="180" width="22" height="104" rx="4" fill="rgb(var(--accent) / 0.85)" />
                <rect x="332" y="204" width="22" height="80" rx="4" fill="rgb(var(--accent) / 0.6)" />
                <rect x="392" y="148" width="108" height="152" rx="10" fill="#fff" stroke="rgb(var(--bordeaux) / 0.08)" />
                <rect x="404" y="166" width="72" height="8" rx="4" fill="rgb(var(--bordeaux) / 0.35)" />
                <rect x="404" y="188" width="84" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.12)" />
                <rect x="404" y="208" width="60" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.12)" />
                <rect x="404" y="228" width="78" height="7" rx="3.5" fill="rgb(var(--bordeaux) / 0.12)" />
                <rect x="404" y="256" width="84" height="26" rx="13" fill="rgb(var(--accent))" />
                <rect x="152" y="316" width="348" height="12" rx="6" fill="rgb(var(--bordeaux) / 0.06)" />
                <rect x="152" y="340" width="280" height="12" rx="6" fill="rgb(var(--bordeaux) / 0.06)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section aria-labelledby="services-title">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-24">
          <Kicker>Nos services</Kicker>
          <h2
            id="services-title"
            className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Quatre façons de simplifier le quotidien de votre entreprise
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Que votre besoin soit de créer un outil, de sauver un logiciel
            vieillissant ou d&apos;en finir avec le papier, nous partons
            toujours du même point : comprendre votre métier.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <article
                key={s.slug}
                className="group card reveal relative rounded-2xl border border-border bg-background p-7 hover:border-coral"
              >
                <div
                  aria-hidden="true"
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="rgb(var(--accent))"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {SERVICE_ICONS[s.slug]}
                  </svg>
                </div>
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
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {s.heroSubtitle}
                </p>
                <p className="mt-4 text-sm font-semibold text-accent">
                  Découvrir{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
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
              Vos outils vous ralentissent au lieu de vous aider ?
            </h2>
            <ul className="mt-6 space-y-3 text-muted">
              {[
                "Des fichiers Excel partout, jamais à jour",
                "Les mêmes informations ressaisies plusieurs fois",
                "Un logiciel vieillissant que plus personne n'ose toucher",
                "Des processus qui ne tiennent que grâce aux habitudes",
                "Aucune visibilité fiable pour piloter l'activité",
              ].map((p) => (
                <ProblemItem key={p}>{p}</ProblemItem>
              ))}
            </ul>
          </div>
          <div className="card relative overflow-hidden rounded-2xl border border-border bg-background p-8">
            <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-1" />
            <h3 className="text-xl font-bold text-bordeaux">
              Un logiciel qui épouse vos processus — pas l&apos;inverse
            </h3>
            <p className="mt-4 leading-relaxed text-muted">
              Les logiciels génériques imposent leur logique : c&apos;est à vos
              équipes de s&apos;adapter, de contourner, de bricoler. Nous
              faisons le chemin inverse : nous étudions votre fonctionnement
              réel, puis nous développons{" "}
              <Link
                href="/services/developpement-application-metier"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                l&apos;application métier
              </Link>{" "}
              qui l&apos;épouse exactement.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Votre logiciel actuel a de la valeur mais vieillit mal ? Nous le{" "}
              <Link
                href="/services/modernisation-application"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                modernisons
              </Link>{" "}
              sans perdre vos données. Vos équipes croulent sous le papier et
              les e-mails ? Nous{" "}
              <Link
                href="/services/digitalisation-processus"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                digitalisons vos processus
              </Link>
              . Votre application WINDEV n&apos;a plus de développeur ? Nous en{" "}
              <Link
                href="/services/maintenance-windev-webdev"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                reprenons la maintenance
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ================= MÉTHODE ================= */}
      <section aria-labelledby="methode-title">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-24">
          <Kicker>Notre méthode</Kicker>
          <h2
            id="methode-title"
            className="mt-4 text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Un projet mené en 7 étapes, sans jargon et sans surprise
          </h2>
          {/* Fil conducteur : dégradé corail → orange → rouge */}
          <div
            aria-hidden="true"
            className="mt-10 hidden h-px bg-gradient-to-r from-coral/40 via-orange/40 to-accent/40 lg:block"
          />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4">
            {METHOD_STEPS.map((step, i) => (
              <li
                key={step.title}
                className="card reveal rounded-2xl border border-border bg-background p-6"
              >
                <StepNumber>{String(i + 1).padStart(2, "0")}</StepNumber>
                <h3 className="mt-3 font-bold text-bordeaux">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= POURQUOI NOUS ================= */}
      <section aria-labelledby="pourquoi-title" className="bg-surface">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-24">
          <h2
            id="pourquoi-title"
            className="text-3xl font-bold tracking-tight text-bordeaux sm:text-4xl"
          >
            Pourquoi les PME nous font confiance
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item) => (
              <div
                key={item.title}
                className="card reveal rounded-2xl border border-border/60 bg-background p-7"
              >
                <BrandDots />
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
