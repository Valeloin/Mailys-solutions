import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { formatDate, type BlogPost } from "@/lib/blog";

// Liste des articles (publiés et brouillons).
export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const supabase = await getServerClient();

  let posts: BlogPost[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    posts = (data ?? []) as BlogPost[];
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Articles</h1>
        <Link
          href="/admin/articles/nouveau"
          className="btn-cta rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          + Nouvel article
        </Link>
      </div>

      {saved === "1" && (
        <p role="status" className="mt-4 rounded-lg border border-border bg-background p-3 text-sm font-semibold text-foreground">
          ✓ Article enregistré — le site public est à jour.
        </p>
      )}
      {deleted === "1" && (
        <p role="status" className="mt-4 rounded-lg border border-border bg-background p-3 text-sm font-semibold text-foreground">
          Article supprimé.
        </p>
      )}

      {posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-coral bg-background p-8 text-center">
          <p className="font-semibold text-foreground">Aucun article pour l&apos;instant</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Chaque article doit viser une question précise que se posent vos
            prospects (« requête longue traîne ») et renvoyer vers la page
            service concernée.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">{post.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  /blog/{post.slug} — modifié le {formatDate(post.updated_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    post.published
                      ? "bg-orange/10 text-orange-text"
                      : "bg-surface text-muted"
                  }`}
                >
                  {post.published ? "Publié" : "Brouillon"}
                </span>
                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-muted underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Voir
                  </a>
                )}
                <Link
                  href={`/admin/articles/${post.id}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold transition-colors hover:border-coral"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
