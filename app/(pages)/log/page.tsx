'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiHistoryLine, RiArrowRightUpLine } from 'react-icons/ri';
import HeroBackground from '@/components/hero-background';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LOG_ENTRIES = [
  {
    id: 1,
    date: 'july 2026',
    title: 'rebuilding core interface interactions',
    category: 'engineering',
    description: 'completely overhauled the site typography and navigation models to leverage fluid multi-stagger entry systems. dropped custom drop-shadow rendering pathways to double mobile animation runtime efficiency.',
    tags: ['gsap', 'nextjs', 'ux']
  },
  {
    id: 2,
    date: 'june 2026',
    title: 'shifting to minimal typography systems',
    category: 'design',
    description: 'removed dense grid-containers and background cards across main pages. the layout now completely depends on breathing space, stark geometric font tracking sizes, and ultra-subtle borders.',
    tags: ['tailwind', 'branding']
  },
  {
    id: 3,
    date: 'may 2026',
    title: 'experimenting with fluid canvas backgrounds',
    category: 'creative',
    description: 'developed the custom fluid noise backdrop module to establish a unified atmosphere across dynamic page route paths without introducing input block lag bugs.',
    tags: ['webgl', 'shaders']
  }
];

export default function LogPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top header reveal sequence
      gsap.fromTo('.reveal-title',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Stagger reveal for the log items row items
      gsap.fromTo('.log-row',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          ease: 'power3.out', 
          stagger: 0.15,
          delay: 0.2
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] font-satoshi selection:bg-zinc-800 overflow-x-hidden">
      
      {/* IMMERSED COMPONENT ATMOSPHERE BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      <main className="relative z-10 px-6 pt-28 pb-32 sm:px-12 md:px-16 max-w-[1400px] mx-auto flex flex-col gap-16 sm:gap-20">
        
        {/* PAGE INTRO HEADER SECTION */}
        <div className="reveal-title flex flex-col items-start gap-3 border-b border-zinc-900 pb-10 w-full">
          <div className="flex items-center gap-2 text-[13px] text-zinc-400 font-medium lowercase tracking-wide">
            <RiHistoryLine className="text-zinc-500 text-sm animate-spin-slow" />
            <span>changelog & updates</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
            <h1 className="text-4xl font-black tracking-tight text-zinc-100 lowercase sm:text-5xl">
              the site log
            </h1>
            <p className="text-[13px] sm:text-[14px] text-zinc-400 font-medium max-w-sm lowercase leading-relaxed">
              a chronological record of design alterations, code improvements, and side experiments.
            </p>
          </div>
        </div>

        {/* TIMELINE MATRIX COLUMN FLOW */}
        <div className="flex flex-col w-full">
          {LOG_ENTRIES.map((entry) => (
            <div 
              key={entry.id} 
              className="log-row group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-zinc-900/60 last:border-none w-full transition-all duration-300"
            >
              
              {/* LEFT SUBCOLUMN: ASYMMETRIC TIMESTAMP */}
              <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-start items-baseline md:items-start gap-1">
                <span className="text-[12px] sm:text-[13px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                  {entry.date}
                </span>
                <span className="text-[11px] font-mono text-zinc-600 lowercase px-2 py-0.5 rounded-full bg-zinc-900/40 border border-zinc-800/40">
                  {entry.category}
                </span>
              </div>

              {/* RIGHT SUBCOLUMN: LOG CONTENT DATA */}
              <div className="md:col-span-9 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4 w-full">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-200 group-hover:text-white transition-colors lowercase">
                    {entry.title}
                  </h3>
                  <RiArrowRightUpLine className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-sm mt-1.5" />
                </div>

                <p className="text-[13px] sm:text-[14px] text-zinc-400 leading-relaxed font-medium lowercase max-w-3xl">
                  {entry.description}
                </p>

                {/* LOG TAG METRICS */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {entry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}