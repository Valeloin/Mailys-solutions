import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { closeTicket } from "@/lib/bugtrack-server";

// ============================================================
// Clôture d'un ticket par le client — il déclare que la correction
// lui convient.
//
// L'identifiant de l'utilisateur vient de la session, jamais du
// corps de la requête : c'est le seul rempart contre la clôture du
// ticket d'un autre client du même site.
// ============================================================

async function currentUser() {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function POST(
  _request: Request,
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
  const result = await closeTicket(id, user.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ success: true, ticket: result.data });
}
