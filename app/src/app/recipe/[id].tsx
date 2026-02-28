import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { fetchRecipeDetail } from '@/api/client';
import { RecipeDetailPage } from '@/screens/RecipeDetailPage';
import { useFlowContext } from '@/store/flow-context';
import type { RecipeDetail } from '@/types';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <RecipeDetailPage recipeDetail={recipeDetail} onBack={handleBack} onComplete={handleComplete} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
});
