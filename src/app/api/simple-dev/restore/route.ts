import { NextResponse } from "next/server";
import { lireSnapshot, ecrireContenu, commitPush, codeAdminOk } from "@/engine/save-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Restaure un point de restauration : son contenu redevient le contenu courant.
// body : { id: string }
export async function POST(req: Request) {
  if (!codeAdminOk(req)) {
    return NextResponse.json({ ok: false, error: "code admin requis" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "corps JSON invalide" }, { status: 400 });
  }
  const { id } = body as { id?: string };
  if (!id) {
    return NextResponse.json({ ok: false, error: "id manquant" }, { status: 400 });
  }

  let blocks: unknown;
  try {
    blocks = await lireSnapshot(id);
  } catch {
    return NextResponse.json({ ok: false, error: "point introuvable" }, { status: 404 });
  }
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return NextResponse.json({ ok: false, error: "point vide ou cassé" }, { status: 400 });
  }

  await ecrireContenu(blocks, new Date().toISOString());
  const git = await commitPush("Restauration du point " + id);
  return NextResponse.json({ ok: true, ...git });
}
