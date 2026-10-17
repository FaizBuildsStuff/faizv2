"use client";

import React, { useId, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

gsap.registerPlugin(useGSAP);

function DottedLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const rawId = useId();
  const patternId = `hero-dot-${rawId.replace(/:/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-neutral-900 font-medium relative overflow-visible hover:text-black transition-colors"
    >
      <span
        className="relative inline-block"
        style={{ paddingBottom: "0.05rem" }}
      >
        {children}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full text-neutral-400 group-hover:text-neutral-800 transition-colors"
          style={{ height: "4px" }}
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patternId}
              width="6"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="3" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </span>
    </a>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const pfpWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
      });

      gsap.set(bannerRef.current, { clipPath: "inset(0 0 100% 0 round 26px)" });
      gsap.set(pfpWrapRef.current, { scale: 0.75, opacity: 0, y: 14 });
      gsap.set(".hero-stagger", { y: 14, opacity: 0 });
      gsap.set(".pencil-write-mask", { clipPath: "inset(0 100% 0 0)" });

      const paths = gsap.utils.toArray<SVGGeometryElement>(
        ".pencil-stroke-path"
      );
      paths.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 240;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      tl.to(bannerRef.current, {
        clipPath: "inset(0 0 0% 0 round 26px)",
        duration: 0.95,
        ease: "power4.inOut",
      })
        .to(
          pfpWrapRef.current,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "back.out(1.5)",
          },
          "-=0.4"
        )
        .to(
          ".hero-stagger",
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
          },
          "-=0.45"
        )
        .to(
          ".pencil-write-mask",
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.65,
            stagger: 0.1,
            ease: "power1.inOut",
          },
          "-=0.35"
        )
        .to(
          ".pencil-stroke-path",
          {
            strokeDashoffset: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.55"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FAFAF9] text-black flex flex-col items-center pt-5 sm:pt-8 pb-2 overflow-x-hidden"
    >
      {/* Hidden SVG Filter for Authentic Graphite Pencil Texture */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter
            id="pencil-texture"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 w-full max-w-[680px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Top Margin Pencil Header Notes above the Banner */}
        <div
          className="mb-1.5 flex items-center justify-between px-1.5 sm:px-2 select-none"
          style={{ filter: "url(#pencil-texture)" }}
        >
          <span className="pencil-write-mask font-doodle text-[15px] sm:text-[18px] text-neutral-400">
            ✎ portfolio // 2026 edition
          </span>
          <span className="pencil-write-mask font-doodle text-[15px] sm:text-[18px] text-neutral-500">
            available for select builds ✦
          </span>
        </div>

        {/* 1. CLEAN CURVED BANNER + SIDE PENCIL CALLOUT */}
        <div className="relative w-full">
          {/* Left Floating Pencil Margin Callout */}
          <div className="pointer-events-none hidden lg:flex flex-col items-end absolute -left-42 top-12 z-20 select-none">
            <span
              className="pencil-write-mask font-doodle text-[20px] leading-tight text-neutral-600 -rotate-4 text-right"
              style={{ filter: "url(#pencil-texture)" }}
            >
              shipping real SaaS
              <span className="block text-[15px] text-neutral-400">
                &amp; high-speed web apps
              </span>
            </span>
            <svg
              width="64"
              height="30"
              viewBox="0 0 64 30"
              fill="none"
              className="mt-1 mr-1 text-neutral-500"
              style={{ filter: "url(#pencil-texture)" }}
            >
              <path
                className="pencil-stroke-path"
                d="M6 6 C 22 22, 40 24, 58 16"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                className="pencil-stroke-path"
                d="M50 10 L 59 16 L 52 23"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            ref={bannerRef}
            className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[26px] border border-neutral-200/80 bg-white pb-6 sm:pb-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] select-none"
          >
            <div className="relative aspect-[16/8.2] sm:aspect-[16/6.2] w-full overflow-hidden">
              <Image
                src="/banner.png"
                alt="FaizuRrehman Banner"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 680px"
                className="object-contain object-center scale-[1.65] sm:scale-100 origin-center"
              />
            </div>
          </div>
        </div>

        {/* 2. OVERLAPPING PFP + SYMMETRICAL PENCIL NOTES */}
        <div className="relative flex flex-col items-center -mt-9 sm:-mt-14 z-20 px-1 sm:px-4">
          <div className="relative flex items-center justify-center">
            {/* Left PFP Pencil Note */}
            <div className="pointer-events-none absolute -left-32 sm:-left-36 top-14 hidden sm:flex items-center gap-1.5 select-none">
              <div className="text-right -rotate-6">
                <span
                  className="pencil-write-mask block font-doodle text-[20px] leading-none text-neutral-600"
                  style={{ filter: "url(#pencil-texture)" }}
                >
                  that&apos;s me
                </span>
                <span
                  className="pencil-write-mask block font-doodle text-[14px] text-neutral-400"
                  style={{ filter: "url(#pencil-texture)" }}
                >
                  (late-night mode)
                </span>
              </div>
              <svg
                width="38"
                height="22"
                viewBox="0 0 38 22"
                fill="none"
                className="text-neutral-500 shrink-0"
                style={{ filter: "url(#pencil-texture)" }}
              >
                <path
                  className="pencil-stroke-path"
                  d="M2 15 C 14 17, 25 14, 34 7"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  className="pencil-stroke-path"
                  d="M27 6 L 35 7 L 32 14"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Right PFP Pencil Note */}
            <div className="pointer-events-none absolute -right-34 sm:-right-40 top-14 hidden sm:flex items-center gap-1.5 select-none">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                className="text-neutral-500 shrink-0"
                style={{ filter: "url(#pencil-texture)" }}
              >
                <path
                  className="pencil-stroke-path"
                  d="M16 3 L 19 13 L 29 16 L 19 19 L 16 29 L 13 19 L 3 16 L 13 13 Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="rotate-4 text-left">
                <span
                  className="pencil-write-mask block font-doodle text-[19px] leading-none text-neutral-600"
                  style={{ filter: "url(#pencil-texture)" }}
                >
                  full-stack craft
                </span>
                <span
                  className="pencil-write-mask block font-doodle text-[14px] text-neutral-400"
                  style={{ filter: "url(#pencil-texture)" }}
                >
                  design + engineering
                </span>
              </div>
            </div>

            <div
              ref={pfpWrapRef}
              className="group/pfp relative flex items-center justify-center rounded-full bg-white p-1 sm:p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.1)] ring-1 ring-neutral-200/80"
            >
              <Avatar className="size-19 sm:size-24 ring-2 ring-black/90 transition-transform duration-500 ease-out group-hover/pfp:scale-[1.03]">
                <AvatarImage
                  src="/pfp.jpg"
                  alt="FaizuRrehman"
                  className="object-cover object-[center_68%]"
                />
                <AvatarFallback className="bg-neutral-950 text-white font-mono text-sm">
                  FR
                </AvatarFallback>
                <AvatarBadge className="size-3 sm:size-3.5 bg-black text-white ring-2 ring-white bottom-0.5 right-0.5">
                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                </AvatarBadge>
              </Avatar>
            </div>
          </div>

          {/* 3. PREMIUM NAME "FaizuRrehman" + PENCIL UNDERLINE */}
          <div className="hero-stagger mt-3 sm:mt-3.5 flex flex-col items-center text-center">
            <div className="relative inline-block">
              <h1 className="text-[28px] sm:text-4xl font-semibold tracking-[-0.04em] text-neutral-950 leading-tight">
                <span>Faizu</span>
                <span className="font-serif italic font-normal tracking-tight ml-0.5">
                  Rrehman
                </span>
              </h1>

              <svg
                viewBox="0 0 240 16"
                fill="none"
                className="pointer-events-none w-full h-3 sm:h-3.5 -mt-0.5 text-neutral-900"
                style={{ filter: "url(#pencil-texture)" }}
              >
                <path
                  className="pencil-stroke-path"
                  d="M10 8 C 75 3, 175 13, 230 6"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <path
                  className="pencil-stroke-path"
                  d="M35 13 C 105 9, 175 14, 215 11"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>

          {/* 4. CLEAN, MINIMALIST DUAL-HANDLE PILL */}
          <div className="hero-stagger mt-2 flex items-center justify-center max-w-full">
            <div className="inline-flex items-center rounded-full border border-neutral-200/80 bg-white p-0.5 sm:p-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <a
                href="https://github.com/FaizBuildsStuff"
                target="_blank"
                rel="noopener noreferrer"
                className="group/h inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1 text-[11.5px] sm:text-xs font-medium text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-950 transition-colors whitespace-nowrap"
              >
                <span>@FaizBuildsStuff</span>
                <ArrowUpRight className="size-3 text-neutral-400 group-hover/h:text-neutral-800 group-hover/h:translate-x-0.5 group-hover/h:-translate-y-0.5 transition-all" />
              </a>

              <span className="h-3.5 w-[1px] bg-neutral-200/90" />

              <a
                href="https://x.com/cryptoxfz"
                target="_blank"
                rel="noopener noreferrer"
                className="group/h inline-flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1 text-[11.5px] sm:text-xs font-medium text-neutral-500 hover:bg-neutral-100/80 hover:text-neutral-950 transition-colors whitespace-nowrap"
              >
                <span>@cryptoxfz</span>
                <ArrowUpRight className="size-3 text-neutral-400 group-hover/h:text-neutral-800 group-hover/h:translate-x-0.5 group-hover/h:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* 5. EDITORIAL MULTI-PARAGRAPH BIO WITH DOTTED-UNDERLINE LINKS */}
          <div className="hero-stagger mt-5 sm:mt-6 max-w-[590px] mx-auto px-1 sm:px-2 text-left text-[14px] sm:text-[15px] leading-[1.68] tracking-[-0.01em] text-neutral-600 space-y-3.5">
            <p>
              I&apos;m a 17-year-old software engineer at heart, tinkering with
              full-stack web apps, AI, and code almost 90% of the time. I&apos;m
              mostly active on{" "}
              <DottedLink href="https://x.com/cryptoxfz">
                X / Twitter
              </DottedLink>{" "}
              and{" "}
              <DottedLink href="https://x.com/cryptoxfz">
                @cryptoxfz
              </DottedLink>{" "}
              where I share everything.
            </p>

            <p>
              When I&apos;m not coding, I usually explore{" "}
              <span className="text-neutral-800">Design Engineering</span>,
              GSAP motion systems, and front-end design taste across my{" "}
              <DottedLink href="https://www.faizbuildstuff.biz/">
                Live Lab &amp; Portfolio
              </DottedLink>
              .
            </p>

            <p>
              I&apos;ve been building my own SaaS products and tools like{" "}
              <DottedLink href="https://redr.lol">redr.lol</DottedLink> and{" "}
              <DottedLink href="https://bustthefile.vercel.app/">
                BustTheFile
              </DottedLink>{" "}
              from the ground up. My favourite thing is shipping new features,
              refining micro-interactions, and building fast software that real
              people use every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
