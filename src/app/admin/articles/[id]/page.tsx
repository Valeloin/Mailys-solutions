import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/blog";
import PostForm from "../post-form";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const supabase = await getServerClient();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const post = data as BlogPost;

  return (
    <>
      <Link href="/admin/articles" className="text-sm font-semibold text-muted hover:text-foreground">
        ← Tous les articles
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-foreground">
        Modifier : {post.title}
      </h1>

      {/* L'enregistrement ramène ici plutôt qu'à la liste : sans accusé,
          on ne saurait pas distinguer un retour réussi d'un rechargement. */}
      {saved === "1" && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-orange/30 bg-orange/[0.07] p-3 text-sm font-semibold text-foreground"
        >
          {post.published
            ? "Article enregistré et en ligne sur le site public."
            : "Brouillon enregistré. Il n'est pas visible sur le site."}{" "}
          <Link href="/admin/articles" className="underline underline-offset-2">
            Revenir à la liste
          </Link>
        </p>
      )}

      <PostForm post={post} error={error} />
    </>
  );
}
