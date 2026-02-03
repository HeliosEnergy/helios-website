import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
    Network,
    Cpu,
    Search,
    ArrowRight,
    Database,
    ShieldCheck,
    Zap,
    CheckCircle2
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const models = [
    { name: "Llama-3-70b-Instruct", provider: "Meta", context: "8k", priceOnInput: "$0.90", priceOnOutput: "$0.90", latency: "24 ms/tok" },
    { name: "Mixtral-8x22b", provider: "Mistral AI", context: "64k", priceOnInput: "$1.20", priceOnOutput: "$1.20", latency: "31 ms/tok" },
    { name: "Qwen-1.5-72b", provider: "Alibaba", context: "32k", priceOnInput: "$0.90", priceOnOutput: "$0.90", latency: "28 ms/tok" },
    { name: "Gemma-7b-It", provider: "Google", context: "8k", priceOnInput: "$0.20", priceOnOutput: "$0.20", latency: "12 ms/tok" },
    { name: "DeepSeek-V2", provider: "DeepSeek", context: "32k", priceOnInput: "$0.50", priceOnOutput: "$0.50", latency: "18 ms/tok" },
];

const ModelApisPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#FF6B35] selection:text-white">
            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

                <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest font-mono text-white/70">Unified API Endpoint</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tightest mb-6">
                            One API. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                                Every Model.
                            </span>
                        </h1>

                        <p className="text-xl text-white/60 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                            Access the world's best open-source models through a single, OpenAI-compatible endpoint. Route dynamically based on price, speed, or availability.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-bold">
                                Get API Key
                            </Button>
                            <Button variant="ghost" className="rounded-full text-white hover:bg-white/10 px-8 py-6 text-lg">
                                View Documentation
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Model Table Section */}
            <section className="py-20 relative border-t border-white/5 bg-[#050505]">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Live Model Status</h2>
                            <p className="text-white/40 text-sm">Real-time pricing and latency metrics.</p>
                        </div>

                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search models..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-[300px] bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-6 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-white/40 font-normal">Model Name</th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-white/40 font-normal hidden md:table-cell">Provider</th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-white/40 font-normal hidden md:table-cell">Context</th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-white/40 font-normal text-right">Input Price <span className="text-[9px] lowercase opacity-50">/1M</span></th>
                                    <th className="p-6 text-xs font-mono uppercase tracking-wider text-white/40 font-normal text-right hidden sm:table-cell">Output Price <span className="text-[9px] lowercase opacity-50">/1M</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredModels.map((model, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                                    {model.provider[0]}
                                                </div>
                                                <span className="text-white group-hover:text-[#FF6B35] transition-colors">{model.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-white/60 text-sm hidden md:table-cell">{model.provider}</td>
                                        <td className="p-6 text-white/60 text-sm font-mono hidden md:table-cell">{model.context}</td>
                                        <td className="p-6 text-white text-sm font-mono text-right">{model.priceOnInput}</td>
                                        <td className="p-6 text-white text-sm font-mono text-right hidden sm:table-cell">{model.priceOnOutput}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredModels.length === 0 && (
                            <div className="p-12 text-center text-white/40">
                                No models found matching "{searchTerm}"
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <Button variant="link" className="text-white/40 hover:text-white transition-colors">
                            View all 100+ supported models <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Integration Code Block Section */}
            <section className="py-24 bg-black">
                <div className="max-w-[1000px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-heading font-bold mb-6">Drop-in OpenAI Compatibility</h2>
                        <p className="text-white/60 leading-relaxed mb-8">
                            Switching is as easy as changing your base URL. No SDK migration required. We implement the full Chat Completions API spec.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Streaming Support",
                                "Function Calling",
                                "JSON Mode",
                                "Logprobs"
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                                    <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4 opacity-30">
                            <div className="w-3 h-3 rounded-full bg-white" />
                            <div className="w-3 h-3 rounded-full bg-white" />
                            <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        <pre className="font-mono text-xs md:text-sm text-white/80 overflow-x-auto whitespace-pre-wrap">
                            <span className="text-[#FF6B35]">import</span> openai{"\n\n"}
                            client = openai.OpenAI({" \n"}
                            {"  "}base_url=<span className="text-green-400">"https://api.heliosenergy.io/v1"</span>,{"\n"}
                            {"  "}api_key=<span className="text-green-400">"helios_..."</span>{"\n"}
                            ){"\n\n"}
                            response = client.chat.completions.create({" \n"}
                            {"  "}model=<span className="text-green-400">"meta-llama/Llama-3-70b-Instruct"</span>,{"\n"}
                            {"  "}messages=[...]{"\n"}
                            )
                        </pre>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ModelApisPage;
