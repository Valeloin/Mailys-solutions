import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

// Coque du site public : header + contenu + footer,
// avec le spinner signature joué à chaque changement de page.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PageTransition />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
