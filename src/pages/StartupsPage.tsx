import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { StaticMeshGradient } from '@paper-design/shaders-react';
import {
  Loader2,
  Check,
  Rocket,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  FileCheck,
  ChevronDown,
  Clock,
  MessageSquare
} from 'lucide-react';

const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  founderName: string;
  email: string;
  companyName: string;
  website: string;
  fundingStage: string;
  teamSize: string;
  useCase: string;
  monthlyUsage: string;
  pitchDeck: string;
  additionalInfo: string;
}

const fundingStages = [
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'bootstrapped', label: 'Bootstrapped' },
];

const teamSizes = [
  { value: '1-5', label: '1-5' },
  { value: '6-15', label: '6-15' },
  { value: '16-30', label: '16-30' },
  { value: '31-50', label: '31-50' },
];

// Paper gradient color schemes for startups - growth/energy themed
const heroShaderConfig = {
  colors: ["#0A0A0A", "#1a1a2e", "#FF6B35", "#16213e"],
  rotation: 220,
};

const cardShaderConfig = {
  colors: ["#000000", "#0f1419", "#FF6B35", "#1a1a2e"],
  rotation: 180,
};

const MinimalInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  hint,
}: {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <label htmlFor={name} className="block text-sm font-medium mb-2 ml-1 text-white">
        {label} {required && <span className="text-[#FF6B35]">*</span>}
      </label>
      {hint && <p className="text-xs text-white/40 mb-3 ml-1">{hint}</p>}
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
          w-full bg-white/[0.05] text-white placeholder:text-white/30
          rounded-2xl px-6 py-4 transition-all duration-300 ease-out
          border border-white/20
          focus:outline-none focus:bg-white/[0.08] focus:border-[#FF6B35]/50 focus:shadow-[0_0_30px_-5px_rgba(255,107,53,0.2)]
          ${isFocused ? 'translate-y-[-2px] border-white/40' : ''}
        `}
      />
    </div>
  );
};

const MinimalTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  hint,
  rows = 4
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  rows?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <label htmlFor={name} className="block text-sm font-medium mb-2 ml-1 text-white">
        {label} {required && <span className="text-[#FF6B35]">*</span>}
      </label>
      {hint && <p className="text-xs text-white/40 mb-3 ml-1">{hint}</p>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full bg-white/[0.05] text-white placeholder:text-white/30
          rounded-2xl px-6 py-4 transition-all duration-300 ease-out
          border border-white/20 resize-none
          focus:outline-none focus:bg-white/[0.08] focus:border-[#FF6B35]/50 focus:shadow-[0_0_30px_-5px_rgba(255,107,53,0.2)]
          ${isFocused ? 'translate-y-[-2px] border-white/40' : ''}
        `}
      />
    </div>
  );
};

const SelectPill = ({
  options,
  selected,
  onChange,
  label,
  required = false,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium ml-1 text-white">
      {label} {required && <span className="text-[#FF6B35]">*</span>}
    </label>
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            border flex items-center gap-2
            ${selected === option.value
              ? 'bg-[#FF6B35]/25 text-[#FF6B35] border-[#FF6B35]'
              : 'bg-white/[0.06] text-white border-white/20 hover:border-white/40'
            }
          `}
        >
          {selected === option.value && <Check className="w-3 h-3" />}
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div className="border-b border-white/[0.06]">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left group"
    >
      <span className="text-white font-medium group-hover:text-[#FF6B35] transition-colors">{question}</span>
      <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-white/50 text-sm leading-relaxed pb-5">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const StartupsPage = () => {
  const [formData, setFormData] = useState<FormData>({
    founderName: '',
    email: '',
    companyName: '',
    website: '',
    fundingStage: '',
    teamSize: '',
    useCase: '',
    monthlyUsage: '',
    pitchDeck: '',
    additionalInfo: ''
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const payload = {
      name: formData.founderName,
      email: formData.email,
      company: formData.companyName,
      inquiryType: 'Startup Program Application',
      message: `
**Startup Program Application**

Company: ${formData.companyName}
Website: ${formData.website || 'Not provided'}
Funding Stage: ${fundingStages.find(s => s.value === formData.fundingStage)?.label || formData.fundingStage}
Team Size: ${teamSizes.find(s => s.value === formData.teamSize)?.label || formData.teamSize}

**Use Case:**
${formData.useCase}

**Estimated Monthly Usage:**
${formData.monthlyUsage}

**Pitch Deck / Demo:**
${formData.pitchDeck || 'Not provided'}

**Additional Information:**
${formData.additionalInfo || 'None'}
      `.trim(),
      startupApplication: {
        companyName: formData.companyName,
        website: formData.website,
        fundingStage: formData.fundingStage,
        teamSize: formData.teamSize,
        useCase: formData.useCase,
        monthlyUsage: formData.monthlyUsage,
        pitchDeck: formData.pitchDeck
      }
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
      setErrorMessage('We couldn\'t submit your application. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      founderName: '',
      email: '',
      companyName: '',
      website: '',
      fundingStage: '',
      teamSize: '',
      useCase: '',
      monthlyUsage: '',
      pitchDeck: '',
      additionalInfo: ''
    });
    setFormState('idle');
  };

  const faqItems = [
    {
      question: "How much credit will I receive?",
      answer: "Up to $5,000 USD in Helios credits. The exact amount is determined based on your application, projected usage, and stage. Credits are non-transferable and cannot be exchanged for cash."
    },
    {
      question: "How long are credits valid?",
      answer: "Credits are valid for 12 months from your approval date. Unused credits expire automatically. Credits can be applied to any Helios service including inference, clusters, and training."
    },
    {
      question: "How long does the review take?",
      answer: "Applications are reviewed within 5-7 business days. Our team may request additional information or schedule a brief call to understand your use case better."
    },
    {
      question: "Who is NOT eligible?",
      answer: "Consulting firms, agencies, and companies using credits for client work are not eligible. Crypto/Web3 projects must demonstrate legitimate AI infrastructure needs beyond speculation."
    },
    {
      question: "What happens after I use the credits?",
      answer: "Graduate to standard pricing with a smooth transition. High-growth startups may qualify for extended credits or custom enterprise agreements based on usage patterns."
    },
    {
      question: "Can I apply if I've used other startup programs?",
      answer: "Yes! Using AWS Activate, Google for Startups, or similar programs doesn't disqualify you. We evaluate each application on its own merit."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF6B35] selection:text-white">
      <Navigation />

      {/* ============================================ */}
      {/* HERO + QUICK QUALIFIER                      */}
      {/* ============================================ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Paper Gradient Background */}
        <div className="absolute inset-0 opacity-40">
          <StaticMeshGradient
            width={1920}
            height={1080}
            colors={heroShaderConfig.colors}
            positions={42}
            mixing={0.38}
            waveX={0.49}
            waveXShift={0}
            waveY={1}
            waveYShift={0}
            scale={0.68}
            rotation={heroShaderConfig.rotation}
            grainMixer={0}
            grainOverlay={0.78}
            offsetX={-0.28}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 mb-8"
              >
                <Rocket className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-sm font-medium text-[#FF6B35]">Helios for Startups</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
              >
                <span className="text-[#FF6B35]">$5,000</span> in GPU Credits.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/60 font-light leading-relaxed mb-8 max-w-lg"
              >
                Power your AI startup with free infrastructure — inference, training, and dedicated clusters.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-6 text-sm text-white/40"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>5 min application</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Response in 5-7 days</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Quick Qualifier Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-[#0A0A0A] border border-white/10 rounded-[32px] p-10 relative overflow-hidden">
                {/* Card gradient accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/10 rounded-full blur-[60px]" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-6">Quick Eligibility Check</h3>
                  <p className="text-white/50 text-sm mb-8">You likely qualify if you can check all three:</p>

                  <div className="space-y-5">
                    {[
                      { icon: Building2, text: "Pre-seed to Series A (or bootstrapped with traction)" },
                      { icon: Sparkles, text: "Building an AI-native product" },
                      { icon: FileCheck, text: "Have a working prototype or MVP" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-[#FF6B35]" />
                        </div>
                        <span className="text-white/80 text-sm leading-relaxed pt-1">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/[0.06]">
                    <a
                      href="#apply"
                      className="w-full inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all hover:scale-[1.02] duration-300"
                    >
                      I Qualify — Apply Now
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VALUE PROP - 3 Primary Benefits             */}
      {/* ============================================ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 mb-4 block">What You Get</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">More Than Credits</h2>
          </motion.div>

          {/* 3 Primary Benefits - Large Cards with Paper Gradient */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: DollarSign,
                title: "$5,000 Credits",
                description: "Apply to any service — serverless inference, dedicated GPUs, or training clusters.",
                stat: "12 months",
                statLabel: "validity"
              },
              {
                icon: Zap,
                title: "Priority Access",
                description: "Skip the queue. Early access to new models and GPU availability.",
                stat: "24/7",
                statLabel: "availability"
              },
              {
                icon: Users,
                title: "Technical Support",
                description: "Direct Slack access to our engineering team for architecture guidance.",
                stat: "< 4hr",
                statLabel: "response time"
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-[320px] rounded-[24px] overflow-hidden border border-white/10 group hover:border-white/20 transition-all duration-500"
              >
                {/* Paper Gradient Background */}
                <div className="absolute inset-0 opacity-60 group-hover:opacity-70 transition-opacity duration-500">
                  <StaticMeshGradient
                    width={800}
                    height={600}
                    colors={cardShaderConfig.colors}
                    positions={42}
                    mixing={0.38}
                    waveX={0.49}
                    waveXShift={i * 0.2}
                    waveY={1}
                    waveYShift={0}
                    scale={0.68}
                    rotation={cardShaderConfig.rotation + (i * 30)}
                    grainMixer={0}
                    grainOverlay={0.78}
                    offsetX={-0.28}
                  />
                </div>

                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <span className="text-3xl font-bold text-white">{benefit.stat}</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-white/40 ml-2">{benefit.statLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secondary Benefits - Simple List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/50"
          >
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF6B35]" /> Enterprise security</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF6B35]" /> Co-marketing opportunities</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF6B35]" /> VC & partner network</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF6B35]" /> No lock-in</span>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* APPLICATION FORM                            */}
      {/* ============================================ */}
      <section id="apply" className="py-24 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-[#FF6B35]" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Application Received!</h2>
                <p className="text-xl text-white/60 font-light leading-relaxed max-w-md mx-auto mb-4">
                  We'll review your application and get back to you within 5-7 business days.
                </p>
                <p className="text-sm text-white/40 mb-12">
                  Check your email for a confirmation.
                </p>
                <button
                  onClick={resetForm}
                  className="text-sm uppercase tracking-widest text-[#FF6B35] hover:text-white transition-colors font-semibold"
                >
                  Submit another application
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-12">
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 mb-4 block">Apply Now</span>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Start Your Application</h2>
                  <p className="text-white/50 text-lg">Takes about 5 minutes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MinimalInput
                      label="Founder Name"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                    <MinimalInput
                      label="Work Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@startup.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MinimalInput
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your startup's name"
                      required
                    />
                    <MinimalInput
                      label="Website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yoursite.com"
                      hint="Landing page, GitHub, or demo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SelectPill
                      label="Funding Stage"
                      options={fundingStages}
                      selected={formData.fundingStage}
                      onChange={(v) => setFormData(prev => ({ ...prev, fundingStage: v }))}
                      required
                    />
                    <SelectPill
                      label="Team Size"
                      options={teamSizes}
                      selected={formData.teamSize}
                      onChange={(v) => setFormData(prev => ({ ...prev, teamSize: v }))}
                      required
                    />
                  </div>

                  <MinimalTextarea
                    label="What are you building?"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleChange}
                    placeholder="Describe your product and how you'll use Helios..."
                    hint="What will you use the credits for? Running models, training, fine-tuning?"
                    required
                    rows={4}
                  />

                  <MinimalTextarea
                    label="Estimated Monthly Usage"
                    name="monthlyUsage"
                    value={formData.monthlyUsage}
                    onChange={handleChange}
                    placeholder="e.g., ~500K inference requests, 2-3 training runs, etc."
                    hint="Rough estimates are fine."
                    required
                    rows={2}
                  />

                  <MinimalInput
                    label="Pitch Deck or Demo Link"
                    name="pitchDeck"
                    type="url"
                    value={formData.pitchDeck}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/... or https://loom.com/..."
                    hint="Optional but helpful."
                  />

                  <MinimalTextarea
                    label="Anything else?"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Investors, accelerators, or anything else..."
                    rows={3}
                  />

                  <div className="pt-4 flex flex-col items-center gap-4">
                    <Button
                      type="submit"
                      disabled={formState === 'loading' || !formData.fundingStage || !formData.teamSize}
                      className="w-full md:w-auto rounded-full bg-white text-black px-12 py-6 text-lg font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {formState === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    {formState === 'error' && (
                      <p className="text-red-400/80 text-sm">{errorMessage}</p>
                    )}

                    <p className="text-xs text-white/30 text-center max-w-md">
                      By submitting, you agree to our Terms of Service. We typically respond within 5-7 business days.
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ / PROGRAM DETAILS                       */}
      {/* ============================================ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 mb-4 block">Program Details</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Common Questions</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] border border-white/[0.06] rounded-[32px] p-8 md:p-12"
          >
            {faqItems.map((item, i) => (
              <FAQItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={openFAQ === i}
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StartupsPage;
