import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { RecipeSummary } from '@/types';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';

type RecipeListPageProps = {
  recipes: RecipeSummary[];
  onSelectRecipe: (recipeId: string) => void;
  onRefresh: () => void;
};

export function RecipeListPage({ recipes, onSelectRecipe, onRefresh }: RecipeListPageProps) {
  return (
    <Card>
      <Text style={styles.title}>추천 레시피</Text>
      <Text style={styles.description}>원하는 레시피를 선택하세요.</Text>

      {recipes.map((recipe) => (
        <Pressable key={recipe.id} style={styles.recipeItem} onPress={() => onSelectRecipe(recipe.id)}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeDesc}>{recipe.description}</Text>
          <Text style={styles.recipeMeta}>{`${recipe.badge} · ${recipe.difficulty} · ${recipe.time}`}</Text>
        </Pressable>
      ))}

      <Button label="다시 추천 받기" variant="outline" onPress={onRefresh} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  description: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  recipeItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recipeDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recipeMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
