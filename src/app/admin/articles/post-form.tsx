"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import { savePost, deletePost } from "../actions";
import SubmitButton from "@/components/SubmitButton";

// Formulaire article (création + édition).
//
// Composant client pour trois raisons, toutes des pertes de travail :
//  - l'erreur de validation ne redirige plus (elle vidait le formulaire) ;
//  - un brouillon local survit à une coupure, une session expirée, une
//    fermeture d'onglet ;
//  - la suppression demande une confirmation, alors qu'elle était le
//    dernier élément focusable juste après « Enregistrer ».

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/30";

const ERRORS: Record<string, string> = {
  titre: "Le titre est obligatoire.",
  slug: "Impossible de générer une URL valide à partir de ce titre.",
  "slug-pris": "Cette URL (slug) est déjà utilisée par un autre article.",
  sauvegarde: "Erreur lors de l'enregistrement. Réessayez.",
};

/** Champs conservés dans le brouillon local. */
const DRAFT_FIELDS = [
  "title",
  "excerpt",
  "content",
  "cover_url",
  "slug",
  "meta_title",
  "meta_description",
] as const;

type Draft = Partial<Record<(typeof DRAFT_FIELDS)[number], string>> & {
  at?: number;
};

function draftKey(id?: string) {
  return `draft:post:${id ?? "nouveau"}`;
}

/** « il y a 4 min » — pour situer le brouillon retrouvé. */
function ilYA(at: number): string {
  const min = Math.round((Date.now() - at) / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`;
}

export default function PostForm({
  post,
  error,
}: {
  post?: BlogPost;
  error?: string;
}) {
  const [state, formAction] = useActionState(savePost, { error });
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [publie, setPublie] = useState(post?.published ?? false);

  const message = state.error ? (ERRORS[state.error] ?? ERRORS.sauvegarde) : null;

  // L'erreur peut apparaître à deux écrans de hauteur du bouton : on
  // l'amène dans le champ de vision plutôt que de la laisser hors écran.
  useEffect(() => {
    if (message) alertRef.current?.scrollIntoView({ block: "center" });
  }, [message]);

  // ---------- Brouillon local ----------

  // Au montage : un brouillon plus récent que la base ? On le propose,
  // sans l'imposer — écraser d'office serait une seconde perte possible.
  useEffect(() => {
    try {
      const brut = localStorage.getItem(draftKey(post?.id));
      if (!brut) return;
      const d = JSON.parse(brut) as Draft;
      // Si le brouillon dit la même chose que le formulaire, il n'a rien
      // à apporter — c'est le cas juste après un enregistrement réussi.
      const identique = DRAFT_FIELDS.every(
        (f) => (d[f] ?? "") === ((post?.[f as keyof BlogPost] as string) ?? "")
      );
      if (!identique) setDraft(d);
    } catch {
      // Brouillon illisible : on l'ignore, il ne doit rien bloquer.
    }
  }, [post]);

  function enregistrerBrouillon() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const d: Draft = { at: Date.now() };
    for (const f of DRAFT_FIELDS) d[f] = String(data.get(f) ?? "");
    try {
      localStorage.setItem(draftKey(post?.id), JSON.stringify(d));
    } catch {
      // Quota plein ou stockage refusé : tant pis, ce n'est qu'un filet.
    }
  }

  // Frappe → brouillon, avec un délai pour ne pas écrire à chaque touche.
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(enregistrerBrouillon, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  // Fermeture d'onglet ou rechargement avec des modifications en cours.
  useEffect(() => {
    if (!dirty) return;
    const garde = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", garde);
    return () => window.removeEventListener("beforeunload", garde);
  }, [dirty]);

  function restaurerBrouillon() {
    const form = formRef.current;
    if (!form || !draft) return;
    for (const f of DRAFT_FIELDS) {
      const champ = form.elements.namedItem(f) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (champ && draft[f] !== undefined) champ.value = draft[f]!;
    }
    setDraft(null);
    setDirty(true);
  }

  function ignorerBrouillon() {
    try {
      localStorage.removeItem(draftKey(post?.id));
    } catch {}
    setDraft(null);
  }

  const publicationChange = publie !== (post?.published ?? false);

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        onInput={() => setDirty(true)}
        className="mt-6 space-y-6"
      >
        {post && <input type="hidden" name="id" value={post.id} />}

        {message && (
          <p
            ref={alertRef}
            role="alert"
            className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm font-semibold text-accent-dark"
          >
            {message} Votre saisie est conservée.
          </p>
        )}

        {draft && (
          <div className="rounded-lg border border-orange/30 bg-orange/[0.07] p-3 text-sm">
            <p className="font-semibold text-foreground">
              Un brouillon non enregistré existe pour cet article
              {draft.at ? ` (${ilYA(draft.at)})` : ""}.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={restaurerBrouillon}
                className="font-semibold text-accent-dark underline underline-offset-2"
              >
                Restaurer le brouillon
              </button>
              <button
                type="button"
                onClick={ignorerBrouillon}
                className="font-semibold text-muted underline-offset-2 hover:underline"
              >
                Ignorer
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-bold text-foreground">Contenu</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">
              Titre de l&apos;article *
              <input
                type="text"
                name="title"
                required
                maxLength={150}
                defaultValue={post?.title ?? ""}
                placeholder="Ex. : Combien coûte une application métier sur mesure ?"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Résumé (affiché dans la liste des articles)
              <textarea
                name="excerpt"
                rows={2}
                maxLength={300}
                defaultValue={post?.excerpt ?? ""}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Contenu (Markdown : ## titre, **gras**, - liste, [lien](https://…))
              <textarea
                name="content"
                rows={18}
                defaultValue={post?.content ?? ""}
                placeholder={"## Le problème\n\nVotre texte…\n\n## La solution\n\n- point 1\n- point 2"}
                className={`${inputClass} font-mono`}
              />
            </label>
            <label className="block text-sm font-semibold">
              Image de couverture (URL, optionnel)
              <input
                type="url"
                name="cover_url"
                defaultValue={post?.cover_url ?? ""}
                placeholder="https://…"
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <h2 className="font-bold text-foreground">SEO</h2>
          <p className="mt-1 text-xs text-muted">
            Un article = une requête Google précise. Le titre SEO (~60
            caractères) doit contenir la requête ; la description (~155
            caractères) doit donner envie de cliquer.
          </p>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">
              URL de l&apos;article (slug — laissez vide pour le générer du titre)
              <input
                type="text"
                name="slug"
                maxLength={80}
                defaultValue={post?.slug ?? ""}
                placeholder="cout-application-metier-sur-mesure"
                aria-invalid={
                  state.error === "slug" || state.error === "slug-pris"
                    ? true
                    : undefined
                }
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Balise Title (SEO)
              <input
                type="text"
                name="meta_title"
                maxLength={70}
                defaultValue={post?.meta_title ?? ""}
                placeholder="Prix d'une application métier sur mesure en 2026 | Mailys Solutions"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Meta description (SEO)
              <textarea
                name="meta_description"
                rows={2}
                maxLength={170}
                defaultValue={post?.meta_description ?? ""}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? false}
              onChange={(e) => setPublie(e.target.checked)}
              className="h-4 w-4 accent-[#e11d2a]"
            />
            Publié (visible sur le site)
          </label>
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </div>

        {/* Publier et dépublier sont des mises en ligne et des retraits
            réels, indexables ou désindexables. On annonce la conséquence
            avant qu'elle ne se produise, plutôt qu'après. */}
        {publicationChange && (
          <p className="text-right text-sm font-semibold text-orange-text">
            {publie
              ? "En enregistrant, cet article sera mis en ligne sur le site public."
              : "En enregistrant, cet article sera retiré du site public."}
          </p>
        )}
      </form>

      {/* Suppression hors du formulaire principal : imbriquer deux <form>
          est invalide, et un formAction sur ce bouton court-circuiterait
          l'action d'enregistrement. */}
      {post && (
        <div className="mt-6 border-t border-border pt-4">
          {confirmingDelete ? (
            <form action={deletePost} className="rounded-xl border border-accent/30 bg-accent/5 p-4">
              <input type="hidden" name="id" value={post.id} />
              <input type="hidden" name="current_slug" value={post.slug} />
              <p className="text-sm font-semibold text-foreground">
                Supprimer définitivement « {post.title} » ?
              </p>
              <p className="mt-1 text-sm text-muted">
                {post.published
                  ? "Cet article est en ligne : son URL deviendra introuvable pour Google et pour vos visiteurs."
                  : "Ce brouillon sera perdu."}{" "}
                Cette action est irréversible.
              </p>
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:text-foreground"
                >
                  Annuler
                </button>
                <SubmitButton
                  pendingLabel="Suppression…"
                  className="rounded-xl border border-accent/40 px-5 py-2.5 text-sm font-semibold text-accent-dark hover:bg-accent/10"
                >
                  Oui, supprimer
                </SubmitButton>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-sm font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
            >
              Supprimer définitivement cet article
            </button>
          )}
        </div>
      )}
    </>
  );
}
