"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ATTACHMENT_TYPES,
  PRIORITIES,
  PRIORITY_LABELS,
  TITLE_MAX,
  attachmentError,
  validateReport,
  type ReportFields,
} from "@/lib/bugtrack";

// ============================================================
// Déclaration d'un ticket depuis l'espace client.
// Poste vers /api/espace-client/tickets : aucune clé BugTrack ne
// transite ici, et l'identifiant de l'utilisateur est ajouté par
// le serveur à partir de la session.
// ============================================================

const EMPTY: ReportFields = {
  title: "",
  description: "",
  software: "",
  version: "",
  priority: "moyen",
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground";

export default function ClientTicketForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<ReportFields>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [sending, setSending] = useState(false);
  const [created, setCreated] = useState<{ number: string } | null>(null);

  const openerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setFields(EMPTY);
    setFiles([]);
    setErrors({});
    setGlobalError("");
    setCreated(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, sending, close]);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  function set<K extends keyof ReportFields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const rejected = picked.map(attachmentError).filter(Boolean) as string[];
    setFiles(picked.filter((f) => !attachmentError(f)));
    setErrors((prev) => {
      const next = { ...prev };
      if (rejected.length > 0) next.attachments = rejected.join(" ");
      else delete next.attachments;
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const invalid = validateReport(fields);
    if (Object.keys(invalid).length > 0) {
      setErrors(invalid);
      return;
    }

    setSending(true);
    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => body.set(k, v));
    files.forEach((f) => body.append("attachments", f, f.name));

    try {
      const res = await fetch("/api/espace-client/tickets", {
        method: "POST",
        body,
      });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const details = payload?.details as
          | { field: string; message: string }[]
          | undefined;
        if (details?.length) {
          setErrors(Object.fromEntries(details.map((d) => [d.field, d.message])));
          setGlobalError(payload?.error || "");
        } else {
          setGlobalError(payload?.error || "Le ticket n'a pas pu être créé.");
        }
        return;
      }

      setCreated(payload.ticket);
      // La liste derrière la modale doit refléter le nouveau ticket.
      router.refresh();
    } catch {
      setGlobalError("Le service est injoignable. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
      >
        Créer un ticket
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-bordeaux/40 p-4 sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !sending) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-title"
            className="relative my-auto w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-window sm:p-8"
          >
            <span
              aria-hidden="true"
              className="brand-hairline absolute inset-x-0 top-0 h-1 rounded-t-2xl"
            />

            {created ? (
              <div className="py-4 text-center">
                <p className="text-lg font-bold text-foreground">
                  Votre ticket a bien été créé.
                </p>
                <p className="mt-3 text-sm text-muted">
                  Numéro{" "}
                  <span className="font-bold text-accent">{created.number}</span>{" "}
                  — nous revenons vers vous rapidement.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="btn-cta mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h2 id="ticket-title" className="text-lg font-bold text-foreground">
                    Déclarer un ticket
                  </h2>
                  <button
                    type="button"
                    onClick={close}
                    disabled={sending}
                    aria-label="Fermer"
                    className="rounded-lg px-1.5 text-muted transition-colors hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="ct-title">
                      Titre *
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="ct-title"
                      type="text"
                      value={fields.title}
                      onChange={(e) => set("title", e.target.value)}
                      maxLength={TITLE_MAX}
                      aria-invalid={!!errors.title}
                      placeholder="Ex : impossible de valider une commande"
                      className={fieldClass}
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs font-semibold text-accent-dark">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="ct-desc">
                      Description *
                    </label>
                    <textarea
                      id="ct-desc"
                      rows={4}
                      value={fields.description}
                      onChange={(e) => set("description", e.target.value)}
                      aria-invalid={!!errors.description}
                      placeholder="Ce que vous avez fait, ce qui s'est passé, ce que vous attendiez."
                      className={fieldClass}
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs font-semibold text-accent-dark">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="ct-software">
                        Application concernée *
                      </label>
                      <input
                        id="ct-software"
                        type="text"
                        value={fields.software}
                        onChange={(e) => set("software", e.target.value)}
                        aria-invalid={!!errors.software}
                        placeholder="Ex : gestion des devis"
                        className={fieldClass}
                      />
                      {errors.software && (
                        <p className="mt-1 text-xs font-semibold text-accent-dark">
                          {errors.software}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="ct-priority">
                        Priorité *
                      </label>
                      <select
                        id="ct-priority"
                        value={fields.priority}
                        onChange={(e) => set("priority", e.target.value)}
                        className={fieldClass}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {PRIORITY_LABELS[p]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="ct-version">
                      Version (optionnel)
                    </label>
                    <input
                      id="ct-version"
                      type="text"
                      value={fields.version}
                      onChange={(e) => set("version", e.target.value)}
                      placeholder="Ex : v1.2.0"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="ct-files">
                      Captures ou documents (optionnel)
                    </label>
                    <input
                      ref={fileInputRef}
                      id="ct-files"
                      type="file"
                      multiple
                      accept={ATTACHMENT_TYPES.join(",")}
                      onChange={onPickFiles}
                      className="w-full rounded-xl border border-dashed border-border bg-surface px-4 py-2.5 text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-accent"
                    />
                    <p className="mt-1 text-xs text-muted">
                      Images, vidéos, PDF, ZIP — 50 Mo par fichier.
                    </p>
                    {errors.attachments && (
                      <p className="mt-1 text-xs font-semibold text-accent-dark">
                        {errors.attachments}
                      </p>
                    )}
                  </div>

                  {globalError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-border border-l-4 border-l-accent bg-background p-3.5"
                    >
                      <p className="text-sm font-semibold text-accent-dark">
                        {globalError}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={close}
                      disabled={sending}
                      className="btn-ghost rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {sending ? "Envoi…" : globalError ? "Réessayer" : "Envoyer"}
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
