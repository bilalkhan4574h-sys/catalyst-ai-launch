import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing SUPABASE env vars. Check .env and restart.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function runTest() {
  try {
    const { data, error } = await supabase.from('bookings').select('*');
    console.log({ data, error });
  } catch (e) {
    console.error('Test query failed', e);
  }
}

runTest();
