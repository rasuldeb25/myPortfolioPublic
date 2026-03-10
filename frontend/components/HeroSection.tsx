import React, { useState, useEffect } from 'react'; // Added hooks
import { useNavigate } from 'react-router';
import { API_URL } from '../src/config';

const HeroSection = () => {
  const navigate = useNavigate();
  
  // 1. STATE: To hold the data we get from the backend
  const [latestPost, setLatestPost] = useState(null);

  // 2. EFFECT: Fetch the data when the page loads
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(data => {
        // If we got a list of posts, take the first one (newest)
        if (Array.isArray(data) && data.length > 0) {
          setLatestPost(data[0]);
        }
      })
      .catch(err => console.error("Failed to fetch latest post:", err));
  }, []);

  return (
    <section 
      className="flex flex-col justify-center items-center"
      style={{ paddingTop: '100px', paddingBottom: '20px' }}
    >
      <style>{`
        @keyframes breathe {
          0% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.1); border-color: rgba(34, 211, 238, 0.3); transform: scale(1); }
          50% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.4); border-color: rgba(34, 211, 238, 0.8); transform: scale(1.02); }
          100% { box-shadow: 0 0 5px rgba(34, 211, 238, 0.1); border-color: rgba(34, 211, 238, 0.3); transform: scale(1); }
        }
      `}</style>

      {/* --- AUTOMATIC NOTIFICATION PILL --- */}
      {/* Only show this if we successfully found a post! */}
      {latestPost && (
        <div 
          onClick={() => navigate(`/blog/${latestPost.id}`)} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 20px',
            borderRadius: '50px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            cursor: 'pointer',
            marginBottom: '30px',
            animation: 'breathe 3s infinite ease-in-out',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = 'none';
            e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
            e.currentTarget.style.borderColor = '#22d3ee';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animation = 'breathe 3s infinite ease-in-out';
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.6)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔔</span>
          
          <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>
            <span style={{ color: '#22d3ee' }}>New:</span> 
            {' ' + latestPost.title}
          </span>

          <span style={{ color: '#94a3b8', fontSize: '0.9rem', marginLeft: '5px' }}>→</span>
        </div>
      )}

      {/* Title */}
      <div className="text-center z-10 px-4">
        <h1 
          className="text-5xl md:text-7xl font-bold mb-4"
          style={{
            background: 'linear-gradient(to right, #22d3ee, #3b82f6, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
        >
          Welcome to My Portfolio
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed"> 
          I'm a <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>Master's student</span> in{' '}
          <span style={{ color: '#c084fc', fontWeight: 'bold' }}>Computer Science Engineering</span>, 
          passionate about learning scientific computing, and data analysis in life-science subjects. 
          Explore my work and tools below.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          
          {/* Button 1: XVG Tool */}
          <button
            onClick={() => navigate('/xvg-tool')}
            className="group relative px-8 py-4 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 
                       text-cyan-100 font-bold text-lg rounded-xl backdrop-blur-md transition-all duration-300 
                       transform hover:scale-105 hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">Try XVG Tool</span>
            <span className="text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
              🚀
            </span>
          </button>

          {/* Button 2: About Me */}
          <button
            onClick={() => navigate('/about')}
            className="group px-8 py-4 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 
                       text-purple-100 font-bold text-lg rounded-xl backdrop-blur-md transition-all duration-300 
                       transform hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] flex items-center gap-3"
          >
            <span className="relative z-10">About Me</span>
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12 origin-bottom-right">
              👋
            </span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;