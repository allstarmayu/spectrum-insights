from fastapi import APIRouter, Depends, HTTPException
from app.models.trends import TrendRequest, TrendResponse
from app.api.dependencies import get_trends_service
from app.services.trends_service import TrendsService

router = APIRouter()

# Pre-defined telecom topics for the dashboard
TOPICS = {
    "broadband": [
        "Spectrum Internet",
        "T-Mobile Home Internet",
        "AT&T Fiber",
        "Verizon 5G Home",
        "Xfinity Internet"
    ],
    "cord_cutting": [
        "cancel cable",
        "YouTube TV",
        "Sling TV",
        "Hulu Live TV",
        "cord cutting"
    ],
    "mobile": [
        "Spectrum Mobile",
        "T-Mobile",
        "Verizon",
        "AT&T",
        "5G coverage"
    ]
}


@router.get("/topics")
async def get_topics():
    """
    Returns the pre-defined telecom topics and their keywords.
    Used by the frontend to populate the sidebar navigation.
    """
    return {
        "topics": [
            {
                "id": "broadband",
                "label": "🌐 Broadband Competition",
                "keywords": TOPICS["broadband"]
            },
            {
                "id": "cord_cutting",
                "label": "📺 Cord Cutting",
                "keywords": TOPICS["cord_cutting"]
            },
            {
                "id": "mobile",
                "label": "📱 Mobile & Bundling",
                "keywords": TOPICS["mobile"]
            }
        ]
    }


@router.post("/trends", response_model=TrendResponse)
async def get_trends(
    request: TrendRequest,
    service: TrendsService = Depends(get_trends_service)
):
    """
    Fetches Google Trends data for a given keyword.
    Returns interest over time, interest by region,
    related queries and rising queries.
    """
    try:
        result = await service.get_trends(
            keyword=request.keyword,
            timeframe=request.timeframe,
            geo=request.geo
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch trends data: {str(e)}"
        )


@router.get("/trends/compare")
async def compare_trends(
    keywords: str,
    timeframe: str = "today 12-m",
    geo: str = "US",
    service: TrendsService = Depends(get_trends_service)
):
    """
    Compare multiple keywords at once.
    Keywords should be comma-separated.
    Example: /trends/compare?keywords=Spectrum Internet,T-Mobile Home Internet
    """
    keyword_list = [k.strip() for k in keywords.split(",")]

    if len(keyword_list) > 5:
        raise HTTPException(
            status_code=400,
            detail="Maximum 5 keywords allowed for comparison"
        )

    results = []
    for keyword in keyword_list:
        try:
            result = await service.get_trends(
                keyword=keyword,
                timeframe=timeframe,
                geo=geo
            )
            results.append(result)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch trends for {keyword}: {str(e)}"
            )

    return {"comparisons": results}