// Rendu multi-page du moteur Simple Dev : /moteur/<slug>.
// Chaque page créée via l'extension (content/page-<slug>.json) s'affiche ici,
// avec le vrai Header + Footer et son propre <main data-sd-page=slug> (l'extension
// sait ainsi quelle page enregistrer). 404 si la page n'existe pas encore.
import "@/engine/engine.css";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RenderPage } from "@/engine/RenderBlock";
import { getContent } from "@/engine/getContent";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function MoteurPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blocks = await getContent(slug);
  if (!blocks) notFound();
  const contenu = blocks.filter((b) => b.type !== "header" && b.type !== "footer");
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="contenu" data-sd-page={slug} className="flex-1">
        <RenderPage blocks={contenu} />
      </main>
      <Footer />
    </div>
  );
}
