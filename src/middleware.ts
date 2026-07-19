import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAILS } from "@/lib/site";

// Garde d'accès des deux espaces authentifiés du site.
//
//   /admin/*         session valide ET email d'administrateur
//   /espace-client/* session valide, quelle qu'elle soit
//
// Le cloisonnement tient à ce que la qualité d'administrateur se juge
// sur l'email, pas sur la simple présence d'une session : un compte
// client, même connecté, ne franchit pas /admin.
// Rafraîchit aussi la session (cookies).
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });

  // Supabase non configuré : les pages admin affichent elles-mêmes
  // la marche à suivre, inutile de bloquer ici.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = Boolean(
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())
  );

  const path = request.nextUrl.pathname;

  // ---------- Administration ----------
  if (path.startsWith("/admin") && path !== "/admin/login" && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (path === "/admin/login" && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // ---------- Espace client ----------
  // « bienvenue » reste ouverte : on y arrive par le lien d'invitation,
  // avec une session fraîchement posée mais aucun mot de passe encore
  // choisi. La page vérifie elle-même qu'une session existe.
  const CLIENT_PUBLIC = ["/espace-client/connexion", "/espace-client/bienvenue"];
  if (path.startsWith("/espace-client") && !CLIENT_PUBLIC.includes(path) && !user) {
    return NextResponse.redirect(new URL("/espace-client/connexion", request.url));
  }
  // Déjà connecté : inutile de repasser par le formulaire.
  if (path === "/espace-client/connexion" && user && !isAdmin) {
    return NextResponse.redirect(new URL("/espace-client", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/espace-client/:path*"],
};
