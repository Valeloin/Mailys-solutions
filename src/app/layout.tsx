import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import "./globals.css";

// Police unique auto-hébergée par Next (zéro requête externe, zéro CLS).
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={manrope.className}>
      <body className="flex min-h-screen flex-col antialiased">
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
