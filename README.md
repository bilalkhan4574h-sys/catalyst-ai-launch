# Project

This project uses Vite, React, TypeScript and stores application data in Supabase.

## Running locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Data storage

This project saves user data (auth, contact submissions, etc.) to Supabase. Configure environment variables in a `.env` or via your hosting provider:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

For server-side integrations (webhooks), use the Supabase service role key and the server webhook in `server/email-webhook.js`.

## Deploy

Deploy to your preferred hosting provider (Vercel, Netlify, Render) and set the environment variables in your project settings.
