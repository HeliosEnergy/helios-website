import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { EASE, fadeUp, SectionRule, sectionHeading } from "@/components/HomeRevampSections";
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
/* Drawing-sheet primitives                                            */
/* ------------------------------------------------------------------ */

const headingLight =
  "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-black tracking-tightest leading-[0.92]";

const SectionRuleLight = ({ index, children }: { index: string; children: string }) => (
  <div className="flex items-center gap-5 mb-8 lg:mb-10">
    <span className="text-primary text-[10px] font-mono uppercase tracking-[0.4em] whitespace-nowrap">
      {children}
    </span>
    <span className="h-px flex-1 bg-black/15" />
    <span className="text-black/35 text-[10px] font-mono tracking-[0.3em]">/ {index}</span>
  </div>
);

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
  const [view, setView] = useState<(typeof moduleViews)[number]["id"]>("enclosure");

  useEffect(() => {
    const t = setInterval(() => {
      setView((v) => (v === "enclosure" ? "structure" : "enclosure"));
    }, 4200);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[2.25/1] overflow-hidden bg-white">
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="max-w-5xl"
            >
              <div className="flex items-baseline gap-5 mb-8">
                <p className="text-primary text-[10px] font-mono uppercase tracking-[0.4em]">
                  Colocation
                </p>
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[112px] font-heading font-bold tracking-tightest leading-[0.9]">
                Your racks. Our megawatts.{" "}
                <span className="text-primary">Live in ~3 months.</span>
              </h1>
              <p className="mt-8 text-xl lg:text-2xl text-white/80 font-light leading-relaxed max-w-2xl">
                High-density colocation built for the Blackwell generation.
                GB300 NVL72, B300 and RTX PRO 6000, at densities legacy
                facilities can't touch.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="xl"
                  className="rounded-full bg-white text-black hover:bg-primary hover:text-primary-foreground px-10 group"
                >
                  <Link to="/contact?service=coloc">
                    Reserve colo capacity
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="rounded-full border-white/30 bg-transparent text-white hover:bg-white hover:text-black px-10"
                >
                  <Link to="/contact?service=coloc">Talk to our team</Link>
                </Button>
              </div>
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
                    <span className="text-4xl lg:text-5xl font-heading font-bold tracking-tightest">
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
            <SectionRuleLight index="01">The module</SectionRuleLight>
            <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }}>
              <h2 className={`${headingLight} max-w-5xl`}>
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
                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-black/55">
                  Electrical · per module
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {moduleHighlights.map((pill) => (
                    <span
                      key={pill.label}
                      className="inline-flex items-baseline gap-1.5 rounded-full bg-black text-white pl-3.5 pr-3 py-1.5"
                    >
                      <span className="font-heading font-bold text-sm tracking-tightest leading-none">
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
                      <dd className="font-heading font-bold text-sm tracking-tight text-black text-right">
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
            <SectionRule index="02">Why colo with Helios</SectionRule>
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.8, ease: EASE }}
              className={`${sectionHeading} max-w-5xl`}
            >
              Most colo is built for servers. Ours is built for AI factories.
            </motion.h2>

            <div className="mt-14 lg:mt-20 border-t border-white/10">
              {reasons.map((reason, i) => (
                <motion.div
                  key={reason.label}
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
                  className="group grid grid-cols-12 gap-x-4 gap-y-3 py-7 lg:py-9 border-b border-white/10 items-baseline"
                >
                  <span className="col-span-2 lg:col-span-1 text-white/40 group-hover:text-primary transition-colors duration-300 text-sm font-mono tracking-[0.2em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 lg:col-span-2 text-[11px] font-mono uppercase tracking-[0.3em] text-white/55 self-center">
                    {reason.label}
                  </span>
                  <h3 className="col-span-10 col-start-3 lg:col-span-4 lg:col-start-auto text-xl lg:text-2xl font-heading font-bold text-white tracking-tight">
                    {reason.title}
                  </h3>
                  <p className="col-span-10 col-start-3 lg:col-span-5 lg:col-start-auto text-base text-white/70 leading-relaxed">
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
            <SectionRule index="03">The sites</SectionRule>
            <motion.div {...fadeUp} transition={{ duration: 0.8, ease: EASE }}>
              <h2 className={`${sectionHeading} max-w-4xl`}>
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
            <SectionRule index="04">How it works</SectionRule>
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.8, ease: EASE }}
              className={`${sectionHeading} max-w-4xl`}
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
                      <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white tracking-tight">
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

        {/* ───── CTA ───── */}
        <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-4 text-center">
          <h2 className="text-5xl lg:text-7xl font-heading font-bold tracking-tightest leading-[0.92]">
            Megawatts move fast here.
          </h2>
          <p className="mt-5 text-lg lg:text-xl font-medium opacity-80">
            Blocks are allocated in waitlist order. Claim yours.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="xl"
              className="rounded-full bg-black text-white hover:bg-black/80 px-10"
            >
              <Link to="/contact?service=coloc">Reserve colo capacity</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ColocationPage;
