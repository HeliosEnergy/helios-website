import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Server,
  Network,
  Cpu,
  Shield,
  Zap,
  HardDrive,
  Workflow,
  ArrowRight
} from 'lucide-react';

const ClustersPage = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Abstracting rack visualization
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF6B35] selection:text-white">
      <Navigation />

      {/* Hero Section - Heavy Metal Aesthetic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid - simulating server racks */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Cinematic Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[#FF6B35]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-7xl md:text-9xl font-heading font-bold tracking-tightest mb-8 leading-none">
              Sovereign<br />
              <span className="text-white/20">Compute.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed mb-12">
              Dedicated NVIDIA H100 clusters with 3.2Tbps InfiniBand interconnects.
              <br className="hidden md:block" />
              Your network. Your storage. Your metal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 px-10 py-7 text-lg font-bold min-w-[200px]">
                Talk to Sales
              </Button>
              <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 px-10 py-7 text-lg min-w-[200px]">
                View Specs
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom ticker */}
        <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/50 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <p className="text-[#FF6B35] font-bold text-lg">3.2 Tbps</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono">InfiniBand</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">H100 / H200</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono">NVIDIA HGX</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Slurm / K8s</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Orchestration</p>
            </div>

          </div>
        </div>
      </section>

      {/* Hardware Showcase Section */}
      <section ref={targetRef} className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div style={{ opacity, scale }}>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl group">
                {/* Abstract representation of a GPU node */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,107,53,0.1),transparent_70%)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-50">
                  <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                </div>

                <div className="absolute bottom-12 left-12">
                  <h3 className="text-3xl font-bold mb-2">HGX H100</h3>
                  <p className="text-white/60">8x GPU Nodes • 3.2Tbps NVSwitch</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Built for Training Runs</h2>
                <p className="text-xl text-white/60 leading-relaxed">
                  Don't let interconnect bottlenecks kill your training efficiency.
                  Our Sovereign Cloud is built with non-blocking InfiniBand rails,
                  ensuring linear scaling across thousands of GPUs.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: Network,
                    title: "Non-Blocking Fabric",
                    desc: "Full bi-sectional bandwidth optimized for All-Reduce operations."
                  },
                  {
                    icon: HardDrive,
                    title: "High-Performance Storage",
                    desc: "WEKA / Lustre parallel file systems for massive dataset throughput."
                  },
                  {
                    icon: Workflow,
                    title: "Orchestration Freedom",
                    desc: "Native Slurm support for research teams. Managed Kubernetes for production."
                  }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FF6B35]/50 transition-colors">
                      <feature.icon className="w-5 h-5 text-white group-hover:text-[#FF6B35] transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                      <p className="text-white/50">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClustersPage;
