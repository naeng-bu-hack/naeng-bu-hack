from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = 'ok'
    app: str
    env: str
    port: int


class RecommendRequest(BaseModel):
    ingredients_ko: list[str] = Field(default_factory=list)


class RecipeSummaryItem(BaseModel):
    id: str
    kind: str
    title: str
    description: str
    difficulty: str
    time: str
    badge: str


class RecommendResponse(BaseModel):
    recipes: list[RecipeSummaryItem]


class RecipeIngredient(BaseModel):
    item: str
    amount: str


class RecipeStep(BaseModel):
    step: int
    description: str
    tip: str | None = None


class RecipeDetailResponse(BaseModel):
    id: str
    title: str
    servings: int
    time: str
    ingredients: list[RecipeIngredient]
    steps: list[RecipeStep]


class ShareCardRequest(BaseModel):
    recipe_title: str
    used_ingredients: list[str]


class ShareCardResponse(BaseModel):
    caption: str
