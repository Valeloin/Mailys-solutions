import nodemailer from "nodemailer";

// ============================================================
// Envoi des emails du site, par le SMTP de la boîte Mailys.
//
// Les emails de l'espace client (invitation, réinitialisation)
// passent ici et non par le service intégré de Supabase : celui-ci
// est limité à quelques envois par heure et n'est pas prévu pour
// la production. Supabase ne sert qu'à fabriquer le lien signé,
// c'est notre boîte qui le porte — avec notre mise en forme.
// ============================================================

/** Vrai si le SMTP est renseigné. Sans lui, aucune invitation ne part. */
export function isMailerConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // 465 = SSL implicite ; 587 = STARTTLS, négocié après connexion.
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/** Adresse de réponse affichée au client.
    L'expéditeur technique est la boîte SMTP configurée, qui n'est pas
    forcément une adresse Mailys : sans Reply-To, une réponse du client
    partait vers cette boîte-là. */
const REPLY_TO = process.env.CONTACT_NOTIFY_TO || process.env.SMTP_USER;

/** Version texte du message.
    Un email en HTML seul, sans partie texte, est un point de score
    anti-spam à lui tout seul — et c'est justement ce qui manquait aux
    invitations qui n'arrivaient pas. Toute variante multipart doit dire
    la même chose que le HTML, filtres à l'appui. */
function texte(title: string, corps: string, cta: { href: string; label: string }) {
  return [
    title,
    "",
    corps,
    "",
    `${cta.label} :`,
    cta.href,
    "",
    "—",
    "Mailys Solutions — applications métier sur mesure pour PME",
  ].join("\n");
}

/** Gabarit commun : la même grammaire visuelle que le site. */
function layout(title: string, body: string, cta: { href: string; label: string }) {
  return `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
  <div style="height:4px;border-radius:2px;background:linear-gradient(90deg,#ff6b6b,#e11d2a 45%,#f97316)"></div>
  <h1 style="margin:28px 0 0;font-size:20px;font-weight:700">${title}</h1>
  ${body}
  <p style="margin:28px 0">
    <a href="${cta.href}" style="display:inline-block;background:#e11d2a;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:12px">${cta.label}</a>
  </p>
  <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#666">
    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
    <span style="word-break:break-all">${cta.href}</span>
  </p>
  <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e8e0dd;font-size:12px;color:#666">
    Mailys Solutions — applications métier sur mesure pour PME
  </p>
</div>`.trim();
}

/**
 * Invitation à rejoindre l'espace client.
 * `link` est le lien signé fabriqué par Supabase : il vaut connexion,
 * il ne doit donc jamais être relayé ailleurs qu'au destinataire.
 */
export async function sendClientInvitation(to: string, link: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) throw new Error("SMTP non configuré");

  const cta = { href: link, label: "Choisir mon mot de passe" };

  await transporter.sendMail({
    from: `"Mailys Solutions" <${process.env.SMTP_USER}>`,
    replyTo: REPLY_TO,
    to,
    subject: "Votre accès à l'espace client Mailys Solutions",
    text: texte(
      "Bienvenue dans votre espace client",
      "Nous vous avons ouvert un accès à votre espace client. Vous pourrez y déclarer un ticket et suivre son traitement à tout moment.\n\nOuvrez le lien ci-dessous pour choisir votre mot de passe.",
      cta
    ),
    html: layout(
      "Bienvenue dans votre espace client",
      `<p style="margin:16px 0 0;font-size:14px;line-height:1.7">
         Nous vous avons ouvert un accès à votre espace client. Vous pourrez y
         déclarer un ticket et suivre son traitement à tout moment.
       </p>
       <p style="margin:12px 0 0;font-size:14px;line-height:1.7">
         Cliquez ci-dessous pour choisir votre mot de passe.
       </p>`,
      cta
    ),
  });
}

/** Lien de réinitialisation du mot de passe. */
export async function sendPasswordReset(to: string, link: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) throw new Error("SMTP non configuré");

  const cta = { href: link, label: "Choisir un nouveau mot de passe" };

  await transporter.sendMail({
    from: `"Mailys Solutions" <${process.env.SMTP_USER}>`,
    replyTo: REPLY_TO,
    to,
    subject: "Réinitialiser votre mot de passe",
    text: texte(
      "Réinitialiser votre mot de passe",
      "Vous avez demandé à réinitialiser le mot de passe de votre espace client. Ce lien est valable une heure.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe actuel reste valable.",
      cta
    ),
    html: layout(
      "Réinitialiser votre mot de passe",
      `<p style="margin:16px 0 0;font-size:14px;line-height:1.7">
         Vous avez demandé à réinitialiser le mot de passe de votre espace
         client. Ce lien est valable une heure.
       </p>
       <p style="margin:12px 0 0;font-size:14px;line-height:1.7">
         Si vous n'êtes pas à l'origine de cette demande, ignorez cet email :
         votre mot de passe actuel reste valable.
       </p>`,
      cta
    ),
  });
}

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
