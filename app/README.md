# app

Expo + React Native 프론트엔드입니다.

## 디렉토리
- `src/`: 앱 소스 코드
- `App.tsx`: Expo 엔트리 파일(현재 실제 라우팅 엔트리는 `expo-router/entry`)
- `docker-compose.yml`: app 단독 실행
- `Dockerfile`: app 컨테이너 빌드 설정
- `planning.md`: 앱/서비스 기획

### `src/` 구조
- `app/`: `expo-router` 파일 기반 라우트
  - `_layout.tsx`: 전역 Provider + Stack 설정
  - `index.tsx`: 재료 입력
  - `loading.tsx`: 추천 로딩
  - `recipes.tsx`: 레시피 목록
  - `recipe/[id].tsx`: 레시피 상세
  - `complete/[id].tsx`: 완료/공유
- `screens/`: 페이지 UI 컴포넌트
- `ui/`: 재사용 프리미티브 (`Screen`, `Card`, `Button`, `Input`, `Chip`)
- `theme/tokens.ts`: 색상/간격/타이포 토큰
- `store/flow-context.tsx`: 라우트 간 공유 상태
- `api/`: 서버 호출 함수 (현재 mock 비동기)
- `types/`: 타입 정의
- `mock/`: Mock 데이터
- import 경로는 `@/` 절대경로(`@/* -> src/*`)를 사용

## 현재 기본 화면
- 5단계 유저 플로우
  - `input -> loading -> recipes -> detail -> complete`
- 카메라 플로우: `카메라 분석 -> 인식 결과 확인 모달 -> 선택 반영`

## 1) app 단독 실행 (Docker Compose)

```bash
cd app
docker compose up -d --build
```

로그 확인:

```bash
docker compose logs -f app
```

중지:

```bash
docker compose down
```

접속 주소:
- Expo Web: http://localhost:19006

## 2) 로컬 실행 (Docker 없이)

환경변수 설정:

```bash
cp env.example .env
```

주요 변수:
- `EXPO_PUBLIC_USE_MOCK`: `true`/`false` (기본 `true`)
- `EXPO_PUBLIC_API_BASE_URL`: 기본 `http://localhost:8000`

```bash
cd app
npm install
npx expo start --web --host localhost --port 19006
```

## 3) 루트에서 app + backend 동시 실행

```bash
cd ..
docker compose up -d --build
```
