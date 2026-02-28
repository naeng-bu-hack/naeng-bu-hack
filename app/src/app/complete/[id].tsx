import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { shareRecipe } from '@/api/client';
import { CompletePage } from '@/screens/CompletePage';
import { useFlowContext } from '@/store/flow-context';

export default function CompleteRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, resetFlow } = useFlowContext();

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
      await shareRecipe(id);
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <CompletePage recipeTitle={recipeTitle} shared={shared} onShare={handleShare} onReset={handleReset} />
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
