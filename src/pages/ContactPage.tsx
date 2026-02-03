import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '../components/Footer';
import { Loader2, Check } from 'lucide-react';
import { DualRangeSlider } from '../components/ui/dual-range-slider';
import { useSanityQuery, QUERIES } from '../hooks/useSanityData';
import * as Slider from '@radix-ui/react-slider';

const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";

const EMBER_GLOW = "radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, transparent 60%)";

type FormState = 'idle' | 'loading' | 'success' | 'error';
type ServiceInterest = 'clusters' | 'inference' | 'baremetal' | 'press' | 'partnership' | 'others';
type ClusterType = 'rtx-6000-pro' | 'b200' | 'h200-sxm' | 'h100';

interface InferenceModel {
  _id: string;
  id: string;
  name: string;
  category: 'audio-input' | 'audio-output' | 'image' | 'vision' | 'text';
  pricePerSecond: number;
  estimationUnit: 'voice-mins' | 'images' | 'video-mins' | 'tokens';
  description: string;
  provider: string;
}

interface FormData {
  name: string;
  email: string;
  organization: string;
  serviceInterest: ServiceInterest | '';
  message: string;
  // Clusters specific
  clusterTypes: ClusterType[];
  gpuRange: [number, number];
  // Inference specific
  selectedModels: string[];
  modelEstimations: Record<string, number>; // model ID -> estimation value
  // Partnership specific
  partnershipDetails: string;
}

const MinimalInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-3 ml-6 text-white"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-white/[0.05] text-white text-lg placeholder:text-white/30
            rounded-full px-8 py-4 transition-all duration-300 ease-out
            border border-white/20
            focus:outline-none focus:bg-white/[0.08] focus:border-[#FF6B35]/50 focus:shadow-[0_0_30px_-5px_rgba(255,107,53,0.2)]
            ${isFocused ? 'translate-y-[-2px] border-white/40' : ''}
          `}
        />
        <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />
      </div>
    </div>
  );
};

const MinimalTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 5
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-3 ml-6 text-white"
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-white/[0.05] text-white text-lg placeholder:text-white/30
            rounded-[32px] px-8 py-6 transition-all duration-300 ease-out
            border border-white/20 resize-none
            focus:outline-none focus:bg-white/[0.08] focus:border-[#FF6B35]/50 focus:shadow-[0_0_30px_-5px_rgba(255,107,53,0.2)]
            ${isFocused ? 'translate-y-[-2px] border-white/40' : ''}
          `}
        />
        <div className="absolute inset-0 rounded-[32px] pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />
      </div>
    </div>
  );
};

const ServicePill = ({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
      border
      ${isSelected
        ? 'bg-[#FF6B35]/25 text-[#FF6B35] border-[#FF6B35] shadow-[0_0_20px_rgba(255,107,53,0.3)]'
        : 'bg-white/[0.06] text-white border-white/20 hover:border-white/40'
      }
    `}
  >
    {label}
  </button>
);

const ChipSelect = ({
  options,
  selected,
  onToggle,
  multiSelect = true
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  multiSelect?: boolean;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map(option => {
      const isSelected = selected.includes(option.value);
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onToggle(option.value)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            border flex items-center gap-2
            ${isSelected
              ? 'bg-[#FF6B35]/25 text-[#FF6B35] border-[#FF6B35]'
              : 'bg-white/[0.08] text-white border-white/20 hover:border-white/40'
            }
          `}
        >
          {isSelected && <Check className="w-3 h-3" />}
          {option.label}
        </button>
      );
    })}
  </div>
);

const EstimationSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-sm text-white">{label}</span>
      <span className="text-sm font-medium text-[#FF6B35] bg-[#FF6B35]/10 px-3 py-1 rounded-full">
        {formatValue(value)}
      </span>
    </div>
    <Slider.Root
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={step}
      className="relative flex w-full touch-none select-none items-center"
    >
      <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/10">
        <Slider.Range className="absolute h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8F5A]" />
      </Slider.Track>
      <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-[#FF6B35] bg-black shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 hover:scale-110 cursor-grab active:cursor-grabbing" />
    </Slider.Root>
    <div className="flex justify-between text-xs text-white/70">
      <span>{formatValue(min)}</span>
      <span>{formatValue(max)}</span>
    </div>
  </div>
);

const clusterOptions: { value: ClusterType; label: string }[] = [
  { value: 'rtx-6000-pro', label: 'RTX 6000 Pro' },
  { value: 'b200', label: 'B200' },
  { value: 'h200-sxm', label: 'H200 SXM' },
  { value: 'h100', label: 'H100' },
];

const serviceLabels: Record<ServiceInterest, string> = {
  clusters: 'Clusters',
  inference: 'Inference',
  baremetal: 'Baremetal',
  press: 'Press',
  partnership: 'Partnership',
  others: 'Others'
};

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    message: '',
    serviceInterest: '',
    clusterTypes: [],
    gpuRange: [8, 64],
    selectedModels: [],
    modelEstimations: {},
    partnershipDetails: ''
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch inference models from Sanity
  const { data: inferenceModels = [] } = useSanityQuery<InferenceModel[]>(
    'inferenceModels',
    QUERIES.inferenceModels
  );

  // Handle URL parameters for prefilling form
  useEffect(() => {
    const service = searchParams.get('service') as ServiceInterest | null;
    const cluster = searchParams.get('cluster') as ClusterType | null;

    if (service && Object.keys(serviceLabels).includes(service)) {
      setFormData(prev => ({
        ...prev,
        serviceInterest: service,
        // If cluster param is provided and service is clusters, prefill cluster type
        clusterTypes: service === 'clusters' && cluster ? [cluster] : []
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service: ServiceInterest) => {
    setFormData(prev => ({
      ...prev,
      serviceInterest: service,
      // Reset conditional fields when service changes
      clusterTypes: [],
      selectedModels: [],
      modelEstimations: {},
      partnershipDetails: ''
    }));
  };

  const handleClusterToggle = (cluster: ClusterType) => {
    setFormData(prev => ({
      ...prev,
      clusterTypes: prev.clusterTypes.includes(cluster)
        ? prev.clusterTypes.filter(c => c !== cluster)
        : [...prev.clusterTypes, cluster]
    }));
  };

  const handleModelToggle = (modelId: string) => {
    const model = inferenceModels.find(m => m.id === modelId);
    const defaultValue = getDefaultEstimationForUnit(model?.estimationUnit);

    setFormData(prev => {
      const isSelected = prev.selectedModels.includes(modelId);
      const newEstimations = { ...prev.modelEstimations };

      if (isSelected) {
        // Remove model
        delete newEstimations[modelId];
      } else {
        // Add model with default estimation
        newEstimations[modelId] = defaultValue;
      }

      return {
        ...prev,
        selectedModels: isSelected
          ? prev.selectedModels.filter(m => m !== modelId)
          : [...prev.selectedModels, modelId],
        modelEstimations: newEstimations
      };
    });
  };

  const handleEstimationChange = (modelId: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      modelEstimations: {
        ...prev.modelEstimations,
        [modelId]: value
      }
    }));
  };

  // Get selected models' details
  const selectedModelDetails = useMemo(() => {
    return inferenceModels.filter(m => formData.selectedModels.includes(m.id));
  }, [inferenceModels, formData.selectedModels]);

  // Get estimation config for a specific unit type
  const getEstimationConfig = (unit: string) => {
    switch (unit) {
      case 'voice-mins':
        return {
          label: 'Voice Minutes/Month',
          min: 10,
          max: 10000,
          step: 10,
          format: (v: number) => `${v.toLocaleString()} mins`
        };
      case 'images':
        return {
          label: 'Images/Month',
          min: 100,
          max: 100000,
          step: 100,
          format: (v: number) => `${v.toLocaleString()} images`
        };
      case 'video-mins':
        return {
          label: 'Video Minutes/Month',
          min: 1,
          max: 1000,
          step: 1,
          format: (v: number) => `${v.toLocaleString()} mins`
        };
      case 'tokens':
        return {
          label: 'Tokens/Month (Millions)',
          min: 1,
          max: 1000,
          step: 1,
          format: (v: number) => `${v}M tokens`
        };
      default:
        return null;
    }
  };

  function getDefaultEstimationForUnit(unit?: string): number {
    switch (unit) {
      case 'voice-mins': return 100;
      case 'images': return 1000;
      case 'video-mins': return 10;
      case 'tokens': return 10;
      default: return 100;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    // Build payload with all form data
    const payload = {
      name: formData.name,
      email: formData.email,
      company: formData.organization || 'Not specified',
      message: formData.message || formData.partnershipDetails || 'No message provided',
      inquiryType: serviceLabels[formData.serviceInterest as ServiceInterest] || formData.serviceInterest,
      // Cluster details
      ...(formData.serviceInterest === 'clusters' && {
        clusterDetails: {
          types: formData.clusterTypes.length > 0
            ? formData.clusterTypes.map(c =>
                clusterOptions.find(o => o.value === c)?.label || c
              ).join(', ')
            : 'Not specified',
          gpuCountMin: formData.gpuRange[0],
          gpuCountMax: formData.gpuRange[1]
        }
      }),
      // Inference details
      ...(formData.serviceInterest === 'inference' && selectedModelDetails.length > 0 && {
        inferenceDetails: {
          models: selectedModelDetails.map(m => {
            const config = getEstimationConfig(m.estimationUnit);
            const estimation = formData.modelEstimations[m.id] || 0;
            return {
              name: m.name,
              category: m.category,
              estimation: config ? config.format(estimation) : String(estimation)
            };
          })
        }
      }),
      // Partnership details
      ...(formData.serviceInterest === 'partnership' && {
        partnershipDetails: formData.partnershipDetails
      })
    };

    try {
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Connection failed.');
      }

      setTimeout(() => setFormState('success'), 800);

    } catch (error) {
      setFormState('error');
      setErrorMessage('We couldn\'t connect. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      organization: '',
      message: '',
      serviceInterest: '',
      clusterTypes: [],
      gpuRange: [8, 64],
      selectedModels: [],
      modelEstimations: {},
      partnershipDetails: ''
    });
    setFormState('idle');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF6B35] selection:text-white overflow-hidden flex flex-col">
      <Navigation />

      <main className="flex-grow relative flex items-center justify-center py-32 px-6">

        {/* Ambient Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] max-w-[1000px] max-h-[1000px] pointer-events-none z-0">
          <div
            className="w-full h-full opacity-40 blur-[100px] rounded-full transition-opacity duration-1000"
            style={{ background: EMBER_GLOW }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[680px] mx-auto">

          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Received.</h2>
                <p className="text-xl text-white/60 font-light leading-relaxed max-w-md mx-auto">
                  We'll be in touch shortly to discuss your {formData.serviceInterest || 'infrastructure'} needs.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="mt-12 text-sm uppercase tracking-widest text-[#FF6B35] hover:text-white transition-colors font-semibold"
                >
                  Start new conversation
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Header Section */}
                <div className="text-center mb-16">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white"
                  >
                    Ready to scale?
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-lg md:text-xl text-white/50 font-light max-w-lg mx-auto leading-relaxed"
                  >
                    Whether you need a single H100 or a custom cluster, we're here to help you deploy.
                  </motion.p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-10">

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MinimalInput
                      label="Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                    <MinimalInput
                      label="Organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Company name"
                    />
                  </div>

                  <MinimalInput
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                  />

                  {/* Service Interest */}
                  <div className="space-y-4">
                    <span className="block text-sm font-medium text-white ml-6">What are you interested in? *</span>
                    <div className="flex flex-wrap gap-3">
                      {(Object.keys(serviceLabels) as ServiceInterest[]).map(service => (
                        <ServicePill
                          key={service}
                          label={serviceLabels[service]}
                          isSelected={formData.serviceInterest === service}
                          onClick={() => handleServiceChange(service)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Conditional: Clusters */}
                  <AnimatePresence>
                    {formData.serviceInterest === 'clusters' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 overflow-hidden"
                      >
                        <div className="bg-white/[0.04] rounded-3xl p-6 border border-white/15 space-y-6">
                          <div className="space-y-4">
                            <span className="block text-sm font-medium text-white">Select Cluster Type</span>
                            <ChipSelect
                              options={clusterOptions}
                              selected={formData.clusterTypes}
                              onToggle={(v) => handleClusterToggle(v as ClusterType)}
                            />
                          </div>

                          <div className="space-y-4">
                            <span className="block text-sm font-medium text-white">Approximate GPU Count</span>
                            <DualRangeSlider
                              min={4}
                              max={480}
                              step={4}
                              value={formData.gpuRange}
                              onValueChange={(v) => setFormData(prev => ({ ...prev, gpuRange: v }))}
                              formatLabel={(v) => `${v} GPUs`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Conditional: Inference */}
                  <AnimatePresence>
                    {formData.serviceInterest === 'inference' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="bg-white/[0.04] rounded-3xl p-6 border border-white/15 space-y-6">
                          <div className="space-y-4">
                            <span className="block text-sm font-medium text-white">Models of Interest (optional)</span>
                            {inferenceModels.length > 0 ? (
                              <ChipSelect
                                options={inferenceModels.map(m => ({ value: m.id, label: m.name }))}
                                selected={formData.selectedModels}
                                onToggle={handleModelToggle}
                              />
                            ) : (
                              <p className="text-white/60 text-sm">Loading models...</p>
                            )}
                          </div>

                          {selectedModelDetails.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="pt-4 space-y-6"
                            >
                              {selectedModelDetails.map(model => {
                                const config = getEstimationConfig(model.estimationUnit);
                                if (!config) return null;
                                return (
                                  <div key={model.id} className="space-y-2">
                                    <div className="text-sm text-white font-medium">{model.name}</div>
                                    <EstimationSlider
                                      label={config.label}
                                      value={formData.modelEstimations[model.id] || getDefaultEstimationForUnit(model.estimationUnit)}
                                      onChange={(v) => handleEstimationChange(model.id, v)}
                                      min={config.min}
                                      max={config.max}
                                      step={config.step}
                                      formatValue={config.format}
                                    />
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Conditional: Partnership */}
                  <AnimatePresence>
                    {formData.serviceInterest === 'partnership' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <MinimalTextarea
                          label="Tell us about the partnership opportunity"
                          name="partnershipDetails"
                          value={formData.partnershipDetails}
                          onChange={handleChange}
                          placeholder="Describe your partnership idea, what you're looking to achieve together..."
                          rows={4}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Additional Notes */}
                  {formData.serviceInterest && formData.serviceInterest !== 'partnership' && (
                    <MinimalTextarea
                      label="Additional notes (optional)"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any other details you'd like to share..."
                      rows={3}
                    />
                  )}

                  {/* Actions */}
                  <div className="pt-6 flex flex-col items-center gap-6">
                    <button
                      type="submit"
                      disabled={formState === 'loading' || !formData.serviceInterest}
                      className={`
                        relative group overflow-hidden rounded-full bg-white text-black
                        px-10 py-4 font-medium text-lg transition-all duration-300
                        hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      `}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {formState === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                        {formState === 'loading' ? 'Connecting...' : 'Start the conversation'}
                      </span>
                    </button>

                    {formState === 'error' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400/80 text-sm"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </div>

                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
