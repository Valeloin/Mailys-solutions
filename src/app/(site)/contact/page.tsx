import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { SITE } from "@/lib/site";
import { StepNumber } from "@/components/ui";
import { isSupabaseConfigured } from "@/lib/supabase/public";
import { sendContactMessage } from "./actions";

// ============================================================
// CONTACT — page de conversion.
// Formulaire HTML natif (zéro JavaScript navigateur) branché sur
// une server action : stockage en base + notification email.
// Le résultat s'affiche via ?sent=1 / ?error=… (redirection).
// ============================================================

export const metadata: Metadata = {
  title: "Contact : parlons de votre projet d'application métier",
  description:
    "Décrivez-nous votre projet d'application métier ou votre besoin de maintenance WINDEV / WEBDEV : réponse rapide, devis gratuit et sans engagement.",
  alternates: { canonical: "/contact" },
};

const ERRORS: Record<string, string> = {
  champs: "Merci de remplir au minimum votre nom, votre email et votre message.",
  email: "L'adresse email saisie ne semble pas valide.",
  indisponible:
    "Le formulaire est momentanément indisponible. Écrivez-nous directement par email, nous vous répondrons vite.",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/30";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;
  const formAvailable = isSupabaseConfigured();

  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Contact", href: "/contact" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-bordeaux sm:text-5xl">
              Parlons de votre projet
            </h1>
            <p className="rise rise-2 mt-6 text-lg leading-relaxed text-muted">
              Application métier à créer, logiciel à moderniser, processus à
              digitaliser ou application WINDEV à reprendre : décrivez-nous
              votre situation en quelques lignes. Nous revenons vers vous
              rapidement avec un premier avis honnête —{" "}
              <strong className="text-foreground">
                gratuit et sans engagement
              </strong>
              .
            </p>

            {/* ---------- Retour utilisateur ---------- */}
            {sent === "1" && (
              <div
                role="status"
                className="mt-8 rounded-xl border border-border bg-surface p-5"
              >
                <p className="font-bold text-bordeaux">
                  ✓ Message bien reçu !
                </p>
                <p className="mt-1 text-sm text-muted">
                  Merci pour votre confiance. Nous vous répondons sous 24 h
                  ouvrées.
                </p>
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5"
              >
                <p className="text-sm font-semibold text-accent-dark">
                  {ERRORS[error] ?? ERRORS.indisponible}
                </p>
              </div>
            )}

            {/* ---------- Formulaire ---------- */}
            {formAvailable && sent !== "1" && (
              <form action={sendContactMessage} className="mt-8 space-y-4">
                {/* Pot de miel anti-spam : invisible pour les humains */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
                  <label>
                    Ne pas remplir
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">
                    Nom *
                    <input type="text" name="name" required maxLength={120} className={inputClass} />
                  </label>
                  <label className="block text-sm font-semibold">
                    Email *
                    <input type="email" name="email" required maxLength={200} className={inputClass} />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">
                    Téléphone
                    <input type="tel" name="phone" maxLength={30} className={inputClass} />
                  </label>
                  <label className="block text-sm font-semibold">
                    Entreprise
                    <input type="text" name="company" maxLength={120} className={inputClass} />
                  </label>
                </div>
                <label className="block text-sm font-semibold">
                  Votre projet, votre besoin *
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={5000}
                    placeholder="Décrivez votre situation en quelques lignes : votre activité, ce qui vous freine aujourd'hui, ce que vous aimeriez améliorer…"
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
                >
                  Envoyer ma demande
                </button>
              </form>
            )}

            <p className="mt-6 text-sm text-muted">
              Vous préférez l&apos;email ?{" "}
              <a
                href={`mailto:${SITE.email}?subject=Demande de devis`}
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                {SITE.email}
              </a>{" "}
              — réponse sous 24 h ouvrées, vos informations restent
              strictement confidentielles.
            </p>
          </div>

          <div className="card relative overflow-hidden rounded-2xl border border-border bg-surface p-8">
            <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-1" />
            <h2 className="text-xl font-bold text-bordeaux">
              Ce qui se passe ensuite
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                {
                  title: "Un premier échange",
                  text: "30 minutes par téléphone ou visio pour comprendre votre besoin, votre contexte et vos priorités.",
                },
                {
                  title: "Un avis honnête",
                  text: "Nous vous disons ce que nous ferions à votre place — même si la réponse est « pas besoin de développement ».",
                },
                {
                  title: "Un devis clair et détaillé",
                  text: "Périmètre, étapes, délais, budget : tout est écrit noir sur blanc, sans surprise en cours de route.",
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <StepNumber size="sm">{i + 1}</StepNumber>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
