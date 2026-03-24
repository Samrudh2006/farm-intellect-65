import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const supabase = createClient(supabaseUrl, supabaseKey);

const ensureTableExists = async () => {
  try {
    // Check if table exists by trying to query it
    await supabase.from('pin_auth_users').select('id').limit(1);
  } catch (error) {
    // Table doesn't exist, create it
    await supabase.rpc('create_pin_auth_tables', {});
  }
};

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, pin, aadhaar } = req.body;

    // Validation
    if (!phone || !pin || !aadhaar) {
      return res.status(400).json({ error: 'Phone, PIN, and Aadhaar are required' });
    }

    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be exactly 6 digits' });
    }

    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      return res.status(400).json({ error: 'Aadhaar must be exactly 12 digits' });
    }

    // Ensure table exists
    await ensureTableExists();

    // Get user by phone and aadhaar
    const { data: user, error: queryError } = await supabase
      .from('pin_auth_users')
      .select('*')
      .eq('phone_number', phone)
      .eq('aadhaar_number', aadhaar)
      .single();

    if (queryError || !user) {
      return res.status(401).json({ error: 'Invalid phone, PIN, or Aadhaar' });
    }

    // Compare PIN
    const pinMatches = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatches) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    // Update last login time
    await supabase
      .from('pin_auth_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone_number, role: user.role },
      jwtSecret,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone_number,
        aadhaar: user.aadhaar_number,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('PIN Signin Error:', error);
    return res.status(500).json({ error: error.message || 'Signin failed' });
  }
};
