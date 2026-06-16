import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowCTA } from "@/components/ui/ArrowCTA";
import { motion } from "framer-motion";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { EASE, fadeUp } from "@/components/HomeRevampSections";
import { ColoFootprintMap } from "@/components/map/FootprintSection";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "10s", unit: "MW", label: "Per-customer blocks" },
  { value: "~3", unit: "mo", label: "Signature to energized" },
  { value: "NVL72", unit: "", label: "Rack densities supported" },
  { value: "0", unit: "L", label: "Water used for cooling" },
];

const moduleHighlights = [
  { value: "1.5", unit: "MW", label: "IT load" },
  { value: "0", unit: "L", label: "water cooling" },
  { value: "A+B", unit: "", label: "feeds" },
];

const moduleSpecs = [
  { label: "Total load", value: "1.95 MW" },
  { label: "Service voltage", value: "480 VAC · 3-PH · 4-W" },
  { label: "Design capacity", value: "2,400 kVA" },
  { label: "Power factor", value: "0.95 lagging" },
  { label: "Footprint", value: "480 × 198 in" },
];

const moduleViews = [
  {
    id: "enclosure",
    label: "01 · Enclosure",
    src: "/coloc/module-enclosure.png",
    alt: "Helios modular data hall, sealed enclosure",
    note: "Sealed, shielded and factory-built.",
  },
  {
    id: "structure",
    label: "02 · Structure",
    src: "/coloc/module-structure.png",
    alt: "Helios modular data hall with enclosure removed, exposing rack rows",
    note: "Skin off. Rack rows, containment and cooling distribution.",
  },
] as const;

const reasons = [
  {
    label: "Density",
    title: "Liquid-cooled, NVL72-ready",
    description: "Direct-to-chip cooling runs full NVL72 racks with zero derating.",
  },
  {
    label: "Speed",
    title: "Energized in ~3 months",
    description: "Power and equipment are secured before you sign. The date is in the contract.",
  },
  {
    label: "Power",
    title: "Renewable-backed megawatts",
    description: "Sited next to clean generation, on long-term power agreements.",
  },
  {
    label: "Scale",
    title: "Blocks of 10s of MW",
    description: "Take a hall, not a cage. Expansion rights come built in.",
  },
  {
    label: "Operations",
    title: "24/7 staffed, remote hands",
    description: "Staffed around the clock, with hyperscale-grade SLAs.",
  },
  {
    label: "Connectivity",
    title: "Carrier-neutral fiber",
    description: "Diverse paths, neutral meet-me rooms, your choice of network.",
  },
];

const steps = [
  {
    when: "Day 0",
    title: "Reserve",
    description: "Tell us your megawatt target and your date. We reply within 48 hours.",
  },
  {
    when: "Week 1",
    title: "Scope",
    description: "Our engineers spec power, cooling and network around your hardware.",
  },
  {
    when: "Week 2",
    title: "Build-out",
    description: "Fit-out begins at once. The land and equipment are already waiting.",
  },
  {
    when: "Month 3",
    title: "Energize",
    description: "Racks powered, validated and handed over. Yours to fill.",
  },
];

/* ------------------------------------------------------------------ */
/* Calm design system (shared with the sustainability page)            */
/* ------------------------------------------------------------------ */

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

const PlanBackdrop = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <img
      src="/coloc/mdch02-plan-hero.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover invert opacity-[0.2] lg:opacity-[0.45]"
      style={{ objectPosition: "80% 45%" }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,black_28%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.1))]" />
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
  </div>
);

/* ------------------------------------------------------------------ */
/* Module image crossfade                                              */
/* ------------------------------------------------------------------ */

const ModuleViewer = () => {
  // Skin on by default; reveal the structure (skin off) on hover / tap.
  const [revealed, setRevealed] = useState(false);
  // Hover-capable pointers (desktop) get the hover reveal; touch devices keep
  // the old auto-switch, since there is no hover there.
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Touch / no-hover devices: auto-cycle enclosure <-> structure like before.
  useEffect(() => {
    if (canHover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setRevealed((r) => !r), 4200);
    return () => clearInterval(t);
  }, [canHover]);

  const view: (typeof moduleViews)[number]["id"] = revealed ? "structure" : "enclosure";
  const active = moduleViews.find((v) => v.id === view)!;

  // Interaction props only on hover-capable devices.
  const interactionProps = canHover
    ? {
        onMouseEnter: () => setRevealed(true),
        onMouseLeave: () => setRevealed(false),
        onClick: () => setRevealed((r) => !r),
        role: "button" as const,
        tabIndex: 0,
        "aria-label": "Toggle data hall cutaway view",
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setRevealed((r) => !r);
          }
        },
      }
    : {};

  return (
    <div
      className={`group relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[2.25/1] overflow-hidden bg-white ${
        canHover ? "cursor-pointer" : ""
      }`}
      {...interactionProps}
    >
      {moduleViews.map((v) => (
        <motion.img
          key={v.id}
          src={v.src}
          alt={v.alt}
          initial={false}
          animate={{ opacity: view === v.id ? 1 : 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0 w-full h-full object-contain scale-[1.7]"
        />
      ))}

      {/* Caption + hover affordance (hint only where hover applies) */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 lg:p-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/70">
          {active.label}
        </span>
        {canHover && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40 transition-opacity duration-300 group-hover:opacity-0">
            Hover to see inside
          </span>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const ColocationPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnnouncementBanner />
      <Navigation />

      <main>
        {/* ───── Hero — the drawing sheet ───── */}
        <section className="relative overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-24">
          <PlanBackdrop />
          <div className="absolute inset-x-[-20%] bottom-[-35%] h-[520px] bg-[radial-gradient(50%_60%_at_50%_100%,hsl(var(--primary)/0.14),transparent_70%)] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 lg:px-12">
            <motion.div
              variants={stage}
              initial="hidden"
              animate="visible"
              className="max-w-5xl"
            >
              <motion.h1
                variants={rise}
                className={`${calmHeading} text-5xl sm:text-6xl lg:text-7xl text-white`}
              >
                Your racks. Our megawatts.{" "}
                <span className="text-primary">Live in ~3 months.</span>
              </motion.h1>
              <motion.p
                variants={rise}
                className="mt-8 text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-2xl"
              >
                High-density colocation built for the Blackwell generation.
                GB300 NVL72, B300 and RTX PRO 6000, at densities legacy
                facilities can't touch.
              </motion.p>
              <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-5">
                <ArrowCTA to="/contact?service=coloc" tone="dark" accent="primary">
                  Reserve colo capacity
                </ArrowCTA>
                <Link
                  to="/contact?service=coloc"
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60 hover:text-white transition-colors"
                >
                  Talk to our team
                </Link>
              </motion.div>
            </motion.div>

            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-y border-white/10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...fadeUp}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                  className="bg-black py-8 lg:py-10 px-4 lg:px-8"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className={`${calmHeading} text-4xl lg:text-5xl text-white`}>
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-lg text-primary font-mono tracking-[0.1em]">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.24em] text-white/65">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── 01 · The module — paper datasheet ───── */}
        <section className="bg-white text-black py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }}>
              <h2 className={`${calmHeading} text-4xl lg:text-5xl text-[#15171A] max-w-3xl`}>
                A data hall, productized.
              </h2>
              <p className="mt-6 text-lg lg:text-xl text-black/70 font-light leading-relaxed max-w-2xl">
                A Helios hall is not a construction project. It is a product.
                Engineered once, built in parallel, set down on land that is
                already powered. That is how three months happens.
              </p>
            </motion.div>

            <div className="mt-14 lg:mt-20 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-12 items-end">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, ease: EASE }}
                className="min-w-0"
              >
                <ModuleViewer />
              </motion.div>

              {/* Electrical figures — compact lower-right ledger */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                className="w-full max-w-[330px] lg:justify-self-end"
              >
                <div className="flex flex-wrap gap-2">
                  {moduleHighlights.map((pill) => (
                    <span
                      key={pill.label}
                      className="inline-flex items-baseline gap-1.5 rounded-full bg-black text-white pl-3.5 pr-3 py-1.5"
                    >
                      <span className="font-heading font-medium text-sm tracking-tight leading-none">
                        {pill.value}
                        {pill.unit && (
                          <span className="text-primary"> {pill.unit}</span>
                        )}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-white/70">
                        {pill.label}
                      </span>
                    </span>
                  ))}
                </div>

                <dl className="mt-5 space-y-2.5">
                  {moduleSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <dt className="text-[9px] font-mono uppercase tracking-[0.14em] text-black/50 whitespace-nowrap">
                        {spec.label}
                      </dt>
                      <dd className="font-heading font-medium text-sm tracking-tight text-black text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───── 02 · Specification index — why Helios ───── */}
        <section className="py-20 lg:py-28 bg-black">
          <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.8, ease: EASE }}
              className={`${calmHeading} text-4xl lg:text-5xl text-white max-w-4xl`}
            >
              Most colo is built for servers. Ours is built for AI factories.
            </motion.h2>

            <div className="mt-14 lg:mt-20 border-t border-white/10">
              {reasons.map((reason) => (
                <motion.div
                  key={reason.label}
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-3 py-7 lg:py-9 border-b border-white/10 items-baseline"
                >
                  <h3 className={`lg:col-span-5 text-xl lg:text-2xl ${calmHeading} text-white`}>
                    {reason.title}
                  </h3>
                  <p className="lg:col-span-6 lg:col-start-7 text-base text-white/70 leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── 03 · The sites ───── */}
        <section className="py-20 lg:py-28 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }}>
              <h2 className={`${calmHeading} text-4xl lg:text-5xl text-white max-w-3xl`}>
                Power first. Everything else follows.
              </h2>
              <p className="mt-6 text-lg lg:text-xl text-white/75 font-light leading-relaxed max-w-2xl">
                We site next to clean generation, contract the megawatts long-term,
                and energize the land before a single module arrives. Your hall
                lands on power that already exists.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="mt-12 lg:mt-16"
            >
              <ColoFootprintMap />
            </motion.div>

            <div className="mt-14 lg:mt-20 grid lg:grid-cols-12 gap-6 lg:gap-8">
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, ease: EASE }}
                className="lg:col-span-8"
              >
                <figure className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-[#0A0A0A]">
                  <img
                    src="/coloc/site-overview-aerial.png"
                    alt="Aerial view of Helios modular data halls beside a substation and wind turbines at dusk"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </figure>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
                className="lg:col-span-4"
              >
                <figure className="relative aspect-[4/5] lg:h-full lg:aspect-auto overflow-hidden border border-white/10 bg-[#0A0A0A]">
                  <img
                    src="/coloc/hall-interior-rack-corridor.png"
                    alt="Interior corridor of high-density data hall racks"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </figure>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───── 04 · The timeline — vertical time spine ───── */}
        <section className="py-20 lg:py-28 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.8, ease: EASE }}
              className={`${calmHeading} text-4xl lg:text-5xl text-white max-w-3xl`}
            >
              Four steps. About ninety days.
            </motion.h2>

            {/* Parent owns the in-view trigger — children scaled from 0 have no bbox */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="relative mt-10 lg:mt-14 max-w-3xl"
            >
              <motion.span
                variants={{
                  hidden: { scaleY: 0 },
                  visible: { scaleY: 1, transition: { duration: 1.8, ease: EASE } },
                }}
                className="absolute left-[3px] top-10 bottom-10 w-px bg-white/15 origin-top"
              />
              {steps.map((step, i) => {
                const last = i === steps.length - 1;
                return (
                  <motion.div
                    key={step.title}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, delay: 0.3 + i * 0.35, ease: EASE },
                      },
                    }}
                    className="relative pl-10 lg:pl-14 py-8 lg:py-10"
                  >
                    <span
                      className={`absolute left-0 top-[3.05rem] lg:top-[3.65rem] w-[7px] h-[7px] rounded-full ${
                        last ? "bg-primary" : "bg-white/30"
                      }`}
                    />
                    <div className="flex items-baseline justify-between gap-6">
                      <h3 className={`text-2xl lg:text-3xl ${calmHeading} text-white`}>
                        {step.title}
                      </h3>
                      <span
                        className={`text-[11px] font-mono uppercase tracking-[0.25em] whitespace-nowrap ${
                          last ? "text-primary" : "text-white/50"
                        }`}
                      >
                        {step.when}
                      </span>
                    </div>
                    <p className="mt-3 text-base lg:text-lg text-white/70 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ───── CTA — quiet light band ───── */}
        <section className="bg-[#EDF0F2] text-[#15171A] py-24 lg:py-36 px-4 lg:px-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-end">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: EASE }}
              className="lg:col-span-7 lg:col-start-6"
            >
              <h2 className={`${calmHeading} text-4xl sm:text-5xl lg:text-6xl text-[#15171A]`}>
                Megawatts move fast here.
              </h2>
              <p className="mt-5 text-lg lg:text-xl text-[#2A2D31] font-light max-w-md">
                Blocks are allocated in waitlist order. Claim yours.
              </p>
              <div className="mt-10">
                <ArrowCTA to="/contact?service=coloc" tone="light" accent="primary">
                  Reserve colo capacity
                </ArrowCTA>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ColocationPage;
