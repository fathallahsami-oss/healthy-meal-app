import { Recipe, IngredientLine, Rayon } from "./types";

export type PriceOverrides = Record<string, number>;

export function priceKey(recipeId: string, ingredientName: string): string {
  return `${recipeId}::${ingredientName}`;
}

export function effectivePrice(
  recipeId: string,
  line: IngredientLine,
  overrides: PriceOverrides
): number {
  const key = priceKey(recipeId, line.name);
  return overrides[key] ?? line.estimatedPrice;
}

export interface AggregatedLine {
  name: string;
  rayon: Rayon;
  unit: IngredientLine["unit"];
  quantity: number;
  estimatedPrice: number;
  store?: string;
  fromRecipes: string[];
}

export function buildShoppingList(
  selectedRecipes: Recipe[],
  overrides: PriceOverrides
): AggregatedLine[] {
  const byKey = new Map<string, AggregatedLine>();

  for (const recipe of selectedRecipes) {
    for (const line of recipe.ingredients) {
      const key = `${line.name}::${line.unit}`;
      const price = effectivePrice(recipe.id, line, overrides);
      const existing = byKey.get(key);
      if (existing) {
        existing.quantity += line.quantity;
        existing.estimatedPrice += price;
        if (!existing.fromRecipes.includes(recipe.name)) existing.fromRecipes.push(recipe.name);
      } else {
        byKey.set(key, {
          name: line.name,
          rayon: line.rayon,
          unit: line.unit,
          quantity: line.quantity,
          estimatedPrice: price,
          store: line.store,
          fromRecipes: [recipe.name],
        });
      }
    }
  }

  return Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function groupByRayon(lines: AggregatedLine[]): Map<Rayon, AggregatedLine[]> {
  const grouped = new Map<Rayon, AggregatedLine[]>();
  for (const line of lines) {
    const group = grouped.get(line.rayon) ?? [];
    group.push(line);
    grouped.set(line.rayon, group);
  }
  return grouped;
}

export function totalPrice(lines: AggregatedLine[]): number {
  return lines.reduce((sum, l) => sum + l.estimatedPrice, 0);
}
