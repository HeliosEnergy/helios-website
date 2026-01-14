import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const ColorSwatch = ({ name, hex, label, dark = false }: { name: string; hex: string; label: string; dark?: boolean }) => (
  <div className="flex flex-col gap-2">
    <div 
      className={`h-32 w-full rounded-none border border-border flex items-end p-4 ${dark ? 'text-white' : 'text-foreground'}`}
      style={{ backgroundColor: hex }}
    >
      <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-heading font-bold text-sm">{name}</span>
      <span className="font-mono text-[10px] opacity-50">{hex}</span>
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="py-20 border-b border-border">
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-1/4">
        <h2 className="font-heading text-xs uppercase tracking-[0.3em] text-muted-foreground sticky top-32">
          {title}
        </h2>
      </div>
      <div className="lg:w-3/4">
        {children}
      </div>
    </div>
  </section>
);

const DesignPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Hero Header */}
      <header className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-primary mb-4 block">Design Language v1.0</span>
          <h1 className="text-6xl sm:text-8xl font-heading font-bold tracking-tighter mb-8">
            The Helios <br />Design System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Our design philosophy is rooted in the honesty of materials and the purity of light. 
            We treat computation not as a commodity, but as a celestial force.
          </p>
        </motion.div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-40">
        
        {/* Color Palette */}
        <Section title="Solar Spectrum">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ColorSwatch name="Solar White" hex="hsl(45, 15%, 98%)" label="Background" />
            <ColorSwatch name="Electric Gold" hex="hsl(48, 95%, 53%)" label="Primary" />
            <ColorSwatch name="Deep Obsidian" hex="hsl(240, 10%, 4%)" label="Dark mode" dark />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <ColorSwatch name="Surface" hex="hsl(45, 10%, 96%)" label="Card Background" />
            <ColorSwatch name="Muted" hex="hsl(45, 5%, 92%)" label="Disabled / Inactive" />
            <ColorSwatch name="Border" hex="hsl(45, 10%, 90%)" label="Separators" />
            <ColorSwatch name="Gold Glow" hex="hsl(48, 95%, 63%)" label="Interactions" />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Language">
          <div className="space-y-12">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-4 underline decoration-primary/30 underline-offset-4">Heading / Space Grotesk</span>
              <h3 className="text-5xl font-heading font-bold tracking-tight">The quick brown fox jumps over the lazy dog.</h3>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-4 underline decoration-primary/30 underline-offset-4">Body / IBM Plex Sans</span>
              <p className="text-xl leading-relaxed text-muted-foreground">
                We use IBM Plex Sans for its clarity and industrial heritage. It is a typeface designed for 
                the intersection of humans and machines, providing legibility at any scale.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-border">
                <span className="block text-4xl font-heading font-bold italic">Italic</span>
              </div>
              <div className="p-4 border border-border">
                <span className="block text-4xl font-heading font-light">Light</span>
              </div>
              <div className="p-4 border border-border">
                <span className="block text-4xl font-mono">Monospace</span>
              </div>
              <div className="p-4 border border-border bg-foreground text-background">
                <span className="block text-4xl font-heading font-bold">Inverted</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Componentry */}
        <Section title="Units of Construction">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Buttons</span>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" size="lg" className="rounded-none px-8">Connect to Cluster</Button>
                  <Button variant="outline" size="lg" className="rounded-none px-8">View Docs</Button>
                  <Button variant="ghost" size="lg" className="rounded-none px-8">Learn More</Button>
                </div>
              </div>
              <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Cards</span>
                <Card className="p-8 rounded-none bg-surface border-border shadow-none hover:border-primary transition-colors cursor-pointer group">
                  <span className="text-primary font-mono text-xs mb-4 block group-hover:translate-x-1 transition-transform">H-100 NVLink</span>
                  <h4 className="text-2xl font-heading font-bold mb-2">Infinite Scaling.</h4>
                  <p className="text-muted-foreground">The foundation of modern AI training infrastructure.</p>
                </Card>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Interactive Elements</span>
              <div className="h-64 w-full bg-surface border border-border flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center z-10">
                  <div className="w-12 h-12 bg-primary mx-auto mb-4 animate-pulse-glow" />
                  <span className="font-heading font-bold tracking-widest uppercase text-xs">Dynamic State</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Motion Philosophy */}
        <Section title="The Breath">
          <div className="prose prose-sm text-muted-foreground">
            <p className="text-lg">
              Motion in Helios is never decorative. It is functional. 
              Elements don't just "appear"—they resolve into existence. 
              We use a standard 600ms easing for entrance and 300ms for exit.
              The goal is to feel as responsive as the silicon we provide.
            </p>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30">
          Designed by Helios Creative in San Francisco
        </p>
      </footer>
    </div>
  );
};

export default DesignPage;
