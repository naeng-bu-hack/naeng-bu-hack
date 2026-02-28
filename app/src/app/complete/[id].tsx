import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { shareRecipe } from '@/api/client';
import { CompletePage } from '@/screens/CompletePage';
import { useFlowContext } from '@/store/flow-context';
import { Screen } from '@/ui/Screen';

export default function CompleteRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, ingredients, resetFlow } = useFlowContext();

  const [shared, setShared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipeTitle = useMemo(() => {
    if (!id) return '레시피';
    const recipe = recipes.find((item) => item.id === id);
    return recipe?.title ?? '레시피';
  }, [id, recipes]);

  async function handleShare() {
    if (!id) return;

    try {
      await shareRecipe(recipeTitle, ingredients);
      setShared(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : '공유에 실패했습니다.';
      setError(message);
    }
  }

  function handleReset() {
    setShared(false);
    setError(null);
    resetFlow();
    router.replace('/');
  }

  return (
    <Screen error={error}>
      <CompletePage recipeTitle={recipeTitle} shared={shared} onShare={handleShare} onReset={handleReset} />
    </Screen>
  );
}
