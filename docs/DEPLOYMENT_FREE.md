# 🚀 FREE Deployment Guide for KisanMitra AI

## 💰 Total Cost: ₹0 (Completely Free)

## Step 1: Get Free API Keys (5 minutes)

### 1.1 Google Gemini API (FREE - 60 requests/minute)
1. Go to: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (starts with "AIza...")
4. **No credit card required!**

### 1.2 OpenWeatherMap (FREE - 1000 calls/day)
1. Go to: https://openweathermap.org/api
2. Sign up free
3. Go to API keys section
4. Copy the key

### 1.3 Supabase (FREE - 500MB database)
1. Go to: https://supabase.com
2. Sign up free
3. Create new project
4. Get URL and anon key from Settings → API

---

## Step 2: Setup Locally (10 minutes)

```bash
# 1. Install Node.js 18+ from https://nodejs.org
# 2. Install Git from https://git-scm.com

# 3. Clone or download this project
cd kisanmitra-ai/frontend

# 4. Install dependencies
npm install

# 5. Create .env.local file
cp .env.example .env.local

# 6. Add your API keys to .env.local:
# GEMINI_API_KEY=AIza...
# NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=...
# NEXT_PUBLIC_SUPABASE_URL=https://...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Step 3: Run Locally (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Test these features:**
- 🗣️ Voice advisory (works in browser, no Twilio needed!)
- 📷 Disease detection (Gemini Vision free)
- 🌦️ Weather alerts (OpenWeatherMap free)
- 💰 Carbon credits (no API needed)

---

## Step 4: Deploy to Vercel (FREE - 5 minutes)

### Option A: Via GitHub (Recommended)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kisanmitra-ai.git
git push -u origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Set Root Directory: frontend
# 6. Add Environment Variables:
#    - GEMINI_API_KEY
#    - NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
# 7. Click "Deploy"
# 8. Wait 2 minutes
# 9. Get your free URL: https://kisanmitra-ai.vercel.app
```

### Option B: Direct Deploy (No GitHub)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Login with GitHub/Email
# - Confirm project name
# - Add environment variables
# - Deploy!
```

---

## Step 5: Custom Domain (Optional, FREE)

1. Buy domain from Namecheap (~$5/year) OR use free subdomain from Freenom
2. In Vercel: Settings → Domains → Add domain
3. Follow DNS instructions

---

## 📊 What You Get FREE

| Service | Free Tier | Usage in KisanMitra |
|---------|-----------|---------------------|
| **Vercel** | 100GB bandwidth/month | Frontend hosting |
| **Gemini API** | 60 requests/min | AI chat + vision |
| **OpenWeatherMap** | 1000 calls/day | Weather data |
| **Supabase** | 500MB database | User data + analytics |
| **GitHub** | Unlimited repos | Code storage |
| **Browser STT/TTS** | Unlimited | Voice input/output |
| **Vercel Analytics** | Unlimited | Performance tracking |

**Total Monthly Cost: ₹0** ✨

---

## 🎯 Demo Without Any Setup

If you just want to test it right now:

```bash
cd kisanmitra-ai/frontend
npm install
npm run dev
```

All features work **out of the box** with mock data:
- ✅ Voice: Uses browser STT/TTS (FREE, no Twilio)
- ✅ Disease: Falls back to database of 6 common diseases
- ✅ Weather: Uses OpenWeatherMap free tier OR mock data
- ✅ Mandi: 28+ commodity prices hardcoded
- ✅ Carbon: Pure local calculation, no API

---

## 🆘 Troubleshooting

### "Speech Recognition not supported"
- Use Chrome, Edge, or Safari
- HTTPS required (Vercel provides this automatically)

### "API quota exceeded"
- Free Gemini tier: 60 requests/min
- Wait 1 minute, or upgrade to paid tier ($0.00025/request)

### "Database error"
- Supabase free tier has occasional cold starts
- Wait 10 seconds, retry

---

## 🎥 Demo Video Script (2 minutes)

1. **0:00-0:20** — Introduction (problem statement)
2. **0:20-0:50** — Voice advisory demo (Hindi + Marathi)
3. **0:50-1:20** — Disease detection demo (upload photo)
4. **1:20-1:50** — Weather + Mandi alerts
5. **1:50-2:00** — Carbon credits + closing

---

## 🏆 For Hackathon Submission

Your project URL: `https://kisanmitra-ai.vercel.app`

Make sure to include:
- ✅ Working live URL
- ✅ 2-min demo video
- ✅ GitHub repository
- ✅ README with screenshots
- ✅ Architecture diagram

Good luck! 🚀🌾
