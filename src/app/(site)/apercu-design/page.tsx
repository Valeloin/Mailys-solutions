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

// ---------- Mesure de lisibilité ----------
//
// Angle mort de la première version de cette page : elle jugeait chaque
// fond isolément, sans jamais poser dessus de texte en couleur chaude.
// Or c'est exactement ce qui a fait échouer la direction saturée sur le
// site réel — 68 textes en --accent / --orange-text y tombaient sous
// 3,2:1. Chaque variante déclare donc son fond le plus défavorable, et
// la page calcule ce qui reste lisible dessus.

const NOIR: RGB = [0, 0, 0];
const BLANC: RGB = [255, 255, 255];
const ORANGE_TEXT: RGB = [185, 62, 12]; // --orange-text
const ACCENT: RGB = [225, 29, 42]; // --accent

type RGB = [number, number, number];

function luminance([r, g, b]: RGB): number {
  const c = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contraste(a: RGB, b: RGB): number {
  const [x, y] = [luminance(a) + 0.05, luminance(b) + 0.05];
  return Math.round((Math.max(x, y) / Math.min(x, y)) * 100) / 100;
}

const VARIANTES: {
  id: string;
  nom: string;
  note: string;
  /** Point le plus défavorable du fond, pour le calcul de contraste. */
  fondPire: RGB;
}[] = [
  {
    id: "v0",
    nom: "A — Actuel (référence)",
    note: "Deux lavis radiaux corail et orange sur blanc. C'est ce qui est en ligne aujourd'hui.",
    fondPire: [252, 232, 228],
  },
  {
    id: "v1",
    nom: "B — Papier",
    note: "Base ivoire, grain minéral très fin, lavis repoussés dans les angles. Plus calme, plus éditorial. La couleur ne sert plus de fond mais d'accent.",
    fondPire: [250, 243, 238],
  },
  {
    id: "v2",
    nom: "C — Encre",
    note: "Inversion complète : fond bordeaux profond, la chaleur devient lumière. Le logo suit déjà, son lettrage étant en currentColor. Ici c'est le texte BLANC qu'il faut lire dans le relevé, pas le noir.",
    fondPire: [28, 15, 18],
  },
  {
    id: "v4",
    nom: "E — Continu (dosage discret)",
    note: "Un seul dégradé rose / orange / rouge qui traverse toute la page au lieu de blocs juxtaposés. Attention : contrairement à A, B et C, ce n'est pas un habillage de bande mais de page entière — il ne s'alterne pas, il porte tout le reste.",
    fondPire: [253, 230, 220],
  },
  {
    id: "v5",
    nom: "E+ — Continu (dosage franc)",
    note: "Le même dégradé, mais assumé : les trois teintes se voient nettement et se rencontrent au centre de la page. Le blanc ne subsiste qu'en haut.",
    fondPire: [244, 190, 170],
  },
  {
    id: "v6",
    nom: "E++ — Continu (dosage plein)",
    note: "Le dégradé devient le sujet. Plus aucun blanc franc : la page entière est une descente rose → orange → rouge. À regarder en faisant défiler, et à juger sur la lisibilité du texte autant que sur l'effet.",
    fondPire: [246, 126, 77],
  },
];

/** Relevé de lisibilité d'une variante. Le seuil AA est de 4,5:1 pour du
    texte courant. Un accent chaud sous ce seuil ne peut pas être posé
    directement sur le fond : il devra vivre sur une carte, ou céder. */
function Releve({ fond }: { fond: RGB }) {
  const mesures = [
    { nom: "texte noir", valeur: contraste(NOIR, fond) },
    { nom: "texte blanc", valeur: contraste(BLANC, fond) },
    { nom: "accent orange", valeur: contraste(ORANGE_TEXT, fond) },
    { nom: "accent rouge", valeur: contraste(ACCENT, fond) },
  ];
  return (
    <ul className="mt-3 flex flex-wrap gap-2 text-xs">
      {mesures.map((m) => {
        const ok = m.valeur >= 4.5;
        return (
          <li
            key={m.nom}
            className="rounded-full border px-2.5 py-1 font-semibold"
            style={{
              background: "rgb(255 255 255 / 0.92)",
              borderColor: ok ? "rgb(var(--orange) / 0.35)" : "rgb(var(--accent) / 0.5)",
              color: ok ? "rgb(var(--orange-text))" : "rgb(var(--accent-dark))",
            }}
          >
            {m.nom} {m.valeur.toFixed(2)}:1 {ok ? "✓" : "✗"}
          </li>
        );
      })}
    </ul>
  );
}

/** Contenu de démonstration : volontairement identique d'une variante à
    l'autre, pour que seul l'habillage change. Textes repris du site. */
function Demo() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
      <Kicker>Nos expertises</Kicker>
      <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
        Des outils conçus pour votre façon de travailler
      </h2>
      {/* Texte en couleur chaude posé NU sur le fond, hors carte. C'est
          le cas que la première version de cette page ne montrait pas,
          et c'est lui qui a fait échouer la direction saturée : sur le
          site réel, 68 textes sont dans cette situation. Si ces deux
          lignes deviennent difficiles à lire, la direction ne tient
          pas — quel que soit son effet par ailleurs. */}
      <p className="mt-4 text-sm font-bold uppercase tracking-wider text-orange-text">
        Accent orange posé sur le fond
      </p>
      <p className="mt-1 text-sm font-semibold text-accent">
        Accent rouge posé sur le fond — lisible ou non ?
      </p>

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
            <Releve fond={v.fondPire} />
          </div>
          <Demo />
        </section>
      ))}

      {/* ================= COMPOSITION ================= */}
      {/* Les trois directions retenues ne s'opposent pas, elles se
          superposent : E porte le fond de la page entière, A et B
          rythment les sections par-dessus, C sert de bascule. C'est
          cette combinaison qui remplacerait sec-clean / sec-warm /
          sec-deep, pas une variante prise isolément. */}
      <div className="compo">
        <div className="mx-auto max-w-content px-4 pt-16 sm:px-6">
          <p className="apercu-etiquette inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Composition — les trois ensemble
          </p>
          <h2 className="mt-3 max-w-2xl text-xl font-bold">
            Ce que donnerait une vraie page
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-75">
            E tient le fond d&apos;un bout à l&apos;autre. Les sections
            posées dessus n&apos;ont plus besoin de fond propre : elles
            laissent voir le dégradé. Seules deux exceptions rythment la
            descente — un aplat papier pour les passages de lecture, et une
            bascule sombre pour le moment fort.
          </p>
        </div>

        <section className="compo-libre">
          <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
              Section sans fond propre — le dégradé de page traverse
            </p>
          </div>
          <Demo />
        </section>

        <section className="compo-papier">
          <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
              Aplat papier — passages de lecture
            </p>
          </div>
          <Demo />
        </section>

        <section className="compo-encre">
          <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
              Bascule encre — le moment fort de la page
            </p>
          </div>
          <Demo />
        </section>

        <section className="compo-libre">
          <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
              Retour au dégradé de page
            </p>
          </div>
          <Demo />
        </section>
      </div>
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

/* E — Continu : un seul dégradé traversant, fixé au défilement. */
.v4::before {
  background:
    radial-gradient(80% 50% at 50% -10%, rgb(var(--coral) / 0.22), transparent 60%),
    radial-gradient(70% 45% at 100% 60%, rgb(var(--orange) / 0.18), transparent 62%),
    radial-gradient(70% 45% at 0% 110%, rgb(var(--accent) / 0.14), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #fffaf7 55%, #fdf3ee 100%);
  background-attachment: fixed, fixed, fixed, fixed;
}

/* E+ — dosage franc : les trois teintes se rencontrent au centre. */
.v5::before {
  background:
    radial-gradient(85% 55% at 50% -5%, rgb(var(--coral) / 0.42), transparent 62%),
    radial-gradient(75% 50% at 100% 55%, rgb(var(--orange) / 0.36), transparent 64%),
    radial-gradient(75% 50% at 0% 105%, rgb(var(--accent) / 0.3), transparent 64%),
    linear-gradient(180deg, #ffffff 0%, #fff4ee 45%, #fde6dc 100%);
  background-attachment: fixed, fixed, fixed, fixed;
}

/* E++ — dosage plein : plus aucun blanc franc, le dégradé est le sujet.
   Les opacités montent, mais le texte reste noir sur fond clair : le
   contraste se vérifie à l'œil ET au calcul avant de retenir ce dosage. */
.v6::before {
  background:
    radial-gradient(90% 60% at 50% -5%, rgb(var(--coral) / 0.6), transparent 64%),
    radial-gradient(80% 55% at 100% 50%, rgb(var(--orange) / 0.52), transparent 66%),
    radial-gradient(80% 55% at 0% 100%, rgb(var(--accent) / 0.42), transparent 66%),
    linear-gradient(180deg, #fff3ec 0%, #ffe6d8 50%, #ffd9cd 100%);
  background-attachment: fixed, fixed, fixed, fixed;
}
.v6 .apercu-carte { background: rgb(255 255 255 / 0.82); backdrop-filter: blur(3px); }

/* ---------- Composition : les trois retenues ensemble ---------- */
/* E porte le fond de l'ensemble. Les sections posées dessus ne
   redéfinissent un fond que lorsqu'elles ont une raison de le faire. */
.compo {
  position: relative;
  isolation: isolate;
  color: var(--foreground);
}
.compo::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(80% 50% at 50% -10%, rgb(var(--coral) / 0.22), transparent 60%),
    radial-gradient(70% 45% at 100% 60%, rgb(var(--orange) / 0.18), transparent 62%),
    radial-gradient(70% 45% at 0% 110%, rgb(var(--accent) / 0.14), transparent 62%),
    linear-gradient(180deg, #ffffff 0%, #fffaf7 55%, #fdf3ee 100%);
  background-attachment: fixed, fixed, fixed, fixed;
}
.compo .apercu-carte {
  border-color: rgb(var(--bordeaux) / 0.12);
  background: var(--background);
}

/* Sans fond propre : le dégradé de page reste visible. */
.compo-libre { position: relative; }

/* Aplat papier, opaque, pour les passages de lecture. */
.compo-papier { position: relative; isolation: isolate; }
.compo-papier::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: #fdfaf7;
}
.compo-papier::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.5;
  background-image:
    radial-gradient(rgb(var(--bordeaux) / 0.05) 0.5px, transparent 0.5px),
    radial-gradient(rgb(var(--bordeaux) / 0.04) 0.5px, transparent 0.5px);
  background-size: 14px 14px, 14px 14px;
  background-position: 0 0, 7px 7px;
}

/* Bascule sombre : le moment fort, une seule fois par page. */
.compo-encre { position: relative; isolation: isolate; color: #ffffff; }
.compo-encre::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(58% 70% at 12% 0%, rgb(var(--accent) / 0.4), transparent 62%),
    radial-gradient(56% 68% at 92% 100%, rgb(var(--orange) / 0.3), transparent 64%),
    linear-gradient(180deg, #1c0f12 0%, #140a0d 100%);
}
.compo-encre .apercu-carte {
  background: rgb(255 255 255 / 0.05);
  border-color: rgb(255 255 255 / 0.14);
  backdrop-filter: blur(2px);
}
.compo-encre .apercu-ghost { border-color: rgb(255 255 255 / 0.4); }
`;
