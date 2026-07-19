import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { getThread, listTickets } from "@/lib/bugtrack-server";
import { CLOSED_STATUSES, PRIORITY_LABELS, STATUSES, type Priority } from "@/lib/bugtrack";
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

  const currentStep = STATUSES.indexOf(ticket.status as (typeof STATUSES)[number]);
  const closed = CLOSED_STATUSES.includes(ticket.status);

  return (
    <section className="sec sec-clean min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <Link
          href="/espace-client"
          className="text-sm font-semibold text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          ← Retour à mes tickets
        </Link>

        <div className="card reveal relative mt-5 rounded-2xl border border-border bg-background p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="brand-hairline absolute inset-x-0 top-0 h-1 rounded-t-2xl"
          />

          <p className="text-xs font-bold text-accent">{ticket.number}</p>
          <h1 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            {ticket.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ouvert le {formatDay(ticket.created_at)} — priorité{" "}
            {PRIORITY_LABELS[ticket.priority as Priority] ?? ticket.priority}
          </p>

          {/* Avancement : les étapes franchies sont colorées, les
              suivantes restent en gris. */}
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
      </div>
    </section>
  );
}
