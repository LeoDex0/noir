"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { photos } from "@/content/photos";
import s from "./Hero.module.css";

const LETTERS = ["N", "O", "I", "R"];

/**
 * Opening shot (the intro itself is CSS, so it starts with the first paint, before hydration). The room is dark; a point of warm light opens over the plate, the name rises,
 * then the light widens to the full frame. Scrolling darkens the frame again and pulls the
 * letters apart, so the page falls into the black of the prologue.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionOK, () => {
        const q = gsap.utils.selector(root);
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          })
          .to(q("[data-media]"), { yPercent: 14, clipPath: "inset(7% 5% 7% 5%)" }, 0)
          .to(q("[data-shade]"), { opacity: 1 }, 0)
          .to(q("[data-spread='l']"), { xPercent: -16 }, 0)
          .to(q("[data-spread='r']"), { xPercent: 16 }, 0)
          .to(q("[data-word]"), { yPercent: -18 }, 0);
      });

      /* With a mouse, the plate and the name sit on slightly different planes. */
      mm.add(`${motionOK} and (pointer: fine)`, () => {
        const el = root.current!;
        const q = gsap.utils.selector(root);
        const px = gsap.quickTo(q("[data-depth]"), "x", { duration: 1.4, ease: "power3.out" });
        const py = gsap.quickTo(q("[data-depth]"), "y", { duration: 1.4, ease: "power3.out" });
        const wx = gsap.quickTo(q("[data-word-depth]"), "x", { duration: 1.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          px(nx * -26);
          py(ny * -18);
          wx(nx * 14);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className={s.hero} data-theme="dark" aria-labelledby="hero-title">
      <div className={s.media} data-media>
        <div className={s.depth} data-depth>
        <div className={s.plate} data-plate>
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            priority
            sizes="(max-aspect-ratio: 1/1) 100vh, 100vw"
            quality={80}
            placeholder="blur"
            className={`cover ${s.img}`}
          />
        </div>
        </div>
      </div>
      <div className={s.vignette} aria-hidden="true" />
      <div className={s.dark} data-dark aria-hidden="true" />
      <span className={s.spark} data-spark aria-hidden="true" />
      <div className={s.shade} data-shade aria-hidden="true" />

      <div className={s.content}>
        <p className={s.kicker} data-hero-fade style={{ "--i": 0 } as React.CSSProperties}>
          <span className="eyebrow">
            <b>Restaurant</b> &nbsp;/&nbsp; Lyon, Croix-Rousse
          </span>
          <span className="eyebrow">Autumn sequence</span>
        </p>

        <div data-word-depth className={s.wordDepth}>
        <h1 id="hero-title" className={`display ${s.word}`} data-word aria-label="NOIR">
          {LETTERS.map((ch, i) => (
            <span key={ch} className={s.box} data-spread={i < 2 ? "l" : "r"} aria-hidden="true">
              <span className={s.letter} data-letter style={{ "--i": i } as React.CSSProperties}>
                {ch}
              </span>
            </span>
          ))}
        </h1>
        </div>

        <div className={s.foot}>
          <p className={s.lede}>
            <span className={s.ml}>
              <span style={{ "--i": 0 } as React.CSSProperties}>An experience that begins</span>
            </span>
            <span className={s.ml}>
              <span style={{ "--i": 1 } as React.CSSProperties}>
                <em>long before</em> the first taste.
              </span>
            </span>
          </p>
          <p className={s.note} data-hero-fade style={{ "--i": 2 } as React.CSSProperties}>
            Seven courses and twenty-four seats, served after dark in a seventeenth-century silk workshop.
          </p>
          <a
            href="#prologue"
            className={s.cue}
            data-hero-fade
            style={{ "--i": 3 } as React.CSSProperties}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#prologue");
            }}
          >
            <span>Descend</span>
            <span className={s.cueLine} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
