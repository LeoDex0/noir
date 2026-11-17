"use client";

import { scrollToTarget } from "@/lib/scroll";

export function ReserveLink() {
  return (
    <a
      href="#reserve"
      className="btn btn--solid"
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget("#reserve");
      }}
    >
      Reserve a table <span className="arrow" aria-hidden="true" />
    </a>
  );
}

export function ToTop() {
  return (
    <a
      href="#top"
      className="link"
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget(0);
      }}
    >
      Back to the top
    </a>
  );
}
