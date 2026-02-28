from fastapi import APIRouter, File, HTTPException, UploadFile

from src.services.ingredient_service import (
    ImageInput,
    extract_ingredients_from_images,
    extract_ingredients_from_text,
    merge_ingredient_lists,
)
from src.models.ingredient_schemas import (
    IngredientsFromTextRequest,
    IngredientsResponse,
    MergeIngredientsRequest,
)

router = APIRouter(tags=["ingredients"])


@router.post("/ingredients/from-text", response_model=IngredientsResponse)
def ingredients_from_text_api(payload: IngredientsFromTextRequest) -> IngredientsResponse:
    ingredients = extract_ingredients_from_text(payload.text)
    return IngredientsResponse(ingredients=ingredients, count=len(ingredients))


@router.post("/ingredients/from-images", response_model=IngredientsResponse)
async def ingredients_from_images_api(images: list[UploadFile] = File(...)) -> IngredientsResponse:
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
    return IngredientsResponse(ingredients=ingredients, count=len(ingredients))


@router.post("/ingredients/merge", response_model=IngredientsResponse)
def merge_ingredients_api(payload: MergeIngredientsRequest) -> IngredientsResponse:
    ingredients = merge_ingredient_lists(payload.current_ingredients, payload.ingredient_lists)
    return IngredientsResponse(ingredients=ingredients, count=len(ingredients))
