import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import BlogShowcase from "@/components/BlogShowcase";
import { Kicker } from "@/components/ui";
import { getPublishedPosts, formatDate } from "@/lib/blog";
import { getBlogContent } from "@/lib/sections";

// ============================================================
// BLOG — pilier SEO longue traîne, présenté comme une vraie
// section éditoriale (hero à deux colonnes + décor animé,
// rubriques, état « à venir » soigné). Les articles sont gérés
// depuis /admin ; la page passe en « index » dès le 1er publié
// (noindex sinon, pour ne pas présenter une page vide à Google).
// ============================================================

export const revalidate = 300; // ISR : re-génération toutes les 5 min

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const title = "Blog : digitalisation et applications métier pour PME";
  const description =
    "Conseils, retours d'expérience et guides pratiques sur la digitalisation des PME, les applications métier sur mesure et la maintenance WINDEV / WEBDEV.";
  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    robots: posts.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title, description, url: "/blog", type: "website" },
  };
}

// Rubriques du blog — pastilles de catégorie, couleur unifiée (rouge DA)
const TOPICS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Applications métier",
    icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  },
  {
    label: "Digitalisation",
    icon: <path d="M21 12a9 9 0 11-3-6.7M21 4v4h-4" />,
  },
  {
    label: "Modernisation",
    icon: <path d="M12 3l2.2 5.6L20 9l-4.5 3.8L17 19l-5-3.3L7 19l1.5-6.2L4 9l5.8-.4z" />,
  },
  {
    label: "Maintenance WINDEV / WEBDEV",
    icon: <path d="M14.7 6.3a4.5 4.5 0 00-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 005.6-6L14 13l-3-3z" />,
  },
];

export default async function BlogPage() {
  const [posts, c] = await Promise.all([getPublishedPosts(), getBlogContent()]);

  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Blog", href: "/blog" }]} />
      </div>

      {/* ================= HERO ÉDITORIAL ================= */}
      <section className="sec sec-warm relative overflow-hidden border-b border-border">
        {/* Décor : barres fantômes du logo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 right-[10%] hidden h-56 w-16 -rotate-[22deg] rounded-full bg-orange/[0.05] lg:block" />
          <div className="absolute -bottom-28 -left-10 hidden h-72 w-20 -rotate-[22deg] rounded-full bg-coral/[0.06] lg:block" />
        </div>

        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_minmax(0,28rem)]">
          <div className="relative">
            <Kicker>Le blog</Kicker>
            <h1 className="mt-5 max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              {c.h1}
            </h1>
            <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {c.intro}
            </p>
            {/* Rubriques — pastilles de catégorie, couleur unifiée */}
            <div className="rise rise-3 mt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted">
                Au sommaire
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {TOPICS.map((t) => (
                  <li
                    key={t.label}
                    className="group flex items-center gap-2.5 rounded-full border border-border bg-background py-2 pl-2 pr-4 text-sm font-semibold text-foreground shadow-[0_3px_10px_-6px_rgb(var(--bordeaux)/0.2)] transition-all hover:-translate-y-0.5 hover:border-coral hover:shadow-[0_10px_20px_-10px_rgb(var(--accent)/0.35)]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/15"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="rgb(var(--accent))"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {t.icon}
                      </svg>
                    </span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Décor animé : la pile de cartes d'article */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="glow-warm absolute -inset-10 rounded-full" />
            <BlogShowcase />
            {/* Chips flottantes de méta d'article */}
            <div className="pv-float absolute -left-4 top-6 z-10 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 shadow-[0_10px_28px_-14px_rgb(var(--bordeaux)/0.35)]">
              <span className="pv-dot h-2 w-2 rounded-full bg-orange" />
              <span className="text-xs font-semibold text-foreground">Guide pratique</span>
            </div>
            <div
              className="pv-float absolute -bottom-3 right-2 z-10 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 shadow-[0_10px_28px_-14px_rgb(var(--bordeaux)/0.35)]"
              style={{ animationDelay: "2.2s" }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="rgb(var(--accent))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" />
              </svg>
              <span className="text-xs font-semibold text-foreground">5 min de lecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARTICLES ================= */}
      <section aria-label="Articles" className="sec sec-clean">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
        {posts.length === 0 ? (
          /* --- État « à venir » soigné : anatomie d'articles en préparation --- */
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {c.placeholderTitle}
                </h2>
                <p className="mt-2 max-w-xl text-muted">{c.placeholderText}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-text">
                <span className="pv-dot h-1.5 w-1.5 rounded-full bg-orange" />
                En préparation
              </span>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background p-4"
                >
                  {/* Vignette de couverture fantôme + balayage */}
                  <div className="relative h-32 overflow-hidden rounded-xl bg-surface">
                    <div
                      className="absolute -left-1/3 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent [animation:pv-sweep_3.6s_ease-in-out_infinite]"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                    <div className="absolute left-3 top-3 h-4 w-16 rounded-full bg-background/70" />
                  </div>
                  {/* Lignes fantômes */}
                  <div className="mt-4 space-y-2.5">
                    <div className="h-3 w-4/5 rounded-full bg-bordeaux/12" />
                    <div className="h-3 w-3/5 rounded-full bg-bordeaux/10" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-bordeaux/8" />
                    <div className="h-2 w-11/12 rounded-full bg-bordeaux/8" />
                    <div className="h-2 w-2/3 rounded-full bg-bordeaux/8" />
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-5">
                    <div className="h-7 w-7 rounded-full bg-coral/20" />
                    <div className="h-2.5 w-20 rounded-full bg-bordeaux/10" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bandeau notification : prévenez-moi */}
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="rgb(var(--accent))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 5h16v11H9l-4 3v-3H4z" />
                  </svg>
                </span>
                <p className="max-w-md text-sm text-muted">
                  Une question ne peut pas attendre le prochain article ?
                  Posez-la nous directement, nous y répondons avec plaisir.
                </p>
              </div>
              <Link
                href="/contact"
                className="btn-cta shrink-0 rounded-xl px-6 py-3 font-semibold text-white"
              >
                Poser ma question
              </Link>
            </div>
          </div>
        ) : (
          /* --- Grille des articles publiés (article vedette + grille) --- */
          <>
            <h2 className="sr-only">Derniers articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group card reveal relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background hover:border-coral"
                >
                  {post.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_url} alt={post.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-br from-coral/20 via-accent/15 to-orange/20" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {formatDate(post.published_at)}
                    </p>
                    <h3 className="mt-2 text-lg font-bold transition-colors group-hover:text-accent">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-accent">
                      Lire l&apos;article{" "}
                      <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
        </div>
      </section>

      <CtaSection
        title={c.cta.title}
        text={c.cta.text}
        buttonLabel={c.cta.buttonLabel}
      />
    </>
  );
}
