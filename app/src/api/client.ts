import { MOCK_RECIPE_DETAILS, MOCK_RECIPES } from '../mock/fixtures';
import type { RecipeDetail, RecipeSummary } from '../types';

const USE_MOCK = true;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchRecipes(_ingredients: string[]): Promise<RecipeSummary[]> {
  if (USE_MOCK) {
    await delay(700);
    return MOCK_RECIPES;
  }

  const response = await fetch('http://localhost:8000/api/v1/recommendations');
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
}

export async function fetchRecipeDetail(recipeId: string): Promise<RecipeDetail> {
  if (USE_MOCK) {
    await delay(300);
    const recipe = MOCK_RECIPE_DETAILS[recipeId];
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return recipe;
  }

  const response = await fetch(`http://localhost:8000/api/v1/recipes/${recipeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipe detail');
  }

  return response.json();
}

export async function shareRecipe(_recipeId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(250);
    return;
  }

  const response = await fetch('http://localhost:8000/api/v1/share', { method: 'POST' });
  if (!response.ok) {
    throw new Error('Failed to share recipe');
  }
}
