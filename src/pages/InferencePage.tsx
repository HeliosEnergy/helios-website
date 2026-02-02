import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Brain,
  Clock,
  Shield,
  Server,
  Code,
  ChevronDown,
  Play,
  Maximize2,
  TerminalSquare,
  Gauge,
  Globe,
  Lock,
  Cpu,
  ArrowRight
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

// Featured Models
const featuredModels = [
  {
    name: "Kimi k2.5",
    provider: "Moonshot",
    description: "Advanced reasoning with extended thinking capabilities",
    latency: "0.3s",
    contextWindow: "128K tokens"
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "State-of-the-art reasoning with chain-of-thought",
    latency: "0.4s",
    contextWindow: "64K tokens"
  },
  {
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "High-performance open-weight foundation model",
    latency: "0.2s",
    contextWindow: "128K tokens"
  },
  {
    name: "Qwen 2.5 72B",
    provider: "Alibaba",
    description: "Multilingual reasoning and code generation",
    latency: "0.25s",
    contextWindow: "32K tokens"
  }
];

// Key Benefits
const benefits = [
  {
    icon: Brain,
    title: "Chain-of-Thought Reasoning",
    description: "Models that think step-by-step, showing their reasoning process before delivering answers. Perfect for complex problem-solving."
  },
  {
    icon: Clock,
    title: "Sub-Second Latency",
    description: "Optimized inference infrastructure delivers responses in milliseconds. Our custom kernels reduce time-to-first-token by up to 3x."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified. Your data never trains our models. Private deployments available for regulated industries."
  },
  {
    icon: Server,
    title: "99.99% Uptime SLA",
    description: "Multi-region redundancy with automatic failover. Production-grade reliability backed by enterprise SLAs."
  },
  {
    icon: Code,
    title: "OpenAI-Compatible API",
    description: "Drop-in replacement for existing integrations. Migrate from OpenAI, Anthropic, or Azure in minutes."
  },
  {
    icon: Gauge,
    title: "Adaptive Batching",
    description: "Intelligent request batching maximizes throughput while maintaining low latency. Process millions of requests efficiently."
  }
];

// Technical Specs
const specs = [
  { label: "Time to First Token", value: "< 100ms", detail: "P99 latency" },
  { label: "Throughput", value: "10K+ TPS", detail: "Per endpoint" },
  { label: "Context Window", value: "128K", detail: "Max tokens" },
  { label: "Availability", value: "99.99%", detail: "Uptime SLA" },
  { label: "Regions", value: "5+", detail: "Global POPs" },
  { label: "Models", value: "50+", detail: "Available" }
];

// Playground Visual Component
const PlaygroundVisual = () => (
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
    className="relative bg-[#141414] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden"
  >
    {/* IDE Header */}
    <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#1A1A1A]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#252525] rounded-md border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono text-white/90">kimi-k2.5-thinking</span>
          <ChevronDown className="w-3 h-3 text-white/40" />
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2 text-white/40">
          <TerminalSquare className="w-3 h-3" />
          <span className="text-xs font-medium">Playground</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#FF6B35] rounded-md hover:bg-[#FF6B35]/90 transition-colors cursor-pointer">
          <Play className="w-3 h-3 text-white fill-current" />
          <span className="text-xs text-white font-medium tracking-wide">RUN</span>
        </div>
        <Maximize2 className="w-4 h-4 text-white/20" />
      </div>
    </div>

    {/* IDE Body */}
    <div className="flex">
      {/* Main Chat/Editor Area */}
      <div className="flex-1 p-6 flex flex-col gap-6 bg-[#141414]">
        {/* Input Block */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider ml-1">Input</span>
          <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-4">
            <p className="text-sm font-mono text-white/70 leading-relaxed">
              Analyze the implications of quantum supremacy on current encryption standards.
            </p>
          </div>
        </div>

        {/* Output Block */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider ml-1">Output</span>
            <span className="text-[10px] font-mono text-emerald-500/80">0.4s latency</span>
          </div>

          <div className="border-l border-white/10 pl-4 pt-1 space-y-4">
            {/* Thinking Process */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/40">
                <ChevronDown className="w-3 h-3" />
                <span className="text-xs font-mono">Thinking Process</span>
              </div>
              <div className="pl-5 space-y-1.5">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[11px] font-mono text-white/30"
                >
                  &gt; parsing_protocol(RSA, ECC)
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="text-[11px] font-mono text-white/30"
                >
                  &gt; simulating_shor_algorithm(qubits=1000)
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="text-[11px] font-mono text-[#FF6B35]/80 animate-pulse"
                >
                  &gt; generating_hypothesis...
                </motion.div>
              </div>
            </div>

            {/* Final Answer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className="pt-2"
            >
              <p className="text-sm text-white/90 leading-relaxed font-light">
                Quantum supremacy represents a paradigm shift for cryptography. Public-key cryptosystems like RSA rely on integer factorization...
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-56 border-l border-white/10 bg-[#111111] p-5 space-y-6 hidden lg:block">
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">Parameters</label>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60 font-mono">
                <span>Temperature</span>
                <span>0.7</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-[#FF6B35]/50" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60 font-mono">
                <span>Top P</span>
                <span>0.9</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[90%] h-full bg-[#FF6B35]/50" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60 font-mono">
                <span>Max Tokens</span>
                <span>4K</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[40%] h-full bg-[#FF6B35]/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const InferencePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B35]/10 blur-[200px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full" />
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
              Inference Platform
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-heading font-bold tracking-tightest leading-[0.9] mb-8"
            >
              Reasoning <br />
              <span className="text-white/40">Engine.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-6 max-w-xl"
            >
              Beyond simple inference. Deploy reasoning models that think before they speak.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-white/30 font-mono uppercase tracking-widest mb-12"
            >
              Featuring Kimi k2.5 & DeepSeek R1
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link to="/contact?service=inference">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-lg transition-transform hover:scale-105">
                  Start Reasoning
                </Button>
              </Link>
              <Link to="/model-library">
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  View Models
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Playground Visual Section */}
      <section className="py-16 relative">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-8 lg:p-12">
            <PlaygroundVisual />
          </div>
        </div>
      </section>

      {/* Featured Models */}
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
              Featured Models
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              State-of-the-Art Reasoning
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[24px] p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    {model.provider}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">
                  {model.name}
                </h3>
                <p className="text-sm text-white/50 mb-6">
                  {model.description}
                </p>

                <div className="flex justify-between text-xs font-mono">
                  <div>
                    <span className="text-white/30">Latency</span>
                    <p className="text-white/80">{model.latency}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-white/30">Context</span>
                    <p className="text-white/80">{model.contextWindow}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
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
              Why Helios
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Built for Production
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[24px] p-8 hover:border-[#FF6B35]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#FF6B35]/10 transition-colors">
                  <benefit.icon className="w-6 h-6 text-[#FF6B35]" />
                </div>

                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-white/50 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
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
              Performance
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Technical Specifications
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
              Applications
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tightest">
              Powering Innovation
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Agents & Assistants",
                description: "Build intelligent agents that reason through complex tasks, maintain context, and take autonomous actions.",
                icon: Brain
              },
              {
                title: "Code Generation",
                description: "Generate, review, and refactor code with models that understand programming patterns and best practices.",
                icon: Code
              },
              {
                title: "Research & Analysis",
                description: "Process and synthesize large documents, research papers, and data sets with advanced reasoning.",
                icon: Globe
              }
            ].map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-[24px] p-8"
              >
                <useCase.icon className="w-8 h-8 text-[#FF6B35] mb-6" />
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-white/50 leading-relaxed">{useCase.description}</p>
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
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B35]/10 blur-[150px] rounded-full pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tightest mb-6 relative z-10">
              Ready to Think Deeper?
            </h2>
            <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto relative z-10">
              Deploy reasoning models in minutes. Pay only for what you use.
            </p>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link to="/contact?service=inference">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 px-10 py-7 text-lg font-semibold transition-transform hover:scale-105">
                  Start Reasoning
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

export default InferencePage;
