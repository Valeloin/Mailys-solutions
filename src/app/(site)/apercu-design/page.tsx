import type { Metadata } from "next";
import Link from "next/link";
import { Kicker, BrandDots, Check } from "@/components/ui";

// ============================================================
// PAGE D'APERÇU — provisoire, à supprimer une fois la direction
// choisie. Elle n'existe que pour comparer plusieurs habillages de
// fond sur un contenu réel, avec les vrais composants et les vraies
// animations.
//
// Tout le CSS des variantes vit ICI, dans une balise <style> locale :
// rien n'est ajouté à globals.css tant qu'aucune direction n'est
// retenue. Supprimer ce fichier suffit à tout annuler.
//
// La DA n'est pas touchée : aucune couleur nouvelle, uniquement les
// variables --accent, --coral, --orange, --bordeaux et --foreground.
// ============================================================

export const metadata: Metadata = {
  title: "Aperçu des directions de design",
  robots: { index: false, follow: false },
};

const VARIANTES = [
  {
    id: "v0",
    nom: "A — Actuel (référence)",
    note: "Deux lavis radiaux corail et orange sur blanc. C'est ce qui est en ligne aujourd'hui.",
  },
  {
    id: "v1",
    nom: "B — Papier",
    note: "Base ivoire, grain minéral très fin, lavis repoussés dans les angles. Plus calme, plus éditorial. La couleur ne sert plus de fond mais d'accent.",
  },
  {
    id: "v2",
    nom: "C — Encre",
    note: "Inversion complète : fond bordeaux profond, la chaleur devient lumière. Le logo suit déjà, son lettrage étant en currentColor.",
  },
  {
    id: "v3",
    nom: "D — Trame",
    note: "Blanc franc, structure portée par des bandes diagonales larges — le motif de sec-deep généralisé et assumé. Plus graphique, plus affirmé.",
  },
  {
    id: "v4",
    nom: "E — Continu",
    note: "Un seul dégradé qui traverse toute la page au lieu de blocs juxtaposés. Les sections cessent de se voir comme des bandes.",
  },
];

/** Contenu de démonstration : volontairement identique d'une variante à
    l'autre, pour que seul l'habillage change. Textes repris du site. */
function Demo() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
      <Kicker>Nos expertises</Kicker>
      <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
        Des outils conçus pour votre façon de travailler
      </h2>
      <p className="mt-4 max-w-2xl opacity-80">
        Chaque projet raconte la même histoire : une entreprise freinée par ses
        outils, un logiciel conçu pour ses processus réels, des équipes qui
        respirent.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {[
          ["Application métier", "Un outil qui épouse vos processus au lieu de les tordre."],
          ["Modernisation", "Votre logiciel existant, remis au goût du jour sans tout jeter."],
          ["Maintenance", "Nous restons responsables de ce que nous construisons."],
        ].map(([titre, texte]) => (
          <article
            key={titre}
            className="card apercu-carte rounded-2xl border p-6 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <BrandDots />
            <h3 className="font-bold">{titre}</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-80">{texte}</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
              <Check /> Sur mesure
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/apercu-design"
          className="btn-cta rounded-xl px-7 py-3.5 font-semibold text-white"
        >
          Demander un devis
        </Link>
        <Link
          href="/apercu-design"
          className="apercu-ghost rounded-xl border px-7 py-3.5 font-semibold"
        >
          Voir nos services
        </Link>
      </div>
    </div>
  );
}

export default function ApercuDesignPage() {
  return (
    <>
      <style>{CSS_VARIANTES}</style>

      <div className="mx-auto max-w-content px-4 pt-10 sm:px-6">
        <h1 className="text-2xl font-bold text-foreground">
          Cinq directions de fond, même DA
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Même contenu, mêmes composants, mêmes animations dans les cinq. Seul
          l&apos;habillage change. Aucune couleur nouvelle : uniquement les
          variables déjà en place. Cette page est provisoire.
        </p>
      </div>

      {VARIANTES.map((v) => (
        <section key={v.id} className={`apercu ${v.id}`}>
          <div className="mx-auto max-w-content px-4 pt-10 sm:px-6">
            <p className="apercu-etiquette inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {v.nom}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-75">
              {v.note}
            </p>
          </div>
          <Demo />
        </section>
      ))}
    </>
  );
}

const CSS_VARIANTES = `
/* Attention : le projet mélange deux conventions dans :root. --accent,
   --coral, --orange et --bordeaux sont des triplets RGB, donc utilisés
   en rgb(var(--x)). Mais --background, --foreground et --surface sont
   des hexadécimaux : les envelopper dans rgb() produit une déclaration
   invalide, silencieusement ignorée — les cartes devenaient
   transparentes sans qu'aucune erreur ne le signale. */
.apercu { position: relative; isolation: isolate; color: var(--foreground); }
.apercu::before { content: ""; position: absolute; inset: 0; z-index: -2; }
.apercu::after { content: ""; position: absolute; inset: 0; z-index: -1; }
.apercu-etiquette { background: rgb(var(--bordeaux) / 0.08); }
.apercu-carte { border-color: rgb(var(--bordeaux) / 0.12); background: var(--background); }
.apercu-ghost { border-color: rgb(var(--bordeaux) / 0.2); }

/* A — Actuel : lavis radiaux corail et orange sur blanc. */
.v0::before {
  background:
    radial-gradient(70% 95% at 100% 0%, rgb(var(--coral) / 0.3), transparent 62%),
    radial-gradient(62% 85% at 0% 100%, rgb(var(--orange) / 0.26), transparent 64%),
    #ffffff;
}

/* B — Papier : ivoire, grain fin, couleur repoussée aux angles. */
.v1::before {
  background:
    radial-gradient(48% 60% at 100% 0%, rgb(var(--coral) / 0.14), transparent 70%),
    radial-gradient(44% 56% at 0% 100%, rgb(var(--orange) / 0.12), transparent 72%),
    #fdfaf7;
}
.v1::after {
  opacity: 0.5;
  background-image:
    radial-gradient(rgb(var(--bordeaux) / 0.05) 0.5px, transparent 0.5px),
    radial-gradient(rgb(var(--bordeaux) / 0.04) 0.5px, transparent 0.5px);
  background-size: 14px 14px, 14px 14px;
  background-position: 0 0, 7px 7px;
}
.v1 .apercu-carte { background: #ffffff; border-color: rgb(var(--bordeaux) / 0.09); }

/* C — Encre : fond profond, la chaleur devient lumière. */
.v2 { color: #ffffff; }
.v2::before {
  background:
    radial-gradient(58% 70% at 12% 0%, rgb(var(--accent) / 0.4), transparent 62%),
    radial-gradient(56% 68% at 92% 100%, rgb(var(--orange) / 0.3), transparent 64%),
    linear-gradient(180deg, #1c0f12 0%, #140a0d 100%);
}
.v2 .apercu-carte {
  background: rgb(255 255 255 / 0.05);
  border-color: rgb(255 255 255 / 0.14);
  backdrop-filter: blur(2px);
}
.v2 .apercu-etiquette { background: rgb(255 255 255 / 0.12); }
.v2 .apercu-ghost { border-color: rgb(255 255 255 / 0.4); }

/* D — Trame : blanc franc, bandes diagonales larges. */
.v3::before { background: #ffffff; }
.v3::after {
  background:
    linear-gradient(112deg, transparent 6%, rgb(var(--coral) / 0.16) 6%, rgb(var(--coral) / 0.16) 17%, transparent 17%),
    linear-gradient(112deg, transparent 22%, rgb(var(--accent) / 0.1) 22%, rgb(var(--accent) / 0.1) 29%, transparent 29%),
    linear-gradient(112deg, transparent 74%, rgb(var(--orange) / 0.18) 74%, rgb(var(--orange) / 0.18) 88%, transparent 88%);
}

/* E — Continu : un seul dégradé traversant, fixé au défilement. */
.v4::before {
  background:
    radial-gradient(80% 50% at 50% -10%, rgb(var(--coral) / 0.22), transparent 60%),
    radial-gradient(70% 45% at 100% 60%, rgb(var(--orange) / 0.18), transparent 62%),
    radial-gradient(70% 45% at 0% 110%, rgb(var(--accent) / 0.14), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #fffaf7 55%, #fdf3ee 100%);
  background-attachment: fixed, fixed, fixed, fixed;
}
`;
