// ============================================================
// SOURCE UNIQUE DE CONTENU des 4 pages services.
// Chaque service = 1 requête SEO principale = 1 page.
// La structure suit la méthode PAS : Problème → Agitation → Solution.
// Ce fichier alimente : les pages, le sitemap, le Schema.org
// et le maillage interne. (Sera migré vers Supabase avec l'admin.)
// ============================================================

export type Faq = { question: string; answer: string };

export type Service = {
  slug: string;
  /** Nom court — menus, cartes, maillage interne */
  name: string;
  /** Requête SEO principale ciblée par la page */
  query: string;
  /** Balise <title> (~60 caractères) */
  metaTitle: string;
  /** Meta description orientée taux de clic (~155 caractères) */
  metaDescription: string;
  /** H1 : requête + bénéfice */
  h1: string;
  heroSubtitle: string;
  /** Bloc 2 — Les problématiques rencontrées */
  problemsIntro: string;
  problems: string[];
  /** Bloc 3 — Les conséquences */
  consequencesIntro: string;
  consequences: { title: string; text: string }[];
  /** Bloc 4 — La solution */
  solutionTitle: string;
  solutionParagraphs: string[];
  solutionPoints: string[];
  /** Bloc 5 — Les bénéfices */
  benefits: { title: string; text: string }[];
  /** Bloc 8 — FAQ (chaque réponse est optimisée SEO) */
  faq: Faq[];
};

// ------------------------------------------------------------
// Blocs communs aux 4 pages (méthode, pourquoi nous)
// ------------------------------------------------------------

export const METHOD_STEPS = [
  {
    title: "Découverte",
    text: "Nous prenons le temps de comprendre votre entreprise : votre activité, vos équipes, vos contraintes et vos objectifs. Aucune ligne de code avant d'avoir compris votre métier.",
  },
  {
    title: "Analyse",
    text: "Nous observons vos processus réels — pas ceux du papier — pour identifier les points de friction, les doubles saisies et les tâches automatisables.",
  },
  {
    title: "Cadrage",
    text: "Nous cadrons le projet avec vous : périmètre, priorités, budget et planning. Vous validez un devis clair et détaillé avant tout démarrage.",
  },
  {
    title: "Conception",
    text: "Nous concevons les écrans et les parcours avec vos utilisateurs. Vous validez une maquette concrète avant tout développement.",
  },
  {
    title: "Développement",
    text: "Nous développons par étapes courtes, avec des points réguliers. Vous voyez l'application avancer et vous gardez la main sur les priorités.",
  },
  {
    title: "Tests",
    text: "Chaque fonctionnalité est testée avec vos données et vos cas réels avant la mise en production. Pas de mauvaise surprise au lancement.",
  },
  {
    title: "Déploiement",
    text: "Mise en production progressive, reprise de vos données existantes et formation de vos équipes sur leur outil.",
  },
  {
    title: "Accompagnement",
    text: "Après la mise en ligne, nous restons à vos côtés : support, corrections, évolutions. Votre application grandit avec votre entreprise.",
  },
] as const;

export const WHY_US = [
  {
    title: "Un accompagnement de A à Z",
    text: "De la première réunion à la maintenance, vous êtes accompagné à chaque étape par la même équipe.",
  },
  {
    title: "Du vrai sur mesure",
    text: "Pas de logiciel générique adapté à la va-vite : votre application est conçue pour vos processus, pas l'inverse.",
  },
  {
    title: "La compréhension métier d'abord",
    text: "Notre travail commence par comprendre comment votre entreprise fonctionne. La technique vient ensuite.",
  },
  {
    title: "Un interlocuteur unique",
    text: "Une seule personne suit votre projet du début à la fin. Pas de perte d'information, pas de discours commercial déconnecté.",
  },
  {
    title: "Un suivi long terme",
    text: "Nous construisons des relations qui durent : votre application est maintenue, corrigée et améliorée dans le temps.",
  },
  {
    title: "Un logiciel évolutif",
    text: "Votre outil est conçu pour évoluer : nouvelles fonctionnalités, nouveaux utilisateurs, nouvelles activités.",
  },
] as const;

// ------------------------------------------------------------
// Les 4 services
// ------------------------------------------------------------

export const SERVICES: Service[] = [
  {
    slug: "developpement-application-metier",
    name: "Développement d'application métier",
    query: "application métier sur mesure",
    metaTitle: "Application métier sur mesure pour PME | Mailys Solutions",
    metaDescription:
      "Développement d'applications métier sur mesure pour PME : remplacez Excel et les saisies manuelles par un logiciel adapté à vos processus. Devis gratuit.",
    h1: "Application métier sur mesure : un logiciel qui travaille enfin comme vous",
    heroSubtitle:
      "Nous développons des applications métier sur mesure qui remplacent les fichiers Excel, les ressaisies et les processus manuels par un outil simple, rapide et parfaitement adapté au fonctionnement de votre PME.",
    problemsIntro:
      "Votre entreprise tourne, mais vos outils ne suivent plus. Ces situations vous parlent ?",
    problems: [
      "Vos données vivent dans des fichiers Excel dispersés, dupliqués, jamais tout à fait à jour",
      "Vos équipes ressaisissent les mêmes informations dans plusieurs outils",
      "Personne n'a de vision d'ensemble : chaque service a « sa » version de la vérité",
      "Les erreurs de saisie se glissent partout et se découvrent trop tard",
      "Les logiciels du marché ne collent jamais vraiment à votre façon de travailler",
      "Vos collaborateurs contournent les outils en place parce qu'ils les ralentissent",
      "Chaque nouveau salarié met des semaines à comprendre « comment on fait ici »",
    ],
    consequencesIntro:
      "Ces frictions du quotidien ont un coût bien réel — même s'il n'apparaît sur aucune facture.",
    consequences: [
      {
        title: "Des heures perdues chaque semaine",
        text: "Ressaisies, recherches d'informations, consolidations manuelles : mises bout à bout, ces tâches représentent souvent plusieurs journées de travail par mois et par personne.",
      },
      {
        title: "Des coûts cachés qui s'accumulent",
        text: "Une erreur de commande, un devis oublié, une relance manquée : chaque dysfonctionnement pris isolément semble anodin, mais leur somme pèse directement sur votre marge.",
      },
      {
        title: "Un pilotage à l'aveugle",
        text: "Sans données fiables et centralisées, impossible de savoir en temps réel où en est l'activité. Les décisions se prennent au ressenti, pas sur des chiffres.",
      },
      {
        title: "Un frein à la croissance",
        text: "Ce qui fonctionne à 5 personnes casse à 15. Des processus manuels non standardisés empêchent d'embaucher, de déléguer et de développer l'activité sereinement.",
      },
    ],
    solutionTitle:
      "La solution : une application métier conçue pour vos processus",
    solutionParagraphs: [
      "Une application métier sur mesure, c'est un logiciel construit à partir de votre fonctionnement réel — pas un outil générique dans lequel il faudrait faire rentrer votre entreprise de force.",
      "Concrètement : vos équipes retrouvent toutes les informations au même endroit, les saisies redondantes disparaissent, les tâches répétitives s'automatisent et chacun travaille dans un outil pensé pour son poste.",
      "Avant d'écrire la moindre ligne de code, nous étudions votre façon de travailler. C'est cette compréhension de votre métier qui fait la différence entre un logiciel qu'on subit et un logiciel qu'on adopte.",
    ],
    solutionPoints: [
      "100 % sur mesure : chaque écran correspond à une étape réelle de votre activité",
      "Adapté à vos processus, sans changer ce qui fonctionne déjà",
      "Évolutif : l'application grandit avec votre entreprise",
      "Simple d'utilisation : vos équipes sont opérationnelles en quelques heures",
      "Sécurisé : vos données sont protégées, sauvegardées et accessibles selon les droits de chacun",
      "Connecté à vos outils existants : comptabilité, messagerie, tableurs…",
    ],
    benefits: [
      {
        title: "Gain de temps immédiat",
        text: "Les tâches répétitives sont automatisées, les informations saisies une seule fois.",
      },
      {
        title: "Moins d'erreurs",
        text: "Contrôles automatiques, données centralisées : les erreurs de saisie disparaissent.",
      },
      {
        title: "Visibilité en temps réel",
        text: "Tableaux de bord et indicateurs à jour en permanence, sans consolidation manuelle.",
      },
      {
        title: "Meilleure collaboration",
        text: "Tout le monde travaille sur les mêmes données, au même endroit.",
      },
      {
        title: "Productivité en hausse",
        text: "Vos équipes se concentrent sur leur métier, pas sur la manipulation de fichiers.",
      },
      {
        title: "Pilotage simplifié",
        text: "Vous décidez sur des chiffres fiables, disponibles en un clic.",
      },
    ],
    faq: [
      {
        question: "Combien coûte le développement d'une application métier sur mesure ?",
        answer:
          "Le coût d'une application métier sur mesure dépend du périmètre fonctionnel : nombre d'écrans, automatisations, connexions à vos outils existants. Un premier module opérationnel démarre généralement à quelques milliers d'euros, et nous procédons par étapes pour que chaque phase apporte un résultat concret. Après un échange sur vos besoins, vous recevez un devis détaillé, précis et sans engagement.",
      },
      {
        question: "Combien de temps faut-il pour développer un logiciel métier ?",
        answer:
          "Une première version utilisable d'une application métier est généralement livrée en quelques semaines à quelques mois selon la complexité. Nous privilégions des mises en production rapides et progressives : vous utilisez les premières fonctionnalités pendant que les suivantes sont développées, plutôt que d'attendre un « grand soir » risqué.",
      },
      {
        question: "Une application sur mesure est-elle plus chère qu'un logiciel du marché ?",
        answer:
          "À l'achat, un logiciel du marché semble moins cher. Mais sur la durée, les licences par utilisateur, les fonctions inutiles facturées, les adaptations impossibles et le temps perdu à contourner l'outil inversent souvent le calcul. Une application métier sur mesure est un actif qui vous appartient : pas d'abonnement par poste, et chaque euro investi correspond à un besoin réel de votre entreprise.",
      },
      {
        question: "Le logiciel pourra-t-il évoluer avec mon entreprise ?",
        answer:
          "Oui, c'est même l'un des principaux avantages du sur mesure. Votre application est conçue dès le départ pour être évolutive : ajout de fonctionnalités, de nouveaux utilisateurs, adaptation à une nouvelle activité ou à une nouvelle réglementation. Vous n'êtes jamais bloqué par la feuille de route d'un éditeur tiers.",
      },
      {
        question: "Que deviennent mes données Excel actuelles ?",
        answer:
          "Vos données existantes sont récupérées et importées dans la nouvelle application lors du déploiement. Rien n'est perdu : vos historiques, vos clients, vos références sont repris, nettoyés au passage (doublons, incohérences) et centralisés dans votre nouvel outil.",
      },
      {
        question: "Mes équipes vont-elles réussir à utiliser le nouvel outil ?",
        answer:
          "C'est justement la force d'un logiciel sur mesure : il reproduit le vocabulaire et la logique de travail de vos équipes, ce qui rend la prise en main naturelle. Nous formons vos collaborateurs lors du déploiement et restons disponibles ensuite. Un outil bien conçu n'a pas besoin d'un manuel de 100 pages.",
      },
    ],
  },
  {
    slug: "modernisation-application",
    name: "Modernisation d'application",
    query: "modernisation d'application",
    metaTitle: "Modernisation d'application métier | Mailys Solutions",
    metaDescription:
      "Votre logiciel métier vieillit ? Modernisation d'application sans perte de données ni interruption d'activité : interface, performances, sécurité. Devis gratuit.",
    h1: "Modernisation d'application : donnez un avenir à votre logiciel métier",
    heroSubtitle:
      "Votre application a fait ses preuves, mais elle vieillit : lenteurs, interface datée, technologies dépassées. Nous la modernisons sans perdre vos données ni interrompre votre activité.",
    problemsIntro:
      "Votre logiciel actuel a longtemps rendu service, mais aujourd'hui…",
    problems: [
      "L'interface a 15 ans et rebute les nouveaux collaborateurs",
      "L'application rame, plante ou affiche des messages d'erreur incompréhensibles",
      "Elle ne fonctionne que sur certains postes, impossible d'y accéder à distance",
      "Le développeur d'origine n'est plus disponible, personne n'ose toucher au code",
      "Chaque évolution demandée est « impossible » ou hors de prix",
      "Elle ne communique avec aucun de vos outils récents",
      "Les mises à jour Windows menacent de la casser à chaque fois",
    ],
    consequencesIntro:
      "Garder une application vieillissante sans agir, c'est accepter des risques qui grandissent chaque année.",
    consequences: [
      {
        title: "Le risque d'un arrêt brutal",
        text: "Un logiciel qui ne tient que par habitude peut cesser de fonctionner du jour au lendemain : changement de serveur, mise à jour système, départ d'une personne clé. Sans plan, c'est toute l'activité qui s'arrête.",
      },
      {
        title: "Une productivité qui s'érode",
        text: "Lenteurs, plantages, redémarrages : quelques minutes perdues plusieurs fois par jour, multipliées par le nombre de postes, représentent des semaines de travail par an.",
      },
      {
        title: "Des données vulnérables",
        text: "Les technologies obsolètes ne reçoivent plus de correctifs de sécurité. Vos données clients et votre savoir-faire reposent sur des fondations fragiles.",
      },
      {
        title: "Une entreprise moins attractive",
        text: "Difficile de recruter et de retenir des talents en leur imposant des outils d'un autre temps. L'image de l'entreprise se joue aussi sur ses logiciels internes.",
      },
    ],
    solutionTitle:
      "La solution : moderniser votre application en préservant ce qui fait sa valeur",
    solutionParagraphs: [
      "Moderniser une application, ce n'est pas tout jeter pour repartir de zéro. Votre logiciel actuel contient des années de règles métier éprouvées : notre travail consiste à préserver cette valeur tout en renouvelant ce qui doit l'être.",
      "Selon l'état de l'existant, nous procédons par refonte progressive (module par module, sans interruption d'activité) ou par réécriture complète avec reprise intégrale de vos données. Dans les deux cas, vos équipes continuent de travailler pendant la transition.",
      "Le résultat : une application rapide, sécurisée, accessible depuis n'importe quel poste, avec une interface moderne que vos équipes prennent en main naturellement — et qui redevient possible à faire évoluer.",
    ],
    solutionPoints: [
      "Audit préalable de l'existant : ce qui doit être conservé, amélioré ou remplacé",
      "Reprise complète de vos données et de vos historiques",
      "Transition progressive, sans interruption de votre activité",
      "Interface moderne, rapide et accessible à distance",
      "Technologies actuelles et maintenues, correctifs de sécurité garantis",
      "Application de nouveau évolutive : vos futures demandes redeviennent possibles",
    ],
    benefits: [
      {
        title: "Fin des lenteurs et des plantages",
        text: "Des performances retrouvées sur tous les postes, y compris à distance.",
      },
      {
        title: "Sécurité remise à niveau",
        text: "Technologies maintenues, sauvegardes fiables, données protégées.",
      },
      {
        title: "Zéro perte de données",
        text: "Historiques, clients, références : tout est repris et fiabilisé.",
      },
      {
        title: "Adoption immédiate",
        text: "Vos équipes retrouvent leur logique de travail dans une interface moderne.",
      },
      {
        title: "Évolutions débloquées",
        text: "Les demandes « impossibles » redeviennent des évolutions ordinaires.",
      },
      {
        title: "Sérénité retrouvée",
        text: "Plus de crainte à chaque mise à jour Windows ou changement de serveur.",
      },
    ],
    faq: [
      {
        question: "Faut-il moderniser mon application ou la réécrire entièrement ?",
        answer:
          "Cela dépend de l'état du code existant, des technologies utilisées et de vos objectifs. Une modernisation progressive préserve l'investissement existant et lisse le budget ; une réécriture s'impose quand les fondations sont trop fragiles. Nous réalisons systématiquement un audit préalable pour vous recommander l'option la plus rentable — pas la plus grosse.",
      },
      {
        question: "Vais-je perdre mes données pendant la modernisation ?",
        answer:
          "Non. La reprise des données fait partie intégrante du projet : vos historiques, fichiers clients et références sont migrés, testés et vérifiés avant la bascule. C'est même souvent l'occasion de nettoyer les doublons et les incohérences accumulés au fil des années.",
      },
      {
        question: "Mon activité va-t-elle être interrompue pendant les travaux ?",
        answer:
          "Non. Nous organisons la transition pour que vos équipes continuent de travailler : modernisation module par module, bascule planifiée hors des périodes critiques, et période de fonctionnement en parallèle si nécessaire. L'objectif est que la modernisation soit un soulagement, jamais une crise.",
      },
      {
        question: "Pouvez-vous reprendre une application dont le développeur a disparu ?",
        answer:
          "Oui, c'est une situation que nous rencontrons régulièrement. Même sans documentation et sans contact avec le développeur d'origine, nous analysons le code et la base de données existants pour reconstituer le fonctionnement de l'application avant de la moderniser ou de la réécrire.",
      },
      {
        question: "Combien coûte la modernisation d'une application ?",
        answer:
          "Le budget dépend de la taille de l'application et de la profondeur de la modernisation (interface seule, moteur complet, ou réécriture). L'audit initial permet de chiffrer précisément chaque option. Dans tous les cas, le coût doit être comparé à celui du statu quo : temps perdu, risques de panne et évolutions bloquées.",
      },
    ],
  },
  {
    slug: "digitalisation-processus",
    name: "Digitalisation des processus",
    query: "digitalisation des processus métier",
    metaTitle: "Digitalisation des processus métier | Mailys Solutions",
    metaDescription:
      "Digitalisez vos processus métier : fini le papier, les ressaisies et les tâches manuelles. Automatisation sur mesure pour PME. Diagnostic gratuit.",
    h1: "Digitalisation des processus métier : éliminez le papier, les ressaisies et les oublis",
    heroSubtitle:
      "Bons d'intervention papier, validations par e-mail, tableaux recopiés à la main : nous transformons vos processus manuels en circuits digitaux fluides, traçables et automatisés.",
    problemsIntro:
      "Dans beaucoup de PME, des processus entiers reposent encore sur le papier, les e-mails et la mémoire des collaborateurs…",
    problems: [
      "Des bons d'intervention, de livraison ou de contrôle remplis à la main puis ressaisis au bureau",
      "Des demandes de congés, d'achats ou de validations qui circulent par e-mail et se perdent",
      "Des processus que seul « celui qui sait » maîtrise de bout en bout",
      "Aucune traçabilité : impossible de savoir qui a fait quoi, quand",
      "Des documents introuvables au moment où on en a besoin",
      "Des étapes oubliées parce que rien ne relance personne",
      "Chaque service fonctionne à sa manière, sans standard commun",
    ],
    consequencesIntro:
      "Un processus manuel n'est pas seulement lent : il est fragile, opaque et impossible à déléguer.",
    consequences: [
      {
        title: "Le double travail permanent",
        text: "Chaque information manipulée sur papier ou par e-mail finit ressaisie dans un tableur ou un logiciel. Ce travail en double mobilise des heures qui ne produisent aucune valeur.",
      },
      {
        title: "Des délais qui s'allongent",
        text: "Une validation qui attend dans une boîte mail, un bon qui traîne dans une camionnette : chaque étape manuelle ajoute des jours au traitement d'un dossier — et vos clients le ressentent.",
      },
      {
        title: "Une dépendance aux personnes",
        text: "Quand un processus n'existe que dans la tête d'un collaborateur, son absence ou son départ paralyse le service. Impossible de déléguer, de former, de remplacer sereinement.",
      },
      {
        title: "Aucune donnée pour s'améliorer",
        text: "Ce qui n'est pas digitalisé n'est pas mesurable : impossible de connaître les délais réels, les goulots d'étranglement, les volumes. On ne peut pas améliorer ce qu'on ne voit pas.",
      },
    ],
    solutionTitle:
      "La solution : des processus digitalisés, traçables et automatisés",
    solutionParagraphs: [
      "Digitaliser un processus métier, c'est transformer un circuit manuel (papier, e-mails, tableurs) en un parcours digital structuré : chaque étape est guidée, chaque information saisie une seule fois, chaque action tracée.",
      "Concrètement : le technicien remplit son bon d'intervention sur sa tablette et le bureau le reçoit instantanément ; la demande d'achat suit un circuit de validation automatique avec relances ; le dossier client se constitue tout seul à mesure que les étapes avancent.",
      "Nous commençons toujours par cartographier vos processus réels avec vos équipes. La digitalisation réussie ne plaque pas un outil sur l'existant : elle simplifie d'abord, automatise ensuite.",
    ],
    solutionPoints: [
      "Cartographie de vos processus réels avant tout développement",
      "Saisie unique : l'information entre une fois et circule toute seule",
      "Circuits de validation automatiques avec relances intégrées",
      "Accessible partout : bureau, atelier, chantier, mobilité",
      "Traçabilité complète : qui, quoi, quand — sans effort supplémentaire",
      "Connexion avec vos outils existants (comptabilité, paie, messagerie…)",
    ],
    benefits: [
      {
        title: "Des heures libérées",
        text: "Les ressaisies et les relances manuelles disparaissent, les équipes se recentrent sur leur métier.",
      },
      {
        title: "Des délais divisés",
        text: "Les dossiers avancent seuls d'étape en étape, sans temps mort ni oubli.",
      },
      {
        title: "Des processus standardisés",
        text: "La même demande suit le même circuit, quel que soit le service ou la personne.",
      },
      {
        title: "Une traçabilité totale",
        text: "Chaque action est horodatée et retrouvable en quelques secondes.",
      },
      {
        title: "Une entreprise moins dépendante",
        text: "Le savoir-faire est dans le processus, plus seulement dans les têtes.",
      },
      {
        title: "Des données pour piloter",
        text: "Volumes, délais, goulots d'étranglement : vous voyez enfin ce qui se passe.",
      },
    ],
    faq: [
      {
        question: "Par quel processus faut-il commencer la digitalisation ?",
        answer:
          "Par celui qui combine fort volume, forte friction et faible complexité : c'est là que le retour sur investissement est le plus rapide et le plus visible. Souvent, il s'agit des bons d'intervention, des demandes internes (achats, congés) ou du suivi des dossiers clients. Notre diagnostic initial identifie ce premier processus avec vous.",
      },
      {
        question: "La digitalisation des processus, est-ce réservé aux grandes entreprises ?",
        answer:
          "Non, au contraire : c'est dans les PME que l'impact est le plus rapide. Les circuits de décision sont courts, les processus moins figés et chaque heure libérée compte. Une digitalisation ciblée sur un processus clé transforme le quotidien d'une PME en quelques semaines, sans projet pharaonique.",
      },
      {
        question: "Mes équipes de terrain vont-elles adhérer à l'outil digital ?",
        answer:
          "Oui, à une condition : que l'outil leur simplifie réellement la vie. C'est pourquoi nous concevons les écrans avec les utilisateurs de terrain, en reprenant leur vocabulaire et leurs gestes. Quand remplir un bon sur tablette est plus rapide que sur papier — et évite la ressaisie du soir — l'adhésion vient d'elle-même.",
      },
      {
        question: "Quelle est la différence avec un logiciel de gestion du commerce ?",
        answer:
          "Un logiciel générique impose ses circuits : c'est à votre entreprise de s'adapter. La digitalisation sur mesure part de vos processus réels et les reproduit en mieux — plus simples, plus rapides, tracés. Vous gardez votre façon de travailler, débarrassée de ses frictions.",
      },
      {
        question: "Combien de temps prend un projet de digitalisation ?",
        answer:
          "Un premier processus digitalisé est généralement opérationnel en quelques semaines : cartographie, conception avec vos équipes, développement, puis mise en service accompagnée. Nous procédons processus par processus, chacun apportant un gain concret avant de passer au suivant.",
      },
    ],
  },
  {
    slug: "maintenance-windev-webdev",
    name: "Maintenance WINDEV / WEBDEV",
    query: "maintenance WINDEV",
    metaTitle: "Maintenance WINDEV / WEBDEV : reprise & évolution | Mailys Solutions",
    metaDescription:
      "Application WINDEV ou WEBDEV sans développeur ? Reprise de code, maintenance corrective et évolutive, migration de version. Réponse rapide, devis gratuit.",
    h1: "Maintenance WINDEV / WEBDEV : votre application entre de bonnes mains",
    heroSubtitle:
      "Votre application WINDEV ou WEBDEV n'a plus de développeur, ou votre prestataire ne répond plus ? Nous reprenons votre code, corrigeons, sécurisons et faisons évoluer votre application.",
    problemsIntro:
      "Les applications WINDEV et WEBDEV font tourner des milliers de PME françaises. Mais un jour…",
    problems: [
      "Le développeur historique part à la retraite ou n'est plus joignable",
      "Le prestataire d'origine a disparu, personne n'a le code source ou la documentation",
      "Un bug bloquant apparaît et plus personne ne sait intervenir",
      "L'application tourne sur une vieille version de WINDEV que plus rien ne supporte",
      "Chaque demande d'évolution reste sans réponse depuis des mois",
      "La migration vers une nouvelle version fait peur : « on ne touche à rien »",
      "L'application fonctionne, mais vous savez que vous êtes à la merci du moindre incident",
    ],
    consequencesIntro:
      "Une application WINDEV sans mainteneur, c'est une épée de Damoclès au-dessus de votre activité.",
    consequences: [
      {
        title: "Le blocage total en cas de bug",
        text: "Sans personne capable d'intervenir sur le code, un bug bloquant peut immobiliser la facturation, la production ou les expéditions pendant des jours — le temps de trouver, en urgence, quelqu'un qui accepte de plonger dans le code.",
      },
      {
        title: "Une obsolescence qui s'aggrave",
        text: "Chaque année sans maintenance éloigne un peu plus votre application des versions supportées de WINDEV, de Windows et des serveurs. Plus on attend, plus la remise à niveau est lourde et coûteuse.",
      },
      {
        title: "Des évolutions impossibles",
        text: "Votre activité change — réglementation, nouveaux clients, nouvelles offres — mais votre application, elle, reste figée. L'écart se creuse et les contournements manuels se multiplient.",
      },
      {
        title: "Une valeur d'entreprise fragilisée",
        text: "Une application critique non maintenue est un risque identifié lors d'une cession, d'un audit ou d'une demande de financement. C'est votre patrimoine numérique qui se déprécie.",
      },
    ],
    solutionTitle:
      "La solution : une reprise en main professionnelle de votre application",
    solutionParagraphs: [
      "Nous reprenons la maintenance d'applications WINDEV et WEBDEV existantes, même sans documentation et sans contact avec le développeur d'origine. Notre première étape : un audit du code, de la base de données et de l'environnement pour établir un état des lieux honnête.",
      "Ensuite, selon vos priorités : correction des bugs en attente, sécurisation (sauvegardes, versions, environnements), migration vers une version récente de WINDEV / WEBDEV, puis reprise des évolutions que vous attendez parfois depuis des années.",
      "Vous retrouvez un interlocuteur qui répond, des délais annoncés et tenus, et une application qui redevient un atout au lieu d'être un risque.",
    ],
    solutionPoints: [
      "Reprise de code existant, même sans documentation",
      "Audit initial : état des lieux clair de votre application et de ses risques",
      "Maintenance corrective : les bugs traités avec des délais engagés",
      "Maintenance évolutive : vos demandes d'évolution enfin réalisées",
      "Migration de version WINDEV / WEBDEV maîtrisée et testée",
      "Sécurisation : code source, sauvegardes et environnements sous contrôle",
    ],
    benefits: [
      {
        title: "Un interlocuteur qui répond",
        text: "Fini les e-mails sans réponse : vous savez qui appeler et quand vous serez dépanné.",
      },
      {
        title: "Les bugs enfin corrigés",
        text: "Les anomalies qui gênent vos équipes depuis des mois sont traitées méthodiquement.",
      },
      {
        title: "Une application sécurisée",
        text: "Code source récupéré, sauvegardes en place, versions à jour : le risque s'éloigne.",
      },
      {
        title: "Des évolutions qui reprennent",
        text: "Votre application recommence à suivre le rythme de votre activité.",
      },
      {
        title: "Une migration sans casse",
        text: "Le passage aux versions récentes est préparé, testé et réalisé sans interruption.",
      },
      {
        title: "Un avenir redevenu clair",
        text: "Vous savez ce que vaut votre application et où elle va : plus d'épée de Damoclès.",
      },
    ],
    faq: [
      {
        question: "Pouvez-vous reprendre une application WINDEV sans documentation ?",
        answer:
          "Oui. C'est le cas le plus fréquent : nous récupérons le code source et la base de données, puis nous reconstituons le fonctionnement de l'application par l'analyse et par des échanges avec vos utilisateurs. L'audit initial aboutit à une cartographie claire de l'application, qui sert ensuite de base à toute la maintenance.",
      },
      {
        question: "Que faire si je n'ai pas le code source de mon application ?",
        answer:
          "Commencez par le réclamer à votre ancien prestataire : sauf clause contraire, une entreprise est généralement en droit de récupérer les sources d'un développement qu'elle a financé. Si les sources sont réellement perdues, nous étudions les alternatives : reconstitution partielle, ou réécriture de l'application en conservant la base de données existante.",
      },
      {
        question: "Faut-il migrer vers la dernière version de WINDEV ?",
        answer:
          "Pas nécessairement dans l'immédiat, mais rester plusieurs versions en arrière augmente les risques : incompatibilités Windows, failles non corrigées, difficulté croissante de la migration. Notre audit évalue votre version actuelle et vous recommande le bon moment et le bon chemin de migration, testé sur un environnement de recette avant toute bascule.",
      },
      {
        question: "Proposez-vous un contrat de maintenance ou des interventions ponctuelles ?",
        answer:
          "Les deux. L'intervention ponctuelle convient pour un bug isolé ou un besoin précis. Le contrat de maintenance, avec un volume d'heures et des délais d'intervention garantis, convient aux applications critiques pour votre activité. Beaucoup de clients commencent par une intervention ponctuelle avant de mettre en place un contrat.",
      },
      {
        question: "En combien de temps pouvez-vous intervenir sur un bug bloquant ?",
        answer:
          "Pour un client sous contrat de maintenance, les délais d'intervention sont contractuels et adaptés à la criticité de votre application. Pour une première intervention d'urgence sans contrat, nous faisons le maximum pour analyser le problème rapidement — contactez-nous par téléphone ou via le formulaire en décrivant le blocage, et nous vous répondons vite.",
      },
      {
        question: "Pouvez-vous faire évoluer l'application ou seulement la maintenir ?",
        answer:
          "Les deux : la maintenance évolutive fait partie de notre cœur de métier. Nouvelles fonctionnalités, nouveaux états, connexion à d'autres outils, application mobile complémentaire… Une fois votre code repris et sécurisé, votre application peut recommencer à évoluer comme au premier jour — et si elle atteint ses limites, nous savons aussi la moderniser en profondeur.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
