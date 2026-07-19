import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import {
  attachmentError,
  validateReport,
  type ReportFields,
} from "@/lib/bugtrack";

// ============================================================
// Signalement de bug → BugTrack.
// Proxy serveur : la clé du site ne quitte jamais le serveur —
// le formulaire poste ici, et c'est cette route qui appelle
// BugTrack. Réservée à l'espace admin (seul espace authentifié
// du site) : la route exige une session Supabase valide, sans
// quoi l'endpoint serait ouvert et permettrait de créer des
// tickets sous notre clé.
// ============================================================

type Config = { apiUrl: string; siteKey: string };

/** Lit la configuration, ou renvoie le message d'erreur explicite.
    Sans ces variables, inutile d'appeler l'API : elle répondrait 401. */
function readConfig(): { config: Config } | { error: string } {
  const apiUrl = process.env.BUGTRACK_API_URL?.trim().replace(/\/+$/, "");
  const siteKey = process.env.BUGTRACK_SITE_KEY?.trim();

  const missing = [
    !apiUrl && "BUGTRACK_API_URL",
    !siteKey && "BUGTRACK_SITE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    return {
      error: `Configuration BugTrack incomplète : ${missing.join(" et ")} ${
        missing.length > 1 ? "sont manquantes" : "est manquante"
      }. Renseignez ces variables d'environnement puis redéployez.`,
    };
  }
  return { config: { apiUrl: apiUrl!, siteKey: siteKey! } };
}

/** Session admin courante, ou null. */
async function currentUser() {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour signaler un bug." },
      { status: 401 }
    );
  }

  const conf = readConfig();
  if ("error" in conf) {
    return NextResponse.json({ error: conf.error }, { status: 500 });
  }
  const { apiUrl, siteKey } = conf.config;

  const form = await request.formData();
  const fields: ReportFields = {
    title: String(form.get("title") || ""),
    description: String(form.get("description") || ""),
    software: String(form.get("software") || ""),
    version: String(form.get("version") || ""),
    priority: String(form.get("priority") || ""),
  };

  // Mêmes contraintes que l'API : on rejette avant l'appel réseau,
  // au même format que ses réponses 400 (details par champ).
  const invalid = validateReport(fields);
  if (Object.keys(invalid).length > 0) {
    return NextResponse.json(
      {
        error: "Données invalides",
        details: Object.entries(invalid).map(([field, message]) => ({
          field,
          message,
        })),
      },
      { status: 400 }
    );
  }

  const files = form
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const rejected = files.map(attachmentError).filter(Boolean) as string[];
  if (rejected.length > 0) {
    return NextResponse.json(
      { error: "Données invalides", details: [{ field: "attachments", message: rejected.join(" ") }] },
      { status: 400 }
    );
  }

  // ---------- 1. Création du ticket ----------
  const version = fields.version.trim();
  const payload = {
    site_key: siteKey,
    user_id: user.id,
    user_email: user.email ?? "",
    user_name: user.user_metadata?.full_name || user.email || "Admin",
    title: fields.title.trim(),
    description: fields.description.trim(),
    software: fields.software.trim(),
    // « version » est optionnelle : omise plutôt qu'envoyée vide.
    ...(version ? { version } : {}),
    priority: fields.priority,
  };

  let created: Response;
  try {
    created = await fetch(`${apiUrl}/api/tickets/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "BugTrack est injoignable. Vérifiez votre connexion et réessayez." },
      { status: 502 }
    );
  }

  const body = await created.json().catch(() => null);

  if (created.status === 400) {
    return NextResponse.json(
      { error: body?.error || "Données invalides", details: body?.details ?? [] },
      { status: 400 }
    );
  }
  if (created.status === 401) {
    return NextResponse.json(
      {
        error:
          "BugTrack a refusé la clé de ce site (clé absente, erronée, ou site désactivé). Vérifiez BUGTRACK_SITE_KEY puis redéployez.",
      },
      { status: 502 }
    );
  }
  if (!created.ok || !body?.ticket) {
    return NextResponse.json(
      { error: "BugTrack n'a pas pu enregistrer le signalement. Réessayez dans un instant." },
      { status: 502 }
    );
  }

  const ticket = body.ticket as { id: string; number: string; status: string };

  // ---------- 2. Pièces jointes (une requête par fichier) ----------
  // Le ticket existe déjà : l'échec d'un envoi ne doit pas faire
  // perdre le signalement, on le remonte à part.
  const failed: string[] = [];
  for (const file of files) {
    const upload = new FormData();
    upload.set("site_key", siteKey);
    upload.set("ticket_id", ticket.id);
    upload.set("file", file, file.name);
    try {
      const res = await fetch(`${apiUrl}/api/attachments`, {
        method: "POST",
        body: upload,
      });
      if (!res.ok) failed.push(file.name);
    } catch {
      failed.push(file.name);
    }
  }

  return NextResponse.json({
    success: true,
    ticket,
    ...(failed.length > 0 ? { attachmentsFailed: failed } : {}),
  });
}

// ---------- Historique des signalements de l'utilisateur ----------
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const conf = readConfig();
  if ("error" in conf) {
    return NextResponse.json({ error: conf.error }, { status: 500 });
  }
  const { apiUrl, siteKey } = conf.config;

  const url = new URL(`${apiUrl}/api/tickets/list`);
  url.searchParams.set("site_key", siteKey);
  url.searchParams.set("user_id", user.id);

  try {
    const res = await fetch(url, { cache: "no-store" });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Historique indisponible pour le moment." },
        { status: 502 }
      );
    }
    return NextResponse.json({ tickets: body?.tickets ?? [] });
  } catch {
    return NextResponse.json(
      { error: "Historique indisponible pour le moment." },
      { status: 502 }
    );
  }
}
