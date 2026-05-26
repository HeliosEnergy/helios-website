# Navbar Complete Audit & Documentation

> **Last Updated:** February 2, 2026
> **Status:** 🔴 ~40 links not connected

---

## Table of Contents

1. [Overview](#overview)
2. [Navigation Structure](#navigation-structure)
3. [Platform Dropdown](#1-platform-dropdown)
4. [Models Dropdown](#2-models-dropdown)
5. [Developers Dropdown](#3-developers-dropdown)
6. [Pricing](#4-pricing)
7. [Partners Dropdown](#5-partners-dropdown)
8. [Resources Dropdown](#6-resources-dropdown)
9. [Company Dropdown (Mobile Only)](#7-company-dropdown-mobile-only)
10. [CTA Buttons](#8-cta-buttons)
11. [Link Status Summary](#link-status-summary)
12. [Recommended Actions](#recommended-actions)

---

## Overview

The Helios navbar consists of 7 main navigation items with 6 mega-dropdown menus. The dropdowns follow a consistent 3-column layout pattern with:
- **Column 1:** Primary navigation/categories
- **Column 2:** Secondary content/grid items
- **Column 3:** Featured content/CTA (dark background `#111111`)

### File Locations
```
src/components/Navbar.tsx                    # Main navbar component
src/components/nav/PlatformDropdown.tsx      # Platform mega menu
src/components/nav/ModelsDropdown.tsx        # Models mega menu
src/components/nav/DevelopersDropdown.tsx    # Developers mega menu
src/components/nav/PartnersDropdown.tsx      # Partners mega menu
src/components/nav/ResourcesDropdown.tsx     # Resources mega menu
src/components/nav/*.mobile.tsx              # Mobile versions of all dropdowns
```

---

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]    Platform  Models  Developers  Pricing  Partners  Resources       │
│                                                              [Login] [Signup]│
└─────────────────────────────────────────────────────────────────────────────┘
```

| Nav Item | Type | Dropdown | Route |
|----------|------|----------|-------|
| Platform | Dropdown | ✅ Yes | - |
| Models | Dropdown | ✅ Yes | - |
| Developers | Dropdown | ✅ Yes | - |
| Pricing | Direct Link | ❌ No | `/pricing` |
| Partners | Dropdown | ✅ Yes | - |
| Resources | Dropdown | ✅ Yes | - |
| Company | Mobile Only | ✅ Yes | - |

---

## 1. Platform Dropdown

**File:** `src/components/nav/PlatformDropdown.tsx`
**Width:** 1000px minimum

### Column 1: Infrastructure
| Content | Description |
|---------|-------------|
| Header | "Infrastructure" |
| Subtext | "Fast prototyping to production scale." |

| Link | Target | Status |
|------|--------|--------|
| For AI Natives | `#` | 🔴 Not connected |
| For Enterprises | `#` | 🔴 Not connected |

### Column 2: Capabilities (2x3 Grid)
| Link | Icon | Target | Status |
|------|------|--------|--------|
| Code Assistance | `Code` | `#` | 🔴 Not connected |
| Conversational AI | `MessageSquare` | `#` | 🔴 Not connected |
| Agentic Systems | `Bot` | `#` | 🔴 Not connected |
| Semantic Search | `Search` | `#` | 🔴 Not connected |
| Multimedia | `Play` | `#` | 🔴 Not connected |
| Enterprise RAG | `Building` | `#` | 🔴 Not connected |

### Column 3: Partner Spotlight (Featured)
| Content | Value |
|---------|-------|
| Badge | "Partner Spotlight" (orange) |
| Partner Logo | CURSOR |
| Quote | "Helios helps implement task specific speed ups..." |
| Attribution | Sualeh Asif, CPO, Cursor |
| Avatar | Placeholder gradient circle |

**Total Links:** 8
**Connected:** 0
**Not Connected:** 8

---

## 2. Models Dropdown

**File:** `src/components/nav/ModelsDropdown.tsx`
**Width:** 1000px minimum

### Column 1: Classification (2x3 Grid)
| Link | Icon | Target | Status |
|------|------|--------|--------|
| Featured | `Sparkles` | `/model-library?filter=Featured` | 🟢 Connected |
| Serverless | `Server` | `/model-library?filter=Serverless` | 🟢 Connected |
| Language | `Brain` | `/model-library?filter=Language` | 🟢 Connected |
| Vision | `Image` | `/model-library?filter=Vision` | 🟢 Connected |
| Audio | `AudioLines` | `/model-library?filter=Audio` | 🟢 Connected |
| Multimodal | `Eye` | `/model-library?filter=Multimodal` | 🟢 Connected |

### Column 2: The Ecosystem (Provider Grid)
| Link | Symbol | Target | Status |
|------|--------|--------|--------|
| Qwen | ✦ | `/model-library?filter=provider:Qwen` | 🟢 Connected |
| OpenAI | ⬡ | `/model-library?filter=provider:OpenAI` | 🟢 Connected |
| Moonshot | ☾ | `/model-library?filter=provider:Moonshot` | 🟢 Connected |
| Meta | ∞ | `/model-library?filter=provider:Meta` | 🟢 Connected |
| DeepSeek | ◇ | `/model-library?filter=provider:DeepSeek` | 🟢 Connected |
| Z.ai | Z | `/model-library?filter=provider:Z.ai` | 🟢 Connected |

### Column 3: Library Stats & Featured Models
| Content | Value |
|---------|-------|
| Badge | "Library" (orange) |
| Stat | "400+" |
| Description | "Models supported with optimized inference." |

**Featured Model Links:**
| Link | Target | Status |
|------|--------|--------|
| GLM-4.6 | `#` | 🔴 Not connected |
| DeepSeek V3 | `#` | 🔴 Not connected |
| Kimi K2 Instruct | `#` | 🔴 Not connected |

**CTA Button:**
| Link | Target | Status |
|------|--------|--------|
| Explore All | `/model-library` | 🟢 Connected |

**Total Links:** 16
**Connected:** 13
**Not Connected:** 3

---

## 3. Developers Dropdown

**File:** `src/components/nav/DevelopersDropdown.tsx`
**Width:** 1000px minimum

### Column 1: Toolkit
| Link | Target | Status |
|------|--------|--------|
| SDK | `#` | 🔴 Not connected |
| EvalProtocol | `#` | 🔴 Not connected |
| Voice Agent | `#` | 🔴 Not connected |

### Column 2: Resources (2x2 Grid)
| Link | Icon | Target | Status |
|------|------|--------|--------|
| Docs | `BookOpen` | `#` | 🔴 Not connected |
| API Reference | `FileCode` | `#` | 🔴 Not connected |
| CLI Tool | `Terminal` | `#` | 🔴 Not connected |
| Changelog | `List` | `#` | 🔴 Not connected |

### Column 2: Lifecycle Section
**Build:**
| Link | Target | Status |
|------|--------|--------|
| LLMs | `#` | 🔴 Not connected |
| Multimodal | `#` | 🔴 Not connected |

**Tune:**
| Link | Target | Status |
|------|--------|--------|
| SFT | `#` | 🔴 Not connected |
| RFT | `#` | 🔴 Not connected |

**Scale:**
| Link | Target | Status |
|------|--------|--------|
| Serverless | `#` | 🔴 Not connected |
| Reserved | `#` | 🔴 Not connected |

### Column 3: Community
| Content | Value |
|---------|-------|
| Badge | "Community" (orange) |
| Description | "Join the architects of the next intelligence frontier." |

**Social Links:**
| Link | Icon | Target | Status |
|------|------|--------|--------|
| Twitter | `Twitter` | `#` | 🔴 Not connected |
| YouTube | `Youtube` | `#` | 🔴 Not connected |
| LinkedIn | `Linkedin` | `#` | 🔴 Not connected |
| Community Chat | `MessageCircle` | `#` | 🔴 Not connected |

**CTA Button:**
| Link | Target | Status |
|------|--------|--------|
| Get Started | `#` | 🔴 Not connected |

**Total Links:** 18
**Connected:** 0
**Not Connected:** 18

---

## 4. Pricing

**Type:** Direct Link (no dropdown)
**Target:** `/pricing`
**Status:** 🟢 Connected

**Page Features:**
- Sidebar navigation (Clusters, Inference, GPUs)
- 6-tier commitment dropdown
- Hourly/Monthly toggle
- GPU calculator with competitor pricing
- Inference calculator
- Provider comparison table

---

## 5. Partners Dropdown

**File:** `src/components/nav/PartnersDropdown.tsx`
**Width:** 1000px minimum

### Column 1: Alliances
| Link | Icon | Target | Status |
|------|------|--------|--------|
| Cloud & Infrastructure | `Cloud` | `#` | 🔴 Not connected |
| Consulting & Services | `Users` | `#` | 🔴 Not connected |
| Technology Partners | `Settings` | `#` | 🔴 Not connected |

### Column 2: Accelerate (Startups Program)
| Content | Value |
|---------|-------|
| Card Title | "Helios for Startups" |
| Card Description | "Exclusive credits, technical support, and architectural guidance..." |

| Link | Target | Status |
|------|--------|--------|
| Apply for the program | `#` | 🔴 Not connected |

### Column 3: Collaboration CTA
| Content | Value |
|---------|-------|
| Badge | "Collaboration" (orange) |
| Heading | "Build with Helios." |
| Description | "Join our network of strategic vendors..." |

**CTA Button:**
| Link | Target | Status |
|------|--------|--------|
| Become a Partner | `#` | 🔴 Not connected |

**Total Links:** 5
**Connected:** 0
**Not Connected:** 5

---

## 6. Resources Dropdown

**File:** `src/components/nav/ResourcesDropdown.tsx`
**Width:** 1100px minimum

### Column 1: Knowledge
| Link | Icon | Target | Status |
|------|------|--------|--------|
| ~~Blog~~ | `Newspaper` | `/blog` | 🟡 Hidden (waiting for content) |
| Documentation | `BookOpen` | `#` | 🔴 Not connected |
| Demos | `PlayCircle` | `#` | 🔴 Not connected |
| Cookbooks | `Book` | `#` | 🔴 Not connected |

### Column 2: Featured Articles
**Article 1:**
| Field | Value |
|-------|-------|
| Badge | "Research" (orange) |
| Title | "Your AI Benchmark is Lying to You." |
| Subtitle | "Exposing the truth in performance metrics." |
| Link | `#` |
| Status | 🔴 Not connected |

**Article 2:**
| Field | Value |
|-------|-------|
| Badge | "Tutorial" (orange) |
| Title | "Eval-Driven Development with Claude." |
| Subtitle | "A new paradigm for reliable agents." |
| Link | `#` |
| Status | 🔴 Not connected |

### Column 3: Helios Energy (Company Links)
| Link | Target | Status |
|------|--------|--------|
| About Us | `#` | 🔴 Not connected |
| Careers | `/careers` | 🟢 Connected |
| Events | `/events` | 🟢 Connected |
| Newsroom | `/press` | 🟢 Connected |
| Contact | `/contact` | 🟢 Connected |

**Footer Section:**
| Content | Value |
|---------|-------|
| Label | "Current Status" |
| Indicator | Green dot (pulsing) |
| Text | "All Systems Operational" |

**Total Links:** 10
**Connected:** 4
**Not Connected:** 6

---

## 7. Company Dropdown (Mobile Only)

**File:** `src/components/nav/CompanyDropdown.mobile.tsx`

> Note: This dropdown only appears on mobile devices. On desktop, company links are nested in the Resources dropdown.

| Link | Target | Status |
|------|--------|--------|
| About Us | `#` | 🔴 Not connected |
| Careers | `/careers` | 🟢 Connected |
| Events | `/events` | 🟢 Connected |
| Newsroom | `/press` | 🟢 Connected |
| Contact | `/contact` | 🟢 Connected |

**Total Links:** 5
**Connected:** 4
**Not Connected:** 1

---

## 8. CTA Buttons

### Desktop Header
| Button | Target | Type | Status |
|--------|--------|------|--------|
| Cloud login | `https://console.helios.co/` | External | 🟢 Connected |
| Sign up | `https://console.helios.co/login?tab=signup` | External | 🟢 Connected |

### Mobile Footer
| Button | Target | Type | Status |
|--------|--------|------|--------|
| Sign up | `https://console.helios.co/login?tab=signup` | External | 🟢 Connected |
| Cloud login | `https://console.helios.co/` | External | 🟢 Connected |

---

## Link Status Summary

### By Dropdown

| Dropdown | Total Links | Connected | Not Connected | % Complete |
|----------|-------------|-----------|---------------|------------|
| Platform | 8 | 0 | 8 | 0% |
| Models | 16 | 13 | 3 | 81% |
| Developers | 18 | 0 | 18 | 0% |
| Pricing | 1 | 1 | 0 | 100% |
| Partners | 5 | 0 | 5 | 0% |
| Resources | 10 | 4 | 6 | 40% |
| Company (Mobile) | 5 | 4 | 1 | 80% |
| CTAs | 4 | 4 | 0 | 100% |
| **TOTAL** | **67** | **26** | **41** | **39%** |

### Connected Internal Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Home | 🟢 Exists |
| `/pricing` | Pricing | 🟢 Exists |
| `/model-library` | Model Library | 🟢 Exists |
| `/careers` | Careers | 🟢 Exists |
| `/events` | Events | 🟢 Exists |
| `/press` | Press/Newsroom | 🟢 Exists |
| `/contact` | Contact | 🟢 Exists |
| `/blog` | Blog | 🟡 Hidden |
| `/about` | About Us | 🔴 Does not exist |
| `/partner` | Partner Page | 🟢 Exists (not linked) |
| `/energy` | Energy Page | 🟢 Exists (not linked) |

### External Links

| URL | Purpose | Status |
|-----|---------|--------|
| `https://console.helios.co/` | Dashboard Login | 🟢 Active |
| `https://console.helios.co/login?tab=signup` | Sign Up | 🟢 Active |

---

## Recommended Actions

### Priority 1: Create Missing Pages
- [ ] `/about` - About Us page
- [ ] Connect `/partner` to Partners dropdown
- [ ] Connect `/energy` to appropriate location

### Priority 2: External Documentation Links
- [ ] Set up docs subdomain or external docs site
- [ ] API Reference URL
- [ ] Changelog URL
- [ ] Cookbooks/tutorials URL

### Priority 3: Social Media Links
- [ ] Twitter/X URL
- [ ] YouTube URL
- [ ] LinkedIn URL
- [ ] Discord/Community Chat URL

### Priority 4: Feature Pages (Use Cases)
Consider creating dedicated pages or sections for:
- [ ] Code Assistance
- [ ] Conversational AI
- [ ] Agentic Systems
- [ ] Semantic Search
- [ ] Multimedia
- [ ] Enterprise RAG

### Priority 5: Partner Program Pages
- [ ] Partner application form/page
- [ ] Startups program application
- [ ] Partner categories pages

### Priority 6: Developer Tools
- [ ] SDK documentation/download
- [ ] EvalProtocol page
- [ ] Voice Agent page
- [ ] CLI Tool documentation

### Priority 7: Model Deep Links
- [ ] Individual model pages for featured models (GLM-4.6, DeepSeek V3, Kimi K2)

---

## Design System Notes

### Dropdown Styling
- Background: `#0A0A0A` with `backdrop-blur-3xl`
- Border: `border-white/10`
- Border Radius: `rounded-[32px]`
- Shadow: `shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]`
- Featured column: `bg-[#111111]`

### Typography
- Section headers: `font-mono text-[10px] uppercase tracking-[0.4em] text-white/60`
- Links: `text-sm text-white/70 hover:text-white`
- Featured badges: `text-[#FF6B35]`

### Animation
- Dropdown entry: `opacity 0→1, y 10→0, scale 0.98→1, blur 10px→0`
- Duration: `0.3s` with easing `[0.22, 1, 0.36, 1]`
- Hover pill: Spring animation `stiffness: 350, damping: 30`

---

## Appendix: Full Link Inventory

### All `href="#"` Links (41 total)

```
Platform:
  - For AI Natives
  - For Enterprises
  - Code Assistance
  - Conversational AI
  - Agentic Systems
  - Semantic Search
  - Multimedia
  - Enterprise RAG

Models:
  - GLM-4.6
  - DeepSeek V3
  - Kimi K2 Instruct

Developers:
  - SDK
  - EvalProtocol
  - Voice Agent
  - Docs
  - API Reference
  - CLI Tool
  - Changelog
  - LLMs
  - Multimodal
  - SFT
  - RFT
  - Serverless
  - Reserved
  - Twitter
  - YouTube
  - LinkedIn
  - Community Chat
  - Get Started

Partners:
  - Cloud & Infrastructure
  - Consulting & Services
  - Technology Partners
  - Apply for the program
  - Become a Partner

Resources:
  - Documentation
  - Demos
  - Cookbooks
  - Featured Article 1
  - Featured Article 2
  - About Us

Company (Mobile):
  - About Us
```

---

*Document generated for Helios Energy website audit.*
