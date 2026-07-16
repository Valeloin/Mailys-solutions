// Injecte des données structurées Schema.org (JSON-LD) dans la page.
// Google les lit pour afficher des résultats enrichis (FAQ, fil d'Ariane…).
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
