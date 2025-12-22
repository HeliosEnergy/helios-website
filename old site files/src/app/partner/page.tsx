import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { PartnerSection } from '../components/partner-section';

export const metadata = {
  title: 'Partner with us - Helios',
  description: 'Join the Helios partner ecosystem. Grow your business with clean energy solutions for AI and high-performance computing.',
};

export default function PartnerPage() {
  return (
    <>
      <Header />
      <main>
        <PartnerSection />
      </main>
      <Footer />
    </>
  );
}