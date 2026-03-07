# Farm Intellect — API Design

## API Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    API ARCHITECTURE                                   │
│                                                                       │
│  Base URL: https://api.farmintelect.in/api  (production)            │
│            http://localhost:3001/api          (development)          │
│                                                                       │
│  Protocol: REST over HTTPS                                           │
│  Format: JSON (application/json)                                     │
│  Auth: Bearer JWT in Authorization header                            │
│  Rate Limits: 4-tier (general, auth, AI, chat)                      │
│                                                                       │
│  ROUTE MODULES (9 files):                                            │
│  ┌──────────────────┬──────────────────────────────────────────┐    │
│  │ /api/auth/*      │ Authentication + OTP verification        │    │
│  │ /api/users/*     │ Profile management + farmer listings     │    │
│  │ /api/ai/*        │ AI advisory + disease + yield            │    │
│  │ /api/chat/*      │ Chat messages + voice STT/TTS            │    │
│  │ /api/forum/*     │ Forum posts + comments + moderation      │    │
│  │ /api/documents/* │ Document upload + verification           │    │
│  │ /api/calendar/*  │ Crop calendar CRUD                       │    │
│  │ /api/analytics/* │ Dashboard metrics + activity history     │    │
│  │ /api/notif/*     │ Notifications + mark read                │    │
│  └──────────────────┴──────────────────────────────────────────┘    │
│                                                                       │
│  MIDDLEWARE PIPELINE:                                                 │
│  Request → Helmet → CORS → RateLimit → JSON → Route                │
│  Route → authenticate() → authorize() → handler → errorHandler()    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  POST /api/auth/signup                                               │
│  Rate Limit: 20/15min                                                │
│                                                                       │
│  Request:                                                            │
│  {                                                                   │
│    "email": "farmer@example.com",                                   │
│    "password": "SecurePass123!",                                    │
│    "name": "Gurpreet Singh",                                        │
│    "phone": "+919876543210",                                        │
│    "role": "FARMER",                                                │
│    "location": "Punjab"                                             │
│  }                                                                   │
│                                                                       │
│  Response (201):                                                     │
│  {                                                                   │
│    "message": "User registered. OTP sent.",                         │
│    "token": "eyJhbGciOiJIUzI1NiI...",                              │
│    "user": {                                                        │
│      "id": "uuid",                                                  │
│      "email": "farmer@example.com",                                 │
│      "name": "Gurpreet Singh",                                      │
│      "role": "FARMER"                                               │
│    }                                                                 │
│  }                                                                   │
│                                                                       │
│  Errors: 400 (validation) │ 409 (email exists) │ 500 (server)      │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/auth/login                                                │
│  Rate Limit: 20/15min                                                │
│                                                                       │
│  Request: { "email": "...", "password": "..." }                     │
│  Response (200): { "token": "...", "user": {...} }                  │
│  2FA: Admin/Expert → OTP sent, requires /verify-otp                 │
│  Errors: 401 (invalid creds) │ 403 (unverified)                    │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/auth/verify-otp                                           │
│  Request: { "userId": "...", "code": "123456", "purpose": "login" } │
│  Response (200): { "message": "OTP verified" }                      │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/auth/resend-otp                                           │
│  Request: { "userId": "...", "type": "EMAIL" }                      │
│  Response (200): { "message": "OTP resent" }                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  GET /api/users/profile                                              │
│  Auth: Bearer JWT (any role)                                        │
│                                                                       │
│  Response (200):                                                     │
│  {                                                                   │
│    "id": "uuid",                                                    │
│    "email": "...", "name": "...", "phone": "...",                   │
│    "role": "FARMER",                                                │
│    "location": "Punjab",                                            │
│    "isVerified": true,                                              │
│    "farmerProfile": {                                               │
│      "farmSize": 5.0,                                               │
│      "cropTypes": ["wheat", "rice"],                                │
│      "experience": 8                                                │
│    }                                                                 │
│  }                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  PATCH /api/users/profile                                            │
│  Auth: Bearer JWT (any role)                                        │
│                                                                       │
│  Request: { "name": "...", "phone": "...", "location": "..." }      │
│  Response (200): { "message": "Profile updated", "user": {...} }    │
├─────────────────────────────────────────────────────────────────────┤
│  GET /api/users/farmers                                              │
│  Auth: MERCHANT │ EXPERT │ ADMIN                                    │
│                                                                       │
│  Query: ?location=Punjab&page=1&limit=20                            │
│  Response (200):                                                     │
│  {                                                                   │
│    "farmers": [{ "id": "...", "name": "...", "location": "..." }],  │
│    "total": 150,                                                    │
│    "page": 1                                                        │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI & Advisory Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  POST /api/ai/recommend-crops                                        │
│  Auth: Bearer JWT │ Rate Limit: 40/15min                            │
│                                                                       │
│  Request:                                                            │
│  {                                                                   │
│    "location": "Punjab",                                            │
│    "soilType": "alluvial",                                          │
│    "season": "rabi",                                                │
│    "farmSize": 5,                                                   │
│    "experience": "intermediate"                                     │
│  }                                                                   │
│                                                                       │
│  Response (200):                                                     │
│  {                                                                   │
│    "recommendations": [                                              │
│      {                                                               │
│        "crop": "Wheat (HD-3086)",                                   │
│        "confidence": 0.92,                                          │
│        "reasoning": "Ideal for alluvial soil in Punjab rabi...",    │
│        "expectedYield": "4.5 tonnes/hectare",                       │
│        "marketPrice": "₹2,275/quintal (MSP)"                       │
│      }                                                               │
│    ]                                                                 │
│  }                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/ai/detect-disease                                         │
│  Auth: Bearer JWT │ Content-Type: multipart/form-data               │
│                                                                       │
│  Request: FormData { image: File, cropType?: "rice" }               │
│  Response (200):                                                     │
│  {                                                                   │
│    "disease": "Brown Spot",                                         │
│    "confidence": 0.87,                                              │
│    "severity": "moderate",                                          │
│    "treatment": {                                                   │
│      "chemical": "Mancozeb 75% WP @ 2g/L",                         │
│      "organic": "Neem oil spray...",                                │
│      "cultural": "Improve drainage..."                              │
│    },                                                                │
│    "prevention": "Use resistant varieties..."                       │
│  }                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  GET /api/ai/suggestions                                             │
│  Auth: Bearer JWT                                                    │
│  Response: { "suggestions": [...] }                                  │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/ai/predict-yield                                          │
│  Auth: Bearer JWT                                                    │
│  Request: { cropType, farmSize, soilQuality, irrigation, weather }  │
│  Response: { predicted_yield, confidence, risk_factors }            │
├─────────────────────────────────────────────────────────────────────┤
│  GET /api/ai/preventive-tips                                         │
│  Auth: EXPERT only                                                   │
│  Response: { tips: [...] }                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Chat & Voice Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  GET /api/chat/messages                                              │
│  Auth: Bearer JWT │ Query: ?limit=12                                │
│                                                                       │
│  Response (200):                                                     │
│  {                                                                   │
│    "messages": [                                                    │
│      {                                                               │
│        "id": "uuid",                                                │
│        "message": "What crops should I plant?",                     │
│        "type": "USER",                                              │
│        "createdAt": "2026-03-07T10:00:00Z"                         │
│      },                                                              │
│      {                                                               │
│        "id": "uuid",                                                │
│        "message": "Based on your location in Punjab...",            │
│        "type": "AI_ASSISTANT",                                      │
│        "context": { "mode": "recommendation", "language": "hi" },  │
│        "createdAt": "2026-03-07T10:00:02Z"                         │
│      }                                                               │
│    ]                                                                 │
│  }                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/chat/message                                              │
│  Auth: Bearer JWT │ Rate Limit: 60/5min                             │
│                                                                       │
│  Request:                                                            │
│  {                                                                   │
│    "message": "मेरी गेहूँ की फसल में पत्ते पीले हो रहे हैं",      │
│    "mode": "disease",                                               │
│    "language": "hi"                                                  │
│  }                                                                   │
│                                                                       │
│  Response (200):                                                     │
│  {                                                                   │
│    "response": "यह पीला रंग नाइट्रोजन की कमी...",                  │
│    "mode": "disease",                                               │
│    "messageId": "uuid"                                              │
│  }                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/chat/voice/transcribe                                     │
│  Auth: Bearer JWT │ Content-Type: multipart/form-data               │
│                                                                       │
│  Request: FormData { audio: File, language: "pa", mode: "transcribe"}│
│  Response (200): { "text": "ਮੇਰੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ..." }          │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/chat/voice/speak                                          │
│  Auth: Bearer JWT                                                    │
│                                                                       │
│  Request: { "text": "...", "language": "pa", "speaker": "meera" }   │
│  Response (200): { "audio": "base64-encoded-audio-data" }           │
├─────────────────────────────────────────────────────────────────────┤
│  DELETE /api/chat/messages                                           │
│  Auth: Bearer JWT                                                    │
│  Response (200): { "message": "Chat history cleared" }               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Forum Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  GET /api/forum/posts                                                │
│  Auth: Bearer JWT                                                    │
│  Query: ?page=1&limit=20&category=pest-control&search=wheat         │
│                                                                       │
│  Response (200):                                                     │
│  {                                                                   │
│    "posts": [                                                       │
│      {                                                               │
│        "id": "uuid",                                                │
│        "title": "Best pesticide for wheat aphids?",                 │
│        "content": "...",                                            │
│        "category": "pest-control",                                  │
│        "tags": ["wheat", "aphids", "punjab"],                       │
│        "author": { "name": "...", "role": "FARMER" },               │
│        "likes": 12, "views": 45, "commentCount": 3,                │
│        "isApproved": true,                                          │
│        "createdAt": "..."                                           │
│      }                                                               │
│    ],                                                                │
│    "total": 85, "page": 1                                           │
│  }                                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  POST /api/forum/posts                                               │
│  Auth: Bearer JWT                                                    │
│  Note: Auto-approved for EXPERT and ADMIN roles                     │
│                                                                       │
│  Request: { title, content, category, tags }                        │
│  Response (201): { "post": {...}, "message": "Post created" }       │
├─────────────────────────────────────────────────────────────────────┤
│  GET  /api/forum/posts/:id          → Post + comments               │
│  POST /api/forum/posts/:id/comments → Add comment                   │
│  PATCH /api/forum/posts/:id         → Update post (author only)     │
│  DELETE /api/forum/posts/:id        → Delete post (author/admin)    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Document, Calendar, Analytics, Notification Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  DOCUMENTS                                                           │
│  POST   /api/documents/upload    → Upload file (Multer, 10MB max)   │
│  DELETE /api/documents/:id       → Delete document (owner only)     │
│  Allowed: PDF, DOC, DOCX, JPG, PNG (ID_PROOF, LAND_RECORDS, etc.)  │
├─────────────────────────────────────────────────────────────────────┤
│  CALENDAR                                                            │
│  GET    /api/calendar            → List entries (?cropType, ?stage) │
│  POST   /api/calendar            → Create entry + reminders        │
│  PATCH  /api/calendar/:id        → Update entry                    │
│  DELETE /api/calendar/:id        → Delete entry                    │
├─────────────────────────────────────────────────────────────────────┤
│  ANALYTICS                                                           │
│  GET    /api/analytics/dashboard → Role-based metrics (7d/30d/90d) │
│  GET    /api/analytics/activity  → User activity history (paginated)│
├─────────────────────────────────────────────────────────────────────┤
│  NOTIFICATIONS                                                       │
│  GET    /api/notifications       → List + unread count (?page)     │
│  PATCH  /api/notifications/:id/read  → Mark as read                │
│  PATCH  /api/notifications/mark-all-read → Mark all as read        │
│  POST   /api/notifications       → Create (ADMIN only)             │
├─────────────────────────────────────────────────────────────────────┤
│  HEALTH                                                              │
│  GET    /health                  → { status: "OK", timestamp }     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Error Response Format

```
┌─────────────────────────────────────────────────────────────────────┐
│  STANDARD ERROR FORMAT                                               │
│                                                                       │
│  {                                                                   │
│    "error": "Human-readable error message",                         │
│    "code": "VALIDATION_ERROR",      // optional error code          │
│    "details": [                      // optional field errors        │
│      { "field": "email", "message": "Invalid email format" }       │
│    ]                                                                 │
│  }                                                                   │
│                                                                       │
│  STATUS CODES:                                                       │
│  ┌──────┬──────────────────────────────────────────────────────┐    │
│  │ 200  │ Success                                               │    │
│  │ 201  │ Created (signup, post creation)                       │    │
│  │ 400  │ Bad Request (validation failure)                      │    │
│  │ 401  │ Unauthorized (missing/invalid token)                  │    │
│  │ 403  │ Forbidden (insufficient role)                         │    │
│  │ 404  │ Not Found                                             │    │
│  │ 409  │ Conflict (duplicate email, etc.)                      │    │
│  │ 429  │ Too Many Requests (rate limited)                      │    │
│  │ 500  │ Internal Server Error                                 │    │
│  └──────┴──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```
