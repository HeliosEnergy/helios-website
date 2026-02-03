import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/alchemy/CursorGlow";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { ArrowRight, Calendar } from "lucide-react";

const EventsPage = () => {
    const { data: eventsData, isLoading } = useSanityQuery<any>('events-page', QUERIES.eventsPage);

    if (isLoading) return <div className="min-h-screen bg-black" />;

    const headline = eventsData?.headline || "Community & Events.";
    const intro = eventsData?.intro || "We’re active in the developer community. Join us at upcoming hackathons, technical conferences, and meetups.";
    const events = eventsData?.events || [];

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
                    <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/40 mb-8 block italic">Events</span>
                    <h1 className="text-7xl sm:text-9xl font-heading font-bold tracking-tightest mb-12 leading-[0.85] uppercase">
                        {headline}
                    </h1>
                    <p className="text-2xl text-white/50 max-w-2xl leading-relaxed font-light">
                        {intro}
                    </p>
                </motion.div>

                {/* Events Timeline */}
                <section className="py-32 border-t border-white/[0.06]">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/4">
                            <h2 className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40">
                                Timeline
                            </h2>
                        </div>
                        <div className="lg:w-3/4 space-y-12">
                            {events.length > 0 ? (
                                events.map((event: any, i: number) => (
                                    <div key={i} className="relative pl-12 border-l border-white/10 py-4 group">
                                        <div className="absolute left-[-5px] top-6 w-2 h-2 rounded-full bg-white/20 group-hover:bg-white transition-all duration-500 group-hover:scale-150" />
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="space-y-4">
                                                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#FF6B35]">
                                                    {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Upcoming"}
                                                </span>
                                                <h3 className="text-4xl font-heading font-bold tracking-tight">{event.name}</h3>
                                                <p className="text-white/40 font-light">{event.location}</p>
                                            </div>
                                            <a href={event.link || "#"} className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors group/link">
                                                Details <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-12">
                                    <div className="relative pl-12 border-l border-white/10 py-4 group opacity-50">
                                        <div className="absolute left-[-5px] top-6 w-2 h-2 rounded-full bg-white/20" />
                                        <div className="space-y-4">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/20">Planning</span>
                                            <h3 className="text-4xl font-heading font-bold tracking-tight">Helios Summit 2026</h3>
                                            <p className="text-white/20 font-light italic">Manifesting soon.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default EventsPage;
