import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { logoutClient } from "../actions";
import EspaceClientTabs from "@/components/EspaceClientTabs";

// ============================================================
// Coque des pages internes de l'espace client.
//
// Le groupe (interne) la cantonne aux pages accessibles une fois
// connecté : la page de connexion et celle du choix de mot de
// passe restent en dehors, sans onglets — on n'y est pas encore
// « dans » l'espace.
//
// La session est vérifiée ici plutôt que dans chaque page : le
// middleware garde déjà ces routes, mais ce layout a besoin de
// l'identité pour l'afficher.
// ============================================================

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect("/espace-client/connexion");

  return (
    <section className="sec sec-clean min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Votre espace client
            </h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <form action={logoutClient}>
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
            >
              Se déconnecter
            </button>
          </form>
        </div>

        <EspaceClientTabs />

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
