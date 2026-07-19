# Helios Conversion Forms, Colocation Cross-Sell, and Careers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Helios’s cluster and colocation conversion paths, add explicit colocation requirements, introduce a GPU-colocation pricing cross-sell, verify capacity-map totals, and replace the empty careers page with a production-quality recruiting experience.

**Architecture:** Keep the existing Vite + React routing and page ownership intact. Extract only reusable careers data and the pricing banner into focused modules, keep contact-form state within `ContactPage.tsx`, and use Node’s built-in test runner plus `tsx` for behavior and source-contract tests. All visual additions use existing Tailwind/CSS patterns and respect reduced-motion.

**Tech Stack:** Vite 5, React 19, TypeScript 5.8, React Router 6, Tailwind CSS 3, Framer Motion 11, Node 22, Node test runner.

## Global Constraints

- Work only in `/Users/amoldericksoans/Documents/Helios/helios-website`.
- Preserve unrelated changes in `.claude/launch.json`, `docs/privacy-policy-draft.md`, and `docs/privacy-policy-draft.pdf`.
- The framework is Vite + React, not Next.js.
- Clusters means Helios-provided GPU compute; Colocation means customer-owned hardware in Helios-provided space, power, cooling, connectivity, security, and facility operations.
- Cooling choices are exactly `Air cooled` and `Liquid cooled`.
- Minimum facility-tier choices are exactly `Tier I`, `Tier II`, and `Tier III`.
- The pricing cross-sell CTA label is `Estimate colocation cost` and its destination is `/colocation#calculator`.
- The pricing banner animation must be CSS-only, subtle, and disabled by `prefers-reduced-motion`.
- Use the requested Impeccable tooling for a critique pass, but do not let it overwrite unrelated user work.
- Before any Vercel action run `git remote -v` and `vercel project inspect helios-website`.
- Production deployment is from `main`.

---

### Task 1: Verify Tooling and Baseline

**Files:**
- Inspect: `package.json`
- Inspect: `skills-lock.json`
- Possible modification by installer: agent-harness configuration files created by Impeccable

**Interfaces:**
- Consumes: Node `>=22.12`; current repository configuration.
- Produces: Installed and initialized Impeccable critique tooling available for Task 6.

- [ ] **Step 1: Confirm the runtime and clean baseline**

Run:

```bash
node --version
npm run build
node --import tsx --test src/components/HeroSection.test.ts
```

Expected: Node reports `v22.12.0` or newer; build exits `0`; both hero tests pass.

- [ ] **Step 2: Install and initialize Impeccable**

Run:

```bash
npx impeccable install
npx impeccable init
```

Expected: installer completes without replacing application source. Inspect `git status --short` immediately and preserve only intentional harness/skill files.

- [ ] **Step 3: Record installer effects**

Run:

```bash
git status --short
git diff -- . ':!package-lock.json'
```

Expected: no application-source changes. If the installer changes tracked harness configuration, review it before retaining it.

### Task 2: Add Explicit Colocation Requirements

**Files:**
- Modify: `src/pages/ContactPage.tsx`
- Create: `src/pages/ContactPage.test.ts`

**Interfaces:**
- Consumes: existing `FormData`, `ServicePill`, `handleServiceChange`, and `handleSubmit`.
- Produces:
  - `CoolingRequirement = "air" | "liquid"`
  - `FacilityTier = "tier-1" | "tier-2" | "tier-3"`
  - `formData.coolingRequirement`
  - `formData.minimumFacilityTier`
  - payload fields `colocationDetails.coolingRequirement` and `colocationDetails.minimumFacilityTier`

- [ ] **Step 1: Write failing source-contract tests**

Create `src/pages/ContactPage.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./ContactPage.tsx", import.meta.url), "utf8");

test("colocation asks for cooling and minimum facility tier", () => {
  assert.match(source, /Cooling requirement/);
  assert.match(source, /Air cooled/);
  assert.match(source, /Liquid cooled/);
  assert.match(source, /Minimum facility tier/);
  assert.match(source, /Tier I/);
  assert.match(source, /Tier II/);
  assert.match(source, /Tier III/);
});

test("colocation payload includes cooling and facility tier", () => {
  assert.match(source, /coolingRequirement:/);
  assert.match(source, /minimumFacilityTier:/);
});

test("colocation submission requires both selections", () => {
  assert.match(source, /colocationRequirementsComplete/);
  assert.match(source, /Select a cooling requirement and minimum facility tier/);
});
```

- [ ] **Step 2: Run the new tests and verify RED**

Run:

```bash
node --import tsx --test src/pages/ContactPage.test.ts
```

Expected: failures because the labels, state, payload fields, and validation do not exist.

- [ ] **Step 3: Extend state and option metadata**

In `ContactPage.tsx`, add:

```ts
type CoolingRequirement = "air" | "liquid";
type FacilityTier = "tier-1" | "tier-2" | "tier-3";

const coolingOptions = [
  { value: "air", label: "Air cooled" },
  { value: "liquid", label: "Liquid cooled" },
] satisfies Array<{ value: CoolingRequirement; label: string }>;

const facilityTierOptions = [
  { value: "tier-1", label: "Tier I" },
  { value: "tier-2", label: "Tier II" },
  { value: "tier-3", label: "Tier III" },
] satisfies Array<{ value: FacilityTier; label: string }>;
```

Extend `FormData`:

```ts
coolingRequirement: CoolingRequirement | "";
minimumFacilityTier: FacilityTier | "";
```

Initialize and reset both fields to `""`.

- [ ] **Step 4: Add accessible single-select controls**

Add a focused button group beneath GPU selection:

```tsx
<div className="grid gap-6 md:grid-cols-2">
  <div className="space-y-3">
    <span className="block text-sm font-medium text-white">Cooling requirement</span>
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Cooling requirement">
      {coolingOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={formData.coolingRequirement === option.value}
          onClick={() => setFormData((previous) => ({ ...previous, coolingRequirement: option.value }))}
          className={formData.coolingRequirement === option.value ? selectedRequirementClass : requirementClass}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
  <div className="space-y-3">
    <span className="block text-sm font-medium text-white">Minimum facility tier</span>
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Minimum facility tier">
      {facilityTierOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={formData.minimumFacilityTier === option.value}
          onClick={() => setFormData((previous) => ({ ...previous, minimumFacilityTier: option.value }))}
          className={formData.minimumFacilityTier === option.value ? selectedRequirementClass : requirementClass}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
</div>
```

Use shared class strings with visible `focus-visible` outlines and a selected orange accent.

- [ ] **Step 5: Add validation, clearing, and payload mapping**

Compute:

```ts
const colocationRequirementsComplete =
  formData.serviceInterest !== "coloc" ||
  Boolean(formData.coolingRequirement && formData.minimumFacilityTier);
```

Prevent submission when false and set:

```ts
setErrorMessage("Select a cooling requirement and minimum facility tier.");
```

Map labels into the payload:

```ts
coolingRequirement:
  coolingOptions.find((option) => option.value === formData.coolingRequirement)?.label || "Not specified",
minimumFacilityTier:
  facilityTierOptions.find((option) => option.value === formData.minimumFacilityTier)?.label || "Not specified",
```

Clear both values inside `handleServiceChange`.

- [ ] **Step 6: Verify GREEN**

Run:

```bash
node --import tsx --test src/pages/ContactPage.test.ts src/components/HeroSection.test.ts
npm run build
```

Expected: five tests pass and the production build exits `0`.

- [ ] **Step 7: Commit the contact-form change**

```bash
git add src/pages/ContactPage.tsx src/pages/ContactPage.test.ts
git commit -m "feat: capture colocation facility requirements"
```

### Task 3: Add the GPU Colocation Pricing Banner

**Files:**
- Create: `src/components/pricing/ColocationBanner.tsx`
- Create: `src/components/pricing/ColocationBanner.test.ts`
- Modify: `src/pages/PricingPage.tsx`
- Modify: `src/pages/ColocationPage.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: React Router `Link`, pricing page section flow, Colocation calculator section.
- Produces: `<ColocationBanner />`; stable `#calculator` anchor.

- [ ] **Step 1: Write failing banner tests**

Create `src/components/pricing/ColocationBanner.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const banner = readFileSync(new URL("./ColocationBanner.tsx", import.meta.url), "utf8");
const colocationPage = readFileSync(new URL("../../pages/ColocationPage.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../../index.css", import.meta.url), "utf8");

test("banner explains customer-owned GPU colocation", () => {
  assert.match(banner, /GPU colocation/);
  assert.match(banner, /Already own the hardware/);
  assert.match(banner, /Bring your GPU servers/);
  assert.match(banner, /air or liquid cooling/);
});

test("banner links directly to the colocation calculator", () => {
  assert.match(banner, /to="\\/colocation#calculator"/);
  assert.match(banner, /Estimate colocation cost/);
  assert.match(colocationPage, /id="calculator"/);
});

test("ring animation respects reduced motion", () => {
  assert.match(styles, /@media \\(prefers-reduced-motion: reduce\\)/);
  assert.match(styles, /\\.colo-orbit/);
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
node --import tsx --test src/components/pricing/ColocationBanner.test.ts
```

Expected: test setup fails because `ColocationBanner.tsx` does not exist.

- [ ] **Step 3: Build the focused banner component**

Create a semantic `<section>` with:

```tsx
<span>GPU colocation</span>
<h2>Already own the hardware?</h2>
<p>
  Bring your GPU servers. Helios provides high-density power, air or liquid cooling,
  network connectivity, security and on-site operations.
</p>
<Link to="/colocation#calculator">
  Estimate colocation cost
  <ArrowRight aria-hidden="true" />
</Link>
```

Add two decorative elements:

```tsx
<div className="colo-orbit colo-orbit--outer" aria-hidden="true" />
<div className="colo-orbit colo-orbit--inner" aria-hidden="true" />
```

Use a quiet dark banner, asymmetric text placement, restrained border, and responsive clipping.

- [ ] **Step 4: Implement the radial-tick pattern**

In `src/index.css`, add a repeating-conic-gradient ring:

```css
.colo-orbit {
  position: absolute;
  border-radius: 9999px;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(255, 255, 255, 0.2) 0deg 0.7deg,
    transparent 0.7deg 4deg
  );
  -webkit-mask: radial-gradient(circle, transparent 61%, #000 62% 64%, transparent 65%);
  mask: radial-gradient(circle, transparent 61%, #000 62% 64%, transparent 65%);
  animation: colo-orbit-clockwise 48s linear infinite;
}

.colo-orbit--inner {
  animation-name: colo-orbit-counterclockwise;
  animation-duration: 38s;
}

@keyframes colo-orbit-clockwise {
  to { transform: rotate(360deg); }
}

@keyframes colo-orbit-counterclockwise {
  to { transform: rotate(-360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .colo-orbit { animation: none; }
}
```

Size and position rings in the component’s Tailwind classes so they stay clear of mobile copy and CTA.

- [ ] **Step 5: Integrate the banner and calculator anchor**

Import and render `<ColocationBanner />` in `PricingPage.tsx` after the calculator/rate section and before the final custom-pricing section. Add `id="calculator"` and `scroll-mt-24` to the existing Colocation calculator section.

- [ ] **Step 6: Verify GREEN**

Run:

```bash
node --import tsx --test src/components/pricing/ColocationBanner.test.ts
npm run build
```

Expected: three tests pass and the build exits `0`.

- [ ] **Step 7: Commit the pricing cross-sell**

```bash
git add src/components/pricing/ColocationBanner.tsx src/components/pricing/ColocationBanner.test.ts src/pages/PricingPage.tsx src/pages/ColocationPage.tsx src/index.css
git commit -m "feat: cross-sell GPU colocation from pricing"
```

### Task 4: Rebuild the Careers Page with Seeded Roles

**Files:**
- Create: `src/lib/careers.ts`
- Create: `src/lib/careers.test.ts`
- Modify: `src/pages/CareersPage.tsx`

**Interfaces:**
- Consumes: optional Sanity `careersPage.openPositions`.
- Produces:
  - `CareerRole`
  - `FALLBACK_CAREER_ROLES`
  - `careerApplicationHref(role)`
  - `generalCareerApplicationHref`

- [ ] **Step 1: Write failing careers-data tests**

Create `src/lib/careers.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  FALLBACK_CAREER_ROLES,
  careerApplicationHref,
  generalCareerApplicationHref,
} from "./careers";

test("fallback careers include three credible roles", () => {
  assert.deepEqual(
    FALLBACK_CAREER_ROLES.map((role) => role.title),
    ["Site Reliability Engineer", "Customer Success Engineer", "Data Center Deployment Engineer"],
  );
});

test("role applications open the existing contact flow with role context", () => {
  const href = careerApplicationHref(FALLBACK_CAREER_ROLES[0]);
  assert.match(href, /^\\/contact\\?service=others&message=/);
  assert.match(decodeURIComponent(href), /Site Reliability Engineer/);
});

test("general applications use the existing contact flow", () => {
  assert.match(generalCareerApplicationHref, /^\\/contact\\?service=others&message=/);
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
node --import tsx --test src/lib/careers.test.ts
```

Expected: module-not-found failure because `src/lib/careers.ts` does not exist.

- [ ] **Step 3: Implement careers data and URL helpers**

Create:

```ts
export interface CareerRole {
  title: string;
  team: string;
  location: string;
  summary: string;
}

export const FALLBACK_CAREER_ROLES: CareerRole[] = [
  {
    title: "Site Reliability Engineer",
    team: "Cloud Infrastructure",
    location: "Remote / Hybrid",
    summary: "Own reliability, observability, incident response and automation across Helios GPU infrastructure.",
  },
  {
    title: "Customer Success Engineer",
    team: "Customer Experience",
    location: "Remote / Hybrid",
    summary: "Help customers plan deployments, launch workloads and get dependable performance from Helios infrastructure.",
  },
  {
    title: "Data Center Deployment Engineer",
    team: "Infrastructure",
    location: "On-site / Travel",
    summary: "Coordinate rack, power, cooling, networking, validation and handoff for new GPU deployments.",
  },
];

export const careerApplicationHref = (role: CareerRole) =>
  `/contact?service=others&message=${encodeURIComponent(
    `I'm interested in the ${role.title} role. My relevant experience and links are:`,
  )}`;

export const generalCareerApplicationHref =
  `/contact?service=others&message=${encodeURIComponent(
    "I'm interested in joining Helios. My area of expertise and relevant experience are:",
  )}`;
```

- [ ] **Step 4: Verify careers data GREEN**

Run:

```bash
node --import tsx --test src/lib/careers.test.ts
```

Expected: three tests pass.

- [ ] **Step 5: Rebuild the careers presentation**

Replace the current decorative `BreathingVoid` section with:

- A typographic hero using `Careers at Helios`, `Build the infrastructure behind frontier AI.`, and the approved supporting copy.
- A `View open roles` anchor linking to `#open-roles`.
- A compact operating sequence: `Power → Facilities → GPU systems → Customer workloads`.
- Role cards using Sanity roles when present, otherwise `FALLBACK_CAREER_ROLES`.
- Role summary, team, location, and `View role` links generated by `careerApplicationHref`.
- Final `Don’t see your role?` section linking through `generalCareerApplicationHref`.

Keep one restrained signature visual: a faint infrastructure-grid treatment using borders and typography. Remove unused `BreathingVoid` and `Button` imports. Preserve `Navigation`, `Footer`, and subtle Framer Motion entrances with reduced-motion-safe transforms.

- [ ] **Step 6: Build and verify**

Run:

```bash
node --import tsx --test src/lib/careers.test.ts
npm run build
```

Expected: three careers tests pass and build exits `0`.

- [ ] **Step 7: Commit careers**

```bash
git add src/lib/careers.ts src/lib/careers.test.ts src/pages/CareersPage.tsx
git commit -m "feat: rebuild careers with open roles"
```

### Task 5: Lock the Capacity Map to the Supplied Schedule

**Files:**
- Create: `src/components/map/sites.test.ts`
- Modify only if the test reveals a discrepancy: `src/components/map/sites.ts`

**Interfaces:**
- Consumes: `COLO_SITES`.
- Produces: executable state/site/MW verification for the exact supplied schedule.

- [ ] **Step 1: Write map rollup tests**

Create:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { COLO_SITES } from "./sites";

test("capacity map matches the supplied state rollups", () => {
  const actual = Object.fromEntries(
    COLO_SITES.map(({ abbr, mw, siteCount }) => [abbr, { mw, siteCount }]),
  );

  assert.deepEqual(actual, {
    UT: { mw: 971, siteCount: 12 },
    TX: { mw: 906, siteCount: 5 },
    CO: { mw: 25, siteCount: 2 },
    CA: { mw: 23, siteCount: 2 },
    KY: { mw: 20, siteCount: 1 },
    ID: { mw: 10, siteCount: 1 },
    NJ: { mw: 6, siteCount: 1 },
  });
});

test("capacity map totals 24 sites across 7 states and 1,961 MW", () => {
  assert.equal(COLO_SITES.length, 7);
  assert.equal(COLO_SITES.reduce((sum, site) => sum + site.siteCount, 0), 24);
  assert.equal(COLO_SITES.reduce((sum, site) => sum + site.mw, 0), 1961);
});
```

- [ ] **Step 2: Run the tests**

Run:

```bash
node --import tsx --test src/components/map/sites.test.ts
```

Expected: two tests pass against the existing verified data. If they fail, adjust only the mismatched rollup values to the exact expected object above and rerun.

- [ ] **Step 3: Verify the live Sanity snapshot**

Run a read-only Sanity query for `site-capacity-current` and compare:

```text
siteCount = 24
totalMw = 1961
UT = 971 / 12
TX = 906 / 5
CO = 25 / 2
CA = 23 / 2
KY = 20 / 1
ID = 10 / 1
NJ = 6 / 1
```

Expected: live snapshot and fallback source agree exactly.

- [ ] **Step 4: Commit the regression tests**

```bash
git add src/components/map/sites.test.ts src/components/map/sites.ts
git commit -m "test: lock colocation capacity rollups"
```

### Task 6: Design Critique, Browser QA, and Full Verification

**Files:**
- Review: all files modified in Tasks 2–5
- Create screenshots under: `artifacts/screenshots/2026-07-19/`

**Interfaces:**
- Consumes: completed UI and Impeccable installation.
- Produces: reviewed UI, desktop/mobile screenshots, complete test/build evidence.

- [ ] **Step 1: Run the Impeccable critique**

Use the installed Impeccable workflow to critique the contact form, pricing banner, and careers page. Accept only changes that improve hierarchy, spacing, copy clarity, accessibility, or restraint while preserving the approved spec.

- [ ] **Step 2: Start a local production-like preview**

Run:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Expected: Vite preview serves the built site locally.

- [ ] **Step 3: Capture desktop screenshots**

At a 1440×1000 viewport, capture:

```text
/
/contact
/contact?service=coloc
/pricing
/colocation#calculator
/careers
```

Save PNG files with descriptive names in `artifacts/screenshots/2026-07-19/`.

- [ ] **Step 4: Capture mobile screenshots**

At a 390×844 viewport, capture:

```text
/contact?service=coloc
/pricing
/careers
```

Verify no horizontal overflow, clipped text, overlapping concentric rings, or undersized controls.

- [ ] **Step 5: Exercise key interactions**

Verify:

- Landing CTA opens `/contact?service=clusters`.
- `/contact` starts with Clusters selected.
- Colocation cannot submit without cooling and tier.
- Cooling/tier selected states work with keyboard focus.
- Pricing CTA lands at `/colocation#calculator`.
- Each careers role opens `/contact?service=others` with its role prefilled.
- Reduced-motion disables `.colo-orbit` rotation.

- [ ] **Step 6: Run fresh complete verification**

Run:

```bash
node --import tsx --test \
  src/components/HeroSection.test.ts \
  src/pages/ContactPage.test.ts \
  src/components/pricing/ColocationBanner.test.ts \
  src/lib/careers.test.ts \
  src/components/map/sites.test.ts
npm run lint
npm run build
git diff --check HEAD
```

Expected: all tests pass, lint has no errors introduced by this work, build exits `0`, and diff check is clean.

- [ ] **Step 7: Commit screenshot artifacts only if repository policy permits**

If screenshots are intended as review artifacts outside Git, leave them untracked. Otherwise:

```bash
git add artifacts/screenshots/2026-07-19
git commit -m "docs: add conversion flow screenshots"
```

### Task 7: Production Release

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: verified `main` branch commits.
- Produces: production Vercel deployment and post-deploy screenshots.

- [ ] **Step 1: Confirm repository and Vercel targets**

Run:

```bash
git remote -v
vercel project inspect helios-website
git branch --show-current
git status --short
```

Expected:

```text
origin -> https://github.com/HeliosEnergy/helios-website.git
myfork -> https://github.com/AmolDerickSoans/fireworks-clone.git
branch -> main
project -> helios-website
```

Only the pre-existing unrelated local files and optional untracked screenshots may remain outside commits.

- [ ] **Step 2: Push production branch**

Run:

```bash
git push origin main
```

Expected: push succeeds and triggers the configured Vercel production flow.

- [ ] **Step 3: Confirm production deployment**

Inspect the resulting Vercel production deployment until it reaches `Ready`. Confirm `helios.co` resolves to the new deployment.

- [ ] **Step 4: Run post-deploy smoke tests**

Repeat the interaction checks from Task 6 against `https://helios.co` and capture production screenshots for:

```text
/contact?service=coloc
/pricing
/careers
```

Expected: production matches the approved design and all destinations/prefills work.

