# Vercel Analytics Setup Guide

This document provides instructions for enabling and configuring Vercel Analytics for the Helios website.

## Prerequisites

- Vercel account
- Vercel project for the Helios website
- The `@vercel/analytics` package is already installed

## Setup Instructions

### 1. Enable Analytics in Vercel Dashboard

1. Go to your Vercel Dashboard
2. Select the Helios project
3. Navigate to the Analytics tab
4. Click "Enable" to activate Web Analytics

### 2. Custom Events Tracking

The following custom events are now tracked in the application:

#### GPU Pricing Page
- `GPU Selected` - Tracks when a user selects/expands a GPU card
  - Properties: `gpuModel`, `gpuId`, `page`

#### Contact Page
- `Use Case Selected` - Tracks when a user selects a use case
  - Properties: `useCase`
- `Contact Form Submitted` - Tracks when a user submits the contact form
  - Properties: `useCase`, `hasCompany`, `hasMessage`

#### Partner Page
- `Partner Form Submitted` - Tracks when a user submits the partner contact form
  - Properties: `hasPhone`, `hasLocation`, `hasAvailablePower`, `hasNotes`

### 3. Deployment

After enabling analytics in the dashboard, deploy the application to start collecting data:

```bash
# If using Vercel CLI
vercel deploy

# Or push to your connected Git repository
```

## Viewing Analytics Data

Once deployed and after some traffic has been received, you can view analytics data in the Vercel Dashboard:

1. Go to your Vercel Dashboard
2. Select the Helios project
3. Navigate to the Analytics tab
4. View data by:
   - Pages: Page URLs visited
   - Routes: Application routes
   - Referrers: Traffic sources
   - Countries: Geographic distribution
   - Browsers: Browser usage
   - Devices: Device types
   - Events: Custom events (as implemented above)

## Privacy Compliance

Vercel Analytics is designed with privacy in mind:
- No cookies or local storage usage
- No cross-site tracking
- No persistent user identifiers
- GDPR, CCPA, and PECR compliant
- No data sold to third parties