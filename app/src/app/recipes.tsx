import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { RecipeListPage } from '@/screens/RecipeListPage';
import { useFlowContext } from '@/store/flow-context';

export default function RecipesRoute() {
  const router = useRouter();
  const { recipes, setSelectedRecipeId } = useFlowContext();

  function handleSelectRecipe(recipeId: string) {
    setSelectedRecipeId(recipeId);
    router.push(`/recipe/${recipeId}`);
  }

  function handleRefresh() {
    router.replace('/loading');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>
        <RecipeListPage recipes={recipes} onSelectRecipe={handleSelectRecipe} onRefresh={handleRefresh} />
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
});
