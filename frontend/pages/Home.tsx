import React from 'react';
// Make sure these paths match where you actually saved the files!
import HeroSection from '../components/HeroSection'; 
import FeaturedSection from '../components/FeaturedSection'; 

export const Home = () => {
  return (
    <div className="relative z-10">
      {/* 1. The Hero (Top part) */}
      <HeroSection />
      
      {/* 2. The Projects (Middle part) */}
      <FeaturedSection />
    </div>
  );
};

export default Home;