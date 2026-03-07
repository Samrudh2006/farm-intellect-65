# Farm Intellect — Notification System

## Notification Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  NOTIFICATION SOURCES                         │   │
│  │                                                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │   │
│  │  │ Forum    │ │ AI Chat  │ │ Calendar │ │ Admin        │   │   │
│  │  │ Activity │ │ Advice   │ │ Reminder │ │ Broadcast    │   │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘   │   │
│  │       │             │             │              │            │   │
│  │       └─────────────┴─────────────┴──────────────┘            │   │
│  │                          │                                    │   │
│  │               ┌──────────┴──────────┐                        │   │
│  │               │ Notification Service│                        │   │
│  │               │ (Backend)           │                        │   │
│  │               └──────────┬──────────┘                        │   │
│  │                          │                                    │   │
│  │       ┌──────────────────┼──────────────────┐                │   │
│  │       │                  │                  │                │   │
│  │  ┌────┴─────┐  ┌────────┴────────┐  ┌─────┴──────┐        │   │
│  │  │ In-App   │  │ Socket.IO       │  │ Push       │        │   │
│  │  │ (DB)     │  │ (Real-time)     │  │ (PWA/FCM)  │        │   │
│  │  └──────────┘  └─────────────────┘  └────────────┘        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Notification Data Model

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRISMA MODEL: Notification                                          │
│                                                                       │
│  model Notification {                                                │
│    id        String             @id @default(uuid())                │
│    userId    String             // Recipient                        │
│    title     String             // Notification heading             │
│    message   String             // Notification body                │
│    type      NotificationType   // Category enum                    │
│    isRead    Boolean            @default(false)                     │
│    metadata  Json?              // Extra context (postId, etc.)     │
│    createdAt DateTime           @default(now())                     │
│    user      User               @relation(...)                      │
│  }                                                                   │
│                                                                       │
│  enum NotificationType {                                             │
│    SYSTEM         // Platform updates, maintenance                  │
│    FORUM          // Post replies, likes, mentions                  │
│    CALENDAR       // Crop activity reminders                        │
│    AI_ADVISORY    // AI-generated alerts                            │
│    DOCUMENT       // Document verification status                   │
│    MARKET         // Mandi price alerts                             │
│    WEATHER        // Weather warnings                               │
│    ADMIN          // Admin broadcasts                               │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Notification Types & Triggers

```
┌─────────────────────────────────────────────────────────────────────┐
│  NOTIFICATION TRIGGER MAP                                            │
│                                                                       │
│  ┌──────────────────┬─────────────────────┬────────────────────┐    │
│  │ Event            │ Notification         │ Recipients          │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Forum reply      │ "New reply on your  │ Post author         │    │
│  │ on user's post   │  post: {title}"     │                    │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Expert verifies  │ "Expert verified    │ Post author         │    │
│  │ forum answer     │  answer on: {title}"│                    │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Calendar event   │ "Tomorrow: {crop}   │ Event creator       │    │
│  │ due tomorrow     │  - {activity}"      │                    │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Seasonal change  │ "Rabi season starts │ All farmers in      │    │
│  │ (Oct/Jun)        │  - time to plan!"   │ region             │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Disease outbreak │ "Alert: {disease}   │ Farmers growing     │    │
│  │ detected         │  detected in {area}"│ affected crop      │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Document         │ "Your {doc_type}    │ Document owner      │    │
│  │ verified         │  has been verified" │                    │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Mandi price      │ "Wheat price up 5%  │ Farmers with wheat  │    │
│  │ spike            │  at Ludhiana mandi" │ in profile         │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ Admin broadcast  │ "{custom message}"  │ All users / by role │    │
│  ├──────────────────┼─────────────────────┼────────────────────┤    │
│  │ New user signup  │ "Welcome to Farm    │ New user            │    │
│  │                  │  Intellect!"        │                    │    │
│  └──────────────────┴─────────────────────┴────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

```
┌─────────────────────────────────────────────────────────────────────┐
│  NOTIFICATION API                                                    │
│                                                                       │
│  GET /api/notifications                                              │
│  Auth: Bearer JWT (any role)                                        │
│  Query: ?page=1&limit=20                                            │
│  Response:                                                           │
│  {                                                                   │
│    "notifications": [                                               │
│      {                                                               │
│        "id": "uuid",                                                │
│        "title": "New reply on your post",                           │
│        "message": "Expert answered your question about...",         │
│        "type": "FORUM",                                             │
│        "isRead": false,                                             │
│        "metadata": { "postId": "uuid" },                            │
│        "createdAt": "2026-03-07T..."                                │
│      }                                                               │
│    ],                                                                │
│    "unreadCount": 5,                                                │
│    "total": 42                                                      │
│  }                                                                   │
│                                                                       │
│  PATCH /api/notifications/:id/read                                   │
│  → Marks single notification as read                                │
│                                                                       │
│  PATCH /api/notifications/mark-all-read                              │
│  → Marks all user's notifications as read                           │
│                                                                       │
│  POST /api/notifications (ADMIN only)                                │
│  → Create broadcast notification { title, message, type, targetRole}│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Real-Time Delivery (Socket.IO)

```
┌─────────────────────────────────────────────────────────────────────┐
│  SOCKET.IO NOTIFICATION FLOW                                         │
│                                                                       │
│  Backend creates notification in DB                                  │
│       │                                                              │
│       ▼                                                              │
│  io.to(userId).emit('notification', {                               │
│    id: notification.id,                                              │
│    title: "...",                                                     │
│    type: "FORUM",                                                    │
│    isRead: false                                                    │
│  });                                                                 │
│       │                                                              │
│       ▼                                                              │
│  Frontend listener:                                                  │
│  socket.on('notification', (data) => {                              │
│    // Update notification badge count                               │
│    // Show toast notification (use-toast hook)                       │
│    // Add to notification list (TanStack Query invalidation)        │
│  });                                                                 │
│                                                                       │
│  UI INDICATOR:                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Navbar: [Home] [Chat] [Forum] [🔔 5] [Profile]             │   │
│  │                                       ↑                       │   │
│  │                              Red badge with unread count     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Toast appears in bottom-right for new notifications:               │
│  ┌──────────────────────────────┐                                   │
│  │ 🔔 New reply on your post   │                                   │
│  │ Expert answered your...     │                                   │
│  │ [View] [Dismiss]            │                                   │
│  └──────────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Future: Push Notifications

```
┌─────────────────────────────────────────────────────────────────────┐
│  PWA PUSH NOTIFICATIONS (Phase 2)                                    │
│                                                                       │
│  Flow:                                                               │
│  1. User installs PWA → service worker registers                    │
│  2. Request push permission → user accepts                          │
│  3. Browser creates push subscription (endpoint + keys)             │
│  4. Subscription sent to backend → stored in DB                     │
│  5. Backend event triggers → web-push library sends notification    │
│  6. Service worker receives → shows native OS notification          │
│                                                                       │
│  USE CASES:                                                          │
│  ├── Calendar reminders (day-before crop activities)                │
│  ├── Weather alerts (frost/heatwave warnings)                       │
│  ├── Mandi price spikes (sell opportunity)                          │
│  ├── Disease outbreak alerts (area-wide)                            │
│  └── Admin emergency broadcasts                                     │
│                                                                       │
│  COST: Free tier via Web Push Protocol (no Firebase needed)         │
└─────────────────────────────────────────────────────────────────────┘
```
