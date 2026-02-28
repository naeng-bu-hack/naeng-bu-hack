import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


def _to_int(value: str, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_description: str
    app_version: str
    app_env: str
    app_host: str
    app_port: int
    cors_origins: tuple[str, ...]
    gemini_api_key: str
    gemini_model: str


@lru_cache
def get_settings() -> Settings:
    cors_origins = tuple(
        value.strip()
        for value in os.getenv("APP_CORS_ORIGINS", "http://localhost:19006,http://127.0.0.1:19006").split(",")
        if value.strip()
    )
    return Settings(
        app_name=os.getenv("APP_NAME", "naeng-bu-hack API"),
        app_description=os.getenv("APP_DESCRIPTION", "Backend API for naeng-bu-hack"),
        app_version=os.getenv("APP_VERSION", "0.1.0"),
        app_env=os.getenv("APP_ENV", "local"),
        app_host=os.getenv("APP_HOST", "0.0.0.0"),
        app_port=_to_int(os.getenv("APP_PORT", "8000"), 8000),
        cors_origins=cors_origins,
        gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
    )
