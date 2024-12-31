import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import KeyBenefits from '../components/KeyBenefits';
import PricingSection from '../components/PricingSection';
import CommunitySection from '../components/CommunitySection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const StoreLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="space-y-20 py-20">
      <HeroSection />
      <KeyBenefits />
      <PricingSection />
      <CommunitySection />
      <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLandingPage;