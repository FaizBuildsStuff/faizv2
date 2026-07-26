'use client'

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import DiscordProfile from '@/components/discord-profile';

const MainFirstPage = () => {
  const [time, setTime] = useState({ hrs: '12', mins: '43', secs: '38' });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // High-frequency clock tick engine
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime({
        hrs: String(now.getHours()).padStart(2, '0'),
        mins: String(now.getMinutes()).padStart(2, '0'),
        secs: String(now.getSeconds()).padStart(2, '0'),
      });
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP 3D Asymmetrical Kinetic Entrance Choreography
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Ambient lighting glow gentle reveal
      gsap.fromTo(glowRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }
      );

      // 2. Main title explosive scale & letter reveal
      gsap.fromTo(titleTextRef.current,
        { 
          opacity: 0, 
          y: 60, 
          skewY: 3,
          filter: "blur(12px)" 
        },
        { 
          opacity: 1, 
          y: 0, 
          skewY: 0,
          filter: "blur(0px)", 
          duration: 1.15, 
          ease: "power3.out",
          delay: 0.1 
        }
      );

      // 3. Dot kinetic pulse arrival
      gsap.fromTo(dotRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(2.2)", delay: 0.85 }
      );

      // 4. Tagline clean slide-up
      gsap.fromTo(taglineRef.current,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power2.out", delay: 0.6 }
      );

      // 5. Right sidebar metadata staggered dashboard reveal
      gsap.fromTo(rightSidebarRef.current ? rightSidebarRef.current.children : [],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.12, delay: 0.75 }
      );

      // 6. Footer bar rise
      if (footerRef.current) {
        gsap.fromTo(footerRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.1 }
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative z-10 w-full min-h-screen bg-[#09090b] text-[#8a8a8e] select-none font-sans overflow-hidden flex flex-col justify-between p-6 sm:p-12 lg:p-16"
    >
      
      {/* Background Subtle Ambient Radial Lighting */}
      <div 
        ref={glowRef}
        className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-radial from-white/10 to-transparent blur-[80px] pointer-events-none z-0 mix-blend-screen hidden lg:block"
      />

      {/* Top Header Placeholder Structure */}
      <div className="h-6 w-full z-10" />

      {/* ASYMMETRIC CANVAS MATRIX */}
      <div className="w-full flex-1 flex flex-col lg:grid lg:grid-cols-12 items-stretch relative z-10 py-8 lg:py-0">
        
        {/* LEFT FOCUS ZONE: Massive Typographic Column Block */}
        <div className="lg:col-span-9 flex flex-col justify-end items-start h-full pt-16 lg:pt-0">
          
          {/* Changed inline-block to w-fit so container wraps the text dimensions tightly */}
          <div className="relative p-1 mb-3 sm:mb-4 group w-fit max-w-full">
            <div className="block">
              <h1 
                ref={titleTextRef}
                className="text-[10vw] sm:text-[9.5vw] md:text-[8.5vw] lg:text-[140px] xl:text-[165px] font-black tracking-tighter sm:tracking-[-0.04em] text-[#f4f4f5] leading-none select-text font-sans antialiased will-change-transform drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] pb-2"
              >
                cryptovoid.ex
              </h1>
            </div>

            {/* FIXED spacing parameters: dot is pinned right next to the letter 'x' cleanly */}
            <span 
              ref={dotRef}
              className="absolute bottom-[16%] -right-2 sm:-right-3 lg:-right-4 w-[2vw] h-[2vw] min-w-[8px] min-h-[8px] max-w-[20px] max-h-[20px] rounded-full bg-[#ef5350] shadow-[0_0_35px_rgba(239,83,80,0.65)] will-change-transform transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
          
          {/* Tagline baseline descriptive structure */}
          <div className="pl-1 max-w-lg">
            <p 
              ref={taglineRef}
              className="text-[#52525b] hover:text-[#a1a1aa] transition-colors duration-500 text-xs sm:text-[13px] font-mono tracking-wider font-normal lowercase select-text will-change-transform leading-relaxed"
            >
              sixteen-year-old developer turning seventeen on 22 dec 2026
            </p>
          </div>
        </div>

        {/* RIGHT FOCUS ZONE: Detached Floating Metadata Dashboard Module */}
        <div 
          ref={rightSidebarRef}
          className="lg:col-span-3 flex flex-col items-start lg:items-end justify-end text-left lg:text-right gap-6 font-mono text-[10px] sm:text-[11px] tracking-widest text-[#3f3f46] mt-12 sm:mt-16 lg:mt-0 w-full pb-1 pl-1 lg:pl-0 will-change-transform"
        >
          {/* LIVE DISCORD LANYARD PROFILE WIDGET */}
          <DiscordProfile userId="1071193261579976784" />

          {/* Glass Card Dynamic Clock UI Accent */}
          <div className="flex flex-col gap-1.5 w-full lg:w-auto items-start lg:items-end">
            <div className="flex items-baseline gap-0.5 select-text">
              <span className="text-4xl sm:text-[46px] font-thin text-[#fafafa] tracking-tighter font-sans leading-none">
                {time.hrs}:{time.mins}
              </span>
              <span className="text-xs sm:text-sm font-light text-[#27272a] font-mono ml-1">
                {time.secs}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#27272a] font-sans font-bold pl-0.5 lg:pr-0.5">
              local time zone
            </span>
          </div>

          <div className="h-[1px] w-full lg:w-16 bg-gradient-to-r lg:bg-gradient-to-l from-[#18181b] to-transparent" />

          <div className="flex flex-col gap-1.5 lowercase">
            <span className="text-[#27272a]">located in pakistan</span>
            <span className="text-[#a1a1aa] font-medium bg-[#18181b]/60 border border-[#27272a]/40 rounded-full px-2.5 py-0.5 backdrop-blur-md inline-block mt-0.5 w-fit">
              • do not disturb
            </span>
          </div>

          <div className="flex flex-col gap-1 lowercase text-[#27272a] leading-relaxed max-w-[240px] lg:max-w-[200px]">
            <p>probably doing nothing,</p>
            <p>or maybe something</p>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default MainFirstPage;