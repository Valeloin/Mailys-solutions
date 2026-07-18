import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Rich from "@/components/Rich";
import { SITE } from "@/lib/site";
import { getContactContent } from "@/lib/sections";
import { isSupabaseConfigured } from "@/lib/supabase/public";
import { sendContactMessage } from "./actions";

// ============================================================
// CONTACT — page de conversion (design retravaillé).
// Formulaire HTML natif (zéro JavaScript navigateur) encarté sur
// fond blanc contrasté, champs à icônes, branché sur une server
// action : stockage en base + notification email. Résultat via
// ?sent=1 / ?error=… (redirection). Panneau latéral bordeaux.
// ============================================================

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContactContent();
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: { canonical: "/contact" },
    openGraph: { title: c.meta.title, description: c.meta.description, url: "/contact" },
  };
}

const ERRORS: Record<string, string> = {
  champs: "Merci de remplir au minimum votre nom, votre email et votre message.",
  email: "L'adresse email saisie ne semble pas valide.",
  indisponible:
    "Le formulaire est momentanément indisponible. Écrivez-nous directement par email, nous vous répondrons vite.",
};

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-bordeaux";

// Icônes des champs (dans une pastille à gauche du label)
const FIELD_ICONS: Record<string, React.ReactNode> = {
  name: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 20a7 7 0 0114 0" />,
  email: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  phone: <path d="M6 3h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z" />,
  company: <path d="M4 20V8l8-4 8 4v12M9 20v-5h6v5M4 20h16" />,
  message: <path d="M4 5h16v11H9l-4 3v-3H4z" />,
};

function FieldIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="rgb(var(--accent))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {FIELD_ICONS[name]}
      </svg>
    </span>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;
  const c = await getContactContent();
  const formAvailable = isSupabaseConfigured();

  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Contact", href: "/contact" }]} />
      </div>

      <section className="sec sec-warm">
        <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* ================= COLONNE FORMULAIRE ================= */}
          <div className="card relative overflow-hidden rounded-3xl border border-border bg-background p-6 sm:p-9">
            <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-1.5" />

            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-bordeaux sm:text-4xl">
              {c.h1}
            </h1>
            <p className="mt-4 leading-relaxed text-muted">
              <Rich text={c.intro} />
            </p>

            {/* ---------- Retour utilisateur ---------- */}
            {sent === "1" && (
              <div
                role="status"
                className="mt-7 flex items-start gap-3 rounded-2xl border border-orange/30 bg-orange/5 p-5"
              >
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange/15">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M4 10.5l4 4 8-9" stroke="rgb(var(--orange))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-bordeaux">Message bien reçu !</p>
                  <p className="mt-1 text-sm text-muted">
                    Merci pour votre confiance. Nous vous répondons sous 24 h ouvrées.
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="mt-7 rounded-2xl border-l-4 border-l-accent border border-border bg-background p-4 shadow-[0_2px_10px_-6px_rgb(var(--bordeaux)/0.25)]"
              >
                <p className="text-sm font-semibold text-accent-dark">
                  {ERRORS[error] ?? ERRORS.indisponible}
                </p>
              </div>
            )}

            {/* ---------- Formulaire ---------- */}
            {formAvailable && sent !== "1" && (
              <form action={sendContactMessage} className="mt-8 space-y-5">
                {/* Pot de miel anti-spam : invisible pour les humains */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
                  <label>
                    Ne pas remplir
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className={`${labelClass} flex items-center gap-2`}>
                      <FieldIcon name="name" /> Nom *
                    </span>
                    <input type="text" name="name" required maxLength={120} placeholder="Jean Dupont" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className={`${labelClass} flex items-center gap-2`}>
                      <FieldIcon name="email" /> Email *
                    </span>
                    <input type="email" name="email" required maxLength={200} placeholder="jean@entreprise.fr" className={inputClass} />
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className={`${labelClass} flex items-center gap-2`}>
                      <FieldIcon name="phone" /> Téléphone
                    </span>
                    <input type="tel" name="phone" maxLength={30} placeholder="06 12 34 56 78" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className={`${labelClass} flex items-center gap-2`}>
                      <FieldIcon name="company" /> Entreprise
                    </span>
                    <input type="text" name="company" maxLength={120} placeholder="Nom de votre société" className={inputClass} />
                  </label>
                </div>
                <label className="block">
                  <span className={`${labelClass} flex items-center gap-2`}>
                    <FieldIcon name="message" /> Votre projet, votre besoin *
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={5000}
                    placeholder="Décrivez votre situation en quelques lignes : votre activité, ce qui vous freine aujourd'hui, ce que vous aimeriez améliorer…"
                    className={inputClass}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-1">
                  <button
                    type="submit"
                    className="btn-cta rounded-xl px-8 py-3.5 font-semibold text-white"
                  >
                    Envoyer ma demande
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="rgb(var(--orange))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                    </svg>
                    Vos informations restent confidentielles
                  </span>
                </div>
              </form>
            )}

            <p className="mt-7 border-t border-border pt-5 text-sm text-muted">
              Vous préférez l&apos;email ?{" "}
              <a
                href={`mailto:${SITE.email}?subject=Demande de devis`}
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                {SITE.email}
              </a>{" "}
              — réponse sous 24 h ouvrées.
            </p>
          </div>

          {/* ================= PANNEAU LATÉRAL ================= */}
          <aside className="relative overflow-hidden rounded-3xl bg-bordeaux p-7 text-white sm:p-9">
            {/* Décors : filet + barres du logo + points */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <span className="brand-hairline absolute inset-x-0 top-0 h-1.5" />
              <div className="absolute -right-8 -top-16 h-56 w-16 -rotate-[22deg] rounded-full bg-white/[0.05]" />
              <div className="absolute -right-1 -top-20 h-56 w-16 -rotate-[22deg] rounded-full bg-coral/[0.12]" />
              <div className="pv-dot absolute bottom-8 right-10 h-2.5 w-2.5 rounded-full bg-orange/60" />
              <div className="pv-dot absolute bottom-14 right-16 h-2 w-2 rounded-full bg-coral/50" style={{ animationDelay: "0.9s" }} />
            </div>

            <div className="relative">
              <div aria-hidden="true" className="mb-4 flex gap-1.5">
                <span className="pv-dot h-2 w-2 rounded-full bg-orange" />
                <span className="pv-dot h-2 w-2 rounded-full bg-coral" style={{ animationDelay: "0.8s" }} />
              </div>
              <h2 className="text-xl font-bold">{c.panelTitle}</h2>

              <ol className="mt-7 space-y-6">
                {c.steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4">
                    {/* Trait de liaison entre les étapes */}
                    {i < c.steps.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[15px] top-9 h-[calc(100%-1rem)] w-px bg-white/15" />
                    )}
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/20">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/75">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/[0.07] p-4">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="rgb(var(--orange))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                <p className="text-sm font-medium text-white/90">
                  Réponse sous 24 h ouvrées, sans engagement.
                </p>
              </div>
            </div>
          </aside>
        </div>
        </div>
      </section>
    </>
  );
}
