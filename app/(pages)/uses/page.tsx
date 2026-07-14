'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroBackground from '@/components/hero-background';

const DATA = [
  { label: "stack", items: [
    { name: "typescript", desc: "keeps me from crying at 3 AM because undefined is not a function." },
    { name: "next.js", desc: "the GOAT for when you want your site to be faster than your will to live." },
    { name: "react", desc: "my toxic relationship, but it's pretty, so i stay." },
    { name: "motion", desc: "making pixels do parkour because why not." },
    { name: "python", desc: "when i need to feel like a hacker but it's just basic logic." },
    { name: "electron", desc: "a web browser that forgot its roots and went to the gym." },
  ]},
  { label: "this site", items: [
    { name: "next.js 16, react 19", desc: "bleeding edge. if it breaks, it’s a feature." },
    { name: "tailwind v4", desc: "writing css like a pro and pretending i don't miss raw styling." },
    { name: "three.js", desc: "rendering 3D shapes to feel like a real life architect." },
    { name: "a discord bot", desc: "it tells you if i'm gaming or actually working (spoiler: it's gaming)." },
  ]},
  { label: "type", items: [
    { name: "satoshi", desc: "the font that makes my bad code look professional." },
    { name: "geist mono", desc: "for when i need that 'i spend too much time in the terminal' aesthetic." },
  ]},
  { label: "the desk", items: [
    { name: "a dark room", desc: "my natural habitat. sunlight is just a performance issue." },
    { name: "the editor", desc: "distraction-free mode enabled so i can ignore my responsibilities." },
    { name: "late hours", desc: "my brain doesn't actually turn on until the moon is out." },
  ]},
  { label: "services", items: [
    { name: "discord", desc: "the main hub for chaos and occasional collaboration." },
    { name: "spotify", desc: "if you judge my music taste, you’re officially banned." },
    { name: "redr.lol", desc: "my magnum opus, or just another way to avoid sleeping." },
  ]}
];

export default function UsesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal that feels organic
      gsap.fromTo('.reveal-row', 
        { opacity: 0, y: 10, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.02, ease: 'power3.out', clearProps: 'all' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-zinc-800">
      {/* IMMERSED BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <HeroBackground />
      </div>

      <main className="relative z-10 px-6 py-24 md:py-32 md:px-20 max-w-[800px] mx-auto">
        <header className="mb-32">
          <h1 className="text-[12px] uppercase tracking-[0.5em] text-zinc-500 mb-6 font-mono">// /uses</h1>
          <p className="text-zinc-400 font-light leading-relaxed text-lg max-w-sm">
            a living inventory of the tools, frameworks, and gear that power my work.
          </p>
        </header>

        <section className="flex flex-col">
          {DATA.map((section, i) => (
            <div key={i} className="mb-24">
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-700 font-mono mb-12">
                {section.label}
              </h2>
              
              <div className="flex flex-col">
                {section.items.map((item, j) => (
                  <div 
                    key={j} 
                    className="reveal-row group relative flex flex-col md:flex-row md:items-baseline py-5 border-b border-white/[0.03] hover:border-white/[0.1] transition-all duration-300"
                  >
                    {/* Hover Highlight Glow */}
                    <div className="absolute inset-0 bg-white/[0.01] -z-10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                    
                    <span className="w-full md:w-1/3 text-sm font-medium text-zinc-200 group-hover:text-white transition-colors duration-300">
                      {item.name}
                    </span>
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 mt-1 md:mt-0">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}