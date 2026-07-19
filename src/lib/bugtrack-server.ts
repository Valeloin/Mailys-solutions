import {
  PRIORITIES,
  type BugtrackMessage,
  type BugtrackTicket,
  type Priority,
} from "@/lib/bugtrack";

export type { BugtrackMessage, BugtrackTicket };

// ============================================================
// Appels à l'API BugTrack — serveur uniquement.
//
// ⚠️ Ce module lit la clé du site. Il ne doit jamais être importé
// par un composant client : la clé se retrouverait dans le bundle
// envoyé au navigateur, et n'importe qui pourrait créer des
// tickets au nom du site ou lire ceux des autres.
//
// Les identifiants d'utilisateur passés ici doivent TOUJOURS
// provenir de la session côté serveur, jamais d'un paramètre de
// requête : sinon un client changerait l'identifiant et lirait
// les tickets d'un autre.
// ============================================================

export type FieldError = { field: string; message: string };

/** Résultat uniforme : soit la donnée, soit un motif d'échec exploitable. */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; details?: FieldError[] };

type Config = { apiUrl: string; siteKey: string };

function readConfig(): Result<Config> {
  if (typeof window !== "undefined") {
    throw new Error(
      "bugtrack-server a été importé côté navigateur : la clé du site ne doit jamais y parvenir."
    );
  }

  const apiUrl = process.env.BUGTRACK_API_URL?.trim().replace(/\/+$/, "");
  const siteKey = process.env.BUGTRACK_SITE_KEY?.trim();

  const missing = [
    !apiUrl && "BUGTRACK_API_URL",
    !siteKey && "BUGTRACK_SITE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    return {
      ok: false,
      status: 500,
      error: `Configuration BugTrack incomplète : ${missing.join(" et ")} ${
        missing.length > 1 ? "sont manquantes" : "est manquante"
      }. Renseignez ces variables d'environnement puis redéployez.`,
    };
  }
  return { ok: true, data: { apiUrl: apiUrl!, siteKey: siteKey! } };
}

const INJOIGNABLE = {
  ok: false as const,
  status: 502,
  error: "BugTrack est injoignable. Réessayez dans un instant.",
};

/** Traduit une réponse d'erreur de l'API en message affichable. */
function fromError(status: number, body: unknown): Result<never> {
  const payload = body as { error?: string; details?: FieldError[] } | null;

  if (status === 400) {
    return {
      ok: false,
      status: 400,
      error: payload?.error || "Données invalides",
      details: payload?.details ?? [],
    };
  }
  if (status === 401) {
    return {
      ok: false,
      status: 502,
      error:
        "BugTrack a refusé la clé de ce site. Vérifiez BUGTRACK_SITE_KEY puis redéployez.",
    };
  }
  if (status === 404) {
    return { ok: false, status: 404, error: "Ticket introuvable." };
  }
  return {
    ok: false,
    status: 502,
    error: "BugTrack n'a pas pu traiter la demande. Réessayez dans un instant.",
  };
}

// ---------- Création ----------

export type CreateInput = {
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  description: string;
  software: string;
  version: string;
  priority: string;
};

export async function createTicket(
  input: CreateInput
): Promise<Result<{ id: string; number: string; status: string }>> {
  const conf = readConfig();
  if (!conf.ok) return conf;
  const { apiUrl, siteKey } = conf.data;

  if (!PRIORITIES.includes(input.priority as Priority)) {
    return {
      ok: false,
      status: 400,
      error: "Données invalides",
      details: [{ field: "priority", message: "Choisissez une priorité." }],
    };
  }

  const version = input.version.trim();
  const payload = {
    site_key: siteKey,
    user_id: input.userId,
    user_email: input.userEmail,
    user_name: input.userName,
    title: input.title.trim(),
    description: input.description.trim(),
    software: input.software.trim(),
    // Optionnelle : omise plutôt qu'envoyée vide.
    ...(version ? { version } : {}),
    priority: input.priority,
  };

  try {
    const res = await fetch(`${apiUrl}/api/tickets/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.ticket) return fromError(res.status, body);
    return { ok: true, data: body.ticket };
  } catch {
    return INJOIGNABLE;
  }
}

// ---------- Pièces jointes ----------

/** Envoie les fichiers un par un ; renvoie ceux qui ont échoué.
    Le ticket existe déjà : un envoi raté ne doit pas le faire perdre. */
export async function uploadAttachments(
  ticketId: string,
  files: File[]
): Promise<string[]> {
  const conf = readConfig();
  if (!conf.ok) return files.map((f) => f.name);
  const { apiUrl, siteKey } = conf.data;

  const failed: string[] = [];
  for (const file of files) {
    const form = new FormData();
    form.set("site_key", siteKey);
    form.set("ticket_id", ticketId);
    form.set("file", file, file.name);
    try {
      const res = await fetch(`${apiUrl}/api/attachments`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) failed.push(file.name);
    } catch {
      failed.push(file.name);
    }
  }
  return failed;
}

// ---------- Lecture ----------

export async function listTickets(
  userId: string
): Promise<Result<BugtrackTicket[]>> {
  const conf = readConfig();
  if (!conf.ok) return conf;
  const { apiUrl, siteKey } = conf.data;

  const url = new URL(`${apiUrl}/api/tickets/list`);
  url.searchParams.set("site_key", siteKey);
  url.searchParams.set("user_id", userId);

  try {
    const res = await fetch(url, { cache: "no-store" });
    const body = await res.json().catch(() => null);
    if (!res.ok) return fromError(res.status, body);
    return { ok: true, data: (body?.tickets ?? []) as BugtrackTicket[] };
  } catch {
    return INJOIGNABLE;
  }
}

export async function getThread(
  ticketId: string,
  userId: string
): Promise<Result<BugtrackMessage[]>> {
  const conf = readConfig();
  if (!conf.ok) return conf;
  const { apiUrl, siteKey } = conf.data;

  const url = new URL(`${apiUrl}/api/tickets/${ticketId}/thread`);
  url.searchParams.set("site_key", siteKey);
  url.searchParams.set("user_id", userId);

  try {
    const res = await fetch(url, { cache: "no-store" });
    const body = await res.json().catch(() => null);
    if (!res.ok) return fromError(res.status, body);
    return { ok: true, data: (body?.messages ?? []) as BugtrackMessage[] };
  } catch {
    return INJOIGNABLE;
  }
}

export async function postMessage(
  ticketId: string,
  userId: string,
  message: string
): Promise<Result<BugtrackMessage>> {
  const conf = readConfig();
  if (!conf.ok) return conf;
  const { apiUrl, siteKey } = conf.data;

  try {
    const res = await fetch(`${apiUrl}/api/tickets/${ticketId}/thread`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_key: siteKey, user_id: userId, message }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return fromError(res.status, body);
    return { ok: true, data: body.message as BugtrackMessage };
  } catch {
    return INJOIGNABLE;
  }
}
