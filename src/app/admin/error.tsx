"use client";

import { useEffect } from "react";

// Frontière d'erreur du back-office.
//
// Une erreur Supabase remontait à la frontière globale de Next : écran
// générique, sans le contexte ni le moyen de réessayer. Ici l'incident
// reste dans l'admin, avec le motif technique sous la main — c'est le
// propriétaire du site qui lit cet écran, pas un visiteur.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin :", error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
      <h2 className="font-bold text-foreground">
        Cette page n&apos;a pas pu être chargée
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Rien n&apos;a été modifié. Si l&apos;erreur persiste, vérifiez que les
        variables Supabase sont renseignées et que le service répond.
      </p>

      {error.message && (
        <p className="mt-3 rounded-lg border border-border bg-background p-3 font-mono text-xs text-muted">
          {error.message}
          {error.digest ? ` (${error.digest})` : ""}
        </p>
      )}

      <button
        type="button"
        onClick={reset}
        className="btn-cta mt-5 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
      >
        Réessayer
      </button>
    </div>
  );
}
