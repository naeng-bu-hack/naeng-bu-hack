import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { fetchRecipes } from '@/api/client';
import { LoadingPage } from '@/screens/LoadingPage';
import { useFlowContext } from '@/store/flow-context';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <LoadingPage />
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
