# Helios Conversion Forms, Colocation Cross-Sell, and Careers Design

## Objective

Improve the production Helios website’s conversion paths and careers presentation without changing its broader visual identity:

- Ensure the landing-page hero CTA opens the request form with Clusters selected.
- Add cooling and minimum facility-tier requirements to the Colocation inquiry flow.
- Add a distinct GPU-colocation cross-sell to the GPU pricing calculator.
- Verify the colocation map against the supplied 24-site capacity schedule.
- Replace the empty careers presentation with a credible, useful recruiting page and seeded roles.
- Capture desktop and mobile screenshots, verify the production target, and deploy from `main`.

## Current-State Findings

- The landing hero CTA currently links to `/contact?service=clusters`.
- The request form currently defaults to `serviceInterest: "clusters"` when no query parameter is supplied.
- Production and fallback map data currently agree with the supplied schedule:
  - 24 sites
  - 7 states
  - 1,961 MW total
  - Utah: 971 MW across 12 sites
  - Texas: 906 MW across 5 sites
  - Colorado: 25 MW across 2 sites
  - California: 23 MW across 2 sites
  - Kentucky: 20 MW across 1 site
  - Idaho: 10 MW across 1 site
  - New Jersey: 6 MW across 1 site
- No `careersPage` document currently exists in the production Sanity dataset, so the page renders its local fallback copy and has no open roles.

## Product and Interaction Design

### 1. Landing Hero Conversion Path

The landing-page CTA remains:

- Label: `Reserve capacity`
- Destination: `/contact?service=clusters`

The contact form must initialize with Clusters selected both when opened from this CTA and when opened without a `service` query parameter. Automated tests will cover both behaviors.

### 2. Colocation Requirements

When the user selects Colocation in the request form, show a focused requirements panel containing:

1. Existing GPU hardware selection.
2. Cooling requirement:
   - `Air cooled`
   - `Liquid cooled`
3. Minimum facility tier:
   - `Tier I`
   - `Tier II`
   - `Tier III`
4. Existing additional-notes field for power, rack-density, timing, and unusual requirements.

Cooling and facility tier use single-select segmented controls. Neither receives a silent default: the customer must make an explicit selection before submitting a Colocation inquiry. Labels use “Minimum facility tier” to avoid confusion with network tiers.

The Cloudflare contact payload gains a `colocationDetails` object with:

- `types`: comma-separated GPU types, or `Not specified`
- `coolingRequirement`: `Air cooled` or `Liquid cooled`
- `minimumFacilityTier`: `Tier I`, `Tier II`, or `Tier III`

Changing away from Colocation clears the cooling and tier selections so stale requirements cannot leak into another inquiry type.

### 3. GPU Pricing Colocation Banner

The GPU pricing page receives one cross-sell for customers who already own or plan to procure GPU hardware and need a facility rather than rented compute.

Placement: immediately after the primary calculator and reserved-rate content, before the existing enterprise contact section. The banner should read as a distinct next path, not as another calculator control.

Copy:

- Eyebrow: `GPU colocation`
- Heading: `Already own the hardware?`
- Body: `Bring your GPU servers. Helios provides high-density power, air or liquid cooling, network connectivity, security and on-site operations.`
- CTA: `Estimate colocation cost`
- Destination: `/colocation#calculator`

The Colocation page’s calculator section receives the stable anchor `id="calculator"` so the CTA lands directly on the useful content.

#### Banner Visual Treatment

The banner uses a dark, high-contrast field within the otherwise light pricing page. Its only signature graphic is a pair of low-contrast concentric rings made from fine radial ticks:

- Outer ring rotates slowly clockwise.
- Inner ring rotates slowly counter-clockwise.
- Tick opacity remains subtle enough that the copy is always dominant.
- The rings are clipped by the banner boundary and sit away from the main text block.
- No glow-heavy effects, particle systems, canvas, or WebGL are added.
- `prefers-reduced-motion: reduce` disables rotation while preserving the static pattern.
- The pattern is implemented with CSS and semantic decorative elements marked `aria-hidden="true"`.

### 4. Careers Page

The careers page becomes an editorial recruiting page grounded in Helios’s real work: power, facilities, GPU infrastructure, reliability, and customer outcomes.

#### Hero

- Eyebrow: `Careers at Helios`
- Heading: `Build the infrastructure behind frontier AI.`
- Supporting copy: `Helios brings power, data centers and accelerated computing together. Join the people turning scarce infrastructure into dependable capacity.`
- Primary CTA: `View open roles`, scrolling to the role list.

The hero remains dark and typographic. Decorative motion stays subordinate to the recruiting message.

#### Operating Story

A compact horizontal sequence communicates the work:

`Power → Facilities → GPU systems → Customer workloads`

Supporting text emphasizes practical ownership, disciplined execution, and work that moves between software and physical infrastructure.

#### Seeded Roles

The page includes three local fallback roles:

1. `Site Reliability Engineer`
   - Team: `Cloud Infrastructure`
   - Location: `Remote / Hybrid`
   - Summary: Own reliability, observability, incident response, and automation across Helios GPU infrastructure.
2. `Customer Success Engineer`
   - Team: `Customer Experience`
   - Location: `Remote / Hybrid`
   - Summary: Help customers plan deployments, launch workloads, and get dependable performance from Helios infrastructure.
3. `Data Center Deployment Engineer`
   - Team: `Infrastructure`
   - Location: `On-site / Travel`
   - Summary: Coordinate rack, power, cooling, networking, validation, and handoff for new GPU deployments.

If Sanity later supplies open positions, those positions replace the local fallback roles while preserving the same card presentation.

Each `View role` action opens:

`/contact?service=others&message=<encoded role-specific introduction>`

The message identifies the role and asks the applicant to include relevant experience and links. This avoids inventing an ATS or unconfirmed careers email.

#### Open Application

The final section reads:

- Heading: `Don’t see your role?`
- Body: `We still want to hear from exceptional builders working across infrastructure, energy, systems and customer operations.`
- CTA: `Introduce yourself`
- Destination: `/contact?service=others&message=<encoded general careers introduction>`

### 5. Copy Principles

- Distinguish clearly between Clusters and Colocation:
  - Clusters: Helios-provided GPU compute capacity.
  - Colocation: customer-owned GPU hardware hosted in Helios-provided space, power, cooling, connectivity, security, and facility operations.
- Use plain, specific language and active verbs.
- Avoid generic startup claims, inflated culture language, and vague calls to “change the world.”
- CTA labels state the action and destination.

## Responsive and Accessibility Requirements

- All new controls work with keyboard navigation and display visible focus states.
- Segmented controls expose selected state through native buttons and `aria-pressed`.
- Form validation identifies the missing Colocation requirement adjacent to the relevant control.
- The pricing banner remains readable at 320 px viewport width.
- The concentric-ring pattern never overlaps the primary CTA at mobile sizes.
- All motion respects `prefers-reduced-motion`.
- Careers role cards preserve readable hierarchy without hover-only information.

## Testing and Verification

Automated coverage will verify:

- Hero CTA destination.
- Default Clusters selection.
- Colocation cooling and facility-tier choices.
- Colocation submission validation.
- Contact payload mapping for Colocation requirements.
- Pricing banner copy and destination.
- Stable Colocation calculator anchor.
- Seeded careers roles and role-specific application URLs.
- State-by-state map totals, site count, state count, and 1,961 MW grand total.

Manual browser QA will cover:

- Desktop and mobile landing hero.
- Default and Colocation contact-form states.
- Pricing calculator plus the new Colocation banner and subtle animation.
- Colocation calculator anchor landing.
- Careers hero, role list, and application routing.
- Colocation map labels and state totals.

Screenshots will be captured before deployment and again from the production deployment.

## Release Constraints

- Work only in `/Users/amoldericksoans/Documents/Helios/helios-website`.
- Preserve unrelated local changes in `.claude/launch.json` and existing untracked privacy-policy drafts.
- Use the requested Impeccable tooling as an implementation critique pass after its installer is verified.
- Before any Vercel action, confirm:
  - `git remote -v`
  - `vercel project inspect helios-website`
- Deploy the production `main` branch only after tests, lint/build checks, browser QA, and screenshots pass.

