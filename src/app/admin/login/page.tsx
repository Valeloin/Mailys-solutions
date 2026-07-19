import { isSupabaseConfigured } from "@/lib/supabase/public";
import { login } from "../actions";

// Connexion à l'administration (session Supabase Auth).
const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/30";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <div className="card relative overflow-hidden rounded-2xl border border-border bg-background p-8">
        <h1 className="text-xl font-bold text-foreground">Connexion</h1>

        {!configured ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            L&apos;administration n&apos;est pas encore activée : les clés
            Supabase (NEXT_PUBLIC_SUPABASE_URL et
            NEXT_PUBLIC_SUPABASE_ANON_KEY) doivent être renseignées dans les
            variables d&apos;environnement.
          </p>
        ) : (
          <>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm font-semibold text-accent-dark"
              >
                {error === "identifiants"
                  ? "Email ou mot de passe incorrect."
                  : "Connexion impossible pour le moment."}
              </p>
            )}
            <form action={login} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold">
                Email
                <input type="email" name="email" required autoComplete="username" className={inputClass} />
              </label>
              <label className="block text-sm font-semibold">
                Mot de passe
                <input type="password" name="password" required autoComplete="current-password" className={inputClass} />
              </label>
              <button
                type="submit"
                className="btn-cta w-full rounded-xl px-6 py-3 font-semibold text-white"
              >
                Se connecter
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
