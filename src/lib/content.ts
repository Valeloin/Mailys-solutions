import { cache } from "react";
import { getPublicClient } from "@/lib/supabase/public";

// ============================================================
// Lecture des contenus éditables.
// Principe : les textes du code sont les VALEURS PAR DÉFAUT ;
// la table site_sections ne stocke que les modifications faites
// dans l'admin. deepMerge superpose les modifications sur les
// défauts — si un champ n'a jamais été édité (ou si un nouveau
// champ apparaît dans le code), le défaut s'applique.
// Les lectures sont mémoïsées par rendu (React cache) : une
// même section n'est requêtée qu'une fois par page.
// ============================================================

/** Fusion profonde : les valeurs éditées écrasent les défauts.
    Tableaux : remplacés en bloc, mais chaque élément est validé
    contre le gabarit du défaut (base[0]) — un élément de type
    inattendu est écarté, un objet incomplet est complété par le
    gabarit. Une base malformée ne peut donc jamais faire
    planter une page publique. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    const tpl = (base as unknown[])[0];
    if (tpl === undefined) return override as T;
    const items = (override as unknown[])
      .filter(
        (o) =>
          o !== null &&
          o !== undefined &&
          typeof o === typeof tpl &&
          Array.isArray(o) === Array.isArray(tpl)
      )
      .map((o) => (tpl !== null && typeof tpl === "object" ? deepMerge(tpl, o) : o));
    return items as unknown as T;
  }
  if (base !== null && typeof base === "object") {
    if (typeof override !== "object" || Array.isArray(override)) return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(base as Record<string, unknown>)) {
      const o = (override as Record<string, unknown>)[key];
      if (o !== undefined) {
        out[key] = deepMerge((base as Record<string, unknown>)[key], o);
      }
    }
    return out as T;
  }
  return (typeof override === typeof base ? (override as T) : base);
}

/** Contenu d'une section : défauts du code + modifications en base. */
export const getSectionData = cache(
  async <T,>(key: string, fallback: T): Promise<T> => {
    const db = getPublicClient();
    if (!db) return fallback;
    const { data, error } = await db
      .from("site_sections")
      .select("data")
      .eq("key", key)
      .maybeSingle();
    if (error || !data?.data) return fallback;
    return deepMerge(fallback, data.data);
  }
);

/** Plusieurs sections en une requête (clé → data brut). */
export const getSectionsRaw = cache(
  async (keys: string[]): Promise<Record<string, unknown>> => {
    const db = getPublicClient();
    if (!db) return {};
    const { data, error } = await db
      .from("site_sections")
      .select("key,data")
      .in("key", keys);
    if (error || !data) return {};
    return Object.fromEntries(data.map((r) => [r.key, r.data]));
  }
);
