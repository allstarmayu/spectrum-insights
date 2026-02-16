import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.cache import cache_service
from app.services.trends_service import trends_service


@pytest.fixture
def client():
    """Test client for API route testing."""
    return TestClient(app)


@pytest.fixture
def mock_cache_service(monkeypatch):
    """Mock cache service to avoid Redis dependency in tests."""
    async def mock_get(*args, **kwargs):
        return None
    
    async def mock_set(*args, **kwargs):
        return True
    
    monkeypatch.setattr(cache_service, "get", mock_get)
    monkeypatch.setattr(cache_service, "set", mock_set)


@pytest.fixture
def mock_trends_data():
    """Sample Google Trends data for testing."""
    return {
        "interest_over_time": [
            {"keyword": "Spectrum Internet", "date": "2024-02-01", "value": 75},
            {"keyword": "Spectrum Internet", "date": "2024-02-08", "value": 80},
            {"keyword": "Spectrum Internet", "date": "2024-02-15", "value": 85}
        ],
        "interest_by_region": [
            {"region": "California", "value": 100},
            {"region": "Texas", "value": 95},
            {"region": "New York", "value": 90}
        ],
        "related_queries": [
            {"text": "spectrum internet", "value": 100},
            {"text": "spectrum outage", "value": 90},
            {"text": "spectrum bill", "value": 80}
        ],
        "rising_queries": [
            {"text": "spectrum mobile", "value": 1250},
            {"text": "spectrum down", "value": 500}
        ]
    }