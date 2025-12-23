import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModelCard } from "@/components/ModelCard";
import { ModelFilters } from "@/components/ModelFilters";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSanityQuery } from "@/hooks/useSanityData";
import { useLocation, useNavigate } from "react-router-dom";

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
        <div className="min-h-screen bg-background">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="pt-24 pb-12 bg-surface border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6">
                            Model Library
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                            Search our library of open source models and deploy in seconds.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search model library"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                            />
                        </div>
                    </div>
                </section>

                 {/* Filters */}
                 <ModelFilters
                     activeFilter={activeFilter}
                     onFilterChange={handleFilterChange}
                 />

                {/* Models Grid */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {isLoading ? (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">Loading models...</p>
                            </div>
                        ) : filteredModels.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">No models found matching your criteria.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-heading font-bold text-foreground">
                                        Models
                                    </h2>
                                    <p className="text-muted-foreground mt-2">
                                        {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredModels.map((model) => (
                                        <ModelCard key={model._id} model={model} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ModelLibraryPage;
