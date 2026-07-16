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
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
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
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Demander un devis
          </Link>
        </nav>

        {/* Navigation mobile — <details> natif, sans JavaScript */}
        <details className="relative md:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border [&::-webkit-details-marker]:hidden"
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
            className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-background p-2 shadow-lg"
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
              className="mt-2 block rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Demander un devis
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
