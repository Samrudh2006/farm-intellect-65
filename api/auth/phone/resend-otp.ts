import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

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
    const { phone, channel = 'sms' } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      return res.status(500).json({ error: 'Twilio not configured' });
    }

    const validChannels = ['sms', 'whatsapp'];
    if (!validChannels.includes(channel)) {
      return res.status(400).json({ error: 'Invalid channel. Use "sms" or "whatsapp"' });
    }

    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: channel
      });

    res.json({
      success: true,
      message: `OTP resent via ${channel}`,
      status: verification.status,
      channel: channel
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      error: error.message || 'Failed to resend OTP',
      code: error.code
    });
  }
}
