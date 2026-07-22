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

// Sur Vercel : lit content/demo.json DEPUIS GitHub (le disque n'est pas fiable).
async function lireDepuisGitHub(): Promise<Block[] | null> {
  try {
    const url = `https://api.github.com/repos/${GH_REPO}/contents/content/demo.json?ref=${GH_BRANCH}`;
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

// Lit le contenu enregistré. Si rien ou cassé, on retombe sur les défauts du
// code → le site n'est JAMAIS cassé.
export async function getContent(): Promise<Block[]> {
  if (GH_TOKEN) {
    const blocs = await lireDepuisGitHub();
    if (blocs) return blocs;
    return pageDemo.blocks;
  }
  try {
    const file = path.join(process.cwd(), "content", "demo.json");
    const blocs = blocsDepuisTexte(await readFile(file, "utf8"));
    if (blocs) return blocs;
  } catch {
    /* pas de fichier / JSON invalide → défauts */
  }
  return pageDemo.blocks;
}
