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
        icon?: any;
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
        <Link to={`/model-library/${model.slug.current}`} className="block group bg-card border border-border p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
            {/* Icon/Logo */}
            <div className="flex items-start gap-4 mb-4">
                {iconUrl ? (
                    <img
                        src={iconUrl}
                        alt={`${model.provider} logo`}
                        className="w-12 h-12 object-contain shrink-0"
                    />
                ) : (
                    <div className={`w-12 h-12 flex items-center justify-center text-lg font-bold ${model.color || 'bg-primary/10 text-primary'}`}>
                        {model.initial || model.name.charAt(0)}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-lg mb-1 truncate">
                        {model.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {model.provider}
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    {getPricingText()}
                </p>

                {model.contextWindow && (
                    <p className="text-sm text-muted-foreground">
                        {parseInt(model.contextWindow).toLocaleString()} Context
                    </p>
                )}

                <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider bg-secondary text-foreground">
                    {model.modelType}
                </span>
            </div>
        </Link>
    );
};
