import React, { useState, useMemo } from 'react';
import { usePricingData, PricingTier, GPUModel, InferenceModel } from '@/hooks/usePricingData';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { parseProviderPrice } from '@/lib/pricingCalculations';
import {
    Server,
    Cpu,
    Zap,
    ChevronDown,
    Lock,
    Mic,
    Image,
    Video,
    Volume2,
    ArrowUpDown,
    Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

type PricingSection = 'clusters' | 'inference' | 'gpus';
type RateMode = 'hourly' | 'monthly';

const SIDEBAR_ITEMS: { id: PricingSection; label: string; icon: React.ElementType; disabled?: boolean }[] = [
    { id: 'clusters', label: 'Clusters', icon: Server, disabled: true },
    { id: 'inference', label: 'Inference', icon: Zap },
    { id: 'gpus', label: 'GPUs', icon: Cpu },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'audio-input': Mic,
    'audio-output': Volume2,
    'image': Image,
    'vision': Video,
};

const CATEGORY_LABELS: Record<string, string> = {
    'audio-input': 'Speech-to-Text',
    'audio-output': 'Text-to-Speech',
    'image': 'Image Generation',
    'vision': 'Vision/Video',
};

const UNIT_LABELS: Record<string, string> = {
    'voice-mins': 'per minute',
    'images': 'per image',
    'video-mins': 'per minute',
    'tokens': 'per 1M tokens',
};

const formatPrice = (price: number): string => {
    if (price >= 1000) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    if (price < 0.001) {
        return price.toFixed(5);
    }
    if (price < 0.01) {
        return price.toFixed(4);
    }
    return price.toFixed(2);
};

// Calculate price based on estimation unit
const calculateInferencePrice = (model: InferenceModel, quantity: number): number => {
    switch (model.estimationUnit) {
        case 'voice-mins':
            // pricePerSecond * 60 seconds * quantity minutes
            return model.pricePerSecond * 60 * quantity;
        case 'images':
            // pricePerSecond is actually price per image (5 seconds GPU time baked in)
            return model.pricePerSecond * quantity;
        case 'video-mins':
            // pricePerSecond * 60 seconds * quantity minutes
            return model.pricePerSecond * 60 * quantity;
        case 'tokens':
            // pricePerSecond is per token, multiply by 1M for quantity in millions
            return model.pricePerSecond * 1000000 * quantity;
        default:
            return model.pricePerSecond * quantity;
    }
};

// GPU Calculator Component
const GPUCalculator: React.FC<{
    gpuModels: GPUModel[];
    selectedTier: PricingTier;
    rateMode: RateMode;
}> = ({ gpuModels, selectedTier, rateMode }) => {
    const [selectedGPU, setSelectedGPU] = useState(gpuModels[0] || null);
    const [gpuCount, setGpuCount] = useState(1);

    if (!selectedGPU) return null;

    const basePrice = selectedGPU.heliosPrice * (1 - selectedTier.discount / 100);
    const hourlyPrice = basePrice * gpuCount;
    const monthlyPrice = hourlyPrice * 730;
    const displayPrice = rateMode === 'hourly' ? hourlyPrice : monthlyPrice;

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
                    Select GPU
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {gpuModels.map((gpu) => (
                        <button
                            key={gpu.id}
                            onClick={() => setSelectedGPU(gpu)}
                            className={`p-3 rounded-lg text-left transition-all border ${
                                selectedGPU.id === gpu.id
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-black/70 border-black/10 hover:border-black/30'
                            }`}
                        >
                            <p className="font-semibold text-sm">{gpu.name}</p>
                            <p className={`text-[11px] ${selectedGPU.id === gpu.id ? 'text-white/60' : 'text-black/40'}`}>
                                {gpu.vram}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
                        Quantity
                    </label>
                    <span className="text-lg font-bold tabular-nums">{gpuCount} GPU{gpuCount > 1 ? 's' : ''}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="8"
                    value={gpuCount}
                    onChange={(e) => setGpuCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-black/30">
                    <span>1</span>
                    <span>8</span>
                </div>
            </div>

            <div className="bg-black text-white rounded-xl p-6">
                <div className="flex items-baseline justify-between">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/50 mb-1">
                            {rateMode === 'hourly' ? 'Hourly' : 'Monthly'} Cost
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold tabular-nums">${formatPrice(displayPrice)}</span>
                            <span className="text-white/50 text-sm">/{rateMode === 'hourly' ? 'hr' : 'mo'}</span>
                        </div>
                    </div>
                    {selectedTier.discount > 0 && (
                        <span className="px-2 py-1 bg-[#FF6B35] text-white text-[10px] font-bold rounded">
                            -{selectedTier.discount}%
                        </span>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-white/40 text-[10px] uppercase">VRAM</p>
                        <p className="font-semibold">{selectedGPU.vram}</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-[10px] uppercase">Base</p>
                        <p className="font-semibold">${selectedGPU.heliosPrice}/hr</p>
                    </div>
                    <div>
                        <p className="text-white/40 text-[10px] uppercase">Plan</p>
                        <p className="font-semibold">{selectedTier.label}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Inference Calculator - matches contact page models
const InferenceCalculator: React.FC<{
    models: InferenceModel[];
    selectedTier: PricingTier;
}> = ({ models, selectedTier }) => {
    const [selectedModel, setSelectedModel] = useState(models[0] || null);
    const [quantity, setQuantity] = useState(10); // 10 minutes or 10 images
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const categories = useMemo(() => [...new Set(models.map(m => m.category))], [models]);

    const filteredModels = useMemo(() => {
        if (!activeCategory) return models;
        return models.filter(m => m.category === activeCategory);
    }, [models, activeCategory]);

    if (!selectedModel) {
        return (
            <div className="text-center py-8 text-black/40">
                <p className="text-sm">No models available. Run migration script.</p>
            </div>
        );
    }

    const basePrice = calculateInferencePrice(selectedModel, quantity);
    const discountedPrice = basePrice * (1 - selectedTier.discount / 100);

    const getSliderConfig = () => {
        switch (selectedModel.estimationUnit) {
            case 'voice-mins':
                return { min: 1, max: 100, step: 1, label: 'Minutes of Audio' };
            case 'images':
                return { min: 1, max: 100, step: 1, label: 'Number of Images' };
            case 'video-mins':
                return { min: 1, max: 60, step: 1, label: 'Minutes of Video' };
            case 'tokens':
                return { min: 0.1, max: 10, step: 0.1, label: 'Million Tokens' };
            default:
                return { min: 1, max: 100, step: 1, label: 'Units' };
        }
    };

    const sliderConfig = getSliderConfig();

    return (
        <div className="space-y-5">
            {/* Category Filter */}
            <div className="flex gap-1.5 flex-wrap">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                        activeCategory === null
                            ? 'bg-black text-white'
                            : 'bg-black/5 text-black/60 hover:bg-black/10'
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                            activeCategory === cat
                                ? 'bg-black text-white'
                                : 'bg-black/5 text-black/60 hover:bg-black/10'
                        }`}
                    >
                        {CATEGORY_LABELS[cat] || cat}
                    </button>
                ))}
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
                    Model
                </label>
                <div className="grid gap-1.5">
                    {filteredModels.map((model) => {
                        const Icon = CATEGORY_ICONS[model.category] || Zap;
                        const isSelected = selectedModel.id === model.id;
                        return (
                            <button
                                key={model.id}
                                onClick={() => {
                                    setSelectedModel(model);
                                    // Reset quantity for different unit types
                                    setQuantity(model.estimationUnit === 'tokens' ? 1 : 10);
                                }}
                                className={`p-3 rounded-lg text-left transition-all border flex items-center justify-between ${
                                    isSelected
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-black/10 hover:border-black/30'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white/50' : 'text-black/30'}`} />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{model.name}</p>
                                        <p className={`text-[11px] ${isSelected ? 'text-white/50' : 'text-black/40'}`}>
                                            {model.provider} · {CATEGORY_LABELS[model.category]}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-2">
                                    <p className={`text-[11px] font-mono ${isSelected ? 'text-white/70' : 'text-black/50'}`}>
                                        ${model.estimationUnit === 'images'
                                            ? model.pricePerSecond.toFixed(3)
                                            : (model.pricePerSecond * 60).toFixed(4)
                                        }
                                    </p>
                                    <p className={`text-[10px] ${isSelected ? 'text-white/40' : 'text-black/30'}`}>
                                        {UNIT_LABELS[model.estimationUnit]}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
                        {sliderConfig.label}
                    </label>
                    <span className="text-sm font-bold tabular-nums">
                        {selectedModel.estimationUnit === 'tokens' ? `${quantity}M` : quantity}
                    </span>
                </div>
                <input
                    type="range"
                    min={sliderConfig.min}
                    max={sliderConfig.max}
                    step={sliderConfig.step}
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full"
                />
            </div>

            {/* Price Output */}
            <div className="bg-black text-white rounded-xl p-5">
                <div className="flex items-baseline justify-between">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/50 mb-1">Estimated Cost</p>
                        <span className="text-3xl font-bold tabular-nums">${formatPrice(discountedPrice)}</span>
                    </div>
                    {selectedTier.discount > 0 && (
                        <span className="px-2 py-1 bg-[#FF6B35] text-white text-[10px] font-bold rounded">
                            -{selectedTier.discount}%
                        </span>
                    )}
                </div>
                {selectedModel.description && (
                    <p className="mt-3 pt-3 border-t border-white/10 text-white/50 text-xs">
                        {selectedModel.description}
                    </p>
                )}
            </div>
        </div>
    );
};

// Clusters Coming Soon
const ClustersComing: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-black/30" />
        </div>
        <h3 className="text-xl font-bold mb-2">Cluster Pricing Coming Soon</h3>
        <p className="text-black/50 text-sm max-w-sm mb-6">
            Contact our team for custom quotes on dedicated infrastructure.
        </p>
        <Link
            to="/contact?service=clusters"
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
        >
            Contact Sales
        </Link>
    </div>
);

// Provider Comparison Table
const ComparisonTable: React.FC<{
    gpuModels: GPUModel[];
    selectedTier: PricingTier;
}> = ({ gpuModels, selectedTier }) => {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const getHeliosPrice = (basePrice: number): number => {
        return basePrice * (1 - selectedTier.discount / 100);
    };

    const sortedModels = useMemo(() => {
        return [...gpuModels].sort((a, b) => {
            const priceA = getHeliosPrice(a.heliosPrice);
            const priceB = getHeliosPrice(b.heliosPrice);
            return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }, [gpuModels, sortDirection, selectedTier]);

    if (gpuModels.length === 0) return null;

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold">Provider Comparison</h3>
                    <p className="text-xs text-black/50">Hourly rates vs major cloud providers</p>
                </div>
                <button
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border border-black/20 rounded-lg hover:bg-black hover:text-white transition-all"
                >
                    <ArrowUpDown className="w-3 h-3" />
                    {sortDirection === 'asc' ? 'Low→High' : 'High→Low'}
                </button>
            </div>

            <div className="overflow-x-auto border border-black/10 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-black/10 bg-black/[0.02]">
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">GPU</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black bg-green-50">Helios</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">CoreWeave</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">AWS</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">GCP</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">Lambda</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {sortedModels.map((gpu) => {
                            const heliosPrice = getHeliosPrice(gpu.heliosPrice);
                            // Find the lowest competitor price for savings calculation
                            const competitorPrices = [
                                parseProviderPrice(gpu.coreweavePrice || ''),
                                parseProviderPrice(gpu.awsPrice || ''),
                                parseProviderPrice(gpu.googleCloudPrice || ''),
                                parseProviderPrice(gpu.lambdaPrice || ''),
                            ].filter(p => p && p > 0);
                            const lowestCompetitor = competitorPrices.length > 0 ? Math.min(...competitorPrices) : null;
                            const savings = lowestCompetitor ? Math.round(((lowestCompetitor - heliosPrice) / lowestCompetitor) * 100) : null;

                            return (
                                <tr key={gpu.id} className="hover:bg-black/[0.01]">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold">{gpu.name}</p>
                                        <p className="text-[11px] text-black/40">{gpu.vram}</p>
                                    </td>
                                    <td className="py-3 px-4 bg-green-50">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-green-700">${heliosPrice.toFixed(2)}</span>
                                            {savings && savings > 0 && (
                                                <span className="text-[9px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                                                    -{savings}%
                                                </span>
                                            )}
                                        </div>
                                        {selectedTier.discount > 0 && (
                                            <p className="text-[10px] text-black/30 line-through">${gpu.heliosPrice.toFixed(2)}</p>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-black/50">
                                        {gpu.coreweavePrice && parseProviderPrice(gpu.coreweavePrice) ? `$${gpu.coreweavePrice}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-black/50">
                                        {gpu.awsPrice && parseProviderPrice(gpu.awsPrice) ? `$${gpu.awsPrice}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-black/50">
                                        {gpu.googleCloudPrice && parseProviderPrice(gpu.googleCloudPrice) ? `$${gpu.googleCloudPrice}` : '—'}
                                    </td>
                                    <td className="py-3 px-4 text-black/50">
                                        {gpu.lambdaPrice && parseProviderPrice(gpu.lambdaPrice) ? `$${gpu.lambdaPrice}` : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                    { label: "Uptime SLA", value: "99.99%" },
                    { label: "Deploy Time", value: "< 60s" },
                    { label: "Network", value: "400Gbps" },
                    { label: "Security", value: "Enterprise" },
                ].map((stat, i) => (
                    <div key={i} className="text-center p-2.5 bg-black/[0.02] rounded-lg">
                        <p className="text-[9px] font-medium uppercase tracking-wider text-black/40">{stat.label}</p>
                        <p className="font-bold text-sm">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Inference Pricing Table
const InferencePricingTable: React.FC<{
    models: InferenceModel[];
    selectedTier: PricingTier;
}> = ({ models, selectedTier }) => {
    if (models.length === 0) return null;

    const getDiscountedPrice = (price: number) => price * (1 - selectedTier.discount / 100);

    return (
        <div className="mt-8">
            <div className="mb-4">
                <h3 className="text-lg font-bold">All Models</h3>
                <p className="text-xs text-black/50">Pricing by usage type</p>
            </div>

            <div className="overflow-x-auto border border-black/10 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-black/10 bg-black/[0.02]">
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">Model</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">Category</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">Price</th>
                            <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-black/40">Unit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {models.map((model) => {
                            const displayPrice = model.estimationUnit === 'images'
                                ? model.pricePerSecond
                                : model.pricePerSecond * 60; // Per minute for audio/video
                            const discountedPrice = getDiscountedPrice(displayPrice);

                            return (
                                <tr key={model.id} className="hover:bg-black/[0.01]">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold">{model.name}</p>
                                        <p className="text-[11px] text-black/40">{model.provider}</p>
                                    </td>
                                    <td className="py-3 px-4 text-black/60 text-xs">
                                        {CATEGORY_LABELS[model.category]}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-semibold">${discountedPrice.toFixed(4)}</span>
                                        {selectedTier.discount > 0 && (
                                            <span className="text-[10px] text-black/30 line-through ml-1">
                                                ${displayPrice.toFixed(4)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-black/50 text-xs">
                                        {UNIT_LABELS[model.estimationUnit]}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PricingPage: React.FC = () => {
    const { gpuModels, inferenceModels, pricingTiers, pageConfig, loading, error } = usePricingData();
    const [activeSection, setActiveSection] = useState<PricingSection>('gpus');
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
    const [rateMode, setRateMode] = useState<RateMode>('hourly');
    const [tierDropdownOpen, setTierDropdownOpen] = useState(false);

    React.useEffect(() => {
        if (pricingTiers.length > 0 && !selectedTier) {
            const defaultTier = pricingTiers.find(t => t.id === 'on-demand') || pricingTiers[0];
            setSelectedTier(defaultTier);
        }
    }, [pricingTiers, selectedTier]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
                    <p className="mt-3 text-xs text-black/40 uppercase tracking-wider">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !pageConfig || !selectedTier) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="text-center max-w-sm px-6">
                    <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
                    <p className="text-black/50 text-sm mb-4">Unable to load pricing data.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-black text-white rounded-lg text-sm font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black">
            <Navbar />

            <main className="pt-20">
                {/* Hero */}
                <section className="px-6 py-10 border-b border-black/5">
                    <div className="max-w-6xl mx-auto">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
                            Pricing
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mt-2">
                            {pageConfig.heroTitle}
                        </h1>
                        {pageConfig.heroSubtitle && (
                            <p className="text-lg text-black/50 mt-3 max-w-xl">
                                {pageConfig.heroSubtitle}
                            </p>
                        )}
                    </div>
                </section>

                {/* Main Layout */}
                <section className="px-6 py-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Sidebar */}
                            <aside className="lg:w-52 shrink-0">
                                <div className="lg:sticky lg:top-20 space-y-3">
                                    {/* Nav */}
                                    <nav className="bg-white rounded-lg border border-black/5 p-1">
                                        {SIDEBAR_ITEMS.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = activeSection === item.id;
                                            const isDisabled = item.disabled;

                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => !isDisabled && setActiveSection(item.id)}
                                                    disabled={isDisabled}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all text-sm ${
                                                        isActive
                                                            ? 'bg-black text-white'
                                                            : isDisabled
                                                            ? 'text-black/25 cursor-not-allowed'
                                                            : 'text-black/60 hover:bg-black/5'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="font-medium">{item.label}</span>
                                                    {isDisabled && (
                                                        <span className="ml-auto text-[8px] font-semibold uppercase bg-black/5 px-1 py-0.5 rounded text-black/30">
                                                            Soon
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>

                                    {/* Commitment */}
                                    <div className="bg-white rounded-lg border border-black/5 p-3">
                                        <label className="text-[9px] font-semibold uppercase tracking-wider text-black/40 block mb-1.5">
                                            Commitment
                                        </label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setTierDropdownOpen(!tierDropdownOpen)}
                                                className="w-full flex items-center justify-between px-2.5 py-2 bg-black/[0.03] rounded-md hover:bg-black/[0.06] transition-colors text-sm"
                                            >
                                                <div className="text-left">
                                                    <p className="font-semibold text-sm">{selectedTier.label}</p>
                                                    {selectedTier.discount > 0 && (
                                                        <p className="text-[10px] text-[#FF6B35] font-medium">-{selectedTier.discount}%</p>
                                                    )}
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-black/40 transition-transform ${tierDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {tierDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-black/10 shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto"
                                                    >
                                                        {pricingTiers.map((tier) => (
                                                            <button
                                                                key={tier.id}
                                                                onClick={() => {
                                                                    setSelectedTier(tier);
                                                                    setTierDropdownOpen(false);
                                                                }}
                                                                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-black/5 transition-colors text-sm ${
                                                                    selectedTier.id === tier.id ? 'bg-black/5' : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    {selectedTier.id === tier.id && (
                                                                        <Check className="w-3 h-3 text-black" />
                                                                    )}
                                                                    <span className="font-medium">{tier.label}</span>
                                                                </div>
                                                                {tier.discount > 0 && (
                                                                    <span className="text-[10px] font-semibold text-[#FF6B35]">
                                                                        -{tier.discount}%
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Rate Toggle */}
                                    {activeSection === 'gpus' && (
                                        <div className="bg-white rounded-lg border border-black/5 p-3">
                                            <label className="text-[9px] font-semibold uppercase tracking-wider text-black/40 block mb-1.5">
                                                Display
                                            </label>
                                            <div className="flex bg-black/[0.03] rounded-md p-0.5">
                                                <button
                                                    onClick={() => setRateMode('hourly')}
                                                    className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all ${
                                                        rateMode === 'hourly'
                                                            ? 'bg-white text-black shadow-sm'
                                                            : 'text-black/40'
                                                    }`}
                                                >
                                                    Hourly
                                                </button>
                                                <button
                                                    onClick={() => setRateMode('monthly')}
                                                    className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all ${
                                                        rateMode === 'monthly'
                                                            ? 'bg-white text-black shadow-sm'
                                                            : 'text-black/40'
                                                    }`}
                                                >
                                                    Monthly
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </aside>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                                <div className="bg-white rounded-lg border border-black/5 p-5">
                                    <AnimatePresence mode="wait">
                                        {activeSection === 'clusters' && (
                                            <motion.div
                                                key="clusters"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <ClustersComing />
                                            </motion.div>
                                        )}

                                        {activeSection === 'inference' && (
                                            <motion.div
                                                key="inference"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-bold">Inference Pricing</h2>
                                                    <p className="text-xs text-black/50">Pay per usage. No minimums.</p>
                                                </div>
                                                <InferenceCalculator
                                                    models={inferenceModels}
                                                    selectedTier={selectedTier}
                                                />
                                            </motion.div>
                                        )}

                                        {activeSection === 'gpus' && (
                                            <motion.div
                                                key="gpus"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-bold">GPU Instances</h2>
                                                    <p className="text-xs text-black/50">Dedicated compute for training and inference.</p>
                                                </div>
                                                <GPUCalculator
                                                    gpuModels={gpuModels}
                                                    selectedTier={selectedTier}
                                                    rateMode={rateMode}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Tables */}
                                {activeSection === 'gpus' && (
                                    <ComparisonTable
                                        gpuModels={gpuModels}
                                        selectedTier={selectedTier}
                                    />
                                )}

                                {activeSection === 'inference' && (
                                    <InferencePricingTable
                                        models={inferenceModels}
                                        selectedTier={selectedTier}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-black rounded-lg p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold">Need custom pricing?</h3>
                                <p className="text-white/50 text-sm mt-1">Enterprise plans with dedicated support and custom SLAs.</p>
                            </div>
                            <Link
                                to="/contact?service=clusters"
                                className="px-6 py-2.5 bg-white text-black rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors shrink-0"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PricingPage;
