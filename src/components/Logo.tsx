// Logo Mailys Solutions recréé en SVG d'après la DA officielle :
// deux barres arrondies (corail + rouge) et deux points orange.
// ⚠️ À remplacer par le fichier source du logo dès que le client le fournit.

export function LogoMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 104"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="15" cy="87" r="14" fill="rgb(var(--orange))" />
      <rect
        x="30"
        y="6"
        width="30"
        height="92"
        rx="15"
        fill="rgb(var(--coral))"
        transform="rotate(-22 45 52)"
      />
      <rect
        x="72"
        y="6"
        width="30"
        height="92"
        rx="15"
        fill="rgb(var(--accent))"
        transform="rotate(-22 87 52)"
      />
      <circle cx="117" cy="17" r="14" fill="rgb(var(--orange))" />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-7 w-auto" : "h-8 w-auto"} />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-[0.08em] text-foreground">
          MAILYS
        </span>
        <span className="mt-1 text-[9px] font-semibold tracking-[0.32em] text-coral">
          SOLUTIONS
        </span>
      </span>
    </span>
  );
}
