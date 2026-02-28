from fastapi import APIRouter

from src.models.schemas import (
    IngredientParseRequest,
    IngredientParseResponse,
    RecommendRequest,
    RecommendResponse,
    ScriptRequest,
    ScriptResponse,
    ShareCardRequest,
    ShareCardResponse,
)
from src.services.recipe_service import build_script, build_share_card, parse_ingredients, recommend_recipes

router = APIRouter(prefix='/api/v1', tags=['recipes'])


@router.post('/ingredients/parse', response_model=IngredientParseResponse)
def parse_ingredients_api(payload: IngredientParseRequest) -> IngredientParseResponse:
    return parse_ingredients(payload.utterance)


@router.post('/recommendations', response_model=RecommendResponse)
def recommendations_api(payload: RecommendRequest) -> RecommendResponse:
    return recommend_recipes(payload.ingredients, payload.cuisine, payload.max_minutes)


@router.post('/script', response_model=ScriptResponse)
def script_api(payload: ScriptRequest) -> ScriptResponse:
    return build_script(payload.recipe_title)


@router.post('/share-card', response_model=ShareCardResponse)
def share_card_api(payload: ShareCardRequest) -> ShareCardResponse:
    return build_share_card(payload.recipe_title, payload.used_ingredients)
