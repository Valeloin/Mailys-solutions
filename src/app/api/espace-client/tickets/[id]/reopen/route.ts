import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { reopenTicket } from "@/lib/bugtrack-server";

// ============================================================
// Réouverture d'un ticket clos, avec le motif saisi par le client.
//
// L'identifiant de l'utilisateur vient de la session, jamais du
// corps de la requête : seul le motif est lu de ce dernier.
// ============================================================

const MESSAGE_MAX = 5000;

async function currentUser() {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Vous devez être connecté." },
      { status: 401 }
    );
  }

  const { id } = await params;

  // Le corps est facultatif : un motif absent reste une réouverture valide.
  let body: { message?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const message = (body.message ?? "").trim();
  if (message.length > MESSAGE_MAX) {
    return NextResponse.json(
      { error: `Votre motif ne peut pas dépasser ${MESSAGE_MAX} caractères.` },
      { status: 400 }
    );
  }

  const result = await reopenTicket(id, user.id, message);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ success: true, ticket: result.data });
}
