'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { RiBarChart2Line, RiCompassDiscoverLine, RiTimeLine } from 'react-icons/ri';
import HeroBackground from '@/components/hero-background';

export default function StatsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top section entry reveal
      gsap.fromTo('.reveal-intro',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      // Stagger expansion for metrics cards
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 25 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out', 
          stagger: 0.06, 
          delay: 0.15 
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] font-satoshi selection:bg-zinc-800 overflow-x-hidden">
      
      {/* IMMERSED OPTICAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      <main className="relative z-10 px-6 pt-28 pb-32 sm:px-12 md:px-16 max-w-[1400px] mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* HEADER BLOCK */}
        <div className="w-full flex justify-between items-baseline border-b border-zinc-900 pb-5 reveal-intro">
          <div className="flex items-center gap-2 text-[13px] text-zinc-400 font-medium lowercase tracking-wide">
            <RiBarChart2Line className="text-zinc-500 text-sm" />
            <span>real-time analytics</span>
          </div>
          <span className="text-[12px] sm:text-[13px] text-zinc-500 font-mono tracking-tight">
            updated live
          </span>
        </div>

        {/* INTRO TITLE STATEMENT */}
        <div className="reveal-intro flex flex-col gap-2 max-w-xl">
          <h1 className="text-3xl font-black tracking-tight text-zinc-100 lowercase">statistics</h1>
          <p className="text-[13px] sm:text-[14px] text-zinc-400 font-medium leading-relaxed lowercase">
            a simple transparent look at my current design output, system configurations, and project velocity metrics.
          </p>
        </div>

        {/* SECTION 1: CORE TELEMETRY METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { label: 'total projects built', value: '42' },
            { label: 'production commits', value: '1,840' },
            { label: 'ui design hours', value: '720+' },
            { label: 'coffee consumed', value: '∞' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="stat-card group bg-zinc-900/10 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-1 hover:border-zinc-800/80 transition-all duration-300"
            >
              <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider group-hover:text-zinc-500 transition-colors">
                // {stat.label}
              </span>
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* SECTION 2: ASYMMETRICAL COMPARISON MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full pt-4">
          
          {/* LEFT SUBGRID: SYSTEM FOCUS PATTERNS */}
          <div className="stat-card md:col-span-7 flex flex-col gap-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-3">
              <RiCompassDiscoverLine className="text-zinc-500 text-base" />
              <span className="text-[13px] font-mono text-zinc-400 lowercase">// focus metrics</span>
            </div>
            
            <div className="flex flex-col gap-4 w-full">
              {[
                { name: 'frontend engineering (next.js / react)', ratio: '85%' },
                { name: 'ui/ux layout design (figma)', ratio: '70%' },
                { name: 'motion & micro-interactions (gsap)', ratio: '60%' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between items-baseline text-[12px] sm:text-[13px] text-zinc-400 font-medium lowercase">
                    <span>{item.name}</span>
                    <span className="font-mono text-zinc-500">{item.ratio}</span>
                  </div>
                  {/* Premium customized progress rule track */}
                  <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-700 rounded-full origin-left opacity-80 group-hover:opacity-100 transition-opacity" 
                      style={{ width: item.ratio }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SUBGRID: HARDWARE / PREFERENCES METADATA */}
          <div className="stat-card md:col-span-5 flex flex-col gap-6 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6 sm:p-8 w-full">
            <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-3">
              <RiTimeLine className="text-zinc-500 text-base" />
              <span className="text-[13px] font-mono text-zinc-400 lowercase">// tech ecosystem</span>
            </div>

            <div className="flex flex-col gap-3 text-[13px] text-zinc-400 font-medium lowercase">
              <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2">
                <span className="text-zinc-500 font-mono text-[11px]">// main editor</span>
                <span className="text-zinc-300">vs code / vim</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2">
                <span className="text-zinc-500 font-mono text-[11px]">// terminal environment</span>
                <span className="text-zinc-300">warp / zsh</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2">
                <span className="text-zinc-500 font-mono text-[11px]">// physical setup</span>
                <span className="text-zinc-300">beast pc</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono text-[11px]">// layout engine</span>
                <span className="text-zinc-300">tailwind css v4</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}