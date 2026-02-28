from fastapi import APIRouter, File, HTTPException, UploadFile

from src.models.ingredient_schemas import (
    IngredientCandidate,
    IngredientCandidatesResponse,
    NormalizeIngredientsRequest,
    NormalizeIngredientsResponse,
)
from src.services.ingredient_service import ImageInput, extract_ingredients_from_images, normalize_ingredients

router = APIRouter(prefix="/api/v1", tags=["ingredients"])


@router.post("/ingredients/detect-from-images", response_model=IngredientCandidatesResponse)
async def detect_ingredients_from_images_api(images: list[UploadFile] = File(...)) -> IngredientCandidatesResponse:
    if not images:
        raise HTTPException(status_code=400, detail="At least one image is required.")

    prepared_images: list[ImageInput] = []
    for image in images:
        if not image.content_type or not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"Invalid image type: {image.filename}")

        payload = await image.read()
        if not payload:
            raise HTTPException(status_code=400, detail=f"Empty file: {image.filename}")

        prepared_images.append(ImageInput(content_type=image.content_type, data=payload))

    ingredients = extract_ingredients_from_images(prepared_images)
    candidates = [IngredientCandidate(name=item, normalized=item, confidence=0.75) for item in ingredients]
    return IngredientCandidatesResponse(candidates=candidates)


@router.post("/ingredients/normalize", response_model=NormalizeIngredientsResponse)
def normalize_ingredients_api(payload: NormalizeIngredientsRequest) -> NormalizeIngredientsResponse:
    merged = payload.manual + payload.confirmed_from_image
    normalized = normalize_ingredients(merged)
    return NormalizeIngredientsResponse(
        ingredients=normalized,
        display_names=normalized,
        count=len(normalized),
    )
