import { useParams } from "react-router-dom";
import { useSanityQuery } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Play, Download, ExternalLink, Zap, Cpu, Database, Cloud } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url";

interface ModelDetails {
    _id: string;
    name: string;
    slug: { current: string };
    provider: string;
    description?: string;
    icon?: SanityImageSource;
    iconFilename?: string;
    providerLogo?: SanityImageSource;
    modelType: string;
    categories?: string[];
    inputPrice?: number;
    outputPrice?: number;
    imagePrice?: number;
    pricingDisplay?: string;
    contextWindow?: string;
    contextLength?: number;
    capabilities?: string[];
    useCases?: string[];
    color?: string;
    initial?: string;
    fullId?: string;
    createdDate?: string;
    parameters?: number;
    isMoe?: boolean;
    recommendedGpu?: string;
    fineTuningSupported?: boolean;
    functionCalling?: boolean;
    imageInput?: boolean;
    embeddings?: boolean;
    shortDescription?: string;
    huggingFaceUrl?: string;
}

const ModelDetailsPage = () => {
    const { slug } = useParams();
    const { data: model, isLoading } = useSanityQuery<ModelDetails>(
        'model-details',
        `*[_type == "modelLibrary" && slug.current == $slug][0] {
            _id,
            name,
            slug,
            provider,
            description,
            icon,
            iconFilename,
            providerLogo,
            modelType,
            categories,
            inputPrice,
            outputPrice,
            imagePrice,
            pricingDisplay,
            contextWindow,
            contextLength,
            capabilities,
            useCases,
            color,
            initial,
            fullId,
            createdDate,
            parameters,
            isMoe,
            recommendedGpu,
            fineTuningSupported,
            functionCalling,
            imageInput,
            embeddings,
            shortDescription,
            huggingFaceUrl
        }`,
        { slug }
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading model details...</p>
                </div>
            </div>
        );
    }

    if (!model) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Model Not Found</h1>
                        <p className="text-muted-foreground mb-8">The requested model could not be found.</p>
                        <Button asChild>
                            <a href="/model-library">Back to Model Library</a>
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const getIconUrl = () => {
        if (model.icon) {
            return urlFor(model.icon).width(80).height(80).url();
        }
        if (model.iconFilename) {
            return `/model-lib/${model.iconFilename}`;
        }
        return null;
    };

    const getPricingText = () => {
        if (model.pricingDisplay) return model.pricingDisplay;

        if (model.imagePrice) {
            return `$${model.imagePrice}/Image`;
        }

        if (model.inputPrice && model.outputPrice) {
            return `$${model.inputPrice}/M Input • $${model.outputPrice}/M Output`;
        }

        if (model.inputPrice) {
            return `$${model.inputPrice}/M Tokens`;
        }

        return 'Contact for pricing';
    };

    const iconUrl = getIconUrl();

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <Breadcrumb
                            items={[
                                { label: 'Model Library', href: '/model-library' },
                                { label: model.name }
                            ]}
                        />

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground">
                                    {model.name}
                                </h1>
                                <Badge className="bg-yellow-dark text-yellow-dark-foreground border-yellow-dark">
                                    Available
                                </Badge>
                            </div>
                            <div className="flex gap-4">
                                <Button className="bg-primary hover:bg-primary/90">
                                    <Play className="w-4 h-4 mr-2" />
                                    Try Model
                                </Button>
                                {model.huggingFaceUrl && (
                                    <Button variant="outline" asChild>
                                        <a href={model.huggingFaceUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Hugging Face
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Docs
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        {(model.shortDescription || model.description) && (
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-4xl">
                                {model.shortDescription || model.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Feature Rows */}
                            <div>
                                <div className="flex items-center justify-between py-6 border-b border-border">
                                    <div className="flex items-center gap-4">
                                        <Zap className="w-6 h-6 text-primary" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Fine-tuning</h3>
                                            <p className="text-sm text-muted-foreground">Customize the model for your specific use case</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Docs
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between py-6 border-b border-border">
                                    <div className="flex items-center gap-4">
                                        <Cloud className="w-6 h-6 text-primary" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Serverless</h3>
                                            <p className="text-sm text-muted-foreground">Run inference without managing infrastructure</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Docs
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between py-6">
                                    <div className="flex items-center gap-4">
                                        <Cpu className="w-6 h-6 text-primary" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">On-demand</h3>
                                            <p className="text-sm text-muted-foreground">Scale up compute resources as needed</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Docs
                                    </Button>
                                </div>
                            </div>

                            {/* Pricing Bar */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-surface hover:bg-surface-elevated/50 transition-colors rounded-2xl border border-white/5 group">
                                <div className="mb-4 sm:mb-0">
                                    <p className="font-semibold text-foreground text-lg">Available Serverless</p>
                                    <p className="text-sm text-muted-foreground">Pay only for what you use</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <span className="text-3xl font-bold text-foreground tracking-tight">{getPricingText()}</span>
                                    <p className="text-sm text-muted-foreground mt-1">Per 1M Tokens</p>
                                </div>
                            </div>



                            {/* Use Cases */}
                            {model.useCases && model.useCases.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Use Cases</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {model.useCases.map((useCase, index) => (
                                            <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg">
                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                <span className="text-foreground">{useCase}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div>
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Model Information</h3>
                                <div className="space-y-2">
                                    {model.fullId && (
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-2">
                                                <Database className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">Full ID</span>
                                            </div>
                                            <span className="font-bold text-foreground text-sm">{model.fullId}</span>
                                        </div>
                                    )}
                                    {model.createdDate && (
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-2">
                                                <Cpu className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">Created</span>
                                            </div>
                                            <span className="font-bold text-foreground text-sm">{new Date(model.createdDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {model.parameters && (
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">Parameters</span>
                                            </div>
                                            <span className="font-bold text-foreground text-sm">{model.parameters}</span>
                                        </div>
                                    )}
                                    {model.isMoe !== undefined && (
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-2">
                                                <Database className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">Architecture</span>
                                            </div>
                                            <span className="font-bold text-foreground text-sm">{model.isMoe ? 'Mixture of Experts' : 'Standard'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Specifications</h3>
                                <div className="space-y-2">
                                    {model.recommendedGpu && (
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-2">
                                                <Cpu className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">Recommended GPU</span>
                                            </div>
                                            <span className="font-bold text-foreground text-sm">{model.recommendedGpu}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-muted-foreground">Context Length</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm">{model.contextLength?.toLocaleString() || model.contextWindow} tokens</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Functionality</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-muted-foreground">Fine-tuning</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm">{model.fineTuningSupported ? "Supported" : "Not Supported"}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <Play className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-muted-foreground">Function Calling</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm">{model.functionCalling ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <Download className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-muted-foreground">Image Input</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm">{model.imageInput ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-muted-foreground">Embeddings</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm">{model.embeddings ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ModelDetailsPage;