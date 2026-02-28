import { MOCK_RECIPE_DETAILS, MOCK_RECIPES } from '@/mock/fixtures';
import type { IngredientCandidate, RecipeDetail, RecipeSummary } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function fetchRecipes(ingredients: string[]): Promise<RecipeSummary[]> {
  if (USE_MOCK) {
    await delay(700);
    return MOCK_RECIPES;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredients,
      cuisine: 'any',
      max_minutes: 30,
    }),
  });
  const payload = await parseJson<{ recipes: RecipeSummary[] }>(response);
  return payload.recipes;
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

  const response = await fetch(`${API_BASE_URL}/api/v1/recipes/${recipeId}`);
  return parseJson<RecipeDetail>(response);
}

export async function shareRecipe(recipeTitle: string, usedIngredients: string[]): Promise<void> {
  if (USE_MOCK) {
    await delay(250);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/share-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipe_title: recipeTitle,
      used_ingredients: usedIngredients,
    }),
  });
  await parseJson<{ caption: string }>(response);
}

export async function detectIngredientsFromImages(files: unknown[] = []): Promise<IngredientCandidate[]> {
  if (USE_MOCK) {
    await delay(500);
    return [
      { name: '대파', normalized: '대파', confidence: 0.86 },
      { name: '두부', normalized: '두부', confidence: 0.82 },
      { name: '양파', normalized: '양파', confidence: 0.79 },
    ];
  }

  if (files.length === 0) {
    throw new Error('이미지 파일이 필요합니다.');
  }

  const form = new FormData();
  files.forEach((file) => {
    form.append('images', file as Blob);
  });

  const response = await fetch(`${API_BASE_URL}/api/v1/ingredients/detect-from-images`, {
    method: 'POST',
    body: form,
  });
  const payload = await parseJson<{ candidates: IngredientCandidate[] }>(response);
  return payload.candidates;
}
