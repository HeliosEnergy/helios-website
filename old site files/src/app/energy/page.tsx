import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { EnergySection } from '../components/energy-section';

export const metadata = {
  title: 'Energy - Helios',
  description: 'An energy first approach to AI. Build the future faster with clean, efficient power solutions.',
};

export default function EnergyPage() {
  return (
    <>
      <Header />
      <main>
        <EnergySection />
      </main>
      <Footer />
    </>
  );
}