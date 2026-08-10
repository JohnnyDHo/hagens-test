import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./system.module.css";

export const metadata: Metadata = {
  title: "Puget Sound Race Manual | Hagens Berman Racing",
  description:
    "The editorial design system for Hagens Berman Racing Seattle: color, type, race data, controls, imagery, and rhythm.",
};

const colors = [
  { name: "Sound blue", hex: "#14539E", className: styles.blueSwatch },
  { name: "Night ride", hex: "#071621", className: styles.inkSwatch },
  { name: "Glacier", hex: "#F4F7F9", className: styles.glacierSwatch },
  { name: "Course red", hex: "#B9342E", className: styles.redSwatch },
];

const stats = [
  ["04", "laps"],
  ["52.4", "miles"],
  ["3,420", "ft gained"],
  ["18", "riders"],
];

export default function SystemPage() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link className={styles.brand} href="/" aria-label="Hagens Berman Racing home">
          <span className={styles.brandMark} aria-hidden="true">
            HB
          </span>
          <span>
            Hagens Berman Racing
            <small>Seattle, Washington</small>
          </span>
        </Link>
        <nav className={styles.utilityNav} aria-label="Manual navigation">
          <a href="#primitives">Race primitives</a>
          <Link href="/progress">Build log</Link>
        </nav>
        <p className={styles.issue}>System 01 / Rev. A</p>
      </header>

      <section className={styles.hero} aria-labelledby="manual-title">
        <div className={styles.heroIndex} aria-hidden="true">
          47.61° N
          <span />
          122.33° W
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>HBR visual standard · road / dirt / track</p>
          <h1 id="manual-title">
            Puget Sound
            <em>Race Manual</em>
          </h1>
          <p className={styles.heroDek}>
            Built for the sharp end of the bunch. An editorial system for race
            days, team stories, and the roads that connect them.
          </p>
        </div>
        <figure className={styles.heroFigure}>
          <Image
            src="/media/action-03.webp"
            alt="Hagens Berman riders leading a road race group over a rise"
            fill
            priority
            sizes="(max-width: 720px) 100vw, 56vw"
          />
          <figcaption>
            <span>Plate 01</span>
            Mason County, WA · Road discipline
          </figcaption>
        </figure>
        <p className={styles.heroNote}>Follow the wheel. Hold the line.</p>
      </section>

      <section className={styles.palette} aria-labelledby="palette-title">
        <div className={styles.sectionLabel}>
          <span>01</span>
          <h2 id="palette-title">Color / Weather</h2>
        </div>
        <p className={styles.sectionIntro}>
          Four tones, paired for decisive contrast. Blue carries the team;
          red is reserved for the moment that needs a rider&apos;s attention.
        </p>
        <ul className={styles.swatches}>
          {colors.map((color) => (
            <li className={color.className} key={color.hex}>
              <span>{color.name}</span>
              <code>{color.hex}</code>
            </li>
          ))}
        </ul>
        <div className={styles.pairings} aria-label="Approved color pairings">
          <p>Approved pairings</p>
          <div className={styles.pairBlue}>Sound blue / Glacier</div>
          <div className={styles.pairInk}>Night ride / Glacier</div>
          <div className={styles.pairLight}>Night ride / White</div>
        </div>
      </section>

      <section className={styles.typeSection} aria-labelledby="type-title">
        <div className={`${styles.sectionLabel} ${styles.sectionLabelDark}`}>
          <span>02</span>
          <h2 id="type-title">Type / Voice</h2>
        </div>
        <div className={styles.typeGrid}>
          <div className={styles.displaySample}>
            <p>Display / 96–168</p>
            <strong>
              Ride the
              <br />
              line.
            </strong>
          </div>
          <div className={styles.editorialSample}>
            <p>Editorial / 18–28</p>
            <blockquote>
              “A team is measured in the work between races: the wheel held,
              the call made, the last rider brought home.”
            </blockquote>
            <cite>— Field note 07, Seattle</cite>
          </div>
          <div className={styles.monoSample}>
            <p>Mono / 11–14</p>
            <dl>
              <div>
                <dt>Call-up</dt>
                <dd>06:45 PDT</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>SSW 08 MPH</dd>
              </div>
              <div>
                <dt>Surface</dt>
                <dd>Dry / Fast</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.primitives} id="primitives" aria-labelledby="primitives-title">
        <div className={styles.sectionLabel}>
          <span>03</span>
          <h2 id="primitives-title">Race / Primitives</h2>
        </div>
        <div className={styles.raceHead}>
          <div className={styles.dateBlock} aria-label="April 12">
            <span>APR</span>
            <strong>12</strong>
            <small>2026</small>
          </div>
          <div className={styles.raceTitle}>
            <p>HBR race file 004 / Road</p>
            <h3>Mason Lake Road Race</h3>
            <span>Shelton, Washington · Senior Men 1/2</span>
          </div>
          <div className={styles.callout}>
            <span>First call</span>
            <strong>06:45</strong>
            <small>PDT / Paddock B</small>
          </div>
        </div>
        <dl className={styles.statLine}>
          {stats.map(([value, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.actionLine}>
          <p>
            <span>Action hierarchy</span>
            Minimum 44px hit area. One signal action per view.
          </p>
          <div>
            <a className={styles.primaryAction} href="#image-language">
              View image language <span aria-hidden="true">↘</span>
            </a>
            <Link className={styles.secondaryAction} href="/progress">
              Open production log <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.imageSection} id="image-language" aria-labelledby="image-title">
        <div className={`${styles.sectionLabel} ${styles.sectionLabelDark}`}>
          <span>04</span>
          <h2 id="image-title">Image / Proximity</h2>
        </div>
        <div className={styles.imageComposition}>
          <figure className={styles.teamFigure}>
            <div className={styles.teamImage}>
              <Image
                src="/media/team.webp"
                alt="Hagens Berman teammates gathered with their bikes before a race"
                fill
                sizes="(max-width: 720px) 94vw, 66vw"
              />
            </div>
            <figcaption>
              <span>Plate 02 / The team before the start</span>
              Close, human, unpolished. Let weather and place remain visible.
            </figcaption>
          </figure>
          <aside className={styles.imageRules} aria-label="Image treatment rules">
            <p>Frame notes</p>
            <ol>
              <li>Enter the action at rider height.</li>
              <li>Crop with intent; never center by habit.</li>
              <li>Caption every official photograph.</li>
            </ol>
            <strong aria-hidden="true">HBR<br />SEA</strong>
          </aside>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link className={styles.brand} href="/" aria-label="Hagens Berman Racing home">
          <span className={styles.brandMark} aria-hidden="true">HB</span>
          <span>Hagens Berman Racing<small>Seattle, Washington</small></span>
        </Link>
        <p>Puget Sound Race Manual · Design system specimen</p>
        <a href="#manual-title">Back to start ↑</a>
      </footer>
    </main>
  );
}
