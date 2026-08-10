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

const raceFacts = [
  ["02", "race days"],
  ["12 mi", "rolling loop"],
  ["MAR 21", "day one"],
  ["MAR 28", "day two"],
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

      <nav className={styles.jumpNav} aria-label="Jump to a manual section">
        <a href="#color-language">01 Color</a>
        <a href="#type-language">02 Type</a>
        <a href="#primitives">03 Race</a>
        <a href="#image-language">04 Image</a>
      </nav>

      <section className={styles.hero} aria-labelledby="manual-title">
        <div className={styles.heroIndex} aria-hidden="true">
          Seattle area / Pacific Northwest
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            Road / Cyclocross / Gravel / Track / Mountain bike
          </p>
          <h1 id="manual-title">
            Puget Sound
            <em>Race Manual</em>
          </h1>
          <p className={styles.heroDek}>
            Built for the sharp end of the bunch. An editorial system for race
            days, team stories, and the roads that connect them.
          </p>
          <p className={styles.inclusiveLine}>Everyone can race.</p>
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
            Official HBR gallery · @hagensbermancycling
          </figcaption>
        </figure>
        <p className={styles.heroNote}>Five disciplines. One team.</p>
      </section>

      <section className={styles.palette} id="color-language" aria-labelledby="palette-title">
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

      <section className={styles.typeSection} id="type-language" aria-labelledby="type-title">
        <div className={`${styles.sectionLabel} ${styles.sectionLabelDark}`}>
          <span>02</span>
          <h2 id="type-title">Type / Voice</h2>
        </div>
        <div className={styles.typeGrid}>
          <div className={styles.displaySample}>
            <p>Display / 67–160px responsive</p>
            <strong>
              Ride the
              <br />
              line.
            </strong>
          </div>
          <div className={styles.editorialSample}>
            <p>Editorial / 18–25px responsive</p>
            <div className={styles.principle}>
              <span>Source principle / Team philosophy</span>
              <p>
                “We race as a team, not as a group of individuals wearing the
                same kit.”
              </p>
            </div>
          </div>
          <div className={styles.monoSample}>
            <p>Mono / 11–14</p>
            <dl>
              <div>
                <dt>Dues</dt>
                <dd>$75</dd>
              </div>
              <div>
                <dt>Team kit</dt>
                <dd>1 required</dd>
              </div>
              <div>
                <dt>Volunteer</dt>
                <dd>1 local race</dd>
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
          <div className={styles.dateBlock} aria-label="March 21, 2026">
            <span>MAR</span>
            <strong>21</strong>
            <small>2026</small>
          </div>
          <div className={styles.raceTitle}>
            <p>Verified 2026 event / Road</p>
            <h3>Mason Lake Road Race</h3>
            <span>Mason Lake / Pacific Northwest · 12-mile rolling loop</span>
          </div>
          <div className={styles.callout} aria-label="March 28, 2026, race day two">
            <span>Race day two</span>
            <strong>28</strong>
            <small>March / 2026</small>
          </div>
        </div>
        <dl className={styles.statLine}>
          {raceFacts.map(([value, label]) => (
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
              <span>Plate 02 / Team portrait</span>
              Official HBR gallery · @hagensbermancycling
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
