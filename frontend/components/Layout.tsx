import React from 'react';
import { useLocation, Outlet } from 'react-router';
import Navbar from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavbar = ["/admin", "/admin/dashboard"].includes(location.pathname);
  
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Background Video */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black m-0 p-0 z-[-1]">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hero-simulation.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>
      </div>

      {!hideNavbar && <Navbar />} 

    
      <main className={`flex-grow z-10 relative ${isHome ? 'w-full' : 'container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl'}`}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};