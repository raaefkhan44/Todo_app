'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import UpdatedHeroSection from '@/components/landing/UpdatedHeroSection';
import UpdatedFeaturesSection from '@/components/landing/UpdatedFeaturesSection';
import UpdatedHowItWorksSection from '@/components/landing/UpdatedHowItWorksSection';
import UpdatedStatsSection from '@/components/landing/UpdatedStatsSection';
import UpdatedTestimonialsSection from '@/components/landing/UpdatedTestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FaqSection from '@/components/landing/FaqSection';
import UpdatedCTASection from '@/components/landing/UpdatedCTASection';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <UpdatedHeroSection />
        <UpdatedFeaturesSection />
        <UpdatedHowItWorksSection />
        <UpdatedStatsSection />
        <UpdatedTestimonialsSection />
        <PricingSection />
        <FaqSection />
        <UpdatedCTASection />
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;