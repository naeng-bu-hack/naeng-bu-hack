import { useState } from 'react';

import type { AppStage } from '../types';

type FlowState = {
  stage: AppStage;
  ingredients: string[];
  selectedRecipeId: string | null;
};

const initialState: FlowState = {
  stage: 'input',
  ingredients: [],
  selectedRecipeId: null,
};

export function useFlowState() {
  const [state, setState] = useState<FlowState>(initialState);

  function addIngredient(raw: string) {
    const value = raw.trim();
    if (!value) return;

    setState((prev) => {
      if (prev.ingredients.includes(value)) {
        return prev;
      }

      return {
        ...prev,
        ingredients: [...prev.ingredients, value],
      };
    });
  }

  function removeIngredient(value: string) {
    setState((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((item) => item !== value),
    }));
  }

  function startLoading() {
    setState((prev) => ({ ...prev, stage: 'loading' }));
  }

  function openRecipes() {
    setState((prev) => ({ ...prev, stage: 'recipes' }));
  }

  function selectRecipe(recipeId: string) {
    setState((prev) => ({
      ...prev,
      stage: 'detail',
      selectedRecipeId: recipeId,
    }));
  }

  function completeRecipe() {
    setState((prev) => ({ ...prev, stage: 'complete' }));
  }

  function backToRecipes() {
    setState((prev) => ({ ...prev, stage: 'recipes' }));
  }

  function resetFlow() {
    setState(initialState);
  }

  return {
    ...state,
    addIngredient,
    removeIngredient,
    startLoading,
    openRecipes,
    selectRecipe,
    completeRecipe,
    backToRecipes,
    resetFlow,
  };
}
