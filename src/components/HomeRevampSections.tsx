import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import { GrainGradient, PaperTexture } from "@paper-design/shaders-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowCTA } from "./ui/ArrowCTA";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
} as const;

export const sectionHeading =
  "text-4xl lg:text-5xl font-heading font-medium text-white tracking-tight leading-[1.02]";

const offerings = [
  {
    tag: "GPU as a Service",
    label: "GPU Cloud",
    title: "Dedicated GPU clusters, managed by Helios",
    description:
      "Reserved, single-tenant clusters of the latest NVIDIA silicon. Provisioned, networked and burned-in by our team, ready for training and inference at scale.",
    bullets: [
      "NVIDIA GB300 NVL72, B300 and RTX PRO 6000",
      "From 8 GPUs to multi-thousand-GPU clusters",
      "Non-blocking InfiniBand fabric, parallel storage",
      "Slurm or Kubernetes orchestration, your choice",
    ],
    blurb:
      "Reserved, single-tenant clusters of the latest NVIDIA silicon, networked and burned in by our team, ready to train.",
    primary: "Join the GPU waitlist",
    primaryHref: "/contact?service=clusters",
    secondary: "Explore GPU Cloud",
    secondaryHref: "/clusters",
    image: "/gpus/dgx-b200.jpg",
    specs: [
      { k: "GPUs", v: "8 to 4096" },
      { k: "Tenancy", v: "Single-tenant" },
      { k: "Silicon", v: "GB300 / B300" },
    ],
  },
  {
    tag: "Colocation",
    label: "Colocation",
    title: "Your hardware, our megawatts",
    description:
      "High-density colocation engineered for Blackwell-generation deployments. Liquid-cooled, water-free halls with renewable-backed power, in blocks of tens of megawatts.",
    bullets: [
      "Purpose-built for GB300 / B300 / RTX PRO 6000 racks",
      "10s of MW per customer, ready in ~3 months",
      "Up to rack densities required by NVL72 systems",
      "Remote hands, security and 24/7 operations included",
    ],
    blurb:
      "High-density, liquid-cooled halls on renewable-backed power, delivered in blocks of tens of megawatts.",
    primary: "Reserve colo space",
    primaryHref: "/contact?service=coloc",
    secondary: "Explore Colocation",
    secondaryHref: "/colocation",
    image: "/coloc/hall-interior-rack-corridor.png",
    specs: [
      { k: "Power", v: "10s of MW" },
      { k: "Ready in", v: "~3 months" },
      { k: "Cooling", v: "Liquid, water-free" },
    ],
  },
];

// Restrained entrance: the module settles in once on scroll, one quiet stagger.
const stage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const rise: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const HomeOfferingsSection = () => {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const o = offerings[active];

  // Scroll progress across the tall wrapper drives the active path on desktop.
  // The section is pinned (sticky) for the duration, so scrolling switches
  // GPU Cloud -> Colocation, then releases.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (isMobile) return;
    const next = p < 0.5 ? 0 : 1;
    setActive((cur) => (cur === next ? cur : next));
  });

  // Click a dot: on desktop scroll to that segment (keeps the pin in sync);
  // on mobile just switch with a transition.
  const goTo = (i: number) => {
    if (isMobile || !wrapRef.current) {
      setActive(i);
      return;
    }
    const el = wrapRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const len = el.offsetHeight - window.innerHeight;
    const prog = i === 0 ? 0.25 : 0.75;
    window.scrollTo({ top: top + prog * len, behavior: reduced ? "auto" : "smooth" });
  };

  const swap = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      };

  return (
    <div ref={wrapRef} className="relative lg:h-[220vh]">
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#EDF0F2] px-5 py-24 sm:px-8 lg:sticky lg:top-0 lg:h-screen lg:min-h-0 lg:py-0">
        <motion.div
          variants={stage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto w-full max-w-7xl"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* LEFT: title, big description, CTA */}
            <div className="relative z-10 max-w-xl">
              <motion.h2
                variants={rise}
                className="font-heading text-4xl font-medium leading-[1.02] tracking-tight text-[#15171A] sm:text-5xl lg:text-[3.5rem]"
              >
                Two ways to get Blackwell-class compute.
              </motion.h2>

              <motion.div variants={rise} className="mt-10 min-h-[7rem] lg:min-h-[8rem]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={swap.initial}
                    animate={swap.animate}
                    exit={swap.exit}
                    transition={{ duration: 0.36, ease: EASE }}
                    className="max-w-lg text-xl font-light leading-snug text-[#2A2D31] lg:text-2xl"
                  >
                    {o.blurb}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              <motion.div variants={rise} className="mt-10 flex items-center gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={swap.initial}
                    animate={swap.animate}
                    exit={swap.exit}
                    transition={{ duration: 0.36, ease: EASE }}
                  >
                    <ArrowCTA to={o.primaryHref} tone="light" accent="primary">
                      {o.primary}
                    </ArrowCTA>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* RIGHT: tall bleeding image with vertical dot switcher */}
            <motion.div
              variants={rise}
              className="relative aspect-[5/4] overflow-hidden bg-[#0A0A0B] sm:aspect-[16/10] lg:aspect-auto lg:-ml-8 lg:h-[82vh] lg:mr-[calc(50%-50vw)]"
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={o.image}
                  src={o.image}
                  alt={o.title}
                  initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* vertical dot switcher / scroll indicator */}
              <div
                role="tablist"
                aria-label="Compute options"
                className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-5 lg:left-7"
              >
                {offerings.map((opt, i) => {
                  const on = active === i;
                  return (
                    <button
                      key={opt.label}
                      role="tab"
                      aria-selected={on}
                      aria-label={opt.label}
                      onClick={() => goTo(i)}
                      className="group flex items-center gap-3"
                    >
                      <span
                        className={`block w-1.5 rounded-full transition-all duration-300 ${
                          on ? "h-8 bg-[#E0701A]" : "h-1.5 bg-white/45 group-hover:bg-white/80"
                        }`}
                      />
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                          on ? "text-white" : "text-white/0 group-hover:text-white/60"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

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
      <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="max-w-4xl">
        <h2 className={sectionHeading}>
          The market quotes years.
          <br />
          We deliver in months.
        </h2>
        <p className="mt-6 text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-2xl">
          Power, land and supply chain are pre-secured at every Helios site. When you sign, we
          build. You're training about three months later.
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
              className={`absolute top-0 text-[11px] font-mono tracking-[0.2em] text-white/50 whitespace-nowrap ${
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
                  item.active ? "text-primary" : "text-white/55"
                }`}
              >
                {item.display}
              </span>
            </div>
            <motion.div
              className="relative h-1.5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  visible: {
                    scaleX: 1,
                    transition: { duration: 1.1, delay: 0.15 + i * 0.18, ease: EASE },
                  },
                }}
                className={`absolute inset-y-0 left-0 origin-left ${
                  item.active ? "bg-primary" : "bg-white/30"
                }`}
                style={{ width: `${(item.solid / MONTHS_MAX) * 100}%` }}
              />
              {item.max > item.solid && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { duration: 0.6, delay: 1.1 + i * 0.18, ease: EASE },
                    },
                  }}
                  className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.28)_0_3px,transparent_3px_7px)]"
                  style={{
                    left: `${(item.solid / MONTHS_MAX) * 100}%`,
                    width: `${((item.max - item.solid) / MONTHS_MAX) * 100}%`,
                  }}
                />
              )}
            </motion.div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-white/55 text-sm max-w-3xl">
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
    body: "Closed-loop liquid and air systems mean our sites consume no water for cooling. Not a drop from local communities, even at NVL72 rack densities.",
  },
  {
    metric: "Low",
    unit: "PUE",
    title: "Power-efficient by design",
    body: "Purpose-built halls, direct liquid cooling and modern power distribution keep overhead low, so more of every megawatt goes to compute.",
  },
  {
    metric: "100",
    unit: "%",
    title: "Renewable-backed power",
    body: "Every site is powered with renewable energy in the mix, sited next to clean generation and backed by long-term power agreements.",
  },
];

export const HomeSustainabilitySection = () => {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-black py-24 lg:py-36 px-4 lg:px-6">
      {/* Ground light rising beneath the metrics — WebGL crashes iOS Safari, so CSS fallback on mobile */}
      {!isMobile ? (
        <div
          className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none opacity-40"
          aria-hidden
          style={{
            maskImage:
              "linear-gradient(to top, transparent 0%, black 22%, black 55%, transparent 96%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 22%, black 55%, transparent 96%)",
          }}
        >
          <GrainGradient
            style={{ width: "100%", height: "100%" }}
            colors={["#03130c", "#0d5a37", "#22aa6b"]}
            colorBack="#000000"
            softness={0.8}
            intensity={0.12}
            noise={0.3}
            shape="blob"
            speed={0.15}
            scale={1.9}
            offsetY={0.3}
          />
          <PaperTexture
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}
            colorFront="#1d5e3d"
            colorBack="#000000"
            contrast={0.4}
            roughness={0.3}
            fiber={0.55}
            fiberSize={0.4}
            crumples={0.15}
            folds={0.1}
            drops={0.05}
          />
        </div>
      ) : (
        <div
          className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 50% 90%, rgba(20,120,72,0.13) 0%, transparent 65%)",
          }}
        />
      )}

      <div className="relative max-w-7xl mx-auto">
        <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="max-w-4xl">
          <h2 className={sectionHeading}>
            Fast shouldn't mean{" "}
            <span className="relative inline-block whitespace-nowrap">
              <motion.span
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 0.55 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
                className="inline-block"
              >
                wasteful.
              </motion.span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: 1.05, ease: EASE }}
                className="absolute left-[-0.04em] right-[-0.04em] top-[51%] h-[0.055em] origin-left bg-eco"
              />
            </span>
          </h2>
          <p className="mt-6 text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-2xl">
            Every Helios data center is engineered to use zero water for cooling, run
            power-efficient, and draw on renewable energy.
          </p>
        </motion.div>

        {/* Proof — three engineered readings hung from one measurement
            baseline. The form of each instrument encodes its meaning:
            water held flat at zero, power split mostly to compute, renewable
            drawn to full. Same visual language, three different readings. */}
        <div className="mt-16 lg:mt-28">
          <div className="sustain-pulse h-px bg-gradient-to-r from-eco/45 via-eco/15 to-transparent" aria-hidden />
          <div className="grid md:grid-cols-3">
            {/* 01 — Water: a flatline held at zero */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: EASE }}
              className="pt-10 pb-12 lg:pt-12 lg:pr-12 border-t border-white/10 md:border-t-0"
            >
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                <span className="text-eco/50">01</span>
                <span className="text-eco/90">Water</span>
              </div>
              <div className="mt-7 flex items-end gap-2">
                <span className="font-heading font-bold text-white text-[92px] lg:text-[124px] leading-[0.82] tracking-tightest">
                  0
                </span>
                <span className="mb-3 font-mono text-lg text-eco/90">L</span>
              </div>
              <div className="mt-7 relative h-px bg-white/12">
                <motion.span
                  aria-hidden
                  initial={reduced ? false : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-eco shadow-[0_0_12px_2px_hsl(var(--eco)/0.6)]"
                />
                <span className="absolute right-0 -top-5 font-mono text-[10px] tracking-wider text-white/40">
                  held at zero
                </span>
              </div>
              <h3 className="mt-9 text-lg font-heading font-bold text-white">{sustainability[0].title}</h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/65">{sustainability[0].body}</p>
            </motion.div>

            {/* 02 — Power: a two-tone proportion bar, compute vs overhead */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              className="pt-10 pb-12 lg:pt-12 lg:px-12 border-t border-white/10 md:border-t-0 md:border-l md:border-white/10"
            >
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                <span className="text-eco/50">02</span>
                <span className="text-eco/90">Power</span>
              </div>
              <div className="mt-7 lg:mt-12">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-eco/90">Compute</span>
                  <span className="text-white/40">Overhead</span>
                </div>
                <div className="mt-3 flex h-3.5 w-full overflow-hidden bg-white/[0.07]">
                  <motion.span
                    aria-hidden
                    initial={reduced ? false : { width: 0 }}
                    whileInView={{ width: "88%" }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1, delay: 0.2, ease: EASE }}
                    className="h-full bg-eco"
                  />
                  <span aria-hidden className="h-full flex-1 bg-eco/20" />
                </div>
                <div className="mt-4 flex items-baseline gap-2.5">
                  <span className="font-heading font-bold text-white text-2xl lg:text-[28px] tracking-tight">Low</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-eco/80">PUE</span>
                </div>
              </div>
              <h3 className="mt-9 text-lg font-heading font-bold text-white">{sustainability[1].title}</h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/65">{sustainability[1].body}</p>
            </motion.div>

            {/* 03 — Renewable: a line drawn to full, 100% */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
              className="pt-10 pb-12 lg:pt-12 lg:pl-12 border-t border-white/10 md:border-t-0 md:border-l md:border-white/10"
            >
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                <span className="text-eco/50">03</span>
                <span className="text-eco/90">Renewable</span>
              </div>
              <div className="mt-7 flex items-end gap-2">
                <span className="font-heading font-bold text-white text-[92px] lg:text-[124px] leading-[0.82] tracking-tightest">
                  100
                </span>
                <span className="mb-3 font-mono text-lg text-eco/90">%</span>
              </div>
              <div className="mt-7 relative h-px overflow-hidden bg-white/12">
                <motion.span
                  aria-hidden
                  initial={reduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1, delay: 0.3, ease: EASE }}
                  style={{ transformOrigin: "left" }}
                  className="absolute inset-0 bg-eco shadow-[0_0_12px_1px_hsl(var(--eco)/0.5)]"
                />
                <span className="absolute right-0 -top-5 font-mono text-[10px] tracking-wider text-white/40">
                  every site
                </span>
              </div>
              <h3 className="mt-9 text-lg font-heading font-bold text-white">{sustainability[2].title}</h3>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/65">{sustainability[2].body}</p>
            </motion.div>
          </div>
        </div>
        <Link
          to="/sustainability"
          className="mt-10 inline-flex items-center gap-2 text-eco hover:text-eco-bright transition-colors font-semibold group"
        >
          How our data centers work
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export const HomeModelsStrip = () => (
  <section className="bg-black px-4 lg:px-6">
    <div className="max-w-7xl mx-auto border-t border-white/10 py-12 lg:py-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div className="max-w-2xl">
        <h3 className="text-2xl lg:text-3xl font-heading font-medium text-white tracking-tight leading-[1.02]">
          Serverless inference &amp; open models
        </h3>
        <p className="mt-3 text-white/70 leading-relaxed">
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
