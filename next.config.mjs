/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sécurité et SEO : pas de header X-Powered-By, URLs propres sans trailing slash.
  poweredByHeader: false,
  trailingSlash: false,
};

export default nextConfig;
