"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";

// ============================================================
// Atterrissage des liens envoyés par email (invitation,
// réinitialisation).
//
// Pourquoi une page et non une route serveur : selon la
// configuration du projet, Supabase renvoie le jeton soit en
// paramètre (?code=), soit dans le fragment (#access_token=).
// Un fragment n'est jamais transmis au serveur — seul le
// navigateur le voit. Cette page traite les deux cas, pose la
// session dans les cookies, puis recharge complètement la page
// pour que le serveur et le middleware la voient à leur tour.
// ============================================================

/** N'accepte qu'une destination interne : une URL absolue passée
    dans le lien permettrait de détourner la session ailleurs. */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/espace-client";
  }
  return raw;
}

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Vérification de votre lien…");

  useEffect(() => {
    const run = async () => {
      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const next = safeNext(query.get("next"));

      const fail = (raison: string) => {
        window.location.replace(`/espace-client/connexion?error=${raison}`);
      };

      // Supabase signale parfois l'échec dans le fragment plutôt
      // qu'en paramètre (lien expiré, déjà consommé).
      if (hash.get("error") || query.get("error")) {
        fail("lien");
        return;
      }

      const supabase = getBrowserClient();

      try {
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        const code = query.get("code");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) return fail("lien");
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) return fail("lien");
        } else {
          return fail("lien");
        }
      } catch {
        return fail("lien");
      }

      setMessage("Connexion en cours…");
      // Rechargement complet plutôt qu'une navigation interne : les
      // cookies fraîchement posés doivent accompagner la requête pour
      // que le middleware laisse passer.
      window.location.replace(next);
    };

    run();
  }, []);

  return (
    <section className="sec sec-clean">
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div aria-hidden="true" className="mx-auto mb-5 flex justify-center gap-1.5">
          <span className="pv-dot h-2.5 w-2.5 rounded-full bg-orange" />
          <span
            className="pv-dot h-2.5 w-2.5 rounded-full bg-coral"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
        <p role="status" className="text-sm font-medium text-muted">
          {message}
        </p>
      </div>
    </section>
  );
}
