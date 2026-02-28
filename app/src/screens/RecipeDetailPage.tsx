import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecipeDetail } from '@/types';

type RecipeDetailPageProps = {
  recipeDetail: RecipeDetail | null;
  onBack: () => void;
  onComplete: () => void;
};

export function RecipeDetailPage({ recipeDetail, onBack, onComplete }: RecipeDetailPageProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>레시피 상세</Text>
      {!recipeDetail ? (
        <ActivityIndicator size="small" color="#111827" />
      ) : (
        <>
          <Text style={styles.recipeTitle}>{recipeDetail.title}</Text>
          <Text style={styles.recipeMeta}>{`${recipeDetail.servings}인분 · ${recipeDetail.time}`}</Text>

          <Text style={styles.sectionTitle}>재료</Text>
          {recipeDetail.ingredients.map((item) => (
            <Text key={item.item} style={styles.listText}>{`- ${item.item}: ${item.amount}`}</Text>
          ))}

          <Text style={styles.sectionTitle}>조리 순서</Text>
          {recipeDetail.steps.map((step) => (
            <View key={step.step} style={styles.stepRow}>
              <Text style={styles.listText}>{`${step.step}. ${step.description}`}</Text>
              {step.tip ? <Text style={styles.tipText}>{`Tip: ${step.tip}`}</Text> : null}
            </View>
          ))}

          <View style={styles.buttonRow}>
            <Pressable style={styles.outlineButton} onPress={onBack}>
              <Text style={styles.outlineButtonText}>목록으로</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={onComplete}>
              <Text style={styles.primaryButtonText}>요리 완료</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  recipeMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  listText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  stepRow: {
    gap: 2,
  },
  tipText: {
    marginTop: 2,
    fontSize: 13,
    color: '#6b7280',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
  },
  outlineButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
