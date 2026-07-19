// Squelette affiché pendant que BugTrack répond.
//
// Toutes les pages de l'espace sont en force-dynamic et attendent un
// service distant. Sans ce fichier, Next n'a rien à streamer : le clic
// sur un onglet ne produisait rien à l'écran jusqu'au retour réseau, et
// l'utilisateur cliquait une seconde fois en croyant l'onglet mort.
//
// Les blocs reprennent la hauteur des cartes réelles pour que le contenu
// ne saute pas quand il arrive.

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
      <span className="sr-only">Chargement de vos données…</span>

      <div className="grid gap-4 sm:grid-cols-3">
        <Bloc className="h-[104px]" />
        <Bloc className="h-[104px]" />
        <Bloc className="h-[104px]" />
      </div>

      <div className="mt-10 space-y-3">
        <Bloc className="h-[76px]" />
        <Bloc className="h-[76px]" />
        <Bloc className="h-[76px]" />
      </div>
    </div>
  );
}
