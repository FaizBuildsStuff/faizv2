'use client'

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { RiArrowRightDownLine, RiCompass3Line } from 'react-icons/ri';
import HeroBackground from '@/components/hero-background';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  // LUXURY ENTRANCE MOTION SEQUENCING
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-title-char',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', stagger: 0.04 }
      );

      gsap.fromTo('.reveal-fade-in',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo('.reveal-border',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power2.inOut', delay: 0.1, transformOrigin: 'left' }
      );

      if (elementsRef.current) {
        gsap.fromTo('.reveal-stagger-item',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.06, delay: 0.3 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] overflow-x-hidden select-none antialiased font-satoshi font-normal">

      {/* BACKGROUND GRAPHIC INTERFACE LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      {/* CORE FOREGROUND FRAME */}
      <main className="relative z-10 px-6 pt-28 pb-32 sm:px-12 md:px-16 max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24">

        {/* UPPER STATUS STRIP (PERFECTLY SPACED ON MOBILE) */}
        <div className="w-full flex justify-between items-center text-[10px] text-zinc-600 tracking-[0.2em] uppercase reveal-fade-in">
          <div className="flex items-center gap-2">
            <RiCompass3Line className="text-xs animate-spin-slow" />
            <span>welcome </span>
          </div>
          <span className="font-mono text-[9px] opacity-60">[ 02 ]</span>
        </div>

        {/* HERO TITLE AREA - HIGHLY TUNED MOBILE FONT OVERLAPS */}
        <div className="relative w-full select-none">
          <h1 className="text-[13vw] sm:text-[12vw] md:text-[10vw] lg:text-[140px] font-black tracking-tighter sm:tracking-[-0.06em] text-[#fafafa] lowercase leading-[0.78] font-sans antialiased flex flex-wrap gap-x-[0.03em]">
            {"the".split("").map((char, i) => (
              <span key={`t-${i}`} className="reveal-title-char inline-block will-change-transform">{char}</span>
            ))}
            <span className="w-3 sm:w-8 md:w-12 h-[1px] bg-zinc-800 self-end mb-[2.5vw] mx-1.5 reveal-border" />
            {"person".split("").map((char, i) => (
              <span key={`p-${i}`} className="reveal-title-char inline-block text-zinc-500 will-change-transform">{char}</span>
            ))}
          </h1>

          <div className="reveal-fade-in mt-6 sm:mt-10 max-w-sm border-l border-zinc-800/80 pl-4 py-0.5">
            <p className="text-[12px] text-zinc-500 lowercase tracking-normal font-satoshi leading-relaxed">
              not a boring resume page. just a quick breakdown of who i am, what i write code with, and the apps i build.
            </p>
          </div>
        </div>

        {/* SPATIAL TRACK MATRIX */}
        <div ref={elementsRef} className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-8 w-full items-start">

          {/* COMPONENT ONE: CLEAN BASIC FACTS TIMELINE */}
          <div className="md:col-span-3 flex flex-col gap-6 text-left">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
              <span>// basic info</span>
              <RiArrowRightDownLine className="text-[11px]" />
            </div>

            <div className="flex flex-col">
              {[
                { label: "where i'm from", val: "pakistan" },
                { label: "my age", val: "sixteen years old" },
                { label: "what i'm building", val: "redr.lol", url: "https://redr.lol" }
              ].map((item, idx) => (
                <div key={idx} className="reveal-stagger-item flex flex-col gap-1 border-b border-zinc-900/40 py-3.5 group first:pt-0 last:border-none">
                  <span className="text-[10px] text-zinc-600 lowercase font-satoshi">{item.label}</span>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[14px] text-zinc-300 font-normal lowercase tracking-tight font-satoshi hover:text-white transition-colors flex items-center gap-1">
                      {item.val} <span className="text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">↗</span>
                    </a>
                  ) : (
                    <span className="text-[14px] text-zinc-300 font-normal lowercase tracking-tight font-satoshi">{item.val}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EDITORIAL PROSE */}
          <div className="md:col-span-6 flex flex-col gap-8 text-[15px] sm:text-[17px] text-zinc-400 leading-[1.65] font-light tracking-tight pr-0 md:pr-4">
            <p className="reveal-fade-in">
              i’m all about intentional creation. when a project sparks, i don’t overthink it i just build. my process is about stripping away the noise to get to the core of what actually matters.
            </p>

            <p className="reveal-fade-in text-zinc-500 text-[14px] sm:text-[15px]">
              most of my time is spent in the web ecosystem, crafting immersive interfaces with <span className="text-zinc-300">typescript</span> and <span className="text-zinc-300">next.js</span>. i’m obsessed with the intersection where clean, minimal aesthetics meet high-performance engineering.
            </p>

            <p className="reveal-fade-in text-[14px] sm:text-[15px]">
              for data, i keep it lean and scalable relying on <span className="text-zinc-300">neon</span> or <span className="text-zinc-300">supabase</span> to handle the heavy lifting. when a project needs to break out of the browser, i wrap everything into native-feeling desktop experiences using <span className="text-zinc-300">electron</span>.
            </p>
          </div>

          {/* COMPONENT THREE: RE-ARCHITECTED RESPONSIVE TOOLKIT BLOCKS */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
              <span>// my toolkit</span>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {[
                {
                  layer: "front-end",
                  desc: "crafting fluid, high-performance interfaces with Next.js, React, Tailwind, and GSAP for advanced motion design."
                },
                {
                  layer: "server & data",
                  desc: "architecting scalable, serverless back-ends powered by Supabase, Neon Postgres, and TypeScript."
                },
                {
                  layer: "desktop apps",
                  desc: "developing cross-platform, native-feeling desktop tools for macOS and Windows using Electron."
                }
              ].map((stack, i) => (
                <div
                  key={i}
                  className="reveal-stagger-item group border border-zinc-900 bg-[#0c0c0e]/20 hover:bg-[#121215]/40 hover:border-zinc-800/60 p-4 rounded-xl transition-all duration-300 flex flex-col gap-1 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider">{stack.layer}</span>
                  <p className="text-[12px] text-zinc-500 group-hover:text-zinc-400 transition-colors lowercase leading-relaxed font-satoshi">
                    {stack.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ULTRA-CLEAN LUXURY FOOTER RECONFIGURED */}
        <div className="reveal-fade-in border-t border-zinc-900/60 pt-8 mt-4 w-full flex justify-start items-center">
          <p className="text-[13px] sm:text-[14px] text-zinc-500 font-satoshi lowercase tracking-normal group transition-colors duration-300">
            see the full setup gear at crumbs{' '}
            <a
              href="/uses"
              className="inline-flex items-center gap-0.5 text-zinc-300 font-medium hover:text-white transition-all duration-300 underline underline-offset-4 decoration-zinc-800 hover:decoration-zinc-400 transform hover:translate-x-0.5"
            >
              /uses <span className="text-[9px] text-zinc-600 group-hover:text-white transition-colors duration-300">↗</span>
            </a>.
          </p>
        </div>

      </main>
    </div>
  );
}