import Link from "next/link";
import Logo from "@/components/Logo";

const NAV = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Réalisations", href: "/realisations" },
  { name: "À propos", href: "/a-propos" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

// Header 100 % HTML/CSS (aucun JavaScript envoyé au navigateur) :
// le menu mobile repose sur <details>, natif et accessible.
export default function Header() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-border/80 bg-background">
      {/* Filet signature de marque : corail → rouge → orange */}
      <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-0.5" />
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="Mailys Solutions — Accueil">
          <Logo />
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-sm font-medium text-muted hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn-cta rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            Demander un devis
          </Link>
        </nav>

        {/* Navigation mobile — <details> natif, sans JavaScript */}
        <details className="relative md:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border transition-colors hover:border-coral [&::-webkit-details-marker]:hidden"
            aria-label="Ouvrir le menu"
          >
            <span aria-hidden="true" className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-foreground"></span>
              <span className="block h-0.5 w-5 bg-foreground"></span>
              <span className="block h-0.5 w-5 bg-foreground"></span>
            </span>
          </summary>
          <nav
            aria-label="Navigation mobile"
            className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-background p-2 shadow-[0_24px_48px_-24px_rgb(var(--bordeaux)/0.3)]"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-cta mt-2 block rounded-lg px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Demander un devis
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
