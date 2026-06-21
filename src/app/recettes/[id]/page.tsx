"use client";

import { useParams, useRouter } from "next/navigation";
import { getRecipeById } from "@/lib/recipes";
import { CATEGORY_LABELS, TAG_LABELS, recipePricePerPortion, recipeTotalPrice } from "@/lib/types";
import { useSelectedRecipeIds, usePriceOverrides } from "@/lib/appState";
import { priceKey } from "@/lib/shoppingList";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const recipe = getRecipeById(id);
  const [selectedIds, setSelectedIds] = useSelectedRecipeIds();
  const [overrides, setOverrides] = usePriceOverrides();

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p>Recette introuvable.</p>
        <button onClick={() => router.push("/recettes")} className="text-[var(--color-primary-dark)] underline">
          Retour aux recettes
        </button>
      </div>
    );
  }

  const recipeId = recipe.id;
  const selected = selectedIds.includes(recipeId);
  const pricePerPortion = recipePricePerPortion(recipe);
  const total = recipeTotalPrice(recipe);

  function toggleSelect() {
    setSelectedIds((prev) => (prev.includes(recipeId) ? prev.filter((x) => x !== recipeId) : [...prev, recipeId]));
  }

  function updatePrice(ingredientName: string, value: number) {
    setOverrides((prev) => ({ ...prev, [priceKey(recipeId, ingredientName)]: value }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <button onClick={() => router.back()} className="text-sm text-[var(--color-muted)]">
        ← Retour
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary-dark)]">{recipe.name}</h1>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {recipe.tags.map((tag) => (
            <span key={tag} className="bg-rose-50 text-xs px-2 py-0.5 rounded-full text-[var(--color-muted)]">
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <Stat label="Calories" value={`${recipe.calories} kcal`} />
        <Stat label="Protéines" value={`${recipe.protein} g`} />
        <Stat label="Glucides" value={`${recipe.carbs} g`} />
        <Stat label="Lipides" value={`${recipe.fat} g`} />
      </div>

      <div className="flex justify-between bg-white rounded-2xl border border-rose-100 p-4 shadow-sm text-sm">
        <span>⏱️ {recipe.prepTimeMin} min · {recipe.difficulty}</span>
        <span>{recipe.portions} portion{recipe.portions > 1 ? "s" : ""}</span>
        <span>{pricePerPortion.toFixed(2)} € / portion</span>
      </div>

      <div>
        <h2 className="font-medium mb-2">Ingrédients (prix estimés, modifiables)</h2>
        <ul className="flex flex-col gap-2">
          {recipe.ingredients.map((line) => {
            const key = priceKey(recipe.id, line.name);
            const price = overrides[key] ?? line.estimatedPrice;
            return (
              <li key={line.name} className="flex items-center justify-between bg-white rounded-xl border border-rose-100 px-3 py-2 text-sm">
                <span>
                  {line.name} — {line.quantity} {line.unit}
                  {line.store && <span className="text-[var(--color-muted)]"> ({line.store})</span>}
                </span>
                <span className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    min={0}
                    value={price}
                    onChange={(e) => updatePrice(line.name, Number(e.target.value))}
                    className="w-16 text-right border border-rose-200 rounded px-1 py-0.5"
                  />
                  <span>€</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-right text-sm font-medium mt-2">Total : {total.toFixed(2)} €</p>
      </div>

      {(recipe.cheaperOption || recipe.fancierOption || recipe.quickOption) && (
        <div className="flex flex-col gap-1 text-sm text-[var(--color-muted)]">
          {recipe.cheaperOption && <p>💸 Option moins chère : {recipe.cheaperOption}</p>}
          {recipe.fancierOption && <p>✨ Option plus gourmande : {recipe.fancierOption}</p>}
          {recipe.quickOption && <p>⚡ Option rapide : {recipe.quickOption}</p>}
        </div>
      )}

      <div className="text-xs text-[var(--color-muted)]">
        Catégories : {recipe.categories.map((c) => CATEGORY_LABELS[c]).join(", ")}
      </div>

      <button
        onClick={toggleSelect}
        className={`rounded-full py-3 font-medium ${
          selected ? "bg-rose-100 text-[var(--color-primary-dark)]" : "bg-[var(--color-primary)] text-white"
        }`}
      >
        {selected ? "Retirer de la liste de courses" : "Ajouter à la liste de courses"}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-rose-100 py-2 shadow-sm">
      <div className="font-medium text-[var(--color-primary-dark)] text-sm">{value}</div>
      <div className="text-[10px] text-[var(--color-muted)]">{label}</div>
    </div>
  );
}
