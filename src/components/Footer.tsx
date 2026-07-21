import Link from "next/link";
import { SITE } from "@/lib/site";
import { getFooterContent, getMergedServices } from "@/lib/sections";
import Logo from "@/components/Logo";

// Footer : participe au maillage interne (liens vers toutes les pages clés).
// Texte de présentation éditable dans /admin/contenus.
export default async function Footer() {
  const [c, SERVICES] = await Promise.all([
    getFooterContent(),
    getMergedServices(),
  ]);
  return (
    // Le dégradé du site — corail → rouge → orange — repris ici pour
    // fermer la page en écho au header, mais sous un voile sombre plus
    // dense (le footer porte beaucoup de texte, dont du gris muted) :
    // le chaud ne fait que transparaître, la lecture reste franche.
    <footer
      className="relative border-t border-border"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(var(--noir-300-rgb) / 0.86), rgb(var(--noir-300-rgb) / 0.92)), linear-gradient(100deg, rgb(var(--coral)) 0%, rgb(var(--accent)) 50%, rgb(var(--orange)) 100%)",
      }}
    >
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {c.tagline}
          </p>
        </div>

        <nav aria-label="Nos services">
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Services
          </p>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="L'entreprise">
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Entreprise
          </p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/realisations" className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline">
                Réalisations
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline">
                {SITE.email}
              </a>
            </li>
            {/* Seul accès à l'espace client sur téléphone : la barre
                d'onglets du header est limitée à quatre entrées. */}
            <li>
              <Link href="/espace-client" className="text-sm text-foreground underline-offset-2 transition-colors hover:text-accent hover:underline">
                Mon espace client
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-content px-4 py-5 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {SITE.name} — {c.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}
