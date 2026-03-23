import nodemailer from 'nodemailer';
import twilio from 'twilio';
import prisma from '../config/database.js';
import { generateOTP } from './auth.js';
import { logger } from './logger.js';

// Email transporter
const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Twilio Verify Service SID for managed OTP
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// ===========================================
// TWILIO VERIFY API - Phone OTP (SMS/WhatsApp)
// ===========================================

/**
 * Send OTP via Twilio Verify API
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +919876543210)
 * @param {string} channel - 'sms' or 'whatsapp'
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendPhoneOTP = async (phoneNumber, channel = 'sms') => {
  try {
    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      logger.error('Twilio Verify not configured');
      throw new Error('OTP service not configured');
    }

    // Validate channel
    const validChannels = ['sms', 'whatsapp'];
    if (!validChannels.includes(channel)) {
      throw new Error('Invalid channel. Use "sms" or "whatsapp"');
    }

    // Send verification via Twilio Verify API
    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: channel
      });

    logger.info(`Phone OTP sent via ${channel} to ${phoneNumber}, status: ${verification.status}`);
    
    return { 
      success: true, 
      status: verification.status,
      channel: channel
    };
  } catch (error) {
    logger.error(`Send phone OTP error (${channel}):`, error);
    throw new Error(error.message || 'Failed to send OTP');
  }
};

/**
 * Verify OTP via Twilio Verify API
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} code - 6-digit OTP code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyPhoneOTP = async (phoneNumber, code) => {
  try {
    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      logger.error('Twilio Verify not configured');
      throw new Error('OTP service not configured');
    }

    const verificationCheck = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: code
      });

    logger.info(`Phone OTP verification for ${phoneNumber}, status: ${verificationCheck.status}`);

    if (verificationCheck.status === 'approved') {
      return { success: true, status: 'approved' };
    } else {
      return { success: false, status: verificationCheck.status, error: 'Invalid or expired OTP' };
    }
  } catch (error) {
    logger.error('Verify phone OTP error:', error);
    
    // Handle specific Twilio errors
    if (error.code === 20404) {
      return { success: false, error: 'OTP expired or not found. Please request a new one.' };
    }
    if (error.code === 60202) {
      return { success: false, error: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }
    
    return { success: false, error: error.message || 'Verification failed' };
  }
};

// ===========================================
// LEGACY OTP SYSTEM (Email & DB-stored OTPs)
// ===========================================

export const sendOTP = async (userId, contact, type, purpose) => {
  try {
    // Generate OTP
    const code = generateOTP(6);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Save OTP to database
    await prisma.otpCode.create({
      data: {
        userId,
        code,
        type,
        purpose,
        expiresAt
      }
    });

    // Send OTP
    if (type === 'EMAIL') {
      await sendEmailOTP(contact, code, purpose);
    } else if (type === 'SMS') {
      await sendSMSOTP(contact, code, purpose);
    }

    logger.info(`OTP sent to ${contact} for ${purpose}`);
  } catch (error) {
    logger.error('Send OTP error:', error);
    throw new Error('Failed to send OTP');
  }
};

export const verifyOTP = async (userId, code, purpose) => {
  try {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        purpose,
        usedAt: null,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otpRecord) {
      return false;
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() }
    });

    return true;
  } catch (error) {
    logger.error('Verify OTP error:', error);
    return false;
  }
};

const sendEmailOTP = async (email, code, purpose) => {
  const subject = getEmailSubject(purpose);
  const text = getEmailText(code, purpose);

  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
    html: getEmailHTML(code, purpose)
  });
};

const sendSMSOTP = async (phone, code, purpose) => {
  if (!twilioClient) {
    logger.warn('Twilio not configured, skipping SMS OTP');
    return;
  }

  const message = getSMSMessage(code, purpose);

  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};

const getEmailSubject = (purpose) => {
  const subjects = {
    'signup': 'Verify your Smart Crop Advisory account',
    'login': 'Your login verification code',
    'reset-password': 'Password reset verification',
    'critical-action': 'Security verification required'
  };
  return subjects[purpose] || 'Verification Code';
};

const getEmailText = (code, purpose) => {
  const messages = {
    'signup': `Welcome to Smart Crop Advisory! Your verification code is: ${code}`,
    'login': `Your login verification code is: ${code}`,
    'reset-password': `Your password reset code is: ${code}`,
    'critical-action': `Your security verification code is: ${code}`
  };
  return messages[purpose] || `Your verification code is: ${code}`;
};

const getEmailHTML = (code, purpose) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .code { font-size: 24px; font-weight: bold; color: #16a34a; text-align: center; padding: 20px; background: #f0f9f0; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart Crop Advisory</h1>
        </div>
        <div class="content">
          <h2>${getEmailSubject(purpose)}</h2>
          <p>${getEmailText(code, purpose)}</p>
          <div class="code">${code}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Smart Crop Advisory. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getSMSMessage = (code, purpose) => {
  const messages = {
    'signup': `Smart Crop Advisory: Your verification code is ${code}`,
    'login': `Smart Crop Advisory: Your login code is ${code}`,
    'reset-password': `Smart Crop Advisory: Your password reset code is ${code}`,
    'critical-action': `Smart Crop Advisory: Your security code is ${code}`
  };
  return messages[purpose] || `Smart Crop Advisory: Your verification code is ${code}`;
};
