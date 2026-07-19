import { createBrowserClient } from "@supabase/ssr";

// ============================================================
// Client Supabase côté navigateur.
//
// Sert au seul cas où le serveur ne peut rien faire : les liens
// d'invitation et de réinitialisation renvoient le jeton dans le
// fragment d'URL (après le #), que le navigateur ne transmet
// jamais au serveur. Il faut donc le lire ici, puis poser la
// session — que ce client écrit dans les cookies, ce qui la rend
// ensuite visible du serveur et du middleware.
// ============================================================

export function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
