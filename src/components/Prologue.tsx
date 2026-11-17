"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import s from "./Prologue.module.css";

/* Segments marked `i` are set in italic. */
const TEXT: { t: string; i?: boolean }[] = [
  { t: "It begins" },
  { t: "on the stairs.", i: true },
  { t: "The descent beneath the Croix-Rousse, the weight of an old door, the smell of woodsmoke before you see the fire. By the time you sit down, the meal has" },
  { t: "already started.", i: true },
];

const WORDS = TEXT.flatMap((seg) => seg.t.split(" ").map((w) => ({ w, i: !!seg.i })));

export function Prologue() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionOK, () => {
        gsap.fromTo(
          "[data-w]",
          { opacity: 0.13 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: "[data-quote]", start: "top 78%", end: "bottom 42%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="prologue" ref={root} className={s.section} data-theme="dark" aria-label="Prologue">
      <p className={`eyebrow ${s.label}`} data-reveal>
        <b>00</b> &nbsp; Prologue
      </p>
      <p className={`display ${s.quote}`} data-quote>
        {WORDS.map(({ w, i }, k) => (
          <span key={k} data-w className={i ? s.it : undefined}>
            {w}{" "}
          </span>
        ))}
      </p>
      <ul className={s.facts}>
        <li data-reveal>
          <span className={s.factNum}>19:00</span>
          <span>Doors open. A glass by the hearth while the room fills.</span>
        </li>
        <li data-reveal data-delay="0.1">
          <span className={s.factNum}>3 h</span>
          <span>One sitting. Everyone is served the same course at the same moment.</span>
        </li>
        <li data-reveal data-delay="0.2">
          <span className={s.factNum}>24</span>
          <span>Seats, including eight at the counter facing the fire.</span>
        </li>
      </ul>
    </section>
  );
}
