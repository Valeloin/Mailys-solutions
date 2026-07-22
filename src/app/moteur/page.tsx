// Page de TEST du moteur Simple Dev — isolée de la vraie vitrine.
// Objectif : valider l'extension Chrome (sélection / déplacement / style /
// sauvegarde) sur du contenu en blocs, SANS toucher à la page d'accueil.
// Vrai <main> autour des blocs (sans lui, l'extension ne peut ni sélectionner
// ni enregistrer). Les blocs header/footer du moteur sont filtrés.
import "@/engine/engine.css";
import { RenderPage } from "@/engine/RenderBlock";
import { getContent } from "@/engine/getContent";

// Contenu lu à chaque requête (dernière version enregistrée).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Moteur (test)",
  robots: { index: false, follow: false },
};

export default async function MoteurPage() {
  const blocks = (await getContent()) ?? [];
  const contenu = blocks.filter((b) => b.type !== "header" && b.type !== "footer");
  return (
    <main data-sd-page="accueil" style={{ minHeight: "100vh" }}>
      <RenderPage blocks={contenu} />
    </main>
  );
}
