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
  "ingredients": ["계란", "대파"],
  "cuisine": "any",
  "max_minutes": 30
}
```
App은 한글 재료명을 보내고, Backend가 내부에서 영문 canonical로 정규화해 추천 로직에 사용합니다.
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
