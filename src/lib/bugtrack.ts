// ============================================================
// BugTrack — contraintes partagées entre le formulaire (client)
// et la route serveur. Les mêmes règles sont appliquées des deux
// côtés : l'API BugTrack les fait respecter et rejette en 400
// toute saisie non conforme, autant les attraper avant l'envoi.
// Ce fichier ne lit AUCUNE variable d'environnement : il est
// importé par un composant client, la clé ne doit jamais y
// transiter (lecture réservée à la route serveur).
// ============================================================

/** Valeurs de priorité acceptées par l'API — minuscules, accentuées.
    Toute autre valeur est refusée. */
export const PRIORITIES = ["faible", "moyen", "élevé", "bloquant"] as const;
export type Priority = (typeof PRIORITIES)[number];

/** Libellés d'affichage (la valeur envoyée reste celle de PRIORITIES) */
export const PRIORITY_LABELS: Record<Priority, string> = {
  faible: "Faible",
  moyen: "Moyen",
  élevé: "Élevé",
  bloquant: "Bloquant",
};

export const TITLE_MIN = 5;
export const TITLE_MAX = 255;
export const DESCRIPTION_MIN = 10;

/** Limites des pièces jointes, alignées sur celles de l'API. */
export const ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024; // 50 Mo
export const ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/zip",
  "text/plain",
] as const;

/** Statuts renvoyés par BugTrack, dans l'ordre du cycle de vie. */
export const STATUSES = [
  "Nouveau",
  "En analyse",
  "En cours",
  "En attente d'informations",
  "Corrigé",
  "Livré",
  "Fermé",
] as const;

export type ReportFields = {
  title: string;
  description: string;
  software: string;
  version: string;
  priority: string;
};

/** Erreurs par champ, vide si la saisie est conforme. Mêmes règles
    que l'API pour éviter un aller-retour rejeté en 400. */
export function validateReport(fields: ReportFields): Record<string, string> {
  const errors: Record<string, string> = {};

  const title = fields.title.trim();
  if (title.length < TITLE_MIN) {
    errors.title = `Le titre doit contenir au moins ${TITLE_MIN} caractères.`;
  } else if (title.length > TITLE_MAX) {
    errors.title = `Le titre ne peut pas dépasser ${TITLE_MAX} caractères.`;
  }

  if (fields.description.trim().length < DESCRIPTION_MIN) {
    errors.description = `La description doit contenir au moins ${DESCRIPTION_MIN} caractères.`;
  }

  if (!fields.software.trim()) {
    errors.software = "Indiquez le logiciel ou le module concerné.";
  }

  if (!PRIORITIES.includes(fields.priority as Priority)) {
    errors.priority = "Choisissez une priorité.";
  }

  return errors;
}

/** Contrôle d'une pièce jointe — renvoie le motif de rejet, ou null. */
export function attachmentError(file: File): string | null {
  if (!ATTACHMENT_TYPES.includes(file.type as (typeof ATTACHMENT_TYPES)[number])) {
    return `« ${file.name} » : format non accepté.`;
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    return `« ${file.name} » : dépasse 50 Mo.`;
  }
  return null;
}
