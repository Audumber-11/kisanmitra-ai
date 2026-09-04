# KisanMitra AI - Project Guidelines

## Project Overview

KisanMitra AI is a voice-first multilingual agricultural advisory platform for Indian farmers. Built for the "Build with AI: Code for Communities" hackathon (Track 4 — AgriN).

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, PWA
- **Backend**: FastAPI (Python 3.11), Poetry
- **AI**: Google Gemini 1.5 Pro, Gemini Vision
- **Database**: Supabase (PostgreSQL)
- **Voice**: Google Cloud STT/TTS, Twilio
- **Deploy**: Vercel (frontend), Google Cloud Run (backend)

## Project Structure

```
kisanmitra-ai/
├── frontend/                    # Next.js 14 frontend
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── voice/page.tsx      # Voice advisory
│   │   ├── disease/page.tsx   # Crop disease detection
│   │   └── dashboard/page.tsx # Officer dashboard
│   ├── components/            # React components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # API client
│   │   └── utils.ts          # Helper functions
│   └── public/               # Static assets
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── ai/              # Gemini integration
│   │   ├── db/              # Database client
│   │   └── main.py          # FastAPI app
│   ├── tests/               # Test suite
│   └── pyproject.toml       # Poetry config
├── docs/                     # Documentation
│   ├── PRD.md               # Product requirements
│   ├── ARCHITECTURE.md      # Technical architecture
│   └── DATABASE.md          # Database schema
├── package.json             # Workspace config
└── README.md                # Project README
```

## Development Commands

### Frontend
```bash
cd frontend
npm install
npm run dev      # Development server
npm run build    # Production build
```

### Backend
```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload  # Development
poetry run pytest                          # Tests
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```

### Backend (.env)
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
GEMINI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
OPENWEATHERMAP_API_KEY=
```

## Key Features

1. **Voice Advisory**: Twilio → STT → Gemini → TTS pipeline
2. **Disease Detection**: WhatsApp image → Gemini Vision → Diagnosis
3. **Weather Alerts**: OpenWeatherMap + data.gov.in integration
4. **Dashboard**: Real-time stats, disease outbreaks, mandi prices
5. **Carbon Credits**: Regenerative practice tracking

## Testing

```bash
# Backend tests with coverage
cd backend
poetry run pytest --cov=app --cov-report=html
```

Target: **80%+ test coverage**

## Deployment

```bash
# Frontend → Vercel
cd frontend && vercel --prod

# Backend → Google Cloud Run
gcloud builds submit --tag gcr.io/PROJECT-ID/kisanmitra-backend
gcloud run deploy kisanmitra-backend --image gcr.io/PROJECT-ID/kisanmitra-backend
```

## Rules to Follow

- Use **immutable patterns** — never mutate existing objects
- Write **tests first** (TDD approach)
- **80%+ test coverage** required
- No hardcoded secrets — use environment variables
- Use **Pydantic** for all API request/response models
- Use **async/await** for all database operations

## Common Issues

- **FastAPI reload issues**: Use `poetry run uvicorn app.main:app --reload`
- **CORS errors**: Add frontend URL to `ALLOWED_ORIGINS` in backend config
- **Database connection**: Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set
