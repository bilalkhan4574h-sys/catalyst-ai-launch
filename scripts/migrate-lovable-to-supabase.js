#!/usr/bin/env node
// Simple import tool: reads a JSON array and inserts into a Supabase table using service role key
// Usage: node scripts/migrate-lovable-to-supabase.js <input.json> <table_name>

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const [,, inputPath, tableName] = process.argv;
if (!inputPath || !tableName) {
  console.error('Usage: node migrate-lovable-to-supabase.js <input.json> <table_name>');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function run() {
  const raw = fs.readFileSync(inputPath, 'utf8');
  let rows;
  try {
    rows = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    process.exit(1);
  }
  if (!Array.isArray(rows)) {
    console.error('Input JSON must be an array of objects');
    process.exit(1);
  }

  console.log(`Inserting ${rows.length} rows into ${tableName}...`);
  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { data, error } = await supabase.from(tableName).insert(chunk);
    if (error) {
      console.error('Insert error:', error);
      process.exit(1);
    }
    console.log(`Inserted rows ${i}..${i + chunk.length - 1}`);
  }
  console.log('Import complete');
}

run().catch((err) => { console.error(err); process.exit(1); });
