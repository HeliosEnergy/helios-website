import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GrainGradient, PaperTexture } from "@paper-design/shaders-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { EASE, fadeUp } from "@/components/HomeRevampSections";

const consequences = [
  {
    title: "Cleaner ESG numbers",
    body: "Train and serve on water-free, renewable-backed capacity so the reported footprint per GPU-hour drops with it.",
  },
  {
    title: "No water, no water risk",
    body: "Drought restrictions and water permits should not pause a training run. Our cooling plan does not depend on them.",
  },
  {
    title: "Efficiency you can bank",
    body: "Lower overhead energy flows straight into the economics. Efficient sites are cheaper sites — for Helios and for customers.",
  },
];

const spec = [
  "Closed-loop liquid cooling",
  "Dry heat rejection",
  "Renewable-backed power",
  "High-density Blackwell racks",
  "Power secured before contract",
];

/* ——— Page-local design system (zetta-joule "calm industrial" restraint) ——— */

// Modest, lighter-weight headings, sentence case. Per-use size appended.
const calmHeading = "font-heading font-medium tracking-tight leading-[1.02]";

// Hero stagger: eyebrow → heading → body → CTA, calm rise.
const stage = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};
const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* Quiet pill + leading icon-chip (the site CTA convention). */
const PillCTA = ({
  to,
  children,
  tone = "dark",
}: {
  to: string;
  children: string;
  tone?: "dark" | "light";
}) => {
  const dark = tone === "dark";
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
        dark
          ? "border-white/15 bg-white/5 text-white hover:border-emerald-400/50 hover:bg-white/10"
          : "border-black/15 bg-white/50 text-[#15171A] hover:border-emerald-600/40 hover:bg-white"
      }`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${
          dark
            ? "bg-white text-black group-hover:bg-emerald-400"
            : "bg-[#15171A] text-white group-hover:bg-emerald-600"
        }`}
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
      {children}
    </Link>
  );
};

/* A single odometer digit: a descending reel that rolls through nine values
   and settles on the target, like an instrument coming to rest. */
const DigitReel = ({
  target,
  delay,
  duration,
}: {
  target: number;
  delay: number;
  duration: number;
}) => {
  const reduced = useReducedMotion();
  const strip = Array.from({ length: 10 }, (_, j) => (target + 9 - j + 10) % 10);

  if (reduced) {
    return (
      <span className="inline-block w-[0.58em] text-center" aria-hidden>
        {target}
      </span>
    );
  }

  return (
    <span className="inline-block overflow-hidden h-[1em] w-[0.58em]" aria-hidden>
      <motion.span
        className="block"
        initial={{ y: "0em" }}
        whileInView={{ y: "-9em" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration, delay, ease: EASE }}
      >
        {strip.map((n, j) => (
          <span key={j} className="block h-[1em] leading-none text-center">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

const WaterOdometer = () => (
  <div
    role="img"
    aria-label="0.000 litres of water drawn for cooling"
    className="flex items-end text-[72px] sm:text-[104px] lg:text-[148px] font-heading font-medium tracking-tight leading-none text-white"
  >
    <DigitReel target={0} delay={0} duration={1.1} />
    <span className="inline-block h-[1em] leading-none w-[0.32em] text-center" aria-hidden>
      .
    </span>
    <DigitReel target={0} delay={0.15} duration={1.5} />
    <DigitReel target={0} delay={0.3} duration={1.85} />
    <DigitReel target={0} delay={0.45} duration={2.2} />
    <span
      className="ml-4 lg:ml-6 pb-1.5 lg:pb-3 font-mono font-normal text-xl lg:text-2xl tracking-[0.2em] text-emerald-400"
      aria-hidden
    >
      L
    </span>
  </div>
);

/* Full-width PUE scale, 1.0 to 2.0. The emerald needle slides down-scale
   past the ghosted industry mark and settles at the Helios end. */
const PueRuler = () => {
  const reduced = useReducedMotion();
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  const HELIOS = 12; // % along the scale
  const INDUSTRY = 56;

  return (
    <div className="relative mt-16 lg:mt-24">
      {/* Markers */}
      <div className="relative h-28 lg:h-32">
        {/* Reclaimed-overhead band, dragged open by the Helios marker */}
        <motion.div
          className="absolute inset-y-0 origin-right border-y border-eco/25"
          style={{
            left: `${HELIOS}%`,
            width: `${INDUSTRY - HELIOS}%`,
            background:
              "repeating-linear-gradient(135deg, hsl(var(--eco)/0.16) 0 1px, transparent 1px 7px), linear-gradient(to right, hsl(var(--eco)/0.14), hsl(var(--eco)/0.02))",
          }}
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
          aria-hidden
        />
        <motion.span
          className="absolute bottom-3 font-mono text-[11px] uppercase tracking-[0.18em] text-eco-bright whitespace-nowrap"
          style={{ left: `${HELIOS}%`, paddingLeft: "0.875rem" }}
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, delay: 1.9, ease: EASE }}
        >
          ← Overhead reclaimed for compute
        </motion.span>

        <div
          className="absolute inset-y-0 w-0 border-l border-dashed border-white/40"
          style={{ left: `${INDUSTRY}%` }}
          aria-hidden
        />
        <span
          className="absolute top-10 md:top-0 font-mono text-xs text-white/60 whitespace-nowrap pl-3"
          style={{ left: `${INDUSTRY}%` }}
        >
          Industry average
        </span>

        <motion.div
          className="absolute inset-y-0 w-[2px] bg-eco shadow-[0_0_16px_2px_hsl(var(--eco)/0.55)]"
          initial={reduced ? { left: `${HELIOS}%` } : { left: `${INDUSTRY}%`, opacity: 0 }}
          whileInView={{ left: `${HELIOS}%`, opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
          aria-hidden
        />
        <motion.span
          className="absolute top-0 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-eco-bright whitespace-nowrap border border-eco/40 bg-black px-3 py-1.5"
          style={{ left: `calc(${HELIOS}% - 1px)` }}
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, delay: 1.7, ease: EASE }}
        >
          Helios design target
        </motion.span>
      </div>

      {/* Tick scale */}
      <div className="flex items-end justify-between h-8" aria-hidden>
        {ticks.map((i) => (
          <span key={i} className={i % 4 === 0 ? "w-px h-8 bg-white/50" : "w-px h-3.5 bg-white/25"} />
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-8 text-sm text-white/60">
        <span>1.0 — every watt reaches compute</span>
        <span className="text-right">2.0 — half of it wasted</span>
      </div>
    </div>
  );
};

const ImagePlaceholder =({ label, className }: { label: string; className: string }) => (
  <div className={`relative overflow-hidden border border-white/10 bg-[#070707] ${className}`}>
    <div
      className="absolute inset-0"
      aria-hidden
      style={{
        background:
          "repeating-linear-gradient(45deg, transparent, transparent 23px, rgba(255,255,255,0.045) 23px, rgba(255,255,255,0.045) 24px)",
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="font-mono text-xs text-white/40 text-center px-6 leading-relaxed">{label}</p>
    </div>
  </div>
);

const InstrumentIndex = ({ children }: { children: string }) => (
  <span className="font-mono text-sm text-emerald-400">{children}</span>
);

/* Each open item repaints the whole section: three shades of green, dark →
   vibrant lime, each with two contrasting colours (a primary text colour and a
   punchy accent). No marker, no numbers — typography, colour and transition
   carry it. Always exactly one open, so the section always has a colour. */
const advantageThemes = [
  // deep emerald — light mint text, teal accent
  { bg: "#043B29", fg: "#F0FDFA", fgMuted: "rgba(240,253,250,0.5)", accent: "#5EEAD4", line: "rgba(240,253,250,0.14)" },
  // vivid green — near-white text, lime accent
  { bg: "#0F7A4C", fg: "#ECFDF5", fgMuted: "rgba(236,253,245,0.55)", accent: "#D9F99D", line: "rgba(236,253,245,0.16)" },
  // vibrant lime whack — deep-green text, forest accent
  { bg: "#BEF264", fg: "#14532D", fgMuted: "rgba(20,83,45,0.5)", accent: "#15803D", line: "rgba(20,83,45,0.18)" },
];

const AdvantageSection = () => {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  const t = advantageThemes[open] ?? advantageThemes[0];

  return (
    <section
      style={{ backgroundColor: t.bg }}
      className="py-24 lg:py-32 px-4 lg:px-6 transition-colors duration-700 ease-out"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          style={{ color: t.fg }}
          className={`${calmHeading} text-4xl lg:text-5xl max-w-2xl transition-colors duration-700 ease-out`}
        >
          Sustainable infrastructure is a business advantage.
        </h2>

        <div
          className="mt-14 lg:mt-20 border-t transition-colors duration-700 ease-out"
          style={{ borderColor: t.line }}
        >
          {consequences.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.title}
                className="border-b transition-colors duration-700 ease-out"
                style={{ borderColor: t.line }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-6 py-7 lg:py-9 text-left"
                >
                  <h3
                    style={{ color: isOpen ? t.fg : t.fgMuted }}
                    className={`flex-1 ${calmHeading} text-2xl lg:text-4xl transition-all duration-500 ease-out ${
                      isOpen ? "" : "group-hover:translate-x-1.5"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span
                    className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 ease-out"
                    style={
                      isOpen
                        ? { backgroundColor: t.accent, borderColor: t.accent, color: t.bg }
                        : { borderColor: t.fgMuted, color: t.fg }
                    }
                    aria-hidden
                  >
                    <span className="absolute h-[1.5px] w-3.5 bg-current" />
                    <motion.span
                      className="absolute h-[1.5px] w-3.5 bg-current"
                      animate={{ rotate: isOpen ? 0 : 90 }}
                      transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p
                        style={{ color: t.fg }}
                        className="pb-9 lg:pb-12 pr-6 max-w-2xl text-lg lg:text-xl font-light leading-relaxed transition-colors duration-700 ease-out"
                      >
                        {item.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SustainabilityPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-black text-white">
      <AnnouncementBanner />
      <Navigation />

      <main>
        {/* ——— Hero ——— */}
        <section className="relative overflow-hidden pt-28 lg:pt-40 pb-4 px-4 lg:px-6">
          {/* Canopy light from above — WebGL crashes iOS Safari, so CSS fallback on mobile */}
          {!isMobile ? (
            <div
              className="absolute inset-x-0 top-0 h-full pointer-events-none opacity-30"
              aria-hidden
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 25%, transparent 75%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 25%, transparent 75%)",
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
                speed={0.12}
                scale={1.9}
                offsetY={-0.35}
              />
              <PaperTexture
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.45 }}
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
              className="absolute inset-0 pointer-events-none"
              aria-hidden
              style={{
                background:
                  "radial-gradient(65% 70% at 50% 0%, hsl(var(--eco) / 0.14) 0%, hsl(var(--eco) / 0.04) 40%, transparent 70%)",
              }}
            />
          )}

          <div className="relative max-w-7xl mx-auto">
            <motion.div
              variants={stage}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-12 lg:items-end"
            >
              <div className="lg:col-span-9">
                <motion.h1
                  variants={rise}
                  className={`${calmHeading} text-5xl sm:text-6xl lg:text-7xl text-white max-w-5xl`}
                >
                  AI infrastructure that{" "}
                  <span className="text-emerald-400">doesn't cost the earth.</span>
                </motion.h1>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <PillCTA to="/contact?service=coloc" tone="dark">
                Reserve capacity
              </PillCTA>
              <Link
                to="/colocation"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
              >
                See our facilities
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ——— The instruments ——— */}
        <section className="bg-black pt-24 lg:pt-32 pb-24 lg:pb-36 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            {/* 01 — Water */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 pb-28 lg:pb-44">
              <div className="lg:col-span-6 lg:col-start-1 order-2 lg:order-1">
                <WaterOdometer />
                <p className="mt-5 text-sm lg:text-base text-white/50">
                  Litres of water drawn for cooling — per site, per year.
                </p>

                <ImagePlaceholder
                  label="Placeholder — dry cooler / cold plate macro, ≥1600px"
                  className="mt-14 lg:mt-16 aspect-[16/10] max-w-xl"
                />
              </div>

              <div className="lg:col-span-4 lg:col-start-9 order-1 lg:order-2">
                <InstrumentIndex>01</InstrumentIndex>
                <h3 className={`mt-5 ${calmHeading} text-3xl lg:text-4xl text-white`}>
                  Water-free cooling, even at NVL72 densities.
                </h3>
                <div className="mt-7 space-y-5">
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Most AI data centers evaporate millions of liters of water a year to stay
                    cool. Helios sites use closed-loop direct-to-chip liquid cooling and dry
                    coolers to reject heat without drawing on local water supplies.
                  </p>
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    That means no competition with communities and agriculture for water, and no
                    drought-driven operating risk for your workloads.
                  </p>
                </div>
              </div>
            </div>

            {/* 02 — PUE */}
            <div className="border-t border-white/10 pt-16 lg:pt-24 pb-28 lg:pb-36">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
                <div className="lg:col-span-4 lg:col-start-2">
                  <InstrumentIndex>02</InstrumentIndex>
                  <h3 className={`mt-5 ${calmHeading} text-3xl lg:text-4xl text-white`}>
                    More of every megawatt goes to compute.
                  </h3>
                </div>
                <div className="lg:col-span-4 lg:col-start-9 space-y-5">
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Purpose-built halls, liquid cooling and modern power distribution keep
                    overhead energy low. Less energy spent on cooling and conversion means better
                    effective cost per GPU-hour.
                  </p>
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Efficiency is not a retrofit here. It is how the sites are designed from day
                    one.
                  </p>
                </div>
              </div>
              <PueRuler />
            </div>

            {/* 03 — Renewables */}
            <div className="border-t border-white/10 pt-16 lg:pt-24 grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              <div className="lg:col-span-4 lg:col-start-2">
                <InstrumentIndex>03</InstrumentIndex>
                <h3 className={`mt-5 ${calmHeading} text-3xl lg:text-4xl text-white`}>
                  Renewable-backed power is part of the site plan.
                </h3>
                <div className="mt-7 space-y-5">
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Every Helios site is developed alongside clean generation and backed by
                    long-term power agreements, so renewable energy is always part of the mix
                    powering your cluster.
                  </p>
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Siting next to generation is also why we move fast: secured power is the
                    hardest part of any data center build, and we lock it before you sign.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="flex items-end gap-4 text-white">
                  <span className="text-[72px] sm:text-[104px] lg:text-[148px] font-heading font-medium tracking-tight leading-none">
                    100
                  </span>
                  <span className="pb-1.5 lg:pb-3 font-mono text-xl lg:text-2xl tracking-[0.2em] text-emerald-400">
                    %
                  </span>
                </div>
                <p className="mt-8 text-sm lg:text-base text-white/50">
                  100 of 100 sites — renewable-backed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Sustainable infrastructure — colour-reactive accordion ——— */}
        <AdvantageSection />

        {/* ——— Spec sheet ——— */}
        <section className="bg-black py-24 lg:py-32 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              <div className="lg:col-span-4 lg:col-start-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-400">
                  Site specification
                </span>
                <motion.h2
                  {...fadeUp}
                  transition={{ duration: 0.8, ease: EASE }}
                  className={`mt-6 ${calmHeading} text-4xl lg:text-5xl text-white`}
                >
                  Built for Blackwell without waste.
                </motion.h2>
                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                  className="mt-6 text-lg lg:text-xl text-white/70 font-light leading-relaxed"
                >
                  The same engineering that lets Helios deliver dense GPU capacity quickly also
                  reduces waste: modular halls, secured power, closed-loop cooling, and repeatable
                  operations.
                </motion.p>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="lg:col-span-5 lg:col-start-8 border-y border-white/10"
              >
                {spec.map((item, index) => (
                  <motion.div
                    key={item}
                    variants={rise}
                    className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-white/10 first:border-t-0 py-5"
                  >
                    <span className="font-mono text-sm text-emerald-400">0{index + 1}</span>
                    <span className="text-white text-lg font-light">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ——— Full-bleed site image ——— */}
        <section className="px-4 lg:px-6 pb-24 lg:pb-32 bg-black">
          <div className="max-w-7xl mx-auto">
            <ImagePlaceholder
              label="Placeholder — aerial: Helios site beside solar field at dusk, ≥2560px"
              className="h-[320px] lg:h-[520px]"
            />
            <p className="mt-4 text-sm text-white/50">
              A Helios site: solar-adjacent, dry-cooled, live in about three months.
            </p>
          </div>
        </section>

        {/* ——— CTA (light band) — pushed off-centre, empty left gutter ——— */}
        <section className="bg-[#EDF0F2] text-[#15171A] py-28 lg:py-44 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12">
            <div className="lg:col-span-7 lg:col-start-6">
              <motion.h2
                {...fadeUp}
                transition={{ duration: 0.8, ease: EASE }}
                className={`${calmHeading} text-4xl sm:text-5xl lg:text-6xl text-[#15171A]`}
              >
                Fast, clean compute. Pick both.
              </motion.h2>
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                className="mt-5 text-lg lg:text-xl text-[#2A2D31] font-light max-w-md"
              >
                Thousands of GPUs or tens of megawatts, live in about three months.
              </motion.p>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="mt-10 flex"
              >
                <PillCTA to="/contact?service=coloc" tone="light">
                  Join the waitlist
                </PillCTA>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SustainabilityPage;
