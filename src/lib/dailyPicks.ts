import { Category, Recipe } from "./types";
import { recipes } from "./recipes";

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

function pickForCategory(category: Category, date: Date): Recipe | undefined {
  const candidates = recipes.filter((r) => r.categories.includes(category));
  if (candidates.length === 0) return undefined;
  const index = dayOfYear(date) % candidates.length;
  return candidates[index];
}

export function getRepasDuJour(date: Date = new Date()) {
  return {
    petitDejeuner: pickForCategory("petit-dejeuner", date),
    dejeuner: pickForCategory("dejeuner", date),
    diner: pickForCategory("diner", date),
  };
}
