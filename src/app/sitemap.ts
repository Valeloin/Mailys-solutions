import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { getPublishedPosts } from "@/lib/blog";

// Sitemap généré automatiquement — soumis à Google Search Console.
// Les articles de blog publiés y entrent automatiquement (ISR 1 h).
// /realisations reste hors sitemap tant qu'il est noindex.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/services", "/a-propos", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const posts = await getPublishedPosts();
  const blogPages =
    posts.length > 0
      ? [
          {
            url: `${SITE.url}/blog`,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          ...posts.map((p) => ({
            url: `${SITE.url}/blog/${p.slug}`,
            lastModified: p.updated_at,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          })),
        ]
      : [];

  return [...staticPages, ...servicePages, ...blogPages];
}
