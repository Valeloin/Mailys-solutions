"use server";

import { redirect } from "next/navigation";
import { getPublicClient } from "@/lib/supabase/public";
import { sendContactNotification } from "@/lib/mailer";

// Server action du formulaire de contact — formulaire HTML natif,
// aucun JavaScript navigateur. Résultat communiqué par redirection
// (?sent=1 ou ?error=...), le message est stocké en base et une
// notification email est envoyée si le SMTP est configuré.
export async function sendContactMessage(formData: FormData): Promise<void> {
  // Anti-spam : champ pot de miel invisible — un humain ne le remplit pas.
  if (String(formData.get("website") || "").trim() !== "") {
    redirect("/contact?sent=1"); // on fait croire au robot que c'est passé
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    redirect("/contact?error=champs");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect("/contact?error=email");
  }

  const db = getPublicClient();
  if (!db) {
    redirect("/contact?error=indisponible");
  }

  const { error } = await db
    .from("contact_messages")
    .insert({ name, email, phone, company, message });

  if (error) {
    redirect("/contact?error=indisponible");
  }

  await sendContactNotification({ name, email, phone, company, message });

  redirect("/contact?sent=1");
}
