from pydantic import BaseModel
from typing import Optional


class TrendRequest(BaseModel):
    keyword: str
    timeframe: str = "today 12-m"  # last 12 months by default
    geo: str = "US"  # United States by default


class InterestOverTimeData(BaseModel):
    date: str
    value: int
    keyword: str


class RegionData(BaseModel):
    region: str
    value: int


class WordCloudItem(BaseModel):
    text: str
    value: int


class TrendResponse(BaseModel):
    keyword: str
    interest_over_time: list[InterestOverTimeData]
    interest_by_region: list[RegionData]
    related_queries: list[WordCloudItem]
    rising_queries: list[WordCloudItem]


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    cache_status: str