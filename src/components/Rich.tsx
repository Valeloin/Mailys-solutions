import { marked } from "marked";

// Rend un texte « mini-Markdown » édité dans l'admin :
// **gras** et [liens](/url) uniquement (parseInline = pas de blocs).
// Le HTML brut est échappé AVANT le parsing : seul le Markdown
// annoncé fonctionne, toute balise collée s'affiche en texte
// (aucune injection possible), et une valeur non-string ne
// fait pas planter la page.
export default function Rich({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const safe = String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const html = marked.parseInline(safe) as string;
  return (
    <span
      className={`rich-links ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
