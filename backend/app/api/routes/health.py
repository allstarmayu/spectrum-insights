from fastapi import APIRouter
from app.models.trends import HealthResponse
from app.core.config import settings
from app.core.cache import cache_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    Returns server status, version, environment and cache status.
    """
    # Check if Redis is connected
    cache_status = "connected" if cache_service.redis else "disconnected"

    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        cache_status=cache_status
    )