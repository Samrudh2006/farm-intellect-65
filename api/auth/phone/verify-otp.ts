import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
const JWT_SECRET = process.env.JWT_SECRET || 'farm-intellect-secret-key';

// Initialize Supabase client
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, code, name, role = 'FARMER' } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and OTP code are required' });
    }

    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('Twilio not configured');
      return res.status(500).json({ error: 'OTP service not configured' });
    }

    // Verify OTP via Twilio
    const verificationCheck = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: code
      });

    console.log(`Phone OTP verification for ${phone}, status: ${verificationCheck.status}`);

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // If Supabase is configured, manage user in database
    let user: any = null;
    let isNewUser = false;

    if (supabase) {
      // Check if user exists with this phone
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        console.error('Database error finding user:', findError);
      }

      if (existingUser) {
        user = existingUser;
        // Update phone verification status
        await supabase
          .from('users')
          .update({ phone_verified: true, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      } else {
        // Create new user
        isNewUser = true;
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            phone,
            name: name || `User ${phone.slice(-4)}`,
            role: role.toUpperCase(),
            is_verified: true,
            phone_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          // Still allow login even if DB fails
          user = {
            id: `temp_${Date.now()}`,
            phone,
            name: name || `User ${phone.slice(-4)}`,
            role: role.toUpperCase()
          };
        } else {
          user = newUser;
        }
      }
    } else {
      // No database - create temporary user object
      isNewUser = true;
      user = {
        id: `temp_${Date.now()}`,
        phone,
        name: name || `User ${phone.slice(-4)}`,
        role: role.toUpperCase()
      };
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, role: user.role, phone: user.phone });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      isNewUser,
      message: isNewUser ? 'Account created successfully' : 'Login successful'
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);

    // Handle specific Twilio errors
    if (error.code === 20404) {
      return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
    }
    if (error.code === 60202) {
      return res.status(400).json({ error: 'Maximum verification attempts exceeded. Please request a new OTP.' });
    }

    return res.status(500).json({ error: error.message || 'Verification failed' });
  }
}
