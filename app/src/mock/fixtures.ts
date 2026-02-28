import type { FlowStep, RecipeCandidate } from '../types';

export const FLOW_STEPS: FlowStep[] = [
  { id: 1, title: '재료 입력', description: '텍스트/보이스/사진으로 재료 입력' },
  { id: 2, title: '재료 확인', description: 'AI 추출 결과를 빠르게 수정' },
  { id: 3, title: '요리 조건', description: '음식 종류, 시간, 난이도 선택' },
  { id: 4, title: '레시피 추천', description: '상위 3개 후보 확인' },
  { id: 5, title: '대본 생성', description: '냉부해 스타일 대본 확인' },
  { id: 6, title: '공유 카드', description: '결과 이미지/텍스트 공유' },
];

export const MOCK_RECIPES: RecipeCandidate[] = [
  { id: 'r1', title: '김치볶음밥', reason: '입력 재료 커버리지가 높음' },
  { id: 'r2', title: '계란말이', reason: '빠른 조리 시간 조건 일치' },
  { id: 'r3', title: '된장찌개', reason: '한식 선호 조건 일치' },
];
