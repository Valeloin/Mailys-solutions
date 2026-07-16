import { cache } from "react";
import { getPublicClient } from "@/lib/supabase/public";

// Couleurs éditables depuis l'admin. Les valeurs par défaut sont
// celles de globals.css : sans ligne en base (ou sans Supabase),
// rien n'est injecté et la palette du CSS s'applique telle quelle.
// --orange-text n'est volontairement PAS éditable : c'est le token
// de contraste AA, le modifier casserait l'accessibilité.

/** clé → { label admin, variable CSS, mode } */
export const EDITABLE_COLORS: {
  key: string;
  label: string;
  cssVar: string;
  /** channels: la variable attend « r g b » ; hex: valeur directe */
  mode: "channels" | "hex";
  defaultHex: string;
}[] = [
  { key: "accent", label: "Rouge (boutons, liens)", cssVar: "--accent", mode: "channels", defaultHex: "#e11d2a" },
  { key: "accent_dark", label: "Rouge foncé (survol)", cssVar: "--accent-dark", mode: "channels", defaultHex: "#b9121f" },
  { key: "bordeaux", label: "Bordeaux (titres)", cssVar: "--bordeaux", mode: "channels", defaultHex: "#5b0f1a" },
  { key: "coral", label: "Corail (accents doux)", cssVar: "--coral", mode: "channels", defaultHex: "#ff6b6b" },
  { key: "orange", label: "Orange (détails)", cssVar: "--orange", mode: "channels", defaultHex: "#f97316" },
  { key: "background", label: "Fond de page", cssVar: "--background", mode: "hex", defaultHex: "#ffffff" },
  { key: "surface", label: "Fond des sections douces", cssVar: "--surface", mode: "hex", defaultHex: "#fbf6f4" },
];

export function hexToChannels(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export const getStoredColors = cache(
  async (): Promise<Record<string, string>> => {
    const db = getPublicClient();
    if (!db) return {};
    const { data, error } = await db.from("site_colors").select("key,value");
    if (error || !data) return {};
    return Object.fromEntries(data.map((r) => [r.key, r.value]));
  }
);

/** CSS d'écrasement des variables :root, ou null si rien à écraser. */
export async function getColorOverridesCss(): Promise<string | null> {
  const stored = await getStoredColors();
  const lines: string[] = [];
  for (const c of EDITABLE_COLORS) {
    const hex = stored[c.key];
    if (!hex || hex.toLowerCase() === c.defaultHex) continue;
    if (c.mode === "channels") {
      const channels = hexToChannels(hex);
      if (channels) lines.push(`${c.cssVar}: ${channels};`);
    } else if (/^#[0-9a-f]{6}$/i.test(hex)) {
      lines.push(`${c.cssVar}: ${hex};`);
    }
  }
  if (lines.length === 0) return null;
  return `:root{${lines.join("")}}`;
}
