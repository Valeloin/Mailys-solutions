import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { logoutClient } from "./actions";

export const metadata: Metadata = {
  title: "Votre espace client",
  robots: { index: false, follow: false },
};

// ============================================================
// Espace client — accueil.
// Phase 2 : la coque et l'authentification. Les tickets et leur
// conversation arrivent en phase 3.
// ============================================================

export default async function EspaceClientPage({
  searchParams,
}: {
  searchParams: Promise<{ bienvenue?: string }>;
}) {
  const { bienvenue } = await searchParams;

  // Le middleware garde déjà cette route ; on revérifie ici parce que
  // c'est cette page qui a besoin de l'identité, pas seulement d'un
  // feu vert donné ailleurs.
  const supabase = await getServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) redirect("/espace-client/connexion");

  return (
    <section className="sec sec-clean">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
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

        {bienvenue === "1" && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-orange/30 bg-orange/5 p-4 text-sm text-foreground"
          >
            Votre mot de passe est enregistré. Bienvenue dans votre espace.
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-dashed border-border bg-background p-8 text-center">
          <p className="font-semibold text-foreground">
            Vos tickets arrivent ici
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            La déclaration de tickets et le suivi de leur traitement seront
            disponibles très prochainement dans cet espace.
          </p>
        </div>
      </div>
    </section>
  );
}
