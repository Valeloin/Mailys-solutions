"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { sendClientInvitation } from "@/lib/mailer";
import { ADMIN_EMAILS } from "@/lib/site";

// ============================================================
// Gestion des accès à l'espace client.
//
// Les comptes ne sont jamais créés par inscription libre : c'est
// l'administrateur qui invite, et Supabase envoie au client un
// lien pour choisir son mot de passe. L'inscription publique
// reste donc désactivée, comme la migration 002 le demandait.
// ============================================================

/** Suspension « permanente » : Supabase attend une durée, pas un booléen. */
const BAN_FOREVER = "876000h"; // ~100 ans

/**
 * Exige une session ET un email d'administrateur.
 *
 * Le middleware garde déjà /admin, mais une server action est une
 * route POST joignable directement : on revérifie ici plutôt que de
 * s'en remettre à une protection écrite ailleurs.
 */
async function requireAdmin() {
  const supabase = await getServerClient();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = Boolean(
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())
  );
  if (!isAdmin) redirect("/admin/login");

  return user!;
}

/** Origine réelle de la requête : localhost en développement,
    domaine de production en ligne — sans variable à maintenir. */
async function currentOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function inviteClient(formData: FormData): Promise<void> {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect("/admin/clients?error=email");
  }

  // Un administrateur n'a rien à faire dans l'espace client : son compte
  // servirait les deux rôles, ce qui brouillerait le cloisonnement.
  if (ADMIN_EMAILS.includes(email)) {
    redirect("/admin/clients?error=admin");
  }

  const admin = getAdminClient();
  if (!admin) redirect("/admin/clients?error=config");

  const origin = await currentOrigin();

  // generateLink crée le compte et fabrique le lien signé, sans rien
  // envoyer : l'email part par notre SMTP, pas par celui de Supabase,
  // qui est limité à quelques envois par heure.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo: `${origin}/auth/callback?next=/espace-client/bienvenue` },
  });

  if (error || !data?.properties?.action_link) {
    const code = /already|exist|registered/i.test(error?.message ?? "")
      ? "existe"
      : "creation";
    redirect(`/admin/clients?error=${code}`);
  }

  try {
    await sendClientInvitation(email, data.properties.action_link);
  } catch {
    // Le compte existe désormais mais l'email n'est pas parti : on le dit,
    // sinon l'écran annoncerait une invitation que le client ne recevra
    // jamais. « Renvoyer l'invitation » permet de réessayer.
    redirect("/admin/clients?error=envoi");
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?invite=1");
}

/**
 * Suspend l'accès sans supprimer le compte.
 *
 * La suppression serait définitive et orpheliniserait les tickets déjà
 * ouverts par ce client dans BugTrack, qui y sont rattachés par son
 * identifiant. La suspension coupe l'accès tout en préservant ce lien,
 * et se défait.
 */
export async function revokeClient(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/clients");

  const admin = getAdminClient();
  if (!admin) redirect("/admin/clients?error=config");

  const { error } = await admin.auth.admin.updateUserById(id, {
    ban_duration: BAN_FOREVER,
  });
  if (error) redirect("/admin/clients?error=suspension");

  revalidatePath("/admin/clients");
  redirect("/admin/clients?revoke=1");
}

/** Rétablit un accès suspendu. */
export async function restoreClient(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/clients");

  const admin = getAdminClient();
  if (!admin) redirect("/admin/clients?error=config");

  const { error } = await admin.auth.admin.updateUserById(id, {
    ban_duration: "none",
  });
  if (error) redirect("/admin/clients?error=suspension");

  revalidatePath("/admin/clients");
  redirect("/admin/clients?restore=1");
}

/** Renvoie l'invitation à un compte qui n'a jamais été activé. */
export async function resendInvite(formData: FormData): Promise<void> {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) redirect("/admin/clients");

  const admin = getAdminClient();
  if (!admin) redirect("/admin/clients?error=config");

  const origin = await currentOrigin();

  // Le compte existe déjà : un lien d'invitation serait refusé. On
  // fabrique un lien de récupération, qui mène au même endroit — le
  // client choisit son mot de passe et entre dans son espace.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/auth/callback?next=/espace-client/bienvenue` },
  });

  if (error || !data?.properties?.action_link) {
    redirect("/admin/clients?error=creation");
  }

  try {
    await sendClientInvitation(email, data.properties.action_link);
  } catch {
    redirect("/admin/clients?error=envoi");
  }

  revalidatePath("/admin/clients");
  redirect("/admin/clients?invite=1");
}
