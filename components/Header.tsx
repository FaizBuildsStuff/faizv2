'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Volume2 } from 'lucide-react';

// Pure Shadcn UI Component Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PAGE_DETAILS: Record<string, { title: string; desc: string }> = {
  home: { title: "index portal", desc: "the central clearinghouse and landing baseline." },
  now: { title: "current focus", desc: "what i am building, thinking, and learning right now." },
  about: { title: "identity script", desc: "sixteen year old developer. background and core stacks." },
  work: { title: "experience log", desc: "historical contract history, engineering, and roles." },
  projects: { title: "production laboratory", desc: "open source repositories, experiments, and applications." },
};

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
  const [navTime, setNavTime] = useState('13:14');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Derive activeTab based on current URL path
  const currentTab = NAV_ITEMS.find(item => item.href === pathname)?.id || 'home';
  
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [cardXOffset, setCardXOffset] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const bgPillRef = useRef<HTMLSpanElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
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
    const interval = setInterval(updateHeaderClock, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setHoveredTab(item);
    const target = e.currentTarget;
    
    gsap.to(bgPillRef.current, {
      left: target.offsetLeft,
      width: target.offsetWidth,
      duration: 0.22,
      ease: "power2.out",
      opacity: 1
    });

    const targetCenter = target.offsetLeft + (target.offsetWidth / 2);
    setCardXOffset(targetCenter);

    gsap.killTweensOf(infoCardRef.current);
    gsap.fromTo(infoCardRef.current,
      { opacity: 0, y: 4, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power3.out" }
    );
  };

  const handleMouseLeaveContainer = () => {
    setHoveredTab(null);
    const activeEl = containerRef.current?.querySelector(`[data-tab="${currentTab}"]`) as HTMLElement;
    if (activeEl) {
      gsap.to(bgPillRef.current, {
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        duration: 0.22,
        ease: "power2.out"
      });
    }
  };

  const handleMenuMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setHoveredTab(null);
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

  // Re-track active tab location whenever route path updates
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(`[data-tab="${currentTab}"]`) as HTMLElement;
    if (activeEl) {
      gsap.set(bgPillRef.current, {
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1
      });
    }
  }, [currentTab, pathname]);

  return (
    <header className="fixed top-3 sm:top-5 left-0 w-full z-50 flex flex-col items-center pointer-events-none px-3 sm:px-4 select-none">
      
      {/* MAIN PREMIUM CAPSULE CONTAINER */}
      <div 
        ref={containerRef}
        onMouseLeave={handleMouseLeaveContainer}
        className="pointer-events-auto relative flex items-center bg-[#0d0d0f]/95 sm:bg-[#0d0d0f]/90 border border-[#1f1f23] backdrop-blur-xl rounded-full h-[36px] sm:h-[38px] px-1 shadow-[0_24px_60px_rgba(0,0,0,0.8)] max-w-full transition-all duration-300"
      >
        {/* MAGNETIC BACKPLATE TRACKER PILL */}
        <span 
          ref={bgPillRef}
          className="absolute top-[4px] bottom-[4px] bg-[#1a1a1e] border border-zinc-800/60 rounded-full z-0 pointer-events-none opacity-0 will-change-all hidden sm:block"
        />

        {/* NAVIGATION LINK MATRICES (Now using Next.js client router links) */}
        <nav className="flex items-center gap-0 sm:gap-0.5 relative z-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              data-tab={item.id}
              onMouseEnter={(e) => handleMouseEnter(e, item.id)}
              className={`text-[11px] sm:text-[12px] h-[28px] sm:h-[30px] rounded-full transition-all duration-200 relative px-2.5 sm:px-3.5 flex items-center justify-center font-mono lowercase tracking-tight ${
                currentTab === item.id 
                  ? 'text-white font-medium bg-[#1a1a1e] sm:bg-transparent' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* SYSTEM OVERFLOW HOVER DROPDOWN CONTROLLER */}
          <div 
            className="relative flex items-center"
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger 
                className="w-6 sm:w-7 h-[28px] sm:h-[30px] text-[10px] rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-colors tracking-widest outline-none cursor-pointer font-mono"
              >
                •••
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                className="w-36 bg-[#0c0c0e]/95 border border-[#1f1f23] rounded-xl p-1 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col gap-0.5 z-50 outline-none border-zinc-800 animate-in fade-in slide-in-from-top-1 duration-200"
                onMouseEnter={handleMenuMouseEnter}
                onMouseLeave={handleMenuMouseLeave}
                sideOffset={6}
                align="end"
              >
                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/guestbook')}
                  className="w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-[#1a1a1e] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="flex-1 flex justify-between items-center">
                    <span className="text-[11px] font-mono lowercase tracking-wide text-zinc-400 group-data-[highlighted]:!text-zinc-50">guestbook</span>
                    <span className="text-[9px] font-mono text-zinc-600 group-data-[highlighted]:text-zinc-400">// 01</span>
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/log')}
                  className="w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-[#1a1a1e] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="flex-1 flex justify-between items-center">
                    <span className="text-[11px] font-mono lowercase tracking-wide text-zinc-400 group-data-[highlighted]:!text-zinc-50">log</span>
                    <span className="text-[9px] font-mono text-zinc-600 group-data-[highlighted]:text-zinc-400">// 02</span>
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDropdownNavigate('/stats')}
                  className="w-full text-left px-3 py-1.5 rounded-lg data-[highlighted]:bg-[#1a1a1e] transition-colors outline-none cursor-pointer flex justify-between items-center group"
                >
                  <span className="flex-1 flex justify-between items-center">
                    <span className="text-[11px] font-mono lowercase tracking-wide text-zinc-400 group-data-[highlighted]:!text-zinc-50">stats</span>
                    <span className="text-[9px] font-mono text-zinc-600 group-data-[highlighted]:text-zinc-400">// 03</span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* SEPARATOR LAYER */}
        <div className="w-[1px] h-3 sm:h-3.5 bg-zinc-800/80 mx-1.5 sm:mx-2 relative z-10" />

        {/* LIVE METADATA CONTAINER */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pr-2 sm:pr-3 pl-0.5 text-[11px] font-mono tracking-tight text-zinc-500 relative z-10">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef5350] shadow-[0_0_8px_rgba(239,83,80,0.5)] animate-pulse" />
            <span className="lowercase font-medium text-zinc-400 hidden xs:inline-block">busy</span>
          </div>

          <span className="text-zinc-800 text-[8px] hidden xs:inline-block">•</span>
          <span className="text-zinc-400 normal-case tracking-normal">{navTime}</span>
          
          <div className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors pt-0.5 hidden sm:block">
            <Volume2 className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* DYNAMIC INFORMATION HOVER EXPANSION CARD */}
      <div className="w-full max-w-2xl relative mt-2 pointer-events-none hidden sm:block">
        {hoveredTab && (
          <div 
            ref={infoCardRef}
            style={{ 
              position: 'absolute',
              left: `${cardXOffset}px`,
              transform: 'translateX(-50%)',
              willChange: 'left, transform'
            }}
            className="bg-[#0d0d0f]/95 border border-[#1f1f23] rounded-xl px-4 py-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.7)] backdrop-blur-md w-64 flex flex-col gap-0.5 text-left transition-all duration-700"
          >
            <div className="text-[11px] font-mono text-zinc-200 font-semibold tracking-wide lowercase">
              ~ {PAGE_DETAILS[hoveredTab]?.title}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 lowercase leading-relaxed">
              {PAGE_DETAILS[hoveredTab]?.desc}
            </div>
          </div>
        )}
      </div>
      
    </header>
  );
};

export default HeaderNavbar;