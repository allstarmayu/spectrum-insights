import redis.asyncio as aioredis
import json
import logging
from app.core.config import settings
from typing import Optional

logger = logging.getLogger(__name__)


class CacheService:
    def __init__(self):
        self.redis = None

    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            logger.info("Redis connection established")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Caching disabled.")
            self.redis = None

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis connection closed")

    async def get(self, key: str):
        """Get value from cache"""
        if not self.redis:
            return None
        try:
            value = await self.redis.get(key)
            if value:
                logger.info(f"Cache HIT: {key}")
                return json.loads(value)
            logger.info(f"Cache MISS: {key}")
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None

    async def set(self, key: str, value: dict | list, ttl: Optional[int] = None):
        """Set value in cache with TTL"""
        if not self.redis:
            return
        try:
            ttl = ttl or settings.CACHE_TTL
            await self.redis.setex(
                key,
                ttl,
                json.dumps(value)
            )
            logger.info(f"Cache SET: {key} (TTL: {ttl}s)")
        except Exception as e:
            logger.error(f"Cache set error: {e}")

    async def delete(self, key: str):
        """Delete value from cache"""
        if not self.redis:
            return
        try:
            await self.redis.delete(key)
            logger.info(f"Cache DELETE: {key}")
        except Exception as e:
            logger.error(f"Cache delete error: {e}")


# Single instance used across the entire app
cache_service = CacheService()
