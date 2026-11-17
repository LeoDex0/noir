"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { photos, type Photo } from "@/content/photos";
import s from "./Room.module.css";

type Fig = { photo: Photo; cap: string; cls: string; reveal: string; sizes: string; speed?: string };

const ROOMS: Fig[] = [
  { photo: photos.stone, cap: "Upstairs, the weavers' workshop. The evening starts here, with a glass by the hearth.", cls: "a", reveal: "wipe", sizes: "(min-width: 900px) 62vw, 100vw", speed: "5" },
  { photo: photos.counter, cap: "The counter. Eight seats facing the fire.", cls: "b", reveal: "clip", sizes: "(min-width: 900px) 30vw, 70vw", speed: "8" },
  { photo: photos.private, cap: "The small room under the stairs, for up to ten.", cls: "d", reveal: "clip", sizes: "(min-width: 900px) 52vw, 100vw", speed: "9" },
];

const DETAILS: Fig[] = [
  { photo: photos.candle, cap: "Beeswax candles from the Pilat", cls: "e", reveal: "iris", sizes: "(min-width: 900px) 28vw, 70vw" },
  { photo: photos.glasses, cap: "Glass blown by hand, cleared after every course", cls: "f", reveal: "iris", sizes: "(min-width: 900px) 24vw, 60vw", speed: "11" },
  { photo: photos.wall, cap: "Limestone from the Mont d'Or, left as the weavers found it", cls: "g", reveal: "iris", sizes: "(min-width: 900px) 34vw, 80vw" },
];

function Figure({ f, i }: { f: Fig; i: number }) {
  return (
    <figure className={`${s.fig} ${s[f.cls]}`}>
      <div className={s.picWrap} data-speed={f.speed}>
        <div className={s.pic} data-reveal={f.reveal}>
          <Image src={f.photo.src} alt={f.photo.alt} fill sizes={f.sizes} quality={80} className="cover" />
        </div>
      </div>
      <figcaption className={s.cap} data-reveal>
        <span className={s.capNum}>Fig. {String(i).padStart(2, "0")}</span> {f.cap}
      </figcaption>
    </figure>
  );
}

export function Room() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);

  /* The room opens from a small window to the full frame while the scene is pinned. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: motionOK, small: "(max-width: 900px)" },
        (ctx) => {
          if (!ctx.conditions?.motion) return;
          const small = ctx.conditions.small;
          const q = gsap.utils.selector(scene);
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: scene.current,
                start: "top top",
                end: "+=130%",
                pin: true,
                scrub: true,
                anticipatePin: 1,
              },
            })
            /* Through the arch: the doorway grows past the camera and the vault opens behind it. */
            .fromTo(q("[data-door]"), { scale: 1 }, { scale: small ? 5 : 4.2, ease: "power2.in", duration: 0.62 }, 0)
            .to(q("[data-door]"), { autoAlpha: 0, ease: "power1.in", duration: 0.16 }, 0.48)
            .fromTo(q("[data-window] img"), { scale: 1.4 }, { scale: 1.02, ease: "power2.out", duration: 0.9 }, 0.1)
            .fromTo(q("[data-left]"), { autoAlpha: 0, xPercent: small ? 0 : 12 }, { autoAlpha: 1, xPercent: 0, duration: 0.3 }, 0.55)
            .fromTo(q("[data-right]"), { autoAlpha: 0, xPercent: small ? 0 : -12 }, { autoAlpha: 1, xPercent: 0, duration: 0.3 }, 0.62)
            .fromTo(q("[data-dim]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.55)
            .fromTo(q("[data-after]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.75)
            .fromTo(q("[data-door-cap]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 0.12);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="room" ref={root} className={s.section} data-theme="dark" aria-labelledby="room-title">
      <div ref={scene} className={s.scene}>
        <div className={s.window} data-window>
          <Image
            src={photos.cellar.src}
            alt={photos.cellar.alt}
            fill
            sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
            quality={80}
            className="cover"
          />
          <div className={s.dim} data-dim aria-hidden="true" />
        </div>
        <div className={s.door} data-door aria-hidden="true">
          <Image src={photos.arch.src} alt="" fill sizes="(max-aspect-ratio: 3/4) 75vh, 100vw" quality={80} className={`cover ${s.doorImg}`} />
        </div>
        <p className={s.doorCap} data-door-cap aria-hidden="true">
          The stairs go down before they go in
        </p>
        <p className={`eyebrow ${s.label}`}>
          <b>IV</b> &nbsp; The Room
        </p>
        <h2 id="room-title" className={`display ${s.title}`}>
          <span data-left className={s.tl}>
            Twenty-four seats
          </span>
          <span data-right className={s.tr}>
            <em>under stone.</em>
          </span>
        </h2>
        <p className={s.after} data-after>
          A seventeenth-century vault under the weavers' workshop. We only open it after dark.
        </p>
      </div>

      <div className={s.body}>
        <p className={`display ${s.lead}`} data-reveal="lines">
          The silk weavers worked upstairs, by the light of tall windows, and kept their bales in the cellar
          below. We cook and serve under that vault, and we left the limestone exactly as they did.
        </p>

        <div className={s.grid}>
          {ROOMS.map((f, i) => (
            <Figure key={f.cls} f={f} i={i + 1} />
          ))}
        </div>

        <div className={s.details}>
          <h3 className={`eyebrow ${s.detailsHead}`} data-reveal>
            <b>Details</b> &nbsp; Up close
          </h3>
          <div className={s.detailRow}>
            {DETAILS.map((f, i) => (
              <Figure key={f.cls} f={f} i={i + 5} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
