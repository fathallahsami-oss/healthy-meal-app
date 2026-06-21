"use client";

import { useMemo, useState } from "react";
import { useFridgeItems, useSelectedRecipeIds } from "@/lib/appState";
import { recipes } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function FrigoPage() {
  const [items, setItems] = useFridgeItems();
  const [selectedIds, setSelectedIds] = useSelectedRecipeIds();
  const [input, setInput] = useState("");

  function addItem() {
    const name = input.trim();
    if (!name) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    setInput("");
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const suggestions = useMemo(() => {
    if (items.length === 0) return [];
    const fridgeNames = items.map((i) => normalize(i.name));
    return recipes
      .map((recipe) => {
        const matchCount = recipe.ingredients.filter((line) =>
          fridgeNames.some((f) => normalize(line.name).includes(f) || f.includes(normalize(line.name)))
        ).length;
        return { recipe, matchCount, ratio: matchCount / recipe.ingredients.length };
      })
      .filter((r) => r.matchCount > 0)
      .sort((a, b) => b.ratio - a.ratio || b.matchCount - a.matchCount)
      .slice(0, 6)
      .map((r) => r.recipe);
  }, [items]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-[var(--color-primary-dark)]">Mon frigo / garde-manger</h1>

      <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Ex : œufs, poulet, riz, skyr..."
            className="flex-1 border border-rose-200 rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={addItem} className="bg-[var(--color-primary)] text-white px-4 rounded-lg text-sm">
            Ajouter
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            Indique ce que tu as déjà chez toi pour éviter le gaspillage.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-rose-50 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {item.name}
                <button onClick={() => removeItem(item.id)} className="text-[var(--color-muted)]">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {suggestions.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-medium text-[var(--color-primary-dark)]">
            Recettes réalisables avec ce que tu as
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                selected={selectedIds.includes(recipe.id)}
                onToggleSelect={() => toggleSelect(recipe.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
