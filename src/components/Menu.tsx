"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, motionOK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { courses, shapes, roman, pricing } from "@/content/site";
import { photos } from "@/content/photos";
import s from "./Menu.module.css";

const N = courses.length;
/** Scroll distance per course while the stage is pinned, in viewport heights. */
const STEP = 0.85;
const pad = (n: number) => String(n).padStart(2, "0");
/** Source for the macro loupe: the same photo, sized so a 3x crop stays sharp. */
const LOUPE = courses.map((c) => getImageProps({ src: c.photo.src, alt: "", width: 540, quality: 80 }).props.src);
const R = 52;
const ARC = 2 * Math.PI * R;
const r2 = (v: number) => Math.round(v * 100) / 100;
const TICKS = courses.map((_, i) => {
  const a = (i / N) * Math.PI * 2;
  return { x1: r2(60 + Math.cos(a) * 55), y1: r2(60 + Math.sin(a) * 55), x2: r2(60 + Math.cos(a) * 60), y2: r2(60 + Math.sin(a) * 60) };
});

export function Menu() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const shown = useRef(0);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const [mActive, setMActive] = useState(0);

  /* Loupe backgrounds are attached only when the stage is close. */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  /* Mobile: which course is in the middle of the screen. */
  useEffect(() => {
    const items = [...(root.current?.querySelectorAll<HTMLElement>("[data-item]") ?? [])];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setMActive(Number((e.target as HTMLElement).dataset.item));
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Desktop with motion: pin the stage and let scroll walk through the courses. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      /* The opening: a plate-sized circle of light grows into the full frame. */
      mm.add({ motion: motionOK, wide: "(min-width: 1024px)" }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const wide = ctx.conditions.wide;
        const q = gsap.utils.selector(opening);
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: wide
              ? { trigger: opening.current, start: "top top", end: "+=110%", pin: true, scrub: true, anticipatePin: 1 }
              : { trigger: opening.current, start: "top 85%", end: "bottom 60%", scrub: true },
          })
          .fromTo(q("[data-op-img]"), { clipPath: "circle(11% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut" }, 0)
          .fromTo(q("[data-op-img] img"), { scale: 1.45 }, { scale: 1, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-op-ring]"), { scale: 1, autoAlpha: 1 }, { scale: 2.4, autoAlpha: 0, ease: "power2.in" }, 0)
          .fromTo(q("[data-op-text]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0.55);
      });

      mm.add(`${motionOK} and (min-width: 1024px)`, () => {
        trigger.current = ScrollTrigger.create({
          trigger: stage.current,
          start: "top top",
          end: () => `+=${window.innerHeight * STEP * N}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(N - 1, Math.floor(self.progress * N))),
        });
        return () => {
          trigger.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* Course change: morph the frame, cross-fade the plates, roll the text. */
  useGSAP(
    () => {
      const from = shown.current;
      const to = active;
      if (from === to || !stage.current) return;
      shown.current = to;

      const q = gsap.utils.selector(stage);
      const k = window.matchMedia(motionOK).matches ? 1 : 0;
      const dir = to > from ? 1 : -1;
      const shots = q("[data-shot]");
      const texts = q("[data-course]");

      gsap.to(q("[data-frame]"), {
        clipPath: shapes[courses[to]!.shape],
        duration: 1.3 * k,
        ease: "expo.inOut",
        overwrite: true,
      });

      /* The new plate wipes in over the old one, in the direction of travel. */
      shots.forEach((el, i) => {
        if (i === to) return;
        gsap.set(el, { zIndex: 1 });
        gsap.to(el, { autoAlpha: 0, duration: 0.4 * k, delay: 0.85 * k, overwrite: true });
      });
      gsap.set(shots[to]!, { zIndex: 2 });
      gsap.fromTo(
        shots[to]!,
        { autoAlpha: 1, clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15 * k, ease: "expo.inOut", overwrite: true },
      );
      gsap.fromTo(shots[to]!.querySelector("img"), { scale: 1.3 }, { scale: 1, duration: 1.9 * k, ease: "expo.out" });

      q("[data-ghost]").forEach((el, i) => {
        if (i === to)
          gsap.fromTo(el, { yPercent: 30 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.3 * k, ease: "expo.out", overwrite: true });
        else gsap.to(el, { yPercent: -30 * dir, autoAlpha: 0, duration: 0.6 * k, ease: "power2.in", overwrite: true });
      });
      q("[data-loupe]").forEach((el, i) => {
        if (i === to)
          gsap.fromTo(el, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1 * k, delay: 0.55 * k, ease: "expo.out", overwrite: true });
        else gsap.to(el, { scale: 0.85, autoAlpha: 0, duration: 0.35 * k, overwrite: true });
      });

      texts.forEach((el, i) => {
        const lines = el.querySelectorAll("[data-l]");
        if (i === to) {
          gsap.set(el, { autoAlpha: 1 });
          gsap.fromTo(
            lines,
            { yPercent: 105 * dir, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 1.15 * k, stagger: 0.055 * k, delay: 0.22 * k, ease: "expo.out", overwrite: true },
          );
        } else {
          gsap.to(lines, {
            yPercent: -105 * dir,
            autoAlpha: 0,
            duration: 0.5 * k,
            stagger: 0.02 * k,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
              if (shown.current !== i) gsap.set(el, { autoAlpha: 0 });
            },
          });
        }
      });
    },
    { dependencies: [active], scope: root },
  );

  const goTo = (i: number) => {
    if (i < 0 || i >= N) return;
    const t = trigger.current;
    if (t) scrollToTarget(t.start + (t.end - t.start) * ((i + 0.5) / N));
    else setActive(i);
  };

  /* While the stage is on screen, the arrow keys walk the menu. */
  const goRef = useRef(goTo);
  goRef.current = goTo;
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if ((e.target as HTMLElement).closest?.("input, textarea, [role=dialog]")) return;
      const r = stage.current?.getBoundingClientRect();
      if (!r || r.height === 0 || r.top > 10 || r.bottom < window.innerHeight - 10) return;
      e.preventDefault();
      goRef.current(activeRef.current + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="menu" ref={root} className={s.section} data-theme="dark" aria-labelledby="menu-title">
      <header className={s.head}>
        <p className="eyebrow" data-reveal>
          <b>I</b> &nbsp; The Menu
        </p>
        <h2 id="menu-title" className={`display ${s.title}`} data-reveal="lines">
          Seven movements, <em>one night.</em>
        </h2>
        <p className={s.intro} data-reveal data-delay="0.15">
          Le Menu Noir is served to every table at the same moment. It follows the season, so this autumn
          sequence will be gone by January.
        </p>
      </header>

      <div ref={opening} className={s.opening}>
        <div className={s.opImg} data-op-img>
          <Image
            src={photos.scallop.src}
            alt={photos.scallop.alt}
            fill
            sizes="(max-aspect-ratio: 2/3) 67vh, 100vw"
            quality={80}
            className="cover"
            style={{ objectPosition: "50% 66%" }}
          />
          <div className={s.opShade} aria-hidden="true" />
        </div>
        <span className={s.opRing} data-op-ring aria-hidden="true" />
        <div className={s.opText}>
          <p className="eyebrow" data-op-text>
            <b>19:20</b> &nbsp; The first plate
          </p>
          <p className={`display ${s.opLine}`} data-op-text>
            Every table, the same course, <em>the same moment.</em>
          </p>
        </div>
      </div>

      {/* Desktop: one pinned stage. Hidden below 1024px, where the list below takes over. */}
      <div ref={stage} className={s.stage}>
        <div className={s.text} aria-live="polite">
          {courses.map((c, i) => (
            <article
              key={c.name}
              data-course
              className={`${s.course} ${i === 0 ? s.on : ""}`}
              aria-hidden={i !== active}
            >
              <span className={s.m}>
                <span data-l className={s.counter}>
                  Course {pad(i + 1)} <span className={s.of}>of {pad(N)} &nbsp;&middot;&nbsp; around {c.time}</span>
                </span>
              </span>
              <span className={s.m}>
                <span data-l className={`display ${s.name}`}>
                  <span className={s.numeral} aria-hidden="true">
                    {roman[i]}
                  </span>
                  {c.name}
                </span>
              </span>
              <span className={s.m}>
                <span data-l className={s.line}>
                  {c.line}
                </span>
              </span>
              <span className={s.m}>
                <span data-l className={s.desc}>
                  {c.text}
                </span>
              </span>
              <span className={s.parts}>
                {c.parts.map((p) => (
                  <span key={p.item} className={s.m}>
                    <span data-l className={s.part}>
                      <b>{p.item}</b>
                      <span>{p.from}</span>
                    </span>
                  </span>
                ))}
              </span>
              <span className={s.m}>
                <span data-l className={s.pair}>
                  <span className="eyebrow">Pairing</span> {c.pairing}
                </span>
              </span>
            </article>
          ))}
        </div>

        <div className={s.frameWrap}>
          <div className={s.ghosts} aria-hidden="true">
            {courses.map((c, i) => (
              <span key={c.name} data-ghost className={`${s.ghost} ${i === 0 ? s.on : ""}`}>
                {roman[i]}
              </span>
            ))}
          </div>
          <div data-frame className={s.frame} style={{ clipPath: shapes[courses[0]!.shape] }}>
            {courses.map((c, i) => (
              <div key={c.name} data-shot className={`${s.shot} ${i === 0 ? s.on : ""}`}>
                <Image
                  src={c.photo.src}
                  alt={c.photo.alt}
                  fill
                  sizes={c.photo.src.width > c.photo.src.height ? "(min-width: 1024px) 85vw, 1px" : "(min-width: 1024px) 52vw, 1px"}
                  quality={80}
                  className="cover"
                  style={{ objectPosition: c.focus ?? "50% 50%" }}
                />
              </div>
            ))}
          </div>
          <div className={s.loupeWrap} aria-hidden="true">
            {courses.map((c, i) => (
              <span
                key={c.name}
                data-loupe
                className={`${s.loupe} ${i === 0 ? s.on : ""}`}
                style={{ backgroundImage: near ? `url("${LOUPE[i]}")` : undefined, backgroundPosition: c.detail }}
              />
            ))}
            <span className={s.loupeLabel}>
              Detail <i>&times;3</i>
            </span>
          </div>
        </div>

        <nav className={s.index} aria-label="Courses">
          <div className={s.dial} aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={R} className={s.dialTrack} />
              <circle
                cx="60"
                cy="60"
                r={R}
                className={s.dialArc}
                style={{ strokeDasharray: ARC, strokeDashoffset: ARC * (1 - (active + 1) / N) }}
              />
              {TICKS.map((t, i) => (
                <line key={i} {...t} className={i <= active ? s.tickOn : s.tick} />
              ))}
            </svg>
            <span className={s.dialNum}>{roman[active]}</span>
            <span className={s.dialTime}>{courses[active]!.time}</span>
          </div>
          <div className={s.steps}>
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous course">
              <span className="arrow" style={{ transform: "scaleX(-1)" }} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === N - 1} aria-label="Next course">
              <span className="arrow" aria-hidden="true" />
            </button>
          </div>
          <ol>
            {courses.map((c, i) => (
              <li key={c.name}>
                <button
                  type="button"
                  className={s.indexBtn}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className={s.indexNum}>{roman[i]}</span>
                  <span className={s.indexName}>{c.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Mobile and tablet: each course gets its own composition. */}
      <div className={s.listWrap}>
      <ol className={s.list}>
        {courses.map((c, i) => (
          <li key={c.name} id={`course-${i + 1}`} className={s.item} data-shape={c.shape} data-item={i}>
            <div className={s.itemHead}>
              <span className={s.itemNum}>{roman[i]}</span>
              <span className={s.itemTime}>{c.time}</span>
              <h3 className={`display ${s.itemName}`} data-reveal="lines">
                {c.name}
              </h3>
            </div>
            <div className={s.itemPic} data-reveal={i % 2 ? "clip" : "iris"}>
              <Image
                src={c.photo.src}
                alt={c.photo.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 1px"
                quality={80}
                className="cover"
                style={{ objectPosition: c.focus ?? "50% 50%" }}
              />
            </div>
            <div className={s.itemText} data-reveal>
              <p className={s.line}>{c.line}</p>
              <p className={s.desc}>{c.text}</p>
              <ul className={s.parts}>
                {c.parts.map((p) => (
                  <li key={p.item} className={s.part}>
                    <b>{p.item}</b>
                    <span>{p.from}</span>
                  </li>
                ))}
              </ul>
              <p className={s.pair}>
                <span className="eyebrow">Pairing</span> {c.pairing}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <nav className={s.mBar} aria-label="Courses">
        <p className={s.mNow} aria-live="polite">
          <span>{roman[mActive]}</span> {courses[mActive]!.name} <i>{courses[mActive]!.time}</i>
        </p>
        <ol>
          {courses.map((c, i) => (
            <li key={c.name}>
              <button
                type="button"
                aria-label={`Course ${i + 1}: ${c.name}`}
                aria-current={i === mActive ? "step" : undefined}
                data-done={i < mActive ? "" : undefined}
                onClick={() => scrollToTarget(`#course-${i + 1}`)}
              >
                <span />
              </button>
            </li>
          ))}
        </ol>
      </nav>
      </div>

      <div className={s.card}>
        <div className={s.seq}>
          <h3 className="eyebrow" data-reveal>
            The full sequence
          </h3>
          <ol>
            {courses.map((c, i) => (
              <li key={c.name} data-reveal data-delay={String(i * 0.05)}>
                <span className={s.seqNum}>{roman[i]}</span>
                <span className={s.seqName}>{c.name}</span>
                <span className={s.seqLine}>{c.line}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={s.prices}>
          <h3 className="eyebrow" data-reveal>
            Per guest
          </h3>
          <dl>
            {pricing.map((p) => (
              <div key={p.label} className={s.priceRow} data-reveal>
                <dt>{p.label}</dt>
                <dd>{p.price}</dd>
              </div>
            ))}
          </dl>
          <p className={s.notes} data-reveal>
            We cook around most dietary needs with three days&rsquo; notice. Shellfish and fish run through
            the whole menu and cannot be removed.
          </p>
          <a
            href="#reserve"
            className="btn"
            data-reveal
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#reserve");
            }}
          >
            Reserve a table <span className="arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
