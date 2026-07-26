'use client'

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiArrowRightUpLine, RiRadioButtonLine } from 'react-icons/ri';

// Register ScrollTrigger safely in Next.js CSR
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState('');
  const [liveVisitors, setLiveVisitors] = useState(1);
  const headingText = "see you around.";

  // 1. LIVE TELEMETRY PRESENCE FETCHING
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

  // 2. LIVE TIME SYSTEM
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. ORCHESTRATED GSAP TIMELINES
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // A. Premium Stagger Reveal for Heading Characters
      gsap.fromTo('.footer-char', 
        { y: '110%', opacity: 0 },
        { 
          y: '0%', 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power4.out', 
          stagger: 0.03,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
          }
        }
      );

      // B. Expanding Horizontal Divider Line
      gsap.fromTo('.footer-line',
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1.2, 
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          }
        }
      );

      // C. Upward Stagger Fade for Bottom Columns
      gsap.fromTo('.footer-animate-col',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
          }
        }
      );

      // D. Continuous Floating Animation for Availability Dot
      gsap.to('.footer-status-dot', {
        y: -3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  // 3. PREMIUM CHARACTER WAVING INTERACTION
  const handleMouseEnter = () => {
    gsap.killTweensOf('.footer-char');
    gsap.to('.footer-char', {
      y: -10,
      opacity: 0.6,
      duration: 0.25,
      stagger: {
        amount: 0.2,
        from: 'start'
      },
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  };

  return (
    <footer 
      ref={footerRef} 
      className="relative z-20 w-full text-[#f4f4f5] px-6 sm:px-12 md:px-16 pb-12 pt-24 border-t border-zinc-900/60 select-none overflow-hidden bg-transparent pointer-events-none"
    >
      <div className="max-w-[1500px] mx-auto flex flex-col gap-12 sm:gap-16 w-full pointer-events-auto">
        
        {/* TOP INTERACTION BLOCK */}
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="footer-status-dot flex items-center gap-2 text-[13px] text-zinc-500 font-satoshi lowercase">
            <RiRadioButtonLine className="text-emerald-500 animate-pulse text-xs" />
            <span>available for engineering positions — just dm</span>
          </div>

          {/* HEADING IMMUNIZED FROM INLINE INJECTION ISSUES */}
          <h2 
            onMouseEnter={handleMouseEnter}
            className="text-[12vw] sm:text-[8vw] md:text-[6.5vw] font-black tracking-[-0.05em] text-zinc-100 lowercase leading-none font-sans cursor-pointer py-1 overflow-hidden block"
          >
            {headingText.split('').map((char, index) => (
              <span 
                key={index} 
                className="footer-char inline-block will-change-transform"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
        </div>

        {/* LINE ELEMENT */}
        <div className="footer-line w-full h-[1px] bg-zinc-800/60 origin-left" />

        {/* RE-ENGINEERED COLUMN FLOW */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start w-full text-[13px] sm:text-[14px] font-satoshi font-medium text-zinc-400 lowercase">
          
          {/* NAVIGATION SECTION */}
          <div className="footer-animate-col md:col-span-4 flex flex-col gap-3">
            <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">// navigation</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {['uses', 'guestbook', 'log', 'stats'].map((link) => (
                <a 
                  key={link} 
                  href={`/${link}`} 
                  className="hover:text-white transition-all duration-300 transform hover:translate-x-0.5 underline underline-offset-4 decoration-zinc-800 hover:decoration-zinc-500 cursor-pointer"
                >
                  /{link}
                </a>
              ))}
            </div>
          </div>

          {/* ECOSYSTEM PLATFORMS */}
          <div className="footer-animate-col md:col-span-3 flex flex-col gap-3">
            <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">// platforms</span>
            <div className="flex flex-col gap-1.5 items-start">
              <a href="https://redr.lol" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 hover:text-white transition-all duration-300 transform hover:translate-x-0.5 group cursor-pointer">
                redr.lol <RiArrowRightUpLine className="text-[11px] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
              <a href="https://github.com/FaizBuildsStuff" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 hover:text-white transition-all duration-300 transform hover:translate-x-0.5 group cursor-pointer">
                @FaizBuildsStuff <RiArrowRightUpLine className="text-[11px] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* TELEMETRY METRICS */}
          <div className="footer-animate-col md:col-span-3 flex flex-col gap-1 md:items-end">
            <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest mb-2">// context</span>
            <span className="text-zinc-300 font-mono tracking-tight select-text">
              {time ? `${time} in pakistan` : '--:-- in pakistan'}
            </span>
            <span className="text-[12px] text-zinc-500">© 2026 crypto</span>
          </div>

          {/* LIVE CONCURRENT USERS */}
          <div className="footer-animate-col md:col-span-2 flex flex-col gap-1 md:items-end border-t border-zinc-900/60 md:border-none pt-4 md:pt-0">
            <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest mb-2">// traffic</span>
            <div className="flex items-center gap-1.5 font-mono text-zinc-300">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
              <span>{liveVisitors} active</span>
            </div>
            <span className="text-[12px] text-zinc-500 text-left md:text-right">viewers in room</span>
          </div>

        </div>

      </div>
    </footer>
  );
}