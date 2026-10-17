"use client";

import React, { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

import redrHeroImg from "@/public/redr-hero.png";
import bustthefileHeroImg from "@/public/bustthefile-hero.png";
import goodfellaHeroImg from "@/public/goodfella-hero.png";
import snookerHeroImg from "@/public/snooker-hero.png";
import anthryveHeroImg from "@/public/anthryve-hero.png";
import faizHeroImg from "@/public/faiz-hero.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectCardData {
  id: string;
  title: string;
  domain: string;
  description: string;
  stack: string[];
  url: string;
  offsetClass: string;
  coverImg: StaticImageData;
}

const PROJECTS: ProjectCardData[] = [
  {
    id: "redr",
    title: "redr.lol",
    domain: "redr.lol",
    description:
      "Custom biolink platform with instant @handle routing, custom domains, and media hosting.",
    stack: ["Next.js", "TypeScript", "Postgres"],
    url: "https://redr.lol",
    offsetClass: "sm:mt-0",
    coverImg: redrHeroImg,
  },
  {
    id: "bustthefile",
    title: "BustTheFile",
    domain: "bustthefile.vercel.app",
    description:
      "Windows desktop utility & interactive web sandbox that turns deleted files into physics confetti with 0% idle CPU.",
    stack: ["Next.js", "Win32 Hook", "TypeScript"],
    url: "https://bustthefile.vercel.app/",
    offsetClass: "sm:mt-10",
    coverImg: bustthefileHeroImg,
  },
  {
    id: "goodfella",
    title: "GoodFella",
    domain: "agency-rho-one.vercel.app",
    description:
      "Motion-first digital agency platform engineered with scroll choreography, editorial typography, and case studies.",
    stack: ["Next.js", "GSAP", "Tailwind"],
    url: "https://agency-rho-one.vercel.app/",
    offsetClass: "sm:mt-0",
    coverImg: goodfellaHeroImg,
  },
  {
    id: "snooker-lounge",
    title: "Diamond Lounge",
    domain: "snooker-lounge.vercel.app",
    description:
      "Premium snooker & gaming lounge platform featuring bento showcases, custom motion, and online table booking.",
    stack: ["Next.js", "GSAP", "Tailwind"],
    url: "https://snooker-lounge.vercel.app/",
    offsetClass: "sm:mt-10",
    coverImg: snookerHeroImg,
  },
  {
    id: "anthryve",
    title: "Anthryve",
    domain: "waterflow-nine.vercel.app",
    description:
      "AI-powered production workspace and growth engine built for high-converting SaaS videos and ad creatives.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://waterflow-nine.vercel.app/",
    offsetClass: "sm:mt-0",
    coverImg: anthryveHeroImg,
  },
  {
    id: "faiz-portfolio",
    title: "cryptovoid.ex",
    domain: "faizbuildstuff.biz",
    description:
      "Personal developer portfolio featuring live Discord presence, real-time local clock sync, and minimalist dark UI.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://www.faizbuildstuff.biz/",
    offsetClass: "sm:mt-10",
    coverImg: faizHeroImg,
  },
];

export default function ProjectsVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".work-header-reveal",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 86%",
          },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".project-updown-card");
      cards.forEach((card, i) => {
        const isRightColumn = i % 2 === 1;

        gsap.fromTo(
          card,
          { y: isRightColumn ? 32 : 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAFAF9] text-black py-1 sm:py-2 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-x-clip"
    >
      <div className="w-full max-w-[680px] mx-auto px-1 sm:px-2">
        {/* CLEAN MINIMALIST SECTION HEADER */}
        <div className="mb-4 sm:mb-6 flex items-baseline justify-between">
          <h2 className="work-header-reveal text-foreground/40 font-mono text-xs sm:text-sm uppercase tracking-wide">
            Projects
          </h2>
          <span className="work-header-reveal font-mono text-[11px] sm:text-xs text-neutral-400 tabular-nums">
            01 — 0{PROJECTS.length}
          </span>
        </div>

        {/* CLEAN STAGGERED 2-COLUMN PROJECT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
          {PROJECTS.map((project) => (
            <MinimalProjectCard
              key={project.id}
              project={project}
              isDimmed={hoveredId !== null && hoveredId !== project.id}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MinimalProjectCard({
  project,
  isDimmed,
  onHoverStart,
  onHoverEnd,
}: {
  project: ProjectCardData;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;
      yTo.current = gsap.quickTo(cardRef.current, "y", {
        duration: 0.35,
        ease: "power3.out",
      });
    },
    { scope: cardRef }
  );

  const handleMouseEnter = () => {
    onHoverStart();
    yTo.current?.(-4);
  };

  const handleMouseLeave = () => {
    onHoverEnd();
    yTo.current?.(0);
  };

  return (
    <div className={`project-updown-card relative ${project.offsetClass}`}>
      <a
        ref={cardRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group block rounded-[20px] border border-neutral-200/80 bg-white p-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] transition-[border-color,box-shadow,opacity] duration-300 select-none ${
          isDimmed ? "opacity-55" : "opacity-100"
        }`}
      >
        {/* CLEAN HERO COVER FRAME */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] border border-neutral-200/60 bg-neutral-100">
          <Image
            src={project.coverImg}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* MINIMALIST CARD FOOTER */}
        <div className="pt-3 pb-1.5 px-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-neutral-950">
              {project.title}
            </h3>

            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-neutral-400 group-hover:text-neutral-900 transition-colors">
              <span>{project.domain}</span>
              <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          <p className="mt-1 text-[13px] text-neutral-500 leading-[1.55] line-clamp-2">
            {project.description}
          </p>
        </div>
      </a>
    </div>
  );
}
