'use client'

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { RiFlaskLine, RiArrowRightDownLine } from 'react-icons/ri';
import HeroBackground from '@/components/hero-background';

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-header',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo('.reveal-title-char', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', stagger: 0.04, delay: 0.05 }
      );
      if (elementsRef.current) {
        gsap.fromTo('.reveal-block',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.2 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden select-none antialiased font-satoshi font-normal">
      
      {/* PERFECT MONOCHROME BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      <main className="relative z-10 px-6 pt-28 pb-32 sm:px-12 md:px-16 max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* ENHANCED HIGH-CONTRAST TOP STRIP */}
        <div className="w-full flex justify-between items-baseline border-b border-zinc-800 pb-5 reveal-header">
          <div className="flex items-center gap-2 text-[13px] sm:text-[14px] text-zinc-400 font-satoshi font-medium tracking-wide lowercase">
            <RiFlaskLine className="text-zinc-500 text-sm" />
            <span>the experimental lab</span>
          </div>
          <span className="text-[12px] sm:text-[13px] text-zinc-500 font-mono tracking-tight">
            [status: building]
          </span>
        </div>

        {/* HERO HEADER AREA */}
        <div className="relative w-full select-none">
          <h1 className="text-[14vw] sm:text-[10vw] md:text-[7.5vw] font-black tracking-[-0.05em] text-zinc-200 lowercase leading-[0.85] font-sans antialiased flex flex-wrap gap-x-[0.03em]">
            {"lab".split("").map((char, i) => (
              <span key={`l-${i}`} className="reveal-title-char inline-block will-change-transform">{char}</span>
            ))}
            {"soon".split("").map((char, i) => (
              <span key={`s-${i}`} className="reveal-title-char inline-block text-zinc-500 will-change-transform">{char}</span>
            ))}
          </h1>
          
          <div className="reveal-block mt-6 sm:mt-10 max-w-lg border-l border-zinc-800 pl-4 py-1">
            <p className="text-[13px] sm:text-[14px] text-zinc-400 lowercase tracking-normal font-satoshi leading-relaxed font-medium">
              this page is kept blank on purpose. i only feature work here once it is polished, completely finished, and ready to show.
            </p>
          </div>
        </div>

        {/* ASYMMETRICAL EXPLANATION GRID (FULLY OPTIMIZED FOR MOBILE STACKING) */}
        <div ref={elementsRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full border-t border-zinc-800/60 pt-10 mt-4 items-start">
          
          {/* COLUMN 1: PUBLIC COUNTER */}
          <div className="reveal-block md:col-span-4 flex items-baseline gap-4 border-b border-zinc-900/40 md:border-none pb-6 md:pb-0">
            <span className="text-[56px] sm:text-[72px] font-black font-sans leading-none text-zinc-200 tracking-tight">
              0
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] sm:text-[14px] font-satoshi font-medium text-zinc-300 lowercase tracking-tight">
                public tools listed
              </span>
              <span className="text-[12px] text-zinc-500 font-satoshi lowercase">
                quality over quantity
              </span>
            </div>
          </div>

          {/* COLUMN 2: PHILOSOPHY */}
          <div className="reveal-block md:col-span-5 flex flex-col gap-2 border-b border-zinc-900/40 md:border-none pb-6 md:pb-0">
            <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-zinc-500 font-mono tracking-wider uppercase">
              <span>// philosophy</span>
              <RiArrowRightDownLine />
            </div>
            <p className="text-[13px] sm:text-[14px] text-zinc-400 font-satoshi lowercase leading-relaxed font-medium">
              empty is always better than padding out a website portfolio with half-baked ideas or unfinished code experiments that are not completely solid yet.
            </p>
          </div>

          {/* COLUMN 3: FUTURE EXPECTATION */}
          <div className="reveal-block md:col-span-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-zinc-500 font-mono tracking-wider uppercase">
              <span>// coming next</span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-zinc-400 font-satoshi lowercase leading-relaxed font-medium">
              interactive scripts, micro-tools, and custom application designs will find their way onto this route soon.
            </p>
          </div>

        </div>

        {/* STARK HIGH-CONTRAST FOOTER LINK */}
        <div className="reveal-header border-t border-zinc-800/80 pt-8 mt-4 w-full flex justify-start items-center">
          <p className="text-[14px] sm:text-[15px] text-zinc-400 font-satoshi lowercase tracking-normal group transition-colors duration-300">
            while you wait, check out my active projects at{' '}
            <a 
              href="/work" 
              className="inline-flex items-center gap-0.5 text-zinc-200 font-semibold hover:text-white transition-all duration-300 underline underline-offset-4 decoration-zinc-800 hover:decoration-zinc-400 transform hover:translate-x-0.5"
            >
              /work <span className="text-[10px] sm:text-[11px] text-zinc-500 group-hover:text-white transition-colors duration-300">↗</span>
            </a>.
          </p>
        </div>

      </main>
    </div>
  );
}