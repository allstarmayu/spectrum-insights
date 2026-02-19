import pytest
from unittest.mock import patch
from app.models.trends import TrendResponse, WordCloudItem


def test_health_endpoint_returns_200(client):
    """Test health check endpoint."""
    response = client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "cache_status" in data


# def test_topics_endpoint_returns_predefined_topics(client):
#     """Test topics endpoint returns all three categories."""
#     response = client.get("/api/topics")
    
#     assert response.status_code == 200
#     data = response.json()
#     assert "topics" in data
#     topics = data["topics"]
#     assert len(topics) == 3
#     assert any(t["id"] == "broadband" for t in topics)
#     assert any(t["id"] == "cord_cutting" for t in topics)
#     assert any(t["id"] == "mobile" for t in topics)


def test_trends_endpoint_with_valid_keyword(client, mock_cache_service, mock_trends_data):
    """Test POST /api/trends with valid keyword."""
    from app.api.dependencies import get_trends_service
    from unittest.mock import AsyncMock
    
    # Create mock service
    mock_service = AsyncMock()
    mock_service.get_trends.return_value = TrendResponse(
        keyword="Spectrum Internet",
        interest_over_time=mock_trends_data["interest_over_time"],
        interest_by_region=mock_trends_data["interest_by_region"],
        related_queries=mock_trends_data["related_queries"],
        rising_queries=mock_trends_data["rising_queries"]
    )
    
    # Override the dependency
    from app.main import app
    app.dependency_overrides[get_trends_service] = lambda: mock_service
    
    try:
        response = client.post(
            "/api/trends",
            json={"keyword": "Spectrum Internet", "timeframe": "today 12-m", "geo": "US"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["keyword"] == "Spectrum Internet"
        assert len(data["interest_over_time"]) == 3
        assert len(data["interest_by_region"]) == 3
    finally:
        # Clean up override
        app.dependency_overrides.clear()


def test_trends_endpoint_validates_request_body(client):
    """Test POST /api/trends validates request body."""
    response = client.post("/api/trends", json={})
    
    assert response.status_code == 422  # Validation error