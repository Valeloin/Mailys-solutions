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
  const clos = tickets.filter((t) => CLOSED_STATUSES.includes(t.status)).length;

  // Les trois plus récents, pour donner à voir sans dupliquer la liste.
  const recents = [...tickets]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 3);

  // Les tickets qui attendent quelque chose du client, nommés plutôt que
  // comptés : annoncer « 2 tickets attendent une réponse » obligeait à les
  // retrouver soi-même dans une liste non filtrée.
  const aRepondre = tickets.filter(
    (t) => t.status === "En attente d'informations"
  );
  const rouvertsListe = tickets.filter((t) => t.status === REOPENED);

  // Un échec de lecture n'affiche AUCUN chiffre. Sinon les compteurs
  // annonçaient « 0 ticket en cours » avec l'autorité de chiffres justes,
  // sous l'encart d'erreur : un client avec un ticket bloquant lisait
  // « 0 en cours » et refermait la page rassuré.
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
          {result.error} Vos tickets et vos échanges sont intacts — seul leur
          affichage a échoué. Si votre demande est urgente,{" "}
          <Link href="/contact" className="font-semibold underline underline-offset-2">
            écrivez-nous directement
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Ce qui attend le client passe AVANT les compteurs : c'est la
          seule chose actionnable de la page, elle était sous trois
          chiffres passifs. */}
      {aRepondre.length > 0 && (
        <section className="mb-6 rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
          <h2 className="text-sm font-bold text-foreground">
            {aRepondre.length > 1
              ? `${aRepondre.length} tickets attendent une réponse de votre part`
              : "Un ticket attend une réponse de votre part"}
          </h2>
          <ul className="mt-2 space-y-1.5">
            {aRepondre.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/espace-client/tickets/${t.id}`}
                  className="text-sm font-semibold text-accent-dark underline-offset-2 hover:underline"
                >
                  {t.number} — {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rouvertsListe.length > 0 && (
        <section className="mb-6 rounded-xl border border-border bg-background p-4">
          <h2 className="text-sm font-bold text-foreground">
            {rouvertsListe.length > 1
              ? `${rouvertsListe.length} tickets ont été rouverts`
              : "Un ticket a été rouvert"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            La correction livrée n&apos;a pas tenu, nous les avons repris.
          </p>
          <ul className="mt-2 space-y-1.5">
            {rouvertsListe.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/espace-client/tickets/${t.id}`}
                  className="text-sm font-semibold text-foreground underline-offset-2 hover:underline"
                >
                  {t.number} — {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Compteur valeur={enCours} legende="ticket(s) en cours de traitement" ton="chaud" />
        <Compteur
          valeur={aRepondre.length}
          legende="en attente d'une information de votre part"
          ton="attente"
        />
        <Compteur valeur={clos} legende="ticket(s) clos" ton="calme" />
      </div>

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
