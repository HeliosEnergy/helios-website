import { urlFor } from "@/lib/sanity";
import { Link } from "react-router-dom";

interface ModelCardProps {
    model: {
        _id: string;
        name: string;
        slug: { current: string };
        provider: string;
        pricingDisplay?: string;
        inputPrice?: number;
        outputPrice?: number;
        imagePrice?: number;
        contextWindow?: string;
        modelType: string;
        icon?: unknown;
        iconFilename?: string;
        color?: string;
        initial?: string;
    };
}

export const ModelCard = ({ model }: ModelCardProps) => {
    // Format pricing display
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

    // Get icon URL
    const getIconUrl = () => {
        if (model.icon) {
            return urlFor(model.icon).width(80).height(80).url();
        }
        if (model.iconFilename) {
            return `/model-lib/${model.iconFilename}`;
        }
        return null;
    };

    const iconUrl = getIconUrl();

    return (
        <Link 
            to={`/model-library/${model.slug.current}`} 
            className="group relative block bg-card border border-border/40 p-10 transition-all duration-500 hover:bg-card/80 overflow-hidden"
        >
            {/* Active Aura Background */}
            <div className="absolute inset-0 bg-primary/[0.02] group-hover:bg-primary/[0.04] transition-colors duration-500" />
            
            {/* The Showcase Plinth */}
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-8 p-4 bg-background shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] border border-border/40 flex items-center justify-center relative group-hover:border-primary/40 transition-all duration-500">
                    {iconUrl ? (
                        <img
                            src={iconUrl}
                            alt={`${model.provider} logo`}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-xl font-heading font-bold text-foreground/80`}>
                            {model.initial || model.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="space-y-3 mb-12">
                    <h3 className="font-heading font-bold text-foreground text-2xl tracking-tight leading-none">
                        {model.name}
                    </h3>
                    <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-primary/80">
                        {model.provider}
                    </p>
                </div>

                {/* Integral Specifications - The Technical Bold */}
                <div className="w-full pt-8 border-t border-border/60 flex flex-col gap-5">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-[0.1em]">
                        <span className="text-white/80">Type</span>
                        <span className="text-foreground border-b border-foreground/10 pb-0.5">{model.modelType}</span>
                    </div>
                    {model.contextWindow && (
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-[0.1em]">
                            <span className="text-white/80">Context</span>
                            <span className="text-foreground border-b border-foreground/10 pb-0.5">{parseInt(model.contextWindow).toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-[0.1em]">
                        <span className="text-white/80">Pricing</span>
                        <span className="text-primary bg-primary/5 px-2 py-0.5">{getPricingText()}</span>
                    </div>
                </div>
            </div>

            {/* Precision Indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-primary/20 group-hover:w-full group-hover:bg-primary transition-all duration-700" />
        </Link>
    );
};
