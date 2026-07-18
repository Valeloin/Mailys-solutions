"use client";

import { useRef, useState } from "react";

// ============================================================
// Signalement de bug — bouton + modal de l'espace admin.
// Envoie vers /api/bugtrack (proxy serveur, cf. route.ts) qui
// relaie à BugTrack avec la session courante. 100% client pour
// l'UI, aucune donnée sensible (site_key) n'y transite.
// ============================================================

const SOFTWARE_OPTIONS = [
  "Site public — Accueil",
  "Site public — Services",
  "Site public — Blog",
  "Site public — Contact",
  "Site public — À propos",
  "Site public — Réalisations",
  "Admin — Contenus",
  "Admin — Articles",
  "Admin — Messages",
  "Admin — Couleurs",
  "Autre",
];

const PRIORITIES = ["Faible", "Moyen", "Élevé", "Bloquant"] as const;

type Status = "idle" | "submitting" | "success" | "error";

export default function BugReportButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function close() {
    setOpen(false);
    setStatus("idle");
    setErrorMsg("");
    setTicketId(null);
    formRef.current?.reset();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/bugtrack", { method: "POST", body: formData });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error || "inconnue");
      }
      setStatus("success");
      setTicketId(payload?.ticketId ? String(payload.ticketId) : null);
      setTimeout(close, 3000);
    } catch {
      setStatus("error");
      setErrorMsg(
        "Le bug n'a pas pu être envoyé à BugTrack. Vérifiez votre connexion et réessayez."
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
      >
        <span aria-hidden="true">🐛</span> Signaler un bug
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bugtrack-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-bordeaux/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && status !== "submitting") close();
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-window sm:p-8">
            <span
              aria-hidden="true"
              className="brand-hairline absolute inset-x-0 top-0 h-1 rounded-t-2xl"
            />

            {status === "success" ? (
              <div className="py-6 text-center">
                <p className="text-lg font-bold text-foreground">
                  Merci ! Votre bug a été signalé.
                </p>
                {ticketId && (
                  <p className="mt-2 text-sm text-muted">
                    Ticket <span className="font-semibold text-accent">#{ticketId}</span>
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h2 id="bugtrack-title" className="text-lg font-bold text-foreground">
                    Signaler un bug
                  </h2>
                  <button
                    type="button"
                    onClick={close}
                    disabled={status === "submitting"}
                    aria-label="Fermer"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <form ref={formRef} onSubmit={onSubmit} className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
                      Titre *
                    </span>
                    <input
                      type="text"
                      name="title"
                      required
                      maxLength={140}
                      placeholder="Ex : le bouton d'enregistrement ne répond pas"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
                      Description *
                    </span>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      maxLength={5000}
                      placeholder="Décrivez le problème : ce que vous avez fait, ce qui s'est passé, ce que vous attendiez."
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
                        Module concerné *
                      </span>
                      <select
                        name="software"
                        required
                        defaultValue=""
                        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
                      >
                        <option value="" disabled>
                          Choisir…
                        </option>
                        {SOFTWARE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
                        Priorité *
                      </span>
                      <select
                        name="priority"
                        required
                        defaultValue="Moyen"
                        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
                      Version (optionnel)
                    </span>
                    <input
                      type="text"
                      name="version"
                      maxLength={40}
                      placeholder="Ex : v1.2.0"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
                      Pièces jointes (optionnel)
                    </span>
                    <input
                      type="file"
                      name="attachments"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      className="w-full rounded-xl border border-dashed border-border bg-surface px-4 py-2.5 text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-accent"
                    />
                    <span className="mt-1 block text-xs text-muted">
                      5 fichiers max, 15 Mo chacun.
                    </span>
                  </label>

                  {status === "error" && (
                    <div
                      role="alert"
                      className="rounded-xl border-l-4 border-l-accent border border-border bg-background p-3.5"
                    >
                      <p className="text-sm font-semibold text-accent-dark">{errorMsg}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={close}
                      disabled={status === "submitting"}
                      className="btn-ghost rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {status === "submitting"
                        ? "Envoi…"
                        : status === "error"
                          ? "Réessayer"
                          : "Envoyer le signalement"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
