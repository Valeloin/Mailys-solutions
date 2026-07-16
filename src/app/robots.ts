import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Les futures landing pages SEA et l'admin ne doivent pas être indexés.
      disallow: ["/lp/", "/admin/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
