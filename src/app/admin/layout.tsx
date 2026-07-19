import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { logout } from "./actions";

// Coque de l'administration — jamais indexée, jamais liée
// depuis le site public (accès direct : /admin).
export const metadata: Metadata = {
  title: { absolute: "Administration | Mailys Solutions" },
  robots: { index: false, follow: false },
};

const NAV = [
  { name: "Tableau de bord", href: "/admin" },
  { name: "Contenus", href: "/admin/contenus" },
  { name: "Articles", href: "/admin/articles" },
  { name: "Messages", href: "/admin/messages" },
  { name: "Couleurs", href: "/admin/couleurs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerClient();
  let userEmail: string | null = null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="relative border-b border-border bg-background">
        <span aria-hidden="true" className="brand-hairline absolute inset-x-0 top-0 h-0.5" />
        <div className="mx-auto flex h-14 max-w-content flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <p className="text-sm font-bold">
            Admin <span className="text-coral">Mailys Solutions</span>
          </p>
          {userEmail && (
            <>
              <nav aria-label="Navigation admin" className="flex flex-wrap items-center gap-4">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
                >
                  Se déconnecter
                </button>
              </form>
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-content px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
