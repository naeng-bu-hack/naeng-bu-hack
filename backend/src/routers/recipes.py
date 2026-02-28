from fastapi import APIRouter

from src.models.schemas import (
    RecommendRequest,
    RecommendResponse,
    RecipeDetailResponse,
    ShareCardRequest,
    ShareCardResponse,
)
from src.services.recipe_service import build_share_card, get_recipe_detail, recommend_recipes

router = APIRouter(prefix='/api/v1', tags=['recipes'])


@router.post('/recommendations', response_model=RecommendResponse)
def recommendations_api(payload: RecommendRequest) -> RecommendResponse:
    return recommend_recipes(payload.ingredients, payload.cuisine, payload.max_minutes)


@router.get('/recipes/{recipe_id}', response_model=RecipeDetailResponse)
def recipe_detail_api(recipe_id: str) -> RecipeDetailResponse:
    return get_recipe_detail(recipe_id)


@router.post('/share-card', response_model=ShareCardResponse)
def share_card_api(payload: ShareCardRequest) -> ShareCardResponse:
    return build_share_card(payload.recipe_title, payload.used_ingredients)
