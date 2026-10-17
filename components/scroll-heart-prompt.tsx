"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";

const LIKED_STORAGE_KEY = "faiz_site_liked_v2";

const BURST_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = 46 + (i % 3) * 14;
  return {
    id: i,
    tx: Math.cos(angle) * distance,
    ty: Math.sin(angle) * distance - 8,
    scale: i % 2 === 0 ? 1.05 : 0.78,
    rot: (i % 2 === 0 ? 1 : -1) * (18 + i * 4),
  };
});

export default function ScrollHeartPrompt() {
  const [totalHearts, setTotalHearts] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isAnimatingLike, setIsAnimatingLike] = useState<boolean>(false);
  const [showTopRightPill, setShowTopRightPill] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogHeartRef = useRef<HTMLButtonElement>(null);
  const burstContainerRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const flyingHeartRef = useRef<HTMLDivElement>(null);
  const topRightPillRef = useRef<HTMLDivElement>(null);
  const topRightHeartIconRef = useRef<SVGSVGElement>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerMobileExpandFor5Seconds = useCallback(() => {
    setIsMobileExpanded(true);
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    collapseTimerRef.current = setTimeout(() => {
      setIsMobileExpanded(false);
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch("/api/likes", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { count?: number };
      if (typeof data?.count === "number") {
        setTotalHearts(data.count);
        setIsLoaded(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const liked = localStorage.getItem(LIKED_STORAGE_KEY) === "true";
      if (liked) {
        setHasLiked(true);
        setShowTopRightPill(true);
      }
    } catch {}

    fetchLikes();
    // Poll every 3 seconds so top-right total likes stay real-time across all visitors
    const interval = setInterval(fetchLikes, 3000);
    return () => clearInterval(interval);
  }, [fetchLikes]);

  // Open centered dialog with blurred background when user scrolls down
  useEffect(() => {
    if (hasLiked || isDismissed || isDialogOpen) return;

    const handleScroll = () => {
      if (window.scrollY > 240) {
        setIsDialogOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasLiked, isDismissed, isDialogOpen]);

  // Smooth GSAP entrance for blurred backdrop + centered modal
  useEffect(() => {
    if (!isDialogOpen) return;

    if (backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }

    if (dialogRef.current) {
      gsap.fromTo(
        dialogRef.current,
        { y: 24, scale: 0.9, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(1.6)",
        }
      );
    }
  }, [isDialogOpen]);

  const handleDismiss = () => {
    if (isAnimatingLike) return;
    if (!dialogRef.current) {
      setIsDialogOpen(false);
      setIsDismissed(true);
      return;
    }

    if (backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
      });
    }

    gsap.to(dialogRef.current, {
      y: 16,
      scale: 0.92,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        setIsDialogOpen(false);
        setIsDismissed(true);
      },
    });
  };

  const handleHeartClick = () => {
    if (isAnimatingLike || hasLiked) return;
    setIsAnimatingLike(true);
    setHasLiked(true);
    setTotalHearts((prev) => prev + 1);

    try {
      localStorage.setItem(LIKED_STORAGE_KEY, "true");
    } catch {}

    // Persist real increment in Neon PostgreSQL and sync exact count
    fetch("/api/likes", { method: "POST", cache: "no-store" })
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (typeof data?.count === "number") {
          setTotalHearts(data.count);
          setIsLoaded(true);
        }
      })
      .catch(() => {});

    // Capture exact center coordinates of the heart button before closing
    const startRect = dialogHeartRef.current?.getBoundingClientRect();
    const startX = startRect
      ? startRect.left + startRect.width / 2
      : window.innerWidth / 2;
    const startY = startRect
      ? startRect.top + startRect.height / 2
      : window.innerHeight / 2;

    const tl = gsap.timeline();

    // 1. Elastic heart pop inside dialog
    if (dialogHeartRef.current) {
      tl.fromTo(
        dialogHeartRef.current,
        { scale: 0.8 },
        {
          scale: 1.22,
          duration: 0.34,
          ease: "back.out(3)",
        },
        0
      ).to(
        dialogHeartRef.current,
        {
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
        },
        0.34
      );
    }

    // 2. Expanding ripple ring
    if (rippleRef.current) {
      tl.fromTo(
        rippleRef.current,
        { scale: 0.6, opacity: 0.9 },
        {
          scale: 2.5,
          opacity: 0,
          duration: 0.68,
          ease: "expo.out",
        },
        0.02
      );
    }

    // 3. Radial mini-heart burst particles
    if (burstContainerRef.current) {
      const particles =
        burstContainerRef.current.querySelectorAll<HTMLElement>(".burst-p");
      particles.forEach((el, idx) => {
        const cfg = BURST_PARTICLES[idx];
        tl.fromTo(
          el,
          { x: 0, y: 0, scale: 0, opacity: 1, rotation: 0 },
          {
            x: cfg.tx,
            y: cfg.ty,
            scale: cfg.scale,
            opacity: 0,
            rotation: cfg.rot,
            duration: 0.72,
            ease: "expo.out",
          },
          0.04
        );
      });
    }

    // 4. Smoothly fade out blurred backdrop & centered dialog while launching heart to top-right
    tl.add(() => {
      setShowTopRightPill(true);
      triggerMobileExpandFor5Seconds();
    }, 0.62);

    if (backdropRef.current) {
      tl.to(
        backdropRef.current,
        {
          opacity: 0,
          duration: 0.38,
          ease: "power2.inOut",
        },
        0.65
      );
    }

    if (dialogRef.current) {
      tl.to(
        dialogRef.current,
        {
          y: 12,
          scale: 0.88,
          opacity: 0,
          duration: 0.36,
          ease: "power2.inOut",
          onComplete: () => {
            setIsDialogOpen(false);
          },
        },
        0.65
      );
    }

    if (flyingHeartRef.current) {
      const targetX = window.innerWidth - 96;
      const targetY = 26;

      tl.set(
        flyingHeartRef.current,
        {
          x: startX - 20,
          y: startY - 20,
          scale: 1.2,
          opacity: 1,
          rotation: -14,
        },
        0.62
      )
        .to(
          flyingHeartRef.current,
          {
            x: targetX,
            y: targetY,
            scale: 0.55,
            rotation: 12,
            duration: 0.75,
            ease: "expo.inOut",
          },
          0.65
        )
        .to(
          flyingHeartRef.current,
          {
            opacity: 0,
            scale: 0.2,
            duration: 0.15,
          },
          1.34
        );
    }

    // 5. Pop top-right badge when flying heart lands
    tl.add(() => {
      if (topRightPillRef.current) {
        gsap.fromTo(
          topRightPillRef.current,
          { scale: 0.82 },
          { scale: 1, duration: 0.48, ease: "back.out(2.5)" }
        );
      }
      if (topRightHeartIconRef.current) {
        gsap.fromTo(
          topRightHeartIconRef.current,
          { scale: 0.4, rotation: -20 },
          { scale: 1, rotation: 0, duration: 0.52, ease: "back.out(3)" }
        );
      }
    }, 1.3);
  };

  return (
    <>
      {/* TOP-RIGHT REAL-TIME HEART COUNTER PILL (TUCKED DRAWER WITH ARROW ON MOBILE) */}
      <div
        ref={topRightPillRef}
        className={`fixed top-3 right-0 sm:top-4 sm:right-4 z-50 transition-all duration-400 ease-out select-none ${
          showTopRightPill
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } ${
          isMobileExpanded
            ? "translate-x-0"
            : "translate-x-[calc(100%-28px)] sm:translate-x-0"
        }`}
      >
        <div className="inline-flex items-center rounded-l-full sm:rounded-full border border-r-0 sm:border-r border-neutral-200/90 bg-white/95 pr-3.5 pl-1.5 sm:px-3.5 py-1.5 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] backdrop-blur-md">
          {/* Mobile Arrow Trigger Tab */}
          <button
            type="button"
            aria-label={isMobileExpanded ? "Hide likes" : "Show likes"}
            onClick={() => {
              if (isMobileExpanded) {
                if (collapseTimerRef.current) {
                  clearTimeout(collapseTimerRef.current);
                }
                setIsMobileExpanded(false);
              } else {
                triggerMobileExpandFor5Seconds();
              }
            }}
            className="flex sm:hidden items-center justify-center pr-1.5 text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            {isMobileExpanded ? (
              <ChevronRight className="size-3.5" />
            ) : (
              <ChevronLeft className="size-3.5" />
            )}
          </button>

          <div
            onClick={() => {
              if (!isMobileExpanded) {
                triggerMobileExpandFor5Seconds();
              }
            }}
            className="inline-flex items-center gap-2"
          >
            <span className="relative flex items-center justify-center">
              <Heart
                ref={topRightHeartIconRef}
                className="size-3.5 fill-rose-500 text-rose-500"
              />
            </span>
            <span className="text-xs font-medium text-neutral-700">Liked</span>
            <span className="h-3 w-[1px] bg-neutral-200" />
            <span className="font-mono text-xs font-semibold text-neutral-950 tabular-nums">
              {isLoaded ? totalHearts.toLocaleString() : "…"}
            </span>
          </div>
        </div>
      </div>

      {/* FLYING HEART ELEMENT FOR TRANSITION TO TOP-RIGHT */}
      <div
        ref={flyingHeartRef}
        className="pointer-events-none fixed top-0 left-0 z-70 flex size-10 items-center justify-center rounded-full bg-linear-to-b from-rose-500 to-red-600 text-white shadow-xl opacity-0"
      >
        <Heart className="size-4.5 fill-white text-white" />
      </div>

      {/* CENTERED MODAL DIALOG WITH BLURRED BACKGROUND OVERLAY */}
      {isDialogOpen && (
        <div
          ref={backdropRef}
          onClick={handleDismiss}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/25 backdrop-blur-md px-4 select-none"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Like this website"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[350px] rounded-[26px] border border-neutral-200/90 bg-white p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 flex size-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex flex-col items-center text-center pt-1">
              {/* Handwritten Doodle Prompt + Curved Pencil Arrow */}
              <div className="flex items-center gap-1.5">
                <span
                  className="font-doodle text-[24px] leading-none text-neutral-700 -rotate-2"
                  style={{ filter: "url(#pencil-texture)" }}
                >
                  {hasLiked
                    ? "thank you for the love!"
                    : "enjoying the craft? drop a like"}
                </span>
                <svg
                  width="28"
                  height="24"
                  viewBox="0 0 26 22"
                  fill="none"
                  className="text-neutral-400 mt-1.5 shrink-0"
                  style={{ filter: "url(#pencil-texture)" }}
                >
                  <path
                    d="M2 3 C 14 3, 20 8, 18 19"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 15 L 18 20 L 23 15"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Interactive Heart Button Stage with Particle Burst */}
              <div className="relative my-5 flex items-center justify-center">
                {/* Ripple Ring */}
                <div
                  ref={rippleRef}
                  className="pointer-events-none absolute size-14 rounded-full border-2 border-rose-500 opacity-0"
                />

                {/* Radial Burst Particles */}
                <div
                  ref={burstContainerRef}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  {BURST_PARTICLES.map((p) => (
                    <div
                      key={p.id}
                      className="burst-p absolute opacity-0 text-rose-500"
                    >
                      <Heart className="size-3.5 fill-rose-500 text-rose-500" />
                    </div>
                  ))}
                </div>

                <button
                  ref={dialogHeartRef}
                  type="button"
                  onClick={handleHeartClick}
                  className={`group relative flex size-16 items-center justify-center rounded-[20px] shadow-lg ring-1 ring-inset transition-all duration-200 cursor-pointer ${
                    hasLiked
                      ? "bg-linear-to-b from-rose-500 to-red-600 ring-white/25 ring-offset-2 ring-offset-rose-500 text-white"
                      : "bg-[#FAFAF9] hover:bg-rose-50/70 ring-neutral-200/90 hover:ring-rose-200 text-neutral-800 hover:text-rose-500 hover:scale-105 active:scale-95"
                  }`}
                >
                  <Heart
                    className={`size-7 transition-transform duration-200 ${
                      hasLiked
                        ? "fill-white text-white scale-110"
                        : "group-hover:fill-rose-500/15 group-hover:scale-110"
                    }`}
                  />
                </button>
              </div>

              {/* Real-Time Subtitle / Live Count */}
              <p className="font-mono text-xs text-neutral-400 tabular-nums">
                {hasLiked
                  ? `${totalHearts.toLocaleString()} total likes on this website`
                  : `tap the heart · ${isLoaded ? totalHearts.toLocaleString() : "0"} real likes`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
