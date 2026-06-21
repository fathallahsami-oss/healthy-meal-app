"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useBudget } from "@/lib/appState";
import { getBudgetSummary } from "@/lib/budget";
import { getRepasDuJour } from "@/lib/dailyPicks";
import { recipePricePerPortion } from "@/lib/types";

export default function Home() {
  const [budget] = useBudget();
  const summary = useMemo(() => getBudgetSummary(budget), [budget]);
  const repas = useMemo(() => getRepasDuJour(), []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-semibold text-[var(--color-primary-dark)]">Bonjour 👋</h1>
        <p className="text-[var(--color-muted)] text-sm">Voici ton budget et tes repas du jour.</p>
      </section>

      <section className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-[var(--color-muted)]">Budget restant ce mois</span>
          <span className="text-2xl font-semibold text-[var(--color-primary-dark)]">
            {summary.remaining.toFixed(2)} €
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
          <div className="bg-rose-50/60 rounded-xl p-3">
            <div className="text-[var(--color-muted)] text-xs">Par jour</div>
            <div className="font-medium">{summary.remainingPerDay.toFixed(2)} €</div>
          </div>
          <div className="bg-rose-50/60 rounded-xl p-3">
            <div className="text-[var(--color-muted)] text-xs">Par semaine</div>
            <div className="font-medium">{summary.remainingPerWeek.toFixed(2)} €</div>
          </div>
        </div>
        {summary.isOverspending && (
          <p className="text-sm text-red-600 mt-3">
            ⚠️ Tu dépenses plus vite que prévu pour finir le mois dans ton budget.
          </p>
        )}
        {!summary.isOverspending && summary.isTight && (
          <p className="text-sm text-amber-600 mt-3">
            💡 Budget serré : privilégie les recettes « budget bas ».
          </p>
        )}
        <Link href="/budget" className="text-sm text-[var(--color-primary-dark)] underline mt-3 inline-block">
          Gérer mon budget →
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-[var(--color-primary-dark)]">Repas du jour</h2>
        {[
          { label: "Petit-déjeuner", recipe: repas.petitDejeuner },
          { label: "Déjeuner", recipe: repas.dejeuner },
          { label: "Dîner", recipe: repas.diner },
        ].map(({ label, recipe }) =>
          recipe ? (
            <Link
              key={label}
              href={`/recettes/${recipe.id}`}
              className="bg-white rounded-2xl border border-rose-100 p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <div className="text-xs text-[var(--color-muted)]">{label}</div>
                <div className="font-medium">{recipe.name}</div>
              </div>
              <div className="text-sm text-[var(--color-primary-dark)]">
                {recipePricePerPortion(recipe).toFixed(2)} €
              </div>
            </Link>
          ) : null
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <QuickLink href="/courses" label="🛒 Liste de courses" />
        <QuickLink href="/frigo" label="🧊 Mon frigo" />
        <QuickLink href="/batch-cooking" label="📦 Batch cooking" />
        <QuickLink href="/recettes" label="🍽️ Toutes les recettes" />
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-rose-100 p-4 text-sm font-medium text-center shadow-sm hover:bg-rose-50"
    >
      {label}
    </Link>
  );
}
