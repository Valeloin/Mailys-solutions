import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { getColorOverridesCss } from "@/lib/colors";
import "./globals.css";

// Layout racine : html/body, police, identité Schema.org et
// palette éventuellement écrasée depuis l'admin (couleurs).
// Le header/footer publics vivent dans (site)/layout.tsx —
// l'admin a sa propre coque.

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "Développement d'application métier sur mesure pour PME | Mailys Solutions",
    template: "%s | Mailys Solutions",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Couleurs personnalisées depuis /admin (null si palette d'origine).
  const colorsCss = await getColorOverridesCss();

  return (
    <html lang="fr" className={manrope.className}>
      <body className="antialiased">
        {colorsCss && (
          <style id="site-colors" dangerouslySetInnerHTML={{ __html: colorsCss }} />
        )}
        {/* Schema.org : identité de l'entreprise (visible sur tout le site).
            À enrichir avec adresse + téléphone dès que le client les fournit. */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
            description: SITE.description,
            areaServed: "FR",
            priceRange: "Sur devis",
          }}
        />
        {children}
      </body>
    </html>
  );
}
