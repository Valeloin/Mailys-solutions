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
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

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
      <PostForm post={post} error={error} />
    </>
  );
}
