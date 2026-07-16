import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client Supabase « public » (clé anon, lecture seule via RLS).
// Retourne null si Supabase n'est pas configuré : chaque fonction
// du data layer bascule alors sur son contenu de secours — le site
// fonctionne toujours, avec ou sans base de données.
export function getPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
