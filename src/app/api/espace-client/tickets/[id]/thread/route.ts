import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { getThread, postMessage } from "@/lib/bugtrack-server";

// ============================================================
// Conversation d'un ticket, côté espace client.
//
// L'identifiant de l'utilisateur vient de la session. BugTrack
// refuse en 404 tout ticket n'appartenant pas au couple
// (site, utilisateur) — mais on ne s'appuie pas sur ce filet :
// c'est ici qu'il faut ne jamais transmettre un identifiant venu
// du navigateur.
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

const NON_AUTHENTIFIE = NextResponse.json(
  { error: "Vous devez être connecté." },
  { status: 401 }
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();
  if (!user) return NON_AUTHENTIFIE;

  const { id } = await params;
  const result = await getThread(id, user.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ messages: result.data });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();
  if (!user) return NON_AUTHENTIFIE;

  const { id } = await params;

  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json(
      { error: "Votre message ne peut pas être vide." },
      { status: 400 }
    );
  }
  if (message.length > MESSAGE_MAX) {
    return NextResponse.json(
      { error: `Votre message ne peut pas dépasser ${MESSAGE_MAX} caractères.` },
      { status: 400 }
    );
  }

  const result = await postMessage(id, user.id, message);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ message: result.data }, { status: 201 });
}
