import Image from "next/image";
import { photos } from "@/content/photos";
import { day } from "@/content/site";
import s from "./Chef.module.css";

export function Chef() {
  return (
    <section id="chef" className={s.section} data-theme="dark" aria-labelledby="chef-title">
      <div className={s.top}>
        <figure className={s.portrait} data-reveal="clip">
          <div className={s.portraitInner} data-zoom="1.18">
            <Image
              src={photos.chefPortrait.src}
              alt={photos.chefPortrait.alt}
              fill
              sizes="(min-width: 900px) 44vw, 100vw"
              quality={80}
              className="cover"
            />
          </div>
        </figure>

        <h2 id="chef-title" className={`display ${s.name}`}>
          <span className="eyebrow" data-reveal>
            <b>III</b> &nbsp; The Chef
          </span>
          <span data-reveal="lines" className={s.nameText}>
            <em>Aurèle</em> Vasseur
          </span>
        </h2>

        <div className={s.story}>
          <blockquote className={s.quote} data-reveal="lines">
            &ldquo;I want the first course to feel like the moment your eyes adjust to a dark room.&rdquo;
          </blockquote>
          <div className={s.bio}>
            <p data-reveal>
              Aurèle grew up in Arbois, in the Jura, between his grandmother&rsquo;s kitchen and the cold cellars
              where the village aged its cheese and wine. He learned to cook by smell long before he learned it
              by recipe.
            </p>
            <p data-reveal data-delay="0.08">
              He left at nineteen and spent fourteen years in other people&rsquo;s kitchens, in Lyon, Copenhagen
              and on the Basque coast, then came home to the Rhône with a notebook of ideas and no wish to cook
              anyone else&rsquo;s.
            </p>
            <p data-reveal data-delay="0.16">
              NOIR opened in a silk workshop on the slopes of the Croix-Rousse. He still splits the vine wood for
              the hearth himself, every Tuesday.
            </p>
          </div>
          <p className={s.sign} data-reveal>
            <span className="serif-i">Aurèle Vasseur</span>
            <span className="eyebrow">Chef and owner</span>
          </p>
        </div>
      </div>

      <figure className={s.hands}>
        <div className={s.handsPic} data-reveal="iris">
          <div className={s.handsInner} data-zoom="1.16">
            <Image
              src={photos.chefPlating.src}
              alt={photos.chefPlating.alt}
              fill
              sizes="(max-width: 1023px) 190vw, 100vw"
              quality={80}
              className="cover"
            />
          </div>
        </div>
        <figcaption className={s.handsCap}>
          <span className={`display ${s.handsQuote}`} data-reveal="lines">
            &ldquo;Most of the work is taking things off the plate.&rdquo;
          </span>
          <span className="eyebrow" data-reveal data-delay="0.2">
            At the pass, 19:40
          </span>
        </figcaption>
      </figure>

      <div className={s.dayHead}>
        <h3 className={`display ${s.dayTitle}`} data-reveal="lines">
          A day at <em>NOIR</em>
        </h3>
        <p className={s.daySub} data-reveal>
          Twelve hours of preparation for three hours at the table.
        </p>
      </div>

      <div className={s.rail}>
        <ol className={s.track} data-drift="-38">
          {day.map((d, i) => (
            <li key={d.time} className={s.step} data-variant={i % 3}>
              <figure className={s.stepPic} data-reveal={i % 2 ? "drop" : "clip"} data-delay={String(i * 0.06)}>
                <Image
                  src={d.photo.src}
                  alt={d.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, 78vw"
                  quality={80}
                  className="cover"
                />
              </figure>
              <div className={s.stepText}>
                <span className={s.time}>{d.time}</span>
                <span className={s.stepTitle}>{d.title}</span>
                <span className={s.stepBody}>{d.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
