// Configuration globale du site — un seul endroit pour les infos de marque.
// ⚠️ Les coordonnées (téléphone, adresse, SIRET) sont à compléter dès que
// le client les fournit : elles alimentent le footer et le Schema.org.

// Emails autorisés à accéder à l'administration (/admin).
// Doit rester aligné avec la fonction is_admin() côté Supabase
// (supabase/migrations/002_harden_rls.sql).
export const ADMIN_EMAILS = [
  "v.condamy@gmail.com",
  "mailyscondamy.pro@gmail.com",
];

export const SITE = {
  name: "Mailys Solutions",
  url: "https://www.mailys-solutions.fr",
  description:
    "Développement d'applications métier sur mesure pour PME : digitalisation des processus, modernisation d'applications et maintenance WINDEV / WEBDEV.",
  email: "contact@mailys-solutions.fr",
  // À compléter (client) :
  phone: "",
  address: "",
  locale: "fr_FR",
} as const;
