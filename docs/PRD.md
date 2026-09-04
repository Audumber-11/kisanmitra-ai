# KisanMitra AI — Product Requirements Document

## 1. Vision

Empower every Indian farmer with instant, language-native, AI-powered agricultural guidance — accessible via voice call, WhatsApp, or SMS, even without internet or literacy.

## 2. Target Users

### Primary: Small/Marginal Indian Farmers
- **Demographics:** 70% of India's farming population, < 2 hectares
- **Languages:** Hindi, Marathi, Telugu (initial), with English fallback
- **Tech comfort:** Low to medium; prefers voice/SMS over apps
- **Devices:** Basic smartphones, feature phones
- **Connectivity:** 2G/3G, intermittent internet

### Secondary: District Agriculture Officers
- Need aggregated data: queries, disease outbreaks, weather
- Track program impact
- Identify hotspots for intervention

## 3. Core Features (MVP)

### F1. Voice Advisory (Priority: Critical)
- **Description:** Farmer calls toll-free number, asks in native language → AI responds in same language
- **Flow:** Twilio → STT → Gemini → TTS → response
- **Languages:** Hindi, Marathi, Telugu, English
- **Use cases:** Pest/disease queries, weather, sowing advice, market prices

### F2. Crop Disease Detection (Priority: Critical)
- **Description:** Farmer sends crop photo via WhatsApp → AI identifies disease + treatment
- **Flow:** WhatsApp webhook → image fetch → Gemini Vision → response
- **Output:** Disease name, treatment, prevention, resistant varieties

### F3. Weather + Mandi Alerts (Priority: High)
- **Description:** Daily SMS with weather + local mandi prices
- **Schedule:** 6 AM daily
- **Trigger:** Disease-prone weather, >10% price fluctuations

### F4. Regenerative Coach (Priority: High)
- **Description:** Personalized recommendations for crop rotation, cover crops, bio-fertilizers
- **Input:** Soil type, region, current crop
- **Output:** Region-specific advice, seasonal calendar

### F5. District Dashboard (Priority: Medium)
- **Users:** District/block agriculture officers
- **Features:** Query heatmap, disease outbreak map, weather trends, mandi prices

### F6. Carbon Credit Tracker (Priority: Low — Bonus)
- **Description:** Log regenerative practices → estimate CO₂ sequestration
- **Calculation:** Based on practice type, area, duration
- **Output:** Summary report, exportable for verification

## 4. Success Metrics

- **Reach:** 10,000+ farmers per district
- **Engagement:** 3+ queries per farmer per month
- **Impact:** 30% reduction in crop loss
- **Languages:** Support 4 (Hindi, Marathi, Telugu, English)
- **Response time:** < 10 seconds voice, < 15 seconds image

## 5. Technical Architecture

### Frontend (Next.js 14)
- App Router, TypeScript, Tailwind CSS
- PWA with offline support
- React Query for data fetching
- Chart.js / Recharts for dashboard

### Backend (FastAPI)
- Python 3.11, async/await
- Pydantic for validation
- Celery for background tasks
- OpenAPI auto-docs

### AI Layer
- **Gemini 1.5 Pro** for chat
- **Gemini Vision** for image analysis
- **Google STT/TTS** for voice pipeline

### Database (Supabase)
- PostgreSQL with Row-Level Security
- File storage for images
- Real-time subscriptions for dashboard

### External APIs
- OpenWeatherMap: weather data
- data.gov.in: mandi prices
- MapMyIndia: geo-tagging
- Twilio: voice, SMS, WhatsApp

## 6. Non-Functional Requirements

- **Availability:** 99.5% uptime
- **Scalability:** 10K concurrent calls
- **Security:** End-to-end encryption, data minimization
- **Compliance:** India's data protection laws
- **Performance:** < 10s voice response, < 15s image response

## 7. Out of Scope (v1)

- E-commerce/marketplace
- Loan/insurance integration
- Soil testing hardware integration
- Drone/satellite imagery analysis
- Native iOS/Android apps (PWA only)
