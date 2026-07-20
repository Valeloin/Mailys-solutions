// ============================================================
// Bibliothèque d'animation — architecture reprise d'OHIHO, idiome
// de Mailys.
//
// OHIHO obtient ses révélations avec framer-motion : des composants
// clients qui posent le contenu en `initial="hidden"` puis le
// dévoilent à l'entrée dans l'écran. On NE porte pas ce mécanisme.
// Mailys n'a aucune dépendance d'animation, et son CSS documente
// pourquoi :
//
//   « sans support ou avec prefers-reduced-motion, .reveal est inerte
//     et le contenu est visible d'office — zéro contenu masqué pour
//     Googlebot, zéro CLS. »
//
// Sur un site dont 8 pages canoniques visent chacune une requête
// longue traîne, masquer du contenu en attendant que du JavaScript
// s'exécute serait une régression. On reprend donc l'EFFET d'OHIHO —
// l'échelonnement, la page qui se compose à mesure qu'on descend — en
// restant en CSS pur.
//
// ⚠️ Détail qui change tout : avec `animation-timeline: view()`,
// l'animation est pilotée par la POSITION de l'élément dans l'écran,
// pas par le temps. Un `animation-delay` en millisecondes n'y produit
// donc rien. L'échelonnement se fait en décalant `animation-range` :
// chaque élément d'un groupe commence sa révélation un peu plus tard
// dans sa propre entrée à l'écran.
//
// Ces composants sont des composants SERVEUR : ils n'ajoutent aucun
// JavaScript au navigateur, ils posent seulement une classe et une
// variable CSS de décalage.
// ============================================================

import type { ReactNode } from "react";

/** Pas entre deux éléments d'un même groupe, en points de pourcentage
    de leur entrée à l'écran. Équivalent du staggerChildren d'OHIHO. */
const PAS = 7;

/** Décalage maximal. Au-delà, l'échelonnement devient de l'attente :
    l'œil a fini de lire avant que le dernier élément soit arrivé. */
const DECALAGE_MAX = 28;

export function decalageDe(index: number): string {
  return `${Math.min(index * PAS, DECALAGE_MAX)}%`;
}

/**
 * Enveloppe un bloc qui doit se révéler à l'entrée dans l'écran.
 *
 * `index` échelonne le départ au sein d'un groupe. Sans lui, tous les
 * blocs se révèlent ensemble — c'est ce que fait le `.reveal` actuel,
 * et c'est exactement ce qui lui manque de vie.
 */
export default function Reveal({
  children,
  index = 0,
  className = "",
  as: Balise = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  return (
    <Balise
      className={`reveal ${className}`.trim()}
      style={{ "--reveal-decalage": decalageDe(index) } as React.CSSProperties}
    >
      {children}
    </Balise>
  );
}
