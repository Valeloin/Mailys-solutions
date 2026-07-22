import { readFile } from "fs/promises";
import path from "path";

// Une page du site : son adresse (slug), son titre et sa description (SEO).
export type PageInfo = { slug: string; titre: string; description?: string };

const FICHIER = "content/pages.json";

// Liste ordonnée des pages. Il y a TOUJOURS au moins « accueil » (la racine).
// (Phase de test : lecture disque. Le mode GitHub viendra au déploiement.)
export async function listerPages(): Promise<PageInfo[]> {
  let pages: PageInfo[] = [];
  try {
    const data = JSON.parse(await readFile(path.join(process.cwd(), FICHIER), "utf8"));
    if (Array.isArray(data)) pages = data.filter((p) => p && typeof p.slug === "string");
  } catch {
    /* pas encore d'index → on part de la seule page accueil */
  }
  if (!pages.some((p) => p.slug === "accueil")) {
    pages.unshift({ slug: "accueil", titre: "Accueil", description: "" });
  }
  return pages;
}

export async function infoPage(slug: string): Promise<PageInfo | undefined> {
  const s = slug || "accueil";
  return (await listerPages()).find((p) => p.slug === s);
}
