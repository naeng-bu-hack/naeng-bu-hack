from fastapi import APIRouter, File, HTTPException, UploadFile

from src.models.ingredient_schemas import (
    IngredientCandidate,
    IngredientCandidatesResponse,
    NormalizeIngredientsRequest,
    NormalizeIngredientsResponse,
)
from src.services.ingredient_service import (
    ImageInput,
    extract_ingredients_from_images,
    localize_ingredients,
    normalize_ingredients,
)

router = APIRouter(prefix="/api/v1", tags=["ingredients"])


@router.post("/ingredients/detect-from-images", response_model=IngredientCandidatesResponse)
async def detect_ingredients_from_images_api(image: UploadFile = File(...)) -> IngredientCandidatesResponse:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Invalid image type: {image.filename}")

    payload = await image.read()
    if not payload:
        raise HTTPException(status_code=400, detail=f"Empty file: {image.filename}")

    prepared = ImageInput(content_type=image.content_type, data=payload)
    ingredients = extract_ingredients_from_images([prepared])
    display_names = localize_ingredients(ingredients, use_llm_fallback=True)
    candidates = [
        IngredientCandidate(name=display_name, normalized=item, confidence=0.75)
        for item, display_name in zip(ingredients, display_names)
    ]
    return IngredientCandidatesResponse(candidates=candidates)


@router.post("/ingredients/normalize", response_model=NormalizeIngredientsResponse)
def normalize_ingredients_api(payload: NormalizeIngredientsRequest) -> NormalizeIngredientsResponse:
    merged = payload.manual + payload.confirmed_from_image
    normalized = normalize_ingredients(merged, use_llm_fallback=True)
    display_names = localize_ingredients(normalized, use_llm_fallback=True)
    return NormalizeIngredientsResponse(
        ingredients=normalized,
        display_names=display_names,
        count=len(normalized),
    )
