# backend

FastAPI 기반 백엔드 서버입니다.
루트 프로젝트 안내는 `../README.md`를 참고하세요.

## 디렉토리
- `src/`: 백엔드 소스 코드
- `docker-compose.yml`: backend 단독 실행
- `Dockerfile`: backend 컨테이너 빌드 설정

### `src/` 구조 (단순화 버전)
- `main.py`: FastAPI 앱 엔트리
- `routers/`: API 라우터
- `models/`: 요청/응답 스키마
- `services/`: 도메인별 비즈니스 로직
  - `recipe_service.py`: 레시피 추천/스크립트/공유카드 로직
  - `ingredient_service.py`: 재료 추출/병합 로직
- `db.py`: DB 조회 함수(현재 Mock)
- `llm.py`: LLM 래퍼(현재 Mock)
- `utils.py`: 공통 유틸
- `config.py`: 환경변수 설정

## 1) 환경변수 설정

```bash
cp env.example .env
```

필요 시 `.env` 값을 수정합니다.

## 2) Docker Compose로 실행

```bash
docker compose up -d --build
```

로그 확인:

```bash
docker compose logs -f backend
```

중지:

```bash
docker compose down
```

## 3) 접속 주소

- API: http://localhost:8000
- Health Check: http://localhost:8000/health
- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

### 기본 API (스캐폴딩)
- `GET /health`
- `POST /api/v1/ingredients/parse`
- `POST /api/v1/recommendations`
- `POST /api/v1/script`
- `POST /api/v1/share-card`

## 4) 환경변수 로딩 방식

- `src/config.py`에서 `python-dotenv`로 `.env`를 로드합니다.
- `get_settings()`로 앱 설정을 중앙 관리합니다.
- 현재 사용 변수:
  - `APP_NAME`
  - `APP_DESCRIPTION`
  - `APP_VERSION`
  - `APP_ENV`
  - `APP_HOST`
  - `APP_PORT`

## 5) 루트에서 app + backend 동시 실행

```bash
cd ..
docker compose up -d --build
```
