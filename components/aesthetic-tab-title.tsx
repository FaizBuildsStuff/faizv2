'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const AWAY_MESSAGES = [
  "👀 waiting for uuu...",
  "🥺 come back <3",
  "💭 don't leave me here...",
  "✨ missing u already <3",
  "🪐 it's so lonely here...",
  "🖤 where did u go??",
  "👾 waiting for uuu...",
  "🦋 come back to me...",
];

export default function AestheticTabTitle() {
  const pathname = usePathname();
  const originalTitleRef = useRef("cryptovoid");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep track of normal document title when navigating while visible
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.hidden && document.title) {
      if (!AWAY_MESSAGES.includes(document.title) && !document.title.includes("u came back")) {
        originalTitleRef.current = document.title;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let index = 0;

    const handleVisibilityChange = () => {
      // Clear any running timers
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (document.hidden) {
        // Save the current normal title before overwriting
        if (
          document.title && 
          !AWAY_MESSAGES.includes(document.title) && 
          !document.title.includes("u came back")
        ) {
          originalTitleRef.current = document.title;
        }

        // Set immediate away title
        document.title = AWAY_MESSAGES[0];
        index = 1;

        // Animate and cycle through Gen-Z aesthetic titles every 1.2s
        intervalRef.current = setInterval(() => {
          document.title = AWAY_MESSAGES[index];
          index = (index + 1) % AWAY_MESSAGES.length;
        }, 1200);
      } else {
        // User switched back to this tab! Show cute welcome back message
        document.title = "🥹 u came back!! <3";
        
        timeoutRef.current = setTimeout(() => {
          document.title = originalTitleRef.current || "cryptovoid";
        }, 1800);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
