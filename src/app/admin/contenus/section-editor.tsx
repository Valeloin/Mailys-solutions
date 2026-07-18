"use client";

import { useState } from "react";
import type { Field } from "@/lib/sections";
import { saveSection, resetSection } from "../actions";

// ============================================================
// Éditeur de section : formulaire généré depuis le schéma
// (src/lib/sections.ts). Les listes se gèrent avec des boutons
// ajouter / supprimer / monter / descendre. À l'enregistrement,
// l'état complet part en JSON vers la server action.
// ============================================================

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/30";

type Data = Record<string, unknown>;

function getAt(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj;
  for (const p of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[p];
  }
  return cur;
}

function setAt(obj: Data, path: (string | number)[], value: unknown): Data {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  const clone: Data = Array.isArray(obj)
    ? ([...(obj as unknown[])] as unknown as Data)
    : { ...obj };
  if (rest.length === 0) {
    (clone as Record<string | number, unknown>)[head] = value;
  } else {
    const child = (obj as Record<string | number, unknown>)[head];
    (clone as Record<string | number, unknown>)[head] = setAt(
      (child ?? {}) as Data,
      rest,
      value
    );
  }
  return clone;
}

export default function SectionEditor({
  sectionKey,
  fields,
  initialData,
}: {
  sectionKey: string;
  fields: Field[];
  initialData: Data;
}) {
  const [data, setData] = useState<Data>(initialData);

  const update = (path: (string | number)[], value: unknown) =>
    setData((d) => setAt(d, path, value));

  function renderField(field: Field, path: (string | number)[]): React.ReactNode {
    const fieldPath = [...path, field.name];

    if (field.kind === "group") {
      return (
        <fieldset
          key={fieldPath.join(".")}
          className="rounded-2xl border border-border bg-background p-6"
        >
          <legend className="px-2 font-bold text-foreground">{field.label}</legend>
          <div className="space-y-4">
            {field.fields.map((f) => renderField(f, fieldPath))}
          </div>
        </fieldset>
      );
    }

    if (field.kind === "stringList") {
      const items = (getAt(data, fieldPath) as string[]) ?? [];
      return (
        <div key={fieldPath.join(".")}>
          <p className="text-sm font-semibold">{field.label}</p>
          {field.hint && <p className="mt-0.5 text-xs text-muted">{field.hint}</p>}
          <div className="mt-2 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={field.rich || item.length > 90 ? 3 : 1}
                  value={item}
                  onChange={(e) =>
                    update(fieldPath, items.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  className={`${inputClass} !mt-0 flex-1`}
                />
                <ListButtons
                  index={i}
                  total={items.length}
                  onMove={(dir) => {
                    const next = [...items];
                    const [moved] = next.splice(i, 1);
                    next.splice(i + dir, 0, moved);
                    update(fieldPath, next);
                  }}
                  onDelete={() => update(fieldPath, items.filter((_, j) => j !== i))}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => update(fieldPath, [...items, ""])}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-coral"
            >
              + Ajouter
            </button>
          </div>
        </div>
      );
    }

    if (field.kind === "objectList") {
      const items = (getAt(data, fieldPath) as Data[]) ?? [];
      return (
        <div key={fieldPath.join(".")}>
          <p className="text-sm font-semibold">{field.label}</p>
          <div className="mt-2 space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    {field.itemLabel} {i + 1}
                  </p>
                  <ListButtons
                    index={i}
                    total={items.length}
                    onMove={(dir) => {
                      const next = [...items];
                      const [moved] = next.splice(i, 1);
                      next.splice(i + dir, 0, moved);
                      update(fieldPath, next);
                    }}
                    onDelete={() => update(fieldPath, items.filter((_, j) => j !== i))}
                  />
                </div>
                <div className="mt-2 space-y-3">
                  {field.fields.map((sub) => (
                    <label key={sub.name} className="block text-sm font-semibold">
                      {sub.label}
                      {sub.kind === "text" ? (
                        <input
                          type="text"
                          value={String(item[sub.name] ?? "")}
                          onChange={(e) => update([...fieldPath, i, sub.name], e.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        <textarea
                          rows={3}
                          value={String(item[sub.name] ?? "")}
                          onChange={(e) => update([...fieldPath, i, sub.name], e.target.value)}
                          className={inputClass}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                update(fieldPath, [
                  ...items,
                  Object.fromEntries(field.fields.map((f) => [f.name, ""])),
                ])
              }
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-coral"
            >
              + Ajouter {field.itemLabel.toLowerCase()}
            </button>
          </div>
        </div>
      );
    }

    // Champs simples : text / textarea / rich
    const value = String(getAt(data, fieldPath) ?? "");
    return (
      <label key={fieldPath.join(".")} className="block text-sm font-semibold">
        {field.label}
        {field.hint && (
          <span className="block text-xs font-normal text-muted">{field.hint}</span>
        )}
        {field.kind === "text" ? (
          <input
            type="text"
            value={value}
            onChange={(e) => update(fieldPath, e.target.value)}
            className={inputClass}
          />
        ) : (
          <textarea
            rows={field.kind === "rich" ? 4 : 3}
            value={value}
            onChange={(e) => update(fieldPath, e.target.value)}
            className={inputClass}
          />
        )}
      </label>
    );
  }

  return (
    <>
      <form action={saveSection} className="mt-6 space-y-6">
        <input type="hidden" name="key" value={sectionKey} />
        <input type="hidden" name="data" value={JSON.stringify(data)} />
        <div className="space-y-6">{fields.map((f) => renderField(f, []))}</div>
        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            className="btn-cta rounded-xl px-7 py-3 font-semibold text-white shadow-lg"
          >
            Enregistrer
          </button>
        </div>
      </form>
      <form
        action={resetSection}
        className="mt-2 border-t border-border pt-4"
      >
        <input type="hidden" name="key" value={sectionKey} />
        <button
          type="submit"
          className="text-sm font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          Restaurer les textes d&apos;origine de cette section
        </button>
      </form>
    </>
  );
}

function ListButtons({
  index,
  total,
  onMove,
  onDelete,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded border border-border text-xs font-bold text-muted transition-colors hover:border-coral hover:text-foreground disabled:opacity-30";
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" aria-label="Monter" className={btn} disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button type="button" aria-label="Descendre" className={btn} disabled={index === total - 1} onClick={() => onMove(1)}>
        ↓
      </button>
      <button type="button" aria-label="Supprimer" className={btn} onClick={onDelete}>
        ✕
      </button>
    </div>
  );
}
