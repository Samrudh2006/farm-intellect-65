# API Documentation

## Base URLs

### Frontend
- Local: `http://localhost:8080`

### Backend
- Local: `http://localhost:3001`
- Health: `GET /health`

## Authentication

Most backend routes require a Bearer token:

```http
Authorization: Bearer <jwt>
```

## Route groups

### Auth routes — `/api/auth`

- `POST /signup`
- `POST /login`
- `POST /verify-otp`
- `POST /resend-otp`
- `POST /forgot-password`
- `POST /reset-password`

### Users — `/api/users`

- `GET /profile`
- `PATCH /profile`
- `GET /farmers`

### Documents — `/api/documents`

- `POST /upload`
- `GET /my-documents`
- `GET /download/:id`
- `DELETE /:id`
- `GET /pending-verification`
- `PATCH /:id/verify`

### Notifications — `/api/notifications`

- `GET /`
- `PATCH /:id/read`
- `PATCH /mark-all-read`
- `POST /`
- `DELETE /:id`

### Forum — `/api/forum`

- `GET /posts`
- `POST /posts`
- `GET /posts/:id`
- `POST /posts/:id/comments`
- `POST /posts/:id/like`
- `GET /categories`

### Chat — `/api/chat`

- `GET /messages`
- `POST /message`
- `DELETE /messages`

### Analytics — `/api/analytics`

- `GET /dashboard`
- `GET /activity`

### Calendar — `/api/calendar`

- `GET /`
- `POST /`
- `PATCH /:id`
- `DELETE /:id`
- `GET /reminders`
- `GET /stages`

### AI — `/api/ai`

- `POST /recommend-crops`
- `POST /detect-disease`
- `GET /suggestions`
- `POST /predict-yield`
- `GET /preventive-tips`

## Example responses

### Health check

```json
{
  "status": "OK",
  "timestamp": "2026-03-07T12:00:00.000Z"
}
```

### Login success

```json
{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "email": "farmer@example.com",
    "role": "FARMER"
  },
  "message": "Login successful"
}
```

### Validation / auth error

```json
{
  "error": "Access token required"
}
```

## Current API maturity notes

- auth routes already use validation rules
- additional route groups still need standardized validation middleware coverage
- shared API DTOs have been started in `src/types/api.ts`
- next recommended step: generate an OpenAPI spec or share Zod schemas across frontend/backend
