import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { listTickets } from "@/lib/bugtrack-server";
import {
  CLOSED_STATUSES,
  PRIORITY_LABELS,
  REOPENED,
  type BugtrackTicket,
  type Priority,
} from "@/lib/bugtrack";
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
    // Un tiret plutôt que du vide : « Ouvert le  — priorité Moyen »
    // ressemblait à un défaut d'affichage.
    return "—";
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

  // Une lecture échouée ne rend NI liste vide NI compteur : « Vos tickets »
  // suivi d'une liste vide se lisait comme « vous n'avez aucun ticket ».
  if (!result.ok) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-border border-l-4 border-l-accent bg-background p-6"
      >
        <h2 className="font-bold text-foreground">
          Vos tickets ne sont pas consultables pour l&apos;instant
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {result.error} Ils sont intacts — seul leur affichage a échoué. Si
          votre demande est urgente,{" "}
          <Link href="/contact" className="font-semibold underline underline-offset-2">
            écrivez-nous directement
          </Link>
          .
        </p>
      </div>
    );
  }

  // Rangement par récence réelle : l'API ne garantit pas d'ordre, et la
  // date affichée jusqu'ici — l'ouverture — était justement celle qui
  // n'aide pas à retrouver « celui où ils m'ont écrit mardi ».
  const parRecence = [...result.data].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at)
  );

  const clos = parRecence.filter((t) => CLOSED_STATUSES.includes(t.status));
  const actifs = parRecence
    .filter((t) => !CLOSED_STATUSES.includes(t.status))
    // Ceux qui attendent le client passent en tête de son propre groupe.
    .sort((a, b) => {
      const attend = (s: string) => (s === "En attente d'informations" ? 0 : 1);
      return attend(a.status) - attend(b.status);
    });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          {actifs.length > 0
            ? `${actifs.length} ticket${actifs.length > 1 ? "s" : ""} en cours`
            : "Vos tickets"}
        </h2>
        <ClientTicketForm />
      </div>

      {parRecence.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-10 text-center">
          <p className="font-semibold text-foreground">Aucun ticket pour l&apos;instant</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Un dysfonctionnement, une question, une demande d&apos;évolution ?
            Déclarez un ticket : vous suivrez son traitement ici, et vous serez
            prévenu par email à chaque avancée.
          </p>
        </div>
      ) : (
        <>
          {actifs.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {actifs.map((t) => (
                <CarteTicket key={t.id} ticket={t} />
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted">
              Aucun ticket en cours. Tout est traité.
            </p>
          )}

          {/* Les clos ne se mêlent plus aux actifs : sur quinze tickets dont
              douze clos, retrouver le vivant était un balayage complet. */}
          {clos.length > 0 && (
            <details className="mt-8 rounded-2xl border border-border bg-background">
              <summary className="cursor-pointer list-none px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-muted transition-colors hover:text-foreground">
                Tickets clos ({clos.length})
              </summary>
              <ul className="space-y-3 px-3 pb-3">
                {clos.map((t) => (
                  <CarteTicket key={t.id} ticket={t} />
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </>
  );
}

/** Une ligne de la liste. Extraite parce qu'elle sert aux deux groupes. */
function CarteTicket({ ticket: t }: { ticket: BugtrackTicket }) {
  return (
    <li>
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
            Dernière activité le {formatDay(t.updated_at)} — ouvert le{" "}
            {formatDay(t.created_at)} — priorité{" "}
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
  );
}
