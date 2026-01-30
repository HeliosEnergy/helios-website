# Cloudflare Worker Deployment Guide

This guide will help you deploy the Helios contact form worker to Cloudflare.

## Prerequisites

- A Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- A Slack webhook URL (for form submissions)

## Setup Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for you to authenticate.

### 3. Set Up Slack Webhook

Create a Slack webhook URL:
1. Go to https://api.slack.com/messaging/webhooks
2. Create a new webhook for your desired channel
3. Copy the webhook URL

### 4. Configure Secrets

Set the Slack webhook URL as a secret:

```bash
cd cloudflare-worker
wrangler secret put SLACK_WEBHOOK_URL
```

When prompted, paste your Slack webhook URL.

### 5. Deploy the Worker

```bash
wrangler deploy
```

### 6. Get the Worker URL

After deployment, Wrangler will provide you with a URL like:
`https://helios-contact-worker.<your-subdomain>.workers.dev/`

Use this URL in your frontend form submissions.

## Testing

You can test the worker locally before deploying:

```bash
wrangler dev
```

This will start a local development server.

## Updating the Worker

To update the worker after making changes:

```bash
wrangler deploy
```

## Environment Variables

The worker uses the following environment variables:

- `SLACK_WEBHOOK_URL` (secret): Your Slack webhook URL for receiving form submissions

## CORS Configuration

The worker is configured to accept requests from any origin (`Access-Control-Allow-Origin: *`).
For production, consider restricting this to your specific domain.

## Form Data Format

The worker expects POST requests with JSON body in this format:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "message": "I'm interested in your services",
  "inquiryType": "General",
  "gpuDetails": {
    "model": "NVIDIA H100",
    "count": 8,
    "hoursPerMonth": 720
  }
}
```
