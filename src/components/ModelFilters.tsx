import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ModelFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

const filterCategories = [
    { label: "Featured", value: "featured" },
    { label: "Serverless", value: "serverless" },
    { label: "Embedding", value: "embedding" },
    { label: "LLM", value: "LLM" },
    { label: "Image", value: "Image" },
    { label: "Audio", value: "Audio" },
    { label: "Vision", value: "Vision" },
    { label: "Reranker", value: "reranker" },
];

const providers = [
    "Qwen",
    "OpenAI",
    "Moonshot AI",
    "Meta",
    "DeepSeek",
    "Google",
    "Flux",
    "Anthropic",
    "Z.ai",
];

export const ModelFilters = ({ activeFilter, onFilterChange }: ModelFiltersProps) => {
    const [showProviders, setShowProviders] = useState(false);

    return (
        <div className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {filterCategories.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => onFilterChange(filter.value)}
                            className={`px-4 py-4 text-sm font-mono uppercase tracking-wider whitespace-nowrap transition-colors relative ${activeFilter === filter.value
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {filter.label}
                            {activeFilter === filter.value && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}

                    {/* Providers Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProviders(!showProviders)}
                            className={`px-4 py-4 text-sm font-mono uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1 ${activeFilter.startsWith("provider:")
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Providers
                            <ChevronDown className={`w-4 h-4 transition-transform ${showProviders ? 'rotate-180' : ''}`} />
                            {activeFilter.startsWith("provider:") && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>

                        {showProviders && (
                            <div className="absolute top-full left-0 mt-2 bg-background border border-border shadow-xl z-50 min-w-[200px]">
                                {providers.map((provider) => (
                                    <button
                                        key={provider}
                                        onClick={() => {
                                            onFilterChange(`provider:${provider}`);
                                            setShowProviders(false);
                                        }}
                                        className={`block w-full text-left px-4 py-3 text-sm transition-colors ${activeFilter === `provider:${provider}`
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground hover:bg-secondary"
                                            }`}
                                    >
                                        {provider}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
