"use client";

import { useMemo } from "react";
import { getRecipeById } from "@/lib/recipes";
import { useBudget, useCheckedShoppingItems, usePriceOverrides, useSelectedRecipeIds } from "@/lib/appState";
import { buildShoppingList, groupByRayon, totalPrice } from "@/lib/shoppingList";
import { RAYON_LABELS } from "@/lib/types";

export default function CoursesPage() {
  const [selectedIds, setSelectedIds] = useSelectedRecipeIds();
  const [overrides] = usePriceOverrides();
  const [checked, setChecked] = useCheckedShoppingItems();
  const [budget, setBudget] = useBudget();

  const selectedRecipes = useMemo(
    () => selectedIds.map(getRecipeById).filter((r): r is NonNullable<typeof r> => Boolean(r)),
    [selectedIds]
  );

  const lines = useMemo(() => buildShoppingList(selectedRecipes, overrides), [selectedRecipes, overrides]);
  const grouped = useMemo(() => groupByRayon(lines), [lines]);
  const total = totalPrice(lines);
  const checkedTotal = useMemo(
    () => lines.filter((l) => checked.includes(l.name)).reduce((sum, l) => sum + l.estimatedPrice, 0),
    [lines, checked]
  );

  function toggleChecked(name: string) {
    setChecked((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  function validatePurchase() {
    setBudget((b) => ({ ...b, spent: b.spent + checkedTotal }));
    setChecked([]);
  }

  function clearList() {
    setSelectedIds([]);
    setChecked([]);
  }

  if (selectedRecipes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold text-[var(--color-primary-dark)] mb-3">Liste de courses</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Ajoute des recettes depuis la page « Recettes » pour générer ta liste de courses.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[var(--color-primary-dark)]">Liste de courses</h1>
        <button onClick={clearList} className="text-xs text-[var(--color-muted)] underline">
          Vider la liste
        </button>
      </div>

      {Array.from(grouped.entries()).map(([rayon, rayonLines]) => (
        <div key={rayon}>
          <h2 className="text-sm font-medium text-[var(--color-muted)] mb-1">{RAYON_LABELS[rayon]}</h2>
          <ul className="flex flex-col gap-1.5">
            {rayonLines.map((line) => (
              <li
                key={line.name}
                className="flex items-center justify-between bg-white rounded-xl border border-rose-100 px-3 py-2 text-sm"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked.includes(line.name)}
                    onChange={() => toggleChecked(line.name)}
                  />
                  <span className={checked.includes(line.name) ? "line-through text-[var(--color-muted)]" : ""}>
                    {line.name} — {line.quantity} {line.unit}
                    {line.store && <span className="text-[var(--color-muted)]"> ({line.store})</span>}
                  </span>
                </label>
                <span>{line.estimatedPrice.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span>Total estimé</span>
          <span className="font-medium">{total.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span>Coché jusqu&apos;ici</span>
          <span className="font-medium">{checkedTotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-[var(--color-muted)]">
          <span>Budget restant avant achat</span>
          <span>{(budget.monthlyBudget - budget.spent).toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-[var(--color-primary-dark)] font-medium">
          <span>Budget restant après achat coché</span>
          <span>{(budget.monthlyBudget - budget.spent - checkedTotal).toFixed(2)} €</span>
        </div>
        <button
          onClick={validatePurchase}
          disabled={checkedTotal === 0}
          className="mt-2 bg-[var(--color-primary)] text-white rounded-full py-2.5 font-medium disabled:opacity-40"
        >
          Valider mes achats cochés
        </button>
      </div>
    </div>
  );
}
