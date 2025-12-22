# Email Webhook for Contact Submissions

This simple Express webhook accepts POST requests from email providers (Mailgun, SendGrid, Postmark, etc.) and inserts incoming email messages into the `contact_submissions` table in Supabase.

## Setup

1. Install dependencies:

```bash
npm install express body-parser dotenv @supabase/supabase-js
```

2. Create a `.env` file at the project root with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=4000
```

Use the Service Role key for server-side inserts. To obtain the service role key go to your Supabase project -> Settings -> API -> Service Key.

3. Run the webhook locally:

```bash
npm run server
```

4. Configure your email provider to POST incoming messages to `https://your-host/webhook/email`.

- Mailgun: add a route that forwards to your endpoint, or use the `Routes`/`Forward` feature.
- SendGrid: use Inbound Parse and set the POST URL.
- Postmark: use Inbound Webhooks and set the POST URL.

Payloads vary across providers. The handler attempts to extract `from`, `subject`, and `text` from common fields.

## Security
- Use HTTPS in production and restrict the endpoint with provider-specific signing (e.g., Mailgun signature verification, SendGrid token).
- Do not expose the Supabase service role key publicly.

## Notes
- The webhook writes `status: 'new'` so messages appear in the admin `Contact Submissions` page.
- If you want to include attachments or HTML, extend the parser to save or link attachments.
