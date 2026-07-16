import { getPublicClient } from "@/lib/supabase/public";

// Data layer du blog — lecture publique (articles publiés uniquement).
// Sans Supabase configuré : listes vides, le blog affiche son
// message « articles à venir » (et reste noindex).

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  meta_title: string;
  meta_description: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = getPublicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data as BlogPost[];
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as BlogPost;
}

/** Date lisible en français (ex. « 16 juillet 2026 ») */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Slug propre à partir d'un titre (URL SEO) */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents (diacritiques combinants)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
