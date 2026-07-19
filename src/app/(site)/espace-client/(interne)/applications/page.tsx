import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes applications",
  robots: { index: false, follow: false },
};

// ============================================================
// Mes applications — en attente de son modèle de données.
//
// Rien ne décrit aujourd'hui les applications livrées à un client :
// ni table, ni écran d'administration pour les saisir. Cette page
// dit donc ce qu'elle attend, plutôt que d'afficher un vide qui
// ressemblerait à une panne.
// ============================================================

export default function ApplicationsPage() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
      <p className="font-semibold text-foreground">
        Vos applications apparaîtront ici
      </p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
        Cette section listera les applications métier que nous avons
        développées pour vous, avec leur version en service. Vous pourrez y
        rattacher directement un ticket, sans avoir à préciser de quelle
        application il s&apos;agit.
      </p>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
        En attendant, déclarez vos tickets depuis l&apos;onglet{" "}
        <span className="font-semibold text-foreground">Mes tickets</span> en
        indiquant l&apos;application concernée dans le formulaire.
      </p>
    </div>
  );
}
