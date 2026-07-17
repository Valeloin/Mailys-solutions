/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sécurité et SEO : pas de header X-Powered-By, URLs propres sans trailing slash.
  poweredByHeader: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        // En-têtes de sécurité de base : Google Search / PageSpeed Insights
        // les considèrent comme un signal de qualité (Lighthouse "Best Practices").
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
