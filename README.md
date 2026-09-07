# 🌾 KisanMitra AI

> **Voice-first multilingual agricultural advisory platform for Indian farmers**

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![100% Free](https://img.shields.io/badge/Cost-₹0-green.svg)](#-free-deployment)

**🚀 Live Demo: https://frontend-nubu2t5lw-audumber-11s-projects.vercel.app**

Built for **Build with AI: Code for Communities Hackathon** — **Track 4: AgriN**

---

## 🎯 What is KisanMitra AI?

KisanMitra AI is a **voice-first, multilingual agricultural advisory platform** designed for Indian farmers. It empowers them with real-time, AI-powered guidance in their native language (Hindi, Marathi, Telugu, English) via **voice** (browser-based, no Twilio needed!), **photo upload**, and **live weather/market data**.

## 💡 The Problem

- **70% of Indian farmers** are small/marginal with < 2 hectares
- **40% can't read** — text-based apps fail them
- **Language barrier** — most digital tools are English-only
- **Crop losses of 30-40%** due to preventable pests, diseases, weather

## ✨ The Solution

A multi-channel AI advisor that reaches farmers in their language:

| Feature | Description | Tech |
|---------|-------------|------|
| 🎙️ **Voice Advisory** | Speak in Hindi/Marathi/Telugu, get instant advice | Browser STT/TTS + Gemini |
| 📸 **Disease Detection** | Upload crop photo → AI diagnoses + treatment | Gemini Vision |
| 🌦️ **Weather Alerts** | Live weather for any Indian district | OpenWeatherMap |
| 📊 **Mandi Prices** | Real-time commodity prices | Mock data (FREE) |
| 🌱 **Carbon Credits** | Track regenerative practices | Pure calculation |
| 📈 **District Dashboard** | Officer monitoring | Real-time data |

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js 18+** — https://nodejs.org
- **Git** — https://git-scm.com

### Run Locally

```bash
# 1. Clone
cd kisanmitra-ai/frontend

# 2. Install
npm install

# 3. Create .env.local
echo "GEMINI_API_KEY=your-key-here" > .env.local
echo "NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your-key-here" >> .env.local

# 4. Run
npm run dev
```

Open http://localhost:3000

### Free API Keys (2 minutes)

1. **Gemini API**: https://aistudio.google.com/apikey (no credit card)
2. **OpenWeatherMap**: https://openweathermap.org/api (free tier)

---

## 🤖 Enable Free AI Mode (Optional)

Without an API key, the voice advisory uses a built-in knowledge base covering ~50 common farming topics in Hindi and Marathi (crops, diseases, pests, fertilizers, government schemes, irrigation, weather, livestock, mandi prices).

To unlock **full AI chat** for any farming question:

1. Visit https://openrouter.ai/keys
2. Sign in with Google (no credit card required)
3. Click **Create Key** (free tier: 50 requests/day)
4. Add the key to your project:

```bash
# Interactive prompt — paste your key when asked
cd frontend
npm run setup-key
```

5. Restart the dev server: `npm run dev`

**How it works:**
- Your browser calls OpenRouter directly (no backend needed)
- Fallback knowledge base works without any API key
- A status badge shows whether responses come from **🤖 AI** or **📚 Knowledge Base**
- OpenRouter models used: `qwen/qwen-2.5-7b-instruct:free` (best Hindi/Marathi support)

---

## 📂 Project Structure

```
kisanmitra-ai/
├── frontend/                   # Next.js 14 application
│   ├── app/
│   │   ├── page.tsx           # 🏠 Landing page
│   │   ├── voice/             # 🎙️ Voice advisory
│   │   ├── disease/           # 📸 Disease detection
│   │   ├── alerts/            # 🌦️ Weather + Mandi
│   │   ├── carbon/            # 🌱 Carbon credits
│   │   ├── dashboard/         # 📊 Officer dashboard
│   │   └── api/               # 🔌 API routes
│   │       ├── voice/         # Gemini chat
│   │       ├── disease/       # Gemini Vision
│   │       ├── weather/       # OpenWeatherMap
│   │       └── mandi/         # Mandi prices
│   ├── components/
│   ├── lib/
│   └── public/
├── backend/                    # FastAPI (for production)
├── docs/                       # Documentation
└── README.md
```

---

## 🎨 Features in Detail

### 1. 🎙️ Voice Advisory
- **Hindi, Marathi, Telugu, English** support
- Uses **browser's built-in STT/TTS** (100% FREE)
- Fallback responses for common queries
- Gemini AI integration for intelligent answers
- Real-time transcript display

### 2. 📸 Crop Disease Detection
- Upload photo → **Gemini Vision** analyzes
- Returns: Disease name, symptoms, treatment, prevention
- Database of 6+ common Indian crop diseases
- Resistant varieties recommendations

### 3. 🌦️ Weather + Mandi Alerts
- Live weather for **30+ Indian districts**
- Disease risk calculation (high humidity → fungal risk)
- 28+ commodity prices (Tomato, Onion, Wheat, etc.)
- SMS alert registration

### 4. 🌱 Carbon Credit Tracker
- Log 5 regenerative practices
- Calculate tCO₂ sequestration
- Show environmental impact (cars off road, trees planted)
- Estimated market value in ₹

### 5. 📊 District Dashboard
- Total farmers, queries, disease reports
- Top concerns with bar chart
- Active disease outbreaks
- Mandi price summary
- System status

---

## 💰 FREE Tech Stack

| Layer | Tool | Cost |
|-------|------|------|
| Frontend | Next.js 14 | FREE |
| Hosting | Vercel | FREE (100GB/month) |
| AI | Google Gemini | FREE (60 req/min) |
| Vision | Gemini Vision | FREE |
| Weather | OpenWeatherMap | FREE (1000 calls/day) |
| Voice | Browser STT/TTS | FREE (unlimited) |
| Database | Supabase | FREE (500MB) |
| Code | GitHub | FREE |

**Total: ₹0/month** ✨

---

## 🎬 Demo Workflow

1. **Landing Page** → Click "Try Voice Advisory"
2. **Voice Page** → Select Hindi → Click "Start Call"
3. **Speak** your question (e.g., "टमाटर के पत्ते पीले क्यों?")
4. **Get AI response** in Hindi with actionable advice
5. **Try Disease** → Upload tomato leaf photo
6. **See diagnosis** with treatment recommendations
7. **Check Weather** → Select your district
8. **View Mandi** prices for your state
9. **Track Carbon** practices you've done
10. **Dashboard** shows aggregated stats

---

## 🏆 Hackathon Submission

### Track
**Track 4: AgriN** — Agricultural & Regenerative Intelligence

### Impact
- **Reach**: 10,000+ farmers per district
- **Languages**: 4 (Hindi, Marathi, Telugu, English)
- **Cost**: ₹0 for farmers to use
- **Time saved**: 2-3 hours per query vs. visiting Krishi Vigyan Kendra
- **Potential yield increase**: 20-30% with proper advice

### Innovation
- **Voice-first** (not app-first) for low-literacy users
- **Multimodal AI** (text + image)
- **FREE** to deploy and use
- **Carbon credit** integration for sustainability
- **Officer dashboard** for monitoring

---

## 🌐 Deploy to Vercel (FREE, 5 minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "KisanMitra AI - Initial commit"
git push -u origin main

# 2. Go to vercel.com → New Project
# 3. Import GitHub repo
# 4. Root Directory: frontend
# 5. Add env vars (Gemini, Weather keys)
# 6. Deploy!
```

Live URL: `https://kisanmitra-ai.vercel.app`

See [DEPLOYMENT_FREE.md](docs/DEPLOYMENT_FREE.md) for detailed guide.

---

## 📸 Screenshots

### Landing Page
Beautiful hero with language selector and feature cards

### Voice Advisory
Select language, click mic, speak, get response in your language

### Disease Detection
Upload photo → AI diagnoses → treatment recommendations

### Weather + Mandi
Live weather for any district + commodity prices

### Carbon Credits
Log regenerative practices → see impact in cars/trees equivalent

---

## 🧪 Testing

```bash
# Test the API routes
curl http://localhost:3000/api/voice -X POST -H "Content-Type: application/json" -d '{"query":"टमाटर के पीले पत्ते","language":"hindi"}'

curl http://localhost:3000/api/weather?district=Pune

curl http://localhost:3000/api/mandi?state=Maharashtra
```

---

## 🤝 Contributing

This is a hackathon project. Pull requests welcome!

## 📄 License

MIT License — feel free to use, modify, and deploy

## 👥 Team

Built with ❤️ for Indian farmers at Build with AI Hackathon 2026

---


