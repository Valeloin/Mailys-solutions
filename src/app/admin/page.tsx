import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";

// Tableau de bord : état du site + accès rapides.
export default async function AdminDashboard() {
  const supabase = await getServerClient();

  let postCount = 0;
  let publishedCount = 0;
  let unreadMessages = 0;

  if (supabase) {
    const [posts, published, unread] = await Promise.all([
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .eq("published", true),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false),
    ]);
    postCount = posts.count ?? 0;
    publishedCount = published.count ?? 0;
    unreadMessages = unread.count ?? 0;
  }

  const smtpConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );

  const cards = [
    {
      href: "/admin/contenus",
      title: "Contenus",
      value: "Textes du site",
      hint: "Modifier les textes de toutes les pages",
    },
    {
      href: "/admin/articles",
      title: "Articles",
      value: `${publishedCount} publié${publishedCount > 1 ? "s" : ""} / ${postCount}`,
      hint: "Rédiger et publier du contenu SEO",
    },
    {
      href: "/admin/messages",
      title: "Messages",
      value: `${unreadMessages} non lu${unreadMessages > 1 ? "s" : ""}`,
      hint: "Demandes reçues via le formulaire de contact",
    },
    {
      href: "/admin/couleurs",
      title: "Couleurs",
      value: "Palette du site",
      hint: "Ajuster les couleurs clés de la charte",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card rounded-2xl border border-border bg-background p-6 hover:border-coral"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              {c.title}
            </p>
            <p className="mt-2 text-xl font-bold text-foreground">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background p-6">
        <h2 className="font-bold text-foreground">État de la configuration</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${supabase ? "bg-orange" : "bg-border"}`}
            ></span>
            Base de données :{" "}
            {supabase
              ? "connectée"
              : "non configurée (renseigner les clés Supabase)"}
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${smtpConfigured ? "bg-orange" : "bg-border"}`}
            ></span>
            Notifications email :{" "}
            {smtpConfigured
              ? "activées"
              : "non configurées (les messages restent visibles ici)"}
          </li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          Site public :{" "}
          <a
            href="https://mailys-solutions.vercel.app"
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            mailys-solutions.vercel.app
          </a>{" "}
          — les modifications faites ici sont visibles en ligne en quelques
          secondes.
        </p>
      </div>
    </>
  );
}
