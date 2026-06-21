"use client";

import { useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/lib/recipes";
import { useSelectedRecipeIds } from "@/lib/appState";
import { Category, CATEGORY_LABELS, Tag, TAG_LABELS } from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const TAGS = Object.keys(TAG_LABELS) as Tag[];

export default function RecettesPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [selectedIds, setSelectedIds] = useSelectedRecipeIds();

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (category && !r.categories.includes(category)) return false;
      if (activeTags.length > 0 && !activeTags.every((t) => r.tags.includes(t))) return false;
      return true;
    });
  }, [category, activeTags]);

  function toggleTag(tag: Tag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-primary-dark)]">Recettes</h1>
        <span className="text-sm text-[var(--color-muted)]">
          {selectedIds.length} dans la liste de courses
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm border ${
            category === null ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-rose-200 text-[var(--color-muted)]"
          }`}
        >
          Toutes
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border ${
              category === c ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-rose-200 text-[var(--color-muted)]"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => toggleTag(t)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs border ${
              activeTags.includes(t)
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "border-rose-200 text-[var(--color-muted)]"
            }`}
          >
            {TAG_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            selected={selectedIds.includes(recipe.id)}
            onToggleSelect={() => toggleSelect(recipe.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] col-span-full">
            Aucune recette ne correspond à ces filtres.
          </p>
        )}
      </div>
    </div>
  );
}
