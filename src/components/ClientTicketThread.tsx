"use client";

import { useEffect, useRef, useState } from "react";
import type { BugtrackMessage } from "@/lib/bugtrack";

// ============================================================
// Fil de conversation d'un ticket, côté client.
// Les notes internes de l'équipe ne parviennent jamais ici :
// elles sont filtrées en base par BugTrack, elles ne transitent
// donc pas par le réseau.
// ============================================================

function formatMoment(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function ClientTicketThread({
  ticketId,
  initialMessages,
  closed,
}: {
  ticketId: string;
  initialMessages: BugtrackMessage[];
  closed: boolean;
}) {
  const [messages, setMessages] = useState<BugtrackMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // On suit le fil : à l'ajout d'un message, on descend jusqu'à lui.
  useEffect(() => {
    if (messages.length > initialMessages.length) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages.length, initialMessages.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = draft.trim();
    if (!message) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/espace-client/tickets/${ticketId}/thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setError(payload?.error || "Votre message n'a pas pu être envoyé.");
        return;
      }
      setMessages((m) => [...m, payload.message]);
      // Vidé seulement après succès : en cas d'échec, la saisie est conservée.
      setDraft("");
    } catch {
      setError("Le service est injoignable. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
        Échanges
      </h2>

      {messages.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted">
          Aucun échange pour le moment. Nous vous répondrons ici, et vous
          recevrez un email à chaque réponse.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {messages.map((m) => {
            const fromTeam = m.author_type === "admin";
            return (
              <li
                key={m.id}
                className={`rounded-2xl border p-4 ${
                  fromTeam
                    ? "border-orange/25 bg-orange/[0.06]"
                    : "border-border bg-background"
                }`}
              >
                <p className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                    {fromTeam ? "Mailys Solutions" : "Vous"}
                  </span>
                  <span className="text-xs text-muted">
                    {formatMoment(m.created_at)}
                  </span>
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {m.message}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <div ref={endRef} />

      {closed ? (
        <p className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          Ce ticket est clos. Pour un nouveau sujet, créez un ticket depuis
          votre espace — vous garderez ainsi un historique clair.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5">
          <label
            htmlFor="reponse"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground"
          >
            Répondre
          </label>
          <textarea
            id="reponse"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ajoutez une précision, une capture, ou répondez à notre question…"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/70 focus:border-coral focus:bg-background focus:ring-4 focus:ring-coral/15"
          />

          {error && (
            <p
              role="alert"
              className="mt-2 rounded-xl border border-border border-l-4 border-l-accent bg-background p-3 text-sm font-semibold text-accent-dark"
            >
              {error}
            </p>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="btn-cta rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {sending ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
