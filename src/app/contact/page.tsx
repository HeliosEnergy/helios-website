
'use client';

import React, { useState } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// IMPORTANT: Replace this with your actual Cloudflare Worker URL after deployment
const CLOUDFLARE_WORKER_URL = "https://your-worker-url.workers.dev";

type FormState = 'idle' | 'loading' | 'success' | 'error';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
    gpuCount: 30,
  });
  const [selectedUseCase, setSelectedUseCase] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUseCaseSelect = (useCase: string) => {
    if (selectedUseCase === useCase) {
      setSelectedUseCase('');
    } else {
      setSelectedUseCase(useCase);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill out all required fields.');
      setFormState('error');
      return;
    }

    const payload = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      message: formData.message,
      inquiryType: selectedUseCase || 'General',
      ...(selectedUseCase === 'Baremetal GPU' && {
        gpuDetails: {
          model: 'Not specified', // You can add a selector for this later
          count: formData.gpuCount,
        },
      }),
    };

    try {
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

      setFormState('success');
      // Reset form
      setFormData({ name: '', company: '', email: '', message: '', gpuCount: 30 });
      setSelectedUseCase('');
    } catch (error: any) {
      setFormState('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again later.');
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-normal text-black mb-10 text-center" style={{ fontFamily: 'var(--font-funnel-display)' }}>
            Contact Us
          </h1>

          <div className="mb-12">
            <h2 className="text-2xl font-normal text-black mb-6 text-center" style={{ fontFamily: 'var(--font-funnel-display)' }}>
              What are you looking for?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Baremetal GPU', 'Media Generation', 'Inference'].map((useCase) => (
                <button
                  key={useCase}
                  type="button"
                  onClick={() => handleUseCaseSelect(useCase)}
                  className={`p-6 border-2 text-left transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fbbf24] ${
                    selectedUseCase === useCase
                      ? 'border-[#fbbf24] bg-[#fbbf24]/10 shadow-lg'
                      : 'border-gray-300 hover:border-gray-500 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-black mb-2">{useCase}</h3>
                  <p className="text-gray-800 text-sm">
                    {useCase === 'Baremetal GPU' && 'Full control over dedicated GPU infrastructure'}
                    {useCase === 'Media Generation' && 'AI-powered image and video creation'}
                    {useCase === 'Inference' && 'Deploy and scale AI models'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedUseCase === 'Baremetal GPU' && (
            <div className="mb-12 p-6 rounded-md bg-yellow-300/50">
              <div className="flex items-center">
                <label htmlFor="gpuCount" className="text-xl font-semibold text-black mr-4">
                  Number of GPUs
                </label>
                <input
                  type="number"
                  id="gpuCount"
                  name="gpuCount"
                  min="1"
                  max="20000"
                  value={formData.gpuCount}
                  onChange={handleChange}
                  className="w-24 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-shadow bg-transparent text-black placeholder-gray-800"
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg mb-2 text-black">Name *</label>
              <input
                type="text" id="name" name="name" required
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-shadow"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-lg mb-2 text-black">Company</label>
              <input
                type="text" id="company" name="company"
                value={formData.company} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-shadow"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg mb-2 text-black">Email *</label>
              <input
                type="email" id="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-shadow"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg mb-2 text-black">Message</label>
              <textarea
                id="message" name="message" value={formData.message}
                onChange={handleChange} rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-shadow"
                placeholder="Tell us more about your project, timeline, or specific requirements..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={formState === 'loading'}
                className="px-8 py-3 bg-[#fbbf24] text-black font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fbbf24] transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {formState === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            
            {formState === 'success' && (
              <div className="p-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-md">
                Message sent successfully! We'll be in touch soon.
              </div>
            )}
            {formState === 'error' && (
              <div className="p-4 text-center text-red-800 bg-red-100 border border-red-200 rounded-md">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
