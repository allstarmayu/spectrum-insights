import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.services.trends_service import TrendsService
from app.models.trends import TrendResponse


@pytest.mark.asyncio
async def test_get_trends_returns_valid_response(mock_cache_service, mock_trends_data):
    """Test that get_trends returns properly formatted TrendResponse."""
    service = TrendsService()
    
    # Mock pytrends methods
    with patch.object(service, '_get_interest_over_time', return_value=mock_trends_data['interest_over_time']), \
         patch.object(service, '_get_interest_by_region', return_value=mock_trends_data['interest_by_region']), \
         patch.object(service, '_get_related_queries', return_value=(mock_trends_data['related_queries'], mock_trends_data['rising_queries'])):
        
        response = await service.get_trends("Spectrum Internet", "today 12-m", "US")
        
        # Verify response structure
        assert isinstance(response, TrendResponse)
        assert response.keyword == "Spectrum Internet"
        assert len(response.interest_over_time) == 3
        assert len(response.interest_by_region) == 3
        assert len(response.related_queries) == 3
        assert len(response.rising_queries) == 2


@pytest.mark.asyncio
async def test_get_trends_handles_empty_data(mock_cache_service):
    """Test that get_trends handles empty responses gracefully."""
    service = TrendsService()
    
    # Mock empty responses
    with patch.object(service, '_get_interest_over_time', return_value=[]), \
         patch.object(service, '_get_interest_by_region', return_value=[]), \
         patch.object(service, '_get_related_queries', return_value=([], [])):
        
        response = await service.get_trends("NonexistentKeyword", "today 12-m", "US")
        
        assert isinstance(response, TrendResponse)
        assert len(response.interest_over_time) == 0
        assert len(response.interest_by_region) == 0
        assert len(response.related_queries) == 0
        assert len(response.rising_queries) == 0