import type { CSSProperties } from "react";
import type { Block } from "./types";
import { animationsEnCss } from "./animations";

// Rendu d'un bloc en vrai HTML, côté serveur (bon pour le SEO).
// Les défauts visuels sont dans engine.css ; le `style` du bloc n'ajoute que les
// écarts (voir docs/modele-simple-dev.md §7).

function styleDepuisBloc(block: Block): CSSProperties {
  const s = (block.style ?? {}) as Record<string, string | number>;
  const css: CSSProperties = {};
  if (s.fond) css.background = String(s.fond);
  if (s.couleur) css.color = String(s.couleur);
  if (s.espacement) {
    const map: Record<string, string> = { petit: "1rem", moyen: "2rem", large: "4rem" };
    css.padding = map[String(s.espacement)] ?? String(s.espacement);
  }
  if (s.aligne) css.textAlign = String(s.aligne) as CSSProperties["textAlign"];
  if (s.rayon !== undefined) css.borderRadius = `${s.rayon}px`;
  if (s.hauteurMin !== undefined) css.minHeight = `${s.hauteurMin}px`;
  if (s.largeurMax !== undefined) css.maxWidth = `${s.largeurMax}px`;
  if (s.taille !== undefined) {
    css.width = `${s.taille}px`;
    css.height = `${s.taille}px`;
  }
  if (s.disposition === "flex") {
    css.display = "flex";
    css.flexWrap = "wrap";
    css.alignItems = "flex-start";
  }
  if (s.gap !== undefined) css.gap = `${s.gap}px`;
  if (s.justification) css.justifyContent = String(s.justification);
  if (s.alignement) css.alignItems = String(s.alignement);
  const anim = animationsEnCss(block.animations);
  if (anim) css.animation = anim;
  return css;
}

export function RenderBlock({ block }: { block: Block }) {
  // Les défauts du code, surchargés par le style brut enregistré (block.css).
  const base = styleDepuisBloc(block);
  const style: CSSProperties = block.css ? { ...base, ...(block.css as CSSProperties) } : base;
  const anime = block.animations && block.animations.length > 0 ? " sd-anim" : "";
  const enfants = (block.children ?? []).map((c) => <RenderBlock key={c.id} block={c} />);
  const content = (block.content ?? {}) as Record<string, unknown>;
  const id = block.id;
  // Attributs communs à chaque bloc rendu (repérage par l'extension + survol).
  const dataAttrs = {
    "data-sd-id": id,
    "data-sd-type": block.type,
    "data-sd-lock": block.verrou ? "1" : undefined,
    "data-sd-hover": block.hover && Object.keys(block.hover).length ? JSON.stringify(block.hover) : undefined,
    "data-sd-mobile": block.mobile && Object.keys(block.mobile).length ? JSON.stringify(block.mobile) : undefined,
  } as const;

  switch (block.type) {
    case "section":
      return (
        <section className="sd-section" style={style} {...dataAttrs}>
          {enfants}
        </section>
      );
    case "titre": {
      const niveau = Math.min(Math.max(Number(content.niveau ?? 2), 1), 6);
      const Tag = `h${niveau}` as React.ElementType;
      return (
        <Tag className={`sd-titre${anime}`} style={style} {...dataAttrs}>
          {String(content.texte ?? "")}
        </Tag>
      );
    }
    case "texte":
      return (
        <p className={`sd-texte${anime}`} style={style} {...dataAttrs}>
          {String(content.texte ?? "")}
        </p>
      );
    case "bouton":
      return (
        <a className={`sd-bouton${anime}`} style={style} href={String(content.lien ?? "#")} {...dataAttrs}>
          {String(content.texte ?? "")}
        </a>
      );
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          className={`sd-image${anime}`}
          style={style}
          src={String(content.src ?? "")}
          alt={String(content.alt ?? "")}
          {...dataAttrs}
        />
      );
    case "champ":
      return (
        <input
          className="sd-champ"
          style={style}
          type={String(content.typeChamp ?? "text")}
          placeholder={String(content.placeholder ?? "")}
          name={String(content.nom ?? id)}
          {...dataAttrs}
        />
      );
    case "zonetexte":
      return (
        <textarea
          className="sd-champ sd-zonetexte"
          style={style}
          placeholder={String(content.placeholder ?? "")}
          name={String(content.nom ?? id)}
          defaultValue=""
          {...dataAttrs}
        />
      );
    case "icone":
      return (
        <span
          className={`sd-icone${anime}`}
          style={style}
          {...dataAttrs}
          dangerouslySetInnerHTML={{ __html: String(content.svg ?? "") }}
        />
      );
    case "forme":
      return (
        <div
          className={`sd-forme sd-forme--${String(block.style?.forme ?? "cercle")}${anime}`}
          style={style}
          {...dataAttrs}
        />
      );
    case "groupe":
      return (
        <div className={`sd-groupe${anime}`} style={style} {...dataAttrs} data-sd-nom={content.nom ? String(content.nom) : undefined}>
          {enfants}
        </div>
      );
    case "animation":
      // Le Bloc Animation : une scène qui réserve sa place ; le mouvement se joue
      // dedans sans pousser le reste de la page (transforms = pas de reflow).
      return (
        <div className="sd-scene sd-anim" style={style} {...dataAttrs}>
          {enfants}
        </div>
      );
    case "interrupteur":
      return (
        <label className="sd-toggle" style={style} {...dataAttrs}>
          <input type="checkbox" defaultChecked={Boolean(content.actif)} />
          <span className="sd-toggle-slider" />
        </label>
      );
    case "header":
      return (
        <header className="sd-header" style={style} {...dataAttrs}>
          {enfants}
        </header>
      );
    case "footer":
      return (
        <footer className="sd-footer" style={style} {...dataAttrs}>
          {enfants}
        </footer>
      );
    default:
      return null;
  }
}

// camelCase → kebab-case pour écrire du CSS (backgroundColor → background-color).
function enKebab(k: string): string {
  return k.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// Règles CSS de survol pour tous les blocs qui en ont (récursif). On force
// `!important` pour l'emporter sur le style inline (plus spécifique qu'un sélecteur).
function reglesHover(blocks: Block[]): string {
  let css = "";
  const visiter = (b: Block) => {
    if (b.hover && Object.keys(b.hover).length) {
      const decl = Object.entries(b.hover)
        .map(([k, v]) => `${enKebab(k)}:${v} !important`)
        .join(";");
      css += `[data-sd-id="${b.id}"]:hover{${decl}}`;
    }
    (b.children ?? []).forEach(visiter);
  };
  blocks.forEach(visiter);
  return css;
}

// Règles appliquées uniquement sur mobile (≤ 767px). `!important` pour l'emporter
// sur le style inline (version ordinateur).
function reglesMobile(blocks: Block[]): string {
  let css = "";
  const visiter = (b: Block) => {
    if (b.mobile && Object.keys(b.mobile).length) {
      const decl = Object.entries(b.mobile)
        .map(([k, v]) => `${enKebab(k)}:${v} !important`)
        .join(";");
      css += `[data-sd-id="${b.id}"]{${decl}}`;
    }
    (b.children ?? []).forEach(visiter);
  };
  blocks.forEach(visiter);
  return css ? `@media (max-width: 767px){${css}}` : "";
}

export function RenderPage({ blocks }: { blocks: Block[] }) {
  const hover = reglesHover(blocks);
  const mobile = reglesMobile(blocks);
  return (
    <>
      {blocks.map((b) => <RenderBlock key={b.id} block={b} />)}
      {hover ? <style dangerouslySetInnerHTML={{ __html: hover }} /> : null}
      {mobile ? <style dangerouslySetInnerHTML={{ __html: mobile }} /> : null}
    </>
  );
}
