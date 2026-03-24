# PIN-Based Authentication System

## Overview
A custom PIN-based authentication system where users can:
- **Sign Up**: Create an account with phone number + 6-digit PIN + Aadhaar number
- **Sign In**: Login with the same credentials each time
- Data is persistently stored in Supabase database

## Features
✅ Phone number + 6-digit PIN + 12-digit Aadhaar authentication
✅ Role-based user profiles (Farmer, Merchant, Expert, Admin)
✅ Secure PIN storage with bcrypt hashing
✅ JWT token-based session management
✅ Login history tracking
✅ User data persistence in Supabase

## Setup Instructions

### 1. Database Setup (Supabase)
The PIN authentication requires two tables:

**Table: `pin_auth_users`**
```sql
CREATE TABLE pin_auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(15) NOT NULL UNIQUE,
  pin_hash VARCHAR(255) NOT NULL,
  aadhaar_number VARCHAR(12) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'FARMER',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_pin_auth_users_phone ON pin_auth_users(phone_number);
CREATE INDEX idx_pin_auth_users_aadhaar ON pin_auth_users(aadhaar_number);
```

**Table: `pin_auth_login_history`**
```sql
CREATE TABLE pin_auth_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES pin_auth_users(id) ON DELETE CASCADE,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  device_info VARCHAR(255)
);

CREATE INDEX idx_pin_auth_login_history_user_id ON pin_auth_login_history(user_id);
```

### 2. Environment Variables
Add these to your Vercel project settings (Settings → Vars):

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# JWT (Change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Twilio (if using SMS/WhatsApp OTP)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_id
```

### 3. Accessing the PIN Login
- Default OTP Login: `/login`
- PIN-Based Login: `/pin-login` ← Use this for custom PIN authentication

## API Endpoints

### Sign Up
**POST** `/api/auth/pin/signup`

Request:
```json
{
  "phone": "+919876543210",
  "pin": "123456",
  "aadhaar": "123456789012",
  "name": "John Farmer",
  "role": "FARMER"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "phone": "+919876543210",
    "aadhaar": "123456789012",
    "name": "John Farmer",
    "role": "FARMER"
  }
}
```

### Sign In
**POST** `/api/auth/pin/signin`

Request:
```json
{
  "phone": "+919876543210",
  "pin": "123456",
  "aadhaar": "123456789012"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "phone": "+919876543210",
    "aadhaar": "123456789012",
    "name": "John Farmer",
    "role": "FARMER"
  }
}
```

## Frontend Integration

### Using the PinAuth Service
```typescript
import { PinAuth } from "@/services/pinAuth";

// Sign Up
const result = await PinAuth.signup(
  "+919876543210",  // phone
  "123456",         // 6-digit PIN
  "123456789012",   // 12-digit Aadhaar
  "John Farmer",    // name (optional)
  "FARMER"          // role
);

// Sign In
const result = await PinAuth.signin(
  "+919876543210",  // phone
  "123456",         // PIN
  "123456789012"    // Aadhaar
);

// Validation helpers
PinAuth.validatePhone("9876543210");    // true if 10 digits
PinAuth.validatePin("123456");          // true if 6 digits
PinAuth.validateAadhaar("123456789012"); // true if 12 digits
PinAuth.formatPhone("9876543210");      // "+919876543210"
```

### Using the PinLogin Page
Users can access the custom PIN login at `/pin-login`:
1. Select role (Farmer, Merchant, Expert, Admin)
2. For new users: Click "Sign up" and enter phone + PIN + Aadhaar + name
3. For existing users: Click "Login" and enter phone + PIN + Aadhaar
4. Same PIN is used every time - no need for OTP

## Key Implementation Files

| File | Purpose |
|------|---------|
| `api/auth/pin/signup.ts` | User registration with PIN |
| `api/auth/pin/signin.ts` | User login with PIN |
| `src/services/pinAuth.ts` | Frontend API client service |
| `src/pages/PinLogin.tsx` | UI component for PIN auth |
| `src/App.tsx` | Route definition (`/pin-login`) |

## Security Considerations

1. **PIN Hashing**: PINs are hashed with bcrypt (10 rounds) before storage
2. **No Plain Text**: PINs are never stored or transmitted in plain text
3. **HTTPS Only**: Always use HTTPS in production
4. **JWT Expiry**: Tokens expire after 30 days (configurable)
5. **Login History**: All logins are tracked for audit purposes
6. **Aadhaar Validation**: 12-digit Aadhaar is required for signup/signin

## Troubleshooting

### "Phone number already registered"
- The phone number is already in use
- User should use Sign In instead

### "Invalid PIN" / "Invalid credentials"
- PIN or Aadhaar doesn't match
- Case-sensitive validation

### Database connection errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in environment
- Check Supabase URL is correct
- Ensure tables are created

### JWT errors
- Set a unique `JWT_SECRET` in environment variables
- Change default secret in production

## Testing

1. Go to `/pin-login`
2. Select "Farmer" role
3. Click "Sign up"
4. Enter:
   - Phone: Any 10-digit number (e.g., 9876543210)
   - PIN: Any 6-digit number (e.g., 123456)
   - Aadhaar: Any 12-digit number (e.g., 123456789012)
   - Name: Your name (optional)
5. Click "Create Account"
6. You'll be redirected to the Farmer Dashboard
7. To test login, log out and use the same credentials

## Future Enhancements

- [ ] Profile editing after signup
- [ ] PIN reset/recovery functionality
- [ ] Two-factor authentication
- [ ] Biometric login (fingerprint/face)
- [ ] Account lockout after failed attempts
- [ ] Email verification
- [ ] Social login integration
