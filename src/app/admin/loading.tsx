// Squelette du back-office pendant les requêtes Supabase.
//
// Chaque changement de section laissait l'écran figé sur la page
// précédente, sans indication : on ne savait pas si le clic avait porté.

function Bloc({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-border bg-bordeaux/[0.04] ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <Bloc className="h-8 w-64" />
      <div className="mt-6 space-y-3">
        <Bloc className="h-[72px]" />
        <Bloc className="h-[72px]" />
        <Bloc className="h-[72px]" />
        <Bloc className="h-[72px]" />
      </div>
    </div>
  );
}
