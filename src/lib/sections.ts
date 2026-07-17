import { cache } from "react";
import { SERVICES, METHOD_STEPS, WHY_US, type Service } from "@/lib/services";
import { getSectionData, getSectionsRaw, deepMerge } from "@/lib/content";

// ============================================================
// REGISTRE DES SECTIONS ÉDITABLES depuis /admin/contenus.
// Chaque section = { défauts (les textes actuels du code)
// + schéma de champs (pour générer le formulaire admin) }.
// Les slugs et la structure Hn ne sont PAS éditables (SEO).
// Champs « rich » : mini-Markdown (**gras**, [lien](/url)).
// ============================================================

// ---------- Schéma de champs (sérialisable → client admin) ----------

export type LeafKind = "text" | "textarea" | "rich";

export type Field =
  | { kind: LeafKind; name: string; label: string; hint?: string }
  | { kind: "stringList"; name: string; label: string; hint?: string; rich?: boolean }
  | {
      kind: "objectList";
      name: string;
      label: string;
      itemLabel: string;
      fields: { kind: LeafKind; name: string; label: string }[];
    }
  | { kind: "group"; name: string; label: string; fields: Field[] };

export type SectionDef = {
  key: string;
  label: string;
  description: string;
  defaults: Record<string, unknown>;
  fields: Field[];
};

// ---------- Défauts : les textes actuels du site ----------

const HOME_DEFAULTS = {
  meta: {
    title:
      "Développement d'application métier sur mesure pour PME | Mailys Solutions",
    description:
      "Mailys Solutions développe des applications métier sur mesure pour PME : fini Excel et les ressaisies. Digitalisation, modernisation, maintenance WINDEV / WEBDEV.",
  },
  hero: {
    kicker: "Applications métier pour PME",
    h1: "Développement d'applications métier sur mesure pour PME",
    subtitle:
      "Remplacez les fichiers Excel, les ressaisies et les processus manuels par un logiciel conçu pour **votre** façon de travailler. Nous concevons, modernisons et maintenons les applications qui font tourner votre entreprise.",
    ctaPrimary: "Demander un devis gratuit",
    ctaSecondary: "Découvrir nos services",
    reassurance: [
      "Du vrai sur mesure",
      "Un interlocuteur unique",
      "Un suivi long terme",
    ],
  },
  services: {
    kicker: "Nos services",
    title: "Quatre façons de simplifier le quotidien de votre entreprise",
    intro:
      "Que votre besoin soit de créer un outil, de sauver un logiciel vieillissant ou d'en finir avec le papier, nous partons toujours du même point : comprendre votre métier.",
  },
  probleme: {
    title: "Vos outils vous ralentissent au lieu de vous aider ?",
    items: [
      "Des fichiers Excel partout, jamais à jour",
      "Les mêmes informations ressaisies plusieurs fois",
      "Un logiciel vieillissant que plus personne n'ose toucher",
      "Des processus qui ne tiennent que grâce aux habitudes",
      "Aucune visibilité fiable pour piloter l'activité",
    ],
    solutionTitle: "Un logiciel qui épouse vos processus — pas l'inverse",
    solutionParagraphs: [
      "Les logiciels génériques imposent leur logique : c'est à vos équipes de s'adapter, de contourner, de bricoler. Nous faisons le chemin inverse : nous étudions votre fonctionnement réel, puis nous développons [l'application métier](/services/developpement-application-metier) qui l'épouse exactement.",
      "Votre logiciel actuel a de la valeur mais vieillit mal ? Nous le [modernisons](/services/modernisation-application) sans perdre vos données. Vos équipes croulent sous le papier et les e-mails ? Nous [digitalisons vos processus](/services/digitalisation-processus). Votre application WINDEV n'a plus de développeur ? Nous en [reprenons la maintenance](/services/maintenance-windev-webdev).",
    ],
  },
  methode: {
    kicker: "Notre méthode",
    title: "Un projet mené en 8 étapes, sans jargon et sans surprise",
  },
  pourquoi: {
    title: "Pourquoi les PME nous font confiance",
  },
};

const CTA_DEFAULTS = {
  title: "Parlons de votre projet",
  text: "Décrivez-nous votre besoin en quelques lignes : nous revenons vers vous rapidement avec un premier avis honnête et un devis gratuit, sans engagement.",
  buttonLabel: "Demander un devis gratuit",
  secondaryLabel: "Voir nos réalisations",
};

const SERVICES_HUB_DEFAULTS = {
  meta: {
    title: "Nos services : développement, modernisation, digitalisation",
    description:
      "Développement d'applications métier sur mesure, modernisation d'applications, digitalisation des processus et maintenance WINDEV / WEBDEV pour PME.",
  },
  h1: "Nos services pour digitaliser votre PME",
  intro:
    "Création d'applications métier sur mesure, modernisation de logiciels existants, digitalisation des processus et maintenance WINDEV / WEBDEV : quatre expertises, une seule approche — comprendre votre métier avant de développer.",
  cta: {
    title: "Vous ne savez pas par où commencer ?",
    text: "Décrivez-nous simplement votre situation : nous vous orientons vers la bonne approche, même si elle est plus modeste que ce que vous imaginiez.",
  },
};

const APROPOS_DEFAULTS = {
  meta: {
    title: "À propos : votre partenaire digitalisation PME",
    description:
      "Mailys Solutions accompagne les PME dans leur transformation digitale : applications métier sur mesure, modernisation et maintenance WINDEV / WEBDEV.",
  },
  h1: "Le partenaire digital des PME qui veulent des outils à leur mesure",
  paragraphs: [
    "Mailys Solutions est née d'un constat simple : les PME méritent mieux que des logiciels génériques qui les obligent à tordre leur organisation — et mieux que des fichiers Excel qui craquent de partout.",
    "Notre métier : concevoir des [applications métier sur mesure](/services/developpement-application-metier) qui simplifient réellement le quotidien des équipes, [moderniser des applications existantes](/services/modernisation-application) et assurer la [maintenance évolutive d'applications WINDEV et WEBDEV](/services/maintenance-windev-webdev).",
    "Notre conviction : un bon logiciel commence par une bonne compréhension. Avant de développer, nous passons du temps dans votre réalité — vos équipes, vos contraintes, vos habitudes. C'est ce travail-là qui fait qu'un outil est adopté au lieu d'être subi.",
  ],
  valeursTitle: "Ce qui guide notre façon de travailler",
  valeurs: [
    {
      title: "La franchise",
      text: "Si un développement ne se justifie pas, nous vous le disons. Un client bien conseillé aujourd'hui est un client qui revient demain.",
    },
    {
      title: "La simplicité",
      text: "Pas de jargon, pas d'usine à gaz. Le meilleur logiciel est celui que vos équipes utilisent sans y penser.",
    },
    {
      title: "L'engagement long terme",
      text: "Nous ne livrons pas puis disparaissons : nous restons responsables de ce que nous construisons, année après année.",
    },
  ],
  methodeTitle: "Notre méthode, étape par étape",
};

const CONTACT_DEFAULTS = {
  meta: {
    title: "Contact : parlons de votre projet d'application métier",
    description:
      "Décrivez-nous votre projet d'application métier ou votre besoin de maintenance WINDEV / WEBDEV : réponse rapide, devis gratuit et sans engagement.",
  },
  h1: "Parlons de votre projet",
  intro:
    "Application métier à créer, logiciel à moderniser, processus à digitaliser ou application WINDEV à reprendre : décrivez-nous votre situation en quelques lignes. Nous revenons vers vous rapidement avec un premier avis honnête — **gratuit et sans engagement**.",
  panelTitle: "Ce qui se passe ensuite",
  steps: [
    {
      title: "Un premier échange",
      text: "30 minutes par téléphone ou visio pour comprendre votre besoin, votre contexte et vos priorités.",
    },
    {
      title: "Un avis honnête",
      text: "Nous vous disons ce que nous ferions à votre place — même si la réponse est « pas besoin de développement ».",
    },
    {
      title: "Un devis clair et détaillé",
      text: "Périmètre, étapes, délais, budget : tout est écrit noir sur blanc, sans surprise en cours de route.",
    },
  ],
};

const REALISATIONS_DEFAULTS = {
  h1: "Nos réalisations",
  intro:
    "Chaque projet raconte la même histoire : une entreprise freinée par ses outils, un logiciel conçu pour ses processus réels, des équipes qui respirent. Nos premières études de cas détaillées arrivent très prochainement.",
  placeholderTitle: "Études de cas en cours de rédaction",
  placeholderText:
    "Nous documentons actuellement plusieurs projets récents (secteurs, problématiques, résultats obtenus). En attendant, parlons directement du vôtre : c'est encore plus concret.",
  cta: {
    title: "Votre projet sera peut-être notre prochaine réalisation",
    text: "Décrivez-nous votre besoin : nous vous répondons rapidement avec un premier avis honnête, gratuit et sans engagement.",
  },
};

const BLOG_DEFAULTS = {
  h1: "Le blog de la digitalisation des PME",
  intro:
    "Guides pratiques, retours d'expérience et conseils concrets pour digitaliser votre entreprise : applications métier, automatisation des processus, modernisation de logiciels et maintenance WINDEV / WEBDEV.",
  placeholderTitle: "Les premiers articles arrivent bientôt",
  placeholderText:
    "Nous préparons une série de guides pratiques répondant aux questions que se posent les dirigeants de PME. Une question en particulier ? Posez-la nous directement.",
  cta: {
    title: "Une question sur votre projet ?",
    text: "Inutile d'attendre l'article : posez-nous directement votre question, nous y répondons avec plaisir.",
    buttonLabel: "Poser ma question",
  },
};

const FOOTER_DEFAULTS = {
  tagline:
    "Applications métier sur mesure pour PME : nous remplaçons les fichiers Excel et les processus manuels par des outils simples, rapides et adaptés à votre entreprise.",
  copyrightSuffix: "Développement d'applications métier sur mesure pour PME",
};

const METHOD_DEFAULTS = {
  steps: METHOD_STEPS.map((s) => ({ title: s.title, text: s.text })),
};

const WHY_US_DEFAULTS = {
  items: WHY_US.map((w) => ({ title: w.title, text: w.text })),
};

// ---------- Schémas de champs ----------

const titleTextFields: { kind: LeafKind; name: string; label: string }[] = [
  { kind: "text", name: "title", label: "Titre" },
  { kind: "textarea", name: "text", label: "Texte" },
];

const metaGroup: Field = {
  kind: "group",
  name: "meta",
  label: "Référencement (SEO)",
  fields: [
    { kind: "text", name: "title", label: "Balise Title (~60 caractères)" },
    { kind: "textarea", name: "description", label: "Meta description (~155 caractères)" },
  ],
};

const serviceFields: Field[] = [
  { kind: "text", name: "name", label: "Nom court (menus, cartes)" },
  { kind: "text", name: "metaTitle", label: "Balise Title SEO (~60 caractères)" },
  { kind: "textarea", name: "metaDescription", label: "Meta description SEO (~155 caractères)" },
  { kind: "text", name: "h1", label: "Titre principal (H1) — doit contenir la requête SEO" },
  { kind: "textarea", name: "heroSubtitle", label: "Sous-titre du haut de page" },
  { kind: "text", name: "problemsIntro", label: "Titre de la section problèmes" },
  { kind: "stringList", name: "problems", label: "Problèmes (une situation par ligne)" },
  { kind: "textarea", name: "consequencesIntro", label: "Introduction des conséquences" },
  { kind: "objectList", name: "consequences", label: "Conséquences", itemLabel: "Conséquence", fields: titleTextFields },
  { kind: "text", name: "solutionTitle", label: "Titre de la solution" },
  { kind: "stringList", name: "solutionParagraphs", label: "Paragraphes de la solution" },
  { kind: "stringList", name: "solutionPoints", label: "Points forts (✓)" },
  { kind: "objectList", name: "benefits", label: "Bénéfices", itemLabel: "Bénéfice", fields: titleTextFields },
  {
    kind: "objectList",
    name: "faq",
    label: "FAQ (chaque réponse est lue par Google : soignez-les)",
    itemLabel: "Question",
    fields: [
      { kind: "text", name: "question", label: "Question" },
      { kind: "textarea", name: "answer", label: "Réponse (SEO)" },
    ],
  },
];

function serviceSection(s: Service): SectionDef {
  return {
    key: `service.${s.slug}`,
    label: s.name,
    description: `Page /services/${s.slug}`,
    defaults: { ...s } as unknown as Record<string, unknown>,
    fields: serviceFields,
  };
}

// ---------- Registre ----------

export const SECTIONS: SectionDef[] = [
  {
    key: "home",
    label: "Accueil",
    description: "Page d'accueil : hero, sections, titres",
    defaults: HOME_DEFAULTS,
    fields: [
      metaGroup,
      {
        kind: "group",
        name: "hero",
        label: "Haut de page (hero)",
        fields: [
          { kind: "text", name: "kicker", label: "Badge au-dessus du titre" },
          { kind: "text", name: "h1", label: "Titre principal (H1) — contient la requête SEO" },
          { kind: "rich", name: "subtitle", label: "Sous-titre", hint: "**gras** possible" },
          { kind: "text", name: "ctaPrimary", label: "Bouton principal" },
          { kind: "text", name: "ctaSecondary", label: "Bouton secondaire" },
          { kind: "stringList", name: "reassurance", label: "Pastilles de réassurance" },
        ],
      },
      {
        kind: "group",
        name: "services",
        label: "Section services",
        fields: [
          { kind: "text", name: "kicker", label: "Badge" },
          { kind: "text", name: "title", label: "Titre (H2)" },
          { kind: "textarea", name: "intro", label: "Introduction" },
        ],
      },
      {
        kind: "group",
        name: "probleme",
        label: "Section problème → solution",
        fields: [
          { kind: "text", name: "title", label: "Titre (H2)" },
          { kind: "stringList", name: "items", label: "Problèmes listés" },
          { kind: "text", name: "solutionTitle", label: "Titre de la réponse" },
          {
            kind: "stringList",
            name: "solutionParagraphs",
            label: "Paragraphes de la réponse",
            hint: "Liens : [texte](/services/…) — ils font vivre le maillage SEO, conservez-les",
            rich: true,
          },
        ],
      },
      {
        kind: "group",
        name: "methode",
        label: "Section méthode (titres)",
        fields: [
          { kind: "text", name: "kicker", label: "Badge" },
          { kind: "text", name: "title", label: "Titre (H2)" },
        ],
      },
      {
        kind: "group",
        name: "pourquoi",
        label: "Section confiance (titre)",
        fields: [{ kind: "text", name: "title", label: "Titre (H2)" }],
      },
    ],
  },
  {
    key: "method",
    label: "Méthode (8 étapes)",
    description: "Utilisée sur l'accueil, les services et À propos",
    defaults: METHOD_DEFAULTS,
    fields: [
      { kind: "objectList", name: "steps", label: "Étapes", itemLabel: "Étape", fields: titleTextFields },
    ],
  },
  {
    key: "why_us",
    label: "Pourquoi nous choisir",
    description: "Les 6 arguments — accueil et pages services",
    defaults: WHY_US_DEFAULTS,
    fields: [
      { kind: "objectList", name: "items", label: "Arguments", itemLabel: "Argument", fields: titleTextFields },
    ],
  },
  {
    key: "cta",
    label: "Bandeau contact (bas de pages)",
    description: "Le panneau bordeaux affiché en bas de chaque page",
    defaults: CTA_DEFAULTS,
    fields: [
      { kind: "text", name: "title", label: "Titre" },
      { kind: "textarea", name: "text", label: "Texte" },
      { kind: "text", name: "buttonLabel", label: "Bouton principal" },
      { kind: "text", name: "secondaryLabel", label: "Bouton secondaire" },
    ],
  },
  ...SERVICES.map(serviceSection),
  {
    key: "services_hub",
    label: "Page Services (sommaire)",
    description: "Page /services",
    defaults: SERVICES_HUB_DEFAULTS,
    fields: [
      metaGroup,
      { kind: "text", name: "h1", label: "Titre principal (H1)" },
      { kind: "textarea", name: "intro", label: "Introduction" },
      {
        kind: "group",
        name: "cta",
        label: "Bandeau contact spécifique",
        fields: [
          { kind: "text", name: "title", label: "Titre" },
          { kind: "textarea", name: "text", label: "Texte" },
        ],
      },
    ],
  },
  {
    key: "apropos",
    label: "À propos",
    description: "Page /a-propos",
    defaults: APROPOS_DEFAULTS,
    fields: [
      metaGroup,
      { kind: "text", name: "h1", label: "Titre principal (H1)" },
      {
        kind: "stringList",
        name: "paragraphs",
        label: "Paragraphes d'introduction",
        hint: "Liens : [texte](/services/…) — maillage SEO",
        rich: true,
      },
      { kind: "text", name: "valeursTitle", label: "Titre des valeurs (H2)" },
      { kind: "objectList", name: "valeurs", label: "Valeurs", itemLabel: "Valeur", fields: titleTextFields },
      { kind: "text", name: "methodeTitle", label: "Titre de la méthode (H2)" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    description: "Page /contact",
    defaults: CONTACT_DEFAULTS,
    fields: [
      metaGroup,
      { kind: "text", name: "h1", label: "Titre principal (H1)" },
      { kind: "rich", name: "intro", label: "Introduction", hint: "**gras** possible" },
      { kind: "text", name: "panelTitle", label: "Titre du panneau étapes" },
      { kind: "objectList", name: "steps", label: "Étapes après contact", itemLabel: "Étape", fields: titleTextFields },
    ],
  },
  {
    key: "realisations",
    label: "Réalisations",
    description: "Page /realisations",
    defaults: REALISATIONS_DEFAULTS,
    fields: [
      { kind: "text", name: "h1", label: "Titre principal (H1)" },
      { kind: "textarea", name: "intro", label: "Introduction" },
      { kind: "text", name: "placeholderTitle", label: "Titre de l'encart provisoire" },
      { kind: "textarea", name: "placeholderText", label: "Texte de l'encart provisoire" },
      {
        kind: "group",
        name: "cta",
        label: "Bandeau contact spécifique",
        fields: [
          { kind: "text", name: "title", label: "Titre" },
          { kind: "textarea", name: "text", label: "Texte" },
        ],
      },
    ],
  },
  {
    key: "blog",
    label: "Blog (page d'accueil)",
    description: "Page /blog — l'intro et l'encart « bientôt »",
    defaults: BLOG_DEFAULTS,
    fields: [
      { kind: "text", name: "h1", label: "Titre principal (H1)" },
      { kind: "textarea", name: "intro", label: "Introduction" },
      { kind: "text", name: "placeholderTitle", label: "Titre de l'encart provisoire" },
      { kind: "textarea", name: "placeholderText", label: "Texte de l'encart provisoire" },
      {
        kind: "group",
        name: "cta",
        label: "Bandeau contact spécifique",
        fields: [
          { kind: "text", name: "title", label: "Titre" },
          { kind: "textarea", name: "text", label: "Texte" },
          { kind: "text", name: "buttonLabel", label: "Bouton" },
        ],
      },
    ],
  },
  {
    key: "footer",
    label: "Pied de page",
    description: "Texte de présentation du footer",
    defaults: FOOTER_DEFAULTS,
    fields: [
      { kind: "textarea", name: "tagline", label: "Texte de présentation" },
      { kind: "text", name: "copyrightSuffix", label: "Mention après le copyright" },
    ],
  },
];

export function getSectionDef(key: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.key === key);
}

// ---------- Helpers de lecture typée pour les pages publiques ----------

export type HomeContent = typeof HOME_DEFAULTS;
export type CtaContent = typeof CTA_DEFAULTS;
export type ServicesHubContent = typeof SERVICES_HUB_DEFAULTS;
export type AproposContent = typeof APROPOS_DEFAULTS;
export type ContactContent = typeof CONTACT_DEFAULTS;
export type RealisationsContent = typeof REALISATIONS_DEFAULTS;
export type BlogContent = typeof BLOG_DEFAULTS;
export type FooterContent = typeof FOOTER_DEFAULTS;
export type MethodContent = typeof METHOD_DEFAULTS;
export type WhyUsContent = typeof WHY_US_DEFAULTS;

export const getHomeContent = () => getSectionData("home", HOME_DEFAULTS);
export const getCtaContent = () => getSectionData("cta", CTA_DEFAULTS);
export const getServicesHubContent = () =>
  getSectionData("services_hub", SERVICES_HUB_DEFAULTS);
export const getAproposContent = () => getSectionData("apropos", APROPOS_DEFAULTS);
export const getContactContent = () => getSectionData("contact", CONTACT_DEFAULTS);
export const getRealisationsContent = () =>
  getSectionData("realisations", REALISATIONS_DEFAULTS);
export const getBlogContent = () => getSectionData("blog", BLOG_DEFAULTS);
export const getFooterContent = () => getSectionData("footer", FOOTER_DEFAULTS);
export const getMethodSteps = async () =>
  (await getSectionData("method", METHOD_DEFAULTS)).steps;
export const getWhyUs = async () =>
  (await getSectionData("why_us", WHY_US_DEFAULTS)).items;

/** Les 4 services (textes édités inclus) — UNE seule requête,
    mémoïsée par rendu : Footer, cartes accueil et sommaire
    partagent le même résultat. */
export const getMergedServices = cache(async (): Promise<Service[]> => {
  const raw = await getSectionsRaw(SERVICES.map((s) => `service.${s.slug}`));
  return SERVICES.map((s) => deepMerge(s, raw[`service.${s.slug}`]));
});

/** Un service avec ses textes éventuellement édités. */
export async function getMergedService(slug: string): Promise<Service | null> {
  const all = await getMergedServices();
  return all.find((s) => s.slug === slug) ?? null;
}
