-- Create PIN Auth Users Table
CREATE TABLE IF NOT EXISTS pin_auth_users (
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

-- Create index for faster phone number lookups
CREATE INDEX idx_pin_auth_users_phone ON pin_auth_users(phone_number);
CREATE INDEX idx_pin_auth_users_aadhaar ON pin_auth_users(aadhaar_number);

-- Create login history table
CREATE TABLE IF NOT EXISTS pin_auth_login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES pin_auth_users(id) ON DELETE CASCADE,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  device_info VARCHAR(255)
);

-- Create index for user login history
CREATE INDEX idx_pin_auth_login_history_user_id ON pin_auth_login_history(user_id);

-- Enable Row Level Security
ALTER TABLE pin_auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_auth_login_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data"
  ON pin_auth_users
  FOR SELECT
  USING (auth.uid()::text = id::text OR current_user = 'postgres');

CREATE POLICY "Users can update their own data"
  ON pin_auth_users
  FOR UPDATE
  USING (auth.uid()::text = id::text OR current_user = 'postgres');
