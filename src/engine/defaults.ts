import type { Block, Page } from "./types";

// Contenu par défaut de la vitrine Mailys, exprimé en blocs Simple Dev.
// Vrai texte, vrais liens (aucun "#"). Sert à la fois de repli à getContent
// (le site n'est jamais cassé) et de point de départ éditable via l'extension.
// La structure de haut niveau (sections) est VERROUILLÉE (verrou: true) :
// insupprimable dans l'extension, mais le contenu reste éditable.

const C = {
  texte: "#ffffff",
  muted: "#d6c8cb",
  coral: "#ff6b6b",
  accent: "#e11d2a",
  orange: "#f97316",
};

// ---- Fabriques de blocs ----------------------------------------------------
function titre(
  id: string,
  contenu: string,
  niveau: number,
  css?: Record<string, string>,
): Block {
  return { id, type: "titre", content: { texte: contenu, niveau }, css };
}

function texte(id: string, contenu: string, css?: Record<string, string>): Block {
  return { id, type: "texte", content: { texte: contenu }, css };
}

function bouton(
  id: string,
  contenu: string,
  lien: string,
  css?: Record<string, string>,
): Block {
  return { id, type: "bouton", content: { texte: contenu, lien }, css };
}

// Bouton secondaire : contour clair, fond transparent.
function boutonOutline(id: string, contenu: string, lien: string): Block {
  return bouton(id, contenu, lien, {
    backgroundImage: "none",
    background: "transparent",
    boxShadow: "none",
    color: C.texte,
    border: "1px solid rgba(255,255,255,0.35)",
  });
}

// ---- Les 4 services (contenu réel, vrais liens vers leurs pages) -----------
const SERVICES = [
  {
    slug: "developpement-application-metier",
    tag: "Sur mesure, pour vos process",
    nom: "Développement d'application métier",
    desc: "Nous développons des applications métier sur mesure qui remplacent les fichiers Excel, les ressaisies et les processus manuels par un outil simple, rapide et parfaitement adapté au fonctionnement de votre PME.",
  },
  {
    slug: "modernisation-application",
    tag: "Moderniser sans tout refaire",
    nom: "Modernisation d'application",
    desc: "Votre application a fait ses preuves, mais elle vieillit : lenteurs, interface datée, technologies dépassées. Nous la modernisons sans perdre vos données ni interrompre votre activité.",
  },
  {
    slug: "digitalisation-processus",
    tag: "Du papier au numérique",
    nom: "Digitalisation des processus",
    desc: "Bons d'intervention papier, validations par e-mail, tableaux recopiés à la main : nous transformons vos processus manuels en circuits digitaux fluides, traçables et automatisés.",
  },
  {
    slug: "maintenance-windev-webdev",
    tag: "Votre appli entre de bonnes mains",
    nom: "Maintenance WINDEV / WEBDEV",
    desc: "Votre application WINDEV ou WEBDEV n'a plus de développeur, ou votre prestataire ne répond plus ? Nous reprenons votre code, corrigeons, sécurisons et faisons évoluer votre application.",
  },
];

function carteService(s: (typeof SERVICES)[number]): Block {
  return {
    id: `svc-${s.slug}`,
    type: "groupe",
    content: { nom: s.nom },
    css: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "24px",
      borderRadius: "20px",
      border: "1px solid #3d262c",
      background: "rgba(50,8,14,0.35)",
    },
    children: [
      texte(`svc-tag-${s.slug}`, s.tag.toUpperCase(), {
        color: C.orange,
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.16em",
        margin: "0",
      }),
      titre(`svc-nom-${s.slug}`, s.nom, 3, {
        color: C.texte,
        fontSize: "22px",
        fontWeight: "700",
        margin: "4px 0 0",
      }),
      texte(`svc-desc-${s.slug}`, s.desc, {
        color: C.muted,
        margin: "4px 0 12px",
      }),
      bouton(`svc-cta-${s.slug}`, "Découvrir ce service", `/services/${s.slug}`, {
        alignSelf: "flex-start",
        backgroundImage: "none",
        background: "transparent",
        boxShadow: "none",
        color: C.orange,
        padding: "0",
        minHeight: "auto",
        fontWeight: "600",
      }),
    ],
  };
}

// ---- Section HÉRO ----------------------------------------------------------
const hero: Block = {
  id: "hero",
  type: "section",
  verrou: true,
  css: {
    maxWidth: "1100px",
    padding: "5rem 1.5rem",
    textAlign: "center",
  },
  mobile: { padding: "3rem 1.25rem" },
  children: [
    texte("hero-kicker", "APPLICATIONS MÉTIERS POUR PME", {
      color: C.coral,
      fontSize: "13px",
      fontWeight: "700",
      letterSpacing: "0.18em",
      margin: "0 auto 1rem",
    }),
    titre(
      "hero-titre",
      "Développement d'applications métier sur mesure pour PME",
      1,
      {
        color: C.texte,
        fontSize: "44px",
        fontWeight: "800",
        lineHeight: "1.1",
        maxWidth: "20ch",
        margin: "0 auto 1rem",
      },
    ),
    texte(
      "hero-sous-titre",
      "Remplacez les fichiers Excel, les ressaisies et les processus manuels par un logiciel conçu pour votre façon de travailler. Nous concevons, modernisons et maintenons les applications qui font tourner votre entreprise.",
      { color: C.muted, fontSize: "18px", maxWidth: "60ch", margin: "0 auto 2rem" },
    ),
    {
      id: "hero-actions",
      type: "groupe",
      css: {
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        flexWrap: "wrap",
      },
      mobile: { flexDirection: "column", alignItems: "stretch" },
      children: [
        bouton("hero-cta-devis", "Demander un devis gratuit", "/contact"),
        boutonOutline("hero-cta-services", "Découvrir nos services", "/services"),
      ],
    },
  ],
};

// ---- Section SERVICES ------------------------------------------------------
const services: Block = {
  id: "services",
  type: "section",
  verrou: true,
  css: { maxWidth: "1100px", padding: "4rem 1.5rem" },
  mobile: { padding: "2.5rem 1.25rem" },
  children: [
    texte("services-kicker", "NOS SERVICES", {
      color: C.coral,
      fontSize: "13px",
      fontWeight: "700",
      letterSpacing: "0.18em",
      margin: "0 0 0.75rem",
    }),
    titre(
      "services-titre",
      "Quatre façons de simplifier le quotidien de votre entreprise",
      2,
      {
        color: C.texte,
        fontSize: "32px",
        fontWeight: "800",
        maxWidth: "22ch",
        margin: "0 0 0.75rem",
      },
    ),
    texte(
      "services-intro",
      "Que votre besoin soit de créer un outil, de sauver un logiciel vieillissant ou d'en finir avec le papier, nous partons toujours du même point : comprendre votre métier.",
      { color: C.muted, maxWidth: "60ch", margin: "0 0 2rem" },
    ),
    {
      id: "services-grille",
      type: "groupe",
      css: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "20px",
      },
      mobile: { gridTemplateColumns: "1fr" },
      children: SERVICES.map(carteService),
    },
  ],
};

export const pageDemo: Page = {
  id: "accueil",
  titre: "Accueil",
  blocks: [hero, services],
};
