import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Database,
  Network,
  Info,
  ChevronDown,
  Play,
  Maximize2,
  TerminalSquare
} from "lucide-react";
import { Button } from "./ui/button";

const tabs = [
  { id: "inference", label: "Inference", icon: Zap },
  { id: "clusters", label: "Clusters", icon: Network },
  { id: "training", label: "Training", icon: Database },
];

const InferenceContent = () => (
  <div className="relative h-auto lg:h-[600px] w-full rounded-[24px] bg-[#0A0A0A] border border-white/10 overflow-hidden flex flex-col lg:flex-row">
    {/* Left Side: Content & CTA */}
    <div className="relative z-20 w-full lg:w-2/5 p-6 lg:p-12 flex flex-col justify-center space-y-8 lg:bg-gradient-to-r lg:from-[#0A0A0A] lg:via-[#0A0A0A] lg:to-transparent">
      <h3 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tightest leading-[0.9]">
        Reasoning <br /> <span className="text-white/60">Engine.</span>
      </h3>
      <div className="space-y-6 text-base lg:text-lg text-white/60 font-light leading-relaxed">
        <p>
          Beyond simple inference. Deploy reasoning models that think before they speak.
        </p>
        <p className="text-sm text-white/50 font-mono uppercase tracking-widest">
          Featuring Kimi k2.5 & DeepSeek R1
        </p>
      </div>
      <div className="flex gap-4">
        <Link to="/contact?service=inference">
          <Button className="rounded-full bg-white text-black hover:bg-white/90 px-6 py-4 text-base lg:px-8 lg:py-6 lg:text-lg transition-transform hover:scale-105">
            Start Reasoning
          </Button>
        </Link>
      </div>
    </div>

    {/* Right Side: Off-Center Playground Visual (AI Studio Style) */}
    <div className="hidden lg:block absolute top-0 right-0 w-full lg:w-[65%] h-full pointer-events-none select-none">
      {/* The Playground Card */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-12 -right-12 md:-right-24 bottom-12 w-full bg-[#141414] rounded-l-xl rounded-r-none border-l border-t border-b border-white/10 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* IDE Header */}
        <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#1A1A1A]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#252525] rounded-md border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-white/90">kimi-k2.5-thinking</span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 text-white/60">
              <TerminalSquare className="w-3 h-3" />
              <span className="text-xs font-medium">Playground</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors cursor-pointer">
                <Play className="w-3 h-3 text-white fill-current" />
                <span className="text-xs text-white font-medium tracking-wide">RUN</span>
             </div>
             <Maximize2 className="w-4 h-4 text-white/50" />
          </div>
        </div>

        {/* IDE Body */}
        <div className="flex-1 flex">
          {/* Main Chat/Editor Area */}
          <div className="flex-1 p-6 flex flex-col gap-6 relative bg-[#141414]">
            {/* System/User Prompt Block */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider ml-1">Input</span>
              <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-4">
                <p className="text-sm font-mono text-white/70 leading-relaxed">
                  Analyze the implications of quantum supremacy on current encryption standards.
                </p>
              </div>
            </div>

            {/* Output Block */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider ml-1">Output</span>
                <span className="text-[10px] font-mono text-emerald-500/80">0.4s latency</span>
              </div>
              
              <div className="h-full border-l border-white/10 pl-4 pt-1 space-y-4">
                {/* Thinking Process (Collapsible style) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/60">
                    <ChevronDown className="w-3 h-3" />
                    <span className="text-xs font-mono">Thinking Process</span>
                  </div>
                  <div className="pl-5 space-y-1.5">
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-[11px] font-mono text-white/50"
                    >
                      &gt; parsing_protocol(RSA, ECC)
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      className="text-[11px] font-mono text-white/50"
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
                  transition={{ delay: 2.5 }}
                  className="pt-2"
                >
                  <p className="text-sm text-white/90 leading-relaxed font-light">
                    Quantum supremacy represents a paradigm shift for cryptography. Public-key cryptosystems like RSA rely on integer factorization...
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (Parameters) - Dense & Technical */}
          <div className="w-64 border-l border-white/10 bg-[#111111] p-5 space-y-6 hidden lg:block">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Parameters</label>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60 font-mono">
                    <span>Temperature</span>
                    <span>0.7</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-blue-500/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60 font-mono">
                    <span>Top P</span>
                    <span>0.9</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-blue-500/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60 font-mono">
                    <span>Max Tokens</span>
                    <span>4K</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-[40%] h-full bg-blue-500/50" />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-white/5" />

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Safety Settings</label>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/5">
                <span className="text-xs text-white/60">Filter</span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">MED</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Overlay Gradient for "cut-off" effect on the right */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  </div>
);

const ClustersContent = () => (
  <div className="relative h-auto lg:h-[600px] w-full rounded-[24px] bg-[#0A0A0A] border border-white/10 overflow-hidden flex flex-col lg:flex-row">
    {/* Left Side: Content & CTA */}
    <div className="relative z-20 w-full lg:w-2/5 p-6 lg:p-12 flex flex-col justify-center space-y-8 lg:bg-gradient-to-r lg:from-[#0A0A0A] lg:via-[#0A0A0A] lg:to-transparent">
      <h3 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tightest leading-[0.9]">
        Sovereign <br /> <span className="text-white/60">Compute.</span>
      </h3>
      <div className="space-y-6 text-base lg:text-lg text-white/60 font-light leading-relaxed">
        <p>
          Bare-metal performance for your most demanding workloads.
          Orchestrate massive H100 clusters with Slurm or Kubernetes.
        </p>
        <p className="text-sm text-white/50 font-mono uppercase tracking-widest">
          NVSwitch / InfiniBand / Bare Metal
        </p>
      </div>
      <div className="flex gap-4">
        <Link to="/contact?service=clusters">
          <Button className="rounded-full bg-white text-black hover:bg-white/90 px-6 py-4 text-base lg:px-8 lg:py-6 lg:text-lg transition-transform hover:scale-105">
            Provision Cluster
          </Button>
        </Link>
      </div>
    </div>

    {/* Right Side: Technical Dashboard Visual */}
    <div className="hidden lg:block absolute top-0 right-0 w-full lg:w-[65%] h-full pointer-events-none select-none">
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-12 -right-12 md:-right-24 bottom-12 w-full bg-[#0F0F0F] rounded-l-xl rounded-r-none border-l border-t border-b border-white/10 shadow-2xl overflow-hidden flex flex-col"
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
              <span className="text-[10px] font-mono text-white/50 tracking-wider">{metric.label}</span>
              <span className={`text-sm font-mono font-bold ${metric.color}`}>{metric.value}</span>
            </div>
          ))}
        </div>

        {/* Main Visualization: Node Topology Grid */}
        <div className="flex-1 bg-[#0F0F0F] p-8 relative overflow-hidden">
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/50 uppercase tracking-widest">
            HGX H100 Node Topology • NVLink Fabric
          </div>
          
          <div className="h-full flex items-center justify-center">
             <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
               {Array.from({ length: 4 }).map((_, i) => (
                 <motion.div 
                   key={i}
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: i * 0.05 }}
                   className="aspect-square bg-[#1A1A1A] rounded-lg border border-white/5 p-4 flex flex-col justify-between relative group hover:border-white/20 transition-colors"
                 >
                   <div className="flex justify-between items-start">
                     <span className="text-[10px] font-mono text-white/60">GPU-{i}</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-mono text-white/80">68°C</span>
                        <span className="text-xs font-mono text-white/60">99%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/50 w-[99%]" />
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/50 w-[80%]" />
                      </div>
                   </div>

                   {/* NVLink Lines (Decorative) */}
                   <div className="absolute -right-2 top-1/2 w-4 h-[1px] bg-white/5 hidden group-hover:block" />
                   <div className="absolute -bottom-2 left-1/2 h-4 w-[1px] bg-white/5 hidden group-hover:block" />
                 </motion.div>
               ))}
             </div>
          </div>
        </div>

        {/* Bottom Panel: Event Stream */}
        <div className="h-32 border-t border-white/10 bg-[#0A0A0A] p-4 font-mono text-[10px] space-y-1.5 overflow-hidden relative">
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/50 uppercase tracking-wider">Live Log</span>
          </div>
          <div className="opacity-60 space-y-1.5">
             <p>[SLURM] Job #49221 allocated (128x H100) - Training_LLAMA3_405B</p>
             <p>[K8S] Pod 'inference-worker-xyz' scheduled on node-04</p>
             <p>[SYS] NVLink training topology verified. Bandwidth: 900GB/s</p>
             <p className="text-white/60">[WARN] Node-07 temp delta +2°C - adjusting fan curve</p>
             <p>[NET] InfiniBand link active: 400Gbps</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>

      </motion.div>

      {/* Overlay Gradient for "cut-off" effect on the right */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  </div>
);

const TrainingContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
    <div className="space-y-6 lg:space-y-8">
      <h3 className="text-3xl lg:text-5xl font-heading font-bold text-white tracking-tightest">Training</h3>
      <div className="space-y-6 text-base lg:text-lg text-white/60 font-light leading-relaxed max-w-xl">
        <p>
          Securely and cost effectively train your own models from the ground up, 
          leveraging research breakthroughs such as Together Kernel Collection (TKC) 
          for reliable and fast training.
        </p>
      </div>
      <Link to="/contact?service=clusters">
        <Button className="rounded-full bg-white text-black hover:bg-white/90 px-6 py-4 text-base lg:px-8 lg:py-6 lg:text-lg transition-transform hover:scale-105">
          Contact us
        </Button>
      </Link>
    </div>

    <div className="bg-white/[0.02] border border-white/10 rounded-[24px] lg:rounded-[40px] p-6 lg:p-12 relative flex flex-col lg:flex-row">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:block w-32 text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">Customer Software</span>
          </div>
          <div className="flex-1 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03]">
            <span className="font-medium text-white">AI Model</span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:block w-32 text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">User-facing APIs</span>
          </div>
          <div className="flex-1 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03] relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="font-medium text-white">PyTorch</span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:block w-32 text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">Low-level Libraries</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03]">
              <span className="font-medium text-white">NVIDIA</span>
            </div>
            <div className="h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03]">
              <span className="font-medium text-white">cuBLAS / cuDNN</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:block w-32 text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">Hardware</span>
          </div>
          <div className="flex-1 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.03]">
            <span className="font-medium text-white">GPU</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-24 mt-4 lg:mt-0 lg:ml-4 flex flex-row lg:flex-col justify-center">
        <div className="h-16 lg:h-[260px] w-full bg-blue-600 rounded-2xl flex items-center justify-center relative shadow-[0_0_30px_rgba(37,99,235,0.4)]">
          <span className="font-bold text-white text-xl tracking-tighter lg:rotate-[-90deg]">TKC</span>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

export const UseCasesSection = () => {
  const [activeTab, setActiveTab] = useState("inference");

  const renderContent = () => {
    switch (activeTab) {
      case "inference": return <InferenceContent />;
      case "clusters": return <ClustersContent />;
      case "training": return <TrainingContent />;
      default: return null;
    }
  };

  return (
    <section id="use-cases" className="py-12 lg:py-24 bg-black">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Adjusted border radius to 32px (was 48px) */}
        <div className="bg-[#050505] border border-white/[0.03] rounded-[32px] p-6 lg:p-20 overflow-hidden relative">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 lg:mb-24">
            <div className="inline-flex p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 text-xs lg:text-sm font-medium transition-all duration-300 rounded-full ${
                      isActive ? "text-black" : "text-white/60 hover:text-white/60"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeInfrastructureTab"
                        className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? "scale-110" : ""}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {/* Background Gradient Accents */}
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
};