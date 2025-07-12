import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} relative`}>
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle */}
        <circle cx="20" cy="20" r="19" fill="url(#gradient)" stroke="url(#gradient)" strokeWidth="2"/>
        
        {/* Event Icon - Calendar */}
        <path 
          d="M12 14h16v12H12V14zm2 2v2h12v-2H14zm0 4v6h12v-6H14z" 
          fill="white"
        />
        
        {/* Event Icon - Bell */}
        <path 
          d="M18 8c0-1.1.9-2 2-2s2 .9 2 2v2h-4V8zm-2 2h8v2h-8v-2z" 
          fill="white"
        />
        
        {/* Decorative Elements */}
        <circle cx="16" cy="16" r="1" fill="white" opacity="0.8"/>
        <circle cx="24" cy="16" r="1" fill="white" opacity="0.8"/>
        <circle cx="20" cy="20" r="1" fill="white" opacity="0.8"/>
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="50%" stopColor="#EC4899"/>
            <stop offset="100%" stopColor="#F59E0B"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo; 