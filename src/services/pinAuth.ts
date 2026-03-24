const API_BASE_URL = '/api';

export type OTPChannel = 'sms' | 'whatsapp';

export interface PinAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    phone: string;
    aadhaar: string;
    name: string;
    role: string;
  };
  error?: string;
}

export const PinAuth = {
  /**
   * User signup with phone, PIN (6 digits), and Aadhaar
   */
  signup: async (
    phone: string,
    pin: string,
    aadhaar: string,
    name?: string,
    role: string = 'FARMER'
  ): Promise<PinAuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/pin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, pin, aadhaar, name, role }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[v0] Non-JSON response from API:', response.status);
        return {
          success: false,
          message: 'Server error',
          error: `Server returned non-JSON response (${response.status})`,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Signup failed',
          error: data.error,
        };
      }

      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
      };
    } catch (error: any) {
      console.error('[v0] PIN Signup Error:', error);
      return {
        success: false,
        message: 'Signup failed',
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * User signin with phone, PIN, and Aadhaar
   */
  signin: async (
    phone: string,
    pin: string,
    aadhaar: string
  ): Promise<PinAuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/pin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, pin, aadhaar }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[v0] Non-JSON response from API:', response.status);
        return {
          success: false,
          message: 'Server error',
          error: `Server returned non-JSON response (${response.status})`,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Signin failed',
          error: data.error,
        };
      }

      return {
        success: true,
        message: data.message,
        token: data.token,
        user: data.user,
      };
    } catch (error: any) {
      console.error('[v0] PIN Signin Error:', error);
      return {
        success: false,
        message: 'Signin failed',
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Format phone number to standard format
   */
  formatPhone: (phone: string): string => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // If it's 10 digits, assume India
    if (cleaned.length === 10) {
      return '+91' + cleaned;
    }
    
    // If it already starts with country code (up to 15 digits)
    if (cleaned.length >= 10 && cleaned.length <= 15) {
      return '+' + cleaned;
    }
    
    return phone;
  },

  /**
   * Validate PIN format (6 digits)
   */
  validatePin: (pin: string): boolean => {
    return /^\d{6}$/.test(pin.trim());
  },

  /**
   * Validate Aadhaar format (12 digits)
   */
  validateAadhaar: (aadhaar: string): boolean => {
    return /^\d{12}$/.test(aadhaar.trim());
  },

  /**
   * Validate phone number (10 digits for India)
   */
  validatePhone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  },
};
