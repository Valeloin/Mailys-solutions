import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";

// Sitemap généré automatiquement — soumis à Google Search Console.
// /realisations et /blog seront ajoutés dès qu'ils auront du contenu
// réel (ils sont noindex en attendant).
export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...staticPages, ...servicePages];
}
