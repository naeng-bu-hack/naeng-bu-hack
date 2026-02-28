import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { fetchRecipeDetail, fetchRecipes, shareRecipe } from '../api/client';
import { DEFAULT_INGREDIENTS } from '../mock/fixtures';
import { useFlowState } from '../store/useFlow';
import type { RecipeDetail, RecipeSummary } from '../types';

export default function FlowScreen() {
  const {
    stage,
    ingredients,
    selectedRecipeId,
    addIngredient,
    removeIngredient,
    startLoading,
    openRecipes,
    selectRecipe,
    completeRecipe,
    backToRecipes,
    resetFlow,
  } = useFlowState();

  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [recipeDetail, setRecipeDetail] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (stage !== 'loading') return;

    let cancelled = false;

    fetchRecipes(ingredients)
      .then((result) => {
        if (cancelled) return;
        setRecipes(result);
        setError(null);
        openRecipes();
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [stage, ingredients]);

  useEffect(() => {
    if (stage !== 'detail' || !selectedRecipeId) return;

    let cancelled = false;
    setRecipeDetail(null);

    fetchRecipeDetail(selectedRecipeId)
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
  }, [stage, selectedRecipeId]);

  const selectedRecipeTitle = useMemo(() => recipeDetail?.title ?? '레시피', [recipeDetail]);

  function handleAddIngredient() {
    addIngredient(input);
    setInput('');
  }

  function handleStartSearch() {
    if (ingredients.length === 0) return;
    setError(null);
    setShared(false);
    setRecipeDetail(null);
    startLoading();
  }

  async function handleShare() {
    if (!selectedRecipeId) return;

    try {
      await shareRecipe(selectedRecipeId);
      setShared(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : '공유에 실패했습니다.';
      setError(message);
    }
  }

  function handleUseDefaultIngredients() {
    DEFAULT_INGREDIENTS.forEach((item) => addIngredient(item));
  }

  function handleReset() {
    setShared(false);
    setRecipeDetail(null);
    setRecipes([]);
    setError(null);
    resetFlow();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>naeng-bu-hack</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {stage === 'input' ? (
          <View style={styles.card}>
            <Text style={styles.title}>재료 입력</Text>
            <Text style={styles.description}>냉장고 재료를 추가한 뒤 추천을 시작하세요.</Text>

            <View style={styles.inputRow}>
              <TextInput
                placeholder="예: 계란"
                style={styles.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleAddIngredient}
              />
              <Pressable style={styles.smallButton} onPress={handleAddIngredient}>
                <Text style={styles.smallButtonText}>추가</Text>
              </Pressable>
            </View>

            <View style={styles.tagWrap}>
              {ingredients.map((item) => (
                <Pressable key={item} style={styles.tag} onPress={() => removeIngredient(item)}>
                  <Text style={styles.tagText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.outlineButton} onPress={handleUseDefaultIngredients}>
              <Text style={styles.outlineButtonText}>샘플 재료 넣기</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryButton, ingredients.length === 0 && styles.buttonDisabled]}
              disabled={ingredients.length === 0}
              onPress={handleStartSearch}
            >
              <Text style={styles.primaryButtonText}>레시피 찾기</Text>
            </Pressable>
          </View>
        ) : null}

        {stage === 'loading' ? (
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#111827" />
            <Text style={styles.title}>추천 생성 중</Text>
            <Text style={styles.description}>입력 재료를 기준으로 레시피를 찾고 있어요.</Text>
          </View>
        ) : null}

        {stage === 'recipes' ? (
          <View style={styles.card}>
            <Text style={styles.title}>추천 레시피</Text>
            <Text style={styles.description}>원하는 레시피를 선택하세요.</Text>

            {recipes.map((recipe) => (
              <Pressable key={recipe.id} style={styles.recipeItem} onPress={() => selectRecipe(recipe.id)}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDesc}>{recipe.description}</Text>
                <Text style={styles.recipeMeta}>{`${recipe.badge} · ${recipe.difficulty} · ${recipe.time}`}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.outlineButton} onPress={startLoading}>
              <Text style={styles.outlineButtonText}>다시 추천 받기</Text>
            </Pressable>
          </View>
        ) : null}

        {stage === 'detail' ? (
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
                  <Pressable style={styles.outlineButton} onPress={backToRecipes}>
                    <Text style={styles.outlineButtonText}>목록으로</Text>
                  </Pressable>
                  <Pressable style={styles.primaryButton} onPress={completeRecipe}>
                    <Text style={styles.primaryButtonText}>요리 완료</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        ) : null}

        {stage === 'complete' ? (
          <View style={styles.card}>
            <Text style={styles.title}>완료</Text>
            <Text style={styles.description}>{`${selectedRecipeTitle} 요리가 완성되었습니다.`}</Text>

            <Pressable
              style={[styles.primaryButton, shared && styles.sharedButton]}
              onPress={handleShare}
              disabled={shared}
            >
              <Text style={styles.primaryButtonText}>{shared ? '공유 완료' : '친구에게 공유'}</Text>
            </Pressable>

            <Pressable style={styles.outlineButton} onPress={handleReset}>
              <Text style={styles.outlineButtonText}>처음으로</Text>
            </Pressable>
          </View>
        ) : null}
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
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  smallButton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    color: '#374151',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
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
  buttonDisabled: {
    opacity: 0.4,
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
  tipText: {
    marginTop: 2,
    fontSize: 13,
    color: '#6b7280',
  },
  stepRow: {
    gap: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sharedButton: {
    backgroundColor: '#16a34a',
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
});
