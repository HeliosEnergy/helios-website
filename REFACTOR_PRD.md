# Helios Website Refactor — PRD

**Owner:** info@heliosenergy.io
**Date:** 2026-06-16
**Repo:** helios-website (React 19 + Vite + Tailwind v3 + framer-motion; CMS = Sanity)
**Branch policy:** branch off `main`, do not push without explicit approval.

---

## 0. How the implementing agent should work

This is a multi-surface visual refactor. Do **not** edit blind. For every task below:

1. **Run the dev server** (vite only, not the Sanity-bundled `npm run dev`):
   ```
   npx vite --port 5173
   ```
2. **Screenshot the target section BEFORE editing** so you understand current layout, spacing, copy, and which component actually renders. Use the existing CDP screenshot harness:
   - `/tmp/shot_m.cjs <url> <out.png> <scrollY>` (mobile, 390px) — already on disk.
   - For desktop and WebGL (the maps), use the desktop harness with `--use-gl=angle --use-angle=swiftshader --enable-webgl --ignore-gpu-blocklist`.
   - The home page has **multiple `<canvas>` elements**; scroll by probing element y-position via `Runtime.evaluate`, not by guessing. `whileInView` content needs a real `window.scrollTo` + ~2.5–4.5s wait before capture.
   - Routes to capture: `/` (home), `/colocation`, `/sustainability`, `/pricing`, `/contact`, plus the waitlist surface.
3. **Screenshot AFTER editing** and compare. Verify desktop **and** 390px mobile for anything layout-affecting.
4. Respect existing design memory constraints: no background-clip gradient text; single restrained accent (orange `--primary` / eco-green `--eco`) on cool neutral; avoid identical 3-card grids; "calm instrument" aesthetic.
5. **Do not invent product facts.** Pricing, GPU SKUs, and renewable claims are business-sensitive — where a value isn't specified here, leave a clearly-marked `TODO(owner)` and add it to the end-of-run questions list rather than guessing.

⚠️ **CMS caveat:** GPU models, prices, and pricing tiers are **fetched from Sanity at runtime** (`src/hooks/usePricingData.ts`, `_type == "gpuModel"`). Editing the `/pricing` React code will **not** change the rendered GPU list or prices on its own — those records live in Sanity. Flag every Sanity-dependent change in the final questions list so the owner can update the CMS (or grant access / a migration script).

---

## 1. Waitlist

**File(s):** search the waitlist surface (`grep -ri waitlist src`). The service-interest enum lives in `src/pages/ContactPage.tsx:16` and is mirrored in nav/dropdowns.

### 1.1 Remove "Press" from the waitlist
- Remove the **Press** option wherever the waitlist/contact service-interest list is rendered.
- In `ContactPage.tsx`: remove `'press'` from the `ServiceInterest` union (line 16) and the `press: 'Press'` label (line 265), plus any chip/option array that lists it.
- Verify no remaining references (`grep -rn "'press'" src`) and that removing it doesn't break the `searchParams` prefill or submit payload.
- **Acceptance:** Press no longer appears as a selectable interest on the waitlist/contact form; build is clean; other interests still work.

> **Owner decision: keep the standalone Press page** (`src/pages/PressPage.tsx`) and its nav link. Only remove Press from the waitlist/contact service-interest options.

---

## 2. Cluster / Baremetal sizing slider

**File:** `src/pages/ContactPage.tsx` — `DualRangeSlider` (lines ~640–650), `gpuRange` state (`[8, 64]` default, line 279), `clusterOptions` (lines 252–257), and the `formData.serviceInterest === 'clusters'` conditional block (line 622). Component: `src/components/ui/dual-range-slider.tsx`.

### 2.1 Slider counts NODES, not GPUs  — RESOLVED
- Change the slider semantics from GPU count to **node (server) count**.
- Below the slider, show the **total GPUs** those nodes represent, derived from a per-SKU **GPUs-per-node** constant.
  - Example UX: slider reads **64–128 nodes** → caption reads **512–1024 GPUs**.
- **Per-SKU unit (owner-confirmed):**
  - **B300, RTX PRO 6000, 5090 → 8 GPUs per node** (`GPUS_PER_NODE = 8`).
  - **GB300 NVL72 → a separate entity that scales in units of 72 GPUs** (1 unit = one NVL72 rack = 72 GPUs). When GB300 NVL72 is the selected type, the slider counts **NVL72 racks** and the GPU caption steps by 72 (e.g. "4–8 racks → 288–576 GPUs"). Do **not** mix it into the 8-per-node math.
- Rename label `Approximate GPU Count` → `Approximate Node Count` (or "NVL72 racks" when GB300 is selected); `formatLabel` renders `${v} nodes` / `${v} racks`; add a derived sub-caption showing total GPUs.

### 2.2 Slider max = "1024+" nodes (8192 GPUs)
- Set slider `max` to **1024 nodes**. When the upper handle is at max, display **"1024+"** (and **"8192+ GPUs"** in the caption).
- Pick a sensible `min`/`step` for a node-scale range (e.g. min 1, step that keeps the track usable across 1→1024 — consider a non-linear/stepped scale or coarse step so the handle is draggable). Keep defaults coherent (e.g. default `[8, 64]` nodes).
- Update the submit payload (`gpuCountMin`/`gpuCountMax`, lines 445–446) to send node counts (or both nodes and derived GPU totals) — confirm field naming with the owner so CRM/email parsing stays correct.

### 2.3 Only show GPUs we offer
- `clusterOptions` (lines 252–257) currently lists: `RTX 6000 Pro, B200, B300, H200 SXM, H100`.
- Reduce to the **offered set only: GB300, B300, RTX PRO 6000, 5090** (align exactly with the Pricing requirement in §6). Remove B200, H200 SXM, H100. Add GB300 and 5090.
- Update the `ClusterType` union (line 17) and the `?cluster=` prefill mapping accordingly.

### 2.4 Show the slider for Baremetal too
- The node/GPU sizing block currently renders only for `serviceInterest === 'clusters'` (line 622).
- Make the same block render for **`'baremetal'`** as well. Either change the condition to `=== 'clusters' || === 'baremetal'`, or extract the block into a small component and render it under both. Keep the submit payload conditional consistent (line 438) so baremetal submissions include node/GPU sizing.
- **Acceptance:** selecting "Baremetal" reveals the node slider + GPU-type chips + derived GPU caption, identical to Clusters.

---

## 3. Home page

**File:** `src/components/HomeRevampSections.tsx`; map: `src/components/map/FootprintSection.tsx`, `SiteMapScene.tsx`, `sites.ts`.

### 3.1 Home map and Colocation map "don't add up"  — RESOLVED
- Root cause: `DC_SITES` (home) = 3 sites (Utah, North Carolina, Florida); `COLO_SITES` (colo) = `...DC_SITES` + Kentucky + Texas = 5 sites (`src/components/map/sites.ts:31,70`).
- **Owner decision: show all 5 sites on BOTH the landing and colocation maps.** Point the home `FootprintMap` at the 5-site list (use `COLO_SITES` for both, or merge so home renders all 5).
- Update the home copy: *"Three sites across three grids today"* (`FootprintSection.tsx:116-118`) → reflect **five sites**. Keep the shared `SiteMapScene` styling so the two maps look identical.

### 3.2 "Two ways to get Blackwell-class compute" — better imagery  — DEFERRED (owner: "don't do for now")
> Skip the imagery swap for this section in this pass. Revisit later.

#### (original spec, parked)
- Section heading at `HomeRevampSections.tsx:151`. The two option cards use:
  - Cloud/cluster card → `image: "/gpus/dgx-b200.jpg"` (line 47)
  - Colo card → `image: "/coloc/hall-interior-rack-corridor.png"` (line 72)
- Replace with **more relevant, accurate** images for "cloud" vs "colo":
  - Cloud: a real Blackwell server/rack we actually offer (GB300 NVL72 / B300), **not** a B200 DGX stand-in.
  - Colo: a real or clearly-rendered Helios hall/module image (coordinate with §4.1 so it isn't mistaken for a photo if it's a render).
- Source images must be **real (non-AI-generated)** and license-clean. Add new assets under `public/gpus/` and `public/coloc/`.

### 3.3 GB300 image near the bottom is not a GB300  — DEFERRED (owner: "leave this alone")
- Owner deferred sourcing a real GB300 NVL72 photo for now. **Do not change the GB300 image in this pass.** Leave existing imagery as-is and revisit when the owner supplies a licensed photo.

### 3.4 Sustainability section — fix the "100% renewable" claim  — RESOLVED (copy below)
- Home `HomeSustainabilitySection` currently shows the third metric as `100 / %` implying 100% renewable.
- **Owner direction: "we aim for the highest renewable [share]" and change the number to ~70%.** Use this improved, accurate copy (refine wording, keep it clean):
  - **Metric:** value `~70`, unit `%`, label **"Renewable energy mix"**.
  - **Body:** *"We build next to clean generation and aim for the highest renewable share we can — around 70% across our sites today, and climbing as we add capacity."*
  - Set the Scandinavian bar `fill` to `0.7` (not a maxed-out 100%).
- Mirror on the Sustainability **page** (§5.2) so the two are consistent.

### 3.5 Highlight custom cluster configurations  — copy provided
- Add a clear callout that **Helios supports custom configurations**. Use owner-provided copy (B300, generalizable):
  > "Let us know what B300 configuration you would like and we can provide that version. We can be flexible on CPU type, storage, network equipment, etc."
- Likely homes: inside the "Two ways…" cloud/cluster card, or a short line near the sizing/CTA, linking to `/contact?service=clusters`.
- Keep it consistent with the instrument aesthetic; one restrained accent. **Acceptance:** a visitor can tell custom configs are available without reading fine print.

---

## 4. Colocation tab

**File:** `src/pages/ColocationPage.tsx`.

### 4.1 Replace AI-looking images at the bottom with a diagram / 3D rendering
- Bottom images: `/coloc/site-overview-aerial.png` (line 378) and `/coloc/hall-interior-rack-corridor.png` (line 391) read as AI photos.
- Replace with a **diagram or 3D rendering** (clearly non-photographic) so visitors don't think they're real photos. Either:
  - Swap in the existing 3D/plan renders (`module-enclosure.png`, `module-structure.png`, `mdch02-plan.png`), or
  - Commission/produce a labeled isometric diagram of a Helios module.
- If a render is used, consider a small caption/label ("Rendering" / "Schematic") to set expectations.

### 4.2 3D-rendered data center: hover instead of auto-change  — RESOLVED (no new asset)
- The `ModuleViewer` component (`ColocationPage.tsx:143-169`) already cross-fades between **two existing renders** — `01 · Enclosure` (`/coloc/module-enclosure.png`, skin on) and `02 · Structure` (`/coloc/module-structure.png`, skin off / X-ray) — on a **4200ms auto `setInterval`** (lines 146-152).
- **Owner decision: replace the auto-change with a hover effect.** Default state shows the enclosure (skin on); on **cursor hover** cross-fade to the structure (skin off) view; revert on mouse-leave. No new transparent asset needed — the second render is the transparent/X-ray version.
- Remove the `setInterval`/`useEffect` timer; drive `view` from hover state (`onMouseEnter`/`onMouseLeave`). Keep the existing 0.8s ease cross-fade. Provide a **touch fallback** (tap toggles) for mobile and respect `prefers-reduced-motion`.

---

## 5. Sustainability tab

**File:** `src/pages/SustainabilityPage.tsx`.

### 5.1 Dry-cooler image placeholder  — RESOLVED (remove it)
- Placeholder at `SustainabilityPage.tsx:428` (`ImagePlaceholder label="Placeholder — dry cooler / cold plate macro…"`).
- **Owner decision: remove the dry-cooler block entirely** (no image to source). Delete the placeholder and tidy the surrounding layout/spacing so nothing leaves an empty gap.
- (A second placeholder at line 566 — "aerial: Helios site beside solar field at dusk" — is out of scope; leave as a known gap unless the owner says otherwise.)

### 5.2 Renewable claim accuracy (consistency with §3.4)  — RESOLVED (copy below)
- Line ~506 reads **"100 of 100 sites — renewable-backed."** (implies 100%).
- Reword to the ~70% / "aim for highest renewable" framing. Suggested:
  - Headline figure: **"~70% renewable across our sites — and climbing."**
  - Supporting: *"We aim for the highest renewable share at every site. Renewable energy is part of every site's mix today — about 70% overall — and we keep pushing it higher through long-term clean-power agreements."*
- Use the **same** language/number as the home section (§3.4). Get a final wording sign-off before shipping (public claim).

---

## 6. Pricing tab

**File:** `src/pages/PricingPage.tsx`, `src/components/pricing/*`, data via `src/hooks/usePricingData.ts` (Sanity).

### 6.1 Remove GPUs we don't offer; only list the offered set
- Offered set: **GB300, B300, RTX PRO 6000, 5090.**
- Remove all others (H100, H200, B200, A100, etc.).
- ⚠️ The GPU list is **Sanity-driven** (`gpuModel` documents).
- **Owner decision: do it through Sanity** (not a code allow-list). A `SANITY_WRITE_TOKEN` exists in `.env.local` and `migrate-to-sanity.ts` is the pattern to copy. Write a small idempotent script that: keeps/creates only **GB300 NVL72, B300, RTX PRO 6000, 5090**, and removes/disables the rest. ⚠️ This writes to the **production** dataset — confirm before running.
- Note: GPU `name`s in Sanity must match the offered set; the contact-page `clusterOptions` (§2.3) should mirror them.

### 6.2 Use the latest prices  — partially confirmed
Owner-confirmed rates ($/GPU/hr), by reservation term:

| GPU | 1 year | 3 year | 5 year |
|---|---|---|---|
| **RTX PRO 6000** | $1.70 | $1.40 | TODO(owner) |
| **B300** | $4.80 | $4.20 | $3.80 |
| **GB300 NVL72** | TODO(owner) | TODO(owner) | TODO(owner) |
| **5090** | TODO(owner) | TODO(owner) | TODO(owner) |

- **Owner decision: apply confirmed numbers via Sanity; leave the blanks AS-IS** (don't guess). The missing rates (GB300 NVL72 all terms, 5090 all terms, RTX 5-year) go into the **founder Slack message** (§9) to collect.
- ⚠️ **Data-model caveat:** `gpuModel` has a single `heliosPrice`; per-term rates currently come from `pricingTier.discount`. B300's $4.80/$4.20/$3.80 isn't a clean single-discount curve, so per-term explicit pricing may need a schema tweak (e.g. a `prices` object keyed by term) **or** modeling base = 1yr with tier discounts that reproduce the numbers. Flag this in the Slack message / decide with owner before writing.
- **B300 is custom-configurable** — surface the §3.5 copy near B300 pricing.

---

## 7. Out-of-scope / do-not-touch
- Don't restyle unrelated sections, change the global theme, or refactor the map shader beyond what §3.1 requires.
- Don't push to `main` or open a PR without explicit approval.
- Don't fabricate prices, GPU specs, renewable percentages, or GPUs-per-node.

---

## 8. End-of-run deliverable (REQUIRED)

When the run finishes, the implementing agent must output:

### 8.A ✅ Checklist of what was done
For each item below, mark `[x] done` / `[~] partial` / `[ ] blocked`, with the file(s) changed and a one-line note. Attach before/after screenshots (desktop + mobile) for every visual change.

- [ ] 1.1 Press removed from waitlist
- [ ] 2.1 Slider counts nodes; GPU total caption shown
- [ ] 2.2 Slider max = 1024+ nodes / 8192 GPUs
- [ ] 2.3 GPU chips limited to GB300 / B300 / RTX PRO 6000 / 5090
- [ ] 2.4 Slider shows for Baremetal
- [ ] 3.1 Home vs colo map reconciled
- [ ] 3.2 "Two ways" imagery improved (cloud + colo)
- [ ] 3.3 Real GB300 image (non-AI)
- [ ] 3.4 Home renewable claim corrected (not 100%)
- [ ] 3.5 Custom cluster configs highlighted
- [ ] 4.1 Colo bottom images → diagram/3D render
- [ ] 4.2 3D data center hover → transparent variant
- [ ] 5.1 Dry-cooler image placed
- [ ] 5.2 Sustainability renewable claim corrected
- [ ] 6.1 Pricing GPU list limited to offered set
- [ ] 6.2 Latest prices applied (RTX $1.40/3yr + others)

### 8.B ❓ Questions / blockers for the owner

**RESOLVED (2026-06-16):**
- ✅ GPUs-per-node: 8 for B300/RTX/5090; GB300 NVL72 is a separate entity scaling in 72s.
- ✅ Maps: show all 5 sites on both landing and colo; update "Three sites" copy.
- ✅ GB300 photo (§3.3): leave alone for now.
- ✅ Colo render: replace auto-change with hover (uses the existing 2nd render; no new asset).
- ✅ Dry cooler: remove the block entirely.
- ✅ Prices: RTX PRO 6000 1yr $1.70 / 3yr $1.40; B300 1yr $4.80 / 3yr $4.20 / 5yr $3.80.
- ✅ Custom-config copy provided for §3.5.

**RESOLVED (round 2):**
- ✅ Missing prices → leave as-is; collect via founder Slack message (§9).
- ✅ Pricing/GPU list → do it through **Sanity** (`SANITY_WRITE_TOKEN` present; mirror `migrate-to-sanity.ts`).
- ✅ Press page → keep standalone; only remove from waitlist.
- ✅ Renewable → "we aim for highest renewable", ~70%, improved copy (§3.4/§5.2).
- ✅ §3.2 "Two ways" imagery → don't do for now.

**STILL OPEN:**
1. **Missing prices** (to gather via §9 Slack): GB300 NVL72 (1/3/5yr), 5090 (1/3/5yr), RTX PRO 6000 (5yr).
2. **Per-term pricing model:** confirm whether to extend the `gpuModel` schema for explicit per-term prices vs. tier-discounts (B300 numbers don't fit one discount curve).
3. **Production Sanity write:** confirm it's OK to run the write script against the production dataset.
4. **Renewable copy sign-off:** approve final ~70% wording before it ships publicly.
5. **Colo bottom images (§4.1):** which diagram/3D render replaces the AI-looking aerial/hall photos? (Not addressed yet.)

---

## 9. End-of-run deliverable: founder Slack message (REQUIRED)

At the end of the run, produce a ready-to-send Slack message for the owner to forward to their founder, requesting the missing data. Keep it short, specific, copy-paste-able. It must ask for:

1. **Pricing gaps** ($/GPU/hr by term):
   - GB300 NVL72 — 1yr / 3yr / 5yr
   - 5090 — 1yr / 3yr / 5yr
   - RTX PRO 6000 — 5yr (have 1yr $1.70, 3yr $1.40)
   - (Confirm B300 1yr $4.80 / 3yr $4.20 / 5yr $3.80 is current.)
2. **Renewable %** — confirm the ~70% figure is accurate to publish (and whether it's per-site or portfolio-wide).
3. **Colo imagery** — a real diagram or 3D render to replace the AI-looking aerial/hall photos.
4. **GB300 NVL72 photo** — a licensed, non-AI image when available (parked, §3.3).

A draft of this message is also surfaced directly in chat at the end of the run.
