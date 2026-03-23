/**
 * Twilio Auth Service
 * Handles phone OTP authentication via SMS and WhatsApp using Twilio Verify API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export type OTPChannel = 'sms' | 'whatsapp';

export interface SendOTPResponse {
  success: boolean;
  message: string;
  channel: OTPChannel;
  error?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    role: string;
    isVerified: boolean;
    phoneVerified: boolean;
    farmerProfile?: any;
    merchantProfile?: any;
    expertProfile?: any;
  };
  isNewUser?: boolean;
  message: string;
  error?: string;
}

/**
 * Format phone number to E.164 format
 * @param phone - Phone number (can be with or without country code)
 * @param countryCode - Country code (default: +91 for India)
 */
export const formatPhoneE164 = (phone: string, countryCode: string = '+91'): string => {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If already starts with +, return as is (assuming it's already E.164)
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Add country code
  return `${countryCode}${cleaned}`;
};

/**
 * Send OTP to phone number via SMS or WhatsApp
 * @param phone - Phone number in E.164 format (e.g., +919876543210)
 * @param channel - 'sms' or 'whatsapp'
 */
export const sendOTP = async (
  phone: string, 
  channel: OTPChannel = 'sms'
): Promise<SendOTPResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/phone/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, channel }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Failed to send OTP',
        channel,
        error: data.error,
      };
    }

    return {
      success: true,
      message: data.message || `OTP sent via ${channel}`,
      channel: data.channel || channel,
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
      channel,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Verify OTP and authenticate/register user
 * @param phone - Phone number in E.164 format
 * @param code - 6-digit OTP code
 * @param name - Optional name for new users
 * @param role - User role (default: FARMER)
 */
export const verifyOTP = async (
  phone: string,
  code: string,
  name?: string,
  role: string = 'FARMER'
): Promise<VerifyOTPResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/phone/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code, name, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Verification failed',
        error: data.error,
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      isNewUser: data.isNewUser,
      message: data.message || 'Verification successful',
    };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Resend OTP to phone number
 * @param phone - Phone number in E.164 format
 * @param channel - 'sms' or 'whatsapp'
 */
export const resendOTP = async (
  phone: string,
  channel: OTPChannel = 'sms'
): Promise<SendOTPResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/phone/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, channel }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Failed to resend OTP',
        channel,
        error: data.error,
      };
    }

    return {
      success: true,
      message: data.message || `OTP resent via ${channel}`,
      channel: data.channel || channel,
    };
  } catch (error) {
    console.error('Resend OTP error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
      channel,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Export the Twilio Auth service
export const TwilioAuth = {
  sendOTP,
  verifyOTP,
  resendOTP,
  formatPhoneE164,
};

export default TwilioAuth;
