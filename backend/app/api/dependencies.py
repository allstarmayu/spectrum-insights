from app.core.cache import cache_service
from app.services.trends_service import trends_service

#dependency injection for services
def get_cache_service():
    return cache_service


def get_trends_service():
    return trends_service