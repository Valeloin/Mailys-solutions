import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Kicker } from "@/components/ui";

// Page 404 globale : renvoie les visiteurs perdus vers les pages utiles
// (et évite les impasses pour les robots d'indexation).
// Elle vit à la racine (hors groupe (site)) : elle embarque donc
// elle-même le header et le footer publics.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
          <Kicker>Erreur 404</Kicker>
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
              className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/services"
              className="btn-ghost rounded-xl border border-border bg-background px-7 py-3.5 font-semibold"
            >
              Voir nos services
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
