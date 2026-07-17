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

export default function PageTransition() {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

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

  // Masque le voile une fois la nouvelle page rendue (minimum 650 ms)
  useEffect(() => {
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
