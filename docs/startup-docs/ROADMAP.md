# Farm Intellect — Product Roadmap

## Timeline Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRODUCT ROADMAP (18 months)                        │
│                                                                       │
│  Q1 2026          Q2 2026          Q3 2026          Q4 2026         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  MVP     │───→│  GROWTH  │───→│  SCALE   │───→│ MONETIZE │      │
│  │  v1.0    │    │  v1.5    │    │  v2.0    │    │  v2.5    │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                                       │
│  Features:        Features:       Features:       Features:          │
│  • Auth + RBAC   • SMS/WhatsApp  • Multi-state   • Marketplace     │
│  • AI Chat       • Payment flow  • IoT sensors   • B2B API         │
│  • Voice I/O     • Expert hiring • Drone imagery • Premium tier    │
│  • Forum         • Adv analytics • ML on-device  • Export tools    │
│  • Calendar      • Govt API      • Regional AI   • Insurance       │
│  • Disease AI    • Soil lab link • Satellite v2  • Agri-fintech    │
│                                                                       │
│  Users: 50       Users: 500      Users: 5,000    Users: 25,000     │
│  Cost: $5/mo     Cost: $50/mo    Cost: $200/mo   Revenue: $500/mo  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: MVP (Jan–Mar 2026)

```
┌─────────────────────────────────────────────────────────────────────┐
│  v1.0 — FOUNDATION RELEASE                                          │
│                                                                       │
│  Week 1─4: Core Platform                                            │
│  ├── Supabase Auth + local JWT dual auth                            │
│  ├── 4-role user system (Farmer/Merchant/Expert/Admin)              │
│  ├── Express + Prisma backend (SQLite → PostgreSQL)                 │
│  ├── AI chat via Sarvam-30b (Hindi, Punjabi, English)               │
│  ├── Voice STT (saaras:v3) + TTS (bulbul:v3)                       │
│  └── Socket.IO real-time messaging                                   │
│                                                                       │
│  Week 5─8: Engagement Features                                      │
│  ├── Community forum with expert moderation                         │
│  ├── Crop calendar (1500+ pre-populated activities)                 │
│  ├── Disease detection from image upload                            │
│  ├── Mandi price dashboard (50+ Punjab markets)                     │
│  └── Government schemes browser                                     │
│                                                                       │
│  Week 9─12: Intelligence + Polish                                   │
│  ├── Dashboard analytics per role (Recharts)                        │
│  ├── Document upload & verification                                 │
│  ├── PWA with service worker + offline cache                        │
│  ├── Notification system (in-app + push)                            │
│  └── Deployment: Vercel + Railway + Supabase                        │
│                                                                       │
│  MILESTONE: Production launch with 50 pilot farmers in Punjab       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 2: Growth (Apr–Jun 2026)

```
┌─────────────────────────────────────────────────────────────────────┐
│  v1.5 — ENGAGEMENT + REACH                                          │
│                                                                       │
│  COMMUNICATION CHANNELS                                              │
│  ├── WhatsApp Business API integration                              │
│  │   • AI chat via WhatsApp (voice notes + text)                    │
│  │   • Mandi price alerts via WhatsApp                              │
│  │   • Calendar reminders via WhatsApp message                      │
│  ├── SMS gateway for OTP + alerts (Twilio → Indian provider)        │
│  └── Push notifications (FCM web push)                               │
│                                                                       │
│  MARKETPLACE FOUNDATION                                              │
│  ├── Merchant ↔ Farmer direct connections                           │
│  ├── Crop listing + pricing by farmers                              │
│  ├── Expert consultation booking system                             │
│  └── Basic payment integration (Razorpay)                           │
│                                                                       │
│  DATA + GOVERNMENT                                                   │
│  ├── PM-KISAN scheme status checker (API)                           │
│  ├── Soil Health Card integration (SHC portal)                      │
│  ├── APMC mandi API for live prices                                 │
│  ├── Weather API integration (IMD data)                             │
│  └── Advanced analytics (historical trends, forecasting)            │
│                                                                       │
│  MILESTONE: 500 active users, WhatsApp as primary channel           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Scale (Jul–Sep 2026)

```
┌─────────────────────────────────────────────────────────────────────┐
│  v2.0 — MULTI-STATE + INTELLIGENCE                                   │
│                                                                       │
│  GEOGRAPHIC EXPANSION                                                │
│  ├── Haryana, Rajasthan, UP, Maharashtra datasets                   │
│  ├── State-specific crop calendars + mandi data                     │
│  ├── Regional language support (Marathi, Telugu, Tamil, Bengali)     │
│  └── Local expert network per state                                  │
│                                                                       │
│  ADVANCED AI                                                         │
│  ├── On-device ML for offline disease detection (TFLite)            │
│  ├── Satellite imagery analysis (NDVI, crop health)                 │
│  ├── Yield prediction ML model (trained on Indian agri data)        │
│  ├── Pest outbreak early warning system                             │
│  └── Personalized recommendation engine (user history-based)        │
│                                                                       │
│  IoT INTEGRATION                                                     │
│  ├── Soil moisture sensor data ingestion                            │
│  ├── Weather station API real-time feed                             │
│  ├── Drip irrigation smart scheduling                               │
│  └── Field boundary mapping via GPS                                  │
│                                                                       │
│  MILESTONE: 5,000 users across 3+ states, IoT pilot in Punjab      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 4: Monetize (Oct–Dec 2026)

```
┌─────────────────────────────────────────────────────────────────────┐
│  v2.5 — REVENUE + SUSTAINABILITY                                     │
│                                                                       │
│  BUSINESS MODEL                                                      │
│  ┌──────────────────────┬───────────┬──────────────────────────┐    │
│  │ Revenue Stream       │ Price     │ Description               │    │
│  ├──────────────────────┼───────────┼──────────────────────────┤    │
│  │ Premium AI (farmers) │ ₹99/mo    │ Unlimited AI, voice, scan│    │
│  │ Merchant Dashboard   │ ₹299/mo   │ Analytics + farmer reach │    │
│  │ Expert Listings      │ ₹499/mo   │ Featured profile + leads │    │
│  │ B2B API Access       │ ₹999/mo   │ Crop data API for FPOs   │    │
│  │ Sponsored Listings   │ ₹50/day   │ Agri-input companies     │    │
│  │ Transaction Fee      │ 2%        │ Marketplace transactions │    │
│  └──────────────────────┴───────────┴──────────────────────────┘    │
│                                                                       │
│  AGRI-FINTECH                                                        │
│  ├── Crop insurance marketplace (partner with insurers)             │
│  ├── Micro-loan pre-qualification (based on farm data)              │
│  ├── Input cost financing (seeds, fertilizer advances)              │
│  └── Revenue share with FPOs (Farmer Producer Organizations)        │
│                                                                       │
│  B2B TOOLS                                                           │
│  ├── API for agricultural data (crop yields, prices, weather)       │
│  ├── White-label AI advisory for state agriculture depts            │
│  ├── Export tools for agricultural reports (PDF, CSV)               │
│  └── Custom dashboards for agri-businesses                          │
│                                                                       │
│  MILESTONE: Revenue-positive at ₹50K/mo, 25K users                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Long-Term Vision (2027+)

```
┌─────────────────────────────────────────────────────────────────────┐
│  v3.0+ — PAN-INDIA AGRICULTURE INTELLIGENCE PLATFORM                │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Farm Intellect Ecosystem                    │ │
│  │                                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │ │
│  │  │ Farmer   │  │ Merchant │  │ Expert   │  │ Govt     │     │ │
│  │  │ App      │  │ Portal   │  │ Platform │  │ Dashboard│     │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │ │
│  │       │              │              │              │           │ │
│  │       └──────────────┴──────────────┴──────────────┘           │ │
│  │                        │                                       │ │
│  │              ┌─────────┴─────────┐                            │ │
│  │              │  Farm Intellect   │                            │ │
│  │              │  AI Core Platform │                            │ │
│  │              └─────────┬─────────┘                            │ │
│  │                        │                                       │ │
│  │    ┌───────────────────┼───────────────────┐                  │ │
│  │    │                   │                   │                  │ │
│  │  ┌─┴──────┐  ┌────────┴───────┐  ┌───────┴──────┐          │ │
│  │  │ IoT    │  │ Satellite +    │  │ Financial    │          │ │
│  │  │ Sensors│  │ Drone Imagery  │  │ Services     │          │ │
│  │  └────────┘  └────────────────┘  └──────────────┘          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Target: 1M+ farmers, 28 states, ₹1Cr+ annual revenue              │
│  Impact: 20% yield improvement, 30% cost reduction for farmers     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Milestones Timeline

```
┌──────────┬───────────────────────────────────────────────────────────┐
│ Date     │ Milestone                                                 │
├──────────┼───────────────────────────────────────────────────────────┤
│ Mar 2026 │ MVP launch — 50 farmers in Punjab pilot                  │
│ Apr 2026 │ WhatsApp integration live                                │
│ May 2026 │ 200+ daily active users                                  │
│ Jun 2026 │ Marketplace beta with 10 merchants                       │
│ Jul 2026 │ Haryana + UP expansion                                   │
│ Aug 2026 │ IoT pilot with 20 farms                                  │
│ Sep 2026 │ 5,000 registered users                                   │
│ Oct 2026 │ Premium tier launch (freemium model)                     │
│ Nov 2026 │ B2B API beta for FPOs                                    │
│ Dec 2026 │ Revenue target: ₹50K/month                               │
│ Mar 2027 │ 25,000 users, 5 states                                   │
│ Jun 2027 │ Series A readiness                                        │
└──────────┴───────────────────────────────────────────────────────────┘
```
