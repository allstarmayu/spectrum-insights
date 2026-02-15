# Spectrum Insights

A competitive intelligence dashboard visualizing Google Trends data
for Spectrum's key business areas — broadband competition,
cord cutting, and mobile bundling.

## Tech Stack

### Frontend
- **React 18.3.1** — UI framework
- **Vite 7.3.1** — Build tool and dev server
- **TailwindCSS 4.1.18** — Utility-first CSS framework
- **Recharts 3.7.0** — Chart components (line charts, bar charts)
- **D3 7.9.0** — US map visualization and word cloud layout
- **D3 Cloud 1.2.8** — Word cloud layout engine
- **Axios 1.13.5** — HTTP client for API calls
- **React Router DOM 7.13.0** — Client-side routing

### Testing (Frontend)
- **Jest 30.2.0** — Test runner
- **React Testing Library 16.3.2** — Component testing
- **@testing-library/user-event 14.6.1** — User interaction simulation
- **@testing-library/jest-dom 6.9.1** — Custom DOM assertions
- **Babel** — JSX and modern JS support for Jest

### Backend
- **Python 3.11** — Runtime
- **FastAPI** — REST API framework
- **pytrends** — Google Trends data fetcher
- **Redis** — Response caching (prevents rate limiting)
- **Pydantic** — Data validation
- **Pytest** — Testing framework
- **Pytest-asyncio** — Async test support for FastAPI

### Infrastructure (AWS)
- **S3** — Frontend static hosting
- **CloudFront** — CDN + HTTPS
- **EC2 t2.micro** — Backend container hosting (free tier)
- **ECR** — Docker image registry
- **Redis** — Runs as Docker container on EC2 (no ElastiCache needed)
- **ACM** — SSL/TLS certificate
- **CloudWatch** — Logging and monitoring

> **Cost Note:** EC2 t2.micro with Docker Compose is used instead of ECS Fargate + ElastiCache to stay within AWS free tier. In production this would be ECS Fargate with ElastiCache for managed scalability.

### DevOps
- **Docker + Docker Compose** — Local development and containerization
- **GitHub Actions** — CI/CD pipeline
- **Terraform** — Infrastructure as Code

---

## Project Setup (From Scratch)

### Prerequisites
- Node.js v18+
- Python 3.11+
- Docker + Docker Compose
- Git

### Step 1 — Clone and Create Folder Structure
```bash
git init
mkdir frontend backend infrastructure .github
mkdir .github/workflows
mkdir infrastructure/terraform
mkdir infrastructure/scripts
```

### Step 2 — Frontend Setup
```bash
cd frontend

# Scaffold React app with Vite
npm create vite@latest . -- --template react

# Downgrade to React 18 for ecosystem compatibility
npm install react@18 react-dom@18

# Install production dependencies
npm install recharts d3 d3-cloud axios react-router-dom

# Install dev dependencies
npm install -D tailwindcss @tailwindcss/vite eslint-plugin-react-hooks

# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom babel-jest @babel/core @babel/preset-env @babel/preset-react
```

### Step 3 — Run Locally (Frontend only)
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173

### Step 4 — Run Locally (Full Stack with Docker)
```bash
# From root of project
cp .env.example .env
docker compose up
```

Frontend: http://localhost:5173
Backend:  http://localhost:8000
API Docs: http://localhost:8000/docs

---

## Project Structure
```
spectrum-insights/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── api/          # Axios API calls
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # Global state
│   │   ├── constants/    # Topic configs
│   │   └── utils/        # Helper functions
│   └── tests/            # Frontend tests
├── backend/              # FastAPI + pytrends service
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Config and cache
│   │   ├── models/       # Pydantic models
│   │   └── services/     # pytrends business logic
│   └── tests/            # Backend tests
├── infrastructure/
│   ├── terraform/        # AWS infrastructure as code
│   └── scripts/          # Manual deployment helpers
├── docker-compose.yml    # Local dev environment
├── .env.example          # Environment variable template
└── README.md
```

---

## Testing

### Frontend
```bash
cd frontend
npm test                  # Run all tests
npm test -- --watch       # Watch mode during development
npm test -- --coverage    # With coverage report
```

### Backend
```bash
cd backend
pytest                    # Run all tests
pytest -v                 # Verbose output
pytest --cov=app          # With coverage report
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `ENVIRONMENT` | development or production | development |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `VITE_API_URL` | Backend API URL for frontend | http://localhost:8000 |
| `AWS_REGION` | AWS deployment region | us-east-1 |
| `AWS_ACCOUNT_ID` | Your AWS account ID | 555802223518 |
| `EC2_HOST` | EC2 public IP for backend | — |
| `EC2_USER` | EC2 SSH user | ec2-user |


---

## CI/CD Pipeline

Every push to `main` branch triggers GitHub Actions:

1. Run frontend tests (Jest)
2. Run backend tests (Pytest)
3. If tests pass → build React → deploy to S3 → invalidate CloudFront
4. If tests pass → build Docker image → push to ECR → deploy to ECS Fargate