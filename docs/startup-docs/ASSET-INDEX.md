# Farm Intellect — Asset Index

## Project Root Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPLETE FILE INDEX                                │
│                                                                       │
│  farm-intellect-65/                                                  │
│  ├── index.html              → SPA entry point                      │
│  ├── package.json            → Frontend deps (32+ packages)         │
│  ├── bun.lockb               → Bun lockfile                         │
│  ├── vite.config.ts          → Vite build config + Vitest           │
│  ├── tailwind.config.ts      → Tailwind CSS + custom theme          │
│  ├── postcss.config.js       → PostCSS + Tailwind plugin            │
│  ├── tsconfig.json           → TypeScript root config               │
│  ├── tsconfig.app.json       → App-specific TS config               │
│  ├── tsconfig.node.json      → Node-specific TS config              │
│  ├── eslint.config.js        → ESLint flat config                   │
│  ├── components.json         → shadcn/ui component config           │
│  ├── vercel.json             → Vercel deployment config             │
│  └── README.md               → Project readme                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Source (src/)

```
┌─────────────────────────────────────────────────────────────────────┐
│  src/                                                                │
│  ├── main.tsx                → React entry point                    │
│  ├── App.tsx                 → 36+ routes, providers, layout        │
│  ├── App.css                 → Global styles                        │
│  ├── index.css               → Tailwind imports + CSS variables     │
│  ├── vite-env.d.ts           → Vite type declarations               │
│  │                                                                   │
│  ├── contexts/                                                       │
│  │   ├── AuthContext.tsx      → Supabase auth + profile fetching    │
│  │   └── LanguageContext.tsx  → Multi-language state (12+ langs)    │
│  │                                                                   │
│  ├── hooks/                                                          │
│  │   ├── use-mobile.tsx      → Mobile breakpoint detection          │
│  │   ├── use-toast.ts        → Toast notification hook              │
│  │   ├── useCurrentUser.ts   → Current user data hook               │
│  │   └── usePwaStatus.ts     → PWA install status detection         │
│  │                                                                   │
│  ├── lib/                                                            │
│  │   ├── utils.ts            → cn() helper + utilities              │
│  │   ├── utils.test.ts       → Unit tests for utils                 │
│  │   ├── api.ts              → API client (fetch wrapper)           │
│  │   ├── assistantApi.ts     → AI assistant API calls               │
│  │   ├── aiStream.ts         → AI streaming response handler       │
│  │   ├── error-handling.ts   → Error formatting + boundaries       │
│  │   ├── logger.ts           → Frontend logger                      │
│  │   └── phase1-storage.ts   → Local storage operations             │
│  │                                                                   │
│  ├── integrations/                                                   │
│  │   ├── supabase/           → Supabase client + types              │
│  │   └── lovable/            → Lovable platform integration         │
│  │                                                                   │
│  └── types/                  → TypeScript type definitions           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Pages (src/pages/)

```
┌─────────────────────────────────────────────────────────────────────┐
│  src/pages/                                                          │
│  │                                                                   │
│  │  SHARED / PUBLIC PAGES:                                          │
│  ├── Index.tsx               → Landing page                         │
│  ├── Login.tsx               → Login form                           │
│  ├── Signup.tsx              → Registration form                    │
│  ├── Features.tsx            → Feature showcase                     │
│  ├── About.tsx               → About page                           │
│  ├── NotFound.tsx            → 404 page                             │
│  │                                                                   │
│  │  FARMER PAGES:                                                   │
│  ├── Dashboard.tsx           → Farmer main dashboard                │
│  ├── Chat.tsx                → AI chat + voice interface            │
│  ├── AIAdvisory.tsx          → AI crop advisory                     │
│  ├── AICropScanner.tsx       → Disease detection scanner            │
│  ├── Advisory.tsx            → General advisory                     │
│  ├── Crops.tsx               → Crop library browser                 │
│  ├── Calendar.tsx            → Crop calendar + reminders            │
│  ├── Analytics.tsx           → Farm analytics dashboard             │
│  ├── Forum.tsx               → Community forum                      │
│  ├── Documents.tsx           → Document upload                      │
│  ├── Notifications.tsx       → Notification center                  │
│  ├── MandiPrices.tsx         → Market price dashboard               │
│  ├── GovtSchemes.tsx         → Government scheme browser            │
│  ├── SoilTesting.tsx         → Soil health analysis                 │
│  ├── SatelliteView.tsx       → Field satellite imagery              │
│  ├── Weather.tsx             → Weather forecast                     │
│  ├── KisanCallCenter.tsx     → Helpline directory                   │
│  ├── Settings.tsx            → Profile settings                     │
│  ├── Profile.tsx             → User profile                         │
│  │                                                                   │
│  │  ADMIN PAGES:                                                    │
│  ├── AdminDashboard.tsx      → Admin overview dashboard             │
│  ├── AdminDashboardPage.tsx  → Admin detailed dashboard             │
│  │                                                                   │
│  │  ROLE-SPECIFIC (/pages/merchant/, /pages/expert/):               │
│  ├── merchant/               → 6 merchant-specific pages            │
│  └── expert/                 → 6 expert-specific pages              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components (src/components/)

```
┌─────────────────────────────────────────────────────────────────────┐
│  src/components/                                                     │
│  │                                                                   │
│  ├── ui/                     → shadcn/ui components (30+ primitives)│
│  │   ├── button.tsx, input.tsx, card.tsx, dialog.tsx, ...           │
│  │   ├── sidebar.tsx, toast.tsx, tabs.tsx, select.tsx, ...          │
│  │   └── (Radix UI-based, fully accessible)                        │
│  │                                                                   │
│  ├── layout/                 → App layout components                │
│  │   ├── Sidebar, Navbar, Footer, MobileNav                        │
│  │   └── ProtectedRoute, AnimatedRoutes                             │
│  │                                                                   │
│  ├── auth/                   → Authentication UI                    │
│  │   └── LoginForm, SignupForm, OTPVerify                           │
│  │                                                                   │
│  ├── ai/                     → AI feature components                │
│  │   └── ChatInterface, VoiceInput, DiseaseScanner                  │
│  │                                                                   │
│  ├── chat/                   → Chat UI components                   │
│  │   └── MessageBubble, ChatInput, VoiceButton                      │
│  │                                                                   │
│  ├── crops/                  → Crop-related components              │
│  │   └── CropCard, CropDetail, CropFilter                          │
│  │                                                                   │
│  ├── forum/                  → Forum components                     │
│  │   └── PostCard, CommentList, CreatePost                          │
│  │                                                                   │
│  ├── calendar/               → Calendar components                  │
│  │   └── CalendarView, ActivityCard, ReminderForm                   │
│  │                                                                   │
│  ├── analytics/              → Dashboard charts                     │
│  │   └── Recharts wrappers (LineChart, BarChart, PieChart)          │
│  │                                                                   │
│  ├── dashboard/              → Dashboard widgets                    │
│  │   └── StatCard, RecentActivity, QuickActions                     │
│  │                                                                   │
│  ├── documents/              → Document upload components           │
│  ├── features/               → Feature showcase components          │
│  ├── home/                   → Landing page components              │
│  ├── notifications/          → Notification list + badges           │
│  ├── punjab/                 → Punjab-specific components           │
│  └── system/                 → Error boundaries + loading           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Files (src/data/)

```
┌─────────────────────────────────────────────────────────────────────┐
│  src/data/                   → Curated agricultural datasets         │
│  │                                                                   │
│  ├── cropsData.ts            → 60+ Indian crops                     │
│  │   (name, season, soil, yield, MSP, water, duration, regions)     │
│  │                                                                   │
│  ├── cropDiseases.ts         → 50+ crop diseases                    │
│  │   (crop, disease, symptoms, treatment, prevention, severity)     │
│  │                                                                   │
│  ├── cropCalendar.ts         → 1500+ farming activities             │
│  │   (crop, month, activity, region, priority)                      │
│  │                                                                   │
│  ├── cropRecommendations.ts  → Soil/season → crop mappings         │
│  ├── cropProduction.ts       → State-wise production data           │
│  ├── mandiPrices.ts          → 50+ mandi market prices              │
│  ├── pestData.ts             → 30+ pest profiles                    │
│  ├── soilHealth.ts           → 12 soil health parameters            │
│  ├── satelliteData.ts        → Sample satellite imagery data        │
│  ├── indianLocations.ts      → State → district hierarchy           │
│  └── kisanCallCenter.ts      → Helpline numbers by state            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Backend (backend/)

```
┌─────────────────────────────────────────────────────────────────────┐
│  backend/                                                            │
│  ├── package.json            → Backend deps (17 packages)           │
│  ├── vitest.config.js        → Backend test config                  │
│  │                                                                   │
│  ├── prisma/                                                         │
│  │   └── schema.prisma       → 13 models, 5 enums, SQLite          │
│  │                                                                   │
│  ├── src/                                                            │
│  │   ├── server.js           → Express + Socket.IO + middleware     │
│  │   ├── healthApp.js        → Health check express app             │
│  │   │                                                               │
│  │   ├── config/                                                     │
│  │   │   ├── database.js     → Prisma client initialization        │
│  │   │   └── supabase.js     → Supabase admin client                │
│  │   │                                                               │
│  │   ├── middleware/                                                  │
│  │   │   ├── auth.js         → authenticate() + authorize()        │
│  │   │   ├── errorHandler.js → Global error handler                 │
│  │   │   └── activity.js     → Activity logging middleware          │
│  │   │                                                               │
│  │   ├── routes/             → 9 route modules                      │
│  │   │   ├── auth.js         → Signup, login, OTP, resend           │
│  │   │   ├── users.js        → Profile CRUD, farmer list            │
│  │   │   ├── ai.js           → Crop recommend, disease, yield      │
│  │   │   ├── chat.js         → Messages, voice STT/TTS              │
│  │   │   ├── forum.js        → Posts, comments, moderation          │
│  │   │   ├── documents.js    → Upload (Multer), verification       │
│  │   │   ├── calendar.js     → Calendar CRUD + reminders            │
│  │   │   ├── analytics.js    → Dashboard metrics, activity          │
│  │   │   └── notifications.js→ CRUD + mark read + broadcast        │
│  │   │                                                               │
│  │   ├── services/                                                   │
│  │   │   └── sarvam.js       → Sarvam AI client (chat, STT, TTS)  │
│  │   │                                                               │
│  │   └── utils/              → Utility functions                    │
│  │                                                                   │
│  └── test/                                                           │
│      └── health.test.js      → Health endpoint test                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supabase & Public

```
┌─────────────────────────────────────────────────────────────────────┐
│  supabase/                                                           │
│  ├── config.toml             → Supabase project config              │
│  ├── functions/              → Edge functions (if any)              │
│  └── migrations/                                                     │
│      └── 20260306*_*.sql     → Initial schema migration             │
│          • app_role enum                                             │
│          • profiles table                                            │
│          • user_roles table                                          │
│          • RLS policies                                              │
│          • handle_new_user trigger                                   │
│          • has_role() function                                       │
│          • get_user_role() function                                  │
│                                                                       │
│  public/                                                             │
│  ├── manifest.json           → PWA app manifest                     │
│  ├── robots.txt              → SEO robots config                    │
│  └── sw.js                   → Service worker                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Documentation (docs/)

```
┌─────────────────────────────────────────────────────────────────────┐
│  docs/                                                               │
│  ├── architecture-diagram.md → System architecture overview         │
│  ├── api.md, architecture.md, database.md, ...                      │
│  ├── assets/diagrams/        → Diagram assets                       │
│  └── startup-docs/           → This document set (22 files)         │
│      ├── PRD.md                                                      │
│      ├── ARCHITECTURE.md                                             │
│      ├── TECH-STACK.md                                               │
│      ├── DATABASE-SCHEMA.md                                          │
│      ├── API-DESIGN.md                                               │
│      ├── MVP-PLAN.md                                                 │
│      ├── ROADMAP.md                                                  │
│      ├── COST-OPTIMIZATION.md                                        │
│      ├── METRICS-AND-RISKS.md                                        │
│      ├── VALIDATION-PLAN.md                                          │
│      ├── SECURITY.md                                                 │
│      ├── AI-INTEGRATION.md                                           │
│      ├── VOICE-ARCHITECTURE.md                                       │
│      ├── USER-FLOWS.md                                               │
│      ├── DEPLOYMENT.md                                               │
│      ├── PERFORMANCE.md                                              │
│      ├── NOTIFICATION-SYSTEM.md                                      │
│      ├── RBAC-AND-AUTH.md                                            │
│      ├── ASSET-INDEX.md        ← This file                          │
│      ├── AGRICULTURAL-KNOWLEDGE.md                                   │
│      └── REAL-TIME-ARCHITECTURE.md                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dependency Count Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│  PACKAGE SUMMARY                                                     │
│                                                                       │
│  Frontend (package.json):                                            │
│  ├── Dependencies:     32+ packages                                 │
│  ├── Dev Dependencies: 15+ packages                                 │
│  └── Key: React 18.3, Vite 5.4, TypeScript 5.8, Tailwind 3.4      │
│                                                                       │
│  Backend (backend/package.json):                                     │
│  ├── Dependencies:     17 packages                                  │
│  ├── Dev Dependencies: 5 packages                                   │
│  └── Key: Express 4.18, Prisma 5.7, Socket.IO 4.7, JWT             │
│                                                                       │
│  Total source files: ~150+                                           │
│  Total documentation files: 35+                                      │
│  Total Prisma models: 13                                             │
│  Total API routes: 25+                                               │
│  Total frontend pages: 36+                                           │
│  Total data files: 12                                                │
└─────────────────────────────────────────────────────────────────────┘
```
