import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ModelCard } from "@/components/ModelCard";
import { ModelFilters } from "@/components/ModelFilters";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSanityQuery } from "@/hooks/useSanityData";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ColorPanels } from '@paper-design/shaders-react';

interface Model {
    _id: string;
    name: string;
    slug: { current: string };
    provider: string;
    description?: string;
    icon?: unknown;
    iconFilename?: string;
    modelType: string;
    categories?: string[];
    inputPrice?: number;
    outputPrice?: number;
    imagePrice?: number;
    pricingDisplay?: string;
    contextWindow?: string;
    color?: string;
    initial?: string;
}

const ModelLibraryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const filterFromUrl = searchParams.get('filter');

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState(filterFromUrl || "featured");

    useEffect(() => {
        if (filterFromUrl) {
            setActiveFilter(filterFromUrl);
        }
    }, [filterFromUrl]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        const newSearchParams = new URLSearchParams(searchParams);
        if (filter === "featured") {
            newSearchParams.delete('filter');
        } else {
            newSearchParams.set('filter', filter);
        }
        navigate(`/model-library?${newSearchParams.toString()}`, { replace: true });
    };

    // Fetch all models from Sanity
    const { data: models, isLoading } = useSanityQuery<Model[]>(
        'model-library',
        `*[_type == "modelLibrary"] | order(name asc) {
      _id,
      name,
      slug,
      provider,
      description,
      icon,
      iconFilename,
      modelType,
      categories,
      inputPrice,
      outputPrice,
      imagePrice,
      pricingDisplay,
      contextWindow,
      color,
      initial
    }`
    );

    // Filter models based on search and active filter
    const filteredModels = useMemo(() => {
        if (!models) return [];

        let filtered = models;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (model) =>
                    model.name.toLowerCase().includes(query) ||
                    model.provider.toLowerCase().includes(query)
            );
        }

        // Apply category/type filter
        if (activeFilter.startsWith("provider:")) {
            const provider = activeFilter.replace("provider:", "");
            filtered = filtered.filter((model) => model.provider === provider);
        } else if (["LLM", "Image", "Audio", "Vision"].includes(activeFilter)) {
            filtered = filtered.filter((model) => model.modelType === activeFilter);
        } else if (["featured", "serverless", "embedding", "reranker"].includes(activeFilter)) {
            filtered = filtered.filter((model) =>
                model.categories?.includes(activeFilter)
            );
        }

        return filtered;
    }, [models, searchQuery, activeFilter]);

    return (
        <div className="min-h-screen bg-background solar-grain">
            <Navigation />

            <main>
                {/* Hero Section - The Solar Entrance */}
                <section className="relative pt-40 pb-20 border-b border-border/30 overflow-hidden">
                    {/* Shader Background - Subtle Solar Wash */}
                    <div className="absolute inset-0 z-0 opacity-[0.15]">
                        <ColorPanels
                            width="100%"
                            height="100%"
                            colors={["#ff9d00", "#fd4f30"]}
                            colorBack="#fdfbf7"
                            density={2}
                            angle1={-0.64}
                            angle2={-0.52}
                            length={1.5}
                            edges={false}
                            blur={0.5}
                            fadeIn={0.5}
                            fadeOut={0.5}
                            gradient={1}
                            speed={0.4}
                            scale={1.2}
                            offsetX={-0.6}
                            fit="cover"
                        />
                    </div>

                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                            <div className="max-w-3xl">
                                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold text-foreground tracking-[-0.04em] leading-[0.85]">
                                    Model <br />Library
                                </h1>
                            </div>
                            <div className="lg:w-1/3">
                                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
                                    A curated repository of state-of-the-art weights. 
                                    Optimized for Helios infrastructure.
                                </p>
                                {/* Search Bar - Architectural Integration */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Filter by name or provider..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="relative z-10 w-full pl-8 pr-4 py-4 bg-transparent border-b border-border/40 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all text-sm font-mono uppercase tracking-widest"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                 {/* Filters - The Precision Rail */}
                 <ModelFilters
                     activeFilter={activeFilter}
                     onFilterChange={handleFilterChange}
                 />

                {/* Models Grid - The Gallery Floor */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                        {isLoading ? (
                            <div className="text-center py-40">
                                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Synchronizing Archive...</p>
                            </div>
                        ) : filteredModels.length === 0 ? (
                            <div className="text-center py-40">
                                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">No specimens found in this sector.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border/30">
                                {filteredModels.map((model) => (
                                    <ModelCard key={model._id} model={model} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ModelLibraryPage;
