import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { fetchRecommendations } from '../api/client';
import { StepCard } from '../components/StepCard';
import { useFlowState } from '../store/useFlow';
import type { RecipeCandidate } from '../types';

export default function FlowScreen() {
  const [recipes, setRecipes] = useState<RecipeCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { currentStep, stepIndex, totalSteps, canGoBack, canGoNext, next, prev } = useFlowState();

  useEffect(() => {
    fetchRecommendations().then(setRecipes).catch((err: Error) => setError(err.message));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>

        <StepCard
          step={stepIndex + 1}
          totalSteps={totalSteps}
          title={currentStep.title}
          description={currentStep.description}
        />

        <View style={styles.buttonRow}>
          <Pressable disabled={!canGoBack} onPress={prev} style={[styles.button, !canGoBack && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>이전</Text>
          </Pressable>
          <Pressable disabled={!canGoNext} onPress={next} style={[styles.button, !canGoNext && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>다음</Text>
          </Pressable>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Mock 추천 결과</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {recipes.map((recipe) => (
            <Text key={recipe.id} style={styles.resultItem}>{`- ${recipe.title} (${recipe.reason})`}</Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  buttonRow: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  resultBox: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    gap: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  resultItem: {
    fontSize: 14,
    color: '#334155',
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
  },
});
