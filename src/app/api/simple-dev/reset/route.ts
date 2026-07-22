import { NextResponse } from "next/server";
import { resetContenu, commitPush, codeAdminOk } from "@/engine/save-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reset total : on efface le contenu → le site retombe sur les défauts du code.
export async function POST(req: Request) {
  if (!codeAdminOk(req)) {
    return NextResponse.json({ ok: false, error: "code admin requis" }, { status: 401 });
  }
  await resetContenu();
  const git = await commitPush("Reset aux valeurs d'origine");
  return NextResponse.json({ ok: true, ...git });
}
