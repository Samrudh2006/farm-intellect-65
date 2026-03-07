# Farm Intellect — Product Requirements Document (PRD)

## Document Info

| Field          | Value                                                |
|----------------|------------------------------------------------------|
| Product        | Farm Intellect                                       |
| Version        | 1.0 (MVP)                                           |
| Last Updated   | March 2026                                           |
| Status         | Active Development                                   |
| Team Size      | 2-3 developers                                       |
| Target Market  | Indian Agriculture (150M+ farmers)                    |

---

## 1. Executive Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FARM INTELLECT                                    │
│             "AI-Powered Agriculture Intelligence Platform"            │
│                                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐   │
│  │  PROBLEM      │  │  SOLUTION     │  │  IMPACT               │   │
│  │               │  │               │  │                       │   │
│  │  60% of Indian│  │  AI-powered   │  │  30% yield increase  │   │
│  │  farmers lack │  │  advisory in  │  │  50% less crop loss  │   │
│  │  access to    │  │  local lang-  │  │  Direct market       │   │
│  │  timely agri  │  │  uages with   │  │  price access        │   │
│  │  advisory     │  │  voice support│  │  Expert network      │   │
│  └───────────────┘  └───────────────┘  └───────────────────────┘   │
│                                                                       │
│  Target Users: Farmers • Merchants • Agricultural Experts • Admins   │
│  Core Tech: React + Express + Sarvam AI + Supabase + Socket.IO      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Problem Statement

```
┌─────────────────────────────────────────────────────────────────────┐
│                    THE PROBLEM LANDSCAPE                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    INDIAN AGRICULTURE                         │   │
│  │                                                                │   │
│  │  150M+ farmers   │  46% GDP workforce   │  ₹30L Cr market    │   │
│  │  (most small/    │  (largest workforce   │  (agriculture      │   │
│  │   marginal)      │   segment in India)   │   market size)     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Pain Point 1: INFORMATION ASYMMETRY                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • Farmers lack real-time crop advisory                       │   │
│  │  • No access to soil-specific recommendations                 │   │
│  │  • Disease identification is delayed (average 3-5 days)       │   │
│  │  • Weather-based planning is mostly guesswork                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Pain Point 2: LANGUAGE BARRIER                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • Most agri-tech apps are English-only                       │   │
│  │  • 60%+ farmers communicate in regional languages             │   │
│  │  • Voice is preferred over text for rural users               │   │
│  │  • Code-mixing (Hinglish, Punjlish) is common                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Pain Point 3: MARKET ACCESS                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • Farmers sell at Mandi with no price transparency           │   │
│  │  • Middlemen control 40-60% of margins                        │   │
│  │  • No direct merchant-farmer connection platform              │   │
│  │  • MSP awareness is low among small farmers                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Pain Point 4: EXPERT ACCESS                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • 1 agricultural officer per 1000+ farmers (India average)   │   │
│  │  • Expert consultation is expensive and inaccessible          │   │
│  │  • No feedback loop between experts and farmers               │   │
│  │  • Government scheme awareness is poor                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Target Users & Personas

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER PERSONAS                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ PERSONA 1: Farmer (Primary User — 70% of traffic)            │   │
│  │                                                                │   │
│  │  Name: Gurpreet Singh (28, Punjab)                            │   │
│  │  Farm: 5 acres, wheat + rice rotation                         │   │
│  │  Tech: Android phone, 4G, comfortable with WhatsApp           │   │
│  │  Language: Punjabi primary, Hindi secondary                   │   │
│  │  Pain: Crop disease killed 30% of last harvest                │   │
│  │  Goal: Get timely advice, better prices, reduce losses        │   │
│  │                                                                │   │
│  │  Key Needs:                                                    │   │
│  │  ✓ Voice-based AI advisory in Punjabi                         │   │
│  │  ✓ Crop disease scanner (photo → diagnosis)                   │   │
│  │  ✓ Mandi prices for his region                                │   │
│  │  ✓ Crop calendar with reminders                               │   │
│  │  ✓ Weather alerts for his farm location                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ PERSONA 2: Merchant (Secondary User — 15% of traffic)        │   │
│  │                                                                │   │
│  │  Name: Rajesh Patel (42, Gujarat)                             │   │
│  │  Business: Grain trading + storage                            │   │
│  │  Tech: Smartphone + laptop, English literate                  │   │
│  │  Pain: Finding quality produce at fair prices                 │   │
│  │  Goal: Direct sourcing from verified farmers                  │   │
│  │                                                                │   │
│  │  Key Needs:                                                    │   │
│  │  ✓ Browse verified farmer profiles                            │   │
│  │  ✓ Real-time market prices across mandis                      │   │
│  │  ✓ Document management (invoices, contracts)                  │   │
│  │  ✓ Communication channel with farmers                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ PERSONA 3: Agricultural Expert (10% of traffic)              │   │
│  │                                                                │   │
│  │  Name: Dr. Meena Sharma (35, Agricultural University)         │   │
│  │  Expertise: Plant pathology, IPM strategies                   │   │
│  │  Tech: Laptop + smartphone, research-oriented                 │   │
│  │  Pain: Cannot reach enough farmers for impact                 │   │
│  │  Goal: Scale advisory reach, build reputation                 │   │
│  │                                                                │   │
│  │  Key Needs:                                                    │   │
│  │  ✓ AI-assisted crop disease diagnosis                         │   │
│  │  ✓ Direct chat with farmers                                   │   │
│  │  ✓ Forum for knowledge sharing                                │   │
│  │  ✓ Consultation tracking + ratings                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ PERSONA 4: Admin (5% of traffic)                              │   │
│  │                                                                │   │
│  │  Name: Platform Operations Team                                │   │
│  │  Goal: User management, content moderation, analytics         │   │
│  │                                                                │   │
│  │  Key Needs:                                                    │   │
│  │  ✓ User management (approve, ban, role assignment)            │   │
│  │  ✓ System analytics (usage, engagement, errors)               │   │
│  │  ✓ Forum moderation (approve/reject posts)                    │   │
│  │  ✓ Document verification workflow                             │   │
│  │  ✓ Notification broadcasting                                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Feature Requirements

### 4.1 Feature Priority Matrix

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FEATURE PRIORITY MATRIX                            │
│                                                                       │
│  IMPACT ▲                                                            │
│         │                                                            │
│  HIGH   │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│         │  │ AI Chat  │  │ Crop     │  │ Voice    │               │
│         │  │ Advisory │  │ Disease  │  │ Assistant│               │
│         │  │ ★★★★★    │  │ Scanner  │  │ ★★★★★    │               │
│         │  │          │  │ ★★★★★    │  │          │               │
│         │  └──────────┘  └──────────┘  └──────────┘               │
│         │                                                            │
│  MED    │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│         │  │ Mandi    │  │ Expert   │  │ Crop     │               │
│         │  │ Prices   │  │ Chat     │  │ Calendar │               │
│         │  │ ★★★★     │  │ ★★★★     │  │ ★★★★     │               │
│         │  └──────────┘  └──────────┘  └──────────┘               │
│         │                                                            │
│  LOW    │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│         │  │ Forum    │  │ Weather  │  │ Gov      │               │
│         │  │ ★★★      │  │ ★★★      │  │ Schemes  │               │
│         │  │          │  │          │  │ ★★★      │               │
│         │  └──────────┘  └──────────┘  └──────────┘               │
│         │                                                            │
│         └────────────────────────────────────────────► EFFORT        │
│              LOW            MEDIUM           HIGH                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 MVP Features (Phase 1)

| #  | Feature                 | User        | Description                                                     | Priority |
|----|-------------------------|-------------|------------------------------------------------------------------|----------|
| F1 | Multi-role Auth         | All         | Email + password signup with role selection + OTP verification   | P0       |
| F2 | AI Crop Advisory        | Farmer      | Crop recommendations based on location, soil, season, farm size  | P0       |
| F3 | Disease Scanner         | Farmer/Exp  | Upload crop image → AI disease identification + treatment        | P0       |
| F4 | Voice Assistant         | Farmer      | Voice input/output in 12+ Indian languages via Sarvam AI        | P0       |
| F5 | Mandi Prices            | Farmer/Merch| Real-time market prices from 50+ mandis with MSP comparison      | P0       |
| F6 | Expert Chat             | Farmer/Exp  | Real-time chat between farmers and agricultural experts          | P1       |
| F7 | Crop Calendar           | Farmer      | Seasonal planting schedule with alerts and weather integration   | P1       |
| F8 | Forum                   | All         | Community Q&A with moderation, categories, search                | P1       |
| F9 | Document Management     | All         | Upload/verify ID proof, land records, business licenses          | P1       |
| F10| Notifications           | All         | Multi-channel: in-app, real-time (Socket.IO), email, SMS         | P1       |
| F11| Role Dashboards         | All         | Farmer/Merchant/Expert/Admin specific dashboard views            | P1       |
| F12| Analytics               | Admin       | System-wide usage metrics, user engagement, activity tracking    | P2       |
| F13| Weather Integration     | Farmer      | Location-based weather data with crop impact alerts              | P2       |
| F14| Government Schemes      | Farmer      | PM-Kisan, crop insurance, subsidy information                    | P2       |
| F15| Sensor Integration      | Farmer      | IoT sensor data visualization for soil moisture, temperature      | P2       |
| F16| Field Map               | Farmer      | Farm boundary mapping and crop allocation visualization          | P2       |
| F17| Yield Prediction        | Farmer      | ML-based yield estimation based on crop + conditions              | P2       |

---

## 5. Non-Functional Requirements

```
┌─────────────────────────────────────────────────────────────────────┐
│                NON-FUNCTIONAL REQUIREMENTS                            │
│                                                                       │
│  PERFORMANCE                                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • Page load time: < 3 seconds on 4G connection              │   │
│  │  • API response time: < 500ms (p95) for CRUD operations     │   │
│  │  • AI response time: < 5 seconds for advisory               │   │
│  │  • Voice transcription: < 3 seconds                         │   │
│  │  • WebSocket latency: < 200ms for chat messages             │   │
│  │  • Bundle size: < 500KB gzipped (initial load)              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  SCALABILITY                                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • MVP target: 100-500 concurrent users                     │   │
│  │  • Database: Support up to 50K users without migration      │   │
│  │  • AI API: Handle 40 requests/15min per user                │   │
│  │  • WebSocket: 200 concurrent connections                    │   │
│  │  • File storage: Up to 10GB for MVP                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  AVAILABILITY                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • Target uptime: 99% (allows ~7.3 hours downtime/month)    │   │
│  │  • Graceful degradation: Curated data available offline     │   │
│  │  • AI fallback: Dataset-based responses if API is down      │   │
│  │  • PWA: Basic offline capability via service worker         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  SECURITY                                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • HTTPS everywhere                                          │   │
│  │  • bcrypt password hashing (12 rounds)                       │   │
│  │  • JWT tokens with expiry                                    │   │
│  │  • Rate limiting (4 tiers)                                   │   │
│  │  • Input validation on all endpoints                         │   │
│  │  • RLS policies on Supabase tables                          │   │
│  │  • CORS whitelist                                            │   │
│  │  • Helmet.js security headers                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ACCESSIBILITY                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  • Voice-first design for low-literacy users                 │   │
│  │  • 12+ language support (Hindi, Punjabi, Tamil, etc.)        │   │
│  │  • Mobile-first responsive design                            │   │
│  │  • Works on low-end Android devices (2GB RAM)                │   │
│  │  • Minimal data consumption (< 5MB per session)              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Success Metrics

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SUCCESS METRICS (MVP)                              │
│                                                                       │
│  ┌───────────────────┬────────────────┬────────────────────────┐    │
│  │ Metric            │ Target (3 mo)  │ Measurement            │    │
│  ├───────────────────┼────────────────┼────────────────────────┤    │
│  │ Registered users  │ 500+           │ Supabase auth count    │    │
│  │ DAU / MAU ratio   │ > 20%          │ Analytics dashboard    │    │
│  │ AI interactions   │ 5+ per user/wk │ Chat message count     │    │
│  │ Voice usage rate  │ > 30% of chats │ STT/TTS API calls      │    │
│  │ Expert consults   │ 50+ per month  │ Chat sessions tracking │    │
│  │ Forum posts       │ 100+ per month │ Posts table count      │    │
│  │ Avg session time  │ > 5 minutes    │ Activity tracking      │    │
│  │ Disease scans     │ 200+ per month │ AI endpoint calls      │    │
│  │ User retention    │ > 40% (30-day) │ Cohort analysis        │    │
│  │ NPS score         │ > 50           │ In-app survey          │    │
│  └───────────────────┴────────────────┴────────────────────────┘    │
│                                                                       │
│  NORTH STAR METRIC: Weekly Active AI Advisory Interactions           │
│  (measures core value delivery)                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Constraints & Assumptions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONSTRAINTS                                       │
│                                                                       │
│  Budget:    $5-15/month infrastructure (student/startup budget)     │
│  Team:      2-3 developers (full-stack)                             │
│  Timeline:  MVP in 8-10 weeks                                       │
│  AI:        API-based only (no GPU, no self-hosting)                │
│  Database:  Free tier services (Supabase, SQLite)                   │
│  Devices:   Must work on low-end Android (2GB RAM, 4G)             │
│                                                                       │
│                    ASSUMPTIONS                                       │
│                                                                       │
│  • Farmers have access to Android smartphones with 4G               │
│  • Sarvam AI API remains available and affordable                   │
│  • Supabase free tier sufficient for MVP scale                      │
│  • English + Hindi cover 80% of initial user base                   │
│  • Expert users willing to volunteer for platform testing           │
│  • Government mandi price data is publicly accessible               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Out of Scope (Post-MVP)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    OUT OF SCOPE (Post-MVP)                            │
│                                                                       │
│  ✗ Mobile native app (Android/iOS)                                  │
│  ✗ Offline mode with full sync                                      │
│  ✗ Payment processing / e-commerce                                  │
│  ✗ Satellite imagery analysis (NDVI)                                │
│  ✗ Hardware IoT sensor integration                                  │
│  ✗ Supply chain tracking                                            │
│  ✗ Insurance integration                                            │
│  ✗ Self-hosted ML models                                            │
│  ✗ Multi-tenant white-labeling                                      │
│  ✗ Blockchain-based traceability                                    │
└─────────────────────────────────────────────────────────────────────┘
```
