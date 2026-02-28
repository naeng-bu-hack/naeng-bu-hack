# API Contract (App <-> Backend)

## Base
- Base URL: `http://localhost:8000`
- Prefix: `/api/v1`
- Content-Type:
  - JSON endpoints: `application/json`
  - Image detect: `multipart/form-data`

## Health
- `GET /health`
- Response:
```json
{
  "status": "ok",
  "app": "naeng-bu-hack API",
  "env": "local",
  "port": 8000
}
```

## Ingredients

### Detect From Images
- `POST /api/v1/ingredients/detect-from-images`
- Request: `multipart/form-data` with key `image` (single file)
- Response:
```json
{
  "candidates": [
    {"name": "대파", "normalized": "green onion", "confidence": 0.75}
  ]
}
```

### Normalize
- `POST /api/v1/ingredients/normalize`
- Request:
```json
{
  "manual": ["계란", "두부"],
  "confirmed_from_image": ["green onion"],
  "rejected_from_image": []
}
```
- Response:
```json
{
  "ingredients": ["egg", "tofu", "green onion"],
  "display_names": ["계란", "두부", "대파"],
  "count": 3
}
```

## Recipes

### Recommend
- `POST /api/v1/recommendations`
- Request:
```json
{
  "ingredients_ko": ["계란", "대파"]
}
```
Backend는 요청을 외부 레시피 서버(`POST {RECIPE_API_BASE_URL}/recipes`)로 전달합니다.
외부 응답 URL 중 상위 2~3개만 처리하고, URL 내용을 기반으로 LLM 요약/재구성 단계를 거쳐 `recipes`를 반환합니다.
외부 서버 요청 페이로드:
```json
{
  "ingredients_ko": ["계란", "대파"]
}
```
외부 서버 응답 예시:
```json
{
  "recipe_count": 2,
  "recipe_urls": ["https://example.com/recipes/a", "https://example.com/recipes/b"]
}
```
- Response:
```json
{
  "recipes": [
    {
      "id": "general",
      "kind": "general",
      "title": "김치볶음밥",
      "description": "클래식한 김치볶음밥. 빠르고 실패 확률이 낮아요.",
      "difficulty": "쉬움",
      "time": "15분",
      "badge": "클래식"
    }
  ]
}
```

### Recipe Detail
- `GET /api/v1/recipes/{id}`
- Response:
```json
{
  "id": "general",
  "title": "김치볶음밥",
  "servings": 2,
  "time": "15분",
  "ingredients": [{"item": "밥", "amount": "2공기"}],
  "steps": [{"step": 1, "description": "김치와 양파를 잘게 썬다.", "tip": null}]
}
```

### Share Card
- `POST /api/v1/share-card`
- Request:
```json
{
  "recipe_title": "김치볶음밥",
  "used_ingredients": ["김치", "계란"]
}
```
- Response:
```json
{
  "caption": "오늘의 요리: 김치볶음밥 | 사용 재료: 김치, 계란"
}
```
