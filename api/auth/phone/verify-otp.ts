import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user storage (in production, use a database)
const users: Record<string, any> = {};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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
      return res.status(500).json({ error: 'Twilio not configured' });
    }

    // Verify OTP with Twilio
    const verificationCheck = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: code
      });

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({ 
        error: 'Invalid or expired OTP',
        status: verificationCheck.status 
      });
    }

    // Check if user exists
    let user = users[phone];
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = {
        id: `user_${Date.now()}`,
        phone,
        name: name || `User ${phone.slice(-4)}`,
        role: role.toUpperCase(),
        phoneVerified: true,
        createdAt: new Date().toISOString()
      };
      users[phone] = user;
    } else {
      user.phoneVerified = true;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phone: user.phone, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        phoneVerified: user.phoneVerified
      },
      isNewUser,
      message: isNewUser ? 'Account created successfully' : 'Login successful'
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    
    if (error.code === 20404) {
      return res.status(400).json({ 
        error: 'OTP expired or not found. Please request a new one.' 
      });
    }
    if (error.code === 60202) {
      return res.status(400).json({ 
        error: 'Maximum verification attempts exceeded. Please request a new OTP.' 
      });
    }

    res.status(500).json({
      error: error.message || 'Verification failed',
      code: error.code
    });
  }
}
