import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { changePassword } from "../../actions";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MESSAGES: Record<string, { texte: string; ok: boolean }> = {
  "1": { texte: "Votre mot de passe a bien été changé.", ok: true },
};

const ERREURS: Record<string, string> = {
  court: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
  different: "Les deux saisies ne correspondent pas.",
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground";

function formatDay(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ change?: string; error?: string; motif?: string }>;
}) {
  const { change, error, motif } = await searchParams;

  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/espace-client/connexion");

  const succes = change ? MESSAGES[change] : null;
  const echec = error
    ? error === "refus" && motif
      ? decodeURIComponent(motif)
      : (ERREURS[error] ?? "Le mot de passe n'a pas pu être changé.")
    : null;

  return (
    <div className="max-w-xl">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
        Vos informations
      </h2>

      <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-background">
        <div className="flex flex-wrap items-baseline justify-between gap-2 p-4">
          <dt className="text-sm text-muted">Adresse email</dt>
          <dd className="text-sm font-semibold text-foreground">{user.email}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 p-4">
          <dt className="text-sm text-muted">Accès ouvert le</dt>
          <dd className="text-sm font-semibold text-foreground">
            {formatDay(user.created_at)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Votre adresse email sert d&apos;identifiant et ne peut pas être modifiée
        ici. Pour en changer, écrivez-nous : nous ouvrirons un nouvel accès.
      </p>

      <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-foreground">
        Changer de mot de passe
      </h2>

      {succes && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-orange/30 bg-orange/5 p-4 text-sm text-foreground"
        >
          {succes.texte}
        </p>
      )}
      {echec && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-border border-l-4 border-l-accent bg-background p-4 text-sm font-semibold text-accent-dark"
        >
          {echec}
        </p>
      )}

      <form action={changePassword} className="mt-4 space-y-4">
        <div>
          <label className={labelClass} htmlFor="nouveau">
            Nouveau mot de passe
          </label>
          <input
            id="nouveau"
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={fieldClass}
          />
          <p className="mt-1 text-xs text-muted">
            8 caractères minimum. Évitez un mot courant suivi de chiffres :
            notre service refuse les mots de passe figurant dans des fuites
            connues.
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="confirmation">
            Confirmation
          </label>
          <input
            id="confirmation"
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
          className="btn-cta rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          Enregistrer le nouveau mot de passe
        </button>
      </form>
    </div>
  );
}
