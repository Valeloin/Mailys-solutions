import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { listTickets } from "@/lib/bugtrack-server";
import { CLOSED_STATUSES, REOPENED } from "@/lib/bugtrack";

export const metadata: Metadata = {
  title: "Votre espace client",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Chiffre mis en avant, avec sa légende. */
function Compteur({
  valeur,
  legende,
  ton,
}: {
  valeur: number;
  legende: string;
  ton: "chaud" | "attente" | "calme";
}) {
  const tons = {
    chaud: "border-coral/30 bg-coral/[0.07]",
    attente: "border-accent/25 bg-accent/[0.06]",
    calme: "border-border bg-background",
  } as const;

  return (
    <div className={`rounded-2xl border p-5 ${tons[ton]}`}>
      <p className="text-3xl font-bold text-foreground">{valeur}</p>
      <p className="mt-1 text-sm leading-snug text-muted">{legende}</p>
    </div>
  );
}

export default async function TableauDeBordPage() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/espace-client/connexion");

  const result = await listTickets(user.id);
  const tickets = result.ok ? result.data : [];

  const enCours = tickets.filter(
    (t) => !CLOSED_STATUSES.includes(t.status)
  ).length;
  const attente = tickets.filter(
    (t) => t.status === "En attente d'informations"
  ).length;
  const clos = tickets.filter((t) => CLOSED_STATUSES.includes(t.status)).length;
  const reouverts = tickets.filter((t) => t.status === REOPENED).length;

  // Les trois plus récents, pour donner à voir sans dupliquer la liste.
  const recents = [...tickets]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 3);

  return (
    <>
      {!result.ok && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-border border-l-4 border-l-accent bg-background p-4 text-sm font-semibold text-accent-dark"
        >
          {result.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Compteur valeur={enCours} legende="ticket(s) en cours de traitement" ton="chaud" />
        <Compteur
          valeur={attente}
          legende="en attente d'une information de votre part"
          ton="attente"
        />
        <Compteur valeur={clos} legende="ticket(s) clos" ton="calme" />
      </div>

      {attente > 0 && (
        <p className="mt-4 rounded-xl border border-accent/25 bg-accent/[0.06] p-4 text-sm text-foreground">
          Nous attendons une précision de votre part sur{" "}
          {attente > 1 ? `${attente} tickets` : "un ticket"}. Votre réponse nous
          permettra de reprendre le traitement.
        </p>
      )}

      {reouverts > 0 && (
        <p className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-muted">
          {reouverts > 1 ? `${reouverts} tickets ont été rouverts` : "Un ticket a été rouvert"} :
          la correction livrée n&apos;a pas tenu, nous les avons repris.
        </p>
      )}

      <div className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
            Activité récente
          </h2>
          {tickets.length > 3 && (
            <Link
              href="/espace-client/tickets"
              className="text-sm font-semibold text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Voir tous mes tickets
            </Link>
          )}
        </div>

        {recents.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-background p-10 text-center">
            <p className="font-semibold text-foreground">
              Aucun ticket pour l&apos;instant
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Un dysfonctionnement, une question, une demande d&apos;évolution ?
              Déclarez un ticket depuis l&apos;onglet « Mes tickets ».
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {recents.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/espace-client/tickets/${t.id}`}
                  className="card flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-coral"
                >
                  <span className="min-w-0">
                    <span className="text-xs font-bold text-accent">{t.number}</span>{" "}
                    <span className="font-semibold text-foreground">{t.title}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-bordeaux/[0.06] px-3 py-1 text-xs font-semibold text-muted">
                    {t.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
