import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loader2 } from 'lucide-react';

// IMPORTANT: Replace this with your actual Cloudflare Worker URL after deployment
const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";

// --- VISUAL CONSTANTS ---
const EMBER_GLOW = "radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, transparent 60%)";

type FormState = 'idle' | 'loading' | 'success' | 'error';

// --- COMPONENTS ---

const MinimalInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoFocus = false
}: {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <label 
        htmlFor={name} 
        className={`block text-sm font-medium transition-colors duration-300 mb-3 ml-6 ${
          isFocused ? 'text-white' : 'text-white/40 group-hover:text-white/60'
        }`}
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
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-white/[0.03] text-white text-lg placeholder:text-white/10
            rounded-full px-8 py-4 transition-all duration-300 ease-out
            border border-transparent
            focus:outline-none focus:bg-white/[0.06] focus:shadow-[0_0_30px_-5px_rgba(255,107,53,0.1)]
            ${isFocused ? 'translate-y-[-2px]' : ''}
          `}
        />
        {/* Subtle inner shadow top highlight to create depth */}
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
  required = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <label 
        htmlFor={name} 
        className={`block text-sm font-medium transition-colors duration-300 mb-3 ml-6 ${
          isFocused ? 'text-white' : 'text-white/40 group-hover:text-white/60'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={5}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-white/[0.03] text-white text-lg placeholder:text-white/10
            rounded-[32px] px-8 py-6 transition-all duration-300 ease-out
            border border-transparent resize-none
            focus:outline-none focus:bg-white/[0.06] focus:shadow-[0_0_30px_-5px_rgba(255,107,53,0.1)]
            ${isFocused ? 'translate-y-[-2px]' : ''}
          `}
        />
        <div className="absolute inset-0 rounded-[32px] pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />
      </div>
    </div>
  );
};

const TopicPill = ({ 
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
      relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
      border
      ${isSelected 
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
        : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white/80'
      }
    `}
  >
    {label}
  </button>
);

// --- MAIN PAGE ---

const ContactPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '', 
    topic: 'Infrastructure' 
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const topics = ['Infrastructure', 'Partnership', 'Support', 'Press', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    // Payload adapted for the worker
    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      inquiryType: formData.topic,
      // Default placeholder fields to maintain worker compatibility if needed
      company: "Not specified", 
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

      // Smooth transition to success
      setTimeout(() => setFormState('success'), 800);

    } catch (error) {
      setFormState('error');
      setErrorMessage('We couldn’t connect. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF6B35] selection:text-white overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow relative flex items-center justify-center py-32 px-6">
        
        {/* Ambient Lighting - The "Paper" Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] max-w-[1000px] max-h-[1000px] pointer-events-none z-0">
          <div 
            className="w-full h-full opacity-40 blur-[100px] rounded-full transition-opacity duration-1000"
            style={{ background: EMBER_GLOW }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[640px] mx-auto">
          
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-20"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Received.</h2>
                <p className="text-xl text-white/60 font-light leading-relaxed max-w-md mx-auto">
                  We'll be in touch shortly to discuss your infrastructure needs.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData({ name: '', email: '', message: '', topic: 'Infrastructure' });
                    setFormState('idle');
                  }}
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
                <div className="text-center mb-20">
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
                    Whether you need a single H100 or a custom cluster, we are here to help you deploy.
                  </motion.p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-12">
                  
                  <div className="space-y-8">
                    <MinimalInput 
                      label="Who are we speaking with?" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Your name"
                      required
                    />
                    
                    <MinimalInput 
                      label="Where should we send the reply?" 
                      name="email" 
                      type="email"
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  {/* Topics - Conversational Selector */}
                  <div className="space-y-4 ml-6">
                    <span className="block text-sm font-medium text-white/40">What are you looking for?</span>
                    <div className="flex flex-wrap gap-3">
                      {topics.map(topic => (
                        <TopicPill 
                          key={topic}
                          label={topic}
                          isSelected={formData.topic === topic}
                          onClick={() => setFormData(prev => ({ ...prev, topic }))}
                        />
                      ))}
                    </div>
                  </div>

                  <MinimalTextarea 
                    label="Tell us about your infrastructure needs." 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="We're looking to deploy..."
                  />

                  {/* Actions */}
                  <div className="pt-8 flex flex-col items-center gap-6">
                    <button
                      type="submit"
                      disabled={formState === 'loading'}
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
