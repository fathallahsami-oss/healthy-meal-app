"use client";

import { useMemo, useState } from "react";
import { recipes } from "@/lib/recipes";
import { recipePricePerPortion, Recipe, Tag } from "@/lib/types";
import { useSelectedRecipeIds } from "@/lib/appState";
import Link from "next/link";

type ProfileId = "etudiant" | "sportif" | "perte-de-poids" | "gourmand" | "prise-de-muscle";

const PROFILES: { id: ProfileId; label: string; description: string; tags: Tag[] }[] = [
  { id: "etudiant", label: "Étudiant", description: "Moins de 50 €/semaine", tags: ["budget-bas"] },
  { id: "sportif", label: "Sportif", description: "Riche en protéines", tags: ["proteine"] },
  { id: "perte-de-poids", label: "Perte de poids", description: "Déficit calorique", tags: ["moins-500kcal"] },
  { id: "gourmand", label: "Gourmand", description: "Plaisir mais équilibré", tags: ["gourmand"] },
  { id: "prise-de-muscle", label: "Prise de muscle", description: "Surplus calorique contrôlé", tags: ["proteine", "gourmand"] },
];

const DURATIONS = [3, 5, 7, 14] as const;

function pickBatchRecipes(tags: Tag[]): Recipe[] {
  const candidates = recipes.filter((r) => tags.some((t) => r.tags.includes(t)) && r.categories.some((c) => c === "dejeuner" || c === "diner" || c === "meal-prep"));
  return candidates.slice(0, Math.min(4, candidates.length || recipes.length));
}

export default function BatchCookingPage() {
  const [profileId, setProfileId] = useState<ProfileId>("sportif");
  const [duration, setDuration] = useState<3 | 5 | 7 | 14>(5);
  const [, setSelectedIds] = useSelectedRecipeIds();
  const [added, setAdded] = useState(false);

  const profile = PROFILES.find((p) => p.id === profileId)!;

  const plan = useMemo(() => {
    const distinct = pickBatchRecipes(profile.tags);
    const slots = duration * 2; // déjeuner + dîner
    const assignment: Recipe[] = Array.from({ length: slots }, (_, i) => distinct[i % distinct.length]);

    const totalCalories = assignment.reduce((sum, r) => sum + r.calories, 0);
    const totalProtein = assignment.reduce((sum, r) => sum + r.protein, 0);
    const totalBudget = assignment.reduce((sum, r) => sum + recipePricePerPortion(r), 0);
    const totalPrepTime = distinct.reduce((sum, r) => sum + r.prepTimeMin, 0);

    return {
      distinct,
      assignment,
      caloriesPerDay: totalCalories / duration,
      proteinPerDay: totalProtein / duration,
      totalBudget,
      totalPrepTime,
    };
  }, [profile, duration]);

  function addToShoppingList() {
    setSelectedIds((prev) => [...prev, ...plan.assignment.map((r) => r.id)]);
    setAdded(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-[var(--color-primary-dark)]">Batch cooking</h1>

      <div>
        <h2 className="text-sm font-medium text-[var(--color-muted)] mb-2">Profil</h2>
        <div className="grid grid-cols-2 gap-2">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProfileId(p.id);
                setAdded(false);
              }}
              className={`text-left rounded-xl border p-3 ${
                profileId === p.id ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white border-rose-100"
              }`}
            >
              <div className="font-medium text-sm">{p.label}</div>
              <div className={`text-xs ${profileId === p.id ? "text-white/80" : "text-[var(--color-muted)]"}`}>{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-[var(--color-muted)] mb-2">Durée</h2>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuration(d);
                setAdded(false);
              }}
              className={`px-4 py-1.5 rounded-full text-sm border ${
                duration === d ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]" : "bg-white border-rose-100"
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm flex flex-col gap-3">
        <h2 className="font-medium">Recettes du batch</h2>
        <ul className="flex flex-col gap-2">
          {plan.distinct.map((r) => (
            <li key={r.id} className="flex justify-between text-sm">
              <Link href={`/recettes/${r.id}`} className="hover:underline">
                {r.name}
              </Link>
              <span className="text-[var(--color-muted)]">{recipePricePerPortion(r).toFixed(2)} €/portion</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-3 text-sm mt-1">
          <Metric label="Budget total" value={`${plan.totalBudget.toFixed(2)} €`} />
          <Metric label="Temps de prépa" value={`${plan.totalPrepTime} min`} />
          <Metric label="Calories / jour" value={`${Math.round(plan.caloriesPerDay)} kcal`} />
          <Metric label="Protéines / jour" value={`${Math.round(plan.proteinPerDay)} g`} />
        </div>

        <button
          onClick={addToShoppingList}
          className="bg-[var(--color-primary)] text-white rounded-full py-2.5 font-medium mt-1"
        >
          {added ? "Ajouté à la liste de courses ✓" : "Ajouter à la liste de courses"}
        </button>
      </div>
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
