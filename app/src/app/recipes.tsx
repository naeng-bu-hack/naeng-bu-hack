import { useRouter } from 'expo-router';

import { RecipeListPage } from '@/screens/RecipeListPage';
import { useFlowContext } from '@/store/flow-context';
import { Screen } from '@/ui/Screen';

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
    <Screen>
      <RecipeListPage recipes={recipes} onSelectRecipe={handleSelectRecipe} onRefresh={handleRefresh} />
    </Screen>
  );
}
