import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { getThread, listTickets } from "@/lib/bugtrack-server";
import {
  CLOSED_STATUSES,
  PRIORITY_LABELS,
  REOPENED,
  STATUSES,
  type Priority,
} from "@/lib/bugtrack";
import ClientTicketThread from "@/components/ClientTicketThread";

export const metadata: Metadata = {
  title: "Votre ticket",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

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

/** Ce que le statut appelle de la part du client, quand il appelle
    quelque chose. Un statut purement informatif ne renvoie rien. */
function consigne(status: string): string | null {
  if (status === "En attente d'informations") {
    return "Nous attendons une précision de votre part pour reprendre le traitement. Répondez ci-dessous.";
  }
  if (status === "Livré") {
    return "La correction est déployée. Vérifiez de votre côté, et dites-nous si le problème persiste.";
  }
  return null;
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect("/espace-client/connexion");

  // Le ticket est cherché dans la liste de CET utilisateur : s'il ne s'y
  // trouve pas, il ne lui appartient pas, et la page n'existe pas pour
  // lui. L'appartenance est ainsi vérifiée sans requête supplémentaire.
  const list = await listTickets(user.id);
  const ticket = list.ok ? list.data.find((t) => t.id === id) : undefined;
  if (!ticket) notFound();

  const thread = await getThread(id, user.id);
  const messages = thread.ok ? thread.data : [];
  const threadError = thread.ok ? null : thread.error;

  const rouvert = ticket.status === REOPENED;
  const currentStep = STATUSES.indexOf(ticket.status as (typeof STATUSES)[number]);
  const closed = CLOSED_STATUSES.includes(ticket.status);
  const aFaire = consigne(ticket.status);

  return (
    <>
      <Link
        href="/espace-client/tickets"
        className="text-sm font-semibold text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
      >
        ← Retour à mes tickets
      </Link>

      <div className="card mt-5 rounded-2xl border border-border bg-background p-6 sm:p-8">
        <p className="text-xs font-bold text-accent">{ticket.number}</p>
        <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
          {ticket.title}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Ouvert le {formatDay(ticket.created_at)} — priorité{" "}
          {PRIORITY_LABELS[ticket.priority as Priority] ?? ticket.priority}
        </p>

        {/* Avancement : les étapes franchies sont colorées, les suivantes
            restent en gris. « Réouvert » sort du parcours, il est donc
            annoncé à part plutôt que placé sur la frise. */}
        {rouvert ? (
          <p className="mt-6 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            Réouvert — nous l&apos;avons repris
          </p>
        ) : (
          <ol className="mt-6 flex flex-wrap gap-1.5" aria-label="Avancement">
            {STATUSES.map((s, i) => {
              const done = currentStep >= 0 && i <= currentStep;
              return (
                <li
                  key={s}
                  aria-current={s === ticket.status ? "step" : undefined}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    s === ticket.status
                      ? "bg-accent text-white"
                      : done
                        ? "bg-orange/10 text-orange-text"
                        : "bg-bordeaux/[0.05] text-muted"
                  }`}
                >
                  {s}
                </li>
              );
            })}
          </ol>
        )}

        {aFaire && (
          <p className="mt-5 rounded-xl border border-orange/30 bg-orange/[0.07] p-4 text-sm text-foreground">
            {aFaire}
          </p>
        )}
      </div>

      <div className="mt-8">
        {threadError ? (
          <p
            role="alert"
            className="rounded-xl border border-border border-l-4 border-l-accent bg-background p-4 text-sm font-semibold text-accent-dark"
          >
            {threadError}
          </p>
        ) : (
          <ClientTicketThread
            ticketId={id}
            initialMessages={messages}
            closed={closed}
          />
        )}
      </div>
    </>
  );
}
