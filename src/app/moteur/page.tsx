// Page de TEST du moteur Simple Dev — page d'accueil (slug « accueil »).
// Rend le VRAI Header + Footer du site autour des blocs, pour refléter la
// vitrine réelle (l'extension édite les blocs entre les deux).
// Vrai <main data-sd-page> autour des blocs : sans lui, l'extension ne peut
// ni sélectionner ni enregistrer. Les blocs header/footer du moteur sont
// filtrés (un seul menu, celui du layout). La vraie home reste intacte.
import "@/engine/engine.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RenderPage } from "@/engine/RenderBlock";
import { getContent } from "@/engine/getContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Moteur (test)",
  robots: { index: false, follow: false },
};

export default async function MoteurAccueil() {
  const blocks = (await getContent("accueil")) ?? [];
  const contenu = blocks.filter((b) => b.type !== "header" && b.type !== "footer");
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="contenu" data-sd-page="accueil" className="flex-1">
        <RenderPage blocks={contenu} />
      </main>
      <Footer />
    </div>
  );
}
