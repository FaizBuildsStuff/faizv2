'use client'

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { 
  RiRadarLine, 
  RiUserSharedLine, 
  RiDiscordLine, 
  RiSpotifyLine 
} from 'react-icons/ri';
import HeroBackground from '@/components/hero-background';

export default function NowPage() {
  const [liveVisitors, setLiveVisitors] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // 1. LENIS SMOOTH SCROLL LIFECYCLE
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

  // 2. LIVE TELEMETRY PRESENCE FETCHING
  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const res = await fetch('/api/presence', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setLiveVisitors(data.count || 1);
        }
      } catch (err) {
        setLiveVisitors(1);
      }
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 5000);
    return () => clearInterval(interval);
  }, []);

  // 3. GSAP ELEVATED STAGGER REVEAL
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-meta', 
        { opacity: 0, y: 10 },
        { opacity: 0.6, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      
      gsap.fromTo('.reveal-heading', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', delay: 0.1 }
      );

      if (cardsContainerRef.current) {
        gsap.fromTo(cardsContainerRef.current.children,
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.2 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#111112] overflow-x-hidden select-none antialiased font-satoshi font-normal">
      
      {/* BACKGROUND GLOW COMPONENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      {/* FOREGROUND LAYOUT PIPELINE - PUSHED TO MAX-W-7XL FOR MAXIMUM SCALE */}
      <main className="relative z-10 text-[#fafafa] px-6 pt-44 pb-32 sm:px-12 max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* HERO HEADER SECTION - SCALE BOOSTED FOR BOTH DESKTOP AND MOBILE */}
        <div className="flex flex-col text-left select-none max-w-2xl pl-1">
          <span className="reveal-meta text-[13px] text-zinc-500 tracking-normal lowercase mb-4 opacity-60 font-satoshi">
            now
          </span>
          <h1 className="reveal-heading text-[64px] sm:text-[110px] md:text-[124px] font-black tracking-[-0.05em] text-[#fafafa] lowercase leading-[0.82] font-sans antialiased">
            live room
          </h1>
          <p className="reveal-meta text-[14px] text-zinc-500 lowercase tracking-tight mt-8 opacity-80 font-satoshi">
            what the room knows right now
          </p>
        </div>

        {/* 4-CARD BENTO GRID - INCREASED GAP AND CARD HIGHER RESOLUTION HEIGHTS */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
          
          {/* CARD 1: CURRENT STATUS */}
          <div className="md:col-span-7 bg-[#161619]/10 hover:bg-[#161619]/20 border border-zinc-900/40 hover:border-zinc-800/60 rounded-2xl p-7 flex flex-col justify-between h-[200px] transition-all duration-300 relative group overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-50">
              <RiRadarLine className="text-base" />
              <span>current status</span>
            </div>
            
            <div className="flex flex-col gap-2 justify-center my-auto">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#ef5350] shadow-[0_0_14px_rgba(239,83,80,0.9)] animate-pulse" />
                <h2 className="text-2xl sm:text-[28px] tracking-tight text-white font-normal antialiased font-satoshi">
                  do not disturb
                </h2>
                <span className="text-[11px] text-zinc-500 border border-zinc-900/80 px-2.5 py-0.5 rounded-full bg-zinc-950/40 font-satoshi lowercase">
                  desktop
                </span>
              </div>
              <p className="text-[13px] text-zinc-500 pl-5 lowercase opacity-70 tracking-tight font-satoshi">
                im here
              </p>
            </div>
          </div>

          {/* CARD 2: REAL-TIME ROOM TELEMETRY */}
          <div className="md:col-span-5 bg-[#161619]/10 hover:bg-[#161619]/20 border border-zinc-900/40 hover:border-zinc-800/60 rounded-2xl p-7 flex flex-col justify-between h-[200px] transition-all duration-300 relative group backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-50">
              <RiUserSharedLine className="text-base" />
              <span>room count</span>
            </div>
            
            <div className="flex flex-col gap-0.5 my-auto justify-center">
              <span className="text-5xl sm:text-[54px] font-normal tracking-tight text-white antialiased font-satoshi leading-none">
                {liveVisitors}
              </span>
              <span className="text-[12px] text-zinc-500 lowercase font-satoshi tracking-tight mt-1">
                visitors
              </span>
            </div>
            
            <p className="text-[12px] text-zinc-600 lowercase tracking-tight font-satoshi">
              how many people are currently on crypto.de
            </p>
          </div>

          {/* CARD 3: DISCORD ACTIVITY INTEGRATION */}
          <div className="md:col-span-7 bg-[#161619]/10 hover:bg-[#161619]/20 border border-zinc-900/40 hover:border-zinc-800/60 rounded-2xl p-7 flex flex-col justify-between h-[200px] transition-all duration-300 relative group backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-50">
              <RiDiscordLine className="text-base" />
              <span>discord activity</span>
            </div>
            <div className="my-auto text-[13px] text-zinc-500 lowercase tracking-tight opacity-75 font-satoshi pl-0.5">
              got no activity running rn
            </div>
          </div>

          {/* CARD 4: SPOTIFY FEED LOG */}
          <div className="md:col-span-5 bg-[#161619]/10 hover:bg-[#161619]/20 border border-zinc-900/40 hover:border-zinc-800/60 rounded-2xl p-7 flex flex-col justify-between h-[200px] transition-all duration-300 relative group backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-50">
              <RiSpotifyLine className="text-base" />
              <span>spotify</span>
            </div>
            <div className="my-auto text-[13px] text-zinc-500 lowercase tracking-tight opacity-75 font-satoshi pl-0.5">
              nothing playing on spotify at the moment.
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}