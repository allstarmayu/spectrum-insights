from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Handle OPTIONS preflight requests
from fastapi import Request
from fastapi.responses import JSONResponse

from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.cache import cache_service
from app.api.routes import health, trends



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs on startup and shutdown.
    Startup: connect to Redis
    Shutdown: disconnect from Redis
    """
    # Startup
    logger.info("Starting Spectrum Insights API...")
    await cache_service.connect()
    logger.info("Startup complete")

    yield  # app runs here

    # Shutdown
    logger.info("Shutting down Spectrum Insights API...")
    await cache_service.disconnect()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Competitive Intelligence Dashboard API — Spectrum Insights",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(trends.router, prefix="/api", tags=["Trends"])


@app.get("/")
async def root():
    return {
        "message": "Spectrum Insights API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }