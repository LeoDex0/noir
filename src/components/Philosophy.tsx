import Image from "next/image";
import { photos } from "@/content/photos";
import { principles } from "@/content/site";
import s from "./Philosophy.module.css";

export function Philosophy() {
  return (
    <section id="philosophy" className={s.section} data-theme="light" data-open aria-labelledby="philo-title">
      <div className={s.head}>
        <p className="eyebrow" data-reveal>
          <b>II</b> &nbsp; Philosophy
        </p>
        <h2 id="philo-title" className={`display ${s.title}`} data-reveal="lines">
          We cook what the <em>week</em> gives us, and we serve it in the <em>dark.</em>
        </h2>
        <p className={s.silk} data-reveal data-delay="0.1">
          Lyon was built on silk. For two centuries the canuts wove on these slopes by daylight, one thread at a
          time. We kept their patience and changed the hours.
        </p>
      </div>

      <div className={s.body} data-draw-scope>
        <svg className={s.thread} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
          <path
            data-draw
            pathLength={1}
            d="M 58 0 C 58 140, 10 170, 12 320 S 96 480, 92 640 S 40 860, 60 1000"
          />
        </svg>
        <div className={s.pics}>
          <figure className={s.big} data-reveal="clip">
            <Image
              src={photos.stilllife.src}
              alt={photos.stilllife.alt}
              fill
              sizes="(min-width: 900px) 40vw, 86vw"
              quality={80}
              className="cover"
            />
          </figure>
          <div className={s.smallWrap} data-speed="14">
            <figure className={s.small} data-reveal="drop" data-delay="0.2">
              <Image
                src={photos.mushrooms.src}
                alt={photos.mushrooms.alt}
                fill
                sizes="(min-width: 900px) 18vw, 44vw"
                quality={80}
                className="cover"
              />
            </figure>
          </div>
          <p className={s.picNote} data-reveal>
            Fig. 1 &nbsp; The Monday delivery from Ferme des Sablons, before anything is decided.
          </p>
        </div>

        <ol className={s.principles}>
          {principles.map((p, i) => (
            <li key={p.title} className={s.principle} data-reveal data-delay={String((i % 2) * 0.1)}>
              <span className={s.pNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.pTitle}>{p.title}</h3>
              <p className={s.pText}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <figure className={s.strip}>
        <div className={s.stripPic} data-reveal="wipe">
          <Image
            src={photos.salts.src}
            alt={photos.salts.alt}
            fill
            sizes="(min-width: 900px) 94vw, 100vw"
            quality={80}
            className="cover"
          />
        </div>
        <figcaption className={s.stripCap}>
          <span className={`display ${s.stripQuote}`} data-reveal="lines">
            Salt from Guérande, ash from our own hearth, butter from a dairy in the Bresse.
          </span>
          <span className="eyebrow" data-reveal>
            Every producer is named on the bill
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
