import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { listTickets } from "@/lib/bugtrack-server";
import { CLOSED_STATUSES, PRIORITY_LABELS, REOPENED, type Priority } from "@/lib/bugtrack";
import ClientTicketForm from "@/components/ClientTicketForm";

export const metadata: Metadata = {
  title: "Mes tickets",
  robots: { index: false, follow: false },
};

// Les tickets évoluent côté BugTrack : rien à mettre en cache ici.
export const dynamic = "force-dynamic";

/** Teinte du statut. Les deux qui appellent une action du client —
    « En attente d'informations » et « Livré » — ressortent le plus. */
function statusTone(status: string): string {
  if (CLOSED_STATUSES.includes(status)) return "bg-bordeaux/[0.06] text-muted";
  if (status === REOPENED) return "bg-accent/[0.12] text-accent-dark";
  if (status === "Livré") return "bg-orange/15 text-orange-text";
  if (status === "En attente d'informations")
    return "bg-accent/[0.12] text-accent-dark";
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

export default async function MesTicketsPage() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/espace-client/connexion");

  // L'identifiant vient de la session : c'est ce qui garantit qu'on ne
  // liste jamais les tickets d'un autre.
  const result = await listTickets(user.id);
  const tickets = result.ok ? result.data : [];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          {tickets.length > 0
            ? `${tickets.length} ticket${tickets.length > 1 ? "s" : ""}`
            : "Vos tickets"}
        </h2>
        <ClientTicketForm />
      </div>

      {!result.ok && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-border border-l-4 border-l-accent bg-background p-4 text-sm font-semibold text-accent-dark"
        >
          {result.error}
        </p>
      )}

      {result.ok && tickets.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-10 text-center">
          <p className="font-semibold text-foreground">Aucun ticket pour l&apos;instant</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Un dysfonctionnement, une question, une demande d&apos;évolution ?
            Déclarez un ticket : vous suivrez son traitement ici, et vous serez
            prévenu par email à chaque avancée.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link
                href={`/espace-client/tickets/${t.id}`}
                className="card flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-coral"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xs font-bold text-accent">{t.number}</span>
                    <span className="font-semibold text-foreground">{t.title}</span>
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
    </>
  );
}
