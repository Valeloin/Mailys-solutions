import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import CtaSection from "@/components/CtaSection";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import {
  getPublishedPosts,
  getPublishedPostBySlug,
  formatDate,
} from "@/lib/blog";

// ============================================================
// ARTICLE DE BLOG — 1 article = 1 requête longue traîne.
// Rendu statique (ISR) : le Markdown est converti en HTML côté
// serveur, Google reçoit la page complète. Schema.org Article.
// ============================================================

export const revalidate = 300;
export const dynamicParams = true; // les nouveaux articles sont servis à la demande

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return {
    title: { absolute: post.meta_title || `${post.title} | Mailys Solutions` },
    description: post.meta_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `/blog/${post.slug}`,
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      modifiedTime: post.updated_at,
      ...(post.cover_url ? { images: [post.cover_url] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const html = await marked.parse(post.content);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.meta_description || post.excerpt,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          ...(post.cover_url ? { image: post.cover_url } : {}),
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
        }}
      />

      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
      </div>

      <article className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <header className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            <time dateTime={post.published_at ?? undefined}>
              {formatDate(post.published_at)}
            </time>
          </p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Contenu Markdown rendu en HTML côté serveur.
            Styles typographiques dans globals.css (.article-content). */}
        <div
          className="article-content mx-auto mt-10 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="mx-auto mt-12 max-w-3xl border-t border-border pt-6">
          <Link
            href="/blog"
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            ← Tous les articles
          </Link>
        </footer>
      </article>

      <CtaSection />
    </>
  );
}
