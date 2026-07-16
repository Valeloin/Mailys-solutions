// Configuration globale du site — un seul endroit pour les infos de marque.
// ⚠️ Les coordonnées (téléphone, adresse, SIRET) sont à compléter dès que
// le client les fournit : elles alimentent le footer et le Schema.org.

export const SITE = {
  name: "Mailys Solutions",
  url: "https://www.mailys-solutions.com",
  description:
    "Développement d'applications métier sur mesure pour PME : digitalisation des processus, modernisation d'applications et maintenance WINDEV / WEBDEV.",
  email: "contact@mailys-solutions.com",
  // À compléter (client) :
  phone: "",
  address: "",
  locale: "fr_FR",
} as const;
