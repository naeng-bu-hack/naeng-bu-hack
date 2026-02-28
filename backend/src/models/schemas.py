from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = 'ok'
    app: str
    env: str
    port: int


class IngredientParseRequest(BaseModel):
    utterance: str = Field(..., min_length=1)


class IngredientItem(BaseModel):
    name_raw: str
    normalized_id: str
    quantity: str
    confidence: float


class IngredientParseResponse(BaseModel):
    utterance: str
    ingredients: list[IngredientItem]
    unknown_chunks: list[str] = []


class RecommendRequest(BaseModel):
    ingredients: list[str]
    cuisine: str = 'any'
    max_minutes: int = 30


class RecipeCandidate(BaseModel):
    recipe_id: str
    title: str
    reason: str


class RecommendResponse(BaseModel):
    candidates: list[RecipeCandidate]


class ScriptRequest(BaseModel):
    recipe_title: str


class ScriptResponse(BaseModel):
    script: str


class ShareCardRequest(BaseModel):
    recipe_title: str
    used_ingredients: list[str]


class ShareCardResponse(BaseModel):
    caption: str
