import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { fetchRecipes } from '@/api/client';
import { LoadingPage } from '@/screens/LoadingPage';
import { useFlowContext } from '@/store/flow-context';
import { Screen } from '@/ui/Screen';

export default function LoadingRoute() {
  const router = useRouter();
  const { ingredients, setRecipes } = useFlowContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchRecipes(ingredients)
      .then((result) => {
        if (cancelled) return;
        setRecipes(result);
        router.replace('/recipes');
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [ingredients, router, setRecipes]);

  return (
    <Screen error={error}>
      <LoadingPage />
    </Screen>
  );
}
