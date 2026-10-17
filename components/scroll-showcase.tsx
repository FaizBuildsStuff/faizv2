"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Code2, Sparkles, Layers, Terminal, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SkillItem {
  title: string;
  description: string;
  badgeClass: string;
  icon: React.ReactNode;
}

const THINGS_I_DO: SkillItem[] = [
  {
    title: "Full-Stack Web Dev",
    description:
      "Next.js, React, TypeScript, Node.js & Postgres for fast, scalable web apps.",
    badgeClass:
      "bg-linear-to-b from-blue-400 to-blue-600 ring-offset-blue-500",
    icon: (
      <Code2 className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
  },
  {
    title: "Design & Motion UI",
    description:
      "Tailwind CSS, GSAP, Framer Motion & shadcn/ui with high-craft interactions.",
    badgeClass:
      "bg-linear-to-b from-orange-400 to-orange-600 ring-offset-orange-500",
    icon: (
      <Layers className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
  },
  {
    title: "Best with AI & LLMs",
    description:
      "AI-native workflows, LLM integrations, agents & shipping products 10× faster.",
    badgeClass:
      "bg-linear-to-b from-emerald-400 to-emerald-600 ring-offset-emerald-500",
    icon: (
      <Sparkles className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
  },
  {
    title: "Languages & Core",
    description:
      "TypeScript, JavaScript, Python, SQL, HTML/CSS & native Windows hooks.",
    badgeClass:
      "bg-linear-to-b from-[#5B92FF] to-[#3074FE] ring-offset-[#3074FE]",
    icon: (
      <Terminal className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
  },
  {
    title: "SaaS & Product Builds",
    description:
      "End-to-end product architecture, auth, custom domains & cloud deployments.",
    badgeClass: "bg-linear-to-b from-red-400 to-red-600 ring-offset-red-500",
    icon: (
      <Rocket className="size-4 text-white drop-shadow-xl drop-shadow-black/40" />
    ),
  },
];

export default function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".things-i-do-item",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 86%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAFAF9] text-black py-1 sm:py-2 px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
      <div className="w-full max-w-[680px] mx-auto px-1 sm:px-2">
        <h2 className="things-i-do-item text-foreground/40 font-mono text-xs sm:text-sm uppercase tracking-wide">
          Things I do
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          {THINGS_I_DO.map((item) => (
            <div
              key={item.title}
              className="things-i-do-item group flex items-start md:items-center gap-3.5 md:gap-3"
            >
              <div
                className={`relative mt-0.5 md:mt-0 flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm align-middle shadow-lg ring-1 ring-white/20 ring-offset-2 ring-inset transition-transform duration-200 group-hover:scale-105 ${item.badgeClass}`}
              >
                {item.icon}
              </div>

              <div className="flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2 min-w-0">
                <p className="text-foreground font-medium text-[14.5px] sm:text-[15px] leading-snug shrink-0">
                  {item.title}
                </p>

                <div className="hidden size-1 shrink-0 rounded-full bg-neutral-300 md:block" />

                <p className="text-foreground/70 text-[13.5px] sm:text-[15px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
