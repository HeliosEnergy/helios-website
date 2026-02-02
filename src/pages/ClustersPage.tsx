import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Server,
  Network,
  Shield,
  Cpu,
  HardDrive,
  Zap,
  Lock,
  Globe,
  Clock,
  ArrowRight,
  Check
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// GPU Options
const gpuOptions = [
  {
    name: "NVIDIA H100 SXM",
    memory: "80GB HBM3",
    interconnect: "NVLink 4.0",
    bandwidth: "3.35 TB/s",
    available: true
  },
  {
    name: "NVIDIA H200 SXM",
    memory: "141GB HBM3e",
    interconnect: "NVLink 4.0",
    bandwidth: "4.8 TB/s",
    available: true
  },
  {
    name: "NVIDIA A100 SXM",
    memory: "80GB HBM2e",
    interconnect: "NVLink 3.0",
    bandwidth: "2 TB/s",
    available: true
  },
  {
    name: "NVIDIA L40S",
    memory: "48GB GDDR6",
    interconnect: "PCIe Gen4",
    bandwidth: "864 GB/s",
    available: true
  }
];

// Key Features
const features = [
  {
    icon: Network,
    title: "NVSwitch & InfiniBand",
    description: "900GB/s GPU-to-GPU bandwidth with NVSwitch. 400Gbps InfiniBand networking for distributed training."
  },
  {
    icon: Server,
    title: "Bare Metal Performance",
    description: "No virtualization overhead. Direct hardware access with full control over your compute environment."
  },
  {
    icon: Lock,
    title: "Sovereign Infrastructure",
    description: "Dedicated clusters isolated from other tenants. Your data stays within your security boundary."
  },
  {
    icon: Cpu,
    title: "Slurm & Kubernetes",
    description: "Choose your orchestration. Native Slurm integration for HPC or managed Kubernetes for cloud-native workloads."
  },
  {
    icon: HardDrive,
    title: "High-Performance Storage",
    description: "NVMe storage with 10GB/s sequential read. Distributed file systems for checkpoint management."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified. Private networking, encryption at rest and in transit, audit logging."
  }
];

// Cluster Configurations
const configurations = [
  {
    name: "Training Cluster",
    description: "Optimized for large-scale distributed training",
    specs: ["8x-256x H100 SXM", "NVSwitch fabric", "Slurm scheduler", "800Gbps InfiniBand"],
    useCase: "Foundation model training, fine-tuning at scale"
  },
  {
    name: "Inference Cluster",
    description: "Low-latency serving infrastructure",
    specs: ["8x-64x H100/L40S", "Kubernetes orchestration", "Auto-scaling", "Load balancing"],
    useCase: "Production inference, model serving"
  },
  {
    name: "Research Cluster",
    description: "Flexible compute for experimentation",
    specs: ["Mixed GPU types", "Jupyter integration", "Shared storage", "Priority scheduling"],
    useCase: "R&D, hyperparameter tuning, prototyping"
  }
];

// Technical Specs
const specs = [
  { label: "GPU Nodes", value: "256+", detail: "H100 SXM" },
  { label: "NVLink Bandwidth", value: "900", detail: "GB/s per GPU" },
  { label: "InfiniBand", value: "400", detail: "Gbps per node" },
  { label: "Storage IOPS", value: "10M+", detail: "Distributed" },
  { label: "Uptime SLA", value: "99.99%", detail: "Guaranteed" },
  { label: "Deploy Time", value: "< 24h", detail: "Provisioning" }
];

// Dashboard Visual Component
const ClusterDashboard = () => (
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
    className="bg-[#0F0F0F] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden"
  >
    {/* Top Bar: Aggregate Metrics */}
    <div className="h-14 border-b border-white/10 bg-[#141414] grid grid-cols-4 divide-x divide-white/5">
      {[
        { label: "CLUSTER LOAD", value: "92%", color: "text-emerald-500" },
        { label: "AVAIL H100", value: "1,024", color: "text-white" },
        { label: "POWER DRAW", value: "4.2 MW", color: "text-blue-400" },
        { label: "PUE", value: "1.08", color: "text-white/60" }
      ].map((metric, i) => (
        <div key={i} className="flex flex-col justify-center px-6">
          <span className="text-[10px] font-mono text-white/30 tracking-wider">{metric.label}</span>
          <span className={`text-sm font-mono font-bold ${metric.color}`}>{metric.value}</span>
        </div>
      ))}
    </div>

    {/* Main Visualization: Node Topology Grid */}
    <div className="p-8 relative bg-[#0F0F0F]">
      <div className="absolute top-4 left-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
        HGX H100 Node Topology - NVLink Fabric
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 + 0.5 }}
            className="aspect-square bg-[#1A1A1A] rounded-lg border border-white/5 p-3 flex flex-col justify-between relative group hover:border-[#FF6B35]/30 transition-colors"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-white/40">GPU-{i}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-white/80">{65 + Math.floor(Math.random() * 10)}C</span>
                <span className="text-[10px] font-mono text-white/60">{95 + Math.floor(Math.random() * 5)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/50" style={{ width: `${95 + Math.floor(Math.random() * 5)}%` }} />
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500/50" style={{ width: `${70 + Math.floor(Math.random() * 20)}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Bottom Panel: Event Stream */}
    <div className="h-28 border-t border-white/10 bg-[#0A0A0A] p-4 font-mono text-[10px] space-y-1.5 overflow-hidden relative">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-white/30 uppercase tracking-wider">Live Log</span>
      </div>
      <div className="opacity-40 space-y-1.5">
        <p>[SLURM] Job #49221 allocated (128x H100) - Training_LLAMA3_405B</p>
        <p>[K8S] Pod 'inference-worker-xyz' scheduled on node-04</p>
        <p>[SYS] NVLink training topology verified. Bandwidth: 900GB/s</p>
        <p className="text-white/60">[WARN] Node-07 temp delta +2C - adjusting fan curve</p>
        <p>[NET] InfiniBand link active: 400Gbps</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
    </div>
  </motion.div>
);

const ClustersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#FF6B35]/5 blur-[200px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeInUp}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-6"
            >
              GPU Clusters
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-heading font-bold tracking-tightest leading-[0.9] mb-8"
            >
              Sovereign <br />
              <span className="text-white/40">Compute.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-6 max-w-xl"
            >
              Bare-metal performance for your most demanding workloads. Orchestrate massive H100 clusters with Slurm or Kubernetes.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-white/30 font-mono uppercase tracking-widest mb-12"
            >
              NVSwitch / InfiniBand / Bare Metal
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link to="/contact?service=clusters">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-lg transition-transform hover:scale-105">
                  Provision Cluster
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Visual Section */}
      <section className="py-16 relative">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-6 lg:p-10">
            <ClusterDashboard />
          </div>
        </div>
      </section>

      {/* GPU Options */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-4">
              Hardware
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Enterprise-Grade GPUs
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gpuOptions.map((gpu, index) => (
              <motion.div
                key={gpu.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[24px] p-6 hover:border-[#FF6B35]/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <Cpu className="w-8 h-8 text-[#FF6B35]" />
                  {gpu.available && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                      Available
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-4 group-hover:text-[#FF6B35] transition-colors">
                  {gpu.name}
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Memory</span>
                    <span className="text-white/80 font-mono">{gpu.memory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Interconnect</span>
                    <span className="text-white/80 font-mono">{gpu.interconnect}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Bandwidth</span>
                    <span className="text-white/80 font-mono">{gpu.bandwidth}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-4">
              Infrastructure
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Built for Scale
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[24px] p-8 hover:border-[#FF6B35]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#FF6B35]/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#FF6B35]" />
                </div>

                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cluster Configurations */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-4">
              Configurations
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Purpose-Built Clusters
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {configurations.map((config, index) => (
              <motion.div
                key={config.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-8 hover:border-white/20 transition-all"
              >
                <h3 className="text-2xl font-bold mb-2">{config.name}</h3>
                <p className="text-white/50 mb-6">{config.description}</p>

                <ul className="space-y-3 mb-8">
                  {config.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-white/70">{spec}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Use Case</span>
                  <p className="text-sm text-white/60 mt-1">{config.useCase}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-4">
              Specifications
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Infrastructure at Scale
            </h2>
          </motion.div>

          <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-8 lg:p-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {specs.map((spec, index) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-2">{spec.value}</p>
                  <p className="text-sm font-medium text-white mb-1">{spec.label}</p>
                  <p className="text-xs text-white/40">{spec.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#0A0A0A] to-[#111111] border border-white/[0.06] rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#FF6B35]/10 blur-[150px] rounded-full pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tightest mb-6 relative z-10">
              Ready to Scale?
            </h2>
            <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto relative z-10">
              Talk to our infrastructure team about dedicated GPU clusters tailored to your workload.
            </p>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link to="/contact?service=clusters">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-10 py-7 text-lg font-semibold transition-transform hover:scale-105">
                  Provision Cluster
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10 px-10 py-7 text-lg"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClustersPage;
