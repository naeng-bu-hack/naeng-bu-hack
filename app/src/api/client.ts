import { MOCK_RECIPES } from '../mock/fixtures';
import type { RecipeCandidate } from '../types';

const USE_MOCK = true;

export async function fetchRecommendations(): Promise<RecipeCandidate[]> {
  if (USE_MOCK) {
    return Promise.resolve(MOCK_RECIPES);
  }

  const response = await fetch('http://localhost:8000/api/v1/recommendations');
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  return response.json();
}
