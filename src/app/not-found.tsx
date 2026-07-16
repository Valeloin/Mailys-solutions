import Link from "next/link";

// Page 404 : renvoie les visiteurs perdus vers les pages utiles
// (et évite les impasses pour les robots d'indexation).
export default function NotFound() {
  return (
    <section className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
        Erreur 404
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-bordeaux">
        Cette page n&apos;existe pas (ou plus)
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Pas de panique : voici les chemins les plus utiles pour reprendre
        votre visite.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/services"
          className="rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-coral"
        >
          Voir nos services
        </Link>
      </div>
    </section>
  );
}
