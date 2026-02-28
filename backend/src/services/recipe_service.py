import hashlib
from urllib.parse import urlparse

import requests
from fastapi import HTTPException

from src.config import get_settings
from src.db import fetch_recipe_detail
from src.llm_mock import build_recipe_profile_from_url
from src.models.schemas import RecommendResponse, RecipeDetailResponse, RecipeSummaryItem, ShareCardResponse
from src.services.ingredient_service import normalize_ingredients

_RECIPE_DETAIL_CACHE: dict[str, dict] = {}


def recommend_recipes(ingredients_ko: list[str]) -> RecommendResponse:
    settings = get_settings()
    if not settings.recipe_api_base_url:
        raise HTTPException(status_code=500, detail='RECIPE_API_BASE_URL is required.')

    urls = _fetch_recipe_urls(ingredients_ko, settings.recipe_api_base_url, settings.recipe_api_timeout)
    max_urls = max(1, min(settings.recipe_max_urls, 3))
    urls = urls[:max_urls]

    canonical_ingredients = normalize_ingredients(ingredients_ko, use_llm_fallback=True)
    summaries: list[RecipeSummaryItem] = []

    for url in urls:
        recipe_id = _build_recipe_id(url)
        profile = build_recipe_profile_from_url(
            url=url,
            ingredients_ko=ingredients_ko,
            timeout=settings.recipe_api_timeout,
        )
        domain = urlparse(url).netloc or 'external'
        title = str(profile.get("title") or _title_from_url(url, default=f'추천 레시피 {len(summaries) + 1}'))
        description = str(profile.get("description") or f'외부 레시피 서버 추천 결과 ({domain})')
        difficulty = str(profile.get("difficulty") or "보통")
        time = str(profile.get("time") or "30분")
        badge = str(profile.get("badge") or "AI요약")

        summaries.append(
            RecipeSummaryItem(
                id=recipe_id,
                kind='ai',
                title=title,
                description=description,
                difficulty=difficulty,
                time=time,
                badge=badge,
            )
        )

        detail_ingredients = profile.get("ingredients")
        if not isinstance(detail_ingredients, list) or not detail_ingredients:
            detail_ingredients = [{'item': item, 'amount': '적당량'} for item in ingredients_ko[:8]]
        detail_steps = profile.get("steps")
        if not isinstance(detail_steps, list) or not detail_steps:
            detail_steps = [
                {'step': 1, 'description': '원문 레시피 핵심 흐름을 확인한다.', 'tip': url},
                {'step': 2, 'description': '재료를 준비하고 손질한다.'},
                {'step': 3, 'description': '순서대로 조리하고 마무리한다.'},
            ]

        _RECIPE_DETAIL_CACHE[recipe_id] = {
            'id': recipe_id,
            'title': title,
            'servings': int(profile.get("servings") or 2),
            'time': time,
            'ingredients': detail_ingredients,
            'steps': detail_steps,
        }

    if not summaries and canonical_ingredients:
        # 외부 추천 결과가 비어도 최소 카드 1개를 만들어 프론트 플로우를 유지한다.
        fallback_title = f"{canonical_ingredients[0]} 활용 레시피"
        fallback_id = _build_recipe_id(f"fallback::{','.join(canonical_ingredients)}")
        summaries.append(
            RecipeSummaryItem(
                id=fallback_id,
                kind='ai',
                title=fallback_title,
                description='추천 URL이 없어 기본 제안 레시피를 생성했습니다.',
                difficulty='보통',
                time='25분',
                badge='기본제안',
            )
        )
        _RECIPE_DETAIL_CACHE[fallback_id] = {
            'id': fallback_id,
            'title': fallback_title,
            'servings': 2,
            'time': '25분',
            'ingredients': [{'item': item, 'amount': '적당량'} for item in ingredients_ko[:8]],
            'steps': [
                {'step': 1, 'description': '재료를 손질한다.'},
                {'step': 2, 'description': '팬에 재료를 순서대로 볶는다.'},
                {'step': 3, 'description': '간을 맞추고 완성한다.'},
            ],
        }

    return RecommendResponse(recipes=summaries)


def get_recipe_detail(recipe_id: str) -> RecipeDetailResponse:
    cached = _RECIPE_DETAIL_CACHE.get(recipe_id)
    if cached:
        return RecipeDetailResponse(**cached)

    row = fetch_recipe_detail(recipe_id)
    if not row:
        raise HTTPException(status_code=404, detail='Recipe not found.')
    return RecipeDetailResponse(**row)


def build_share_card(recipe_title: str, used_ingredients: list[str]) -> ShareCardResponse:
    ingredients_text = ', '.join(used_ingredients)
    caption = f"오늘의 요리: {recipe_title} | 사용 재료: {ingredients_text}"
    return ShareCardResponse(caption=caption)


def _fetch_recipe_urls(ingredients_ko: list[str], base_url: str, timeout: float) -> list[str]:
    url = f"{base_url.rstrip('/')}/recipes"
    payload = {'ingredients_ko': ingredients_ko}
    try:
        response = requests.post(url, json=payload, timeout=timeout)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f'External recipe API request failed: {exc}') from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise HTTPException(status_code=502, detail='External recipe API returned invalid JSON.') from exc

    recipe_urls = data.get('recipe_urls', [])
    if not isinstance(recipe_urls, list):
        return []

    result: list[str] = []
    for item in recipe_urls:
        if isinstance(item, str) and item.strip():
            result.append(item.strip())
    return result


def _build_recipe_id(url: str) -> str:
    digest = hashlib.md5(url.encode('utf-8')).hexdigest()[:10]
    return f'ext-{digest}'


def _title_from_url(url: str, default: str) -> str:
    path = urlparse(url).path.strip('/')
    if not path:
        return default
    slug = path.split('/')[-1].replace('-', ' ').replace('_', ' ').strip()
    return slug if slug else default
