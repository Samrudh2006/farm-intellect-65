# Farm Intellect — Database Schema

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                  ENTITY RELATIONSHIP DIAGRAM                         │
│                                                                       │
│                       ┌──────────────┐                               │
│                       │    USER      │                               │
│                       │              │                               │
│                       │  id (PK)     │                               │
│                       │  email       │                               │
│                       │  password    │                               │
│                       │  name        │                               │
│                       │  phone       │                               │
│                       │  role (ENUM) │                               │
│                       └──────┬───────┘                               │
│                              │                                       │
│          ┌───────────────────┼───────────────────┐                   │
│          │                   │                   │                   │
│     1:1  ▼              1:1  ▼              1:1  ▼                   │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐             │
│  │ FarmerProfile │ │MerchantProfile│ │ ExpertProfile │             │
│  │               │ │               │ │               │             │
│  │ farmSize      │ │ businessName  │ │ specialization│             │
│  │ cropTypes     │ │ businessType  │ │ experience    │             │
│  │ experience    │ │ yearsInBiz    │ │ rating        │             │
│  │ lat/lng       │ │ rating        │ │ consultations │             │
│  └───────────────┘ │ lat/lng       │ └───────────────┘             │
│                    └───────────────┘                                 │
│                              │                                       │
│     User has many:           │                                       │
│     ┌────────┬───────┬───────┼───────┬────────┬────────┐           │
│     ▼        ▼       ▼       ▼       ▼        ▼        ▼           │
│ ┌────────┐┌──────┐┌──────┐┌──────┐┌────────┐┌──────┐┌──────┐     │
│ │Document││OtpCod││ChatMs││Post  ││Notific ││Activi││CropCa│     │
│ │        ││e     ││g     ││      ││ation   ││ty    ││lendar│     │
│ └────────┘└──────┘└──────┘└──┬───┘└────────┘└──────┘└──────┘     │
│                               │                                     │
│                          has many                                   │
│                               ▼                                     │
│                          ┌──────────┐                               │
│                          │ Comment  │                               │
│                          └──────────┘                               │
│                                                                       │
│  Standalone:                                                         │
│  ┌────────────────┐                                                 │
│  │AIRecommendation│                                                 │
│  └────────────────┘                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Full Schema (Prisma)

### Users Table

```
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: users                                                        │
│                                                                       │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ Column           │ Type         │ Constraints                   ││
│  ├──────────────────┼──────────────┼───────────────────────────────┤│
│  │ id               │ UUID         │ PK, auto-generated            ││
│  │ email            │ VARCHAR      │ UNIQUE, NOT NULL              ││
│  │ password         │ VARCHAR      │ NOT NULL (bcrypt hash)        ││
│  │ name             │ VARCHAR      │ NOT NULL                      ││
│  │ phone            │ VARCHAR      │ nullable                      ││
│  │ location         │ VARCHAR      │ nullable                      ││
│  │ role             │ UserRole     │ ENUM: FARMER/MERCHANT/        ││
│  │                  │              │   EXPERT/ADMIN                ││
│  │ isVerified       │ BOOLEAN      │ DEFAULT false                 ││
│  │ emailVerified    │ BOOLEAN      │ DEFAULT false                 ││
│  │ phoneVerified    │ BOOLEAN      │ DEFAULT false                 ││
│  │ profileImage     │ VARCHAR      │ nullable                      ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  │ updatedAt        │ DATETIME     │ auto-updated                  ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  Relations:                                                          │
│  → documents[]       (1:N)                                          │
│  → otpCodes[]        (1:N)                                          │
│  → notifications[]   (1:N)                                          │
│  → posts[]           (1:N)                                          │
│  → comments[]        (1:N)                                          │
│  → chatMessages[]    (1:N)                                          │
│  → activities[]      (1:N)                                          │
│  → farmerProfile?    (1:1, optional)                                │
│  → merchantProfile?  (1:1, optional)                                │
│  → expertProfile?    (1:1, optional)                                │
│                                                                       │
│  Indexes: email (unique)                                             │
│  Row Count Estimate (MVP): 500-5,000                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Role Profile Tables

```
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: farmer_profiles                                              │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users, UNIQUE            ││
│  │ farmSize         │ FLOAT        │ nullable (hectares)           ││
│  │ cropTypes        │ TEXT (JSON)  │ nullable (["wheat","rice"])   ││
│  │ experience       │ INT          │ nullable (years)              ││
│  │ latitude         │ FLOAT        │ nullable                      ││
│  │ longitude        │ FLOAT        │ nullable                      ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: merchant_profiles                                            │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users, UNIQUE            ││
│  │ businessName     │ VARCHAR      │ nullable                      ││
│  │ businessType     │ VARCHAR      │ nullable                      ││
│  │ yearsInBusiness  │ INT          │ nullable                      ││
│  │ rating           │ FLOAT        │ DEFAULT 0 (0-5 scale)        ││
│  │ latitude         │ FLOAT        │ nullable                      ││
│  │ longitude        │ FLOAT        │ nullable                      ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: expert_profiles                                              │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users, UNIQUE            ││
│  │ specialization   │ VARCHAR      │ nullable                      ││
│  │ experience       │ INT          │ nullable (years)              ││
│  │ rating           │ FLOAT        │ DEFAULT 0 (0-5 scale)        ││
│  │ consultations    │ INT          │ DEFAULT 0 (count)            ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  CASCADE: All profiles cascade-delete with parent user               │
└─────────────────────────────────────────────────────────────────────┘
```

### Content Tables

```
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: posts (Forum)                                                │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ authorId         │ UUID         │ FK → users                    ││
│  │ title            │ VARCHAR      │ NOT NULL                      ││
│  │ content          │ TEXT         │ NOT NULL                      ││
│  │ category         │ VARCHAR      │ NOT NULL                      ││
│  │ tags             │ TEXT (JSON)  │ nullable (["pest","wheat"])   ││
│  │ likes            │ INT          │ DEFAULT 0                     ││
│  │ views            │ INT          │ DEFAULT 0                     ││
│  │ isApproved       │ BOOLEAN      │ DEFAULT false                 ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  │ updatedAt        │ DATETIME     │ auto-updated                  ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│  → comments[] (1:N)                                                  │
│                                                                       │
│  TABLE: comments                                                     │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ postId           │ UUID         │ FK → posts (CASCADE)          ││
│  │ authorId         │ UUID         │ FK → users (CASCADE)          ││
│  │ content          │ TEXT         │ NOT NULL                      ││
│  │ likes            │ INT          │ DEFAULT 0                     ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  │ updatedAt        │ DATETIME     │ auto-updated                  ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: chat_messages                                                │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users                    ││
│  │ message          │ TEXT         │ NOT NULL                      ││
│  │ type             │ MessageType  │ ENUM: USER/AI_ASSISTANT       ││
│  │ context          │ TEXT (JSON)  │ nullable (mode, lang, etc.)   ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: documents                                                    │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users                    ││
│  │ type             │ DocumentType │ ENUM: ID_PROOF/ADDRESS_PROOF/ ││
│  │                  │              │   LAND_RECORDS/LICENSE/OTHER  ││
│  │ fileName         │ VARCHAR      │ NOT NULL                      ││
│  │ filePath         │ VARCHAR      │ NOT NULL                      ││
│  │ originalName     │ VARCHAR      │ NOT NULL                      ││
│  │ mimeType         │ VARCHAR      │ NOT NULL                      ││
│  │ size             │ INT          │ NOT NULL (bytes)              ││
│  │ isVerified       │ BOOLEAN      │ DEFAULT false                 ││
│  │ verifiedAt       │ DATETIME     │ nullable                      ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### Operational Tables

```
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: notifications                                                │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users                    ││
│  │ title            │ VARCHAR      │ NOT NULL                      ││
│  │ message          │ TEXT         │ NOT NULL                      ││
│  │ type             │ Notification │ ENUM: INFO/WARNING/ERROR/     ││
│  │                  │ Type         │   SUCCESS/REMINDER            ││
│  │ isRead           │ BOOLEAN      │ DEFAULT false                 ││
│  │ data             │ TEXT (JSON)  │ nullable (extra context)      ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: activities                                                   │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users                    ││
│  │ action           │ VARCHAR      │ NOT NULL (e.g. "crop_added")  ││
│  │ description      │ TEXT         │ NOT NULL                      ││
│  │ entityType       │ VARCHAR      │ nullable (crop, order, etc.)  ││
│  │ entityId         │ VARCHAR      │ nullable                      ││
│  │ metadata         │ TEXT (JSON)  │ nullable                      ││
│  │ ipAddress        │ VARCHAR      │ nullable                      ││
│  │ userAgent        │ VARCHAR      │ nullable                      ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: otp_codes                                                    │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ UUID         │ FK → users                    ││
│  │ code             │ VARCHAR      │ NOT NULL                      ││
│  │ type             │ OtpType      │ ENUM: EMAIL/SMS               ││
│  │ purpose          │ VARCHAR      │ signup/login/reset/critical   ││
│  │ expiresAt        │ DATETIME     │ NOT NULL                      ││
│  │ usedAt           │ DATETIME     │ nullable                      ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: crop_calendar                                                │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ VARCHAR      │ NOT NULL                      ││
│  │ cropType         │ VARCHAR      │ NOT NULL                      ││
│  │ plantingDate     │ DATETIME     │ NOT NULL                      ││
│  │ harvestDate      │ DATETIME     │ nullable                      ││
│  │ stage            │ VARCHAR      │ NOT NULL                      ││
│  │ reminders        │ TEXT (JSON)  │ nullable                      ││
│  │ notes            │ TEXT         │ nullable                      ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  │ updatedAt        │ DATETIME     │ auto-updated                  ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: ai_recommendations                                          │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ userId           │ VARCHAR      │ NOT NULL                      ││
│  │ type             │ VARCHAR      │ crop/fertilizer/pest-control  ││
│  │ title            │ VARCHAR      │ NOT NULL                      ││
│  │ description      │ TEXT         │ NOT NULL                      ││
│  │ confidence       │ FLOAT        │ NOT NULL (0-1)                ││
│  │ data             │ TEXT (JSON)  │ nullable (structured data)    ││
│  │ isActive         │ BOOLEAN      │ DEFAULT true                  ││
│  │ createdAt        │ DATETIME     │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supabase Schema (Auth Layer)

```
┌─────────────────────────────────────────────────────────────────────┐
│           SUPABASE POSTGRESQL SCHEMA                                 │
│                                                                       │
│  ENUM: app_role                                                      │
│  VALUES: 'farmer' | 'merchant' | 'expert' | 'admin'                │
│                                                                       │
│  TABLE: auth.users (Managed by Supabase)                            │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK                            ││
│  │ email            │ VARCHAR      │ UNIQUE                        ││
│  │ encrypted_pass   │ VARCHAR      │ bcrypt hash                   ││
│  │ raw_user_meta    │ JSONB        │ {display_name, role, phone}   ││
│  │ email_confirmed  │ TIMESTAMPTZ  │ nullable                      ││
│  │ phone_confirmed  │ TIMESTAMPTZ  │ nullable                      ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│                                                                       │
│  TABLE: public.profiles                                              │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK, auto-gen                  ││
│  │ user_id          │ UUID         │ FK → auth.users, UNIQUE       ││
│  │ display_name     │ TEXT         │ DEFAULT ''                    ││
│  │ email            │ TEXT         │ nullable                      ││
│  │ phone            │ TEXT         │ nullable                      ││
│  │ location         │ TEXT         │ nullable                      ││
│  │ avatar_url       │ TEXT         │ nullable                      ││
│  │ created_at       │ TIMESTAMPTZ  │ DEFAULT now()                 ││
│  │ updated_at       │ TIMESTAMPTZ  │ DEFAULT now()                 ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│  RLS Policies:                                                       │
│  • SELECT: auth.uid() = user_id                                     │
│  • UPDATE: auth.uid() = user_id                                     │
│  • INSERT: auth.uid() = user_id                                     │
│                                                                       │
│  TABLE: public.user_roles                                            │
│  ┌──────────────────┬──────────────┬───────────────────────────────┐│
│  │ id               │ UUID         │ PK, auto-gen                  ││
│  │ user_id          │ UUID         │ FK → auth.users               ││
│  │ role             │ app_role     │ NOT NULL                      ││
│  │                  │              │ UNIQUE(user_id, role)         ││
│  └──────────────────┴──────────────┴───────────────────────────────┘│
│  RLS Policies:                                                       │
│  • SELECT: auth.uid() = user_id                                     │
│  • INSERT: auth.uid() = user_id                                     │
│                                                                       │
│  FUNCTIONS:                                                          │
│  • has_role(user_id, role) → BOOLEAN (SECURITY DEFINER)             │
│  • get_user_role(user_id) → app_role (SECURITY DEFINER)             │
│                                                                       │
│  TRIGGER: handle_new_user()                                          │
│  ON: auth.users AFTER INSERT                                        │
│  ACTION: Auto-create profile + assign role from metadata            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Enum Definitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ENUM DEFINITIONS                                   │
│                                                                       │
│  UserRole          │ FARMER │ MERCHANT │ EXPERT │ ADMIN             │
│  DocumentType      │ ID_PROOF │ ADDRESS_PROOF │ LAND_RECORDS │      │
│                    │ BUSINESS_LICENSE │ OTHER                        │
│  OtpType           │ EMAIL │ SMS                                    │
│  NotificationType  │ INFO │ WARNING │ ERROR │ SUCCESS │ REMINDER    │
│  MessageType       │ USER │ AI_ASSISTANT                             │
│  app_role (Supa)   │ farmer │ merchant │ expert │ admin             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Volume Estimates (MVP)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA VOLUME ESTIMATES                              │
│                                                                       │
│  ┌──────────────────┬───────────┬──────────┬───────────────────┐    │
│  │ Table            │ Rows/User │ 500 Users│ Avg Row Size      │    │
│  ├──────────────────┼───────────┼──────────┼───────────────────┤    │
│  │ users            │ 1         │ 500      │ ~500 bytes        │    │
│  │ farmer_profiles  │ 0.7       │ 350      │ ~200 bytes        │    │
│  │ merchant_profiles│ 0.15      │ 75       │ ~200 bytes        │    │
│  │ expert_profiles  │ 0.1       │ 50       │ ~150 bytes        │    │
│  │ chat_messages    │ 50/mo     │ 25,000   │ ~500 bytes        │    │
│  │ posts            │ 2/mo      │ 1,000    │ ~2 KB             │    │
│  │ comments         │ 5/mo      │ 2,500    │ ~300 bytes        │    │
│  │ notifications    │ 10/mo     │ 5,000    │ ~400 bytes        │    │
│  │ activities       │ 20/mo     │ 10,000   │ ~500 bytes        │    │
│  │ documents        │ 2         │ 1,000    │ ~300 bytes (meta) │    │
│  │ crop_calendar    │ 5         │ 2,500    │ ~400 bytes        │    │
│  │ ai_recommendations│ 3        │ 1,500    │ ~1 KB             │    │
│  │ otp_codes        │ 3         │ 1,500    │ ~200 bytes        │    │
│  └──────────────────┴───────────┴──────────┴───────────────────┘    │
│                                                                       │
│  Total estimated DB size (500 users, 3 months): ~25 MB              │
│  File storage (documents): ~5 GB                                     │
│  Well within SQLite limits (281 TB max) and Supabase free tier      │
└─────────────────────────────────────────────────────────────────────┘
```
