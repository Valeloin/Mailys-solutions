// Logo Mailys Solutions recréé en SVG d'après la DA officielle :
// deux barres arrondies (corail + rouge) et deux points orange.
// ⚠️ À remplacer par le fichier source du logo dès que le client le fournit.

export function LogoMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 375 374.999991"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="rgb(var(--accent))" d="M 185.621094 46.371094 C 200.933594 37.546875 220.511719 42.785156 229.335938 58.09375 L 293.316406 168.921875 C 302.195312 184.234375 296.902344 203.8125 281.648438 212.636719 C 266.335938 221.457031 246.753906 216.222656 237.929688 200.910156 L 173.953125 90.085938 C 165.074219 74.773438 170.308594 55.25 185.621094 46.371094 Z" fillOpacity="1" fillRule="evenodd"/>
      <path fill="rgb(var(--coral))" d="M 189.265625 212.636719 C 173.953125 221.457031 154.371094 216.222656 145.546875 200.910156 L 81.570312 90.085938 C 72.746094 74.773438 77.984375 55.25 93.296875 46.371094 C 108.550781 37.546875 128.128906 42.785156 136.953125 58.097656 L 200.988281 168.921875 C 209.8125 184.234375 204.574219 203.8125 189.265625 212.636719 Z" fillOpacity="1" fillRule="evenodd"/>
      <path fill="rgb(var(--orange))" d="M 278.003906 46.371094 C 293.316406 37.546875 312.894531 42.785156 321.71875 58.09375 C 330.542969 73.40625 325.304688 92.988281 309.992188 101.8125 C 294.679688 110.632812 275.101562 105.398438 266.277344 90.085938 C 257.457031 74.773438 262.691406 55.25 278.003906 46.371094 Z M 96.882812 212.636719 C 81.570312 221.457031 62.046875 216.222656 53.164062 200.910156 C 44.34375 185.65625 49.578125 166.074219 64.890625 157.253906 C 80.203125 148.371094 99.785156 153.664062 108.605469 168.921875 C 117.429688 184.234375 112.191406 203.8125 96.882812 212.636719 Z" fillOpacity="1" fillRule="evenodd"/>
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
