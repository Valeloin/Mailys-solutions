import type { Metadata } from "next";
import { loginClient, requestPasswordReset } from "../actions";

export const metadata: Metadata = {
  title: "Connexion à votre espace client",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  identifiants: "Email ou mot de passe incorrect.",
  suspendu:
    "Votre accès a été suspendu. Contactez-nous pour le rétablir.",
  admin:
    "Cette adresse est celle d'un administrateur : connectez-vous depuis l'espace d'administration.",
  lien: "Ce lien n'est plus valable. Demandez-en un nouveau ci-dessous.",
  config:
    "L'espace client est momentanément indisponible. Réessayez dans quelques minutes.",
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reinit?: string }>;
}) {
  const { error, reinit } = await searchParams;

  return (
    <section className="sec sec-clean">
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
        <div className="card reveal relative rounded-2xl border border-border bg-background p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="brand-hairline absolute inset-x-0 top-0 h-1 rounded-t-2xl"
          />

          <h1 className="text-2xl font-bold text-foreground">Votre espace client</h1>
          <p className="mt-2 text-sm text-muted">
            Déclarez un ticket et suivez son traitement.
          </p>

          {reinit === "1" && (
            <p
              role="status"
              className="mt-6 rounded-xl border border-orange/30 bg-orange/5 p-3.5 text-sm text-foreground"
            >
              Si un compte existe pour cette adresse, un lien de
              réinitialisation vient d&apos;être envoyé.
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-border border-l-4 border-l-accent bg-background p-3.5 text-sm font-semibold text-accent-dark"
            >
              {ERRORS[error] ?? ERRORS.identifiants}
            </p>
          )}

          <form action={loginClient} className="mt-6 space-y-4">
            <div>
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="vous@entreprise.fr"
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className={fieldClass}
              />
            </div>
            <button
              type="submit"
              className="btn-cta w-full rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              Se connecter
            </button>
          </form>

          {/* Réinitialisation : formulaire distinct pour ne pas exiger
              le mot de passe quand c'est précisément ce qu'on a perdu. */}
          <details className="mt-6 border-t border-border pt-5">
            <summary className="cursor-pointer text-sm font-semibold text-muted transition-colors hover:text-foreground">
              Mot de passe oublié ?
            </summary>
            <form action={requestPasswordReset} className="mt-4 space-y-3">
              <label className="sr-only" htmlFor="reset-email">
                Votre email
              </label>
              <input
                id="reset-email"
                type="email"
                name="email"
                required
                placeholder="vous@entreprise.fr"
                className={fieldClass}
              />
              <button
                type="submit"
                className="btn-ghost w-full rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold"
              >
                Recevoir un lien de réinitialisation
              </button>
            </form>
          </details>

          <p className="mt-6 text-xs leading-relaxed text-muted">
            Vous n&apos;avez pas encore d&apos;accès ? Les comptes sont créés par
            nos soins : contactez-nous et nous vous enverrons une invitation.
          </p>
        </div>
      </div>
    </section>
  );
}
