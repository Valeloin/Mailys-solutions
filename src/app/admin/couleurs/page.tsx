import { getStoredColors, EDITABLE_COLORS } from "@/lib/colors";
import { saveColors } from "../actions";

// Édition des couleurs clés du site. La couleur « orange texte »
// (contraste accessibilité) n'est volontairement pas exposée.
export default async function AdminColorsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const stored = await getStoredColors();

  return (
    <>
      <h1 className="text-2xl font-bold text-bordeaux">Couleurs du site</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Ces couleurs s&apos;appliquent à tout le site en quelques secondes
        après l&apos;enregistrement. En cas de doute, revenez aux valeurs
        d&apos;origine indiquées sous chaque couleur.
      </p>

      {saved === "1" && (
        <p role="status" className="mt-4 rounded-lg border border-border bg-background p-3 text-sm font-semibold text-bordeaux">
          ✓ Couleurs enregistrées — le site public est à jour.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm font-semibold text-accent-dark">
          Erreur lors de l&apos;enregistrement. Réessayez.
        </p>
      )}

      <form action={saveColors} className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EDITABLE_COLORS.map((c) => (
            <label
              key={c.key}
              className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4"
            >
              <input
                type="color"
                name={`color_${c.key}`}
                defaultValue={stored[c.key] ?? c.defaultHex}
                className="h-10 w-14 shrink-0 cursor-pointer rounded border border-border bg-background"
              />
              <span>
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  Origine : {c.defaultHex}
                </span>
              </span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="btn-cta mt-6 rounded-xl px-7 py-3 font-semibold text-white"
        >
          Enregistrer les couleurs
        </button>
      </form>
    </>
  );
}
