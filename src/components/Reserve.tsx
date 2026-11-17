"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, motionOK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { seatings, site } from "@/content/site";
import s from "./Reserve.module.css";

const DAY = 86_400_000;
const WINDOW_DAYS = 30;
const OPEN_DAYS = [3, 4, 5, 6]; // Wednesday to Saturday
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_GUESTS = 8;
const NOTE_MAX = 300;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromIso = (v: string) => {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
};
const longDate = (v: string) =>
  fromIso(v).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/* Deterministic "demand" so the demo looks lived-in without a backend. */
const isFull = (d: Date) => (d.getDate() * 7 + d.getMonth() * 3) % 6 === 0;
const fullSeating = (v: string) => seatings[(fromIso(v).getDate() * 3) % seatings.length];

type Status = "form" | "sending" | "done";
type Errors = Partial<Record<"date" | "time" | "name" | "email", string>>;

export function Reserve({ initialToday }: { initialToday: string }) {
  /* The server renders the calendar for its date; the browser corrects it to the local date after mount. */
  const [today, setToday] = useState<Date | null>(() => fromIso(initialToday));
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [focusDay, setFocusDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("form");
  const [ref, setRef] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const shownMonth = useRef(0);

  /* Changing month slides the days in from the side you are moving towards. */
  useEffect(() => {
    const d = month - shownMonth.current;
    shownMonth.current = month;
    if (!d || !grid.current || !window.matchMedia(motionOK).matches) return;
    gsap.fromTo(
      grid.current.children,
      { autoAlpha: 0, x: 22 * Math.sign(d) },
      { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.007, ease: "expo.out" },
    );
  }, [month]);

  useEffect(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (iso(t) !== initialToday) setToday(t);
  }, [initialToday]);

  const range = useMemo(() => {
    if (!today) return null;
    return { first: new Date(today.getTime() + DAY), last: new Date(today.getTime() + WINDOW_DAYS * DAY) };
  }, [today]);

  const dayState = (d: Date): "closed" | "full" | "open" => {
    if (!range || d < range.first || d > range.last || !OPEN_DAYS.includes(d.getDay())) return "closed";
    return isFull(d) ? "full" : "open";
  };

  const view = useMemo(() => {
    if (!today) return null;
    const start = new Date(today.getFullYear(), today.getMonth() + month, 1);
    const lead = (start.getDay() + 6) % 7;
    const count = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: count }, (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1));
    return { start, lead, days };
  }, [today, month]);

  const lastMonth = range && today ? (range.last.getMonth() - today.getMonth() + 12) % 12 : 0;

  /* Arrow keys move between days, crossing months when needed. */
  const onGridKey = (e: React.KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const delta = moves[e.key];
    if (!delta || !focusDay || !today || !range) return;
    e.preventDefault();
    const next = new Date(fromIso(focusDay).getTime() + delta * DAY + 2 * 3_600_000);
    next.setHours(0, 0, 0, 0);
    const min = new Date(today.getFullYear(), today.getMonth(), 1);
    if (next < min || next > new Date(range.last.getFullYear(), range.last.getMonth() + 1, 0)) return;
    const m = (next.getFullYear() - today.getFullYear()) * 12 + next.getMonth() - today.getMonth();
    setMonth(m);
    setFocusDay(iso(next));
    requestAnimationFrame(() => grid.current?.querySelector<HTMLElement>(`[data-day="${iso(next)}"]`)?.focus());
  };

  const pickDate = (v: string) => {
    setDate(v);
    setFocusDay(v);
    if (time && time === fullSeating(v)) setTime(null);
    setErrors((e) => ({ ...e, date: undefined }));
  };

  const validate = (only?: keyof Errors): Errors => {
    const e: Errors = {};
    if (!date) e.date = "Choose an evening.";
    if (!time) e.time = "Choose a seating.";
    if (name.trim().length < 2) e.name = "Tell us the name for the table.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      e.email = email.trim() ? "That email address does not look complete." : "We need an email for the confirmation.";
    if (only) return { ...errors, [only]: e[only] };
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const firstBad = (["date", "time", "name", "email"] as const).find((k) => e[k]);
    if (firstBad) {
      const target = panel.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`);
      target?.focus({ preventScroll: false });
      return;
    }
    setStatus("sending");
    setRef(`NR-${date!.slice(8, 10)}${date!.slice(5, 7)}-${Math.floor(1000 + Math.random() * 9000)}`);
    window.setTimeout(() => setStatus("done"), 1100);
  };

  /* Confirmation: the form folds away and the card opens from the top. */
  useEffect(() => {
    if (status !== "done" || !panel.current) return;
    const k = window.matchMedia(motionOK).matches ? 1 : 0;
    const card = panel.current.querySelector("[data-confirm]");
    gsap
      .timeline()
      .fromTo(card, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 * k, ease: "expo.inOut" })
      .fromTo(
        panel.current.querySelectorAll("[data-confirm] [data-c]"),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.9 * k, stagger: 0.07 * k, ease: "expo.out" },
        0.5 * k,
      );
    /* The card is shorter than the form, so bring it back into view before focusing it. */
    const top = panel.current.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.6) scrollToTarget(top + window.scrollY - 110, !k);
    panel.current.querySelector<HTMLElement>("[data-confirm] h3")?.focus({ preventScroll: true });
  }, [status]);

  const reset = () => {
    setStatus("form");
    setDate(null);
    setTime(null);
    setGuests(2);
    setName("");
    setEmail("");
    setNote("");
    setErrors({});
  };

  const blocked = date ? fullSeating(date) : null;

  return (
    <section id="reserve" className={s.section} data-theme="dark" aria-labelledby="reserve-title">
      <div className={s.intro}>
        <p className="eyebrow" data-reveal>
          <b>VI</b> &nbsp; Reserve
        </p>
        <h2 id="reserve-title" className={`display ${s.title}`} data-reveal="lines">
          Reserve a <em>table</em>
        </h2>
        <p className={s.lede} data-reveal>
          Tables are released thirty days ahead. We seat at 19:00, 19:30, 20:30 and 21:00, Wednesday to Saturday,
          and hold each table for fifteen minutes.
        </p>
        <div className={s.demo} data-reveal role="note">
          <span className={s.demoDot} aria-hidden="true" />
          <p>
            <strong>Demonstration only.</strong> NOIR is a fictional restaurant. This form works in your browser
            but does not send a booking anywhere.
          </p>
        </div>
        <p className={s.small} data-reveal>
          Groups of nine or more: write to {site.email} (a concept address).
        </p>
      </div>

      <div ref={panel} className={s.panel} data-reveal="clip">
        {status !== "done" ? (
          <form className={s.form} onSubmit={submit} noValidate aria-describedby="reserve-demo-note">
            <p id="reserve-demo-note" className="visually-hidden">
              Demonstration form. No booking is sent.
            </p>

            {/* Date */}
            <fieldset className={s.block}>
              <legend className={s.legend}>
                <span className={s.stepNum}>01</span> Evening
              </legend>
              <div className={s.cal}>
                <div className={s.calHead}>
                  <button
                    type="button"
                    className={s.calNav}
                    onClick={() => setMonth((m) => Math.max(0, m - 1))}
                    disabled={month === 0}
                    aria-label="Previous month"
                  >
                    <span className="arrow" style={{ transform: "scaleX(-1)" }} aria-hidden="true" />
                  </button>
                  <p className={s.calMonth} aria-live="polite">
                    {view ? view.start.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : " "}
                  </p>
                  <button
                    type="button"
                    className={s.calNav}
                    onClick={() => setMonth((m) => Math.min(lastMonth, m + 1))}
                    disabled={month >= lastMonth}
                    aria-label="Next month"
                  >
                    <span className="arrow" aria-hidden="true" />
                  </button>
                </div>
                <div className={s.week} aria-hidden="true">
                  {WEEKDAYS.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>
                <div
                  ref={grid}
                  className={s.days}
                  role="group"
                  aria-label="Available evenings"
                  onKeyDown={onGridKey}
                  data-field="date"
                  tabIndex={-1}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "err-date" : undefined}
                >
                  {view ? (
                    <>
                      {Array.from({ length: view.lead }, (_, i) => (
                        <span key={`l${i}`} />
                      ))}
                      {view.days.map((d) => {
                        const v = iso(d);
                        const st = dayState(d);
                        const firstOpen =
                          !focusDay &&
                          v === iso(view.days.find((x) => dayState(x) === "open") ?? view.days[0]!);
                        const label = `${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}${
                          st === "full" ? ", fully booked" : st === "closed" ? ", not available" : ""
                        }`;
                        return (
                          <button
                            key={v}
                            type="button"
                            data-day={v}
                            className={s.day}
                            data-state={st}
                            aria-pressed={date === v}
                            aria-disabled={st !== "open"}
                            aria-label={label}
                            tabIndex={focusDay === v || firstOpen ? 0 : -1}
                            onFocus={() => setFocusDay(v)}
                            onClick={() => st === "open" && pickDate(v)}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <span className={s.calLoading}>Loading the calendar</span>
                  )}
                </div>
                <p className={s.legendRow} aria-hidden="true">
                  <span>
                    <i className={s.kOpen} /> Available
                  </span>
                  <span>
                    <i className={s.kFull} /> Fully booked
                  </span>
                  <span>Closed Sunday to Tuesday</span>
                </p>
              </div>
              {errors.date && (
                <p id="err-date" className={s.error} role="alert">
                  {errors.date}
                </p>
              )}
            </fieldset>

            {/* Time */}
            <fieldset
              className={s.block}
              aria-describedby={errors.time ? "err-time" : date ? undefined : "time-hint"}
            >
              <legend className={s.legend}>
                <span className={s.stepNum}>02</span> Seating
              </legend>
              <div className={s.times}>
                {seatings.map((t, i) => {
                  const full = t === blocked;
                  return (
                    <label key={t} className={s.time} data-full={full ? "" : undefined}>
                      <input
                        type="radio"
                        name="time"
                        value={t}
                        checked={time === t}
                        disabled={!date || full}
                        data-field={i === 0 ? "time" : undefined}
                        onChange={() => {
                          setTime(t);
                          setErrors((e) => ({ ...e, time: undefined }));
                        }}
                      />
                      <span className={s.timeVal}>{t}</span>
                      <span className={s.timeNote}>{full ? "Full" : t === "21:00" ? "Late" : " "}</span>
                    </label>
                  );
                })}
              </div>
              {!date && (
                <p id="time-hint" className={s.hint}>
                  Choose an evening first.
                </p>
              )}
              {errors.time && (
                <p id="err-time" className={s.error} role="alert">
                  {errors.time}
                </p>
              )}
            </fieldset>

            {/* Guests */}
            <fieldset className={s.block}>
              <legend className={s.legend}>
                <span className={s.stepNum}>03</span> Guests
              </legend>
              <div className={s.stepper}>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                  aria-label="One guest fewer"
                >
                  &minus;
                </button>
                <output aria-live="polite" className={s.guests}>
                  {guests} <span>{guests === 1 ? "guest" : "guests"}</span>
                </output>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                  disabled={guests >= MAX_GUESTS}
                  aria-label="One guest more"
                >
                  +
                </button>
              </div>
            </fieldset>

            {/* Details */}
            <fieldset className={s.block}>
              <legend className={s.legend}>
                <span className={s.stepNum}>04</span> Your details
              </legend>
              <div className={s.fields}>
                <div className={s.field}>
                  <label htmlFor="r-name">Name</label>
                  <input
                    id="r-name"
                    data-field="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => name && setErrors(validate("name"))}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                  {errors.name && (
                    <p id="err-name" className={s.error} role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className={s.field}>
                  <label htmlFor="r-email">Email</label>
                  <input
                    id="r-email"
                    data-field="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => email && setErrors(validate("email"))}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                  {errors.email && (
                    <p id="err-email" className={s.error} role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className={`${s.field} ${s.wide}`}>
                  <label htmlFor="r-note">
                    Requests <span className={s.optional}>Optional</span>
                  </label>
                  <textarea
                    id="r-note"
                    rows={3}
                    maxLength={NOTE_MAX}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Allergies, an occasion, a table by the hearth"
                    aria-describedby="note-count"
                  />
                  <span id="note-count" className={s.counter}>
                    {note.length} / {NOTE_MAX}
                  </span>
                </div>
              </div>
            </fieldset>

            <div className={s.submitRow}>
              <p className={s.summary} aria-live="polite">
                {date ? longDate(date) : "No evening chosen"}
                {time ? `, ${time}` : ""} &middot; {guests} {guests === 1 ? "guest" : "guests"}
              </p>
              <button type="submit" className="btn btn--solid" disabled={status === "sending"}>
                {status === "sending" ? "Holding your table" : "Request the table"}
                <span className="arrow" aria-hidden="true" />
              </button>
            </div>
          </form>
        ) : (
          <div className={s.confirm} data-confirm>
            <p className="eyebrow" data-c>
              <b>Demonstration</b> &nbsp; Nothing was sent
            </p>
            <h3 className={`display ${s.confirmTitle}`} tabIndex={-1} data-c>
              Your evening is <em>pencilled in.</em>
            </h3>
            <dl className={s.receipt} data-c>
              <div>
                <dt>Evening</dt>
                <dd>{date && longDate(date)}</dd>
              </div>
              <div>
                <dt>Seating</dt>
                <dd>{time}</dd>
              </div>
              <div>
                <dt>Guests</dt>
                <dd>{guests}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{name}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{ref}</dd>
              </div>
            </dl>
            <p className={s.confirmNote} data-c>
              This is a concept website, so no table is held and no email will reach {email}. On a live site this
              step would confirm the booking with the restaurant.
            </p>
            <button type="button" className="btn" onClick={reset} data-c>
              Start again <span className="arrow" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
