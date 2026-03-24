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
    const { phone, pin, aadhaar, name, role = 'FARMER' } = req.body;

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

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('pin_auth_users')
      .select('id')
      .eq('phone_number', phone)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('pin_auth_users')
      .insert([
        {
          phone_number: phone,
          pin_hash: pinHash,
          aadhaar_number: aadhaar,
          name: name || `User-${phone.slice(-4)}`,
          role: role.toUpperCase(),
          is_verified: true,
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Signup error:', insertError);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, phone: newUser.phone_number, role: newUser.role },
      jwtSecret,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        phone: newUser.phone_number,
        aadhaar: newUser.aadhaar_number,
        name: newUser.name,
        role: newUser.role,
      }
    });
  } catch (error: any) {
    console.error('PIN Signup Error:', error);
    return res.status(500).json({ error: error.message || 'Signup failed' });
  }
};
