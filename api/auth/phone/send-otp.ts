import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

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
    const { phone, channel = 'sms' } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone format (E.164)
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: 'Invalid phone format. Use E.164 format (e.g., +919876543210)'
      });
    }

    // Validate channel
    if (!['sms', 'whatsapp'].includes(channel)) {
      return res.status(400).json({ error: 'Invalid channel. Use "sms" or "whatsapp"' });
    }

    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      console.error('Twilio not configured');
      return res.status(500).json({ error: 'OTP service not configured. Please add Twilio credentials.' });
    }

    // Send verification via Twilio Verify API
    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: channel
      });

    console.log(`Phone OTP sent via ${channel} to ${phone}, status: ${verification.status}`);

    return res.status(200).json({
      success: true,
      message: `OTP sent via ${channel}`,
      channel: channel,
      status: verification.status
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    
    // Handle specific Twilio errors
    if (error.code === 60200) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (error.code === 60203) {
      return res.status(429).json({ error: 'Max send attempts reached. Please wait before trying again.' });
    }
    
    return res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
}
