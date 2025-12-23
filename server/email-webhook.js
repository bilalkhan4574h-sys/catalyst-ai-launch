import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY/SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Basic health check
app.get('/', (req, res) => res.send('Email webhook running'));

// Generic webhook endpoint to accept incoming email POSTs
app.post('/webhook/email', async (req, res) => {
  try {
    // Attempt to extract common fields used by Mailgun/Postmark/SendGrid
    const payload = req.body || {};

    const from = payload.from || payload.sender || payload.mail?.source || payload.from_email || '';
    const subject = payload.subject || payload.mail?.commonHeaders?.subject || '';
    const text = payload.text || payload.body || payload.content || payload.plain || (payload.mail && payload.mail.text) || '';

    // Fallback: if full raw message provided, try a simple regex
    const raw = payload['body-plain'] || payload.raw || payload['Message-Body'] || '';
    const message = text || raw || subject;

    // Parse name/email if `from` contains both
    let name = '';
    let email = '';
    const m = /^(.*)<(.+@.+)>$/.exec(from);
    if (m) {
      name = m[1].trim().replace(/^"|"$/g, '');
      email = m[2].trim();
    } else if (from && from.includes('@')) {
      email = from.trim();
    }

    // Insert into Supabase table `contact_submissions`
    const { data, error } = await supabase.from('contact_submissions').insert({
      name: name || payload.name || payload.sender_name || 'Incoming Email',
      email: email || payload.email || payload.from || '',
      message: (subject ? `${subject}\n\n` : '') + (message || payload.message || ''),
      status: 'new'
    });

    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: 'db_error', details: error.message });
    }

    return res.status(200).json({ ok: true, inserted: data });
  } catch (err) {
    console.error('Webhook handler error', err);
    return res.status(500).json({ error: 'handler_error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Email webhook listening on port ${port}`));
