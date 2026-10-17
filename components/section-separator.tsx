import React, { useId } from "react";

export default function SectionSeparator() {
  const rawId = useId();
  const patternId = `sec-sep-${rawId.replace(/:/g, "")}`;

  return (
    <div
      role="separator"
      aria-hidden="true"
      className="w-full bg-[#FAFAF9] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex justify-center select-none"
    >
      <div className="w-full max-w-[680px] mx-auto px-1 sm:px-2">
        <svg
          className="pointer-events-none h-1 w-full text-neutral-300"
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
      </div>
    </div>
  );
}
