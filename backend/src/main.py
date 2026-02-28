from fastapi import FastAPI

from src.config import get_settings
from src.routers import health_router, ingredients_router, recipes_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)

app.include_router(health_router)
app.include_router(recipes_router)
app.include_router(ingredients_router)
