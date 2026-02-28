from pydantic import BaseModel, Field


class IngredientsFromTextRequest(BaseModel):
    text: str = Field(..., min_length=1)


class MergeIngredientsRequest(BaseModel):
    current_ingredients: list[str] = Field(default_factory=list)
    ingredient_lists: list[list[str]] = Field(default_factory=list)


class IngredientsResponse(BaseModel):
    ingredients: list[str]
    count: int
