import type { BlogPost } from "@/lib/blog";
import { savePost, deletePost } from "../actions";

// Formulaire article (création + édition) — formulaire HTML natif.
// Les champs SEO (balise Title, meta description) sont mis en avant :
// chaque article vise UNE requête longue traîne.

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/30";

const ERRORS: Record<string, string> = {
  titre: "Le titre est obligatoire.",
  slug: "Impossible de générer une URL valide à partir de ce titre.",
  "slug-pris": "Cette URL (slug) est déjà utilisée par un autre article.",
  sauvegarde: "Erreur lors de l'enregistrement. Réessayez.",
};

export default function PostForm({
  post,
  error,
}: {
  post?: BlogPost;
  error?: string;
}) {
  return (
    <form action={savePost} className="mt-6 space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      {error && (
        <p role="alert" className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm font-semibold text-accent-dark">
          {ERRORS[error] ?? ERRORS.sauvegarde}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-background p-6">
        <h2 className="font-bold text-bordeaux">Contenu</h2>
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
        <h2 className="font-bold text-bordeaux">SEO</h2>
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
            className="h-4 w-4 accent-[#e11d2a]"
          />
          Publié (visible sur le site)
        </label>
        <button
          type="submit"
          className="btn-cta rounded-xl px-7 py-3 font-semibold text-white"
        >
          Enregistrer
        </button>
      </div>

      {post && (
        <div className="border-t border-border pt-4">
          <input type="hidden" name="current_slug" value={post.slug} />
          <button
            type="submit"
            formAction={deletePost}
            formNoValidate
            className="text-sm font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
          >
            Supprimer définitivement cet article
          </button>
        </div>
      )}
    </form>
  );
}
