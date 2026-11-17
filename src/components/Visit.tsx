import { hours, site } from "@/content/site";
import { Finale } from "./Finale";
import { ToTop, ReserveLink } from "./Links";
import s from "./Visit.module.css";

const SOCIAL = ["Instagram", "Journal", "Newsletter"];

export function Visit() {
  return (
    <footer id="visit" className={s.section} data-theme="dark" aria-labelledby="visit-title">
      <div className={s.top}>
        <p className="eyebrow" data-reveal>
          <b>VII</b> &nbsp; Visit
        </p>
        <h2 id="visit-title" className={`display ${s.statement}`} data-reveal="lines">
          NOIR cooks for the hour <em>after dark.</em>
        </h2>
      </div>

      <div className={s.cols}>
        <address className={s.col} data-reveal>
          <h3 className="eyebrow">Address</h3>
          <p className={s.big}>{site.street}</p>
          <p>{site.postcode}</p>
          <p className={s.muted}>
            Ring the bell under the iron lantern. The door is unmarked, and the stairs go down before they go in.
          </p>
        </address>

        <div className={s.col} data-reveal data-delay="0.08">
          <h3 className="eyebrow">Hours</h3>
          <dl className={s.hours}>
            {hours.map((h) => (
              <div key={h.day}>
                <dt>{h.day}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <p className={s.muted}>Closed for the last two weeks of August and the first week of January.</p>
        </div>

        <div className={s.col} data-reveal data-delay="0.16">
          <h3 className="eyebrow">Contact</h3>
          <p>
            {site.email}
            <span className={s.tag}>Concept address</span>
          </p>
          <p className={s.muted}>We answer every message by email, usually within a day.</p>
          <ul className={s.social} aria-label="Social channels (concept, no live profiles)">
            {SOCIAL.map((n) => (
              <li key={n}>
                <span className={s.socialItem} title="Concept project: no live profile">
                  {n} <span className={s.tag}>Concept</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${s.col} ${s.cta}`} data-reveal data-delay="0.24">
          <h3 className="eyebrow">Tables</h3>
          <p className={s.muted}>Released thirty days ahead, Wednesday to Saturday.</p>
          <ReserveLink />
        </div>
      </div>

      <Finale />

      <div className={s.bar}>
        <p>
          &copy; {new Date().getFullYear()} NOIR &middot; A concept website by{" "}
          <a href="https://leodex.dev" className="link">
            LeoDex
          </a>
        </p>
        <p className={s.disclaimer}>
          NOIR is a fictional restaurant. The menu, chef, address and reservation form are invented for this
          portfolio project. Photography from Unsplash, used under the Unsplash License.
        </p>
        <ToTop />
      </div>
    </footer>
  );
}
