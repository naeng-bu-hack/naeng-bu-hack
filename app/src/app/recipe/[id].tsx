import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { fetchRecipeDetail } from '@/api/client';
import { RecipeDetailPage } from '@/screens/RecipeDetailPage';
import { useFlowContext } from '@/store/flow-context';
import type { RecipeDetail } from '@/types';
import { Screen } from '@/ui/Screen';

export default function RecipeDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setSelectedRecipeId } = useFlowContext();

  const [recipeDetail, setRecipeDetail] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('레시피 ID가 없습니다.');
      return;
    }

    setSelectedRecipeId(id);

    let cancelled = false;

    fetchRecipeDetail(id)
      .then((result) => {
        if (cancelled) return;
        setRecipeDetail(result);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id, setSelectedRecipeId]);

  function handleBack() {
    router.push('/recipes');
  }

  function handleComplete() {
    if (!id) return;
    router.push(`/complete/${id}`);
  }

  return (
    <Screen error={error}>
      <RecipeDetailPage recipeDetail={recipeDetail} onBack={handleBack} onComplete={handleComplete} />
    </Screen>
  );
}
