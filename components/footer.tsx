"use client";

import React, { useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function DottedLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const rawId = useId();
  const patternId = `dot-underline-${rawId.replace(/:/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-neutral-800 hover:text-black relative overflow-visible transition-colors"
    >
      <span
        className="relative inline-block"
        style={{ paddingBottom: "0.05rem" }}
      >
        {children}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full text-neutral-400 group-hover:text-neutral-700 transition-colors"
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

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const sigRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sigRef.current) return;
      gsap.fromTo(
        sigRef.current,
        { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.4 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 92%",
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-2 bg-[#FAFAF9]">
      <footer
        ref={footerRef}
        className="my-8 flex flex-col items-center gap-4 select-none"
      >
        {/* Cursive Signature: FaizuRrehman */}
        <div
          ref={sigRef}
          className="font-signature text-[32px] sm:text-[34px] leading-none text-[#4c4946] tracking-normal py-1"
          style={{ WebkitTextStroke: "0.35px currentColor" }}
        >
          FaizuRrehman
        </div>

        {/* Two-line attribution with exact SVG dotted underlines */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-neutral-400 text-center text-sm text-balance">
            Built by yours truly. Here&apos;s the{" "}
            <DottedLink href="https://github.com/FaizBuildsStuff">
              code
            </DottedLink>{" "}
            {" "}
            explaining it.
          </p>
          <p className="text-neutral-400 text-center text-sm text-balance">
            Website heavily inspired by{" "}
            <DottedLink href="https://www.manuarora.in/">Manu Arora</DottedLink>
          </p>
        </div>
      </footer>
    </div>
  );
}
