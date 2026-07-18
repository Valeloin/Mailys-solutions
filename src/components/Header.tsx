import Link from "next/link";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import { SERVICES } from "@/lib/services";

const NAV = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Réalisations", href: "/realisations" },
  { name: "À propos", href: "/a-propos" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

// Sous-pages du menu Services (dérivées de la source de vérité).
// « Tous les services » est traité à part, en pied de menu.
const SERVICE_LINKS = SERVICES.map((s) => ({
  name: s.name,
  href: `/services/${s.slug}`,
}));

// ---------- Briques du panneau tactile ----------
// Sous-titres : sur téléphone une carte a la place de dire où elle mène,
// là où une barre de navigation desktop doit se contenter d'un mot.
const NAV_SUBTITLES: Record<string, string> = {
  Accueil: "Vue d'ensemble",
  Réalisations: "Nos projets clients",
  "À propos": "Qui nous sommes",
  Blog: "Guides et conseils",
  Contact: "Parlons de votre projet",
};

// Pictogrammes au trait, en currentColor : chacun prend le ton de sa
// pastille. Même facture que les icônes de constat (ui.tsx).
const NAV_ICONS: Record<string, React.ReactNode> = {
  Accueil: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  Réalisations: (
    <>
      <rect x="3.5" y="5" width="17" height="13" rx="2" />
      <path d="M3.5 14l4.5-4 3.5 3 3-3.5 6 5.5" />
    </>
  ),
  "À propos": (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1.2-3.4 4-5 7-5s5.8 1.6 7 5" />
    </>
  ),
  Blog: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </>
  ),
  Contact: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  Grille: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>
  ),
};

// Tons chauds cyclés par position — même principe que les cartes constat.
const MENU_TONES = [
  "bg-coral/[0.15] text-[#D8494F]",
  "bg-orange/[0.15] text-orange-text",
  "bg-accent/[0.12] text-accent",
  "bg-bordeaux/[0.08] text-foreground",
] as const;

/** Carte de navigation tactile : pastille + libellé (+ sous-titre) + chevron.
    Hauteur ~66 px — très au-dessus du seuil de 44 px, confortable au pouce. */
function MenuCard({
  href,
  title,
  subtitle,
  icon,
  badge,
  tone = 0,
}: {
  href: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  tone?: number;
}) {
  const t = MENU_TONES[tone % MENU_TONES.length];
  return (
    <Link
      href={href}
      className="group/c flex items-center gap-3.5 rounded-2xl border border-border bg-surface px-3.5 py-3 transition-[transform,border-color,box-shadow] duration-200 active:scale-[0.985] hover:border-coral/50 hover:shadow-[0_10px_24px_-16px_rgb(var(--bordeaux)/0.3)]"
    >
      <span
        aria-hidden="true"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold ${t}`}
      >
        {icon ? (
          <svg
            viewBox="0 0 24 24"
            className="h-[21px] w-[21px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        ) : (
          badge
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-xs text-muted">{subtitle}</span>
        )}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover/c:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// Header 100 % HTML/CSS (aucun JavaScript envoyé au navigateur).
// Composition en trois zones : logo | navigation centrée | action.
// Navigation en petites capitales espacées (épuré mais travaillé),
// soulignement dégradé au survol, filet signature en couronnement.
// L'onglet Services ouvre un menu déroulant (survol + focus clavier).
// Le menu mobile repose sur <details>, natif et accessible.
export default function Header() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-border/80 bg-background">
      {/* Filet signature de marque : corail → rouge → orange */}
      <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-0.5" />
      {/* Progression de lecture : la barre grandit avec le défilement */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 z-10 h-[3px]" />
      <div className="mx-auto grid h-[4.25rem] max-w-content grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start">
          <Logo />
        </Link>

        {/* Navigation desktop, centrée — petites capitales espacées */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV.map((item) =>
            item.name === "Services" ? (
              // Onglet Services : menu déroulant CSS (survol + focus-within)
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="nav-link flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors hover:text-foreground group-hover:text-foreground group-focus-within:text-foreground"
                  aria-haspopup="true"
                >
                  {item.name}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 transition-transform duration-200 group-hover:-rotate-180 group-focus-within:-rotate-180"
                  >
                    <path
                      d="M2.5 4.5 6 8l3.5-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                {/* Panneau : invisible par défaut, révélé au survol/focus.
                    Le pont haut évite la coupure du survol sous le filet. */}
                <div className="invisible absolute left-1/2 top-full z-20 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="w-[19.5rem] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_28px_56px_-28px_rgb(var(--bordeaux)/0.4)]">
                    {/* Filet signature, comme en couronnement du header */}
                    <span aria-hidden="true" className="brand-hairline block h-1" />
                    <div className="p-2.5">
                      {/* Label façon kicker : même grammaire que la DA */}
                      <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-text">
                        Nos expertises
                      </p>
                      {SERVICE_LINKS.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="group/i flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface hover:text-accent"
                        >
                          {/* Point dégradé : écho des points du logo */}
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-orange to-accent opacity-60 transition-opacity group-hover/i:opacity-100"
                          />
                          {sub.name}
                        </Link>
                      ))}
                      <span aria-hidden="true" className="my-2 block h-px bg-border" />
                      {/* Pied de menu : capitales espacées, comme la nav */}
                      <Link
                        href="/services"
                        className="group/a flex items-center justify-between rounded-lg px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-surface"
                      >
                        Tous les services
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-200 group-hover/a:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-[13px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        {/* Action, séparée par un filet vertical */}
        <div className="hidden items-center gap-5 justify-self-end lg:flex">
          <span aria-hidden="true" className="h-5 w-px bg-border" />
          <Link
            href="/contact"
            className="btn-cta rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          >
            Demander un devis
          </Link>
        </div>

        {/* ---------- Navigation tactile (téléphone / tablette) ----------
            Panneau plein écran à cartes, et non un menu déroulant desktop
            rétréci : cartes pleine largeur, pictogramme dans un carré
            teinté, titre + sous-titre, chevron. Cibles largement au-delà
            des 44 px. Toujours <details> natif — aucun JavaScript. */}
        {/* Bloc d'action mobile : devis à portée directe + menu complet */}
        <div className="flex items-center gap-2 justify-self-end lg:hidden">
          <Link
            href="/contact"
            className="btn-cta flex h-11 items-center rounded-xl px-4 text-[13px] font-semibold text-white"
          >
            Devis
          </Link>
        <details className="group/menu">
          <summary
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-border bg-background transition-colors hover:border-coral [&::-webkit-details-marker]:hidden"
            aria-label="Ouvrir le menu"
          >
            {/* Barres qui se croisent en X à l'ouverture */}
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span className="absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 group-open/menu:top-[7px] group-open/menu:rotate-45" />
              <span className="absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-foreground transition-opacity duration-200 group-open/menu:opacity-0" />
              <span className="absolute left-0 top-[14px] block h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 group-open/menu:top-[7px] group-open/menu:-rotate-45" />
            </span>
          </summary>

          <nav
            aria-label="Navigation mobile"
            className="fixed inset-x-0 bottom-0 top-[119px] z-40 overflow-y-auto overscroll-contain border-t border-border bg-background pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto max-w-lg space-y-7 px-4 py-6">
              {/* ----- Pages ----- */}
              <section>
                <p className="px-1 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-text">
                  Navigation
                </p>
                <div className="space-y-2">
                  {NAV.filter((i) => i.name !== "Services").map((item, i) => (
                    <MenuCard
                      key={item.href}
                      href={item.href}
                      title={item.name}
                      subtitle={NAV_SUBTITLES[item.name]}
                      icon={NAV_ICONS[item.name]}
                      tone={i}
                    />
                  ))}
                </div>
              </section>

              {/* ----- Services, développés : sur téléphone on ne cache
                      pas les pages qui portent le référencement ----- */}
              <section>
                <p className="px-1 pb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-text">
                  Nos expertises
                </p>
                <div className="space-y-2">
                  {SERVICE_LINKS.map((sub, i) => (
                    <MenuCard
                      key={sub.href}
                      href={sub.href}
                      title={sub.name}
                      badge={String(i + 1).padStart(2, "0")}
                      tone={i}
                    />
                  ))}
                  <MenuCard
                    href="/services"
                    title="Tous les services"
                    subtitle="Vue d'ensemble des 4 expertises"
                    icon={NAV_ICONS.Grille}
                    tone={3}
                  />
                </div>
              </section>

              <Link
                href="/contact"
                className="btn-cta flex items-center justify-center rounded-2xl px-5 py-4 text-center font-semibold text-white"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </nav>
        </details>
        </div>
      </div>

      {/* Bandeau d'onglets : navigation rapide, téléphone et tablette */}
      <MobileTabBar />
    </header>
  );
}
