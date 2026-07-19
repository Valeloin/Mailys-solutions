"use client";

import Link from "next/link";
import { useEffect } from "react";

// Frontière d'erreur de l'espace client.
//
// Sans elle, une exception remontait à la page 404 globale, hors de la
// coque à onglets : le client se retrouvait éjecté de son espace, sans
// moyen de réessayer ni de savoir si le problème venait de lui.
//
// Elle reste DANS la coque : les onglets restent accessibles, seule la
// zone de contenu porte l'incident.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Espace client :", error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-border bg-background p-8 text-center">
      <h2 className="text-lg font-bold text-foreground">
        Cette page n&apos;a pas pu être chargée
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        L&apos;incident vient de chez nous, pas de vous. Vos tickets et vos
        échanges sont intacts — seul leur affichage a échoué.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="btn-cta rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
        >
          Réessayer
        </button>
        <Link
          href="/contact"
          className="rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-coral"
        >
          Nous signaler le problème
        </Link>
      </div>
    </div>
  );
}
