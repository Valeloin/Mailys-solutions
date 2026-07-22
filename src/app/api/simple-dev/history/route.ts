import { NextResponse } from "next/server";
import { listerSnapshots } from "@/engine/save-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Liste les points de restauration (snapshots), le plus récent d'abord.
export async function GET() {
  const points = await listerSnapshots();
  return NextResponse.json({ ok: true, points });
}
