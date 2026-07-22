import { readFile } from "fs/promises";
import path from "path";
import type { Block } from "./types";
import { pageDemo } from "./defaults";

const GH_TOKEN = process.env.GITHUB_TOKEN;
// Dépôt de CE projet (piège OHIHO). Surchargeable par variables d'env.
const GH_REPO = process.env.GITHUB_REPO || "Valeloin/Mailys-solutions";
const GH_BRANCH = process.env.GITHUB_BRANCH || "main";

// Extrait les blocs d'un JSON de contenu, ou null si vide/cassé.
function blocsDepuisTexte(raw: string): Block[] | null {
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.blocks) && data.blocks.length > 0) return data.blocks as Block[];
  } catch {
    /* JSON cassé */
  }
  return null;
}

// Chemin du fichier de contenu d'une page dans le dépôt.
export function cheminPage(slug: string): string {
  return "content/page-" + slug + ".json";
}

async function lireDepuisGitHub(chemin: string): Promise<Block[] | null> {
  try {
    const url = `https://api.github.com/repos/${GH_REPO}/contents/${chemin}?ref=${GH_BRANCH}`;
    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github.raw",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "simple-dev",
      },
      cache: "no-store", // toujours la dernière version enregistrée
    });
    if (r.ok) return blocsDepuisTexte(await r.text());
  } catch {
    /* réseau / GitHub indispo */
  }
  return null;
}

async function lireDisque(chemin: string): Promise<Block[] | null> {
  try {
    return blocsDepuisTexte(await readFile(path.join(process.cwd(), chemin), "utf8"));
  } catch {
    return null;
  }
}

async function lire(chemin: string): Promise<Block[] | null> {
  return GH_TOKEN ? lireDepuisGitHub(chemin) : lireDisque(chemin);
}

// Lit le contenu d'une PAGE (slug). « accueil » = page d'accueil (avec repli sur
// l'ancien content/demo.json puis les défauts du code → jamais cassée). Autres
// pages : null si le fichier n'existe pas encore.
export async function getContent(slug: string = "accueil"): Promise<Block[] | null> {
  const nom = slug || "accueil";
  const blocs = await lire(cheminPage(nom));
  if (blocs) return blocs;
  if (nom === "accueil") {
    const ancien = await lire("content/demo.json"); // ancienne home
    return ancien || pageDemo.blocks; // filet anti-bug sur l'accueil
  }
  return null; // page inexistante
}
