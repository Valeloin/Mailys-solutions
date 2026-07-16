import Link from "next/link";

// CTA final réutilisable — présent en bas de chaque page (conversion).
export default function CtaSection({
  title = "Parlons de votre projet",
  text = "Décrivez-nous votre besoin en quelques lignes : nous revenons vers vous rapidement avec un premier avis honnête et un devis gratuit, sans engagement.",
  buttonLabel = "Demander un devis gratuit",
}: {
  title?: string;
  text?: string;
  buttonLabel?: string;
}) {
  return (
    <section aria-label="Contactez-nous" className="bg-surface">
      <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">{text}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {buttonLabel}
          </Link>
          <Link
            href="/realisations"
            className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-background"
          >
            Voir nos réalisations
          </Link>
        </div>
      </div>
    </section>
  );
}
