# Spectrum Insights — Backend

FastAPI backend service that fetches and caches Google Trends data
for the Spectrum Insights competitive intelligence dashboard.

---

## Tech Stack

- **Python 3.11** — Runtime
- **FastAPI** — REST API framework
- **pytrends** — Google Trends data fetcher
- **Redis** — Response caching (prevents rate limiting)
- **Pydantic** — Data validation and settings management
- **Uvicorn** — ASGI server
- **Pytest** — Testing framework

---

## Project Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── dependencies.py  # Dependency injection
│   │   └── routes/
│   │       ├── health.py    # Health check endpoint
│   │       └── trends.py    # Trends data endpoints
│   ├── core/
│   │   ├── config.py        # Settings from environment variables
│   │   └── cache.py         # Redis cache service
│   ├── models/
│   │   └── trends.py        # Pydantic data models
│   └── services/
│       └── trends_service.py # Google Trends business logic
└── tests/
    ├── unit/                # Unit tests
    └── integration/         # Integration tests
```

---

## Local Setup

### Step 1 — Create Virtual Environment
```bash
cd backend
python -m venv venv
```

### Step 2 — Activate Virtual Environment
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Step 3 — Install Dependencies
```bash
# Production dependencies
pip install -r requirements.txt

# Development + testing dependencies
pip install -r requirements-dev.txt
```

### Step 4 — Create Environment File
```bash
cp ../.env.example .env
```

### Step 5 — Run the Server
```bash
uvicorn app.main:app --reload
```

Server runs at: http://localhost:8000
API Docs at: http://localhost:8000/docs

---

## API Endpoints

### Health Check
```
GET /health
```
Returns server status, version, environment and Redis cache status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "cache_status": "connected"
}
```

---

### Get Topics
```
GET /api/topics
```
Returns pre-defined telecom topics and their keywords.
Used by the frontend sidebar navigation.

**Response:**
```json
{
  "topics": [
    {
      "id": "broadband",
      "label": "🌐 Broadband Competition",
      "keywords": ["Spectrum Internet", "T-Mobile Home Internet", "AT&T Fiber"]
    },
    {
      "id": "cord_cutting",
      "label": "📺 Cord Cutting",
      "keywords": ["cancel cable", "YouTube TV", "Sling TV"]
    },
    {
      "id": "mobile",
      "label": "📱 Mobile & Bundling",
      "keywords": ["Spectrum Mobile", "T-Mobile", "Verizon"]
    }
  ]
}
```

---

### Get Trends
```
POST /api/trends
```
Fetches Google Trends data for a single keyword.
Returns interest over time, interest by region, related and rising queries.
Results are cached in Redis for 1 hour.

**Request Body:**
```json
{
  "keyword": "Spectrum Internet",
  "timeframe": "today 12-m",
  "geo": "US"
}
```

**Response:**
```json
{
  "keyword": "Spectrum Internet",
  "interest_over_time": [
    { "date": "2025-02-16", "value": 75, "keyword": "Spectrum Internet" }
  ],
  "interest_by_region": [
    { "region": "North Carolina", "value": 100 }
  ],
  "related_queries": [
    { "text": "spectrum internet outage", "value": 100 }
  ],
  "rising_queries": [
    { "text": "spectrum fiber internet", "value": 450 }
  ]
}
```

**Timeframe options:**
| Value | Description |
|---|---|
| `today 12-m` | Last 12 months (default) |
| `today 3-m` | Last 3 months |
| `today 1-m` | Last 30 days |
| `today 5-y` | Last 5 years |

---

### Compare Trends
```
GET /api/trends/compare?keywords=Spectrum Internet,T-Mobile Home Internet
```
Compares multiple keywords side by side. Maximum 5 keywords.

**Query Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `keywords` | string | Comma-separated list of keywords |
| `timeframe` | string | Time range (default: today 12-m) |
| `geo` | string | Country code (default: US) |

**Response:**
```json
{
  "comparisons": [
    {
      "keyword": "Spectrum Internet",
      "interest_over_time": [...]
    },
    {
      "keyword": "T-Mobile Home Internet",
      "interest_over_time": [...]
    }
  ]
}
```

---

## Caching

Redis caches all Google Trends responses for **1 hour** to prevent rate limiting.

Cache key format:
```
trends:{keyword}:{timeframe}:{geo}
```

Example:
```
trends:spectrum_internet:today 12-m:US
```

If Redis is unavailable the service falls back gracefully — requests go directly to Google Trends with no caching.

---

## Testing
```bash
# Run all tests
pytest

# Verbose output
pytest -v

# With coverage report
pytest --cov=app

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `ENVIRONMENT` | development or production | development |
| `APP_NAME` | Application name | Spectrum Insights API |
| `APP_VERSION` | Application version | 1.0.0 |
| `DEBUG` | Enable debug mode | True |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `CACHE_TTL` | Cache time to live in seconds | 3600 |
| `FRONTEND_URL` | Allowed CORS origin | http://localhost:5173 |

---

## Docker

### Build Image
```bash
docker build -t spectrum-insights-backend .
```

### Run Container
```bash
docker run -p 8000:8000 spectrum-insights-backend
```

### Run with Docker Compose (Recommended)
```bash
# From project root
docker compose up
```

---

## Error Handling

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request (e.g. too many keywords) |
| 422 | Validation error (wrong data types) |
| 500 | Server error (Google Trends fetch failed) |