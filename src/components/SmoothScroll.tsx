"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP, motionOK } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    /* Lenis only adds value with a mouse wheel; touch devices keep native scrolling. */
    mm.add(`${motionOK} and (pointer: fine)`, () => {
      const lenis = new Lenis({ lerp: 0.085, anchors: true });
      const tick = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    });

    return () => mm.revert();
  });

  return null;
}
