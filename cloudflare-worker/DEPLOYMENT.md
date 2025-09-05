
# Deploying the Helios Contact Form Worker

This guide explains how to deploy the Cloudflare Worker that processes your contact form submissions and sends them to Slack.

## Prerequisites

- You have a [Cloudflare account](https://dash.cloudflare.com/sign-up).
- You have [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) installed.
- You are in the `cloudflare-worker` directory in your terminal.

---

## Step 1: Install the Cloudflare CLI (Wrangler)

Wrangler is the command-line tool for managing and deploying Cloudflare Workers. Install it globally on your machine by running:

```bash
npm install -g wrangler
```

## Step 2: Authenticate with Cloudflare

Log in to your Cloudflare account from the command line. This will open a browser window for you to authorize Wrangler.

```bash
wrangler login
```

## Step 3: Set Your Slack Webhook Secret

This is the most critical step for security. You will store your Slack Webhook URL as a secret, so it is never exposed in your code.

> **CRITICAL SECURITY WARNING**
> The Slack URL you have previously shared is now public and compromised. You **MUST** go to your Slack App settings, **revoke that URL**, and generate a new one. Use the **new, un-compromised URL** in the command below.

Run the following command. It will prompt you to paste your secret Slack Webhook URL.

```bash
wrangler secret put SLACK_WEBHOOK_URL
```

## Step 4: Deploy the Worker

Now, publish the worker to your Cloudflare account.

```bash
wrangler deploy
```

After the deployment is successful, Wrangler will output a URL for your worker (e.g., `https://helios-contact-worker.<your-subdomain>.workers.dev`). **Copy this URL.**

## Step 5: Update the Frontend

The final step is to tell your website's contact form where to send the data.

1.  Open the frontend contact page file:
    `/Users/amoldericksoans/Documents/Helios/website/helios-landing-page/src/app/contact/page.tsx`

2.  Find the following line near the top of the file:
    ```typescript
    const CLOUDFLARE_WORKER_URL = "https://your-worker-url.workers.dev";
    ```

3.  Replace the placeholder URL with the actual URL you copied from the `wrangler deploy` output in Step 4.

Your contact form is now fully configured.
