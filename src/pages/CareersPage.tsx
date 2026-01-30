import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/alchemy/CursorGlow";
import { BreathingVoid } from "@/components/alchemy/BreathingVoid";
import { Button } from "@/components/ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { ArrowRight } from "lucide-react";

const CareersPage = () => {
    const { data: careers, isLoading } = useSanityQuery<any>('careers-page', QUERIES.careersPage);

    if (isLoading) return <div className="min-h-screen bg-black" />;

    const headline = careers?.headline || "Build Helios with us.";
    const intro = careers?.intro || "We’re a team of builders, designers, and systems thinkers. At Helios, we’re focused on one thing: making high-performance compute accessible and simple. If you care about craft and performance, we'd love to meet you.";
    const positions = careers?.openPositions || [];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-hidden">
            <CursorGlow />
            <Navbar />

            <main className="relative z-10 pt-48 pb-32 px-6 lg:px-12 max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-32"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/40 mb-8 block italic">Careers</span>
                    <h1 className="text-7xl sm:text-9xl font-heading font-bold tracking-tightest mb-12 leading-[0.85] uppercase">
                        {headline.split('.').map((part, i) => (
                            <span key={i} className="block">{part}{i === 0 && headline.includes('.') ? '.' : ''}</span>
                        ))}
                    </h1>
                    <p className="text-2xl text-white/50 max-w-2xl leading-relaxed font-light">
                        {intro}
                    </p>
                </motion.div>

                {/* Ambient Void Section */}
                <section className="py-32 border-t border-white/[0.06]">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/4">
                            <div className="sticky top-32 space-y-4">
                                <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40">
                                    Ethos
                                </h2>
                                <p className="text-sm text-white/30 leading-relaxed pr-8">
                                    We believe that raw power, when handled with grace, becomes a gift.
                                </p>
                            </div>
                        </div>
                        <div className="lg:w-3/4">
                            <div className="h-[400px] rounded-[40px] border border-white/5 overflow-hidden flex items-center justify-center relative bg-white/[0.02]">
                                <BreathingVoid />
                                <div className="relative z-10 text-center">
                                    <h3 className="text-4xl font-heading font-bold tracking-tightest">Design is discipline.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Positions Section */}
                <section className="py-32 border-t border-white/[0.06]">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/4">
                            <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40">
                                Opportunities
                            </h2>
                        </div>
                        <div className="lg:w-3/4 space-y-8">
                            {positions.length > 0 ? (
                                positions.map((job: any, i: number) => (
                                    <div key={i} className="p-10 rounded-[32px] bg-[#0A0A0A] border border-white/[0.06] hover:border-white/20 transition-all duration-500 group flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-heading font-bold tracking-tight">{job.role}</h3>
                                            <div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest text-white/20">
                                                <span>{job.department}</span>
                                                <span className="opacity-30">/</span>
                                                <span>{job.location}</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 px-8 h-12 text-xs font-bold transition-transform hover:scale-105 duration-300">
                                            View Role
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 rounded-[40px] border border-dashed border-white/10 text-center">
                                    <p className="text-white/30 font-light italic">Currently searching for the next pioneers. Check back soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-64 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-heading font-bold tracking-tightest mb-12 uppercase">{careers?.ctaText || "Join the team."}</h2>
                        <Button className="rounded-full bg-white text-black hover:bg-white/90 px-12 h-16 text-sm font-bold transition-transform hover:scale-105 duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                            Join the team.
                        </Button>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CareersPage;
