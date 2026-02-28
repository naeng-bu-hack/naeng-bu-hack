import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';
import type { RecipeDetail } from '@/types';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

type RecipeDetailPageProps = {
  recipeDetail: RecipeDetail | null;
  onBack: () => void;
  onComplete: () => void;
};

export function RecipeDetailPage({ recipeDetail, onBack, onComplete }: RecipeDetailPageProps) {
  return (
    <Card>
      <Text style={styles.title}>레시피 상세</Text>
      {!recipeDetail ? (
        <ActivityIndicator size="small" color={colors.primary} />
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
            <Button label="목록으로" variant="outline" flex onPress={onBack} />
            <Button label="요리 완료" flex onPress={onComplete} />
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recipeMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
  listText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stepRow: {
    gap: 2,
  },
  tipText: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
