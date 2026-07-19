import { NextResponse, type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { getServerClient } from "@/lib/supabase/server";

// ============================================================
// Point d'atterrissage des liens envoyés par email : invitation
// à rejoindre l'espace client, et réinitialisation de mot de
// passe. Supabase renvoie ici après avoir vérifié le lien ;
// cette route échange le jeton contre une session (posée en
// cookie), puis dirige vers la page voulue.
//
// Deux formats de lien coexistent selon la configuration du
// projet Supabase — on accepte les deux plutôt que de dépendre
// d'un réglage distant.
// ============================================================

/** N'accepte qu'une destination interne : une URL absolue fournie
    dans le lien permettrait de rediriger la session ailleurs. */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/espace-client";
  }
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));

  const supabase = await getServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/espace-client/connexion?error=config`);
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Lien expiré, déjà utilisé, ou tronqué par le client mail.
  return NextResponse.redirect(`${origin}/espace-client/connexion?error=lien`);
}
