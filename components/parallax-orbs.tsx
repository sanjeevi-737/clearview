"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxOrbs() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cv-orb").forEach((orb) => {
        gsap.to(orb, {
          yPercent: 40,
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: orb,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="cv-orb absolute -left-40 top-[18%] h-[480px] w-[480px] rounded-full bg-indigo-600/[0.10] blur-[140px]" />
      <div className="cv-orb absolute -right-40 top-[48%] h-[440px] w-[440px] rounded-full bg-violet-600/[0.10] blur-[130px]" />
      <div className="cv-orb absolute bottom-[2%] left-[28%] h-[360px] w-[360px] rounded-full bg-cyan-500/[0.07] blur-[120px]" />
    </div>
  );
}
