'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { track } from '@vercel/analytics';

// IMPORTANT: Replace this with your actual Cloudflare Worker URL after deployment
const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";

type FormState = 'idle' | 'loading' | 'success' | 'error';
type UseCase = 'Baremetal GPU' | 'Media Generation' | 'Inference' | '';

// --- USE CASE DATA ---
const useCaseData = [
  {
    id: 'baremetal' as const,
    name: 'Baremetal GPU',
    description: 'Full control over dedicated GPU infrastructure.',
    image: '/contact/rack.jpeg',
    animationType: 'baremetal' as const
  },
  {
    id: 'media' as const,
    name: 'Media Generation',
    description: 'AI-powered image and video creation.',
    image: '/contact/imagegen.jpeg',
    animationType: 'media' as const
  },
  {
    id: 'inference' as const,
    name: 'Inference',
    description: 'Deploy and scale AI models efficiently.',
    image: '/contact/inference.jpeg',
    animationType: 'inference' as const
  }
];

// --- CARD COMPONENT ---
const UseCaseCard = ({ 
  useCase, 
  isActive, 
  isHovered, 
  onClick 
}: {
  useCase: typeof useCaseData[0];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative h-96 rounded-sm cursor-pointer overflow-hidden transition-all duration-300 ${
        isActive ? 'ring-2 ring-[#FBBF24]' : 'ring-1 ring-gray-300'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Image with Opacity */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
          isActive || isHovered ? 'opacity-70' : 'opacity-90'
        }`}
        style={{ backgroundImage: `url(${useCase.image})` }}
      />
      
      {/* Overlay for better text visibility */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isActive || isHovered ? 'bg-black/40' : 'bg-black/30'
      }`} />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-funnel-display)' }}>
          {useCase.name}
        </h3>
        <p className={`text-lg transition-colors duration-300 ${
          isActive || isHovered ? 'text-[#FBBF24]' : 'text-white'
        }`}>
          {useCase.description}
        </p>
      </div>
    </motion.div>
  );
};

// --- INPUT FIELD COMPONENT ---
const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false 
}: {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`absolute transition-all duration-200 ease-in-out pointer-events-none ${
          isFocused || hasValue
            ? 'top-[-10px] left-2 text-sm text-orange-600 bg-white px-1'
            : 'top-3 left-4 text-gray-500'
        }`}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={4}
          className="w-full px-4 py-3 bg-transparent border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          style={{ fontFamily: 'var(--font-darker-grotesque)' }}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 bg-transparent border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          style={{ fontFamily: 'var(--font-darker-grotesque)' }}
        />
      )}
    </div>
  );
};

// --- MAIN CONTACT COMPONENT ---
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '', gpuCount: 500 });
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGpuCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, gpuCount: Math.min(Math.max(value, 1), 20000) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill out name and email.');
      setFormState('error');
      return;
    }

    // Track form submission event
    track('Contact Form Submitted', {
      useCase: selectedUseCase || 'General Inquiry',
      hasCompany: !!formData.company,
      hasMessage: !!formData.message
    });

    // Construct the message to include GPU count when Baremetal GPU is selected
    let message = formData.message;
    if (selectedUseCase === 'Baremetal GPU') {
      message = `GPU Count Requested: ${formData.gpuCount}\n\n${formData.message}`;
    }

    // 1. Construct the payload to send to the worker
    const payload = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      message: message,
      inquiryType: selectedUseCase || 'General Inquiry',
      ...(selectedUseCase === 'Baremetal GPU' && {
        gpuDetails: {
          model: 'Not specified', // This can be enhanced later if needed
          count: formData.gpuCount,
        },
      }),
    };

    // 2. Use a try...catch block to make the fetch request and handle outcomes
    try {
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If the server responds with an error, handle it
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown network error occurred.');
      }

      // If the request is successful, update the state
      setFormState('success');
      
      // Reset form
      setFormData({ name: '', company: '', email: '', message: '', gpuCount: 500 });
      setSelectedUseCase('');

    } catch (error: unknown) {
      // If the fetch itself fails or an error is thrown, handle it
      setFormState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.7}}>
            <h1 className="text-5xl md:text-6xl font-normal text-center mb-4" style={{ fontFamily: 'var(--font-funnel-display)' }}>
              Let&#39;s Build Together
            </h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Select an area of interest to begin, or fill out the form for general inquiries. Our team is ready to connect.
            </p>
          </motion.div>

          {/* Use Case Cards - Now above the form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {useCaseData.map((useCase) => (
              <UseCaseCard
                key={useCase.id}
                useCase={useCase}
                isActive={selectedUseCase === useCase.name}
                isHovered={false}
                onClick={() => {
                  // Track use case selection
                  track('Use Case Selected', {
                    useCase: useCase.name
                  });
                  setSelectedUseCase(selectedUseCase === useCase.name ? '' : useCase.name as UseCase);
                }}
              />
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-3xl font-bold mb-4">Connection Established</h2>
                <p className="text-lg text-gray-700">Thank you. We&#39;ve received your message and will be in touch at lightspeed.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <AnimatePresence>
                  {selectedUseCase === 'Baremetal GPU' && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                      <label htmlFor="gpuCount" className="block text-lg font-semibold text-black mb-4">
                        Number of GPUs
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          id="gpuCount"
                          name="gpuCount"
                          min="1" max="20000"
                          value={formData.gpuCount} onChange={handleGpuCountChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-helios"
                        />
                        <input
                          type="number"
                          min="1"
                          max="20000"
                          value={formData.gpuCount}
                          onChange={handleGpuCountChange}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBBF24] transition-shadow text-gray-800 placeholder-gray-800 font-bold"
                          style={{ fontFamily: 'var(--font-darker-grotesque)' }}
                          onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <InputField label="Name *" name="name" value={formData.name} onChange={handleChange} required />
                  <InputField label="Company" name="company" value={formData.company} onChange={handleChange} />
                </div>
                <InputField label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <InputField label="Message" name="message" type="textarea" value={formData.message} onChange={handleChange} />

                <div className="pt-4 text-left">
                  <button type="submit" disabled={formState === 'loading'} className="contact-button">
                    {formState === 'loading' ? 'Connecting...' : 'Contact →'}
                  </button>
                </div>
                {formState === 'error' && (
                  <div className="p-3 text-center text-red-800 bg-red-100 border border-red-200 rounded-md">
                    {errorMessage}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        .range-thumb-helios::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px;
          background: #FBBF24; cursor: pointer; border-radius: 50%;
          border: 4px solid white; box-shadow: 0 0 10px rgba(251, 191, 36, 0.7);
        }
        .contact-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: black;
          background-color: #FBBF24; /* amber-400 */
          border: none;
          border-radius: 0.25rem; /* Minimal rounded corners */
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .contact-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }
        .contact-button:disabled {
          background-color: #9CA3AF;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </>
  );
};

export default Contact;