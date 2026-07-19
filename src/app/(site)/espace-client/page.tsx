import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { listTickets } from "@/lib/bugtrack-server";
import { PRIORITY_LABELS, type Priority } from "@/lib/bugtrack";
import { logoutClient } from "./actions";
import ClientTicketForm from "@/components/ClientTicketForm";

export const metadata: Metadata = {
  title: "Votre espace client",
  robots: { index: false, follow: false },
};

// Les tickets évoluent côté BugTrack : rien à mettre en cache ici.
export const dynamic = "force-dynamic";

/** Teinte du statut : chaud tant que ça avance, sobre une fois clos. */
function statusTone(status: string): string {
  if (status === "Fermé") return "bg-bordeaux/[0.06] text-muted";
  if (status === "Corrigé" || status === "Livré")
    return "bg-orange/10 text-orange-text";
  if (status === "En attente d'informations")
    return "bg-accent/10 text-accent-dark";
  return "bg-coral/10 text-[#D8494F]";
}

function formatDay(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default async function EspaceClientPage({
  searchParams,
}: {
  searchParams: Promise<{ bienvenue?: string }>;
}) {
  const { bienvenue } = await searchParams;

  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect("/espace-client/connexion");

  // L'identifiant vient de la session : c'est ce qui garantit qu'on ne
  // liste jamais les tickets d'un autre.
  const result = await listTickets(user.id);
  const tickets = result.ok ? result.data : [];
  const loadError = result.ok ? null : result.error;

  return (
    <section className="sec sec-clean">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Votre espace client
            </h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <ClientTicketForm />
            <form action={logoutClient}>
              <button
                type="submit"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>

        {bienvenue === "1" && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-orange/30 bg-orange/5 p-4 text-sm text-foreground"
          >
            Votre mot de passe est enregistré. Bienvenue dans votre espace.
          </p>
        )}

        {loadError && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-border border-l-4 border-l-accent bg-background p-4 text-sm font-semibold text-accent-dark"
          >
            {loadError}
          </p>
        )}

        {!loadError && tickets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-background p-10 text-center">
            <p className="font-semibold text-foreground">Aucun ticket pour l&apos;instant</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Un dysfonctionnement, une question, une demande d&apos;évolution ?
              Déclarez un ticket : vous suivrez son traitement ici, et vous
              serez prévenu par email à chaque avancée.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {tickets.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/espace-client/tickets/${t.id}`}
                  className="card reveal flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-coral"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-2">
                      <span className="text-xs font-bold text-accent">
                        {t.number}
                      </span>
                      <span className="font-semibold text-foreground">
                        {t.title}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Ouvert le {formatDay(t.created_at)} — priorité{" "}
                      {PRIORITY_LABELS[t.priority as Priority] ?? t.priority}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusTone(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
