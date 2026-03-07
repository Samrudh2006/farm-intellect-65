# Farm Intellect — Performance Optimization

## Performance Budget

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE TARGETS                                │
│                                                                       │
│  ┌──────────────────────────────┬──────────┬───────────────────────┐│
│  │ Metric                       │ Target   │ Condition              ││
│  ├──────────────────────────────┼──────────┼───────────────────────┤│
│  │ First Contentful Paint (FCP) │ < 2.0s   │ 4G India              ││
│  │ Largest Contentful Paint     │ < 3.5s   │ 4G India              ││
│  │ Time to Interactive (TTI)    │ < 4.0s   │ 4G India              ││
│  │ Initial Bundle Size          │ < 200KB  │ gzipped               ││
│  │ Total Page Weight            │ < 500KB  │ first load, gzipped   ││
│  │ API Response (non-AI)        │ < 500ms  │ p95                   ││
│  │ AI Chat Response             │ < 3s     │ p95                   ││
│  │ Voice STT Latency            │ < 2s     │ 10s audio clip        ││
│  │ Lighthouse Performance       │ ≥ 80     │ mobile, 3G throttle   ││
│  │ Lighthouse Accessibility     │ ≥ 90     │ all pages             ││
│  │ PWA Score                    │ ≥ 80     │ Lighthouse            ││
│  │ Concurrent Users             │ ≥ 100    │ no degradation        ││
│  └──────────────────────────────┴──────────┴───────────────────────┘│
│                                                                       │
│  TARGET NETWORK: 3G/4G rural India (1-10 Mbps, 100-300ms RTT)      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  CODE SPLITTING & LAZY LOADING                                       │
│                                                                       │
│  Current implementation: 36 lazy-loaded pages via React.lazy()      │
│                                                                       │
│  // App.tsx pattern:                                                 │
│  const Dashboard = lazy(() => import('./pages/Dashboard'));          │
│  const Chat = lazy(() => import('./pages/Chat'));                    │
│  const AICropScanner = lazy(() => import('./pages/AICropScanner')); │
│  // ... 33 more pages                                                │
│                                                                       │
│  IMPACT:                                                             │
│  ┌────────────────────────┬──────────┬──────────────────────────┐   │
│  │ Optimization           │ Savings  │ How                       │   │
│  ├────────────────────────┼──────────┼──────────────────────────┤   │
│  │ Lazy loading (36 pg)   │ ~70%     │ React.lazy() + Suspense  │   │
│  │ Tree shaking           │ ~20%     │ Vite ESM build           │   │
│  │ Vendor chunk split     │ ~15%     │ Vite rollup config       │   │
│  │ Radix UI tree-shake    │ ~10%     │ Individual imports        │   │
│  │ Unused CSS removal     │ ~5%      │ Tailwind purge (JIT)     │   │
│  └────────────────────────┴──────────┴──────────────────────────┘   │
│                                                                       │
│  BUILD TOOL: Vite 5.4 with SWC (Speedy Web Compiler)               │
│  ├── 10x faster builds than Webpack                                 │
│  ├── Native ES modules in dev (no bundling step)                    │
│  ├── Rollup-based production builds with optimizations              │
│  └── Automatic CSS code-splitting                                    │
├─────────────────────────────────────────────────────────────────────┤
│  CACHING STRATEGY (TanStack Query v5)                                │
│                                                                       │
│  ┌──────────────────────┬──────────────┬────────────────────────┐   │
│  │ Query Key            │ Stale Time   │ Cache Time              │   │
│  ├──────────────────────┼──────────────┼────────────────────────┤   │
│  │ ['profile']          │ 5 min        │ 30 min                  │   │
│  │ ['chat', 'messages'] │ 30 sec       │ 5 min                   │   │
│  │ ['forum', 'posts']   │ 2 min        │ 10 min                  │   │
│  │ ['calendar']         │ 5 min        │ 30 min                  │   │
│  │ ['notifications']    │ 30 sec       │ 5 min                   │   │
│  │ ['analytics']        │ 5 min        │ 15 min                  │   │
│  │ ['mandi-prices']     │ 10 min       │ 60 min                  │   │
│  │ ['crops']            │ 24 hours     │ 7 days (static data)    │   │
│  └──────────────────────┴──────────────┴────────────────────────┘   │
│                                                                       │
│  The 12 curated data files (cropsData.ts, etc.) are bundled         │
│  in the frontend — ZERO API calls for static agricultural data.     │
├─────────────────────────────────────────────────────────────────────┤
│  ASSET OPTIMIZATION                                                  │
│                                                                       │
│  Images:                                                             │
│  ├── WebP format for crop images (60%+ smaller than PNG)            │
│  ├── Lazy loading with loading="lazy" attribute                     │
│  ├── Responsive srcset for different screen sizes                   │
│  └── SVG for icons (Lucide React, tree-shakeable)                   │
│                                                                       │
│  Fonts:                                                              │
│  ├── System font stack (no web font download)                       │
│  └── Noto Sans for Indic scripts (loaded on demand)                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Backend Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  DATABASE PERFORMANCE                                                │
│                                                                       │
│  SQLite Advantages (MVP):                                            │
│  ├── Zero network latency (embedded database)                       │
│  ├── Read queries: < 1ms (local disk I/O)                           │
│  ├── Single writer (no connection pool overhead)                    │
│  └── RAM-based temp storage for queries                              │
│                                                                       │
│  Prisma Query Optimization:                                          │
│  ├── Use select: {} to fetch only needed fields                     │
│  ├── Use include: {} for eager loading (avoid N+1)                  │
│  ├── Pagination with skip + take on all list endpoints              │
│  ├── Index on: userId, email, role, createdAt                       │
│  └── Batch operations with createMany, updateMany                   │
│                                                                       │
│  Example Optimized Query:                                            │
│  prisma.post.findMany({                                              │
│    where: { isApproved: true },                                     │
│    select: { id: true, title: true, author: { select: { name: true }│
│    }},                                                               │
│    orderBy: { createdAt: 'desc' },                                  │
│    skip: 0, take: 20                                                │
│  })                                                                  │
├─────────────────────────────────────────────────────────────────────┤
│  API RESPONSE OPTIMIZATION                                           │
│                                                                       │
│  ├── JSON response compression (express compression middleware)     │
│  ├── Selective field return (no full objects when unnecessary)       │
│  ├── Pagination on all list endpoints (default: 20 items)           │
│  ├── Efficient error handling (fail fast, don't log full stacks)    │
│  └── Connection keep-alive for Socket.IO                             │
├─────────────────────────────────────────────────────────────────────┤
│  AI RESPONSE OPTIMIZATION                                            │
│                                                                       │
│  ├── max_tokens: 700 (caps response size and cost)                  │
│  ├── temperature: 0.3 (deterministic → cacheable responses)         │
│  ├── System prompt: ~150 tokens (minimal overhead)                  │
│  ├── Rate limit: 40 AI calls/15 min (prevents abuse)               │
│  └── Graceful fallback to curated data if API slow (timeout 10s)   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PWA & Offline Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROGRESSIVE WEB APP (PWA)                                           │
│                                                                       │
│  FILES:                                                              │
│  ├── public/manifest.json → App metadata + icons                    │
│  ├── public/sw.js         → Service worker                         │
│  └── public/robots.txt    → SEO configuration                      │
│                                                                       │
│  SERVICE WORKER STRATEGY:                                            │
│  ┌──────────────────┬────────────────────────────────────────────┐  │
│  │ Asset Type       │ Cache Strategy                              │  │
│  ├──────────────────┼────────────────────────────────────────────┤  │
│  │ App shell (HTML) │ Cache-first, network fallback              │  │
│  │ JS/CSS bundles   │ Cache-first (hashed filenames)             │  │
│  │ Crop images      │ Cache-first, update in background          │  │
│  │ API responses    │ Network-first, cache fallback              │  │
│  │ AI responses     │ Network-only (always fresh)                │  │
│  │ Static data      │ Cache-first (cropsData, diseases, etc.)   │  │
│  └──────────────────┴────────────────────────────────────────────┘  │
│                                                                       │
│  OFFLINE CAPABILITIES:                                               │
│  ├── ✅ Browse crop library (60+ crops, bundled data)               │
│  ├── ✅ View disease database (50+ entries, bundled)                │
│  ├── ✅ Check cached mandi prices                                   │
│  ├── ✅ Read crop calendar (1500+ activities, bundled)              │
│  ├── ✅ View cached forum posts                                     │
│  ├── ❌ AI chat (requires network)                                  │
│  ├── ❌ Voice I/O (requires Sarvam API)                             │
│  ├── ❌ Real-time notifications (requires Socket.IO)                │
│  └── ❌ Document upload (requires backend)                          │
│                                                                       │
│  INSTALL PROMPT:                                                     │
│  Show "Add to Home Screen" banner after 2nd visit                   │
│  (using hooks/usePwaStatus.ts to detect installability)             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────────┐
│  MONITORING STACK                                                    │
│                                                                       │
│  ┌──────────────────┬─────────────────────────────────────────────┐ │
│  │ Tool             │ Purpose                                      │ │
│  ├──────────────────┼─────────────────────────────────────────────┤ │
│  │ Vercel Analytics │ Frontend: Web Vitals, page views, errors    │ │
│  │ Railway Metrics  │ Backend: CPU, RAM, requests, response time  │ │
│  │ Supabase Dash    │ Auth: signups, active sessions, DB size     │ │
│  │ Winston Logs     │ Backend: structured logs on Railway disk    │ │
│  │ Activity Model   │ App: user activity tracking (10+ types)     │ │
│  │ /health endpoint │ Uptime: simple ping + timestamp             │ │
│  └──────────────────┴─────────────────────────────────────────────┘ │
│                                                                       │
│  All monitoring is FREE at MVP scale. No paid APM needed.           │
└─────────────────────────────────────────────────────────────────────┘
```
