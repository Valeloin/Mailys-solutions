import Link from "next/link";
import PostForm from "../post-form";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <Link href="/admin/articles" className="text-sm font-semibold text-muted hover:text-foreground">
        ← Tous les articles
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-foreground">Nouvel article</h1>
      <PostForm error={error} />
    </>
  );
}
