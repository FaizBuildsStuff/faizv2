'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Instant clean scroll reset to top without jumpiness
      window.scrollTo({ top: 0, behavior: 'instant' });
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });

      // Apple / iOS Style Spatial 3D Depth Zoom
      // Set 3D perspective on outer wrapper for true spatial depth physics
      gsap.set(containerRef.current, { perspective: 1400 });

      // Animate content from a subtle zoomed-forward 3D perspective with tilt & optical blur
      gsap.fromTo(
        contentRef.current,
        { 
          opacity: 0, 
          scale: 1.05, 
          rotateX: 3.5, 
          y: 24, 
          filter: 'blur(12px)',
          transformOrigin: '50% 15%'
        },
        { 
          opacity: 1, 
          scale: 1, 
          rotateX: 0, 
          y: 0, 
          filter: 'blur(0px)',
          duration: 0.65, 
          ease: 'power3.out',
          clearProps: 'all'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={containerRef} className="w-full flex-grow flex flex-col [perspective:1400px]">
      <div 
        ref={contentRef} 
        className="w-full flex-grow flex flex-col will-change-transform [transform-style:preserve-3d]"
      >
        {children}
      </div>
    </div>
  );
}
