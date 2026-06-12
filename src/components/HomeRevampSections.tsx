import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
} as const;

export const SectionRule = ({ index, children }: { index: string; children: string }) => (
  <div className="flex items-center gap-5 mb-8 lg:mb-10">
    <span className="text-primary text-[10px] font-mono uppercase tracking-[0.4em] whitespace-nowrap">
      {children}
    </span>
    <span className="h-px flex-1 bg-white/10" />
    <span className="text-white/30 text-[10px] font-mono tracking-[0.3em]">/ {index}</span>
  </div>
);

export const sectionHeading =
  "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white tracking-tightest leading-[0.92]";

const offerings = [
  {
    tag: "GPU as a Service",
    title: "Dedicated GPU clusters, managed by Helios",
    description:
      "Reserved, single-tenant clusters of the latest NVIDIA silicon — provisioned, networked and burned-in by our team, ready for training and inference at scale.",
    bullets: [
      "NVIDIA GB300 NVL72, B300 and RTX PRO 6000",
      "From 8 GPUs to multi-thousand-GPU clusters",
      "Non-blocking InfiniBand fabric, parallel storage",
      "Slurm or Kubernetes orchestration, your choice",
    ],
    primary: "Join the GPU waitlist",
    primaryHref: "/contact?service=clusters",
    secondary: "Explore GPU Cloud",
    secondaryHref: "/clusters",
  },
  {
    tag: "Colocation",
    title: "Your hardware, our megawatts",
    description:
      "High-density colocation engineered for Blackwell-generation deployments. Liquid-cooled, water-free halls with renewable-backed power — in blocks of tens of megawatts.",
    bullets: [
      "Purpose-built for GB300 / B300 / RTX PRO 6000 racks",
      "10s of MW per customer, ready in ~3 months",
      "Up to rack densities required by NVL72 systems",
      "Remote hands, security and 24/7 operations included",
    ],
    primary: "Reserve colo space",
    primaryHref: "/contact?service=coloc",
    secondary: "Explore Colocation",
    secondaryHref: "/colocation",
  },
];

export const HomeOfferingsSection = () => (
  <section className="bg-black py-20 lg:py-28 px-4 lg:px-6 border-t border-white/10">
    <div className="max-w-7xl mx-auto">
      <SectionRule index="01">What we do</SectionRule>
      <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="max-w-4xl">
        <h2 className={sectionHeading}>Two ways to get Blackwell-class compute.</h2>
        <p className="mt-6 text-lg lg:text-xl text-white/65 font-light leading-relaxed max-w-2xl">
          Run on our cloud, or put your own racks in our data centers. Same sites, same power,
          same ~3-month timeline.
        </p>
      </motion.div>

      <div className="mt-14 lg:mt-20 grid lg:grid-cols-2 border-y border-white/10 lg:divide-x lg:divide-white/10">
        {offerings.map((offering, i) => (
          <motion.div
            key={offering.title}
            {...fadeUp}
            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            className={`py-10 lg:py-14 flex flex-col ${
              i === 0 ? "lg:pr-12 xl:pr-16" : "lg:pl-12 xl:pl-16 border-t border-white/10 lg:border-t-0"
            }`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-primary font-mono text-sm tracking-[0.2em]">0{i + 1}</span>
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em]">
                {offering.tag}
              </span>
            </div>
            <h3 className="mt-8 text-3xl lg:text-[44px] font-heading font-bold text-white tracking-tightest leading-[0.95]">
              {offering.title}
            </h3>
            <p className="mt-6 text-white/65 text-base lg:text-lg font-light leading-relaxed">
              {offering.description}
            </p>
            <div className="mt-10 border-t border-white/10">
              {offering.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="flex items-baseline gap-4 border-b border-white/10 py-3.5 text-sm lg:text-base text-white/80"
                >
                  <span className="w-3 h-px bg-primary shrink-0 self-center" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 lg:mt-auto lg:pt-10 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="rounded-full bg-white text-black hover:bg-primary hover:text-primary-foreground transition-colors duration-300 font-mono uppercase tracking-widest text-xs"
              >
                <Link to={offering.primaryHref}>{offering.primary}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 font-mono uppercase tracking-widest text-xs"
              >
                <Link to={offering.secondaryHref}>{offering.secondary}</Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const MONTHS_MAX = 36;
const RULER_TICKS = [0, 6, 12, 18, 24, 30, 36];

const timeline = [
  { label: "Helios", solid: 3, max: 3, display: "~3 mo", active: true },
  { label: "Typical colocation lease", solid: 12, max: 18, display: "12–18 mo", active: false },
  { label: "New data center buildout", solid: 24, max: 36, display: "24–36 mo", active: false },
];

export const HomeSpeedSection = () => (
  <section className="bg-black py-20 lg:py-28 px-4 lg:px-6">
    <div className="max-w-7xl mx-auto">
      <SectionRule index="03">Why Helios</SectionRule>
      <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="max-w-4xl">
        <h2 className={sectionHeading}>
          The market quotes years.
          <br />
          We deliver in months.
        </h2>
        <p className="mt-6 text-lg lg:text-xl text-white/65 font-light leading-relaxed max-w-2xl">
          Power, land and supply chain are pre-secured at every Helios site. When you sign, we
          build — and you're training about three months later.
        </p>
      </motion.div>

      <div className="relative mt-16 lg:mt-20">
        {/* Month grid lines */}
        <div className="absolute inset-x-0 top-8 bottom-0 pointer-events-none" aria-hidden>
          {RULER_TICKS.map((m) => (
            <div
              key={m}
              className="absolute top-0 bottom-0 w-px bg-white/[0.07]"
              style={{ left: `${(m / MONTHS_MAX) * 100}%` }}
            />
          ))}
        </div>

        {/* Ruler */}
        <div className="relative h-8">
          {RULER_TICKS.map((m, i) => (
            <span
              key={m}
              className={`absolute top-0 text-[10px] font-mono tracking-[0.2em] text-white/40 ${
                i === 0 ? "" : i === RULER_TICKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              style={{ left: `${(m / MONTHS_MAX) * 100}%` }}
            >
              {m === MONTHS_MAX ? `${m} MO` : m}
            </span>
          ))}
        </div>

        {timeline.map((item, i) => (
          <div
            key={item.label}
            className="relative border-t border-white/10 py-6 lg:py-7 last:border-b"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <span
                className={`text-sm lg:text-base ${
                  item.active ? "text-primary font-semibold" : "text-white/80"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`font-mono text-xs uppercase tracking-[0.2em] ${
                  item.active ? "text-primary" : "text-white/45"
                }`}
              >
                {item.display}
              </span>
            </div>
            <div className="relative h-1.5">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.18, ease: EASE }}
                className={`absolute inset-y-0 left-0 origin-left ${
                  item.active ? "bg-primary" : "bg-white/30"
                }`}
                style={{ width: `${(item.solid / MONTHS_MAX) * 100}%` }}
              />
              {item.max > item.solid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 1.1 + i * 0.18, ease: EASE }}
                  className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.28)_0_3px,transparent_3px_7px)]"
                  style={{
                    left: `${(item.solid / MONTHS_MAX) * 100}%`,
                    width: `${((item.max - item.solid) / MONTHS_MAX) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-white/45 text-sm max-w-3xl">
        Industry ranges are typical published timelines for leased colocation and greenfield
        builds, drawn to scale. Your Helios timeline is committed at contract.
      </p>
    </div>
  </section>
);

const sustainability = [
  {
    metric: "0",
    unit: "L",
    title: "Water-free cooling",
    body: "Closed-loop liquid and air systems mean our sites consume no water for cooling — not a drop from local communities, even at NVL72 rack densities.",
  },
  {
    metric: "Low",
    unit: "PUE",
    title: "Power-efficient by design",
    body: "Purpose-built halls, direct liquid cooling and modern power distribution keep overhead energy to a minimum — more of every megawatt goes to compute.",
  },
  {
    metric: "100",
    unit: "%",
    title: "Renewable-backed power",
    body: "Every site is powered with renewable energy in the mix — sited next to clean generation and backed by long-term power agreements.",
  },
];

export const HomeSustainabilitySection = () => (
  <section className="bg-black py-20 lg:py-28 px-4 lg:px-6">
    <div className="max-w-7xl mx-auto">
      <SectionRule index="04">Sustainability</SectionRule>
      <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="max-w-4xl">
        <h2 className={sectionHeading}>Fast shouldn't mean wasteful.</h2>
        <p className="mt-6 text-lg lg:text-xl text-white/65 font-light leading-relaxed max-w-2xl">
          Every Helios data center is engineered to use zero water for cooling, run
          power-efficient, and draw on renewable energy.
        </p>
      </motion.div>

      <div className="mt-14 lg:mt-20 grid md:grid-cols-3 border-y border-white/10 md:divide-x md:divide-white/10">
        {sustainability.map((item, i) => (
          <motion.div
            key={item.title}
            {...fadeUp}
            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            className="py-10 lg:py-14 md:px-8 lg:px-10 md:first:pl-0 border-t border-white/10 first:border-t-0 md:border-t-0"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-6xl lg:text-7xl font-heading font-bold text-white tracking-tightest">
                {item.metric}
              </span>
              <span className="text-primary font-mono text-lg lg:text-xl tracking-[0.1em]">
                {item.unit}
              </span>
            </div>
            <h3 className="mt-8 text-xl font-heading font-bold text-white">{item.title}</h3>
            <p className="mt-4 text-white/60 leading-relaxed text-sm lg:text-base">{item.body}</p>
          </motion.div>
        ))}
      </div>
      <Link
        to="/colocation"
        className="mt-10 inline-flex items-center gap-2 text-primary font-semibold group"
      >
        How our data centers work
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);

export const HomeModelsStrip = () => (
  <section className="bg-black px-4 lg:px-6">
    <div className="max-w-7xl mx-auto border-t border-white/10 py-12 lg:py-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div className="max-w-2xl">
        <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.4em] mb-5">
          Also on Helios
        </p>
        <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white tracking-tight">
          Serverless inference &amp; open models
        </h3>
        <p className="mt-3 text-white/60 leading-relaxed">
          Run Kimi, DeepSeek, Whisper, Flux and more with per-millisecond billing on the same
          infrastructure.
        </p>
      </div>
      <Link
        to="/models"
        className="inline-flex items-center gap-3 text-white font-mono uppercase tracking-widest text-xs border-b border-white/30 hover:border-primary hover:text-primary pb-2 transition-colors group shrink-0"
      >
        Explore the model library
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);
