import { MOCK_RECIPE_DETAILS, MOCK_RECIPES } from '@/mock/fixtures';
import type { IngredientCandidate, RecipeDetail, RecipeSummary } from '@/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';
const IS_WEB = typeof document !== 'undefined';

export type UploadImage =
  | File
  | {
      uri: string;
      name?: string;
      type?: string;
    };

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      reject(abortError);
    };
    if (signal) {
      signal.addEventListener('abort', onAbort);
    }
  });
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const body = await response.json();
        if (typeof body?.detail === 'string') {
          message = body.detail;
        } else if (Array.isArray(body?.detail)) {
          message = body.detail
            .map((item: any) => {
              const loc = Array.isArray(item?.loc) ? item.loc.join('.') : 'body';
              const msg = typeof item?.msg === 'string' ? item.msg : 'invalid value';
              return `${loc}: ${msg}`;
            })
            .join('\n');
        } else {
          message = JSON.stringify(body);
        }
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

function isWebFile(value: UploadImage): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

export async function fetchRecipes(ingredients: string[]): Promise<RecipeSummary[]> {
  if (USE_MOCK) {
    await delay(3000);
    return MOCK_RECIPES;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredients_ko: ingredients,
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

export async function detectIngredientsFromImages(
  image?: UploadImage,
  options?: { signal?: AbortSignal },
): Promise<IngredientCandidate[]> {
  if (USE_MOCK) {
    await delay(500, options?.signal);
    return [
      { name: '대파', normalized: 'green onion', confidence: 0.86 },
      { name: '두부', normalized: 'tofu', confidence: 0.82 },
      { name: '양파', normalized: 'onion', confidence: 0.79 },
    ];
  }

  if (!image) {
    throw new Error('이미지 파일이 필요합니다.');
  }

  const form = new FormData();
  const file = image;
  const index = 0;
  if (isWebFile(file)) {
    form.append('image', file);
  } else {
    // Web must send real File/Blob parts. Plain objects become strings and cause 422.
    if (IS_WEB) {
      if (typeof fetch !== 'undefined' && (file.uri.startsWith('blob:') || file.uri.startsWith('http') || file.uri.startsWith('data:'))) {
        const blobResponse = await fetch(file.uri);
        const blob = await blobResponse.blob();
        form.append('image', blob, file.name ?? `image-${index}.jpg`);
      } else {
        throw new Error('웹 업로드는 File/Blob 이미지가 필요합니다. 앨범에서 이미지를 다시 선택해주세요.');
      }
    } else {
      // React Native native platforms: uri-based file part.
      form.append('image', {
        uri: file.uri,
        name: file.name ?? `image-${index}.jpg`,
        type: file.type ?? 'image/jpeg',
      } as any);
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/ingredients/detect-from-images`, {
    method: 'POST',
    body: form,
    signal: options?.signal,
  });
  const payload = await parseJson<{ candidates: IngredientCandidate[] }>(response);
  return payload.candidates;
}
