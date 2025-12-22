'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import { track } from '@vercel/analytics';

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  availablePower: string;
  notes: string;
}

const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    availablePower: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToCloudflareWorker = async (formData: FormData) => {
    try {
      // Create FormData object
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("company", formData.company);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("location", formData.location);
      formPayload.append("availablePower", formData.availablePower);
      formPayload.append("notes", formData.notes);
      
      // Send form data to Cloudflare Worker
      const response = await fetch("https://helios-power-plant-contact-form.helios-energy.workers.dev/plant_contact_submission", {
        method: "POST",
        body: formPayload
      });
      
      // Get the response text first for debugging
      const responseText = await response.text();
      
      // Parse the JSON manually
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Invalid response from server. Please try again.");
      }
      
      // Check if the result has the success property and it's true
      if (result && result.success === true) {
        return { success: true, message: "Thank you, we'll reach out shortly." };
      } else {
        // Show error message from the server or a default
        throw new Error(result && result.message ? result.message : "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      throw new Error(error instanceof Error ? error.message : "Connection error. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hide any previous status message
    setSubmitStatus(null);
    
    if (validateForm()) {
      // Track partner form submission
      track('Partner Form Submitted', {
        hasPhone: !!formData.phone,
        hasLocation: !!formData.location,
        hasAvailablePower: !!formData.availablePower,
        hasNotes: !!formData.notes
      });
      
      setIsSubmitting(true);
      try {
        const result = await submitToCloudflareWorker(formData);
        setSubmitStatus({ message: result.message, isSuccess: result.success });
        
        // Reset form on success
        if (result.success) {
          setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            location: '',
            availablePower: '',
            notes: ''
          });
        }
      } catch (error) {
        setSubmitStatus({ 
          message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.", 
          isSuccess: false 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full bg-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-black mb-4">
            Contact us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get in touch to discuss partnership opportunities.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-sm text-base text-black focus:outline-none focus:ring-1 transition-colors ${
                    errors.name 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-gray-300 focus:ring-gray-400'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-sm text-base text-black focus:outline-none focus:ring-1 transition-colors ${
                    errors.company 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-gray-300 focus:ring-gray-400'
                  }`}
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-sm text-base text-black focus:outline-none focus:ring-1 transition-colors ${
                    errors.email 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-gray-300 focus:ring-gray-400'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Available Power
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 kW"
                  value={formData.availablePower}
                  onChange={(e) => handleInputChange('availablePower', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-sm text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                placeholder="Tell us about your requirements..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-base text-black focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors resize-vertical"
              />
            </div>

            {/* Status Message */}
            {submitStatus && (
              <div 
                className={`mb-6 p-4 rounded-sm text-center font-bold ${
                  submitStatus.isSuccess 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                <span className="mr-2 text-lg">
                  {submitStatus.isSuccess ? '✓' : '✗'}
                </span>
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button 
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-sm"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactFormSection;