import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ModelCard } from "@/components/ModelCard";
import { Input } from "@/components/ui/input";
import { SolarOrb } from "@/components/alchemy/SolarOrb";
import { ParticleWeather } from "@/components/alchemy/ParticleWeather";
import { BreathingVoid } from "@/components/alchemy/BreathingVoid";
import { MorphingGeometry } from "@/components/alchemy/MorphingGeometry";
import { CursorGlow } from "@/components/alchemy/CursorGlow";

const ColorSwatch = ({ name, hex, label, dark = false }: { name: string; hex: string; label: string; dark?: boolean }) => (
  <div className="flex flex-col gap-4">
    <div
      className={`h-40 w-full rounded-3xl border border-white/10 flex items-end p-6 transition-transform hover:scale-[1.02] duration-500`}
      style={{ backgroundColor: hex }}
    >
      <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-black/50'}`}>{label}</span>
    </div>
    <div className="flex justify-between items-center px-2">
      <span className="font-heading font-medium text-sm text-white">{name}</span>
      <span className="font-mono text-[10px] text-white/40">{hex}</span>
    </div>
  </div>
);

const Section = ({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) => (
  <section className="py-32 border-b border-white/[0.06]">
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="lg:w-1/4">
        <div className="sticky top-32 space-y-4">
          <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-white/30 leading-relaxed pr-8">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="lg:w-3/4">
        {children}
      </div>
    </div>
  </section>
);

const DesignPage = () => {
  const mockModel = {
    _id: "1",
    name: "Llama 3.1 405B",
    slug: { current: "llama-3-1-405b" },
    provider: "Meta",
    pricingDisplay: "$0.40/M Tokens",
    contextWindow: "128000",
    modelType: "Language",
    initial: "L",
    color: "#0064E0"
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black relative overflow-hidden">
      <CursorGlow />

      {/* Jony's Hero */}
      <header className="pt-48 pb-32 px-4 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/40 mb-8 block italic">The Helios Codex</span>
          <h1 className="text-7xl sm:text-9xl font-heading font-bold tracking-tightest mb-12 leading-[0.85]">
            Power <br />& Purity.
          </h1>
          <p className="text-2xl text-white/50 max-w-2xl leading-relaxed font-light">
            We remove the noise until only the essence remains.
            Infrastructure redefined as a celestial gift.
          </p>
        </motion.div>
      </header>

      <main className="px-4 lg:px-8 max-w-7xl mx-auto pb-64 relative z-10">

        {/* Alchemy Territory 1: The Void That Breathes */}
        <Section
          title="The Void That Breathes"
          description="Black is not empty. It is potential. The background is a study in texture and organic silence."
        >
          <BreathingVoid />
        </Section>

        {/* Alchemy Territory 2: The Sun That Computes */}
        <Section
          title="The Sun That Computes"
          description="A roiling, generative force. Computational power visualized as nuclear fusion — violent, generative, and life-giving."
        >
          <div className="h-[600px] bg-[#050505] rounded-[40px] border border-white/5 overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 z-0">
              <SolarOrb />
            </div>
            <div className="relative z-10 text-center space-y-4">
              <h3 className="text-6xl font-heading font-bold tracking-tightest">Ignition.</h3>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Plasma Core Deployment</p>
            </div>
          </div>
        </Section>

        {/* Alchemy Territory 3: Data as Weather */}
        <Section
          title="Data as Weather"
          description="Thousands of points with collective behavior. Information flowing like starlings murmurating across the GPU cloud."
        >
          <div className="h-[600px] bg-black rounded-[40px] border border-white/5 overflow-hidden relative">
            <ParticleWeather />
            <div className="absolute bottom-12 left-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">Flux Capacity: 5.2 TFLOPS/s</span>
            </div>
          </div>
        </Section>

        {/* Alchemy Territory 4: Geometry That Thinks */}
        <Section
          title="Geometry That Thinks"
          description="Forms that shift between states. Abstract structures that suggest intelligence, processing, and dimension-bending power."
        >
          <div className="h-[600px] bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden flex items-center justify-center">
            <MorphingGeometry />
          </div>
        </Section>

        {/* The Palette */}
        <Section
          title="The Canvas"
          description="A pure black void from which light emerges. Our palette is a study in restraint."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ColorSwatch name="The Void" hex="#000000" label="Primary Background" dark />
            <ColorSwatch name="Pure Light" hex="#FFFFFF" label="Primary Text" />
            <ColorSwatch name="Ember" hex="#FF6B35" label="Accent / Action" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <ColorSwatch name="Elevated" hex="#0A0A0A" label="Surface Low" dark />
            <ColorSwatch name="Defined" hex="#111111" label="Surface Mid" dark />
            <ColorSwatch name="Whisper" hex="rgba(255,255,255,0.06)" label="Borders" dark />
            <ColorSwatch name="Shadow" hex="#666666" label="Secondary Text" dark />
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          description="Hierarchy through weight and space. We do not use color to organize information."
        >
          <div className="space-y-24">
            <div className="space-y-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">Display Large</span>
              <h3 className="text-8xl font-heading font-bold tracking-tightest leading-none">Limitless.</h3>
            </div>
            <div className="space-y-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">Body / IBM Plex Sans</span>
              <p className="text-3xl leading-snug text-white/60 max-w-3xl">
                The best design is the design you don't notice. It is a hand extended, a promise kept.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="aspect-square border border-white/10 rounded-3xl flex items-center justify-center group hover:bg-white hover:text-black transition-all duration-500">
                <span className="text-5xl font-heading font-bold">Aa</span>
              </div>
              <div className="aspect-square border border-white/10 rounded-3xl flex items-center justify-center group hover:bg-white hover:text-black transition-all duration-500">
                <span className="text-5xl font-heading font-light italic">Aa</span>
              </div>
              <div className="aspect-square border border-white/10 rounded-3xl flex items-center justify-center group hover:bg-white hover:text-black transition-all duration-500">
                <span className="text-5xl font-mono">Aa</span>
              </div>
              <div className="aspect-square bg-white text-black rounded-3xl flex items-center justify-center">
                <span className="text-5xl font-heading font-bold">Aa</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Componentry */}
        <Section
          title="Components"
          description="Rounding is kindness. Every element must justify its presence."
        >
          <div className="space-y-24">
            {/* Buttons */}
            <div className="space-y-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">Action Pillars</span>
              <div className="flex flex-wrap items-center gap-8">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-10 h-14 text-base font-medium transition-transform hover:scale-105 duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  Primary Action
                </Button>
                <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 px-10 h-14 text-base font-medium transition-transform hover:scale-105 duration-300">
                  Secondary
                </Button>
                <Button variant="ghost" className="rounded-full text-white/40 hover:text-white hover:bg-transparent px-10 h-14 text-base font-medium underline underline-offset-8">
                  Ghost Link
                </Button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="space-y-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">Card Architecture</span>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Card */}
                <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-12 space-y-8 hover:border-white/20 transition-all duration-500 group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-6 h-6 bg-[#FF6B35] rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-heading font-bold tracking-tight">H100 Clusters</h4>
                    <p className="text-white/40 leading-relaxed">
                      Massively parallel infrastructure for the next generation of intelligence.
                      Deployed in seconds, scaled to infinity.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button variant="ghost" className="p-0 text-white hover:bg-transparent hover:underline underline-offset-4">Configure now →</Button>
                  </div>
                </div>

                {/* Model Showcase Card */}
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 ml-2">Production Model Card</span>
                  <ModelCard model={mockModel as any} />
                </div>
              </div>
            </div>

            {/* Carousel */}
            <div className="space-y-12">
              <div className="flex justify-between items-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">The Carousel</span>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">←</div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white">→</div>
                </div>
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <CarouselItem key={i} className="md:basis-1/3">
                      <div className="bg-[#111111] aspect-[4/5] rounded-[32px] p-8 flex flex-col justify-between border border-white/5 hover:border-white/20 transition-colors">
                        <span className="font-mono text-[10px] text-white/20">00{i}</span>
                        <div>
                          <h5 className="text-2xl font-heading font-bold mb-2">Feature {i}</h5>
                          <p className="text-sm text-white/40 italic">Minimalist description of a feature that feels inevitable.</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Inputs */}
            <div className="space-y-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">Input Fields</span>
              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-4">Access Key</label>
                  <Input
                    placeholder="helios_live_..."
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 px-6 focus-visible:ring-white/20 focus-visible:border-white/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Infrastructure Preview */}
            <div className="space-y-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">Complex Interaction / Infrastructure</span>
              <div className="grid lg:grid-cols-2 gap-1 border border-white/5 rounded-[40px] overflow-hidden bg-white/5">
                <div className="bg-black p-12 flex items-center justify-center aspect-square lg:aspect-auto">
                  <div className="relative w-48 h-48 border-2 border-white/5 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 border border-[#FF6B35]/20 rounded-full animate-ping" />
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black flex flex-col">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-12 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <h5 className="text-2xl font-heading font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">Core Objective {i}</h5>
                      <p className="text-white/40 text-sm leading-relaxed">Purity in purpose, excellence in execution. The infrastructure resolves into simplicity.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials Preview */}
            <div className="space-y-12">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 block">The Human Element / Testimonials</span>
              <div className="bg-white/5 rounded-[40px] p-20 text-center space-y-12">
                <p className="text-4xl font-heading font-medium tracking-tight max-w-3xl mx-auto leading-tight">
                  "Helios is the first time cloud infrastructure has felt like a well-designed tool rather than a necessary evil."
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-white to-white/20" />
                  <div>
                    <p className="font-heading font-bold">Jony I.</p>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/30">Chief Essence Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Motion Philosophy */}
        <Section title="Motion" description="Animation is communication, not decoration. Ease-out to enter, Ease-in to leave.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="h-48 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Float</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-48 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Scale</span>
            </motion.div>
            <motion.div
              whileHover={{ opacity: 0.5 }}
              className="h-48 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Fade</span>
            </motion.div>
            <motion.div
              className="h-48 rounded-[32px] bg-gradient-to-tr from-[#FF6B35]/20 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[#FF6B35]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 z-10">Emerge</span>
            </motion.div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="py-32 px-4 lg:px-8 border-t border-white/5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20">
          Crafted with reverence by Helios Design
        </p>
      </footer>
    </div>
  );
};

export default DesignPage;