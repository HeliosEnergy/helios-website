import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
// import { PartnerSection } from '@/components/partner'; // HIDDEN - minimal placeholder until content is ready

const PartnerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Partner Program
          </h1>
          <p className="text-xl text-gray-400">
            Coming soon. For partnership inquiries, please contact us at{' '}
            <a href="mailto:partners@helios.ai" className="text-primary hover:underline">
              partners@helios.ai
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnerPage;
