import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
    Zap,
    Terminal,
    Clock,
    ArrowRight,
    Code2,
    Cpu,
    Globe,
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

const codeSnippet = `import helios
from helios import Function, Image

# Define your container environment
image = Image.debian_slim().pip_install("torch", "transformers")

@helios.function(
    gpu="A100", 
    timeout=600,
    image=image
)
def generate_text(prompt: str):
    import torch
    from transformers import pipeline
    
    pipe = pipeline("text-generation", model="meta-llama/Llama-3-8b")
    return pipe(prompt, max_length=100)

# Deploy with one command
# $ helios deploy main.py`;

const ServerlessPage = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B35]/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                        >
                            <motion.span
                                variants={fadeInUp}
                                className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-6"
                            >
                                Serverless GPU
                            </motion.span>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-5xl md:text-7xl font-heading font-bold tracking-tightest leading-[0.9] mb-8"
                            >
                                Deploy in Seconds.<br />
                                <span className="text-[#FF6B35]">Scale to Zero.</span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-xl text-white/60 font-light leading-relaxed mb-8 max-w-lg"
                            >
                                Run inference code without managing infrastructure. Pay only for the milliseconds your code runs. No idle costs.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-12">
                                <Link to="/contact">
                                    <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-lg transition-transform hover:scale-105">
                                        Start Building
                                    </Button>
                                </Link>
                                <Link to="/docs">
                                    <Button
                                        variant="outline"
                                        className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                                    >
                                        Read Docs
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="flex items-center gap-8 text-sm"
                            >
                                <div>
                                    <p className="text-2xl font-bold text-white mb-1">&lt; 200ms</p>
                                    <p className="text-white/40 font-mono uppercase text-[10px] tracking-wider">Cold Start</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div>
                                    <p className="text-2xl font-bold text-white mb-1">0.1s</p>
                                    <p className="text-white/40 font-mono uppercase text-[10px] tracking-wider">Billing Increment</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Code Block Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    </div>
                                    <span className="text-xs font-mono text-white/30">main.py</span>
                                </div>
                                <div className="p-6 overflow-x-auto relative group">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleCopy}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white text-xs"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : "Copy"}
                                    </Button>
                                    <pre className="text-sm font-mono leading-relaxed text-blue-100/80">
                                        <code dangerouslySetInnerHTML={{
                                            __html: codeSnippet.replace(/import|from|def|return|class/g, '<span class="text-[#FF6B35]">$&</span>')
                                                .replace(/@helios.function/g, '<span class="text-emerald-400">$&</span>')
                                                .replace(/"[^"]*"/g, '<span class="text-amber-200">$&</span>')
                                                .replace(/#.*/g, '<span class="text-white/30">$&</span>')
                                        }} />
                                    </pre>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 bg-[#1A1A1A] border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <div>
                                    <p className="text-xs font-bold text-white">System Ready</p>
                                    <p className="text-[10px] text-white/40">Waiting for requests...</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-[#050505]">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Instant Cold Starts",
                                description: "Our FlashBoot technology restores snapshot states in under 200ms. No more warming up endpoints."
                            },
                            {
                                icon: Terminal,
                                title: "Infrastructure as Code",
                                description: "Define your GPU requirements, memory, and container image directly in Python. Version control your infra."
                            },
                            {
                                icon: Clock,
                                title: "Millisecond Billing",
                                description: "Stop paying for idle GPUs. We bill strictly for execution time, down to the millisecond."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:border-[#FF6B35]/30 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#FF6B35]/10 transition-colors">
                                    <feature.icon className="w-6 h-6 text-[#FF6B35]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-white/50 leading-relaxed text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ServerlessPage;
