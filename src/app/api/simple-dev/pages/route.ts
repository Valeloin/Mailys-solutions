import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { listerPages, type PageInfo } from "@/engine/pages";
import { codeAdminOk, commitPush } from "@/engine/save-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIR = path.join(process.cwd(), "content");
const INDEX = path.join(DIR, "pages.json");

// Transforme un nom en slug d'URL propre (minuscules, sans accents, tirets).
function nettoyerSlug(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function ecrireIndex(pages: PageInfo[]) {
  await mkdir(DIR, { recursive: true });
  await writeFile(INDEX, JSON.stringify(pages, null, 2), "utf8");
}

type Corps = { slug?: string; titre?: string; description?: string };

export async function GET() {
  return NextResponse.json({ ok: true, pages: await listerPages() });
}

export async function POST(req: Request) {
  if (!codeAdminOk(req)) return NextResponse.json({ ok: false, error: "code admin requis" }, { status: 401 });
  let body: Corps;
  try {
    body = (await req.json()) as Corps;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }
  const titre = (body.titre || "").trim() || "Nouvelle page";
  const slug = nettoyerSlug(body.slug || titre);
  if (!slug) return NextResponse.json({ ok: false, error: "nom de page invalide" }, { status: 400 });
  const pages = await listerPages();
  if (pages.some((p) => p.slug === slug)) {
    return NextResponse.json({ ok: false, error: "cette page existe déjà" }, { status: 409 });
  }
  pages.push({ slug, titre, description: (body.description || "").trim() });
  await ecrireIndex(pages);

  // Contenu de départ minimal (une section éditable) pour que la page rende.
  const starter = {
    page: slug,
    blocks: [
      {
        id: slug + "_sec",
        type: "section",
        css: { maxWidth: "1280px", margin: "0 auto", padding: "4rem 1.5rem" },
        children: [
          { id: slug + "_h", type: "titre", content: { niveau: 1, texte: titre }, css: { fontSize: "2.5rem", fontWeight: "600", color: "#eef4fc", margin: "0" } },
          { id: slug + "_p", type: "texte", content: { texte: "Nouvelle page — ajoute tes blocs depuis la palette." }, css: { color: "#9fb2cc", marginTop: "1rem" } },
        ],
      },
    ],
  };
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, "page-" + slug + ".json"), JSON.stringify(starter, null, 2), "utf8");
  await commitPush("Nouvelle page : " + slug);
  return NextResponse.json({ ok: true, slug, titre });
}

export async function DELETE(req: Request) {
  if (!codeAdminOk(req)) return NextResponse.json({ ok: false, error: "code admin requis" }, { status: 401 });
  let body: Corps;
  try {
    body = (await req.json()) as Corps;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }
  const slug = nettoyerSlug(body.slug || "");
  if (!slug || slug === "accueil") {
    return NextResponse.json({ ok: false, error: "page non supprimable" }, { status: 400 });
  }
  const pages = (await listerPages()).filter((p) => p.slug !== slug);
  await ecrireIndex(pages);
  try {
    await unlink(path.join(DIR, "page-" + slug + ".json"));
  } catch {
    /* déjà absent */
  }
  await commitPush("Suppression page : " + slug);
  return NextResponse.json({ ok: true });
}
