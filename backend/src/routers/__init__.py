from src.routers.health import router as health_router
from src.routers.ingredients import router as ingredients_router
from src.routers.recipes import router as recipes_router

__all__ = ["health_router", "recipes_router", "ingredients_router"]
