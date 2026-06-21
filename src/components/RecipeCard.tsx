"use client";

import Link from "next/link";
import { Recipe, recipePricePerPortion, TAG_LABELS } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export default function RecipeCard({ recipe, selected, onToggleSelect }: RecipeCardProps) {
  const price = recipePricePerPortion(recipe);

  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/recettes/${recipe.id}`} className="font-medium leading-snug hover:underline">
          {recipe.name}
        </Link>
        {onToggleSelect && (
          <button
            onClick={onToggleSelect}
            aria-pressed={selected}
            className={`shrink-0 text-xs px-2.5 py-1 rounded-full border ${
              selected
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "border-rose-200 text-[var(--color-muted)]"
            }`}
          >
            {selected ? "Ajouté ✓" : "+ Liste"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs text-[var(--color-muted)]">
        {recipe.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-rose-50 px-2 py-0.5 rounded-full">
            {TAG_LABELS[tag]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1 text-center text-xs mt-1">
        <Metric label="kcal" value={recipe.calories} />
        <Metric label="Prot." value={`${recipe.protein}g`} />
        <Metric label="Prix" value={`${price.toFixed(2)}€`} />
        <Metric label="Temps" value={`${recipe.prepTimeMin}min`} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-rose-50/60 rounded-lg py-1.5">
      <div className="font-medium text-[var(--color-primary-dark)]">{value}</div>
      <div className="text-[10px] text-[var(--color-muted)]">{label}</div>
    </div>
  );
}
