from pydantic import BaseModel, Field


class IngredientCandidate(BaseModel):
    name: str
    normalized: str
    confidence: float


class IngredientCandidatesResponse(BaseModel):
    candidates: list[IngredientCandidate]


class NormalizeIngredientsRequest(BaseModel):
    manual: list[str] = Field(default_factory=list)
    confirmed_from_image: list[str] = Field(default_factory=list)
    rejected_from_image: list[str] = Field(default_factory=list)


class NormalizeIngredientsResponse(BaseModel):
    ingredients: list[str]
    display_names: list[str]
    count: int
