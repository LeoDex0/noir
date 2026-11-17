"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { nav, roman, site, hours } from "@/content/site";
import s from "./SiteHeader.module.css";

export function SiteHeader() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hidden, setHidden] = useState(false);
  const [past, setPast] = useState(false);
  const [active, setActive] = useState("");

  /* Theme under the bar, current chapter, and hide-on-scroll-down. */
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main [data-theme], #visit")];
    const themeIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setTheme((e.target as HTMLElement).dataset.theme === "light" ? "light" : "dark");
        }),
      { rootMargin: "-32px 0px -96% 0px" },
    );
    sections.forEach((el) => themeIO.observe(el));

    const chapters = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const chapterIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-45% 0px -54% 0px" },
    );
    chapters.forEach((el) => chapterIO.observe(el));
    const top = document.getElementById("top");
    const topIO = new IntersectionObserver(([e]) => e?.isIntersecting && setActive(""), {
      rootMargin: "-45% 0px -54% 0px",
    });
    if (top) topIO.observe(top);

    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setPast(y > window.innerHeight * 0.55);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.8);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      themeIO.disconnect();
      chapterIO.disconnect();
      topIO.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Overlay timeline, built once and played forwards or backwards. */
  useGSAP(
    () => {
      const q = gsap.utils.selector(panel);
      const reduce = !window.matchMedia(motionOK).matches;
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(panel.current, { visibility: "visible" })
        .fromTo(
          panel.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0.01 : 1 },
        )
        .fromTo(
          q("[data-item]"),
          { yPercent: 110 },
          { yPercent: 0, duration: reduce ? 0.01 : 1.1, stagger: 0.05, ease: "expo.out" },
          reduce ? 0 : 0.45,
        )
        .fromTo(q("[data-fade]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.08 }, reduce ? 0 : 0.7);
    },
    { scope: root },
  );

  const close = useCallback((then?: () => void) => {
    setOpen(false);
    lockScroll(false);
    const t = tl.current;
    if (!t) return then?.();
    t.timeScale(2.2).reverse().eventCallback("onReverseComplete", () => {
      gsap.set(panel.current, { visibility: "hidden" });
      then?.();
    });
    toggle.current?.focus({ preventScroll: true });
  }, []);

  const openMenu = () => {
    setOpen(true);
    lockScroll(true);
    tl.current?.eventCallback("onReverseComplete", null).timeScale(1).play();
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }));
  };

  /* Escape and a simple focus trap while the overlay is open. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = [toggle.current, ...panel.current.querySelectorAll<HTMLElement>("a, button")].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const jump = () => scrollToTarget(`#${id}`);
    if (open) close(jump);
    else jump();
  };

  return (
    <header
      ref={root}
      className={s.header}
      data-theme={open ? "dark" : theme}
      data-hidden={hidden && !open ? "" : undefined}
      data-past={past || open ? "" : undefined}
    >
      <div className={s.bar}>
        <a href="#top" className={s.logo} onClick={(e) => go(e, "top")} aria-label="NOIR, back to the top">
          NOIR
        </a>
        <p className={s.where} aria-hidden="true">
          <span>{site.city}</span>
          <span className={s.dot} />
          <span>Seven courses after dark</span>
        </p>
        <div className={s.actions}>
          <a href="#reserve" className={s.reserve} onClick={(e) => go(e, "reserve")}>
            Reserve
          </a>
          <button
            ref={toggle}
            type="button"
            className={s.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => (open ? close() : openMenu())}
          >
            <span className={s.toggleLabel}>{open ? "Close" : "Menu"}</span>
            <span className={s.burger} aria-hidden="true" data-open={open ? "" : undefined}>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={panel}
        id="site-menu"
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
      >
        <nav className={s.nav} aria-label="Chapters">
          <ol>
            {nav.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className={s.navLink}
                >
                  <span className={s.mask}>
                    <span data-item className={s.navInner}>
                      <span className={s.num}>{roman[i]}</span>
                      <span className={s.navLabel}>{item.label}</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.aside}>
          <div data-fade>
            <p className="eyebrow">Tonight</p>
            <p className={s.asideText}>
              Doors at 19:00. Twenty-four seats, one sequence, no music after nine.
            </p>
          </div>
          <div data-fade>
            <p className="eyebrow">Find us</p>
            <p className={s.asideText}>
              {site.street}
              <br />
              {site.postcode}
            </p>
          </div>
          <div data-fade>
            <p className="eyebrow">Hours</p>
            {hours.map((h) => (
              <p key={h.day} className={s.asideText}>
                {h.day}: {h.time}
              </p>
            ))}
          </div>
          <p data-fade className={s.concept}>
            NOIR is a fictional restaurant. A concept website by LeoDex.
          </p>
        </div>
      </div>
    </header>
  );
}
