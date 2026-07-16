import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CtaSection from "@/components/CtaSection";
import { getPublishedPosts, formatDate } from "@/lib/blog";

// ============================================================
// BLOG — pilier SEO longue traîne. Les articles sont gérés
// depuis /admin. La page passe automatiquement en « index »
// dès qu'un premier article est publié (noindex sinon, pour ne
// pas présenter une page vide à Google).
// ============================================================

export const revalidate = 300; // ISR : re-génération toutes les 5 min

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  return {
    title: "Blog : digitalisation et applications métier pour PME",
    description:
      "Conseils, retours d'expérience et guides pratiques sur la digitalisation des PME, les applications métier sur mesure et la maintenance WINDEV / WEBDEV.",
    alternates: { canonical: "/blog" },
    robots: posts.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <Breadcrumb items={[{ name: "Blog", href: "/blog" }]} />
      </div>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h1 className="max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-bordeaux sm:text-5xl">
          Le blog de la digitalisation des PME
        </h1>
        <p className="rise rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Guides pratiques, retours d&apos;expérience et conseils concrets
          pour digitaliser votre entreprise : applications métier,
          automatisation des processus, modernisation de logiciels et
          maintenance WINDEV / WEBDEV.
        </p>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-coral bg-surface p-8 text-center">
            <p className="font-semibold text-bordeaux">
              Les premiers articles arrivent bientôt
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Nous préparons une série de guides pratiques répondant aux
              questions que se posent les dirigeants de PME. Une question en
              particulier ? Posez-la nous directement.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group card reveal relative flex flex-col rounded-2xl border border-border bg-background p-6 hover:border-coral"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {formatDate(post.published_at)}
                </p>
                <h2 className="mt-2 text-lg font-bold transition-colors group-hover:text-accent">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-sm font-semibold text-accent">
                  Lire l&apos;article{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <CtaSection
        title="Une question sur votre projet ?"
        text="Inutile d'attendre l'article : posez-nous directement votre question, nous y répondons avec plaisir."
        buttonLabel="Poser ma question"
      />
    </>
  );
}
