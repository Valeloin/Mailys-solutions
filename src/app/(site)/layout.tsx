import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import MobileTabBar from "@/components/MobileTabBar";

// Coque du site public : header + contenu + footer,
// avec le spinner signature joué à chaque changement de page.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Lien d'évitement : accessibilité clavier + signal de qualité pour les moteurs */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg"
      >
        Aller au contenu
      </a>
      <PageTransition />
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Navigation par onglets : téléphone et tablette uniquement */}
      <MobileTabBar />
    </div>
  );
}
