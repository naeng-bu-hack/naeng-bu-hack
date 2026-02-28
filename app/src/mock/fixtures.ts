import type { RecipeDetail, RecipeSummary } from '../types';

export const DEFAULT_INGREDIENTS = ['김치', '계란', '밥'];

export const MOCK_RECIPES: RecipeSummary[] = [
  {
    id: 'general',
    kind: 'general',
    title: '김치볶음밥',
    description: '클래식한 김치볶음밥. 빠르고 실패 확률이 낮아요.',
    difficulty: '쉬움',
    time: '15분',
    badge: '클래식',
  },
  {
    id: 'creative',
    kind: 'creative',
    title: '원팬 김치치즈덮밥',
    description: '팬 하나로 끝내는 치즈 덮밥 스타일 레시피.',
    difficulty: '쉬움',
    time: '20분',
    badge: '원팬',
  },
  {
    id: 'ai',
    kind: 'ai',
    title: '김치 크림 리조또',
    description: '김치와 크림을 섞은 퓨전 스타일 레시피.',
    difficulty: '보통',
    time: '30분',
    badge: '창작',
  },
];

export const MOCK_RECIPE_DETAILS: Record<string, RecipeDetail> = {
  general: {
    id: 'general',
    title: '김치볶음밥',
    servings: 2,
    time: '15분',
    ingredients: [
      { item: '밥', amount: '2공기' },
      { item: '김치', amount: '1컵' },
      { item: '계란', amount: '2개' },
      { item: '양파', amount: '1/2개' },
      { item: '참기름', amount: '1큰술' },
    ],
    steps: [
      { step: 1, description: '김치와 양파를 잘게 썬다.' },
      { step: 2, description: '팬에 김치와 양파를 볶는다.' },
      { step: 3, description: '밥을 넣고 함께 볶는다.', tip: '찬밥을 쓰면 더 잘 볶여요.' },
      { step: 4, description: '간을 맞추고 계란을 올린다.' },
    ],
  },
  creative: {
    id: 'creative',
    title: '원팬 김치치즈덮밥',
    servings: 2,
    time: '20분',
    ingredients: [
      { item: '밥', amount: '2공기' },
      { item: '김치', amount: '1.5컵' },
      { item: '모짜렐라 치즈', amount: '1컵' },
      { item: '계란', amount: '2개' },
      { item: '대파', amount: '약간' },
    ],
    steps: [
      { step: 1, description: '팬에 밥과 김치를 올려 중불로 익힌다.' },
      { step: 2, description: '치즈를 올리고 뚜껑을 덮는다.' },
      { step: 3, description: '치즈가 녹으면 계란과 대파를 올린다.' },
    ],
  },
  ai: {
    id: 'ai',
    title: '김치 크림 리조또',
    servings: 2,
    time: '30분',
    ingredients: [
      { item: '밥', amount: '2공기' },
      { item: '김치', amount: '1컵' },
      { item: '생크림', amount: '1/2컵' },
      { item: '파마산 치즈', amount: '1/3컵' },
      { item: '버터', amount: '2큰술' },
    ],
    steps: [
      { step: 1, description: '양파와 마늘을 볶아 향을 낸다.' },
      { step: 2, description: '김치를 넣고 수분을 날린다.' },
      { step: 3, description: '밥, 생크림, 치즈를 넣고 농도를 맞춘다.' },
    ],
  },
};
