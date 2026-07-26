'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';

// Pure Shadcn UI Component Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_ITEMS = [
  { id: 'home', label: 'home', href: '/' },
  { id: 'now', label: 'now', href: '/now' },
  { id: 'about', label: 'about', href: '/about' },
  { id: 'work', label: 'work', href: '/work' },
  { id: 'projects', label: 'projects', href: '/projects' },
];

const HeaderNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [navTime, setNavTime] = useState('14:42');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  // Derive activeTab based on current URL path
  const currentTab = NAV_ITEMS.find(item => item.href === pathname)?.id || 'home';
  const activeTarget = hoveredTab || currentTab;
  
  const listRef = useRef<HTMLUListElement>(null);
  const bgPillRef = useRef<HTMLLIElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateHeaderClock = () => {
      const now = new Date();
      setNavTime(
        String(now.getHours()).padStart(2, '0') + ':' + 
        String(now.getMinutes()).padStart(2, '0')
      );
    };
    updateHeaderClock();
    const interval = setInterval(updateHeaderClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Smoothly move magnetic pill to hovered or currently active tab
  useEffect(() => {
    const updatePillPosition = () => {
      const el = listRef.current?.querySelector(`[data-tab="${activeTarget}"]`) as HTMLElement;
      if (el && bgPillRef.current) {
        gsap.to(bgPillRef.current, {
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    updatePillPosition();
    
    // Ensure accurate position on window resize or layout shift
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [activeTarget, pathname]);

  const handleMenuMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMenuMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleDropdownNavigate = (href: string) => {
    setDropdownOpen(false);
    router.push(href);
  };

  return (
    <header className="fixed top-4 sm:top-6 left-0 w-full z-50 flex flex-col items-center pointer-events-none px-3 select-none font-mono">
      
      {/* MAIN PREMIUM CAPSULE CONTAINER */}
      <nav 
        aria-label="primary navigation"
        className="pointer-events-auto relative flex items-center h-10 sm:h-11 rounded-full border border-white/[0.08] bg-[#0e0e11]/85 backdrop-blur-2xl px-1.5 sm:px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 max-w-[96vw] sm:max-w-full"
      >
        {/* NAVIGATION LINK MATRICES */}
        <ul 
          ref={listRef} 
          onMouseLeave={() => setHoveredTab(null)}
          className="flex items-center gap-0.5 sm:gap-1 relative z-10"
        >
          {/* MAGNETIC BACKPLATE TRACKER PILL (Moves dynamically to active/hovered tab) */}
          <li 
            ref={bgPillRef}
            aria-hidden="true"
            className="absolute top-[2px] bottom-[2px] bg-white/[0.08] border border-white/[0.05] rounded-full z-0 pointer-events-none opacity-0 shadow-sm"
          />

          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            const isSecondary = item.id === 'now' || item.id === 'projects';
            return (
              <li 
                key={item.id} 
                data-tab={item.id} 
                onMouseEnter={() => setHoveredTab(item.id)}
                className={`z-10 ${isSecondary ? 'hidden sm:block' : ''}`}
              >
                <Link
                  href={item.href}
                  className={`block rounded-full px-2 sm:px-3.5 py-1.5 text-[11px] sm:text-[13px] lowercase transition-colors duration-200 select-none ${
                    isActive 
                      ? 'text-[#f4f4f5] font-medium' 
                      : 'text-[#8a8a8e] hover:text-[#f4f4f5]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}

          {/* MORE BUTTON DROPDOWN CONTROLLER (•••) */}
          <li 
            className="z-10 relative flex items-center"
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger 
                aria-label="more pages"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a8a8e] hover:text-[#f4f4f5] hover:bg-white/[0.05] transition-colors outline-none cursor-pointer text-[13px] tracking-wider"
              >
                •••
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                className="w-36 bg-[#0e0e11]/95 border border-white/10 rounded-xl p-1 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col gap-0.5 z-50 outline-none font-mono animate-in fade-in slide-in-from-top-1 duration-200"
                onMouseEnter={handleMenuMouseEnter}
                onMouseLeave={handleMenuMouseLeave}
                sideOffset={8}
                align="end"
              >
                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/now')}
                  className="sm:hidden w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-white/[0.08] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="text-[11px] lowercase tracking-wide text-[#8a8a8e] group-data-[highlighted]:text-[#f4f4f5]">now</span>
                  <span className="text-[9px] text-zinc-600 group-data-[highlighted]:text-zinc-400">// nav</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/projects')}
                  className="sm:hidden w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-white/[0.08] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="text-[11px] lowercase tracking-wide text-[#8a8a8e] group-data-[highlighted]:text-[#f4f4f5]">projects</span>
                  <span className="text-[9px] text-zinc-600 group-data-[highlighted]:text-zinc-400">// nav</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/guestbook')}
                  className="w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-white/[0.08] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="text-[11px] lowercase tracking-wide text-[#8a8a8e] group-data-[highlighted]:text-[#f4f4f5]">guestbook</span>
                  <span className="text-[9px] text-zinc-600 group-data-[highlighted]:text-zinc-400">// 01</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/log')}
                  className="w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-white/[0.08] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="text-[11px] lowercase tracking-wide text-[#8a8a8e] group-data-[highlighted]:text-[#f4f4f5]">log</span>
                  <span className="text-[9px] text-zinc-600 group-data-[highlighted]:text-zinc-400">// 02</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/stats')}
                  className="w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-white/[0.08] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="text-[11px] lowercase tracking-wide text-[#8a8a8e] group-data-[highlighted]:text-[#f4f4f5]">stats</span>
                  <span className="text-[9px] text-zinc-600 group-data-[highlighted]:text-zinc-400">// 03</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        {/* VERTICAL SEPARATOR LINE */}
        <span aria-hidden="true" className="mx-1 sm:mx-3 h-4 w-px bg-white/[0.1] relative z-10 shrink-0" />

        {/* STATUS INDICATOR & TABULAR CLOCK (🔴 busy · 14:42) */}
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-[13px] text-[#8a8a8e] relative z-10 pr-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#ef5350] shadow-[0_0_8px_rgba(239,83,80,0.6)] animate-pulse shrink-0" />
          <span className="lowercase font-normal hidden sm:inline">busy</span>
          <span className="text-[#8a8a8e]/40 select-none hidden sm:inline">·</span>
          <span className="tabular-nums text-[#8a8a8e] pr-0.5">{navTime}</span>
        </div>

        {/* UI SOUNDS TOGGLE BUTTON */}
        <button 
          type="button" 
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? "turn ui sounds on" : "turn ui sounds off"}
          className="grid size-8 cursor-pointer place-items-center rounded-full text-[#8a8a8e] hover:bg-white/[0.05] hover:text-[#f4f4f5] transition-colors duration-200 active:scale-[0.92] relative z-10 shrink-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </nav>
      
    </header>
  );
};

export default HeaderNavbar;