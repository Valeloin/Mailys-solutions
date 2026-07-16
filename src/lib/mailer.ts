import nodemailer from "nodemailer";

// Notification email des demandes de contact (optionnelle).
// Sans SMTP configuré, la fonction ne fait rien : le message est
// de toute façon enregistré en base et visible dans /admin/messages.

export async function sendContactNotification(msg: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_NOTIFY_TO } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_NOTIFY_TO) return;

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: Number(SMTP_PORT || 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Mailys Solutions" <${SMTP_USER}>`,
      to: CONTACT_NOTIFY_TO,
      replyTo: msg.email,
      subject: `Nouvelle demande de contact — ${msg.name}`,
      text: [
        `Nom : ${msg.name}`,
        `Email : ${msg.email}`,
        msg.phone && `Téléphone : ${msg.phone}`,
        msg.company && `Entreprise : ${msg.company}`,
        "",
        msg.message,
        "",
        "— Formulaire de contact mailys-solutions.com",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch {
    // L'échec d'envoi ne doit jamais faire échouer le formulaire :
    // le message est déjà enregistré en base.
  }
}
