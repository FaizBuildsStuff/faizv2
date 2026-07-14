'use client';

import React, { useEffect, useState, useRef } from 'react';

const HeroBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Low-velocity tracking for a luxury, fluid feel
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#09090b] overflow-hidden pointer-events-none select-none z-0"
    >
      {/* LAYER 1: ASYMMETRICAL EDITORIAL LIGHT BEAM (TRACKS MOUSE ON DESKTOP) */}
      {isMounted && (
        <div 
          className="absolute inset-0 w-full h-full transition-all duration-1000 ease-out opacity-[0.07] hidden md:block mix-blend-screen"
          style={{
            background: `radial-gradient(ellipse 60vw 40vh at ${mousePos.x}px ${mousePos.y}px, #ffffff 0%, transparent 100%)`,
          }}
        />
      )}

      {/* LAYER 2: VOLUMETRIC STUDIO CORE FLARE (PERMANENT TOP-LEFT ACCENT FOR CRISP TEXT CONTRAST) */}
      <div 
        className="absolute w-[120vw] h-[60vh] md:w-[50vw] md:h-[50vh] rounded-full blur-[90px] md:blur-[120px] opacity-[0.09] md:opacity-[0.06] will-change-transform"
        style={{
          top: '-15%',
          left: '-10%',
          background: 'radial-gradient(circle at center, #ffffff 0%, transparent 75%)',
        }}
      />

      {/* LAYER 3: LINEAR LIGHT STRIP (ADDS ARCHITECTURAL DEPTH WITHOUT USING GRIDS) */}
      <div 
        className="absolute top-0 left-[10%] md:left-[25%] w-[1px] h-[40vh] opacity-[0.03] bg-gradient-to-b from-white to-transparent" 
      />

      {/* LAYER 4: LUXURY VIGNETTE LAYER TO KEEP TEXT RENDERED PERFECTLY */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at 70% 30%, transparent 30%, #09090b 90%)',
        }}
      />
      
    </div>
  );
};

export default HeroBackground;