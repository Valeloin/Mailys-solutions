import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { attachmentError, validateReport, type ReportFields } from "@/lib/bugtrack";
import { createTicket, listTickets, uploadAttachments } from "@/lib/bugtrack-server";

// ============================================================
// Tickets de l'espace client.
//
// Chaque appel n'agit que sur les tickets de l'utilisateur
// connecté : l'identifiant vient de la session, jamais du corps
// ni des paramètres de la requête. C'est la seule garantie qu'un
// client ne puisse pas lire ceux d'un autre en changeant une
// valeur dans son navigateur.
// ============================================================

/** Utilisateur connecté, ou null. Pas de contrôle d'administrateur :
    ces routes ne donnent accès qu'aux tickets de l'appelant. */
async function currentUser() {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

const NON_AUTHENTIFIE = NextResponse.json(
  { error: "Vous devez être connecté." },
  { status: 401 }
);

export async function GET() {
  const user = await currentUser();
  if (!user) return NON_AUTHENTIFIE;

  const result = await listTickets(user.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ tickets: result.data });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NON_AUTHENTIFIE;

  const form = await request.formData();
  const fields: ReportFields = {
    title: String(form.get("title") || ""),
    description: String(form.get("description") || ""),
    software: String(form.get("software") || ""),
    version: String(form.get("version") || ""),
    priority: String(form.get("priority") || ""),
  };

  // Mêmes contraintes que l'API BugTrack : on rejette avant l'appel
  // réseau, au format qu'attend le formulaire (erreurs par champ).
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
      {
        error: "Données invalides",
        details: [{ field: "attachments", message: rejected.join(" ") }],
      },
      { status: 400 }
    );
  }

  const created = await createTicket({
    userId: user.id,
    userEmail: user.email ?? "",
    userName: user.user_metadata?.full_name || user.email || "Client",
    ...fields,
  });

  if (!created.ok) {
    return NextResponse.json(
      { error: created.error, details: created.details },
      { status: created.status }
    );
  }

  const failed = await uploadAttachments(created.data.id, files);

  return NextResponse.json({
    success: true,
    ticket: created.data,
    ...(failed.length > 0 ? { attachmentsFailed: failed } : {}),
  });
}
