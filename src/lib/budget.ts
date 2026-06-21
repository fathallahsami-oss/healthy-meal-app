export interface BudgetState {
  monthlyBudget: number;
  spent: number;
}

export const DEFAULT_BUDGET: BudgetState = {
  monthlyBudget: 250,
  spent: 0,
};

export function daysRemainingInMonth(now: Date = new Date()): number {
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate() + 1;
}

export function weeksRemainingInMonth(now: Date = new Date()): number {
  return Math.max(1, Math.ceil(daysRemainingInMonth(now) / 7));
}

export interface BudgetSummary {
  remaining: number;
  remainingPerDay: number;
  remainingPerWeek: number;
  daysLeft: number;
  isOverspending: boolean;
  isTight: boolean;
}

/**
 * "isOverspending" : il ne reste plus assez de budget pour couvrir les jours restants
 * au même rythme que ce qui a déjà été dépensé ce mois-ci.
 */
export function getBudgetSummary(budget: BudgetState, now: Date = new Date()): BudgetSummary {
  const remaining = budget.monthlyBudget - budget.spent;
  const daysLeft = daysRemainingInMonth(now);
  const weeksLeft = weeksRemainingInMonth(now);
  const remainingPerDay = remaining / daysLeft;
  const remainingPerWeek = remaining / weeksLeft;

  const dayOfMonth = now.getDate();
  const expectedPaceSpent = (budget.monthlyBudget / (daysLeft + dayOfMonth - 1)) * (dayOfMonth - 1);

  return {
    remaining,
    remainingPerDay,
    remainingPerWeek,
    daysLeft,
    isOverspending: remaining < 0 || budget.spent > expectedPaceSpent * 1.15,
    isTight: remainingPerDay < 6,
  };
}
