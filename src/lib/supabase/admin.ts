import { createClient } from "@supabase/supabase-js";

// ============================================================
// Client Supabase à privilèges d'administration (clé de service).
//
// ⚠️ Serveur uniquement. Cette clé contourne la RLS : si elle
// atteignait le navigateur, n'importe qui pourrait lire et
// modifier toute la base. Elle n'est donc jamais préfixée
// NEXT_PUBLIC_, et ce module refuse de s'exécuter côté client.
//
// Sert exclusivement à gérer les accès clients (inviter,
// suspendre, lister) — opérations que la clé publique ne peut
// pas faire.
// ============================================================

export function getAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "getAdminClient() a été appelé côté navigateur : la clé de service ne doit jamais y parvenir."
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Vrai si la gestion des accès clients est utilisable. */
export function isAdminClientConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
