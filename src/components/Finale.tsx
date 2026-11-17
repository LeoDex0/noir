"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { photos } from "@/content/photos";
import s from "./Visit.module.css";

const flame = getImageProps({ src: photos.flame.src, alt: "", width: 960, quality: 70 }).props.src;

/**
 * The last frame: the name in near-black, lit from inside by the hearth wherever the light falls.
 * The light opens as the page reaches its end and, with a mouse, follows the pointer.
 */
export function Finale() {
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  /* The fire texture and the scroll trigger are only set up when the end of the page is close,
     after the sections above it have been laid out. */
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "150% 0px" });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!near) return;
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(motionOK, () => {
        gsap.fromTo(
          el,
          { "--mr": 0 },
          {
            "--mr": 34,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.8 },
          },
        );
      });
      mm.add(`${motionOK} and (pointer: fine)`, () => {
        const x = gsap.quickTo(el, "--mx", { duration: 0.9, ease: "power3.out" });
        const y = gsap.quickTo(el, "--my", { duration: 0.9, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x(((e.clientX - r.left) / r.width) * 100);
          y(((e.clientY - r.top) / r.height) * 100);
        };
        const leave = () => {
          x(50);
          y(62);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [near] },
  );

  return (
    <div ref={root} className={s.finale} aria-hidden="true">
      <p className={s.word}>NOIR</p>
      <p className={`${s.word} ${s.lit}`} style={near ? { backgroundImage: `url("${flame}")` } : undefined}>
        NOIR
      </p>
    </div>
  );
}
