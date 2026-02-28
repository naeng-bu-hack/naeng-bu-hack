from src.db import fetch_recipe_candidates
from src.llm import generate_style_script
from src.models.schemas import (
    IngredientItem,
    IngredientParseResponse,
    RecommendResponse,
    RecipeCandidate,
    ScriptResponse,
    ShareCardResponse,
)


def parse_ingredients(utterance: str) -> IngredientParseResponse:
    ingredients = [
        IngredientItem(name_raw='김치', normalized_id='kimchi', quantity='1통', confidence=0.92),
        IngredientItem(name_raw='계란', normalized_id='egg', quantity='2개', confidence=0.95),
    ]
    return IngredientParseResponse(utterance=utterance, ingredients=ingredients, unknown_chunks=[])


def recommend_recipes(ingredients: list[str], cuisine: str, max_minutes: int) -> RecommendResponse:
    rows = fetch_recipe_candidates(ingredients=ingredients, cuisine=cuisine, max_minutes=max_minutes)
    candidates = [RecipeCandidate(**row) for row in rows]
    return RecommendResponse(candidates=candidates)


def build_script(recipe_title: str) -> ScriptResponse:
    return ScriptResponse(script=generate_style_script(recipe_title))


def build_share_card(recipe_title: str, used_ingredients: list[str]) -> ShareCardResponse:
    ingredients_text = ', '.join(used_ingredients)
    caption = f"오늘의 요리: {recipe_title} | 사용 재료: {ingredients_text}"
    return ShareCardResponse(caption=caption)
