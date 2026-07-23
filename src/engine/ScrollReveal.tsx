"use client";

import { useEffect } from "react";

// Déclenche les animations « au-defilement » : ajoute .is-inview quand un bloc
// .sd-scroll entre dans le viewport (une fois — pas de rejeu en remontant).
// Filet : si IntersectionObserver est indisponible, tout s'affiche direct.
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".sd-scroll:not(.is-inview)");
    if (!els.length) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-inview"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
