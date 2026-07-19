import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { setPassword } from "../actions";

export const metadata: Metadata = {
  title: "Choisir votre mot de passe",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  court: "Le mot de passe doit contenir au moins 8 caractères.",
  different: "Les deux mots de passe ne correspondent pas.",
  enregistrement: "Le mot de passe n'a pas pu être enregistré. Réessayez.",
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground";

export default async function BienvenuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // On arrive ici avec la session posée par /auth/callback. Sans elle,
  // le lien a expiré ou la page a été ouverte directement.
  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };

  if (!user) redirect("/espace-client/connexion?error=lien");

  return (
    <section className="sec sec-clean min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
        <div className="card reveal relative rounded-2xl border border-border bg-background p-6 sm:p-8">

          <h1 className="text-2xl font-bold text-foreground">Bienvenue</h1>
          <p className="mt-2 text-sm text-muted">
            Choisissez le mot de passe qui protégera votre espace.
            <span className="mt-1 block font-medium text-foreground">{user.email}</span>
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-border border-l-4 border-l-accent bg-background p-3.5 text-sm font-semibold text-accent-dark"
            >
              {ERRORS[error] ?? ERRORS.enregistrement}
            </p>
          )}

          <form action={setPassword} className="mt-6 space-y-4">
            <div>
              <label className={labelClass} htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-muted">8 caractères minimum.</p>
            </div>
            <div>
              <label className={labelClass} htmlFor="confirm">
                Confirmation
              </label>
              <input
                id="confirm"
                type="password"
                name="confirm"
                required
                minLength={8}
                autoComplete="new-password"
                className={fieldClass}
              />
            </div>
            <button
              type="submit"
              className="btn-cta w-full rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              Enregistrer et accéder à mon espace
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
