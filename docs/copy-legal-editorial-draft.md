# Helios Website Copy Draft: Legal and Editorial Review

Date: 2026-06-14

Purpose: working draft for rewriting the Helios website copy in a more matter-of-fact, investor-friendly voice.

Scope: public website copy in the Vite and React repo, including homepage, navigation, footer, colocation, clusters, inference, model APIs, model library, training, serverless, energy, sustainability, startups, careers, press, events, partner, contact, coming soon, 404, and metadata.

Important note: this is an editorial and claim-risk review, not legal advice. Legal counsel should validate regulated claims, environmental claims, certifications, comparative claims, partner references, customer references, and service commitments before publication.

## Editorial Bench

Use these lenses for every rewrite:

| Role | What they are optimizing for |
| --- | --- |
| General counsel | No unsupported claims, no implied guarantees, no unverified certifications, no misleading environmental or performance language. |
| Investor editor | Clear business model, capacity story, deployment defensibility, power strategy, credible scale. |
| Technical editor | Correct hardware, architecture, service limits, deployment steps, and API claims. |
| Enterprise buyer editor | Procurement-safe language, plain CTAs, reduced hype, fewer absolutes. |
| SEO and AEO editor | Clear nouns, searchable categories, concise answers that AI and search engines can quote accurately. |
| Conversion editor | Specific next actions: reserve capacity, talk to our team, join GPU waitlist, request pricing. |

## Global Copy Rule

Preferred company-level positioning:

> Helios builds AI compute capacity on pre-secured power. Customers reserve Blackwell GPU clusters or high-density colocation. We deploy in about three months with water-free cooling and renewable-backed sites.

Use this tone:

> We secure power. We build modular AI data halls. We deploy GPU capacity for training, inference, and colocation.

Avoid:

> frontier, pioneers, state-of-the-art, paradigm, intelligence frontier, think deeper, powering innovation, unbeatable, world's best, fastest, never, always, guaranteed, not a single watt, zero risk.

## Legal Risk Register

| Risk area | Copy pattern that creates trouble | What we need to defend | Safer rule |
| --- | --- | --- | --- |
| Timeline claims | Live in about 3 months, signature to energized, the date is in the contract | Contract terms, site readiness, utility interconnect, supply chain, customer dependency assumptions | Say "target deployment in about three months" unless the page is tied to a specific contract offer. |
| Environmental claims | 0 L water, 100 percent renewable-backed, clean power, low PUE | Cooling architecture by site, water accounting boundary, renewable procurement documents, PUE design target versus measured PUE | Say "designed for zero water use in cooling" and "renewable-backed power" with a footnote or proof page. |
| Certification claims | SOC 2 Type II certified, enterprise security | Current certification report, exact entity covered, system boundary, date, exceptions | Remove unless verified and link to trust or contact page for report access. |
| Performance claims | Fastest, sub-second, 3x, 10K+ TPS, less than 100 ms P99, 99.99 percent uptime | Benchmarks, test conditions, SLA contract, model-specific latency, endpoint-specific throughput | Replace with "designed for low latency" or qualify by model, region, and workload. |
| Comparative claims | Legacy facilities cannot touch, unbeatable pricing, fraction of the cost | Competitor substantiation, current market pricing, fair comparison set | Replace with factual reasons: rack density, power cost, site design, contract structure. |
| Customer and partner claims | Fortune 500 testimonial, validated partners, partner ecosystem | Customer consent, attribution, approved quote, partner agreements | Remove anonymous testimonial unless approved. Use "customer references available on request" if true. |
| Model availability | 50+ models, 100+ models, every model, world's best open-source models | Actual catalog, licenses, availability, routing support, model provider terms | Use current count or "selected open models." |
| API compatibility | Full Chat Completions API spec, drop-in replacement | Compatibility matrix, exceptions, unsupported fields, streaming, tools, JSON mode | Say "OpenAI-compatible endpoints for supported features." |
| Startup program | Free infrastructure, direct Slack access, less than 4 hour response, VC network | Program terms, support SLA, privacy, eligibility, credit rules | Use "up to $5,000 in credits" and "technical onboarding for approved startups." |
| Recruiting and culture | Raw power becomes a gift, pioneers | Could sound vague or cultish to senior talent | Use plain operating principles and actual roles. |

## Sitewide Replacements

| Area | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Company one-liner | Fastest inference platform for generative AI | Helios builds GPU cloud clusters and high-density colocation on pre-secured power. | Fixes footer and metadata mismatch. Investors should see infrastructure capacity first. |
| Primary CTA | Sign up | Talk to our team | For high-value GPU and colocation deals, "sign up" undersells the sales motion. Keep console signup only for self-serve inference. |
| Secondary CTA | Cloud login | Console login | More precise and less brand-heavy. |
| Capacity CTA | Reserve capacity | Reserve capacity | Keep. It matches the business. |
| Waitlist CTA | Join the GPU waitlist | Join GPU waitlist | Good, just remove extra words. |
| Docs CTA | View Documentation | Read docs | Simpler. |
| Partner CTA | Become a Partner | Talk to partnerships | Less presumptive. |
| Contact success | We will be in touch shortly | We received your request. Our team will follow up with next steps. | Better for enterprise and avoids promising timing unless committed. |

## Homepage

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Frontier compute, live in about 3 months | AI compute capacity, live in about three months. | Stronger business noun. "Frontier" is common AI copy and less investor-specific. Spell out three for headline polish. |
| Hero subcopy | Thousands of NVIDIA Blackwell GPUs or tens of megawatts of colocation, deployed in about three months. Not years. Water-free cooling, power-efficient sites, renewable energy. | Reserve Blackwell GPU clusters or high-density colocation in blocks of tens of megawatts. Helios secures power, land, modules, cooling, and supply chain before deployment, so customers can move in months instead of years. | Explains why the timeline is credible. Keep environmental proof for later sections. |
| Hero CTA | Reserve capacity | Reserve capacity | Keep. |
| Offering headline | Two ways to get Blackwell-class compute. | Two ways to buy AI compute capacity. | More business clear, less chip-centric. |
| GPU cloud blurb | Reserved, single-tenant clusters of latest NVIDIA silicon, networked and burned in by our team. | We deliver reserved, single-tenant GPU clusters with Blackwell-class NVIDIA systems, non-blocking fabric, parallel storage, and Slurm or Kubernetes. | More factual. Add exact SKUs only where current availability is verified. |
| Colocation blurb | High-density halls on renewable-backed power, delivered in blocks of tens of megawatts. | Bring your racks. Helios provides high-density, liquid-cooled data halls with pre-secured power, remote hands, security, and operations. | More buyer-friendly and concrete. |
| Speed headline | The market quotes years. We deliver in months. | Most AI capacity takes years. Helios targets months. | Safer. Avoids sounding like a guarantee across all cases. |
| Speed body | Power, land and supply chain are pre-secured at every Helios site. When you sign, we build. You're training about three months later. | We secure power, land, equipment, and site design before customer commitment. After contract, we build against an agreed deployment schedule. | Legal-safe. Avoids unconditional promise. |
| Timeline note | Industry ranges are typical published timelines. Your Helios timeline is committed at contract. | Timeline comparisons are illustrative. Customer deployment dates depend on contract scope, site allocation, hardware configuration, and utility readiness. | Add this as a visible footnote or legal note if timelines remain prominent. |
| Sustainability headline | Fast should not mean wasteful. | Fast capacity should still be efficient. | Less moralizing. |
| Sustainability body | Every data center uses zero water, runs power-efficient, and draws on renewable energy. | Helios sites are designed for water-free cooling, efficient power distribution, and renewable-backed electricity. | "Designed for" is safer than absolute operating claim. |
| Footprint headline | Where the megawatts live. | Sites built around power. | More direct. |
| Footprint body | Three sites across three grids today, water-free, renewable-backed, Blackwell-ready. | Helios develops sites where power is available, clean generation is nearby, and high-density AI racks can be supported. Current site availability should be confirmed before publication. | Avoid site-count claim unless current and public. |
| Models strip | Serverless inference and open models | Serverless inference on Helios infrastructure | Makes it secondary to infrastructure story. |
| Models strip body | Run Kimi, DeepSeek, Whisper, Flux and more with per-millisecond billing on same infrastructure. | Run selected open models and media workloads through usage-based endpoints on Helios infrastructure. | Avoid model list unless catalog is current. |

## Navigation and Footer

| Area | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Desktop nav | Platform, Colocation, Sustainability, Models, Pricing, Partners | GPU Cloud, Colocation, Serverless, Sustainability, Pricing, Company | Put the business model in the nav. "Platform" hides the offer. |
| Mobile nav | Pricing, Colocation, Sustainability, Model Library | GPU Cloud, Colocation, Serverless, Pricing, Contact | Mobile currently loses the cluster story. Fix it. |
| Platform dropdown intro | Fast prototyping to production scale | Reserve GPU clusters, colocate high-density racks, or run serverless inference on Helios infrastructure. | Replace vague category copy with the three offers. |
| Platform links | For AI Natives, For Enterprises | GPU Cloud, Colocation, Serverless Inference, Model APIs | Buyer paths should match product paths. |
| Testimonial | Anonymous Fortune 500 quote | Remove until approved. | High legal and credibility risk. Anonymous enterprise quotes look weak unless formal references exist. |
| Footer line | The fastest inference platform for generative AI | GPU cloud and high-density colocation for AI workloads. | Fix stale positioning and "fastest" claim risk. |
| Footer company links | Careers, Contact, Pricing | Colocation, GPU Cloud, Pricing, Contact, Careers | Reflect revenue lines before company pages. |
| Logo alt | Helios AI Logo or Helios Cloud Logo | Helios logo | Avoid stale or inconsistent brand names. |

## Colocation Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Your racks. Our megawatts. Live in about 3 months. | Your racks. Our power. Live in about three months. | Strong and clear. "Megawatts" is good but "power" is more immediately understood. Keep "megawatts" in stats. |
| Hero body | Built for Blackwell generation. GB300 NVL72, B300 and RTX PRO 6000, at densities legacy facilities cannot touch. | High-density colocation for Blackwell-generation deployments, including GB300 NVL72, B300, and RTX PRO 6000 configurations where available. Designed for rack densities that traditional colocation was not built to support. | Removes aggressive competitor claim and adds availability guardrail. |
| Stats | 10s MW, about 3 months, NVL72, 0 L | 10s of MW per customer, target deployment about 3 months, NVL72-ready designs, designed for zero water cooling | Add "target" and "designed for" where needed. |
| Module headline | A data hall, productized. | A repeatable data hall, not a one-off build. | Same idea, clearer. |
| Module body | Not construction project. Product. Built in parallel. | Helios standardizes the data hall design, power distribution, cooling, and deployment workflow. That lets us build modules in parallel instead of treating each customer deployment as a custom construction project. | More investor-friendly and defensible. |
| Why colo headline | Most colo is built for servers. Ours is built for AI factories. | Most colocation was built for general-purpose servers. Helios builds for AI racks. | Keeps contrast but reduces hype. |
| Speed reason | The date is in the contract | Deployment schedule is defined in the contract. | Less absolute. |
| Scale reason | Take a hall, not a cage. Expansion rights come built in. | Reserve hall-scale capacity with expansion terms defined upfront. | Better for legal and enterprise procurement. |
| Operations reason | Hyperscale-grade SLAs | 24/7 operations, remote hands, and SLA terms defined in contract. | Do not imply hyperscale SLA without exact terms. |
| Sites headline | Power first. Everything else follows. | We start with power. | Simpler. |
| Sites body | Land energizes before module arrives. Hall lands on power that exists. | Helios prioritizes sites with secured power and grid readiness before customer deployment begins. | Safer than saying all land is already energized. |
| Timeline headline | Four steps. About ninety days. | Four steps to capacity. | "Ninety days" should be used only with qualification. |
| Timeline body | Day 0 reserve, Week 1 scope, Week 2 build-out, Month 3 energize | Reserve, scope, build, energize. Timing depends on contract scope, utility status, hardware configuration, and customer readiness. | Keep the timeline but attach conditions. |
| CTA | Megawatts move fast here. Blocks allocated in waitlist order. | Reserve high-density colocation capacity. Capacity is allocated based on site availability, contract status, and deployment schedule. | Avoid waitlist allocation claim unless it is operationally true. |

## GPU Cloud and Clusters Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Sovereign Compute | Dedicated GPU clusters, managed by Helios. | "Sovereign" has procurement and data residency implications. Use only if a sovereignty product exists. |
| Hero body | Dedicated NVIDIA H100 clusters with 3.2 Tbps InfiniBand. Your network. Your storage. Your metal. | Reserve single-tenant NVIDIA GPU clusters for training and inference. Helios provisions compute, networking, storage, burn-in, and orchestration. | Aligns with homepage and avoids stale H100-only positioning. |
| Hero metrics | H100 / H200, 3.2 Tbps, Slurm / K8s | GB300, B300, RTX PRO 6000 where available. Non-blocking InfiniBand. Slurm or Kubernetes. | Needs current SKU alignment. |
| Section headline | Built for Training Runs | Built for large training and inference workloads. | Broader and clearer. |
| Body | Do not let bottlenecks kill training efficiency. Sovereign Cloud ensures linear scaling. | Helios designs clusters with high-bandwidth networking, parallel storage, and orchestration options so teams can run distributed workloads without managing the full hardware stack. | Remove "linear scaling" unless benchmarked by workload. |
| Feature | Full bi-sectional bandwidth optimized for All-Reduce | Non-blocking fabric for distributed workloads. | Safer and understandable. |
| Feature | WEKA / Lustre | Parallel file systems sized to workload. | Avoid naming vendors unless deployed and contracted. |
| Feature | Orchestration freedom | Slurm or Kubernetes, selected during deployment. | Good, just make operational. |

## Inference Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Reasoning Engine | Serverless inference for selected open models. | The current copy sounds like an AI product, not infrastructure. |
| Hero body | Deploy reasoning models that think before they speak. | Run supported language, image, audio, and video models through usage-based endpoints on Helios infrastructure. | Plain and accurate. |
| CTA | Start Reasoning | Start inference | Remove anthropomorphic copy. |
| Featured models | State-of-the-Art Reasoning | Supported models | Avoid unsupported superiority claim. |
| Model descriptions | Advanced reasoning, state-of-the-art, high-performance | Use model-specific descriptions from provider docs or internal catalog. | Avoid generic superlatives. |
| Benefits | SOC 2 Type II, 99.99 percent uptime, 3x TTFT, multi-region redundancy | OpenAI-compatible endpoints for supported features, usage-based billing, private deployment options by request, support for selected production workloads. | Keep security, uptime, and performance claims only if verified. |
| Specs | less than 100 ms P99, 10K+ TPS, 5+ regions, 50+ models | Publish only model-specific and region-specific metrics with test conditions, or remove the specs section. | High claim risk. |
| Use cases | Powering Innovation | Common workloads | Replace generic heading. |
| Final CTA | Ready to Think Deeper? | Run inference on Helios infrastructure. | Removes AI pomp. |

## Model APIs Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero badge | Unified API Endpoint | Model APIs | Simpler. |
| Hero headline | One API. Every Model. | One API for supported models. | "Every model" is indefensible. |
| Hero body | World's best open-source models through a single OpenAI-compatible endpoint. Route dynamically by price, speed, or availability. | Access supported open models through OpenAI-compatible endpoints. Choose models based on capability, price, and availability. | Removes "world's best" and routing claim unless feature exists. |
| CTA | Get API Key | Request API access | Better if access is not fully self-serve. |
| Model table | Live Model Status, real-time pricing and latency | Model catalog, pricing, and availability | Do not say live or real-time unless it is live data. |
| Catalog count | 100+ supported models | View supported models | Only state exact count if synced to actual catalog. |
| Compatibility | Drop-in OpenAI Compatibility, full Chat Completions API spec | OpenAI-compatible endpoints for supported Chat Completions features | Avoid full compatibility unless complete. |
| Feature list | Streaming, Function Calling, JSON Mode, Logprobs | Streaming and structured output features where supported | Feature-specific compatibility should be documented. |

## Model Library Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Model Library | Model catalog | "Library" is fine, but "catalog" is more enterprise. |
| Hero body | Curated repository of state-of-the-art weights, optimized for Helios infrastructure | Browse models available through Helios inference endpoints. Filter by provider, modality, pricing, and context window. | Removes "state-of-the-art" and "weights" ambiguity. |
| Loading | Synchronizing Archive | Loading models | Remove sci-fi language. |
| Empty state | No specimens found in this sector | No models match this filter. | Professional and useful. |
| Search placeholder | Filter by name or provider | Search by model or provider | Simpler. |

## Training Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Training. | Managed training infrastructure. | More specific. |
| Hero body | Train from the ground up, leveraging research breakthroughs such as TKC | Run fine-tuning, pre-training, and distributed training on dedicated Helios GPU clusters. Our team helps size compute, storage, networking, and orchestration for the workload. | Removes vendor-specific TKC claim unless licensed and deployed. |
| Feature | TKC accelerates training by up to 2x | Optimized kernels and training stack options are available for supported workloads. | 2x needs benchmark proof and source. |
| Feature | Data never leaves your security boundary | Isolated training environments are available for sensitive workloads. | "Never leaves" is an absolute. |
| Feature | Real-time metrics integrated with W&B, MLflow, TensorBoard | Training metrics and common experiment tracking integrations can be configured during deployment. | Safer unless productized. |
| Specs | H100/H200, max 2048 GPUs, 2x throughput, SOC 2 certified | Publish cluster specs by active SKU and contract. Remove unverified security and throughput claims. | Needs current hardware and compliance confirmation. |
| CTA | Ready to Train? | Scope a training cluster. | More concrete. |

## Serverless Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Deploy in Seconds. Scale to Zero. | Serverless inference without idle GPU cost. | Avoid deployment time guarantee unless measured. |
| Hero body | Run inference code without managing infrastructure. Pay only for milliseconds your code runs. No idle costs. | Run supported inference workloads without managing GPU servers. Usage-based billing reduces idle capacity spend. | "No idle costs" can be true for billing but should be precise. |
| Metrics | less than 30s cold start, 0.1s billing increment | Cold starts and billing increments vary by workload and service configuration. | Do not headline unless documented. |
| Feature | FlashBoot under 30s | Fast cold starts for supported container images. | If FlashBoot is not a public product, remove the name. |
| Feature | Infrastructure as Code in Python | Define container, GPU, memory, and timeout in code. | Good if SDK supports it. |
| Feature | Bill strictly down to millisecond | Usage-based billing by configured billing unit. | Avoid "strictly" unless billing docs confirm. |

## Energy Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | Low-Cost Energy. High-Powered AI. | AI infrastructure built around power cost. | More investor-friendly. |
| Hero body | Go directly to cheapest, cleanest energy. Fraction of the cost of traditional data centers. | Helios develops sites where power is available, cost-efficient, and suitable for high-density AI workloads. Lower power cost helps lower the delivered cost of compute. | "Cheapest" and "fraction" need substantiation. |
| Advantage | Low cost. Unbeatable pricing. | Lower power cost can support better compute economics. | Remove "unbeatable." |
| Advantage | Not a single watt or dollar is wasted | We model power demand and site operations to reduce overhead where possible. | Absolute waste claim is not defensible. |
| CTA | Build Something Amazing. For Less. | Build on power-efficient AI infrastructure. | Less hype. |

## Sustainability Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | AI infrastructure that does not cost the earth | AI infrastructure designed for lower resource use. | Less slogan, easier to defend. |
| Water claim | 0.000 litres of water drawn for cooling per site per year | Designed for zero water use in cooling. | Water accounting needs boundary definitions. Avoid exact per-site annual claim unless measured. |
| Water body | Most AI data centers evaporate millions of liters | Many data centers use evaporative cooling. Helios sites use closed-loop liquid cooling and dry heat rejection to avoid water-based cooling. | Avoid broad unsupported "most" and exact quantities. |
| PUE scale | Helios design target compared with industry average | Helios designs for low overhead power use. Publish measured PUE when available. | PUE claims need measured or design basis. |
| Renewable claim | 100 of 100 sites renewable-backed | Helios develops sites with renewable-backed power agreements where available. | "100 of 100" looks fictional or legally risky unless backed. |
| Business advantage | Cleaner ESG numbers | Lower resource use can support customer sustainability reporting, subject to reporting boundaries and contract terms. | ESG claims need precision. |
| Spec sheet | Built for Blackwell without waste | Built for dense AI racks with reduced cooling water demand. | "Without waste" is absolute. |
| CTA | Fast, clean compute. Pick both. | Reserve efficient AI compute capacity. | Cleaner, less slogan-heavy. |

## Startups Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero headline | $5,000 in GPU Credits | Up to $5,000 in Helios credits for approved startups. | Must say "up to" and approval condition. |
| Hero body | Free infrastructure for inference, training, dedicated clusters | Credits can be applied to eligible Helios services, including inference, training, and dedicated GPU clusters. | Avoid "free infrastructure." |
| Eligibility | You likely qualify if all three | You may qualify if your company is pre-seed to Series A, building an AI product, and has a working prototype. | More exact and less promise. |
| CTA | I Qualify, Apply Now | Apply for credits | Avoid self-certification language. |
| Benefits | Priority access, 24/7 availability, direct Slack, less than 4 hour response, VC network | Approved startups may receive credits, onboarding support, and architecture guidance. Additional benefits depend on program tier and availability. | Support SLA and VC network claims need terms. |
| FAQ | High-growth startups may qualify for extended credits or custom agreements | Some startups may qualify for additional credits or custom commercial terms after review. | Better. |

## Careers Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Intro | Builders, designers, systems thinkers making compute accessible and simple | We build GPU cloud and colocation infrastructure for AI workloads. We need people who can ship across power, data centers, systems software, operations, and customer deployment. | More concrete and recruiting-useful. |
| Ethos | Raw power, when handled with grace, becomes a gift | We care about uptime, deployment speed, engineering judgment, and direct ownership. | Remove poetic copy. |
| Empty roles | Searching for the next pioneers | We do not have open roles listed right now. Send a note if you are interested in infrastructure, systems, operations, or customer engineering. | More professional. |
| CTA | Join the team | See open roles | More precise. |

## Press Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Headline | News and Updates | Press and company updates | Good enough, slightly more formal. |
| Intro | Latest stories, launches, milestones | Company news, product updates, and media resources from Helios. | Clear. |
| Empty releases | The chronicle continues. Stay tuned | No public releases are posted yet. | Avoid theatrical copy. |
| Media kit | Brand Identity Bundle | Media kit | Simpler. |
| Media kit body | Logos, typography, visual guidelines | Logos, company boilerplate, product description, and brand assets. | More useful to press. |

## Events Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Headline | Community and Events | Events | Simpler. |
| Intro | Active in developer community | Meet the Helios team at AI infrastructure events, technical conferences, and customer briefings. | More aligned with current company. |
| Placeholder event | Helios Summit 2026, manifesting soon | No public events are listed right now. | Remove casual language. |
| CTA | Details | View event | More specific. |

## Partner Page and Partner Dropdown

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Partner page | Coming soon. Contact partners@helios.ai | Partner with Helios. For power, data center, hardware, network, and channel inquiries, contact partners@helios.co. | Fix stale domain and define partner types. |
| Dropdown intro | An ecosystem of power | Partners for power, data centers, hardware, networking, and services. | Clear. |
| Startup teaser | Next generation of AI pioneers | Credits and technical onboarding for approved AI startups. | Remove hype. |
| Collaboration CTA | Shape the future of distributed intelligence | Work with Helios on AI infrastructure deployment. | Plain. |

## Contact Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Header | Ready to scale? | Tell us what capacity you need. | More direct. |
| Body | Single B300 or custom cluster | Share your GPU, colocation, inference, or partnership requirements. We will route the request to the right team. | Covers all form services. |
| Cluster label | Select Cluster Type | Select GPU type | More accurate. |
| Colocation helper | Tell us megawatts, density, hardware plan, timeline | Include target megawatts, rack density, hardware plan, preferred site timing, and network needs. | Good, slightly more procurement-ready. |
| Message label | Additional notes | Deployment details | Better signal for sales. |
| Success title | Received. | Request received. | More professional. |
| Success body | We will be in touch shortly | Our team will review the request and follow up with next steps. | Avoid timing promise. |

## Pricing Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Hero | CMS-driven pricing headline and subtitle | Publish current pricing for supported inference models and GPU SKUs. Contact sales for dedicated clusters and colocation. | Need Sanity source review. Keep page clear about what is self-serve and what is custom. |
| Cluster pricing | Coming soon | Dedicated GPU cluster pricing is quoted by configuration, term, and availability. | Better than "coming soon." |
| Provider comparison | Hourly rates vs major cloud providers | List prices shown for directional comparison only. Confirm final pricing with each provider and contract. | Comparative pricing needs date and source. |
| Metrics | Uptime SLA, deploy time, network, security | Remove unless tied to service terms and current docs. | High legal exposure. |
| Missing values | Long dash placeholders | Not available | Avoid long dash per style rule and improve clarity. |

## Coming Soon Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Badge | Under Development | In progress | Simpler. |
| Body | We are building something great | This page is not published yet. Contact the Helios team for partnership or service questions. | Matter-of-fact. |
| CTA | Contact Us Instead | Contact Helios | More professional. |

## 404 Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Body | Oops! Page not found | Page not found | Remove casual tone. |
| CTA | Return to Home | Go to homepage | Standard. |

## Brand Transition Page

| Section | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Body | Same GPU cloud. Shorter address. | Helios has moved to helios.co. | Clearer and not limited to GPU cloud. |
| CTA | Continue | Continue to helios.co | More explicit. |

## Metadata and Social Preview

| Area | Current message | Proposed text | Editor note |
| --- | --- | --- | --- |
| Title | Helios Cloud | Helios | Keep brand clean. |
| Meta description | Missing standard description, OG says high-performance GPU cloud | Helios builds GPU cloud clusters and high-density colocation for AI workloads on pre-secured power. | Add normal meta description and align OG. |
| OG title | Helios Cloud | Helios | Brand consistency. |
| OG description | High-performance GPU cloud for training and inference | GPU cloud clusters and high-density colocation for AI workloads, deployed on pre-secured power. | No unsupported speed claim. |
| Twitter site | @HeliosCloud | Confirm current social handle before publishing. | Stale or wrong handle risk. |

## Proposed Page-Level Drafts

These are not final implementation strings. They are the recommended editorial direction for the next pass.

### Homepage

Headline:

> AI compute capacity, live in about three months.

Subcopy:

> Reserve Blackwell GPU clusters or high-density colocation in blocks of tens of megawatts. Helios secures power, land, modules, cooling, and supply chain before deployment, so customers can move in months instead of years.

Primary CTA:

> Reserve capacity

Offer section:

> Two ways to buy AI compute capacity.

GPU Cloud:

> Reserved, single-tenant GPU clusters with Blackwell-class NVIDIA systems, non-blocking fabric, parallel storage, and Slurm or Kubernetes.

Colocation:

> Bring your racks. Helios provides high-density, liquid-cooled data halls with pre-secured power, remote hands, security, and operations.

### Colocation

Headline:

> Your racks. Our power. Live in about three months.

Body:

> High-density colocation for Blackwell-generation deployments, including GB300 NVL72, B300, and RTX PRO 6000 configurations where available. Helios provides the power, cooling, security, remote hands, and operations.

Why Helios:

> Most colocation was built for general-purpose servers. Helios builds for AI racks.

### GPU Cloud

Headline:

> Dedicated GPU clusters, managed by Helios.

Body:

> Reserve single-tenant NVIDIA GPU clusters for training and inference. Helios provisions compute, networking, storage, burn-in, and orchestration so your team can run workloads without managing the hardware stack.

### Serverless Inference

Headline:

> Serverless inference without idle GPU cost.

Body:

> Run supported inference workloads without managing GPU servers. Usage-based billing reduces idle capacity spend and gives teams a simpler path from prototype to production.

### Model APIs

Headline:

> One API for supported models.

Body:

> Access supported open models through OpenAI-compatible endpoints. Choose models based on capability, price, and availability.

### Training

Headline:

> Managed training infrastructure.

Body:

> Run fine-tuning, pre-training, and distributed training on dedicated Helios GPU clusters. Our team helps size compute, storage, networking, and orchestration for the workload.

### Sustainability

Headline:

> AI infrastructure designed for lower resource use.

Body:

> Helios sites are designed for water-free cooling, efficient power distribution, and renewable-backed electricity. We build around power from the start because efficient sites improve both operating cost and customer reporting.

### Energy

Headline:

> AI infrastructure built around power cost.

Body:

> Helios develops sites where power is available, cost-efficient, and suitable for high-density AI workloads. Lower power cost helps lower the delivered cost of compute.

### Startups

Headline:

> Up to $5,000 in Helios credits for approved startups.

Body:

> Credits can be applied to eligible Helios services, including inference, training, and dedicated GPU clusters. Approved startups may also receive onboarding support and architecture guidance.

### Careers

Headline:

> Build AI infrastructure with Helios.

Body:

> We build GPU cloud and colocation infrastructure for AI workloads. We need people who can ship across power, data centers, systems software, operations, and customer deployment.

### Press

Headline:

> Press and company updates

Body:

> Company news, product updates, and media resources from Helios.

### Events

Headline:

> Events

Body:

> Meet the Helios team at AI infrastructure events, technical conferences, and customer briefings.

### Partner

Headline:

> Partner with Helios.

Body:

> We work with power, data center, hardware, network, and services partners to deploy AI infrastructure. For partnership inquiries, contact partners@helios.co.

## Claims That Need Evidence Before Publication

| Claim | Evidence needed |
| --- | --- |
| Live in about three months | Contract examples, deployment plan, site readiness assumptions, exclusions. |
| 10s of MW per customer | Site capacity documents and sales-approved availability. |
| GB300, B300, RTX PRO 6000 availability | Procurement status, delivery schedule, NVIDIA authorization if required. |
| 0 L water or water-free cooling | Cooling design, water accounting boundary, measured or design documentation. |
| Renewable-backed power | Power purchase agreements, renewable energy certificates, site energy mix. |
| Low PUE | Design target or measured PUE, methodology, operating conditions. |
| SOC 2 Type II | Current report, scope, entity, date, control boundary. |
| 99.99 percent uptime | Signed SLA terms, exclusions, service scope. |
| Less than 100 ms P99 or 10K TPS | Benchmark details by model, workload, region, concurrency, date. |
| 2x training acceleration | Benchmark setup, baseline, workload, hardware, reproducibility. |
| 50+ or 100+ models | Current catalog count and availability. |
| OpenAI full compatibility | Compatibility matrix and unsupported fields. |
| Direct Slack or less than 4 hour response | Support terms and staffing. |
| Anonymous Fortune 500 quote | Written approval from customer or removal. |

## Implementation Priority

1. Replace footer, metadata, nav labels, and homepage hero. These define the company in the first 10 seconds.
2. Rewrite colocation lightly. It is already the best page, but needs legal qualifiers.
3. Rewrite clusters, inference, model APIs, training, and serverless. These pages have the most stale and inflated copy.
4. Rewrite energy and sustainability claims with substantiation notes.
5. Clean up careers, press, events, partner, coming soon, and 404 for professional tone.
6. Review Sanity-managed CTA, pricing, careers, press, events, and page config content before launch.

