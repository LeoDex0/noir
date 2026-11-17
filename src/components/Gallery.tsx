"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, motionOK } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";
import { gallery } from "@/content/site";
import s from "./Gallery.module.css";

type Rect = { left: number; top: number; width: number; height: number };
const N = gallery.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Where the full image sits in the viewer: as large as possible, keeping room for the controls. */
function targetRect(i: number): Rect {
  const { width: w0, height: h0 } = gallery[i]!.photo.src;
  const ar = w0 / h0;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const small = vw < 700;
  const padX = small ? 12 : Math.max(72, vw * 0.07);
  const padTop = small ? 64 : 76;
  const padBottom = small ? 120 : 86;
  const aw = vw - padX * 2;
  const ah = vh - padTop - padBottom;
  let w = aw;
  let h = aw / ar;
  if (h > ah) {
    h = ah;
    w = ah * ar;
  }
  return { left: (vw - w) / 2, top: padTop + (ah - h) / 2, width: w, height: h };
}

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const phase = useRef<"idle" | "opening" | "open" | "closing">("idle");
  const dir = useRef(1);
  const poster = useRef("");
  const touch = useRef<{ x: number; y: number } | null>(null);

  const motion = () => window.matchMedia(motionOK).matches;

  const thumbRect = (i: number): Rect | null => {
    const el = thumbs.current[i]?.querySelector<HTMLElement>("[data-pic]");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return null;
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const open = (i: number) => {
    poster.current = thumbs.current[i]?.querySelector("img")?.currentSrc ?? "";
    phase.current = "opening";
    lockScroll(true);
    setIndex(i);
  };

  const close = useCallback(() => {
    if (index === null || phase.current === "closing") return;
    phase.current = "closing";
    const i = index;
    const from = thumbRect(i);
    const k = motion() ? 1 : 0;
    const done = () => {
      phase.current = "idle";
      setIndex(null);
      lockScroll(false);
      thumbs.current[i]?.focus({ preventScroll: true });
    };
    const tl = gsap.timeline({ onComplete: done });
    tl.to(viewer.current!.querySelectorAll("[data-chrome]"), { autoAlpha: 0, duration: 0.25 * k }, 0);
    if (from) tl.to(box.current, { ...from, duration: 0.85 * k, ease: "expo.inOut" }, 0);
    else tl.to(box.current, { autoAlpha: 0, scale: 0.96, duration: 0.5 * k }, 0);
    tl.to(viewer.current!.querySelector("[data-bg]"), { opacity: 0, duration: 0.6 * k, ease: "power2.inOut" }, 0.25 * k);
  }, [index]);

  const step = useCallback(
    (d: number) => {
      if (index === null || phase.current !== "open") return;
      dir.current = d;
      const next = (index + d + N) % N;
      poster.current = thumbs.current[next]?.querySelector("img")?.currentSrc ?? "";
      setIndex(next);
    },
    [index],
  );

  /* Open from the thumbnail, or swap the image when stepping through. */
  useLayoutEffect(() => {
    if (index === null || !box.current) return;
    const to = targetRect(index);
    const k = motion() ? 1 : 0;

    if (phase.current === "opening") {
      const from = thumbRect(index);
      gsap.set(box.current, { ...to, autoAlpha: 1, scale: 1 });
      const tl = gsap.timeline({
        onComplete: () => {
          phase.current = "open";
        },
      });
      tl.fromTo(viewer.current!.querySelector("[data-bg]"), { opacity: 0 }, { opacity: 1, duration: 0.6 * k, ease: "power2.out" }, 0);
      if (from) tl.from(box.current, { ...from, duration: 0.95 * k, ease: "expo.inOut" }, 0);
      tl.fromTo(
        viewer.current!.querySelectorAll("[data-chrome]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 * k, stagger: 0.05 * k },
        0.55 * k,
      );
      closeBtn.current?.focus({ preventScroll: true });
      return;
    }

    gsap.set(box.current, to);
    gsap.fromTo(
      box.current.querySelector("[data-full]"),
      { autoAlpha: 0, x: 40 * dir.current * k },
      { autoAlpha: 1, x: 0, duration: 0.8 * k, ease: "expo.out" },
    );
  }, [index]);

  /* Keyboard, focus trap and resize while the viewer is open. */
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && viewer.current) {
        const f = [...viewer.current.querySelectorAll<HTMLElement>("button")];
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => box.current && gsap.set(box.current, targetRect(index));
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [index, close, step]);

  const current = index === null ? null : gallery[index]!;

  return (
    <section id="gallery" className={s.section} data-theme="dark" aria-labelledby="gallery-title">
      <div className={s.head}>
        <p className="eyebrow" data-reveal>
          <b>V</b> &nbsp; Gallery
        </p>
        <h2 id="gallery-title" className={`display ${s.title}`} data-reveal="lines">
          Notes from <em>after dark</em>
        </h2>
        <p className={s.sub} data-reveal>
          Plates from past sequences, the kitchen at work and the room between services. Select any image to
          view it full screen.
        </p>
      </div>

      <ul className={s.grid}>
        {gallery.map((g, i) => (
          <li key={g.caption} className={`${s.cell} ${s[g.layout]}`}>
            <button
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              type="button"
              className={s.thumb}
              onClick={() => open(i)}
            >
              <span className="visually-hidden">View full screen: </span>
              <span className={s.pic} data-pic data-reveal={i % 3 === 0 ? "clip" : i % 3 === 1 ? "drop" : "iris"}>
                <Image
                  src={g.photo.src}
                  alt={g.photo.alt}
                  fill
                  sizes="(min-width: 900px) 40vw, 90vw"
                  quality={70}
                  className={`cover ${s.img}`}
                />
                <span className={s.view} aria-hidden="true">
                  View
                </span>
              </span>
              <span className={s.cap}>
                <span className={s.capNum}>Pl. {pad(i + 1)}</span>
                <span>{g.caption}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          ref={viewer}
          className={s.viewer}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onPointerDown={(e) => {
            touch.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            const t = touch.current;
            touch.current = null;
            if (!t) return;
            const dx = e.clientX - t.x;
            const dy = e.clientY - t.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
          }}
        >
          <div className={s.bg} data-bg onClick={close} />
          <div
            ref={box}
            className={s.box}
            style={{ backgroundImage: poster.current ? `url("${poster.current}")` : undefined }}
          >
            <Image
              key={index}
              data-full
              src={current.photo.src}
              alt={current.photo.alt}
              fill
              sizes="92vw"
              quality={80}
              className="cover"
            />
          </div>

          <div className={s.top} data-chrome>
            <span className={s.count} aria-live="polite">
              {pad((index ?? 0) + 1)} <span>/ {pad(N)}</span>
            </span>
            <button ref={closeBtn} type="button" className={s.close} onClick={close}>
              Close <span className={s.x} aria-hidden="true" />
            </button>
          </div>

          <div className={s.bottom} data-chrome>
            <button type="button" className={s.nav} onClick={() => step(-1)} aria-label="Previous image">
              <span className="arrow" aria-hidden="true" style={{ transform: "scaleX(-1)" }} />
            </button>
            <p className={s.viewerCap}>{current.caption}</p>
            <button type="button" className={s.nav} onClick={() => step(1)} aria-label="Next image">
              <span className="arrow" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
