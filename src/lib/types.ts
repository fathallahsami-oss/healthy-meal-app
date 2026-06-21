export type Rayon =
  | "proteines"
  | "feculents"
  | "legumes"
  | "fruits"
  | "laitiers"
  | "surgeles"
  | "sauces"
  | "snacks"
  | "epices";

export const RAYON_LABELS: Record<Rayon, string> = {
  proteines: "Protéines",
  feculents: "Féculents",
  legumes: "Légumes",
  fruits: "Fruits",
  laitiers: "Produits laitiers",
  surgeles: "Surgelés",
  sauces: "Sauces healthy",
  snacks: "Snacks protéinés",
  epices: "Épices et condiments",
};

export type Unit = "g" | "ml" | "piece" | "cs" | "cc";

export type Category =
  | "petit-dejeuner"
  | "dejeuner"
  | "diner"
  | "collation"
  | "post-training"
  | "rapide"
  | "meal-prep";

export const CATEGORY_LABELS: Record<Category, string> = {
  "petit-dejeuner": "Petit-déjeuner",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  collation: "Collation",
  "post-training": "Post-training",
  rapide: "Repas rapide",
  "meal-prep": "Meal prep",
};

export type Tag =
  | "budget-bas"
  | "proteine"
  | "moins-500kcal"
  | "rapide"
  | "sans-cuisson"
  | "meal-prep"
  | "vegetarien"
  | "sans-lactose"
  | "sans-gluten"
  | "gourmand"
  | "lidl"
  | "picard"
  | "leger-soir";

export const TAG_LABELS: Record<Tag, string> = {
  "budget-bas": "Budget bas",
  proteine: "Riche en protéines",
  "moins-500kcal": "Moins de 500 kcal",
  rapide: "Rapide (< 15 min)",
  "sans-cuisson": "Sans cuisson",
  "meal-prep": "Meal prep",
  vegetarien: "Végétarien",
  "sans-lactose": "Sans lactose",
  "sans-gluten": "Sans gluten",
  gourmand: "Gourmand mais healthy",
  lidl: "Spécial Lidl",
  picard: "Spécial Picard",
  "leger-soir": "Repas du soir léger",
};

export type Difficulty = "facile" | "moyen" | "avance";

export interface IngredientLine {
  name: string;
  quantity: number;
  unit: Unit;
  rayon: Rayon;
  /** Prix estimé pour cette quantité dans cette recette, en euros. Modifiable par l'utilisateur. */
  estimatedPrice: number;
  store?: string;
}

export interface Recipe {
  id: string;
  name: string;
  categories: Category[];
  portions: number;
  prepTimeMin: number;
  difficulty: Difficulty;
  tags: Tag[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: IngredientLine[];
  cheaperOption?: string;
  fancierOption?: string;
  quickOption?: string;
}

export function recipePricePerPortion(recipe: Recipe): number {
  const total = recipe.ingredients.reduce((sum, i) => sum + i.estimatedPrice, 0);
  return total / recipe.portions;
}

export function recipeTotalPrice(recipe: Recipe): number {
  return recipe.ingredients.reduce((sum, i) => sum + i.estimatedPrice, 0);
}
