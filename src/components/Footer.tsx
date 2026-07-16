import Link from "next/link";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import Logo from "@/components/Logo";

// Footer : participe au maillage interne (liens vers toutes les pages clés).
export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Applications métier sur mesure pour PME : nous remplaçons les
            fichiers Excel et les processus manuels par des outils simples,
            rapides et adaptés à votre entreprise.
          </p>
        </div>

        <nav aria-label="Nos services">
          <p className="text-sm font-semibold uppercase tracking-wide text-bordeaux">
            Services
          </p>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-foreground underline-offset-2 hover:text-accent hover:underline"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="L'entreprise">
          <p className="text-sm font-semibold uppercase tracking-wide text-bordeaux">
            Entreprise
          </p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/realisations" className="text-sm text-foreground underline-offset-2 hover:text-accent hover:underline">
                Réalisations
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="text-sm text-foreground underline-offset-2 hover:text-accent hover:underline">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-foreground underline-offset-2 hover:text-accent hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-foreground underline-offset-2 hover:text-accent hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="text-sm text-foreground underline-offset-2 hover:text-accent hover:underline">
                {SITE.email}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-content px-4 py-5 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {SITE.name} — Développement
          d&apos;applications métier sur mesure pour PME
        </p>
      </div>
    </footer>
  );
}
