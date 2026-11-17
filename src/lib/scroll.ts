import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

export function scrollToTarget(target: string | number, immediate = false) {
  const offset = typeof target === "string" ? 0 : undefined;
  if (instance) {
    if (immediate) instance.resize();
    instance.scrollTo(target, { immediate, offset, force: true });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "instant" : "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
  }
}

export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
