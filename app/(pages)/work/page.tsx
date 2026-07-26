'use client'

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroBackground from '@/components/hero-background';

const PROJECTS = [
  {
    slug: 'redr-lol',
    title: 'redr.lol',
    type: 'creator profile service',
    role: 'creator & full-stack dev',
    year: '2026',
    url: 'https://redr.lol',
  }
];

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-header',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo('.reveal-row',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.1 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden select-none antialiased font-satoshi font-normal">
      
      {/* PERFECT MONOCHROME BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      <main className="relative z-10 px-6 pt-28 pb-32 sm:px-12 md:px-16 max-w-[1400px] mx-auto flex flex-col gap-12 sm:gap-20">
        
        {/* ENHANCED CONTRAST TOP STRIP */}
        <div className="w-full flex justify-between items-baseline border-b border-zinc-800 pb-5 reveal-header">
          <span className="text-[13px] sm:text-[14px] text-zinc-400 tracking-wide lowercase font-satoshi font-medium">
            what i've built
          </span>
          <span className="text-[12px] sm:text-[13px] text-zinc-500 font-mono tracking-tight">
            [02 projects]
          </span>
        </div>

        {/* MOBILE-OPTIMIZED CRISP LIST FLOW */}
        <div className="flex flex-col w-full divide-y divide-zinc-800/80">
          {PROJECTS.map((project) => (
            <a
              key={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal-row group block w-full py-8 sm:py-14 outline-none transition-colors duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start md:items-center">
                
                {/* PROJECT TYPE: INCREASED SIZE & HIGH CONTRAST */}
                <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start gap-1 text-[13px] sm:text-[14px] text-zinc-400 lowercase tracking-tight font-satoshi">
                  <span className="text-zinc-300 font-medium">{project.type}</span>
                  <span className="text-zinc-500 font-normal">{project.year}</span>
                </div>

                {/* PROJECT NAME: HERO TYPOGRAPHY */}
                <div className="md:col-span-6 py-2 md:py-0">
                  <h2 className="text-[11vw] sm:text-[10vw] md:text-[6vw] font-black tracking-[-0.05em] text-zinc-200 transition-all duration-500 leading-none lowercase ease-out group-hover:text-white group-hover:translate-x-1.5">
                    {project.title}
                  </h2>
                </div>

                {/* YOUR ROLE & ARROW LINK */}
                <div className="md:col-span-3 flex justify-between items-center md:justify-end md:gap-6 pt-3 md:pt-0 border-t border-zinc-900/60 md:border-none">
                  <span className="text-[13px] sm:text-[14px] text-zinc-400 font-satoshi lowercase font-medium group-hover:text-zinc-200 transition-colors duration-300">
                    {project.role}
                  </span>
                  
                  {/* CRISP VISUAL ARROW LINK */}
                  <div className="text-zinc-500 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <span className="font-sans text-sm sm:text-base font-medium">↗</span>
                  </div>
                </div>

              </div>
            </a>
          ))}
        </div>

        {/* CRISP STARK FOOTER */}
        <div className="reveal-header border-t border-zinc-800/80 pt-8 mt-4 w-full flex justify-start items-center">
          <p className="text-[14px] sm:text-[15px] text-zinc-400 font-satoshi lowercase tracking-normal group transition-colors duration-300">
            see the full setup gear at{' '}
            <a 
              href="/uses" 
              className="inline-flex items-center gap-0.5 text-zinc-200 font-semibold hover:text-white transition-all duration-300 underline underline-offset-4 decoration-zinc-800 hover:decoration-zinc-400 transform hover:translate-x-0.5"
            >
              /uses <span className="text-[10px] sm:text-[11px] text-zinc-500 group-hover:text-white transition-colors duration-300">↗</span>
            </a>.
          </p>
        </div>

      </main>
    </div>
  );
}