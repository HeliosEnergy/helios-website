import { motion } from "framer-motion";

interface ModelFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const filterCategories = [
    { label: "Featured", value: "featured" },
    { label: "LLM", value: "LLM" },
    { label: "Vision", value: "Vision" },
    { label: "Image", value: "Image" },
    { label: "Audio", value: "Audio" },
    { label: "Embedding", value: "embedding" },
    { label: "Reranker", value: "reranker" },
    { label: "Serverless", value: "serverless" },
];

export const ModelFilters = ({ activeFilter, onFilterChange }: ModelFiltersProps) => {
    return (
        <div className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-20 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide py-0 h-14">
                    {filterCategories.map((filter) => {
                        const isActive = activeFilter === filter.value;
                        return (
                            <button
                                key={filter.value}
                                onClick={() => onFilterChange(filter.value)}
                                className={`h-full flex items-center text-[10px] font-mono uppercase tracking-[0.25em] whitespace-nowrap transition-colors relative group ${
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {filter.label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeFilter"
                                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
