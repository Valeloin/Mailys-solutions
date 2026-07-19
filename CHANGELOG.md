# Journal des modifications — Mailys Solutions

> Mini récap de chaque modification, **groupé par session de travail** (la plus récente en haut).
> Mis à jour automatiquement à chaque push (date + heure, fuseau Europe/Paris).
> 💡 Dans Claude Code, tape **`/changelog`** pour ouvrir ce journal.

---

## Session — 19 juillet 2026 · 22h59

- **Gerbe d'étincelles du hero remise à l'endroit** : les rayons de l'interstitiel jaillissaient à l'envers 3 fois sur 4. Ils attendaient à `scale(1.8)` et rétrécissaient vers `1` en devenant visibles, donc ils semblaient foncer vers la coche au lieu d'en jaillir. Chaque gerbe suit désormais le même sens (centre → apparition → ouverture), et le retour au centre se fait toujours à opacité nulle. Vérifié sur les 4 gerbes du cycle : échelle croissante de 0,38 à 1,77 dans chacune.
- **Back-office : plus de perte de rédaction.** Une erreur de validation ne vide plus le formulaire d'article (elle redirigeait, un article entier disparaissait quand le slug était pris), un brouillon local survit aux coupures, une garde prévient avant fermeture d'onglet, et la suppression demande confirmation en nommant ce qu'on perd. Tous les boutons d'envoi portent enfin un état occupé — deux clics rapides créaient un doublon.
- **Une panne ne se présente plus comme un espace vide** : le tableau de bord client n'annonce plus « 0 ticket en cours » quand BugTrack est injoignable. Ajout des écrans de chargement et d'erreur, absents de tout le projet.
- **Espace client** : les alertes du tableau de bord nomment et lient les tickets concernés au lieu de les compter ; la liste se range par activité réelle et sépare les tickets clos.
- **Pages réparées** : `/realisations` chargeait son contenu sans le rendre (cul-de-sac atteignable depuis tout le site), `/a-propos` n'avait pas de `h1` ni d'introduction.
- **Navigation** : le fil d'Ariane, écrit et branché nulle part, est en place sur les fiches services et les articles. Le voile de chargement n'impose plus 650 ms à chaque clic — il ne s'affiche que si la page tarde vraiment.
- **Accessibilité** : focus clavier visible sur tout le site (une seule règle existait dans 2 600 lignes de CSS).
- **Connexion** : l'écran explique enfin qu'il n'y a pas d'inscription libre, avec un bouton « Demander un accès ». L'email saisi n'est plus perdu après un refus.
- **Emails d'accès** : ajout d'une partie texte et d'une adresse de réponse. L'expéditeur reste à aligner sur le domaine du site (hors dépôt).

## Session — 18 juillet 2026 · 08h00
- Hero : habillage DA (card avec filet, border) appliqué à tous les héros du site (page d'accueil, page Services, pages services individuelles)
- Corrections : repair broken pages (a-propos, blog, contact, realisations, services)
- Page contact : restauration de la grille (formulaire + panneau latéral) qui manquait suite à une correction précédente
- BugTrack : signalement de bugs depuis l'espace admin (modale + pièces jointes + historique), via un relais serveur qui garde la clé du site hors du navigateur
- Espace client (phase 1/2) : authentification, invitation des clients depuis l'admin, connexion et choix du mot de passe. Les tickets arrivent à la phase suivante.
- Espace client (phase 2/2) : liste des tickets avec leur avancement, déclaration d'un ticket, et fil de conversation avec l'équipe.
- Correctifs issus du test réel : lecture du jeton d'invitation renvoyé dans le fragment d'URL, et cloisonnement admin/client resserré (la navigation d'administration et la route BugTrack vérifient désormais l'email, plus la seule présence d'une session).

## Session — 17 juillet 2026 · 21h36

- **12:20** — **Trame de points supprimée** : la variante claire des fonds devient blanche et aérée, avec de larges lavis corail/orange dans les angles. Plus aucun motif répété.
- **12:05** — **Tous les textes passent en noir** : titres, corps et texte secondaire (fini le bordeaux et le gris chaud). Le bordeaux reste réservé aux ombres et au décor.
- **12:03** — Puces de services : les numéros **01 → 02 → 03 → 04 grossissent l'un après l'autre** (vague en boucle, virage au rouge), sur l'accueil et la page Services.
- **11:57** — **Fonds de section enfin visibles** : les 3 variantes redessinées à intensité réelle — lavis chaud à grandes taches, **barres du logo à -22°**, trame de points technique — et réparties en rotation sur toutes les pages.
- **11:56** — Titre du hero allégé : 48 → **41,6 px**, graisse `extrabold` → `bold`, interlignage et crénage resserrés (plus élégant, moins massif).
- **11:40** — Site plus vivant : **CTA principal qui respire** en continu, survols de cartes et boutons enrichis (lift + halo chaud), **pictogrammes animés plus amples et plus rapides**.
- **11:26** — **Fonds travaillés sur toutes les sections de toutes les pages** : système unique dérivé de la DA (lavis chaud, halos corail/orange, trame de points estompée, voile diagonal), en 3 variantes alternées.
- **11:24** — Vitrine : **restauration de l'interstitiel** entre chaque scène (voile, spinner au logo, coche validée, feu d'artifice).
- **11:04** — Hero d'accueil : retour à la vitrine défilante des services, puces de réassurance rétablies.
- **10:45** — Carte de marque du hero en **format paysage** (4/3), carte blanche à bordure égale, logo et lettrage ajustés.
- **10:42** — Menu déroulant Services aligné sur la DA du header (filet dégradé, label « Nos expertises », points du logo, « Tous les services » en capitales).
- **22:28** — Script du hook auto (`scripts/changelog-hook.sh`) prêt à activer.
- **21:36** — Journal cliquable (`/changelog`), suivi **par session**, mise à jour auto au push.

---

## Sessions précédentes

### 17 juillet 2026

- **19:47** — Section « Le constat » : cartes à **pictogrammes distincts** + tons chauds (accueil + pages services) ; panneau « La réponse » **épuré** ; **fil d'Ariane** refondu dans la DA.
- **18:48** — Fil d'Ariane habillé DA + ajustements UI et page service.
- **18:40** — Admin : le spinner de transition ne se déclenche plus vers `/admin`.
- **14:48** — Admin : ajout de `mailyscondamy.pro@gmail.com` comme administrateur.
- **13:14** — Hero : carte de marque métallique (carré dans un cadre égal).
- **12:16** — Section Problème/Solution refondue au niveau du hero ; pictogrammes méthode plus amples.
- **11:44** — Étapes méthode : **8 pictogrammes animés** + titre par défaut à 8 étapes ; hero Services : vitrine défilante.
- **11:27** — Favicon : marque Mailys Solutions en SVG.
- **11:14** — Bandeau CTA orange-rouge + carte retravaillée ; hero sans interstitiel ; page Services habillée ; ménage CSS.
- **10:44** — Accompagnement A→Z : le point mobile recouvre les deux extrémités.
- **08:22** — Page blog éditoriale, 8ᵉ étape méthode, spinner logo hero, chips rubriques.
- **07:47** — Page contact refondue, méthode compacte à pictogrammes, hero épuré.
- **06:59** — Spinner signature de pages, hero vivant, barre de lecture, services compacts.
- **06:32** — Transitions grand spectacle, header raffiné, micro-animations et alertes.
- **00:39** — Redéclenchement du déploiement Vercel.
- **00:28** — Vitrine du hero visible sur mobile + titres responsives.
- **00:06** — Spinner ralenti et lissé + envol de l'enveloppe rescénarisé.
- **00:00** — Vitrine du hero : scènes jouées en entier + transitions.

### 16 juillet 2026

- **23:42** — Vignettes animées des services + vitrine tournante du hero (pur CSS).
- **22:22** — Middleware admin : accès réservé aux emails administrateurs.
- **22:16** — Éditeur de contenus admin + durcissement sécurité.
- **21:07** — Admin CMS + blog + formulaire de contact (Supabase).
- **20:48** — Pages intérieures habillées + corrections revue (AA, lien étendu, composants UI).
- **20:27** — Habillage premium : DA intégrée.
- **19:16** — Squelette SEO complet : accueil, 4 services PAS, sitemap, Schema.org.
