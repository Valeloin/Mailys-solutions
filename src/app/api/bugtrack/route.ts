import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

// ============================================================
// Signalement de bug → BugTrack (plateforme centralisée).
// Proxy serveur : le site_key ne quitte jamais le navigateur,
// et seul un admin authentifié (session Supabase) peut envoyer
// un ticket — la route ne fait que relayer vers l'API BugTrack.
// ============================================================

const PRIORITIES = new Set(["Faible", "Moyen", "Élevé", "Bloquant"]);
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024; // 15 Mo/fichier

export async function POST(request: Request) {
  const supabase = await getServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "non-authentifie" }, { status: 401 });
  }

  const siteKey = process.env.BUGTRACK_SITE_KEY;
  const apiUrl = process.env.BUGTRACK_API_URL;
  if (!siteKey || !apiUrl) {
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  const incoming = await request.formData();

  const title = String(incoming.get("title") || "").trim();
  const description = String(incoming.get("description") || "").trim();
  const software = String(incoming.get("software") || "").trim();
  const version = String(incoming.get("version") || "").trim();
  const priority = String(incoming.get("priority") || "").trim();

  if (!title || !description || !software) {
    return NextResponse.json({ error: "champs" }, { status: 400 });
  }
  if (!PRIORITIES.has(priority)) {
    return NextResponse.json({ error: "priorite" }, { status: 400 });
  }

  const attachments = incoming
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (attachments.length > MAX_ATTACHMENTS) {
    return NextResponse.json({ error: "trop-de-fichiers" }, { status: 400 });
  }
  if (attachments.some((f) => f.size > MAX_ATTACHMENT_BYTES)) {
    return NextResponse.json({ error: "fichier-trop-lourd" }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.set("site_key", siteKey);
  outgoing.set("user_id", user.id);
  outgoing.set("user_email", user.email ?? "");
  outgoing.set("user_name", user.user_metadata?.full_name || user.email || "Admin");
  outgoing.set("title", title);
  outgoing.set("description", description);
  outgoing.set("software", software);
  outgoing.set("version", version);
  outgoing.set("priority", priority);
  attachments.forEach((file) => outgoing.append("attachments", file, file.name));

  try {
    const res = await fetch(apiUrl, { method: "POST", body: outgoing });
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: payload?.error || "bugtrack-indisponible" },
        { status: res.status }
      );
    }
    return NextResponse.json({ ok: true, ticketId: payload?.ticket_id ?? payload?.id ?? null });
  } catch {
    return NextResponse.json({ error: "bugtrack-indisponible" }, { status: 502 });
  }
}
