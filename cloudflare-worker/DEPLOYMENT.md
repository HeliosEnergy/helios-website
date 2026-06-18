# Cloudflare Worker Deployment Guide

This guide will help you deploy the Helios contact form worker to Cloudflare.

## Prerequisites

- A Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- A Slack app with:
  - Bot token scopes: `chat:write`
  - Interactivity enabled with the request URL:
    `https://helios-contact-worker.helios-energy.workers.dev/slack/actions`
- An AWS SQS queue for website lead events

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

### 3. Set Up Slack

Create or update the Slack app:
1. Enable bot token scope `chat:write`.
2. Install the app to the Helios workspace.
3. Copy the bot token (`xoxb-...`).
4. Copy the signing secret.
5. Pick the channel ID where inbound leads should land.
6. Set the interactivity request URL to the Worker `/slack/actions` endpoint.

The old incoming webhook path is still supported as a fallback for basic lead
posting, but approval buttons and edit modals require the bot token and signing
secret.

### 4. Create SQS Queue

Create an SQS queue for lead events. The Worker needs only `sqs:SendMessage`.
The EC2 lead-gen agent needs `sqs:ReceiveMessage`, `sqs:DeleteMessage`, and
`sqs:ChangeMessageVisibility`.

### 5. Configure Secrets

Set Worker secrets:

```bash
cd cloudflare-worker
wrangler secret put SLACK_BOT_TOKEN
wrangler secret put SLACK_SIGNING_SECRET
wrangler secret put SLACK_CHANNEL_ID
wrangler secret put AWS_REGION
wrangler secret put AWS_SQS_QUEUE_URL
wrangler secret put AWS_ACCESS_KEY_ID
wrangler secret put AWS_SECRET_ACCESS_KEY
```

If using temporary AWS credentials, also set:

```bash
wrangler secret put AWS_SESSION_TOKEN
```

### 6. Deploy the Worker

```bash
wrangler deploy
```

### 7. Get the Worker URL

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

- `SLACK_BOT_TOKEN` (secret): Slack bot token used for lead posts and edit modals
- `SLACK_SIGNING_SECRET` (secret): verifies Slack button/modal callbacks
- `SLACK_CHANNEL_ID` (secret): channel for inbound lead messages
- `AWS_REGION` (secret): region for SQS
- `AWS_SQS_QUEUE_URL` (secret): lead event queue URL
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (secret): limited Worker sender credentials
- `AWS_SESSION_TOKEN` (secret, optional): only if using temporary AWS credentials
- `SLACK_WEBHOOK_URL` (secret, optional): legacy fallback for lead posts only

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

The Worker normalizes both contact-page submissions and startup-program
submissions into a `lead.created` event, posts the lead to Slack, and enqueues
that event to SQS. Slack button and modal callbacks are verified and converted
into `email.approve`, `email.edit_approve`, `email.reject`, or
`email.regenerate` events on the same queue.
