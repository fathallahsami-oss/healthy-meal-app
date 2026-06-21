"use client";

import { useMemo } from "react";
import { useBudget } from "@/lib/appState";
import { getBudgetSummary } from "@/lib/budget";
import Link from "next/link";

export default function BudgetPage() {
  const [budget, setBudget] = useBudget();
  const summary = useMemo(() => getBudgetSummary(budget), [budget]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-[var(--color-primary-dark)]">Budget courses</h1>

      <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Budget courses du mois (€)
          <input
            type="number"
            min={0}
            value={budget.monthlyBudget}
            onChange={(e) => setBudget((b) => ({ ...b, monthlyBudget: Number(e.target.value) }))}
            className="border border-rose-200 rounded-lg px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Déjà dépensé ce mois (€)
          <input
            type="number"
            min={0}
            value={budget.spent}
            onChange={(e) => setBudget((b) => ({ ...b, spent: Number(e.target.value) }))}
            className="border border-rose-200 rounded-lg px-3 py-2"
          />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm grid grid-cols-2 gap-3 text-sm">
        <Metric label="Restant ce mois" value={`${summary.remaining.toFixed(2)} €`} />
        <Metric label="Jours restants" value={`${summary.daysLeft} j`} />
        <Metric label="Restant / jour" value={`${summary.remainingPerDay.toFixed(2)} €`} />
        <Metric label="Restant / semaine" value={`${summary.remainingPerWeek.toFixed(2)} €`} />
      </div>

      {summary.isOverspending && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          ⚠️ Tu dépenses plus vite que prévu : à ce rythme, tu risques de dépasser ton budget avant la fin du mois.
        </div>
      )}
      {!summary.isOverspending && summary.isTight && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-sm">
          💡 Budget serré ({summary.remainingPerDay.toFixed(2)} €/jour). Privilégie les recettes « budget bas ».
          <Link href="/recettes" className="underline ml-1">Voir ces recettes →</Link>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-rose-50/60 rounded-xl p-3">
      <div className="text-[var(--color-muted)] text-xs">{label}</div>
      <div className="font-medium text-[var(--color-primary-dark)]">{value}</div>
    </div>
  );
}
