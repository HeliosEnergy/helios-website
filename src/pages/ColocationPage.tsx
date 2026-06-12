import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10s", unit: "MW", label: "Per-customer blocks" },
  { value: "~3", unit: "mo", label: "Signature to energized" },
  { value: "NVL72", unit: "", label: "Rack densities supported" },
  { value: "0", unit: "L", label: "Water used for cooling" },
];

const reasons = [
  {
    label: "Density",
    title: "Liquid-cooled, NVL72-ready",
    description:
      "Direct-to-chip liquid cooling supports full GB300 NVL72 rack deployments with no derating and no half-empty racks.",
  },
  {
    label: "Speed",
    title: "Energized in ~3 months",
    description:
      "Power, land and long-lead equipment are secured before you sign. Your committed delivery date is in the contract.",
  },
  {
    label: "Power",
    title: "Renewable-backed megawatts",
    description:
      "Sites are located next to clean generation with long-term power agreements and zero water used for cooling.",
  },
  {
    label: "Scale",
    title: "Blocks of 10s of MW",
    description:
      "Take a hall, not a cage. Expansion rights are built in, so your second tranche lands as fast as your first.",
  },
  {
    label: "Operations",
    title: "24/7 staffed, remote hands",
    description:
      "Security, monitoring and smart-hands service around the clock, with SLAs that match hyperscale standards.",
  },
  {
    label: "Connectivity",
    title: "Carrier-neutral, high-bandwidth",
    description:
      "Diverse fiber paths and carrier-neutral meet-me rooms for whatever network architecture you bring.",
  },
];

const steps = [
  {
    number: "01",
    title: "Reserve",
    description:
      "Join the waitlist with your MW target and timeline. We respond within 48 hours.",
  },
  {
    number: "02",
    title: "Scope",
    description:
      "Our engineers spec power, cooling, density and connectivity around your hardware plan.",
  },
  {
    number: "03",
    title: "Build-out",
    description:
      "Pre-secured power and equipment mean fit-out starts immediately after signature.",
  },
  {
    number: "04",
    title: "Energize",
    description:
      "Racks powered, validated and handed over about three months after you signed.",
  },
];

const ColocationPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnnouncementBanner />
      <Navigation />

      <main>
        <section className="relative overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-24">
          <div className="absolute inset-x-[-20%] bottom-[-35%] h-[520px] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,107,53,0.20),transparent_70%)] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-3 lg:px-6">
            <div className="max-w-5xl">
              <p className="text-[#FF6B35] text-[10px] font-mono uppercase tracking-[0.4em] mb-8">
                Colocation
              </p>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[112px] font-heading font-bold tracking-tightest leading-[0.88]">
                Your racks. Our megawatts.{" "}
                <span className="text-primary">Live in ~3 months.</span>
              </h1>
              <p className="mt-8 text-xl text-white/70 font-light leading-relaxed max-w-2xl">
                High-density colocation purpose-built for Blackwell-generation
                hardware — GB300 NVL72, B300 and RTX PRO 6000 deployments at
                densities legacy facilities can't touch.
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
            </div>

            <div className="mt-20 border-y border-white/10">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`py-8 lg:py-10 px-4 lg:px-8 ${index % 2 === 1 ? "border-l border-white/10 lg:border-l" : "lg:border-l lg:first:border-l-0"}`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl lg:text-5xl font-bold tracking-tighter">
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className="text-lg text-white/50 font-semibold">
                          {stat.unit}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.24em] text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-black">
          <div className="max-w-7xl mx-auto px-3 lg:px-6">
            <p className="text-[#FF6B35] text-[10px] font-mono uppercase tracking-[0.4em] mb-6">
              Why colo with Helios
            </p>
            <h2 className="text-5xl lg:text-7xl font-heading font-bold tracking-tightest leading-[0.9] max-w-5xl">
              Most colo is built for servers. Ours is built for AI factories.
            </h2>

            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reasons.map((reason) => (
                <div
                  key={reason.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-10"
                >
                  <p className="text-[#FF6B35] text-[10px] font-mono uppercase tracking-[0.32em] mb-6">
                    {reason.label}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {reason.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-[#111111] border-y border-white/10">
          <div className="max-w-7xl mx-auto px-3 lg:px-6">
            <p className="text-[#FF6B35] text-[10px] font-mono uppercase tracking-[0.4em] mb-6">
              How it works
            </p>
            <h2 className="text-5xl lg:text-7xl font-heading font-bold tracking-tightest leading-[0.9] max-w-4xl">
              Signature to energized racks in four steps.
            </h2>

            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 border-t border-white/10">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`pt-9 pb-2 lg:pb-0 lg:px-8 ${index > 0 ? "lg:border-l lg:border-white/10" : ""}`}
                >
                  <span className="text-[#FF6B35] text-sm font-mono">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-4 text-center">
          <h2 className="text-5xl lg:text-7xl font-heading font-bold tracking-tightest leading-[0.9]">
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
