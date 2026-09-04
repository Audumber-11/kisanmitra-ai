# KisanMitra AI — Technical Architecture

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  📞 Twilio Voice  │  📱 WhatsApp  │  🖥️ Web PWA  │  📲 SMS          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Cloud Run)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐         ┌────▼─────┐         ┌────▼─────┐
   │  Voice   │         │  Vision  │         │  Alerts  │
   │  Service │         │  Service │         │  Service │
   └────┬─────┘         └────┬─────┘         └────┬─────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   AI Layer      │
                    │  ┌──────────┐   │
                    │  │ Gemini   │   │
                    │  │  Pro +   │   │
                    │  │  Vision  │   │
                    │  └──────────┘   │
                    │  ┌──────────┐   │
                    │  │ Google   │   │
                    │  │ STT/TTS  │   │
                    │  └──────────┘   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Data Layer    │
                    │  ┌──────────┐   │
                    │  │Supabase  │   │
                    │  │Postgres  │   │
                    │  └──────────┘   │
                    │  ┌──────────┐   │
                    │  │ Redis    │   │
                    │  │ Cache    │   │
                    │  └──────────┘   │
                    └─────────────────┘
```

## 2. Component Details

### 2.1 Frontend (Next.js 14)
- **Path:** `/frontend`
- **Framework:** Next.js 14 App Router, TypeScript, Tailwind
- **Features:**
  - PWA for offline support
  - Voice recording with WebRTC
  - Real-time chat interface
  - Officer dashboard with charts
  - Map visualization

### 2.2 Backend (FastAPI)
- **Path:** `/backend`
- **Framework:** FastAPI, Python 3.11, async/await
- **Structure:**
  ```
  /backend/app/
  ├── api/v1/         # API endpoints
  ├── services/       # Business logic
  ├── ai/             # Gemini integration
  ├── db/             # Database models
  ├── core/           # Config, security
  └── main.py
  ```

### 2.3 AI Services
- **Path:** `/ai-services`
- **Components:**
  - Gemini Pro for chat
  - Gemini Vision for images
  - Google STT for voice
  - Google TTS for response

### 2.4 Database (Supabase)
- **Schema:** See `/docs/DATABASE.md`
- **Auth:** Supabase Auth with phone OTP
- **Storage:** Images in Supabase Storage

## 3. Voice Pipeline Flow

```
Farmer Calls Twilio Number
        ↓
Twilio Receives Call → Webhook to /api/voice/incoming
        ↓
Backend: Play greeting, record farmer's question
        ↓
Google STT: Transcribe audio to text
        ↓
Gemini Pro: Generate response in same language
        ↓
Google TTS: Convert response to audio
        ↓
Twilio: Play audio response
        ↓
Farmer hears answer in their language
        ↓
Log: Save to advisory_logs
```

## 4. WhatsApp Image Pipeline

```
Farmer sends photo to WhatsApp
        ↓
Twilio WhatsApp webhook → /api/whatsapp/webhook
        ↓
Backend: Download image
        ↓
Upload to Supabase Storage
        ↓
Gemini Vision: Analyze image
        ↓
Parse JSON response
        ↓
Send back via WhatsApp:
  - Disease name
  - Treatment
  - Prevention tips
        ↓
Log: Save to advisory_logs
```

## 5. Data Flow

### Voice/WhatsApp Data
1. Incoming request (voice/image)
2. Process through AI
3. Generate response
4. Send back to user
5. Log in database

### Scheduled Alerts
1. Celery scheduler triggers
2. Fetch weather/mandi data
3. Identify farmers to alert (location-based)
4. Send SMS via Twilio
5. Log delivery status

## 6. API Endpoints

### Voice
- `POST /api/v1/voice/incoming` — Twilio webhook
- `POST /api/v1/voice/recording` — Post-call recording

### Disease
- `POST /api/v1/disease/analyze` — Image analysis
- `GET /api/v1/disease/history/{farmer_id}` — Past diagnoses

### Alerts
- `GET /api/v1/alerts/weather` — Current weather
- `GET /api/v1/alerts/mandi` — Current prices
- `POST /api/v1/alerts/send` — Trigger alert

### Dashboard
- `GET /api/v1/dashboard/stats` — Aggregated stats
- `GET /api/v1/dashboard/queries` — Query heatmap
- `GET /api/v1/dashboard/diseases` — Disease outbreaks

### Carbon
- `POST /api/v1/carbon/log` — Log practice
- `GET /api/v1/carbon/estimate` — Estimate credits
- `GET /api/v1/carbon/report/{farm_id}` — Generate report

## 7. Security

- **Authentication:** Twilio request validation, Supabase RLS
- **Encryption:** TLS 1.3, encrypted at rest
- **Data minimization:** No PII storage beyond phone
- **Rate limiting:** Per-phone-number throttling
- **Audit logging:** All AI interactions logged

## 8. Scalability

- **Horizontal scaling:** Cloud Run auto-scales
- **Caching:** Redis for common queries
- **CDN:** Vercel edge for frontend
- **Database:** Supabase connection pooling
- **Async processing:** Celery for background tasks

## 9. Monitoring

- **Logs:** Google Cloud Logging
- **Metrics:** Cloud Monitoring
- **Errors:** Sentry (optional)
- **Uptime:** Cloud Monitoring alerts
- **Usage:** Custom analytics dashboard

## 10. Deployment

```
Frontend → Vercel (PWA optimized)
Backend → Google Cloud Run
Database → Supabase (managed Postgres)
AI APIs → Google AI Platform
Voice/SMS → Twilio
```
