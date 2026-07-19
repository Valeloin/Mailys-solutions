import { getAdminClient, isAdminClientConfigured } from "@/lib/supabase/admin";
import { isMailerConfigured } from "@/lib/mailer";
import { ADMIN_EMAILS } from "@/lib/site";
import { formatDate } from "@/lib/blog";
import { inviteClient, revokeClient, restoreClient, resendInvite } from "./actions";

// ============================================================
// Accès à l'espace client : inviter un client, suspendre ou
// rétablir son accès. Les comptes ne se créent pas en libre
// inscription — c'est cet écran qui les ouvre.
// ============================================================

const MESSAGES: Record<string, { text: string; ok: boolean }> = {
  invite: { text: "Invitation envoyée. Le client reçoit un lien pour choisir son mot de passe.", ok: true },
  revoke: { text: "Accès suspendu. Le compte et ses tickets sont conservés.", ok: true },
  restore: { text: "Accès rétabli.", ok: true },
};

const ERRORS: Record<string, string> = {
  email: "Cette adresse email n'est pas valide.",
  admin: "Cette adresse est déjà celle d'un administrateur. Un compte ne peut pas être à la fois administrateur et client.",
  existe: "Un compte existe déjà pour cette adresse. Utilisez « Renvoyer l'invitation » si le client ne l'a jamais reçue.",
  creation: "Le compte n'a pas pu être créé. Réessayez.",
  envoi:
    "Le compte est créé, mais l'email n'a pas pu partir : vérifiez les réglages SMTP. Utilisez « Renvoyer l'invitation » pour réessayer.",
  suspension: "L'opération a échoué. Réessayez.",
  config: "La clé de service Supabase est absente : la gestion des accès est désactivée.",
};

type ClientRow = {
  id: string;
  email: string;
  createdAt: string;
  lastSignIn: string | null;
  confirmed: boolean;
  suspended: boolean;
};

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const notice = Object.keys(MESSAGES).find((k) => params[k] === "1");
  const error = params.error;

  const configured = isAdminClientConfigured();
  let clients: ClientRow[] = [];

  if (configured) {
    const admin = getAdminClient();
    const { data } = await admin!.auth.admin.listUsers({ page: 1, perPage: 200 });
    clients = (data?.users ?? [])
      // Les administrateurs ne sont pas des clients : on ne les liste pas
      // ici, et l'invitation les refuse.
      .filter((u) => !ADMIN_EMAILS.includes((u.email ?? "").toLowerCase()))
      .map((u) => ({
        id: u.id,
        email: u.email ?? "",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at ?? null,
        confirmed: Boolean(u.email_confirmed_at ?? u.confirmed_at),
        suspended: Boolean(
          u.banned_until && new Date(u.banned_until).getTime() > Date.now()
        ),
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground">Accès à l&apos;espace client</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Vos clients ne peuvent pas s&apos;inscrire eux-mêmes. Invitez-les depuis
        cet écran : ils reçoivent un email avec un lien pour choisir leur mot de
        passe, puis accèdent à leur espace pour déclarer des tickets et suivre
        leur traitement.
      </p>

      {notice && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-orange/30 bg-orange/5 p-4 text-sm font-medium text-foreground"
        >
          {MESSAGES[notice].text}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-border border-l-4 border-l-accent bg-background p-4 text-sm font-semibold text-accent-dark"
        >
          {ERRORS[error] ?? ERRORS.suspension}
        </p>
      )}

      {!configured ? (
        <div className="mt-8 rounded-2xl border border-dashed border-coral bg-background p-8">
          <p className="font-semibold text-foreground">
            Gestion des accès désactivée
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            La variable <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            est absente. Elle se trouve dans Supabase → Settings → API →{" "}
            <em>service_role</em>. Ajoutez-la aux variables d&apos;environnement du
            projet (jamais avec un préfixe <code className="font-mono text-xs">NEXT_PUBLIC_</code>,
            cette clé contourne toutes les règles de sécurité), puis redéployez.
          </p>
        </div>
      ) : (
        <>
          {/* Le compte se créerait, mais le client ne recevrait jamais son
              lien : autant le dire avant la première invitation. */}
          {!isMailerConfigured() && (
            <p className="mt-6 rounded-xl border border-border border-l-4 border-l-orange bg-background p-4 text-sm text-foreground">
              <strong className="font-semibold">Envoi d&apos;emails non configuré.</strong>{" "}
              Les invitations partent par la boîte Mailys (SMTP), pas par
              Supabase. Renseignez{" "}
              <code className="font-mono text-xs">SMTP_HOST</code>,{" "}
              <code className="font-mono text-xs">SMTP_PORT</code>,{" "}
              <code className="font-mono text-xs">SMTP_USER</code> et{" "}
              <code className="font-mono text-xs">SMTP_PASS</code> pour que les
              clients reçoivent leur lien.
            </p>
          )}

          {/* ---------- Inviter ---------- */}
          <form
            action={inviteClient}
            className="mt-6 rounded-2xl border border-border bg-background p-5"
          >
            <label
              htmlFor="invite-email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground"
            >
              Inviter un client
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="invite-email"
                type="email"
                name="email"
                required
                placeholder="client@entreprise.fr"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
              />
              <button
                type="submit"
                className="btn-cta shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              >
                Envoyer l&apos;invitation
              </button>
            </div>
          </form>

          {/* ---------- Liste ---------- */}
          {clients.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-8 text-center">
              <p className="font-semibold text-foreground">Aucun client pour l&apos;instant</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Les comptes que vous invitez apparaîtront ici, avec leur état.
              </p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {clients.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{c.email}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      Invité le {formatDate(c.createdAt)}
                      {c.lastSignIn
                        ? ` — dernière connexion le ${formatDate(c.lastSignIn)}`
                        : " — jamais connecté"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        c.suspended
                          ? "bg-accent/10 text-accent-dark"
                          : c.confirmed
                            ? "bg-orange/10 text-orange-text"
                            : "bg-bordeaux/[0.06] text-muted"
                      }`}
                    >
                      {c.suspended
                        ? "Suspendu"
                        : c.confirmed
                          ? "Actif"
                          : "Invitation en attente"}
                    </span>

                    {!c.confirmed && !c.suspended && (
                      <form action={resendInvite}>
                        <input type="hidden" name="email" value={c.email} />
                        <button
                          type="submit"
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
                        >
                          Renvoyer l&apos;invitation
                        </button>
                      </form>
                    )}

                    <form action={c.suspended ? restoreClient : revokeClient}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
                      >
                        {c.suspended ? "Rétablir l'accès" : "Suspendre l'accès"}
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
