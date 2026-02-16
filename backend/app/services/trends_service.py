import logging
from pytrends.request import TrendReq
from app.models.trends import (
    InterestOverTimeData,
    RegionData,
    WordCloudItem,
    TrendResponse
)
from app.core.cache import cache_service

logger = logging.getLogger(__name__)


class TrendsService:
    def __init__(self):
        self.pytrends = TrendReq(
            hl='en-US',
            tz=360,
            timeout=(10, 25),
            requests_args={
                'headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                }
            }
        )

    def _build_cache_key(self, keyword: str, timeframe: str, geo: str) -> str:
        """Build a unique cache key for this request"""
        clean = keyword.lower().replace(' ', '_')
        return f"trends:{clean}:{timeframe}:{geo}"

    def _get_interest_over_time(self, keyword: str, timeframe: str, geo: str) -> list[InterestOverTimeData]:
        """Fetch interest over time data from Google Trends"""
        try:
            self.pytrends.build_payload(
                [keyword],
                timeframe=timeframe,
                geo=geo
            )
            df = self.pytrends.interest_over_time()
            if df.empty:
                return []
            result = []
            for date, row in df.iterrows():
                if keyword in row:
                    date_str = str(date)[:10]  # gets YYYY-MM-DD from timestamp
                    result.append(InterestOverTimeData(
                        date=date_str,
                        value=int(row[keyword]),
                        keyword=keyword
                    ))
            return result
        except Exception as e:
            logger.error(f"Error fetching interest over time: {e}")
            return []

    def _get_interest_by_region(self, keyword: str, timeframe: str, geo: str) -> list[RegionData]:
        """Fetch interest by region data from Google Trends"""
        try:
            self.pytrends.build_payload(
                [keyword],
                timeframe=timeframe,
                geo=geo
            )
            df = self.pytrends.interest_by_region(resolution='REGION')
            if df.empty:
                return []
            result = []
            for region, row in df.iterrows():
                if keyword in row and int(row[keyword]) > 0:
                    result.append(RegionData(
                        region=str(region),
                        value=int(row[keyword])
                    ))
            result.sort(key=lambda x: x.value, reverse=True)
            return result[:20]
        except Exception as e:
            logger.error(f"Error fetching interest by region: {e}")
            return []

    def _get_related_queries(self, keyword: str, timeframe: str, geo: str) -> tuple[list[WordCloudItem], list[WordCloudItem]]:
        """Fetch related and rising queries from Google Trends"""
        try:
            self.pytrends.build_payload(
                [keyword],
                timeframe=timeframe,
                geo=geo
            )
            related = self.pytrends.related_queries()
            top_queries = []
            rising_queries = []
            if keyword in related:
                # Top queries
                top_df = related[keyword].get('top')
                if top_df is not None and not top_df.empty:
                    for _, row in top_df.head(20).iterrows():
                        top_queries.append(WordCloudItem(
                            text=str(row['query']),
                            value=int(row['value'])
                        ))
                # Rising queries
                rising_df = related[keyword].get('rising')
                if rising_df is not None and not rising_df.empty:
                    for _, row in rising_df.head(20).iterrows():
                        val = row['value']
                        if isinstance(val, str) and val == 'Breakout':
                            val = 100
                        rising_queries.append(WordCloudItem(
                            text=str(row['query']),
                            value=int(val)
                        ))
            return top_queries, rising_queries
        except Exception as e:
            logger.error(f"Error fetching related queries: {e}")
            return [], []

    async def get_trends(self, keyword: str, timeframe: str = "today 12-m", geo: str = "US") -> TrendResponse:
        """Main method — fetches all trend data with caching"""
        cache_key = self._build_cache_key(keyword, timeframe, geo)

        # Check cache first
        cached = await cache_service.get(cache_key)
        if cached:
            logger.info(f"Returning cached data for: {keyword}")
            return TrendResponse(**cached)

        logger.info(f"Fetching fresh data for: {keyword}")

        # Fetch all data
        interest_over_time = self._get_interest_over_time(keyword, timeframe, geo)
        interest_by_region = self._get_interest_by_region(keyword, timeframe, geo)
        related_queries, rising_queries = self._get_related_queries(keyword, timeframe, geo)

        response = TrendResponse(
            keyword=keyword,
            interest_over_time=interest_over_time,
            interest_by_region=interest_by_region,
            related_queries=related_queries,
            rising_queries=rising_queries
        )

        # Store in cache
        await cache_service.set(cache_key, response.model_dump(), ttl=3600)

        return response


# Single instance
trends_service = TrendsService()