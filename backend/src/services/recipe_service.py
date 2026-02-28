from fastapi import HTTPException

from src.db import fetch_recommendations, fetch_recipe_detail
from src.models.schemas import RecommendResponse, RecipeDetailResponse, RecipeSummaryItem, ShareCardResponse


def recommend_recipes(ingredients: list[str], cuisine: str, max_minutes: int) -> RecommendResponse:
    rows = fetch_recommendations(ingredients=ingredients, cuisine=cuisine, max_minutes=max_minutes)
    recipes = [RecipeSummaryItem(**row) for row in rows]
    return RecommendResponse(recipes=recipes)


def get_recipe_detail(recipe_id: str) -> RecipeDetailResponse:
    row = fetch_recipe_detail(recipe_id)
    if not row:
        raise HTTPException(status_code=404, detail='Recipe not found.')
    return RecipeDetailResponse(**row)


def build_share_card(recipe_title: str, used_ingredients: list[str]) -> ShareCardResponse:
    ingredients_text = ', '.join(used_ingredients)
    caption = f"오늘의 요리: {recipe_title} | 사용 재료: {ingredients_text}"
    return ShareCardResponse(caption=caption)
