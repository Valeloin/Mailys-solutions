import type { Metadata } from "next";
import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import BugReportButton from "@/components/BugReportButton";
import { ADMIN_EMAILS } from "@/lib/site";

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
  { name: "Clients", href: "/admin/clients" },
  { name: "Couleurs", href: "/admin/couleurs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerClient();
  let isAdmin = false;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // La qualité d'administrateur se juge sur l'email, jamais sur la
    // seule présence d'une session : depuis l'ouverture de l'espace
    // client, un compte connecté n'est plus forcément le tien.
    isAdmin = Boolean(
      user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="relative border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-content flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <p className="text-sm font-bold">
            Admin <span className="text-coral">Mailys Solutions</span>
          </p>
          {isAdmin && (
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
              <div className="flex items-center gap-2">
                <BugReportButton />
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-coral hover:text-foreground"
                  >
                    Se déconnecter
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-content px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
