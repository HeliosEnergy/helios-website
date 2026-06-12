import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { EASE, fadeUp, SectionRule, sectionHeading } from "@/components/HomeRevampSections";

const telemetry = [
  ["0.000 L", "Water used for cooling"],
  ["Low PUE", "Power overhead by design"],
  ["100%", "Sites with renewable power"],
  ["~3 mo", "From contract to live capacity"],
];

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
    className="flex items-end text-[72px] sm:text-[104px] lg:text-[148px] font-heading font-bold tracking-tightest leading-none text-white"
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

  return (
    <div className="relative mt-16 lg:mt-24">
      {/* Markers */}
      <div className="relative h-24 lg:h-28">
        <div className="absolute inset-y-0 w-px bg-white/25" style={{ left: "56%" }} aria-hidden />
        <span
          className="absolute top-10 md:top-0 font-mono text-xs text-white/50 whitespace-nowrap pl-3"
          style={{ left: "56%" }}
        >
          Industry average
        </span>

        <motion.div
          className="absolute inset-y-0 w-[2px] bg-emerald-400"
          initial={reduced ? { left: "12%" } : { left: "56%", opacity: 0 }}
          whileInView={{ left: "12%", opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
          aria-hidden
        />
        <motion.span
          className="absolute top-0 font-mono text-xs text-emerald-300 whitespace-nowrap pl-3"
          style={{ left: "12%" }}
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
          <span key={i} className={i % 4 === 0 ? "w-px h-8 bg-white/35" : "w-px h-3.5 bg-white/15"} />
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-8 text-sm text-white/50">
        <span>1.0 — every watt reaches compute</span>
        <span className="text-right">2.0 — half of it wasted</span>
      </div>
    </div>
  );
};

/* One hundred ticks, one per site share, igniting in sequence. */
const RenewableField = () => (
  <motion.div
    className="flex flex-wrap gap-1.5 w-[319px] sm:w-auto sm:max-w-[646px]"
    initial="off"
    whileInView="on"
    viewport={{ once: true, margin: "-100px" }}
    variants={{ on: { transition: { staggerChildren: 0.014, delayChildren: 0.2 } } }}
    role="img"
    aria-label="100 of 100 sites renewable-backed"
  >
    {Array.from({ length: 100 }, (_, i) => (
      <motion.span
        key={i}
        className="w-[7px] h-[26px] bg-emerald-400"
        variants={{ off: { opacity: 0.14 }, on: { opacity: 1, transition: { duration: 0.35 } } }}
      />
    ))}
  </motion.div>
);

const ImagePlaceholder = ({ label, className }: { label: string; className: string }) => (
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

const SustainabilityPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnnouncementBanner />
      <Navigation />

      <main>
        {/* ——— Hero ——— */}
        <section className="relative overflow-hidden pt-28 lg:pt-40 px-4 lg:px-6">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(65% 70% at 50% 0%, rgba(34,197,94,0.14) 0%, rgba(34,197,94,0.04) 40%, transparent 70%)",
            }}
          />

          <div className="relative max-w-7xl mx-auto">
            <motion.div {...fadeUp} transition={{ duration: 0.9, ease: EASE }}>
              <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-[0.45em] mb-8">
                Sustainability
              </p>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[116px] font-heading font-bold tracking-tightest leading-[0.9] max-w-6xl">
                AI infrastructure that{" "}
                <span className="text-emerald-400">doesn't cost the earth.</span>
              </h1>
              <p className="mt-8 text-xl lg:text-2xl text-white/75 font-light leading-relaxed max-w-3xl">
                Speed is our headline. This is the foundation: every Helios data center uses
                zero water for cooling, runs power-efficient, and draws on renewable energy.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="xl"
                  className="rounded-full bg-white text-black hover:bg-emerald-400 hover:text-black px-10 group"
                >
                  <Link to="/contact?service=coloc">
                    Reserve capacity
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent text-white hover:bg-white hover:text-black px-10"
                >
                  <Link to="/colocation">See our facilities</Link>
                </Button>
              </div>
            </motion.div>

            {/* Telemetry strip */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-20 lg:mt-28"
            >
              <div className="sustain-pulse h-px bg-emerald-400/20" aria-hidden />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">
                {telemetry.map(([value, label]) => (
                  <div key={label} className="py-7 lg:py-9">
                    <p className="text-3xl lg:text-4xl font-heading font-bold tracking-tightest text-white">
                      {value}
                    </p>
                    <p className="mt-2 text-sm text-white/55 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ——— The instruments ——— */}
        <section className="bg-black pt-20 lg:pt-28 pb-24 lg:pb-36 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionRule index="01" accent="text-emerald-400" rule="bg-emerald-400/20">
              Operating model
            </SectionRule>

            {/* 01 — Water */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 pb-28 lg:pb-36">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <WaterOdometer />
                <p className="mt-5 text-sm lg:text-base text-white/50">
                  Litres of water drawn for cooling — per site, per year.
                </p>

                <div className="mt-14 lg:mt-16 space-y-8 max-w-xl">
                  <div>
                    <div className="flex items-baseline justify-between gap-6 text-sm text-white/55 mb-3">
                      <span>A typical AI campus</span>
                      <span>millions of litres a year</span>
                    </div>
                    <motion.div
                      className="h-px bg-white/35 origin-left"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-6 text-sm text-emerald-300/90 mb-3">
                      <span>Helios</span>
                      <span>zero</span>
                    </div>
                    <motion.div
                      className="h-1 w-1 rounded-full bg-emerald-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 1.6, ease: EASE }}
                      aria-hidden
                    />
                  </div>
                </div>

                <ImagePlaceholder
                  label="Placeholder — dry cooler / cold plate macro, ≥1600px"
                  className="mt-14 lg:mt-16 aspect-[16/10] max-w-xl"
                />
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2">
                <InstrumentIndex>01</InstrumentIndex>
                <h2 className="mt-5 text-4xl lg:text-5xl font-heading font-bold tracking-tightest leading-[0.98] text-white">
                  Water-free cooling, even at NVL72 densities.
                </h2>
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
                <div className="lg:col-span-6">
                  <InstrumentIndex>02</InstrumentIndex>
                  <h2 className="mt-5 text-4xl lg:text-5xl font-heading font-bold tracking-tightest leading-[0.98] text-white">
                    More of every megawatt goes to compute.
                  </h2>
                </div>
                <div className="lg:col-span-5 lg:col-start-8 space-y-5">
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
              <div className="lg:col-span-5">
                <InstrumentIndex>03</InstrumentIndex>
                <h2 className="mt-5 text-4xl lg:text-5xl font-heading font-bold tracking-tightest leading-[0.98] text-white">
                  Renewable-backed power is part of the site plan.
                </h2>
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
              <div className="lg:col-span-7">
                <div className="flex items-end gap-4 text-white">
                  <span className="text-[72px] sm:text-[104px] lg:text-[148px] font-heading font-bold tracking-tightest leading-none">
                    100
                  </span>
                  <span className="pb-1.5 lg:pb-3 font-mono text-xl lg:text-2xl tracking-[0.2em] text-emerald-400">
                    %
                  </span>
                </div>
                <div className="mt-10">
                  <RenewableField />
                  <p className="mt-5 text-sm lg:text-base text-white/50">
                    100 of 100 sites — renewable-backed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Why it matters: the ledger ——— */}
        <section className="bg-[#0A0A0A] border-y border-white/10 py-24 lg:py-32 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionRule index="02" accent="text-emerald-400" rule="bg-emerald-400/20">
              Why it matters
            </SectionRule>
            <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }} className="max-w-4xl">
              <h2 className={sectionHeading}>Sustainable infrastructure is a business advantage.</h2>
              <p className="mt-6 text-lg lg:text-xl text-white/70 font-light leading-relaxed max-w-2xl">
                Clean design is not a side quest. It lowers operating risk, improves reporting,
                and helps scarce power translate into more usable compute.
              </p>
            </motion.div>

            <div className="mt-16 lg:mt-24 border-b border-white/10">
              {consequences.map((item, index) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
                  className="grid lg:grid-cols-12 gap-4 lg:gap-8 items-baseline py-10 lg:py-12 border-t border-white/10"
                >
                  <span className="lg:col-span-1 font-mono text-sm text-emerald-400">
                    0{index + 1}
                  </span>
                  <h3 className="lg:col-span-5 text-3xl lg:text-4xl font-heading font-bold tracking-tightest text-white">
                    {item.title}
                  </h3>
                  <p className="lg:col-span-6 text-white/60 leading-relaxed text-lg font-light">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Spec sheet ——— */}
        <section className="bg-black py-24 lg:py-32 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionRule index="03" accent="text-emerald-400" rule="bg-emerald-400/20">
              Site specification
            </SectionRule>
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
              <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }}>
                <h2 className={sectionHeading}>Built for Blackwell without waste.</h2>
                <p className="mt-6 text-lg lg:text-xl text-white/70 font-light leading-relaxed">
                  The same engineering that lets Helios deliver dense GPU capacity quickly also
                  reduces waste: modular halls, secured power, closed-loop cooling, and repeatable
                  operations.
                </p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                className="border-y border-white/10"
              >
                {spec.map((item, index) => (
                  <div
                    key={item}
                    className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-white/10 first:border-t-0 py-5"
                  >
                    <span className="font-mono text-sm text-emerald-400">0{index + 1}</span>
                    <span className="text-white text-lg">{item}</span>
                  </div>
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

        {/* ——— CTA ——— */}
        <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-4 text-center">
          <h2 className="text-5xl lg:text-7xl font-heading font-bold tracking-tightest leading-[0.92]">
            Fast, clean compute. Pick both.
          </h2>
          <p className="mt-5 text-lg lg:text-xl font-medium opacity-80">
            Thousands of GPUs or tens of megawatts, live in about three months.
          </p>
          <div className="mt-10">
            <Button asChild size="xl" className="rounded-full bg-black text-white hover:bg-black/80 px-10">
              <Link to="/contact?service=coloc">
                Join the waitlist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SustainabilityPage;
