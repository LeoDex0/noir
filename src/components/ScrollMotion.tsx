"use client";

import { gsap, SplitText, useGSAP, motionOK } from "@/lib/gsap";

const FROM: Record<string, string> = {
  clip: "inset(100% 0% 0% 0%)",
  drop: "inset(0% 0% 100% 0%)",
  wipe: "inset(0% 100% 0% 0%)",
  iris: "inset(22% 22% 22% 22%)",
};

/* One-shot reveals, started when an element is a little way into the viewport. */
function reveal(el: HTMLElement) {
  const kind = el.dataset.reveal ?? "fade";
  const delay = Number(el.dataset.delay ?? 0);

  if (kind === "lines") {
    gsap.set(el, { autoAlpha: 1 });
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, { yPercent: 115, duration: 1.35, stagger: 0.085, delay, ease: "expo.out" }),
    });
    return;
  }

  if (kind in FROM) {
    const img = el.querySelector("img");
    const tl = gsap.timeline({ delay });
    tl.set(el, { autoAlpha: 1 }).fromTo(
      el,
      { clipPath: FROM[kind] },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
    );
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0.15);
    return;
  }

  if (kind === "rule") {
    gsap.fromTo(
      el,
      { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1.6, ease: "expo.inOut", delay },
    );
    return;
  }

  gsap.fromTo(el, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", delay });
}

/* Scrubbed effects get their ScrollTrigger only when they come near the viewport. */
function scrub(el: HTMLElement) {
  const trigger = { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true };
  if (el.dataset.drift) {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    gsap.fromTo(el, { xPercent: 0 }, { xPercent: Number(el.dataset.drift), ease: "none", scrollTrigger: { ...trigger, trigger: el } });
    return;
  }
  if (el.dataset.draw !== undefined) {
    const scope = el.closest<HTMLElement>("[data-draw-scope]") ?? el.parentElement;
    gsap.fromTo(
      el,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: scope, start: "top 72%", end: "bottom 60%", scrub: 0.6 } },
    );
    return;
  }
  if (el.dataset.open !== undefined) {
    gsap.fromTo(
      el,
      { clipPath: "inset(0% 5% 0% 5%)" },
      { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 15%", scrub: true } },
    );
    return;
  }
  if (el.dataset.zoom) {
    gsap.fromTo(el, { scale: Number(el.dataset.zoom) }, { scale: 1, ease: "none", scrollTrigger: trigger });
    return;
  }
  const speed = Number(el.dataset.speed);
  gsap.fromTo(el, { yPercent: -speed }, { yPercent: speed, ease: "none", scrollTrigger: trigger });
}

/**
 * Wires every [data-reveal], [data-speed], [data-drift] and [data-zoom] on the page. Work is
 * created lazily through two observers, so the page does not pay for effects far below the fold.
 */
export function ScrollMotion() {
  useGSAP(() => {
    if (!window.matchMedia(motionOK).matches) return;

    const ctx = gsap.context(() => {});
    let cancelled = false;

    const enter = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          enter.unobserve(entry.target);
          ctx.add(() => reveal(entry.target as HTMLElement));
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );

    const near = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          near.unobserve(entry.target);
          ctx.add(() => scrub(entry.target as HTMLElement));
        }),
      { rootMargin: "60% 0px 60% 0px" },
    );

    document.fonts.ready.then(() => {
      if (cancelled) return;
      document.querySelectorAll("[data-reveal]").forEach((el) => enter.observe(el));
      document.querySelectorAll("[data-speed], [data-drift], [data-zoom], [data-open], [data-draw]").forEach((el) => near.observe(el));
    });

    return () => {
      cancelled = true;
      enter.disconnect();
      near.disconnect();
      ctx.revert();
    };
  });

  return null;
}
