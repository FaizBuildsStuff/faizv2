'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export default function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const isExitingRef = useRef(false);

  // Stop global scroll while intro is open, reliably unlock when closed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!visible) {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    const lockScroll = () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    };

    lockScroll();
    const timer = setTimeout(lockScroll, 50);

    return () => {
      clearTimeout(timer);
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [visible]);

  // Entrance animations
  useEffect(() => {
    if (!visible) return;

    const ctx = gsap.context(() => {
      // Background overlay smooth appearance
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      // Clean stagger reveal for wordmark and instruction
      gsap.fromTo('.intro-anim',
        { opacity: 0, filter: 'blur(12px)', y: 15 },
        { 
          opacity: 1, 
          filter: 'blur(0px)', 
          y: 0, 
          duration: 1, 
          ease: 'power3.out', 
          stagger: 0.15, 
          delay: 0.1 
        }
      );

      // Subtle breathing pulse for the interactive prompt (catchii style)
      if (promptRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0.35,
          yoyo: true,
          repeat: -1,
          duration: 1.6,
          ease: 'power1.inOut',
          delay: 1.2,
        });
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [visible]);

  // Exit animation on user click or keypress
  const handleEnter = useCallback(() => {
    if (isExitingRef.current || !visible) return;
    isExitingRef.current = true;

    const ctx = gsap.context(() => {
      // Animate text out with clean cinematic blur & slight zoom
      gsap.to('.intro-anim', {
        opacity: 0,
        filter: 'blur(10px)',
        scale: 1.04,
        y: -10,
        duration: 0.4,
        ease: 'power2.in',
        stagger: 0.03,
      });

      // Dissolve backdrop overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 0.15,
        onComplete: () => {
          const lenis = (window as any).__lenis;
          if (lenis) lenis.start();
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          setVisible(false);
        },
      });
    }, overlayRef);
  }, [visible]);

  // Global keydown listener to enter site on pressing any key
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;
      handleEnter();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleEnter]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleEnter}
      data-lenis-prevent
      aria-label="enter the site"
      className="fixed inset-0 z-[100] bg-[#09090b]/90 backdrop-blur-3xl flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-colors duration-500 font-sans p-6"
    >
      {/* Subtle bottom-left ambient drift & noise (catchii aesthetics) */}
      <div className="absolute top-[-10%] left-[10%] w-[60vmax] h-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Pure Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        
        {/* Responsive Minimal Wordmark */}
        <div className="intro-anim relative flex items-baseline justify-center">
          <h1 className="text-[clamp(2.75rem,10vw,6.5rem)] font-extrabold tracking-[-0.045em] text-[#f4f4f5] leading-none select-none">
            cryptovoid<span className="text-[#8a8a8e]/60 font-bold">.ex</span>
          </h1>
          <span className="inline-block ml-1.5 sm:ml-2 w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 rounded-full bg-[#ef5350] shadow-[0_0_20px_rgba(239,83,80,0.8)] transform translate-y-[-10%]" />
        </div>

        {/* Minimalist Breathing Subtitle */}
        <p 
          ref={promptRef} 
          className="intro-anim mt-8 sm:mt-10 font-mono text-[11px] sm:text-xs tracking-[0.16em] sm:tracking-[0.2em] text-[#8a8a8e]/80 lowercase select-none"
        >
          click anywhere to enter
        </p>
      </div>
    </div>
  );
}
