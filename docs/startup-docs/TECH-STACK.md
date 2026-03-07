# Farm Intellect — Technology Stack

## Stack Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK OVERVIEW                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     FRONTEND                                 │    │
│  │                                                               │    │
│  │  React 18.3 + TypeScript 5.8 + Vite 5.4 (SWC compiler)     │    │
│  │  Radix UI (30+ primitives) + shadcn/ui + Tailwind CSS 3.4  │    │
│  │  TanStack Query v5 + React Router DOM 6.30                  │    │
│  │  Framer Motion 11.18 + Recharts 2.15                        │    │
│  │  React Hook Form 7.61 + Zod 3.25                            │    │
│  │  Supabase JS SDK 2.98 + Lucide Icons 0.462                 │    │
│  │                                                               │    │
│  │  Test: Vitest 4.0 + Testing Library (React + User Event)   │    │
│  │  Lint: ESLint 9.32 + TypeScript-ESLint                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     BACKEND                                  │    │
│  │                                                               │    │
│  │  Node.js + Express 4.18 (ES Modules)                        │    │
│  │  Prisma 5.7 (ORM) + SQLite → PostgreSQL                    │    │
│  │  Socket.IO 4.7 (WebSockets)                                 │    │
│  │  JWT (jsonwebtoken 9.0) + bcryptjs 2.4                      │    │
│  │  Helmet 7.1 + CORS 2.8 + Rate Limit 7.1                    │    │
│  │  express-validator 7.0 + Multer 2.1                         │    │
│  │  Winston 3.11 (logging) + UUID 9.0                          │    │
│  │  Nodemailer 8.0 + Twilio 4.19                               │    │
│  │                                                               │    │
│  │  Test: Vitest 4.0 + Supertest 7.2                           │    │
│  │  Dev: Nodemon 3.0 + cross-env 10.1                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     DATABASE / AUTH                           │    │
│  │                                                               │    │
│  │  Supabase (Auth + PostgreSQL + RLS + Edge Functions)        │    │
│  │  Prisma (SQLite dev → PostgreSQL prod)                      │    │
│  │  13 Prisma models + 3 Supabase tables                       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     AI / ML / VOICE                           │    │
│  │                                                               │    │
│  │  Sarvam AI API:                                              │    │
│  │    Chat LLM: sarvam-30b                                      │    │
│  │    STT: saaras:v3 (speech-to-text)                           │    │
│  │    TTS: bulbul:v3 (text-to-speech)                           │    │
│  │  12+ Indian languages + code-mixing                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     DEPLOYMENT / INFRA                        │    │
│  │                                                               │    │
│  │  Frontend: Vercel (free tier, CDN, auto-deploy)             │    │
│  │  Backend: Railway ($5/mo, Node.js container)                │    │
│  │  Database: Supabase (free) + SQLite (local)                 │    │
│  │  Domain: Custom domain via Vercel                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Stack Breakdown

### Frontend Dependencies (32 packages)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND DEPENDENCY MAP                            │
│                                                                       │
│  CORE FRAMEWORK                                                      │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ react           │ 18.3.1  │ UI component library             │    │
│  │ react-dom       │ 18.3.1  │ DOM rendering                    │    │
│  │ typescript      │ 5.8.3   │ Type safety                      │    │
│  │ vite            │ 5.4.19  │ Build tool + dev server          │    │
│  │ @vitejs/react-swc│ 3.11.0 │ SWC-based Fast Refresh          │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  ROUTING + STATE                                                     │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ react-router-dom│ 6.30.1  │ Client-side routing              │    │
│  │ @tanstack/query │ 5.83.0  │ Server state management          │    │
│  │ react-hook-form │ 7.61.1  │ Form state management            │    │
│  │ @hookform/resolv│ 3.10.0  │ Zod resolver for forms           │    │
│  │ zod             │ 3.25.76 │ Schema validation                │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  UI COMPONENTS (Radix UI — 30 packages)                              │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ accordion       │ 1.2.11  │ Collapsible sections             │    │
│  │ alert-dialog    │ 1.1.14  │ Confirm dialogs                  │    │
│  │ avatar          │ 1.1.10  │ User avatars                     │    │
│  │ checkbox        │ 1.3.2   │ Form checkboxes                  │    │
│  │ dialog          │ 1.1.14  │ Modal dialogs                    │    │
│  │ dropdown-menu   │ 2.1.15  │ Menu dropdowns                   │    │
│  │ label           │ 2.1.7   │ Form labels                      │    │
│  │ popover         │ 1.1.14  │ Popovers                         │    │
│  │ progress        │ 1.1.7   │ Progress bars                    │    │
│  │ scroll-area     │ 1.2.9   │ Custom scrollbars                │    │
│  │ select          │ 2.2.5   │ Select menus                     │    │
│  │ separator       │ 1.1.7   │ Visual dividers                  │    │
│  │ slider          │ 1.3.5   │ Range sliders                    │    │
│  │ switch          │ 1.2.5   │ Toggle switches                  │    │
│  │ tabs            │ 1.1.12  │ Tab panels                       │    │
│  │ toast           │ 1.2.14  │ Toast notifications              │    │
│  │ tooltip         │ 1.2.7   │ Hover tooltips                   │    │
│  │ + 13 more       │         │ (toggle, menubar, etc.)          │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  STYLING                                                             │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ tailwindcss     │ 3.4.17  │ Utility-first CSS                │    │
│  │ tailwindcss-anim│ 1.0.7   │ Animation utilities              │    │
│  │ tailwind-merge  │ 2.6.0   │ Class deduplication              │    │
│  │ class-variance  │ 0.7.1   │ Variant-based styling            │    │
│  │ clsx            │ 2.1.1   │ Conditional classes              │    │
│  │ @tailwindcss/typ│ 0.5.16  │ Prose styling                    │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  FEATURES                                                            │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ framer-motion   │ 11.18.2 │ Page transitions + animations    │    │
│  │ recharts        │ 2.15.4  │ Dashboard charts                 │    │
│  │ react-markdown  │ 10.1.0  │ Render AI markdown responses     │    │
│  │ date-fns        │ 3.6.0   │ Date formatting + manipulation   │    │
│  │ react-day-picker│ 8.10.1  │ Calendar date picker             │    │
│  │ lucide-react    │ 0.462   │ Icon library (500+ icons)        │    │
│  │ sonner          │ 1.7.4   │ Toast notifications              │    │
│  │ vaul            │ 0.9.9   │ Drawer component                 │    │
│  │ cmdk            │ 1.1.1   │ Command palette                  │    │
│  │ input-otp       │ 1.4.2   │ OTP input fields                 │    │
│  │ fabric          │ 6.7.1   │ Canvas manipulation (field map)  │    │
│  │ embla-carousel  │ 8.6.0   │ Image carousels                  │    │
│  │ react-resizable │ 2.1.9   │ Resizable panels                 │    │
│  │ next-themes     │ 0.3.0   │ Dark mode support                │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  INTEGRATIONS                                                        │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ @supabase/js    │ 2.98.0  │ Supabase client (auth + DB)      │    │
│  │ @lovable/cloud  │ 0.0.3   │ Cloud auth integration           │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Dependencies (17 packages)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND DEPENDENCY MAP                             │
│                                                                       │
│  SERVER                                                              │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ express         │ 4.18.2  │ HTTP/REST framework               │    │
│  │ socket.io       │ 4.7.4   │ Real-time WebSockets             │    │
│  │ dotenv          │ 16.3.1  │ Environment variable loading     │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  DATABASE                                                            │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ @prisma/client  │ 5.7.1   │ Auto-generated ORM client        │    │
│  │ prisma          │ 5.7.1   │ Migration + schema tooling       │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  SECURITY                                                            │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ helmet          │ 7.1.0   │ Security HTTP headers             │    │
│  │ cors            │ 2.8.5   │ Cross-origin control             │    │
│  │ express-rate-lim│ 7.1.5   │ Rate limiting (4 tiers)          │    │
│  │ jsonwebtoken    │ 9.0.2   │ JWT generation + verification    │    │
│  │ bcryptjs        │ 2.4.3   │ Password hashing (12 rounds)     │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  VALIDATION + FILES                                                  │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ express-validat │ 7.0.1   │ Request body/query validation    │    │
│  │ multer          │ 2.1.1   │ File upload handling             │    │
│  │ uuid            │ 9.0.1   │ UUID generation                  │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  COMMUNICATIONS                                                      │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ nodemailer      │ 8.0.1   │ Email sending (SMTP)             │    │
│  │ twilio          │ 4.19.0  │ SMS + WhatsApp                   │    │
│  │ @supabase/js    │ 2.57.4  │ Supabase server-side client      │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
│                                                                       │
│  LOGGING                                                             │
│  ┌─────────────────┬─────────┬─────────────────────────────────┐    │
│  │ winston         │ 3.11.0  │ Structured logging               │    │
│  └─────────────────┴─────────┴─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Comparison Matrix

```
┌─────────────────────────────────────────────────────────────────────┐
│              WHY WE CHOSE WHAT WE CHOSE                              │
│                                                                       │
│  FRONTEND FRAMEWORK                                                  │
│  ┌──────────┬──────────┬───────────┬────────────────────────────┐   │
│  │ Option   │ Chosen?  │ Score     │ Why / Why Not              │   │
│  ├──────────┼──────────┼───────────┼────────────────────────────┤   │
│  │ React    │ ✅ YES   │ ★★★★★    │ Largest ecosystem, team    │   │
│  │          │          │           │ expertise, Radix + shadcn  │   │
│  │ Next.js  │ ❌ NO    │ ★★★★     │ SSR not needed for SPA,   │   │
│  │          │          │           │ adds complexity            │   │
│  │ Vue      │ ❌ NO    │ ★★★      │ Smaller component library  │   │
│  │ Svelte   │ ❌ NO    │ ★★★      │ Limited team experience    │   │
│  └──────────┴──────────┴───────────┴────────────────────────────┘   │
│                                                                       │
│  BACKEND FRAMEWORK                                                   │
│  ┌──────────┬──────────┬───────────┬────────────────────────────┐   │
│  │ Express  │ ✅ YES   │ ★★★★★    │ Mature, huge middleware    │   │
│  │          │          │           │ ecosystem, easy Socket.IO  │   │
│  │ FastAPI  │ ❌ NO    │ ★★★★     │ Python, but team is JS     │   │
│  │ Fastify  │ ❌ NO    │ ★★★★     │ Good but less middleware   │   │
│  │ NestJS   │ ❌ NO    │ ★★★      │ Over-engineered for MVP    │   │
│  └──────────┴──────────┴───────────┴────────────────────────────┘   │
│                                                                       │
│  DATABASE                                                            │
│  ┌──────────┬──────────┬───────────┬────────────────────────────┐   │
│  │ PostgreSQL│ ✅ YES  │ ★★★★★    │ Via Supabase + Prisma      │   │
│  │ SQLite   │ ✅ DEV   │ ★★★★     │ Zero-config dev, Prisma    │   │
│  │ MongoDB  │ ❌ NO    │ ★★★      │ No advantage for structured│   │
│  │ MySQL    │ ❌ NO    │ ★★★      │ PostgreSQL is superset     │   │
│  └──────────┴──────────┴───────────┴────────────────────────────┘   │
│                                                                       │
│  AI PROVIDER                                                         │
│  ┌──────────┬──────────┬───────────┬────────────────────────────┐   │
│  │ Sarvam AI│ ✅ YES   │ ★★★★★    │ Indian languages native,   │   │
│  │          │          │           │ LLM + STT + TTS combined   │   │
│  │ OpenAI   │ 🔄 FALL  │ ★★★★     │ Fallback for chat only    │   │
│  │ Google AI│ ❌ NO    │ ★★★      │ Less Indian lang support   │   │
│  │ Anthropic│ ❌ NO    │ ★★★      │ No voice APIs             │   │
│  └──────────┴──────────┴───────────┴────────────────────────────┘   │
│                                                                       │
│  HOSTING                                                             │
│  ┌──────────┬──────────┬───────────┬────────────────────────────┐   │
│  │ Vercel   │ ✅ FE    │ ★★★★★    │ Free tier, CDN, auto-build│   │
│  │ Railway  │ ✅ BE    │ ★★★★     │ $5/mo, easy Node deploy   │   │
│  │ Supabase │ ✅ AUTH  │ ★★★★★    │ Free tier, managed PG     │   │
│  │ AWS      │ ❌ NO    │ ★★★      │ Overkill for MVP budget   │   │
│  │ Heroku   │ ❌ NO    │ ★★       │ Expensive after free tier  │   │
│  └──────────┴──────────┴───────────┴────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Build & Dev Tooling

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUILD & DEV TOOLING                                │
│                                                                       │
│  FRONTEND                                                            │
│  ┌────────────────┬──────────────────────────────────────────────┐  │
│  │ vite dev       │ Dev server with HMR (port 5173)              │  │
│  │ vite build     │ Production build with tree-shaking           │  │
│  │ vite preview   │ Preview production build locally             │  │
│  │ vitest run     │ Run all tests once                           │  │
│  │ vitest         │ Watch mode testing                           │  │
│  │ eslint .       │ Lint all TypeScript/React files              │  │
│  └────────────────┴──────────────────────────────────────────────┘  │
│                                                                       │
│  BACKEND                                                             │
│  ┌────────────────┬──────────────────────────────────────────────┐  │
│  │ npm start      │ Start production server (node src/server.js) │  │
│  │ npm run dev    │ Dev with auto-reload (nodemon)               │  │
│  │ npm test       │ Run tests (vitest + cross-env)               │  │
│  │ npm run db:    │                                               │  │
│  │   migrate      │ Run Prisma migrations                        │  │
│  │   push         │ Push schema to database                      │  │
│  │   studio       │ Open Prisma Studio (DB GUI)                  │  │
│  └────────────────┴──────────────────────────────────────────────┘  │
│                                                                       │
│  COMPILER: @vitejs/plugin-react-swc                                  │
│  → 20x faster than Babel for JSX/TSX transformation                 │
│  → Enables sub-second HMR in development                            │
│                                                                       │
│  TYPE CHECKING: TypeScript 5.8 (strict mode)                         │
│  → Frontend: tsconfig.app.json (DOM libs, React JSX)                │
│  → Backend: JavaScript with JSDoc (no TS compilation)               │
└─────────────────────────────────────────────────────────────────────┘
```
