from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    ENVIRONMENT: str = "development"
    APP_NAME: str = "Spectrum Insights API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 3600  # 1 hour in seconds

    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost",
        "http://localhost:80",
        "https://d28dsxgipx8gna.cloudfront.net",
        "https://djso3858997b1.cloudfront.net", 
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Single instance used across the entire app
settings = Settings()