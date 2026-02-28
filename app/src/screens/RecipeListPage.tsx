import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecipeSummary } from '@/types';

type RecipeListPageProps = {
  recipes: RecipeSummary[];
  onSelectRecipe: (recipeId: string) => void;
  onRefresh: () => void;
};

export function RecipeListPage({ recipes, onSelectRecipe, onRefresh }: RecipeListPageProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>추천 레시피</Text>
      <Text style={styles.description}>원하는 레시피를 선택하세요.</Text>

      {recipes.map((recipe) => (
        <Pressable key={recipe.id} style={styles.recipeItem} onPress={() => onSelectRecipe(recipe.id)}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeDesc}>{recipe.description}</Text>
          <Text style={styles.recipeMeta}>{`${recipe.badge} · ${recipe.difficulty} · ${recipe.time}`}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.outlineButton} onPress={onRefresh}>
        <Text style={styles.outlineButtonText}>다시 추천 받기</Text>
      </Pressable>
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
  description: {
    fontSize: 14,
    color: '#4b5563',
  },
  recipeItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  recipeDesc: {
    fontSize: 14,
    color: '#4b5563',
  },
  recipeMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
});
