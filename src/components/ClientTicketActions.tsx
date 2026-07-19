"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ============================================================
// Les deux transitions que le client peut déclencher lui-même.
//
// Chacune n'est proposée que depuis le statut d'où l'API l'accepte :
// clôturer depuis « Livré », rouvrir depuis « Clos ». Le 409 reste
// traité malgré tout — le statut a pu changer côté BugTrack depuis
// l'affichage de la page — mais il recharge au lieu de s'afficher :
// ce conflit est un décalage d'affichage, pas une erreur du client.
// ============================================================

type Action = "close" | "reopen";

export default function ClientTicketActions({
  ticketId,
  action,
}: {
  ticketId: string;
  action: Action;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [motif, setMotif] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/espace-client/tickets/${ticketId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "reopen" ? { message: motif } : {}),
      });

      if (res.status === 409) {
        router.refresh();
        return;
      }

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.error || "L'opération n'a pas pu aboutir.");
        return;
      }

      setConfirming(false);
      setMotif("");
      router.refresh();
    } catch {
      setError("Le service est injoignable. Réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  }

  const libelle =
    action === "close" ? "Le problème est résolu" : "Rouvrir ce ticket";

  if (!confirming) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={
            action === "close"
              ? "btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              : "rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          }
        >
          {libelle}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-foreground">
        {action === "close"
          ? "Confirmez-vous que la correction vous convient ?"
          : "Pourquoi rouvrez-vous ce ticket ?"}
      </p>
      <p className="mt-1 text-sm text-muted">
        {action === "close"
          ? "Le ticket sera clos. Vous pourrez le rouvrir si le problème revient."
          : "Votre motif rejoint la conversation : sans lui, nous savons que vous avez relancé, pas ce qui ne va pas."}
      </p>

      {action === "reopen" && (
        <>
        <label htmlFor="motif-reouverture" className="sr-only">
          Motif de la réouverture
        </label>
        <textarea
          id="motif-reouverture"
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder="Le problème est réapparu quand…"
          className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
        />
        </>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-border border-l-4 border-l-accent bg-background p-3 text-sm font-semibold text-accent-dark"
        >
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            setError("");
          }}
          disabled={busy}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy
            ? "En cours…"
            : action === "close"
              ? "Oui, clôturer"
              : "Rouvrir le ticket"}
        </button>
      </div>
    </div>
  );
}
