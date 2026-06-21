"use client";

import { useLocalStorage } from "./useLocalStorage";
import { BudgetState, DEFAULT_BUDGET } from "./budget";
import { PriceOverrides } from "./shoppingList";

export interface FridgeItem {
  id: string;
  name: string;
}

export function useSelectedRecipeIds() {
  return useLocalStorage<string[]>("hma:selectedRecipeIds", []);
}

export function useFridgeItems() {
  return useLocalStorage<FridgeItem[]>("hma:fridgeItems", []);
}

export function useBudget() {
  return useLocalStorage<BudgetState>("hma:budget", DEFAULT_BUDGET);
}

export function usePriceOverrides() {
  return useLocalStorage<PriceOverrides>("hma:priceOverrides", {});
}

export function useCheckedShoppingItems() {
  return useLocalStorage<string[]>("hma:checkedShoppingItems", []);
}
