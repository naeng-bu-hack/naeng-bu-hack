# naeng-bu-hack (Monorepo)

냉장고 재료 기반 요리 추천 프로젝트 모노레포입니다.

## 구조
- `app/`: Expo + React Native 프론트엔드
  - 코드 위치: `app/src`
  - 아키텍처: `screens/components/api/store/types/mock` 단순화 구조
  - 단독 실행 compose: `app/docker-compose.yml`
- `backend/`: FastAPI 백엔드
  - 코드 위치: `backend/src`
  - 아키텍처: `routers/models/services/db/llm` 모듈 분리 구조
  - 단독 실행 compose: `backend/docker-compose.yml`

## 실행 방법

### 루트에서 둘 다 실행
```bash
docker compose up -d --build
```

로그:
```bash
docker compose logs -f app backend
```

중지:
```bash
docker compose down
```

## 서비스 주소
- App (Expo Web): http://localhost:19006
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs

## 세부 가이드
- [app/README.md](app/README.md)
- [backend/README.md](backend/README.md)
