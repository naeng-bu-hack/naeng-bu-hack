from fastapi import APIRouter

from src.config import get_settings
from src.models.schemas import HealthResponse

router = APIRouter(tags=['system'])


@router.get('/health', response_model=HealthResponse)
def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        app=settings.app_name,
        env=settings.app_env,
        port=settings.app_port,
    )
