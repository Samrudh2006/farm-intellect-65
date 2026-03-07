# Farm Intellect — User Flows

## Role-Based Flow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER FLOW MAP                                      │
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ FARMER   │  │ MERCHANT │  │ EXPERT   │  │ ADMIN    │            │
│  │ (70%)    │  │ (15%)    │  │ (10%)    │  │ (5%)     │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │              │              │              │                  │
│       ▼              ▼              ▼              ▼                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  SHARED AUTH FLOW                             │   │
│  │  Signup → OTP verify → Login → Role-based Dashboard          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│       │              │              │              │                  │
│       ▼              ▼              ▼              ▼                  │
│  18 routes       6 routes       6 routes       5 routes             │
│  AI Chat         Farmer list    Advisory       Moderation           │
│  Voice I/O       Market data    Disease help   User mgmt            │
│  Disease scan    Orders         Forum verify   Analytics            │
│  Forum           Analytics      Calendar       Settings             │
│  Calendar        Notifications  Notifications  All routes           │
│  Mandi prices                                                        │
│  Govt schemes                                                        │
│  Soil health                                                         │
│  Satellite                                                           │
│  Documents                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 1: Farmer Registration & Onboarding

```
┌─────────────────────────────────────────────────────────────────────┐
│  FARMER SIGNUP FLOW                                                  │
│                                                                       │
│  ┌────────────┐                                                      │
│  │ Landing    │  → User clicks "Sign Up" / "ਸਾਈਨ ਅੱਪ"               │
│  │ Page (/)   │                                                      │
│  └──────┬─────┘                                                      │
│         │                                                            │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Signup     │  → Fill: Name, Email, Password, Phone               │
│  │ (/signup)  │  → Select Role: FARMER                              │
│  │            │  → Select Location: Punjab > Ludhiana               │
│  └──────┬─────┘                                                      │
│         │ POST /api/auth/signup                                      │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ OTP Verify │  → 6-digit code sent to email                       │
│  │ Screen     │  → Enter OTP within 10 minutes                      │
│  │            │  → "Resend OTP" option                               │
│  └──────┬─────┘                                                      │
│         │ POST /api/auth/verify-otp                                  │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Profile    │  → Farm Size (acres)                                │
│  │ Setup      │  → Primary Crops (multi-select)                     │
│  │            │  → Irrigation Type                                   │
│  │            │  → Years of Experience                               │
│  └──────┬─────┘                                                      │
│         │ PATCH /api/users/profile                                   │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Dashboard  │  → Personalized farmer dashboard                    │
│  │ (/dashboard│  → Weather, crop tips, recent activity              │
│  │    )       │  → Quick links: Chat, Scanner, Calendar             │
│  └────────────┘                                                      │
│                                                                       │
│  TIME: ~3 minutes  │  SCREENS: 4  │  API CALLS: 3                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 2: AI Chat Conversation (Voice)

```
┌─────────────────────────────────────────────────────────────────────┐
│  VOICE CHAT FLOW                                                     │
│                                                                       │
│  ┌────────────┐                                                      │
│  │ Dashboard  │  → Tap "AI Chat" / "AI ਸਲਾਹ"                       │
│  └──────┬─────┘                                                      │
│         │                                                            │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Chat       │  → Existing messages loaded (GET /api/chat/messages)│
│  │ Screen     │  → Language auto-set from LanguageContext            │
│  │ (/chat)    │                                                      │
│  └──────┬─────┘                                                      │
│         │ Tap 🎤 mic button                                          │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Recording  │  → Red indicator, pulsing border                    │
│  │ State      │  → Max 30 seconds                                   │
│  │            │  → Tap again to stop                                │
│  └──────┬─────┘                                                      │
│         │ Audio blob captured                                        │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Processing │  → POST /api/chat/voice/transcribe                  │
│  │ (STT)      │  → "ਮੇਰੀ ਕਣਕ ਵਿੱਚ ਕੀੜੇ ਲੱਗ ਗਏ ਨੇ"               │
│  └──────┬─────┘                                                      │
│         │ Transcribed text auto-fills input                          │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ AI Thinks  │  → POST /api/chat/message                           │
│  │ (Loading)  │  → System prompt + user message → Sarvam-30b       │
│  └──────┬─────┘                                                      │
│         │ AI response received                                       │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ Response   │  → AI text displayed in chat bubble                 │
│  │ Display    │  → 🔊 Play button appears                           │
│  └──────┬─────┘                                                      │
│         │ Tap 🔊                                                     │
│         ▼                                                            │
│  ┌────────────┐                                                      │
│  │ TTS Play   │  → POST /api/chat/voice/speak                      │
│  │            │  → Audio plays via Web Audio API                    │
│  │            │  → Farmer listens in Punjabi                        │
│  └────────────┘                                                      │
│                                                                       │
│  TOTAL TIME: ~6 seconds                                              │
│  (Record 5s + STT 1s + AI 2s + TTS 1s + play 3s)                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 3: Disease Detection

```
┌─────────────────────────────────────────────────────────────────────┐
│  CROP DISEASE SCANNER FLOW                                           │
│                                                                       │
│  Dashboard → "Crop Scanner" (or sidebar nav)                        │
│       │                                                              │
│       ▼                                                              │
│  ┌────────────────┐                                                  │
│  │ Scanner Page   │  Two options:                                   │
│  │ (/ai-crop-     │  ┌──────────┐  ┌──────────┐                    │
│  │  scanner)      │  │ 📷 Take  │  │ 📁 Upload│                    │
│  │                │  │   Photo  │  │   Image  │                    │
│  │                │  └────┬─────┘  └────┬─────┘                    │
│  └────────────────┘       │              │                           │
│                           └──────┬───────┘                           │
│                                  │ Image captured/selected           │
│                                  ▼                                   │
│                    ┌──────────────────────┐                          │
│                    │ Preview + Optional   │                          │
│                    │ Crop Type Selection  │                          │
│                    │ (dropdown: wheat,    │                          │
│                    │  rice, cotton...)    │                          │
│                    └──────────┬───────────┘                          │
│                               │ Submit                               │
│                               ▼                                      │
│                    ┌──────────────────────┐                          │
│                    │ Analyzing...         │  POST /api/ai/           │
│                    │ (loading spinner)    │  detect-disease          │
│                    └──────────┬───────────┘  (multipart/form-data)  │
│                               │                                      │
│                               ▼                                      │
│                    ┌──────────────────────┐                          │
│                    │ RESULTS              │                          │
│                    │ ┌──────────────────┐ │                          │
│                    │ │ Disease: Brown   │ │                          │
│                    │ │ Spot (87%)       │ │                          │
│                    │ │ Severity: ██░░░  │ │                          │
│                    │ ├──────────────────┤ │                          │
│                    │ │ 💊 Chemical:     │ │                          │
│                    │ │ Mancozeb 75% WP │ │                          │
│                    │ │ @ 2g/L           │ │                          │
│                    │ ├──────────────────┤ │                          │
│                    │ │ 🌿 Organic:     │ │                          │
│                    │ │ Neem oil spray   │ │                          │
│                    │ ├──────────────────┤ │                          │
│                    │ │ 🛡️ Prevention:  │ │                          │
│                    │ │ Use resistant    │ │                          │
│                    │ │ varieties        │ │                          │
│                    │ └──────────────────┘ │                          │
│                    └──────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 4: Merchant Marketplace

```
┌─────────────────────────────────────────────────────────────────────┐
│  MERCHANT FLOW                                                       │
│                                                                       │
│  Login (role=MERCHANT) → /merchant/dashboard                        │
│       │                                                              │
│       ├──→ View Farmer Listings (GET /api/users/farmers)            │
│       │    └── Filter by: location, crop type, farm size            │
│       │    └── Contact farmer for procurement                       │
│       │                                                              │
│       ├──→ Market Analytics (/merchant/analytics)                   │
│       │    └── Price trends (Recharts line chart)                    │
│       │    └── Supply/demand by region                              │
│       │    └── Seasonal forecasts                                   │
│       │                                                              │
│       ├──→ Orders Management (/merchant/orders)                     │
│       │    └── Active procurement orders                            │
│       │    └── Order history + status tracking                      │
│       │                                                              │
│       └──→ Notifications (/merchant/notifications)                  │
│            └── New farmer listings in area                          │
│            └── Price change alerts                                  │
│            └── Order status updates                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 5: Expert Advisory

```
┌─────────────────────────────────────────────────────────────────────┐
│  EXPERT FLOW                                                         │
│                                                                       │
│  Login (role=EXPERT) → /expert/dashboard                            │
│       │                                                              │
│       ├──→ Answer Forum Questions (/forum)                          │
│       │    └── Auto-approved posts (expert privilege)                │
│       │    └── Verified answer badge on replies                     │
│       │    └── Can view unapproved farmer posts for moderation      │
│       │                                                              │
│       ├──→ Disease Advisory (/expert/advisory)                      │
│       │    └── Review AI disease detections                         │
│       │    └── Provide expert corrections/confirmations             │
│       │    └── Access preventive tips endpoint                      │
│       │                                                              │
│       ├──→ Calendar Management (/expert/calendar)                   │
│       │    └── Create seasonal advisories                           │
│       │    └── Push reminders to farmers in region                  │
│       │                                                              │
│       └──→ Consultations (/expert/consultations)                    │
│            └── Booking requests from farmers                        │
│            └── Chat with farmers (Socket.IO)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Flow 6: Admin Management

```
┌─────────────────────────────────────────────────────────────────────┐
│  ADMIN FLOW                                                          │
│                                                                       │
│  Login (role=ADMIN) → /admin-dashboard                              │
│       │                                                              │
│       ├──→ User Management (/admin/users)                           │
│       │    └── View all users with role filters                     │
│       │    └── Verify/unverify accounts                             │
│       │    └── Change user roles                                    │
│       │    └── Ban/suspend accounts                                 │
│       │                                                              │
│       ├──→ Content Moderation (/admin/moderation)                   │
│       │    └── Review pending forum posts                           │
│       │    └── Approve/reject posts                                 │
│       │    └── Review flagged content                               │
│       │                                                              │
│       ├──→ Platform Analytics (/admin/analytics)                    │
│       │    └── Total users, DAU, WAU charts                        │
│       │    └── AI usage stats (calls/day)                          │
│       │    └── Error rates + uptime                                │
│       │    └── Revenue metrics (future)                            │
│       │                                                              │
│       ├──→ System Settings (/admin/settings)                        │
│       │    └── Rate limit configuration                             │
│       │    └── Feature flags                                        │
│       │    └── Broadcast notifications to all users                │
│       │                                                              │
│       └──→ All Routes (ADMIN has access to every page)              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Navigation Map (All 36+ Routes)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ROUTE STRUCTURE                                                     │
│                                                                       │
│  PUBLIC (no auth):                                                   │
│  ├── /                    → Home / Landing                          │
│  ├── /login               → Login page                              │
│  ├── /signup              → Registration                            │
│  ├── /features            → Feature showcase                        │
│  └── /about               → About page                              │
│                                                                       │
│  FARMER (role=FARMER):                                               │
│  ├── /dashboard           → Farmer dashboard                       │
│  ├── /chat                → AI chat + voice                        │
│  ├── /ai-advisory         → AI recommendations                    │
│  ├── /ai-crop-scanner     → Disease detection                     │
│  ├── /crops               → Crop library (60+ crops)               │
│  ├── /calendar            → Crop calendar + reminders              │
│  ├── /analytics           → Personal farm analytics                │
│  ├── /forum               → Community forum                        │
│  ├── /documents           → Upload documents                       │
│  ├── /notifications       → Notifications                          │
│  ├── /mandi-prices        → Market prices                          │
│  ├── /govt-schemes        → Government schemes                     │
│  ├── /soil-testing        → Soil health data                       │
│  ├── /satellite           → Field satellite view                   │
│  ├── /weather             → Weather forecast                       │
│  ├── /kisan-call-center   → Helpline directory                     │
│  ├── /settings            → Profile settings                       │
│  └── /profile             → User profile                           │
│                                                                       │
│  MERCHANT (role=MERCHANT):                                           │
│  ├── /merchant/dashboard  → Merchant dashboard                     │
│  ├── /merchant/analytics  → Market analytics                       │
│  ├── /merchant/orders     → Order management                       │
│  ├── /merchant/profile    → Business profile                       │
│  ├── /merchant/farmers    → Farmer directory                       │
│  └── /merchant/notifications → Alerts                              │
│                                                                       │
│  EXPERT (role=EXPERT):                                               │
│  ├── /expert/dashboard    → Expert dashboard                       │
│  ├── /expert/advisory     → Advisory management                    │
│  ├── /expert/calendar     → Schedule management                    │
│  ├── /expert/consultations → Consultation requests                 │
│  ├── /expert/profile      → Expert profile                         │
│  └── /expert/notifications → Alerts                                │
│                                                                       │
│  ADMIN (role=ADMIN):                                                 │
│  ├── /admin-dashboard     → Admin overview                         │
│  ├── /admin/users         → User management                        │
│  ├── /admin/moderation    → Content moderation                     │
│  ├── /admin/analytics     → Platform analytics                     │
│  └── /admin/settings      → System settings                        │
└─────────────────────────────────────────────────────────────────────┘
```
