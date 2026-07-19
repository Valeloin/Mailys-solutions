import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
  robots: { index: false, follow: false },
};

// ============================================================
// Documents — en attente de son stockage.
//
// Rien ne stocke aujourd'hui de fichiers destinés à un client :
// il faut un espace de stockage, une table de métadonnées et un
// écran d'administration pour les téléverser. Cette page annonce
// donc l'intention plutôt que d'afficher une liste vide.
// ============================================================

export default function DocumentsPage() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
      <p className="font-semibold text-foreground">
        Vos documents apparaîtront ici
      </p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
        Devis, factures, cahiers des charges et livrables seront réunis dans
        cette section, téléchargeables à tout moment — sans avoir à retrouver
        l&apos;email qui les contenait.
      </p>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
        En attendant, ces documents vous sont transmis par email.
      </p>
    </div>
  );
}
