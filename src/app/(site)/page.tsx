import type { Metadata } from "next";
import "@/engine/engine.css";
import { RenderPage } from "@/engine/RenderBlock";
import { getContent } from "@/engine/getContent";
import { getHomeContent } from "@/lib/sections";

// ============================================================
// ACCUEIL — désormais rendue par le moteur Simple Dev : les sections sont
// des BLOCS éditables au clic via l'extension Chrome.
// Les blocs se rendent dans le <main id="contenu"> fourni par le layout
// (site) : l'extension y lit data-sd-page (par défaut « accueil ») et
// sérialise ces blocs à l'enregistrement. Header/Footer viennent du layout,
// donc on filtre les blocs header/footer du moteur (un seul menu).
// Contenu par défaut : src/engine/defaults.ts (repli de getContent) ; une
// fois édité, le contenu vit dans content/page-accueil.json.
// Les métadonnées SEO restent pilotées par l'admin CMS (getHomeContent).
// L'ancienne page sur-mesure (hero animé, services en miroir) reste dans
// l'historique git et ses composants (HeroShowcase, ServicePreview, …).
// ============================================================

// Lu à chaque requête : toujours la dernière version enregistrée.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getHomeContent();
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const blocks = (await getContent("accueil")) ?? [];
  const contenu = blocks.filter((b) => b.type !== "header" && b.type !== "footer");
  return <RenderPage blocks={contenu} />;
}
