import React from 'react';

// Define your links here directly so we don't depend on an external constant file
const SOCIAL_LINKS = [
  { platform: 'GitHub', url: 'https://github.com/rasuldeb25'},
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/rasulbek-mashalov-99058625a/' },
  { platform: 'Google Scholar', url: 'https://scholar.google.com/citations?user=_DBudx8AAAAJ&hl=ru&authuser=1' }, 
  { platform: 'ORCID', url: 'https://orcid.org/0009-0004-3806-164X' }
];

export const Footer: React.FC = () => {
  const getIconPath = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'github':
        return <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
      case 'linkedin':
        return <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
      case 'google scholar':
        return (
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M2 10l10-5 10 5-10 5-10-5z" />
                <path d="M6 12v5c0 0 2 3 6 3s6-3 6-3v-5" />
            </g>
        );
      case 'orcid':
        return (
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
             <circle cx="12" cy="12" r="10" />
             <path d="M10 9v6" />
             <path d="M14 9a2 2 0 0 1 0 4h-2V9h2z" />
            </g>
        );
      default:
        return <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>;
    }
  };

  return (
    <footer className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 py-12 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-8 tracking-tight">
            Let's Connect
        </h3>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
            {SOCIAL_LINKS.map((link) => (
                <a 
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                >
                    <div className="p-3 bg-slate-900 rounded-full border border-slate-800 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            {getIconPath(link.platform)}
                        </svg>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 whitespace-nowrap">
                        {link.platform}
                    </span>
                </a>
            ))}
        </div>

        <div className="text-sm text-slate-500 font-mono mt-4">
           <p className="mb-2">Rasulbek Mashalov</p>
           <p className="text-xs opacity-70 italic">MSc Computer Science Engineering Student</p>
        </div>

      </div>
    </footer>
  );
};