"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
// Signalement de bug — bouton + modale de l'espace admin.
// Poste vers /api/bugtrack (proxy serveur) : aucune clé BugTrack
// ne transite ici. La saisie est conservée en cas d'erreur, et
// les messages renvoyés par l'API sont affichés champ par champ.
// ============================================================

/** Suggestions de modules — le champ reste en saisie libre. */
const MODULES = [
  "Site public — Accueil",
  "Site public — Services",
  "Site public — Blog",
  "Site public — Contact",
  "Site public — À propos",
  "Admin — Contenus",
  "Admin — Articles",
  "Admin — Messages",
  "Admin — Couleurs",
];

const EMPTY: ReportFields = {
  title: "",
  description: "",
  software: "",
  version: "",
  priority: "moyen",
};

type Ticket = { id: string; number: string; status: string };
type HistoryTicket = {
  id: string;
  number: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15";
const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground";

export default function BugReportButton() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<ReportFields>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [partial, setPartial] = useState<string[]>([]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryTicket[] | null>(null);
  const [historyError, setHistoryError] = useState("");

  // Rattachée au <body>, pour la même raison que ClientTicketForm : une
  // section porteuse d'`isolation: isolate` enfermerait le voile dans son
  // contexte d'empilement. La coque d'admin n'en a pas aujourd'hui, mais
  // le composant ne doit pas dépendre de l'endroit où on le place.
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);

  const openerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setFields(EMPTY);
    setFiles([]);
    setErrors({});
    setGlobalError("");
    setTicket(null);
    setPartial([]);
    setHistoryOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    openerRef.current?.focus();
  }, []);

  // Fermeture au clavier — la modale doit rester utilisable sans souris.
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
    // L'erreur d'un champ disparaît dès qu'on le corrige.
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
    const accepted = picked.filter((f) => !attachmentError(f));
    setFiles(accepted);
    setErrors((prev) => {
      const next = { ...prev };
      if (rejected.length > 0) next.attachments = rejected.join(" ");
      else delete next.attachments;
      return next;
    });
  }

  async function loadHistory() {
    setHistoryError("");
    try {
      const res = await fetch("/api/bugtrack");
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || "");
      setHistory(body.tickets ?? []);
    } catch {
      setHistoryError("Historique indisponible pour le moment.");
    }
  }

  function toggleHistory() {
    const next = !historyOpen;
    setHistoryOpen(next);
    if (next && history === null) loadHistory();
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
    body.set("title", fields.title);
    body.set("description", fields.description);
    body.set("software", fields.software);
    body.set("version", fields.version);
    body.set("priority", fields.priority);
    files.forEach((f) => body.append("attachments", f, f.name));

    try {
      const res = await fetch("/api/bugtrack", { method: "POST", body });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        // 400 : messages par champ, déjà en français côté API.
        const details = payload?.details as
          | { field: string; message: string }[]
          | undefined;
        if (details?.length) {
          setErrors(
            Object.fromEntries(details.map((d) => [d.field, d.message]))
          );
          setGlobalError(payload?.error || "");
        } else {
          setGlobalError(
            payload?.error || "Le signalement n'a pas pu être envoyé."
          );
        }
        return;
      }

      setTicket(payload.ticket);
      setPartial(payload.attachmentsFailed ?? []);
      // L'historique n'est plus à jour.
      setHistory(null);
    } catch {
      setGlobalError(
        "BugTrack est injoignable. Vérifiez votre connexion et réessayez."
      );
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
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
      >
        <span aria-hidden="true">🐛</span> Signaler un bug
      </button>

      {open && monte && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-bordeaux/40 p-4 sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !sending) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bugtrack-title"
            className="relative my-auto w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-window sm:p-8"
          >
            {ticket ? (
              /* ---------- Confirmation ---------- */
              <div className="py-4 text-center">
                <p className="text-lg font-bold text-foreground">
                  Merci, votre signalement a bien été enregistré.
                </p>
                <p className="mt-3 text-sm text-muted">
                  Ticket{" "}
                  <span className="font-bold text-accent">{ticket.number}</span>{" "}
                  — statut{" "}
                  <span className="font-semibold text-foreground">
                    {ticket.status}
                  </span>
                </p>
                {partial.length > 0 && (
                  <p className="mt-4 rounded-xl border border-orange/30 bg-orange/5 p-3 text-sm text-foreground">
                    Le ticket est bien créé, mais {partial.length} pièce
                    {partial.length > 1 ? "s" : ""} jointe
                    {partial.length > 1 ? "s" : ""} n&apos;
                    {partial.length > 1 ? "ont" : "a"} pas pu être envoyée
                    {partial.length > 1 ? "s" : ""} : {partial.join(", ")}.
                  </p>
                )}
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
                  <h2
                    id="bugtrack-title"
                    className="text-lg font-bold text-foreground"
                  >
                    Signaler un bug
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
                    <label className={labelClass} htmlFor="bt-title">
                      Titre *
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="bt-title"
                      type="text"
                      value={fields.title}
                      onChange={(e) => set("title", e.target.value)}
                      maxLength={TITLE_MAX}
                      aria-invalid={!!errors.title}
                      aria-describedby={errors.title ? "bt-title-err" : undefined}
                      placeholder="Ex : le bouton d'enregistrement ne répond pas"
                      className={fieldClass}
                    />
                    {errors.title && (
                      <p id="bt-title-err" className="mt-1 text-xs font-semibold text-accent-dark">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="bt-desc">
                      Description *
                    </label>
                    <textarea
                      id="bt-desc"
                      rows={4}
                      value={fields.description}
                      onChange={(e) => set("description", e.target.value)}
                      aria-invalid={!!errors.description}
                      aria-describedby={errors.description ? "bt-desc-err" : undefined}
                      placeholder="Ce que vous avez fait, ce qui s'est passé, ce que vous attendiez."
                      className={fieldClass}
                    />
                    {errors.description && (
                      <p id="bt-desc-err" className="mt-1 text-xs font-semibold text-accent-dark">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="bt-software">
                        Logiciel / module *
                      </label>
                      <input
                        id="bt-software"
                        type="text"
                        list="bt-modules"
                        value={fields.software}
                        onChange={(e) => set("software", e.target.value)}
                        aria-invalid={!!errors.software}
                        aria-describedby={errors.software ? "bt-software-err" : undefined}
                        placeholder="Ex : Admin — Articles"
                        className={fieldClass}
                      />
                      <datalist id="bt-modules">
                        {MODULES.map((m) => (
                          <option key={m} value={m} />
                        ))}
                      </datalist>
                      {errors.software && (
                        <p id="bt-software-err" className="mt-1 text-xs font-semibold text-accent-dark">
                          {errors.software}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="bt-priority">
                        Priorité *
                      </label>
                      <select
                        id="bt-priority"
                        value={fields.priority}
                        onChange={(e) => set("priority", e.target.value)}
                        aria-invalid={!!errors.priority}
                        className={fieldClass}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {PRIORITY_LABELS[p]}
                          </option>
                        ))}
                      </select>
                      {errors.priority && (
                        <p className="mt-1 text-xs font-semibold text-accent-dark">
                          {errors.priority}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="bt-version">
                      Version (optionnel)
                    </label>
                    <input
                      id="bt-version"
                      type="text"
                      value={fields.version}
                      onChange={(e) => set("version", e.target.value)}
                      placeholder="Ex : v1.2.0"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="bt-files">
                      Pièces jointes (optionnel)
                    </label>
                    <input
                      ref={fileInputRef}
                      id="bt-files"
                      type="file"
                      multiple
                      accept={ATTACHMENT_TYPES.join(",")}
                      onChange={onPickFiles}
                      className="w-full rounded-xl border border-dashed border-border bg-surface px-4 py-2.5 text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-accent"
                    />
                    <p className="mt-1 text-xs text-muted">
                      Images, vidéos MP4/WebM, PDF, ZIP, texte — 50 Mo par fichier.
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

                  <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={toggleHistory}
                      className="text-left text-xs font-semibold text-muted underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {historyOpen ? "Masquer" : "Voir"} mes signalements
                    </button>
                    <div className="flex items-center justify-end gap-3">
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
                  </div>
                </form>

                {historyOpen && (
                  <div className="mt-5 border-t border-border pt-5">
                    {historyError ? (
                      <p className="text-sm text-muted">{historyError}</p>
                    ) : history === null ? (
                      <p className="text-sm text-muted">Chargement…</p>
                    ) : history.length === 0 ? (
                      <p className="text-sm text-muted">
                        Aucun signalement pour le moment.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {history.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface px-3.5 py-2.5"
                          >
                            <span className="min-w-0">
                              <span className="text-xs font-bold text-accent">
                                {t.number}
                              </span>{" "}
                              <span className="text-sm text-foreground">
                                {t.title}
                              </span>
                            </span>
                            <span className="shrink-0 rounded-full bg-orange/10 px-2.5 py-1 text-xs font-semibold text-orange-text">
                              {t.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
