import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const FeaturedSection = () => {
  const navigate = useNavigate();

  // --- 1. TYPEWRITER LOGIC (ADDED) ---
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // You can change these words if you want!
  const words = ["~/featured-projects", "~/web-development" , "~/planned-projects", "~/data-analysis"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);
  // -----------------------------------

  // --- YOUR PROJECTS (UNCHANGED) ---
  const projects = [
    {
      title: "Coin Detection AI",
      desc: "The Coin Counter is a Python‑based desktop application that uses the YOLOv8 object‑detection model to identify, count, and calculate the total value of Hungarian Forint coins (5, 10, 50, 100, and 200 Ft) from an image, providing users with a clear visual summary through an intuitive graphical interface.",
      tag: "Computer Vision",
      color: "#f59e0b", 
      link: "https://github.com/rasuldeb25/coinDetHUF.git" 
    },
    {
      title: "Lab Buddy v2.0",
      desc: "Lab Buddy v2.0 is a Telegram bot that assists researchers and students with GROMACS molecular dynamics simulations and Linux system administration by integrating a comprehensive GROMACS toolkit, a Linux command cheat sheet, and an AI‑powered conversational interface using Google Gemini to answer complex queries and debug errors..",
      tag: "AI & Automation",
      color: "#10b981", 
      link: "https://t.me/labBuddy_bot" 
    },
    {
      title: "Vision Care Clinic",
      desc: "Vision Care Clinic is a comprehensive full‑stack web application that streamlines eye‑care facility operations by providing patients with a platform to explore services, book appointments, and manage profiles, while offering administrators tools to oversee appointments and user data..",
      tag: "Web Development",
      color: "#3b82f6", 
      link: "https://vision-care-clinic-frontend.onrender.com" 
    },
    {
      title: "Feedback Bot",
      desc: "A Python‑based Telegram bot built with the aiogram framework that enables anonymous communication by letting users generate unique referral links through which others can send anonymous messages, while allowing recipients to reply directly via the bot without ever knowing the sender’s identity.",
      tag: "Automation",
      color: "#f720d0", 
      link: "https://t.me/ricks_anon_bot?start=1545490936" 
    }
  ];

  const handleCardClick = (link) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      marginTop: '60px'
    }}>
      
      {/* --- ANIMATION STYLES (ADDED) --- */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Header Container */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        
        {/* --- TERMINAL WINDOW HEADER (NEW) --- */}
        <div style={{
          maxWidth: 'fit-content',
          margin: '0 auto 20px auto', // Centered
        }}>
          {/* The Window "Bar" (Red/Yellow/Green Dots) */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '10px',
            justifyContent: 'center',
            opacity: 0.7
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
          </div>

          {/* The Typing Text */}
          <h2 style={{ 
            fontSize: '2.2rem', 
            fontWeight: 'bold', 
            fontFamily: '"Courier New", Courier, monospace', 
            color: '#e2e8f0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ color: '#c084fc', marginRight: '10px' }}>user@portfolio:</span>
            <span style={{ color: '#22d3ee' }}>{text}</span>
            
            {/* The Blinking Cursor */}
            <span style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '28px', 
              backgroundColor: '#22d3ee',
              animation: 'blink 1s infinite'
            }}></span>
          </h2>
        </div>
        {/* ------------------------------------ */}

        {/* Subtitle / Divider Line (Kept from your code) */}
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(to right, #22d3ee, #c084fc)',
          borderRadius: '2px',
          margin: '0 auto 15px auto'
        }}></div>

        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Selected works in AI, Web Dev, and Scientific Computing.
        </p>
      </div>

      {/* Grid Layout (Kept exactly the same) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px'
      }}>
        {projects.map((item, index) => (
          <div 
            key={index}
            onClick={() => handleCardClick(item.link)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = `0 12px 40px -10px ${item.color}50`;
              e.currentTarget.style.border = `1px solid ${item.color}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.border = `1px solid ${item.color}40`;
            }}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${item.color}40`,
              borderRadius: '16px',
              padding: '28px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Tag */}
            <span style={{ 
              color: item.color, 
              backgroundColor: `${item.color}15`,
              border: `1px solid ${item.color}60`, 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              {item.tag}
            </span>

            {/* Title */}
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: '#f8fafc', 
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {item.title}
            </h3>

            {/* Description */}
            <p style={{ 
              color: '#94a3b8', 
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              {item.desc}
            </p>

            {/* "View Project" Arrow */}
            <div style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: item.color,
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              View Project <span>→</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;