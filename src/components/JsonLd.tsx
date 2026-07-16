// Injecte des données structurées Schema.org (JSON-LD) dans la page.
// Google les lit pour afficher des résultats enrichis (FAQ, fil d'Ariane…).
// Les chevrons sont échappés (<) : un contenu édité contenant
// « </script> » ne peut ni casser la page ni injecter de code.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
