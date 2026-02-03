import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/alchemy/CursorGlow";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { ArrowRight, FileText } from "lucide-react";

const PressPage = () => {
    const { data: press, isLoading } = useSanityQuery<any>('press-page', QUERIES.pressPage);

    if (isLoading) return <div className="min-h-screen bg-black" />;

    const headline = press?.headline || "News & Updates.";
    const intro = press?.intro || "The latest stories, product launches, and milestones from the Helios team.";
    const releases = press?.releases || [];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-hidden">
            <CursorGlow />
            <Navigation />

            <main className="relative z-10 pt-48 pb-64 px-6 lg:px-12 max-w-7xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-32"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/40 mb-8 block italic">Press</span>
                    <h1 className="text-7xl sm:text-9xl font-heading font-bold tracking-tightest mb-12 leading-[0.85] uppercase">
                        {headline}
                    </h1>
                    <p className="text-2xl text-white/50 max-w-2xl leading-relaxed font-light">
                        {intro}
                    </p>
                </motion.div>

                {/* Releases Grid */}
                <section className="py-32 border-t border-white/[0.06]">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/4">
                            <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40">
                                Releases
                            </h2>
                        </div>
                        <div className="lg:w-3/4">
                            <div className="grid gap-1">
                                {releases.length > 0 ? (
                                    releases.map((release: any, i: number) => (
                                        <a
                                            key={i}
                                            href={release.link || "#"}
                                            className="group flex items-center justify-between p-12 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all duration-500"
                                        >
                                            <div className="space-y-4">
                                                <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6B35]">
                                                    {release.date ? new Date(release.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                                                </span>
                                                <h3 className="text-3xl font-heading font-medium tracking-tight group-hover:text-white transition-colors">
                                                    {release.title}
                                                </h3>
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all duration-500" />
                                        </a>
                                    ))
                                ) : (
                                    <div className="p-24 text-center border border-dashed border-white/10 rounded-[40px]">
                                        <p className="text-white/20 font-light italic">The chronicle continues. Stay tuned for future announcements.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Assets Section */}
                <section className="py-32 border-t border-white/[0.06]">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/4">
                            <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40">
                                Media Kit
                            </h2>
                        </div>
                        <div className="lg:w-3/4">
                            <div className="p-12 rounded-[40px] bg-[#111111] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-white/20" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold">Brand Identity Bundle</h4>
                                        <p className="text-sm text-white/40">Logos, typography, and visual guidelines.</p>
                                    </div>
                                </div>
                                <button className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white hover:text-[#FF6B35] transition-colors">
                                    Download .ZIP
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PressPage;
