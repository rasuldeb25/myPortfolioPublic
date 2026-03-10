import React from 'react';
import { Link, useLocation } from 'react-router';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "bg-slate-800 text-cyan-400 border-cyan-500/50" 
    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50";

  return (
    <nav className="bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800 py-3 px-6 flex justify-center items-center sticky top-0 z-50">
      
      {/* Navigation Links */}
      <div className="flex items-center gap-2">
        
        {/* Pass the string path directly */}
        <NavLink to="/" icon="/icons/home.svg" label="Home" activeClass={isActive('/')} />
        <NavLink to="/cv" icon="/icons/cv.svg" label="CV" activeClass={isActive('/cv')} />
        <NavLink to="/xvg-tool" icon="/icons/tool.svg" label="XVG Tool" activeClass={isActive('/xvg-tool')} />
        <NavLink to="/blog" icon="/icons/blog.svg" label="Blog" activeClass={isActive('/blog')} />

      </div>
    </nav>
  );
}

const NavLink = ({ to, icon, label, activeClass }: any) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 group ${activeClass}`}
  >
    {/* img src just works because it looks in the public folder */}
    <img src={icon} alt={label} className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
    
    <span className="text-sm font-semibold tracking-wide uppercase hidden md:block">
      {label}
    </span>
  </Link>
);