import { readFile, writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const pexec = promisify(exec);

const RACINE = process.cwd();
const DIR_CONTENU = path.join(RACINE, "content");
const FICHIER = path.join(DIR_CONTENU, "demo.json");
const DIR_SNAP = path.join(DIR_CONTENU, "snapshots");
const MAX_AUTO = 10; // on garde les 10 derniers snapshots automatiques

// ---- Où tourne-t-on ? -------------------------------------------------------
// En LOCAL : pas de jeton → on écrit sur le disque puis `git push` (rapide).
// Sur VERCEL : un jeton GitHub est fourni → le disque est en lecture seule, donc
// on envoie le contenu directement à GitHub par son API (ça fait un commit).
const GH_TOKEN = process.env.GITHUB_TOKEN;
// Dépôt de CE projet (piège OHIHO). Surchargeable par variables d'env.
const GH_REPO = process.env.GITHUB_REPO || "Valeloin/Mailys-solutions";
const GH_BRANCH = process.env.GITHUB_BRANCH || "main";
const SUR_GITHUB = !!GH_TOKEN;

const CHEMIN_CONTENU = "content/demo.json"; // chemin du fichier DANS le dépôt

// Contrôle du code admin. Envoyé par l'extension dans l'en-tête `x-sd-code`.
// En LOCAL sans variable ADMIN_CODE → ouvert (pas de gêne en dev).
// Sur VERCEL avec ADMIN_CODE défini → toute écriture exige le bon code.
export function codeAdminOk(req: Request): boolean {
  const attendu = process.env.ADMIN_CODE;
  if (!attendu) return true;
  return (req.headers.get("x-sd-code") || "") === attendu;
}

// ---- API GitHub (utilisée seulement quand un jeton est présent) -------------
function entetesGitHub() {
  return {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "simple-dev",
  };
}

// Récupère le sha actuel d'un fichier du dépôt (null s'il n'existe pas encore).
async function shaGitHub(chemin: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${GH_REPO}/contents/${chemin}?ref=${GH_BRANCH}`;
  const r = await fetch(url, { headers: entetesGitHub() });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("GitHub (lecture) " + r.status + " : " + (await r.text()).slice(0, 200));
  const j = (await r.json()) as { sha?: string };
  return j.sha ?? null;
}

// Crée / met à jour un fichier du dépôt (= un commit).
async function ecrireGitHub(chemin: string, texte: string, message: string) {
  const sha = await shaGitHub(chemin);
  const contenu64 = Buffer.from(texte, "utf8").toString("base64");
  const r = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${chemin}`, {
    method: "PUT",
    headers: { ...entetesGitHub(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: contenu64, branch: GH_BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!r.ok) throw new Error("GitHub (écriture) " + r.status + " : " + (await r.text()).slice(0, 200));
}

// Supprime un fichier du dépôt (pour le reset). Ne fait rien s'il est déjà absent.
async function supprimerGitHub(chemin: string, message: string) {
  const sha = await shaGitHub(chemin);
  if (!sha) return;
  const r = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${chemin}`, {
    method: "DELETE",
    headers: { ...entetesGitHub(), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: GH_BRANCH }),
  });
  if (!r.ok) throw new Error("GitHub (suppression) " + r.status + " : " + (await r.text()).slice(0, 200));
}

// ---- Écriture du contenu d'une PAGE (content/page-<slug>.json) ---------------
export async function ecrireContenu(blocks: unknown, horodatage: string, message?: string, slug: string = "accueil") {
  const nom = slug || "accueil";
  const chemin = "content/page-" + nom + ".json";
  const texte = JSON.stringify({ page: nom, blocks, updatedAt: horodatage }, null, 2);
  if (SUR_GITHUB) {
    await ecrireGitHub(chemin, texte, message || "Enregistrement graphique " + horodatage);
    return;
  }
  await mkdir(DIR_CONTENU, { recursive: true });
  await writeFile(path.join(DIR_CONTENU, "page-" + nom + ".json"), texte, "utf8");
}

// Supprime le contenu → le site retombe sur les défauts du code (reset total).
export async function resetContenu() {
  if (SUR_GITHUB) {
    await supprimerGitHub(CHEMIN_CONTENU, "Reset aux valeurs d'origine");
    return;
  }
  try {
    await unlink(FICHIER);
  } catch {
    /* déjà absent */
  }
}

// Crée un snapshot (nom = null → snapshot automatique, sinon point nommé).
// Sur Vercel (mode GitHub), les backups restent locaux : on ne fait rien ici,
// c'est l'historique GitHub qui sert de versionnage.
export async function ecrireSnapshot(blocks: unknown, nom: string | null, horodatage: string) {
  if (SUR_GITHUB) return String(Date.now());
  await mkdir(DIR_SNAP, { recursive: true });
  const id = String(Date.now());
  await writeFile(
    path.join(DIR_SNAP, id + ".json"),
    JSON.stringify({ id, nom, date: horodatage, blocks }, null, 2),
    "utf8"
  );
  await prune();
  return id;
}

type Meta = { id: string; nom: string | null; date: string; fichier: string };

async function tous(): Promise<Meta[]> {
  let fichiers: string[] = [];
  try {
    fichiers = (await readdir(DIR_SNAP)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const items: Meta[] = [];
  for (const f of fichiers) {
    try {
      const d = JSON.parse(await readFile(path.join(DIR_SNAP, f), "utf8"));
      items.push({ id: d.id || f.replace(/\.json$/, ""), nom: d.nom || null, date: d.date || "", fichier: f });
    } catch {
      /* fichier cassé → ignoré */
    }
  }
  items.sort((a, b) => (a.id < b.id ? 1 : -1)); // le plus récent d'abord
  return items;
}

// On garde tous les points NOMMÉS + les MAX_AUTO derniers automatiques.
async function prune() {
  const auto = (await tous()).filter((i) => !i.nom);
  for (const vieux of auto.slice(MAX_AUTO)) {
    try {
      await unlink(path.join(DIR_SNAP, vieux.fichier));
    } catch {
      /* rien */
    }
  }
}

export async function listerSnapshots() {
  return (await tous()).map(({ id, nom, date }) => ({ id, nom, date }));
}

export async function lireSnapshot(id: string): Promise<unknown> {
  const safe = id.replace(/[^0-9]/g, ""); // l'id est un timestamp numérique
  const d = JSON.parse(await readFile(path.join(DIR_SNAP, safe + ".json"), "utf8"));
  return d.blocks;
}

// Commit + push sur GitHub.
// - Sur Vercel (mode GitHub) : rien à faire, `ecrireContenu` a déjà commité via l'API.
// - En local : on ne stage QUE le dossier content/ (jamais le code).
export async function commitPush(message: string) {
  if (SUR_GITHUB) return { committed: true, pushed: true, note: "via API GitHub" };
  let committed = false;
  const pushed = false; // phase de test : pas de push automatique
  let note = "";
  try {
    await pexec("git add content", { cwd: RACINE });
    await pexec('git commit -m "' + message.replace(/"/g, "'") + '"', { cwd: RACINE });
    committed = true;
    // Phase de test dans OHIHO : on enregistre en LOCAL sur la branche courante,
    // sans push automatique (la branche sera poussée à la main quand ce sera prêt).
    note = "enregistré (branche de test, local)";
  } catch (e) {
    const msg = String((e as { stderr?: string }).stderr || e);
    note = /nothing to commit/i.test(msg) ? "aucun changement" : msg.slice(0, 300);
  }
  return { committed, pushed, note };
}
