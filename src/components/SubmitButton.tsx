"use client";

import { useFormStatus } from "react-dom";

// ============================================================
// Bouton d'envoi d'un formulaire à action serveur.
//
// Aucun bouton du site ne se désactivait pendant l'envoi : deux clics
// rapides sur « Enregistrer » lançaient deux écritures. Selon la course,
// ça produisait un doublon, ou une erreur « slug déjà utilisé » qui
// désignait la première soumission de l'utilisateur lui-même.
//
// useFormStatus lit l'état du <form> parent : le composant doit donc
// être un enfant du formulaire, jamais celui qui le rend.
// ============================================================

export default function SubmitButton({
  children,
  pendingLabel,
  className = "btn-cta rounded-xl px-7 py-3 font-semibold text-white",
  formAction,
  formNoValidate,
}: {
  children: React.ReactNode;
  /** Libellé pendant l'envoi. Par défaut « Envoi… ». */
  pendingLabel?: string;
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  formNoValidate?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={formAction}
      formNoValidate={formNoValidate}
      disabled={pending}
      aria-busy={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? (pendingLabel ?? "Envoi…") : children}
    </button>
  );
}
