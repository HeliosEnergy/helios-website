# Website Link Map & Flow Audit

**Context** (January 2026 snapshot): this documents every active CTA or anchor defined in the Helios landing page stack (Next.js `src/app` plus supporting components) and calls out the spots where the UI exposes a link without a real destination yet. ASCII diagrams visualize each flow so the team can verify where the user lands.

---

## 1. Global Navigation (header + footer)

### Header navigation (`src/app/components/layout/Header.tsx`)
- **Energy** → internal route `/energy` (Energy page).
- **Partner with us** → internal route `/partner` (Partner experience).
- **Cloud dropdown** → currently only **GPU Pricing** (`/gpu-pricing`).

```
[Header nav]
  ├─> Energy page (`/energy`)
  ├─> Partner page (`/partner`)
  └─> Cloud dropdown
        └─> GPU Pricing (`/gpu-pricing`)
```

### Header CTAs (desktop + mobile)
- **Cloud login** anchor (desktop/mobile) → `https://console.heliosenergy.io/` (opens new tab via `window.open` or `<a>`).
- **Sign up** button (desktop) & **Sign up** button in the mobile drawer → opens `https://console.heliosenergy.io/login?tab=signup` in a new tab via `window.open`.

```
[Header CTA]
  ├─> Cloud login link
  │       │
  │       └─> https://console.heliosenergy.io/
  └─> Sign up button
          │
          └─> https://console.heliosenergy.io/login?tab=signup
```

The mobile drawer repeats the same links as the desktop CTAs; the drawer’s close callbacks (`setMobileMenuOpen(false)`) ensure the dialog closes before the external navigation.

### Footer quick-actions + columns (`src/app/components/layout/Footer.tsx`)
- **Top action bar:** `Cloud Console` & `Login` both open `https://console.heliosenergy.io/` (classic login entry point).
- **Columns:**
  - **Products**: `Energy` → `/energy`.
  - **Other**: `Terms & Conditions` → `/tnc` (internal small page).
  - **Developers** and **About us** columns are rendered but their `links` arrays are empty today, so nothing is wired there.
  - The bottom social `<div>` has no anchors, leaving the social area empty.

```
[Footer top actions]
  ├─> Cloud Console → https://console.heliosenergy.io/
  └─> Login         → https://console.heliosenergy.io/

[Footer columns]
  ├─> Products → Energy page (/energy)
  ├─> Other    → Terms & Conditions (/tnc)
  ├─> Developers → **no links yet (array empty)**
  └─> About us   → **no links yet (array empty)**
```

The only internally routed footer link is Terms & Conditions (`/tnc`), which renders the legal content from `src/app/tnc/page.tsx`.

---

## 2. Homepage CTAs (`src/app/page.tsx` plus its sections)

### Hero section (`src/app/components/sections/HeroSection.tsx`)
- **Contact sales →** (`CalendlyButton`, variant `secondary`) opens `https://calendly.com/jose-helios/30min` in a popup (`window.open` with `width=800,height=600`).
- **Get started →** opens `https://console.heliosenergy.io/` in a new tab.

```
[Hero "Contact sales →"]
  └─> CalendlyButton
        └─> window.open('https://calendly.com/jose-helios/30min', 'calendly', popupFeatures)

[Hero "Get started →"]
  └─> window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')
```

### Stack section CTA (`src/app/components/stack-section/StackSection.tsx`)
- **Get Started Today** button opens the console (`https://console.heliosenergy.io/`) in a new tab.

```
[Stack section Get Started Today]
  └─> window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')
```

### Contact section waitlist (`src/app/components/contact-section/ContactSection.tsx`)
- **Waitlist →** button simply sets `window.location.href = '/contact'`, routing the visitor to the dedicated Contact page.

```
[Contact section "Waitlist →"]
  └─> window.location.href = '/contact'
        └─> Contact page (src/app/contact/page.tsx)
```

---

## 3. “Energy” page CTAs (`src/app/energy/page.tsx` + section components)

### Energy hero + CTA (`src/app/components/energy-section/EnergyHeroSection.tsx`)
- **Get started** button opens `https://console.heliosenergy.io/` in a new tab.

```
[Energy hero "Get started"]
  └─> window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')
```

### Energy CTA section (`src/app/components/energy-section/EnergyCTASection.tsx`)
- **Get started today** button (aesthetic section) also opens the console in a new tab.

```
[Energy CTA "Get started today"]
  └─> window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')
```

All energy-focused CTAs currently reuse the same `console.heliosenergy.io` endpoint.

---

## 4. GPU Pricing flows (`src/app/gpu-pricing` + shared GPU components)

### GPU Pricing hero (`src/app/components/gpu-pricing/GPUPricingHero.tsx`)
- **Get Started** button → console (`https://console.heliosenergy.io/`).
- **Contact Sales** (`CalendlyButton`) → `https://calendly.com/jose-helios/30min` popup.

```
[GPU Pricing hero "Get Started"]
  └─> window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')

[GPU Pricing hero "Contact Sales"]
  └─> CalendlyButton
        └─> window.open('https://calendly.com/jose-helios/30min', 'calendly', popupFeatures)
```

### GPU selection cards (`src/app/components/gpu-selection/GPUCard.tsx`)
- Each expanded card adds a **Contact sales →** `CalendlyButton` with the same Calendly target.

```
[GPU Card (expanded) "Contact sales →"]
  └─> CalendlyButton
        └─> window.open('https://calendly.com/jose-helios/30min', 'calendly', popupFeatures)
```

### Pricing summary flows (`src/app/components/gpu-pricing/PricingSummary.tsx`, `CompactPricingSummary.tsx`, `GPURentalCalculator` wrappers)
- All “Contact Sales” buttons (desktop `PricingSummary` and mobile `CompactPricingSummary`) and the **Enterprise pricing inquiry** text trigger `handleContactSales`:
  1. set `isSubmitting` (button text switches to `Processing...`).
  2. POST a JSON payload to `https://helios-contact-worker.helios-energy.workers.dev/` (shared endpoint with the main contact page).
  3. Regardless of success or failure, open `https://calendly.com/jose-helios/30min` in a new tab.
  4. On success, keep `isSubmitting = false`; on failure, log error, show fallback text, still open Calendly.

```
[PricingSummary / CompactPricingSummary "Contact Sales"]
  ├─> fetch POST payload → https://helios-contact-worker.helios-energy.workers.dev/
  │       └─> receives GPU/reservation data (default name/email if not provided)
  └─> window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')
```

- The **Enterprise pricing inquiry** text link in `PricingSummary` points to the same `handleContactSales`.

### GPU Quantity control (within `GPURentalCalculator` sidebar)
- When quantity ≥10, the “Contact us” inline link becomes visible and opens the Calendly URL (no worker call).

```
[GPUQuantityControl contact link (≥10 units)]
  └─> window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')
```

### GPURentalCalculator summary (`src/app/components/gpu-pricing/GPURentalCalculator.tsx`)
- The calculator wraps the `PricingSummary`/`CompactPricingSummary` CTAs described above, so their flow is the same POST → Calendly cycle.
- No additional external links exist beyond the shared worker + Calendly path.

---

## 5. Partner page flows (`src/app/partner/page.tsx` + sections)

### Contact form (`src/app/components/partner-section/ContactFormSection.tsx`)
- **Send Inquiry** button triggers `handleSubmit`:
  1. Validates required fields (name, company, email + email format).
  2. Tracks `Partner Form Submitted` event via Vercel Analytics.
  3. Builds a `FormData` payload and POSTs it to `https://helios-power-plant-contact-form.helios-energy.workers.dev/plant_contact_submission`.
  4. On success: shows green success banner + resets fields.
  5. On error: shows red error banner with worker/validation message.

```
[Partner Contact form "Send Inquiry"]
  ├─> validate inputs
  ├─> POST FormData → https://helios-power-plant-contact-form.helios-energy.workers.dev/plant_contact_submission
  ├─> success → success message + form reset
  └─> failure → error banner with server message
```

### Specifications download (`src/app/components/partner-section/SpecificationsSection.tsx`)
- **Download PDF** button only logs `Download PDF Brochure` to the console; there is no file-linked URL or blob download yet.

```
[Download PDF button]
  └─> console.log('Download PDF Brochure')
        └─> **no URL or file delivered today (placeholder).**
```

This counts as an “unconnected” CTA that needs wiring when a brochure link becomes available.

---

## 6. Contact page flow (`src/app/contact/page.tsx`)

- The `Contact →` button submits a comprehensive form:
  1. Validates that name and email are present (and that email looks valid).
  2. Tracks `Contact Form Submitted` (with the selected use case).
  3. Sends JSON to `https://helios-contact-worker.helios-energy.workers.dev/`.
  4. On success: sets `formState = 'success'`, resets the fields, clears the selected use case.
  5. On error: sets `formState = 'error'` and exposes the worker’s message.

```
[Contact page form "Contact →"]
  ├─> validate name/email
  ├─> POST JSON → https://helios-contact-worker.helios-energy.workers.dev/
  ├─> success → formState = success + reset
  └─> error → formState = error + show message
```

- Selecting the **Baremetal GPU** use case toggles the GPU count slider/number input but does not change the destination (still the worker + success/error flow above).

---

## 7. Summary of unconnected links/CTAs

1. **Partner Specifications “Download PDF” button** (`src/app/components/partner-section/SpecificationsSection.tsx`) currently only logs to the console. No PDF link or download endpoint is attached.
2. **Footer columns “Developers” and “About us”** render titles with empty `links` arrays, so while the UI exposes space for these sections, there are no actionable targets yet.
3. **Footer social area** (the empty `<div className="flex space-x-4">` block) shows no anchors; if social links are required, they need to be added.

```
[Unconnected placeholders]
  ├─> Specifications Download → console.log (no resource)
  ├─> Footer Developers column → no links
  └─> Footer About us column   → no links
```

---

## References
- Header + Footer: `src/app/components/layout/Header.tsx`, `src/app/components/layout/Footer.tsx`
- Homepage slices: `src/app/components/sections/*`, `src/app/components/stack-section/*`, `src/app/components/contact-section/*`
- Energy page: `src/app/energy/page.tsx`, `src/app/components/energy-section/*`
- GPU Pricing experience: `src/app/gpu-pricing/*`, `src/app/components/gpu-selection/*`
- Partner page: `src/app/partner/page.tsx`, `src/app/components/partner-section/*`
- Contact page: `src/app/contact/page.tsx`
