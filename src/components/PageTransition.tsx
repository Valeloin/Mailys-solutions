"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ============================================================
// Spinner global de changement de page — pièce signature de la DA.
// Seul JavaScript embarqué par le site public (≈1 Ko) : il écoute
// les clics sur les liens internes, affiche le voile + logo animé,
// et le retire dès que la nouvelle page est rendue (minimum 650 ms
// pour que l'animation se lise, garde-fou à 5 s).
// ============================================================

const MIN_MS = 650;

/** Sélecteur de tous les calques de la vitrine du hero (scènes du SVG,
    titres en cross-slide, puces de segment) : trois jeux d'éléments
    séparés, chacun sur sa propre animation CSS infinie de 33,6 s, sans
    horloge commune entre eux. Tant que rien ne les interrompt ils
    restent synchronisés, mais après une mise en veille, un changement
    d'application ou un onglet repassé au premier plan, les navigateurs
    mobiles ne relancent pas toujours des animations indépendantes au
    même instant — d'où le décalage observé (titre et scène affichée
    ne correspondent plus). */
const CALQUES_VITRINE =
  ".pv-scene-1,.pv-scene-2,.pv-scene-3,.pv-scene-4," +
  ".pv-title-1,.pv-title-2,.pv-title-3,.pv-title-4," +
  ".pv-trans,.pv-spin-vis,.pv-ok,.pv-burst";

/** Relance tous les calques au même instant : on coupe l'animation,
    on force un reflow (la lecture de getBoundingClientRect oblige le
    navigateur à appliquer le changement avant la suite), puis on la
    réactive. Les trois jeux d'éléments repartent alors de 0 % sur le
    même top, ce qui les remet en phase — sans cette étape le second
    style.animation = "" reprendrait parfois l'ancienne animation là
    où elle avait été coupée plutôt que de la relancer à zéro. */
function resynchroniserVitrine() {
  const calques = document.querySelectorAll<HTMLElement | SVGElement>(
    CALQUES_VITRINE
  );
  if (!calques.length) return;
  calques.forEach((el) => {
    el.style.animation = "none";
  });
  // Un seul reflow suffit pour tous les éléments déjà coupés ci-dessus.
  void document.body.getBoundingClientRect();
  calques.forEach((el) => {
    el.style.animation = "";
  });
}

/** Referme le menu mobile du header. Le <details> est natif, donc son
    état survit aux navigations client de Next.js (le header vit dans le
    layout et n'est jamais remonté) : sans ça, le volet reste ouvert
    par-dessus la nouvelle page. Cantonné au header pour ne pas refermer
    les accordéons de contenu (FAQ des pages services). */
function closeHeaderMenu() {
  document
    .querySelectorAll("header details[open]")
    .forEach((d) => d.removeAttribute("open"));
}

export default function PageTransition() {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // Resynchronise la vitrine : au montage (premier affichage de la
  // page), quand l'onglet redevient visible, et quand la page est
  // restaurée depuis le bfcache (geste précédent/suivant). Ce sont
  // précisément les moments où les calques peuvent avoir dérivé.
  useEffect(() => {
    resynchroniserVitrine();
    const onVisible = () => {
      if (document.visibilityState === "visible") resynchroniserVitrine();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", resynchroniserVitrine);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", resynchroniserVitrine);
    };
  }, [pathname]);

  // Affiche le voile au clic sur un lien interne (autre page)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.("a");
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("/")) return;
      // Tout lien interne referme le volet — y compris vers la page
      // courante, où aucune navigation ne se produit et où le menu
      // resterait donc ouvert indéfiniment.
      closeHeaderMenu();
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) return;
      // Jamais dans l'administration : le spinner est une pièce du
      // site public, pas un écran de chargement du back-office.
      if (url.pathname.startsWith("/admin")) return;

      shownAt.current = Date.now();
      setVisible(true);
      if (failsafe.current) clearTimeout(failsafe.current);
      failsafe.current = setTimeout(() => setVisible(false), 5000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Masque le voile une fois la nouvelle page rendue (minimum 650 ms).
  // Filet de sécurité : on referme aussi le volet ici, ce qui couvre les
  // navigations sans clic de lien (boutons Précédent/Suivant du navigateur).
  useEffect(() => {
    closeHeaderMenu();
    if (!shownAt.current) return;
    const elapsed = Date.now() - shownAt.current;
    const timer = setTimeout(
      () => {
        setVisible(false);
        shownAt.current = 0;
      },
      Math.max(0, MIN_MS - elapsed)
    );
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`pt-overlay ${visible ? "pt-visible" : ""}`}
      role="status"
      aria-label="Chargement de la page"
      aria-hidden={!visible}
    >
      <div className="pt-box">
        <div className="pt-ring" aria-hidden="true" />
        {/* Le logo Mailys, animé */}
        <svg viewBox="0 0 132 104" className="pt-mark" aria-hidden="true" focusable="false">
          <circle className="pt-dot-1" cx="15" cy="87" r="14" fill="rgb(var(--orange))" />
          <rect
            className="pt-bar-1"
            x="30"
            y="6"
            width="30"
            height="92"
            rx="15"
            fill="rgb(var(--coral))"
          />
          <rect
            className="pt-bar-2"
            x="72"
            y="6"
            width="30"
            height="92"
            rx="15"
            fill="rgb(var(--accent))"
          />
          <circle className="pt-dot-2" cx="117" cy="17" r="14" fill="rgb(var(--orange))" />
        </svg>
      </div>
    </div>
  );
}
