# app

Expo + React Native 프론트엔드입니다.

## 디렉토리
- `src/`: 앱 소스 코드
- `App.tsx`: Expo 엔트리 (`src/App.tsx`를 import)
- `docker-compose.yml`: app 단독 실행
- `Dockerfile`: app 컨테이너 빌드 설정
- `planning.md`: 앱/서비스 기획

### `src/` 구조 (단순화 버전)
- `screens/`: 유저 플로우 화면
- `components/`: 재사용 UI
- `api/`: 서버 호출 함수
- `store/`: 화면 상태 훅
- `types/`: 타입 정의
- `mock/`: Mock 데이터

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

## 현재 기본 화면
- 6단계 유저플로우 샘플 화면 + Mock 추천 결과
- 화면 코드: `src/screens/FlowScreen.tsx`
