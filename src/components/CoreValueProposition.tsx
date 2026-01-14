import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

const defaultCards = [
    {
        title: "Predictable costs",
        description: "No surprise charges or hidden complexity. Designed for teams that are budget-conscious and serious about scale.",
    },
    {
        title: "Inference-first by design",
        description: "Optimized for production inference workloads today, with a clear path to training as your needs grow.",
    },
    {
        title: "Simple by default",
        description: "Deploy and manage GPUs through a clean, intuitive interface built for engineers who want to move fast.",
    },
];

export const CoreValueProposition = () => {
    const { data: sectionData } = useSanityQuery<any>('core-value-proposition', QUERIES.coreValueProposition);

    const heading = sectionData?.heading || "Why teams choose Helios";
    const description = sectionData?.description;
    const cards = sectionData?.cards || defaultCards;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <span className="text-sm font-mono uppercase tracking-[0.2em] text-primary mb-4 block">
                        Core Value Proposition
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">
                        {heading}
                    </h2>
                    {description && (
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-surface border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                        >
                            <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
