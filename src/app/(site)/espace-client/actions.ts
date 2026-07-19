"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { sendPasswordReset } from "@/lib/mailer";
import { ADMIN_EMAILS } from "@/lib/site";

// ============================================================
// Authentification de l'espace client.
// Distincte de celle de l'administration : un compte client n'a
// jamais accès au back-office, et réciproquement.
// ============================================================

export async function loginClient(formData: FormData): Promise<void> {
  const supabase = await getServerClient();
  if (!supabase) redirect("/espace-client/connexion?error=config");

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  // Un administrateur passe par /admin/login : le laisser entrer ici
  // lui donnerait une session d'espace client, sans intérêt et source
  // de confusion sur le rôle réellement actif.
  if (ADMIN_EMAILS.includes(email)) {
    redirect("/espace-client/connexion?error=admin");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Supabase distingue le compte suspendu des mauvais identifiants :
    // le client mérite de savoir laquelle des deux situations le concerne.
    const code = /banned|disabled/i.test(error.message) ? "suspendu" : "identifiants";
    // L'email est renvoyé pour être réaffiché : le champ repartait vide,
    // et c'était l'adresse professionnelle complète à ressaisir après
    // chaque faute de frappe sur le mot de passe.
    redirect(
      `/espace-client/connexion?error=${code}&email=${encodeURIComponent(email)}`
    );
  }

  redirect("/espace-client");
}

export async function logoutClient(): Promise<void> {
  const supabase = await getServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/espace-client/connexion");
}

/** Choix du mot de passe après invitation, ou changement depuis l'espace. */
export async function setPassword(formData: FormData): Promise<void> {
  const supabase = await getServerClient();
  if (!supabase) redirect("/espace-client/connexion?error=config");

  // La session vient du lien d'invitation déjà échangé par /auth/callback.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/espace-client/connexion?error=lien");

  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8) {
    redirect("/espace-client/bienvenue?error=court");
  }
  if (password !== confirm) {
    redirect("/espace-client/bienvenue?error=different");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[mot de passe] refus de Supabase —", error.message);
    // Le motif est traduit et montré : il porte sur le mot de passe que
    // l'utilisateur vient de choisir, donc il lui est utile et ne révèle
    // rien qu'il ne sache déjà. Un message générique le laisserait
    // réessayer indéfiniment la même valeur refusée.
    redirect(
      `/espace-client/bienvenue?error=refus&motif=${encodeURIComponent(error.message)}`
    );
  }

  redirect("/espace-client?bienvenue=1");
}

/** Changement de mot de passe depuis l'espace, par un client déjà connecté. */
export async function changePassword(formData: FormData): Promise<void> {
  const supabase = await getServerClient();
  if (!supabase) redirect("/espace-client/connexion?error=config");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/espace-client/connexion");

  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8) redirect("/espace-client/compte?error=court");
  if (password !== confirm) redirect("/espace-client/compte?error=different");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("[compte] refus de Supabase —", error.message);
    redirect(
      `/espace-client/compte?error=refus&motif=${encodeURIComponent(error.message)}`
    );
  }

  redirect("/espace-client/compte?change=1");
}

/**
 * Envoi du lien de réinitialisation, par notre SMTP.
 *
 * Toutes les issues — adresse inconnue, email en échec, SMTP absent —
 * aboutissent au même message. Sinon ce formulaire, public, permettrait
 * de découvrir quelles adresses ont un compte.
 */
export async function requestPasswordReset(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  const admin = getAdminClient();
  if (admin && email && !ADMIN_EMAILS.includes(email)) {
    try {
      const { data } = await admin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
          redirectTo: `${proto}://${host}/auth/callback?next=/espace-client/bienvenue`,
        },
      });
      if (data?.properties?.action_link) {
        await sendPasswordReset(email, data.properties.action_link);
      }
    } catch (e) {
      // Silencieux pour l'utilisateur — voir le commentaire ci-dessus —
      // mais journalisé : sinon une panne d'envoi passerait inaperçue,
      // ce formulaire répondant la même chose dans tous les cas.
      console.error(
        "[réinitialisation] envoi impossible —",
        e instanceof Error ? e.message : e
      );
    }
  }

  redirect("/espace-client/connexion?reinit=1");
}
