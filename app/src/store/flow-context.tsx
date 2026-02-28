import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { RecipeSummary } from '@/types';

type FlowContextValue = {
  ingredients: string[];
  recipes: RecipeSummary[];
  selectedRecipeId: string | null;
  addIngredient: (raw: string) => void;
  removeIngredient: (value: string) => void;
  setRecipes: (items: RecipeSummary[]) => void;
  setSelectedRecipeId: (recipeId: string | null) => void;
  resetFlow: () => void;
};

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipesState] = useState<RecipeSummary[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  function addIngredient(raw: string) {
    const value = raw.trim();
    if (!value) return;

    setIngredients((prev) => {
      if (prev.includes(value)) {
        return prev;
      }

      return [...prev, value];
    });
  }

  function removeIngredient(value: string) {
    setIngredients((prev) => prev.filter((item) => item !== value));
  }

  function setRecipes(items: RecipeSummary[]) {
    setRecipesState(items);
  }

  function resetFlow() {
    setIngredients([]);
    setRecipesState([]);
    setSelectedRecipeId(null);
  }

  const value = useMemo(
    () => ({
      ingredients,
      recipes,
      selectedRecipeId,
      addIngredient,
      removeIngredient,
      setRecipes,
      setSelectedRecipeId,
      resetFlow,
    }),
    [ingredients, recipes, selectedRecipeId],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlowContext() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowContext must be used within FlowProvider');
  }

  return context;
}
