const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// GET /health
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return await response.json();
};

// GET /api/topics
export const getTopics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/topics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status}`);
  }
  return await response.json();
};

// POST /api/trends
export const getTrendsData = async (keyword, timeframe = 'today 12-m', geo = 'US') => {
  const response = await fetch(`${API_BASE_URL}/api/trends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyword, timeframe, geo })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch trends: ${response.status}`);
  }
  return await response.json();
};

// GET /api/trends/compare
export const compareTrends = async (keywords, timeframe = 'today 12-m', geo = 'US') => {
  const keywordString = Array.isArray(keywords) ? keywords.join(',') : keywords;
  const url = `${API_BASE_URL}/api/trends/compare?keywords=${encodeURIComponent(keywordString)}&timeframe=${timeframe}&geo=${geo}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to compare trends: ${response.status}`);
  }
  return await response.json();
};