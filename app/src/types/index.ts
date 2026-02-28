export type AppStage = 'input' | 'loading' | 'recipes' | 'detail' | 'complete';

export type RecipeKind = 'general' | 'creative' | 'ai';

export type RecipeSummary = {
  id: string;
  kind: RecipeKind;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  badge: string;
};

export type RecipeIngredient = {
  item: string;
  amount: string;
};

export type RecipeStep = {
  step: number;
  description: string;
  tip?: string;
};

export type RecipeDetail = {
  id: string;
  title: string;
  servings: number;
  time: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export type IngredientCandidate = {
  name: string;
  normalized: string;
  confidence: number;
};
