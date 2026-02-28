from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str = 'ok'
    app: str
    env: str
    port: int


class RecommendRequest(BaseModel):
    ingredients: list[str]
    cuisine: str = 'any'
    max_minutes: int = 30


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
