import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Database,
  Layers,
  Shield,
  Zap,
  Code,
  LineChart,
  Lock,
  Cpu,
  ArrowRight,
  Check,
  RefreshCw,
  GitBranch
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

// Training Features
const features = [
  {
    icon: Layers,
    title: "Together Kernel Collection (TKC)",
    description: "Leverage research breakthroughs with optimized CUDA kernels that accelerate training by up to 2x compared to standard implementations."
  },
  {
    icon: Shield,
    title: "Secure Training Environment",
    description: "Your data never leaves your security boundary. Train on sensitive data with confidence using isolated compute environments."
  },
  {
    icon: LineChart,
    title: "Advanced Monitoring",
    description: "Real-time training metrics, loss curves, and resource utilization. Integrated with W&B, MLflow, and TensorBoard."
  },
  {
    icon: RefreshCw,
    title: "Automatic Checkpointing",
    description: "Fault-tolerant training with automatic checkpoint management. Resume training seamlessly after any interruption."
  },
  {
    icon: GitBranch,
    title: "Experiment Tracking",
    description: "Version control for models and datasets. Track hyperparameters, compare runs, and reproduce results."
  },
  {
    icon: Zap,
    title: "Optimized Data Pipeline",
    description: "High-throughput data loading with distributed preprocessing. Never let your GPUs wait for data."
  }
];

// Training Options
const trainingOptions = [
  {
    name: "Full Fine-Tuning",
    description: "Train all model parameters for maximum customization",
    specs: ["All parameters trainable", "Highest customization", "Largest compute requirements"],
    bestFor: "When you need maximum model adaptation"
  },
  {
    name: "LoRA / QLoRA",
    description: "Parameter-efficient fine-tuning with low-rank adapters",
    specs: ["0.1-1% parameters trained", "Memory efficient", "Quick iteration cycles"],
    bestFor: "When you want fast, cost-effective fine-tuning"
  },
  {
    name: "Pre-training",
    description: "Train foundation models from scratch",
    specs: ["Full model training", "Custom architectures", "Massive scale support"],
    bestFor: "When you need proprietary foundation models"
  }
];

// Technical Specs
const specs = [
  { label: "GPU Support", value: "H100/H200", detail: "NVIDIA" },
  { label: "Max Cluster", value: "2,048", detail: "GPUs" },
  { label: "Throughput", value: "2x", detail: "vs. baseline" },
  { label: "Checkpoint", value: "Auto", detail: "Management" },
  { label: "Frameworks", value: "PyTorch", detail: "Native" },
  { label: "Data Security", value: "SOC 2", detail: "Certified" }
];

// Software Stack Visual Component
const SoftwareStackVisual = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="bg-[#0A0A0A] border border-white/10 rounded-[40px] p-8 lg:p-12 relative"
  >
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Main Stack */}
      <div className="flex-1 space-y-4">
        {/* Customer Software Layer */}
        <div className="flex items-center gap-6">
          <div className="w-36 text-right hidden md:block">
            <span className="text-xs font-mono uppercase tracking-widest text-white/20">Customer Software</span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03] hover:border-white/20 transition-colors"
          >
            <span className="font-medium text-white">AI Model</span>
          </motion.div>
        </div>

        {/* User-facing APIs Layer */}
        <div className="flex items-center gap-6">
          <div className="w-36 text-right hidden md:block">
            <span className="text-xs font-mono uppercase tracking-widest text-white/20">User-facing APIs</span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex-1 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03] relative overflow-hidden group hover:border-blue-500/30 transition-colors"
          >
            <div className="absolute inset-0 bg-blue-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="font-medium text-white relative z-10">PyTorch</span>
          </motion.div>
        </div>

        {/* Low-level Libraries Layer */}
        <div className="flex items-center gap-6">
          <div className="w-36 text-right hidden md:block">
            <span className="text-xs font-mono uppercase tracking-widest text-white/20">Low-level Libraries</span>
          </div>
          <div className="flex-1 space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03] hover:border-white/20 transition-colors"
            >
              <span className="font-medium text-white">NVIDIA</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03] hover:border-white/20 transition-colors"
            >
              <span className="font-medium text-white">cuBLAS / cuDNN</span>
            </motion.div>
          </div>
        </div>

        {/* Hardware Layer */}
        <div className="flex items-center gap-6">
          <div className="w-36 text-right hidden md:block">
            <span className="text-xs font-mono uppercase tracking-widest text-white/20">Hardware</span>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex-1 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03] hover:border-white/20 transition-colors"
          >
            <Cpu className="w-5 h-5 mr-2 text-white/60" />
            <span className="font-medium text-white">GPU</span>
          </motion.div>
        </div>
      </div>

      {/* TKC Sidebar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="lg:w-28 flex lg:flex-col justify-center"
      >
        <div className="h-full lg:h-[280px] w-full lg:w-full bg-[#FF6B35] rounded-2xl flex items-center justify-center relative shadow-[0_0_40px_rgba(255,107,53,0.3)] overflow-hidden">
          <span className="font-bold text-white text-xl lg:text-2xl tracking-tighter lg:rotate-[-90deg] whitespace-nowrap">TKC</span>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-2xl" />
        </div>
      </motion.div>
    </div>

    {/* Legend */}
    <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap gap-6 justify-center text-xs text-white/40">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-[#FF6B35]" />
        <span>Together Kernel Collection (TKC)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-white/10 border border-white/20" />
        <span>Standard Components</span>
      </div>
    </div>
  </motion.div>
);

const TrainingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B35]/10 blur-[200px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full" />
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
              Model Training
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-heading font-bold tracking-tightest leading-[0.9] mb-8"
            >
              Training.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-6 max-w-xl"
            >
              Securely and cost effectively train your own models from the ground up, leveraging research breakthroughs such as Together Kernel Collection (TKC).
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-white/30 font-mono uppercase tracking-widest mb-12"
            >
              PyTorch / NVIDIA / Optimized Kernels
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link to="/contact?service=training">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-lg transition-transform hover:scale-105">
                  Contact Us
                </Button>
              </Link>
              <Link to="/clusters">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  View Clusters
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Software Stack Visual Section */}
      <section className="py-16 relative">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-4">
              Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tightest">
              Optimized Training Stack
            </h2>
          </motion.div>

          <SoftwareStackVisual />
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
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Enterprise Training Platform
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

      {/* Training Options */}
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
              Training Methods
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Choose Your Approach
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {trainingOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-8 hover:border-white/20 transition-all"
              >
                <h3 className="text-2xl font-bold mb-2">{option.name}</h3>
                <p className="text-white/50 mb-6">{option.description}</p>

                <ul className="space-y-3 mb-8">
                  {option.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-white/70">{spec}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Best For</span>
                  <p className="text-sm text-white/60 mt-1">{option.bestFor}</p>
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
              Training at Scale
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

      {/* Use Cases */}
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
              Applications
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              What You Can Train
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Foundation Models",
                description: "Train custom LLMs from scratch on your proprietary data"
              },
              {
                title: "Domain-Specific Models",
                description: "Adapt models for legal, medical, financial, or technical domains"
              },
              {
                title: "Multimodal Models",
                description: "Train vision-language models for your specific use cases"
              },
              {
                title: "Embedding Models",
                description: "Create custom embeddings optimized for your retrieval tasks"
              }
            ].map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[24px] p-6"
              >
                <Database className="w-6 h-6 text-[#FF6B35] mb-4" />
                <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
                <p className="text-sm text-white/50">{useCase.description}</p>
              </motion.div>
            ))}
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
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF6B35]/10 blur-[150px] rounded-full pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tightest mb-6 relative z-10">
              Ready to Train?
            </h2>
            <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto relative z-10">
              Our team will help you design and execute a training strategy tailored to your needs.
            </p>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link to="/contact?service=training">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-10 py-7 text-lg font-semibold transition-transform hover:scale-105">
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/clusters">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10 px-10 py-7 text-lg"
                >
                  Explore Clusters
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

export default TrainingPage;
