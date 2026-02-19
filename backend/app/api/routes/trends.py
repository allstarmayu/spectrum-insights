from fastapi import APIRouter, Depends, HTTPException
from app.models.trends import TrendRequest, TrendResponse
from app.api.dependencies import get_trends_service
from app.services.trends_service import TrendsService

router = APIRouter()


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

@router.post("/trends/region")
async def get_region(
    request: TrendRequest,
    service: TrendsService = Depends(get_trends_service)
):
    """
    Fetches only interest by region for a given keyword.
    """
    try:
        result = await service.get_region(
            keyword=request.keyword,
            timeframe=request.timeframe,
            geo=request.geo
        )
        return {"interest_by_region": result}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch region data: {str(e)}"
        )
    
@router.post("/trends/overtime")
async def get_overtime(
    request: TrendRequest,
    service: TrendsService = Depends(get_trends_service)
):
    try:
        result = await service.get_interest_over_time(
            keyword=request.keyword,
            timeframe=request.timeframe,
            geo=request.geo
        )
        return {"interest_over_time": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch overtime data: {str(e)}")

@router.get("/trends/compare")
async def compare_trends(
    keywords: str,
    timeframe: str = "today 12-m",
    geo: str = "US",
    service: TrendsService = Depends(get_trends_service)
):
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