import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity';

export interface GPUModel {
    _id: string;
    id: string;
    name: string;
    vram: string;
    memory: string;
    specs?: string;
    heliosPrice: number;
    awsPrice?: string;
    googleCloudPrice?: string;
    lambdaPrice?: string;
    modalPrice?: string;
    displayOrder?: number;
}

// Same interface as contact page - media/audio/image models with per-second pricing
export interface InferenceModel {
    _id: string;
    id: string;
    name: string;
    category: 'audio-input' | 'audio-output' | 'image' | 'vision' | 'text';
    pricePerSecond: number;
    estimationUnit: 'voice-mins' | 'images' | 'video-mins' | 'tokens';
    description?: string;
    provider?: string;
    displayOrder?: number;
}

export interface PricingTier {
    _id: string;
    id: string;
    label: string;
    duration: string;
    discount: number;
    featured?: boolean;
    description?: string;
    displayOrder: number;
}

export interface PricingPageConfig {
    _id: string;
    title: string;
    heroTitle: string;
    heroSubtitle?: string;
    ctaButtonText?: string;
    ctaButtonUrl?: string;
    calculatorTitle?: string;
    comparisonTableTitle?: string;
    footerNote?: string;
    calendlyUrl?: string;
}

export const usePricingData = () => {
    const [gpuModels, setGpuModels] = useState<GPUModel[]>([]);
    const [inferenceModels, setInferenceModels] = useState<InferenceModel[]>([]);
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
    const [pageConfig, setPageConfig] = useState<PricingPageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch GPU models
                const gpusQuery = `*[_type == "gpuModel"] | order(displayOrder asc)`;
                const gpus = await client.fetch<GPUModel[]>(gpusQuery);

                // Fetch inference models (same as contact page - Whisper, Flux, Bark, Qwen3 VL)
                const inferenceQuery = `*[_type == "inferenceModel"] | order(displayOrder asc)`;
                const inference = await client.fetch<InferenceModel[]>(inferenceQuery);

                // Fetch pricing tiers
                const tiersQuery = `*[_type == "pricingTier"] | order(displayOrder asc)`;
                const tiers = await client.fetch<PricingTier[]>(tiersQuery);

                // Fetch page config (get the first one)
                const configQuery = `*[_type == "pricingPageSection"][0]`;
                const config = await client.fetch<PricingPageConfig>(configQuery);

                setGpuModels(gpus);
                setInferenceModels(inference);
                setPricingTiers(tiers);
                setPageConfig(config);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch pricing data'));
                console.error('Error fetching pricing data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        gpuModels,
        inferenceModels,
        pricingTiers,
        pageConfig,
        loading,
        error,
    };
};
