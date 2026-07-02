import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Cpu } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GPUModel, usePricingData } from '@/hooks/usePricingData';

type RateMode = 'hourly' | 'monthly';

type ReservedTerm = {
    years: number;
    multiplier: number;
    price: number;
};

const HOURS_PER_MONTH_FALLBACK = 730;
const GPUS_PER_NODE = 8;
const MIN_NODES = 1;
const MAX_NODES = 2048;
const OFFER_ORDER = ['gb300-nvl72', 'b300', 'b200', 'rtx-pro-6000'];
const TERM_MULTIPLIERS: Record<number, number> = {
    1: 1.1,
    2: 1.05,
    3: 1,
    4: 0.95,
    5: 0.85,
};

const formatRate = (value: number | undefined): string => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '-';
    return value.toFixed(2);
};

const formatMoney = (value: number): string => (
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
);

const termLabel = (years: number): string => `${years} Year${years > 1 ? 's' : ''}`;

const getTerms = (gpu: GPUModel): ReservedTerm[] => {
    const published = (gpu.heliosReservedTermPrices || [])
        .filter((term) => typeof term.years === 'number' && typeof term.price === 'number')
        .map((term) => ({ years: term.years, multiplier: term.multiplier, price: term.price }))
        .sort((a, b) => a.years - b.years);

    if (published.length > 0) return published;

    const base = gpu.heliosBaseReservedPrice ?? gpu.heliosPrice;
    if (typeof base !== 'number') return [];
    return Object.entries(TERM_MULTIPLIERS).map(([years, multiplier]) => ({
        years: Number(years),
        multiplier,
        price: Number((base * multiplier).toFixed(4)),
    }));
};

const sortGpuModels = (gpus: GPUModel[]): GPUModel[] => (
    [...gpus]
        .filter((gpu) => OFFER_ORDER.includes(gpu.id))
        .sort((a, b) => {
            const aIndex = OFFER_ORDER.indexOf(a.id);
            const bIndex = OFFER_ORDER.indexOf(b.id);
            if (aIndex !== bIndex) return aIndex - bIndex;
            return (a.displayOrder ?? 999) - (b.displayOrder ?? 999);
        })
);

const ReservedRateTable: React.FC<{
    gpuModels: GPUModel[];
    selectedGpuId: string;
}> = ({ gpuModels, selectedGpuId }) => {
    if (gpuModels.length === 0) return null;

    return (
        <div className="mt-8">
            <div className="mb-4">
                <h3 className="text-lg font-bold">Reserved Rates</h3>
                <p className="text-xs text-black/50">Hourly rates by reserved term.</p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
                <table className="w-full min-w-[680px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-black/10 bg-black/[0.02]">
                            <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-black/40">GPU</th>
                            {[1, 2, 3, 4, 5].map((year) => (
                                <th key={year} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-black/40">
                                    {year} Year
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {gpuModels.map((gpu) => {
                            const terms = getTerms(gpu);
                            return (
                                <tr key={gpu.id} className={gpu.id === selectedGpuId ? 'bg-green-50/70' : undefined}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {gpu.id === selectedGpuId && <Check className="h-4 w-4 text-green-700" />}
                                            <div>
                                                <p className="font-bold">{gpu.name}</p>
                                                <p className="text-[11px] text-black/45">{gpu.vram}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {[1, 2, 3, 4, 5].map((year) => {
                                        const term = terms.find((item) => item.years === year);
                                        return (
                                            <td key={year} className="px-4 py-3 font-semibold">
                                                ${formatRate(term?.price)}/hr
                                            </td>
                                        );
                                    })}
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
    const { gpuModels, loading, error } = usePricingData();
    const [selectedGpuId, setSelectedGpuId] = useState<string | null>(null);
    const [selectedYears, setSelectedYears] = useState(3);
    const [nodeCount, setNodeCount] = useState(1);
    const [rateMode, setRateMode] = useState<RateMode>('hourly');
    const [termDropdownOpen, setTermDropdownOpen] = useState(false);

    const gpus = useMemo(() => sortGpuModels(gpuModels), [gpuModels]);
    const selectedGpu = useMemo(() => {
        if (gpus.length === 0) return null;
        return gpus.find((gpu) => gpu.id === selectedGpuId) || gpus[0];
    }, [gpus, selectedGpuId]);
    const terms = selectedGpu ? getTerms(selectedGpu) : [];
    const selectedTerm = terms.find((term) => term.years === selectedYears) || terms.find((term) => term.years === 3) || terms[0];
    const hoursPerMonth = selectedGpu?.pricingHoursPerMonth || HOURS_PER_MONTH_FALLBACK;
    const totalGpuCount = nodeCount * GPUS_PER_NODE;
    const hourlyTotal = selectedTerm ? selectedTerm.price * totalGpuCount : 0;
    const monthlyTotal = hourlyTotal * hoursPerMonth;
    const primaryTotal = rateMode === 'hourly' ? hourlyTotal : monthlyTotal;
    const setClampedNodeCount = (value: number) => {
        setNodeCount(Math.min(MAX_NODES, Math.max(MIN_NODES, value || MIN_NODES)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] text-black">
                <Navigation />
                <main className="min-h-[70vh] flex items-center justify-center pt-20">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 rounded-full border-2 border-black/10 border-t-black animate-spin" />
                        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-black/40">Loading pricing</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !selectedGpu || !selectedTerm) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] text-black">
                <Navigation />
                <main className="min-h-[70vh] flex items-center justify-center px-6 pt-20">
                    <div className="max-w-md text-center">
                        <h1 className="text-3xl font-bold">Pricing data unavailable</h1>
                        <p className="mt-3 text-sm text-black/50">Contact sales for current reserved GPU pricing.</p>
                        <Link
                            to="/contact?service=clusters"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
                        >
                            Contact Sales
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black">
            <Navigation />

            <main className="pt-20">
                <section className="border-b border-black/5 px-6 py-10">
                    <div className="mx-auto max-w-6xl">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
                            Pricing
                        </span>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight lg:text-5xl">
                            Reserved GPU Pricing
                        </h1>
                        <p className="mt-3 max-w-xl text-lg text-black/50">
                            Dedicated GPU capacity with simple multi-year reserved terms.
                        </p>
                    </div>
                </section>

                <section className="px-6 py-6">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col gap-6 lg:flex-row">
                            <aside className="shrink-0 lg:w-52">
                                <div className="space-y-3 lg:sticky lg:top-20">
                                    <nav className="rounded-lg border border-black/5 bg-white p-1">
                                        <button className="flex w-full items-center gap-2 rounded-md bg-black px-3 py-2 text-left text-sm text-white">
                                            <Cpu className="h-4 w-4" />
                                            <span className="font-medium">GPUs</span>
                                        </button>
                                    </nav>

                                    <div className="rounded-lg border border-black/5 bg-white p-3">
                                        <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-black/40">
                                            Reserved Term
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setTermDropdownOpen((open) => !open)}
                                                className="flex w-full items-center justify-between rounded-md bg-black/[0.03] px-2.5 py-2 text-sm transition-colors hover:bg-black/[0.06]"
                                            >
                                                <span className="font-semibold">{termLabel(selectedTerm.years)}</span>
                                                <ChevronDown className={`h-4 w-4 text-black/40 transition-transform ${termDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {termDropdownOpen && (
                                                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-black/10 bg-white shadow-lg">
                                                    {terms.map((term) => (
                                                        <button
                                                            key={term.years}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedYears(term.years);
                                                                setTermDropdownOpen(false);
                                                            }}
                                                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 ${
                                                                selectedTerm.years === term.years ? 'bg-black/5' : ''
                                                            }`}
                                                        >
                                                            <span className="font-medium">{termLabel(term.years)}</span>
                                                            <span className="text-[11px] font-semibold text-black/50">${formatRate(term.price)}/hr</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-black/5 bg-white p-3">
                                        <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-black/40">
                                            Display
                                        </label>
                                        <div className="flex rounded-md bg-black/[0.03] p-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setRateMode('hourly')}
                                                className={`flex-1 rounded py-1.5 text-xs font-semibold transition-all ${
                                                    rateMode === 'hourly' ? 'bg-white text-black shadow-sm' : 'text-black/40'
                                                }`}
                                            >
                                                Hourly
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRateMode('monthly')}
                                                className={`flex-1 rounded py-1.5 text-xs font-semibold transition-all ${
                                                    rateMode === 'monthly' ? 'bg-white text-black shadow-sm' : 'text-black/40'
                                                }`}
                                            >
                                                Monthly
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            <div className="min-w-0 flex-1">
                                <div className="rounded-lg border border-black/5 bg-white p-5">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold">GPU Instances</h2>
                                        <p className="text-xs text-black/50">Dedicated compute for training and inference.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
                                                Select GPU
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                                                {gpus.map((gpu) => (
                                                    <button
                                                        key={gpu.id}
                                                        type="button"
                                                        onClick={() => setSelectedGpuId(gpu.id)}
                                                        className={`min-h-[74px] rounded-lg border p-3 text-left transition-all ${
                                                            selectedGpu.id === gpu.id
                                                                ? 'border-black bg-black text-white'
                                                                : 'border-black/10 bg-white text-black/70 hover:border-black/30'
                                                        }`}
                                                    >
                                                        <p className="text-sm font-semibold">{gpu.name}</p>
                                                        <p className={`text-[11px] ${selectedGpu.id === gpu.id ? 'text-white/60' : 'text-black/40'}`}>
                                                            {gpu.vram}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
                                                        Nodes
                                                    </label>
                                                    <p className="mt-1 text-xs text-black/40">1 node = 8 GPUs</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-right text-lg font-bold tabular-nums">
                                                        {nodeCount.toLocaleString()} node{nodeCount > 1 ? 's' : ''}
                                                        <span className="ml-2 text-sm font-semibold text-black/40">
                                                            ({totalGpuCount.toLocaleString()} GPUs)
                                                        </span>
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min={MIN_NODES}
                                                        max={MAX_NODES}
                                                        value={nodeCount}
                                                        onChange={(event) => setClampedNodeCount(Number(event.target.value))}
                                                        className="h-10 w-24 rounded-lg border border-black/10 px-3 text-right text-sm font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min={MIN_NODES}
                                                max={MAX_NODES}
                                                value={nodeCount}
                                                onChange={(event) => setNodeCount(Number(event.target.value))}
                                                className="h-1.5 w-full appearance-none rounded-full bg-black/10 cursor-pointer [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-black/30">
                                                <span>1 node</span>
                                                <span>2,048 nodes</span>
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-black p-6 text-white">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
                                                        {rateMode === 'hourly' ? 'Hourly' : 'Monthly'} Cost
                                                    </p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-4xl font-bold tabular-nums">${formatMoney(primaryTotal)}</span>
                                                        <span className="text-sm text-white/50">/{rateMode === 'hourly' ? 'hr' : 'mo'}</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/contact?service=clusters&gpu=${selectedGpu.id}&nodes=${nodeCount}`}
                                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90"
                                                >
                                                    Talk to Sales
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm sm:grid-cols-5">
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/60">VRAM</p>
                                                    <p className="font-semibold">{selectedGpu.vram}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/60">Nodes</p>
                                                    <p className="font-semibold">{nodeCount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/60">GPUs</p>
                                                    <p className="font-semibold">{totalGpuCount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/60">GPU Rate</p>
                                                    <p className="font-semibold">${formatRate(selectedTerm.price)}/hr</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/60">Plan</p>
                                                    <p className="font-semibold">{termLabel(selectedTerm.years)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <ReservedRateTable gpuModels={gpus} selectedGpuId={selectedGpu.id} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 py-10">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col items-center justify-between gap-6 rounded-lg bg-black p-8 text-white lg:flex-row">
                            <div>
                                <h3 className="text-xl font-bold">Need custom pricing?</h3>
                                <p className="mt-1 text-sm text-white/50">Enterprise plans with dedicated support and custom SLAs.</p>
                            </div>
                            <Link
                                to="/contact?service=clusters"
                                className="shrink-0 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
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
