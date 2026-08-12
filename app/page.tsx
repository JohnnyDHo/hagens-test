import type { Metadata } from "next";
import Image from "next/image";
import HeroMedia from "@/components/HeroMedia";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Everyone Can Race",
  description:
    "Seattle’s amateur cycling team for road, cyclocross, gravel, track, and mountain bike racing. Everyone can race.",
};

export default function Home() {
  return (
    <div className={styles.site} id="top">
      <SiteHeader />

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <HeroMedia
            className={styles.media}
            videoClassName={styles.video}
            readyClassName={styles.mediaReady}
          />

          <div className={styles.raceStripe} aria-hidden="true">
            <span>HBR / Seattle / Five disciplines / One team</span>
          </div>

          <div className={styles.topRail}>
            <p>Seattle, Washington</p>
            <p>Amateur cycling / Team first</p>
          </div>

          <div className={styles.titleBlock}>
            <p className={styles.kicker}>Hagens Berman Racing</p>
            <h1 id="hero-title">
              <span>Everyone</span>
              <em>can race.</em>
            </h1>
          </div>

          <div className={styles.bottomRail}>
            <p className={styles.intro}>
              A Seattle racing team bringing cyclists together across road,
              cyclocross, gravel, track, and mountain bike.
            </p>

            <div className={styles.actions} aria-label="Team actions">
              <a href="https://www.hbsccycling.com/join-us">
                Join the team <span aria-hidden="true">↗</span>
              </a>
              <a href="#team">
                Explore the team <span aria-hidden="true">↓</span>
              </a>
            </div>

            <p className={styles.disciplineNote}>
              <span>Five disciplines / one team</span>
              Community, development, and racing in the Pacific Northwest
            </p>
          </div>
        </section>

        <section
          className={styles.teamStory}
          id="team"
          aria-labelledby="team-title"
        >
          <header className={styles.teamLead}>
            <div className={styles.storyIndex}>
              <span>01</span>
              <p>Team / Seattle</p>
            </div>

            <div className={styles.teamHeadline}>
              <p>Hagens Berman Racing</p>
              <h2 id="team-title">
                Race together.
                <em>Share what you know.</em>
              </h2>
            </div>

            <div className={styles.teamIntro}>
              <p>
                <strong>Everyone can race</strong> is how the team works:
                experienced riders share their knowledge, racing is collective,
                and giving time back to the local cycling scene matters.
              </p>
              <p>
                For more than 20 years, Hagens Berman Racing has brought
                Seattle-area cyclists together to race throughout the Pacific
                Northwest.
              </p>
            </div>
          </header>

          <figure className={styles.teamPortrait}>
            <Image
              src="/media/team.webp"
              alt="A group of Hagens Berman Racing cyclists gathered with their bikes"
              width="1170"
              height="873"
              sizes="(max-width: 760px) calc(100vw - 40px), 80vw"
              loading="lazy"
            />
            <div className={styles.photoFlag} aria-hidden="true">
              <span>One team</span>
              <span>Seattle / PNW</span>
            </div>
            <figcaption>
              <span>Team archive / HBR Seattle</span>
              <p>Together before the start line.</p>
            </figcaption>
          </figure>

          <section className={styles.teamMethod} aria-labelledby="method-title">
            <header>
              <p>How the team moves / 04</p>
              <h3 id="method-title">
                The work between
                <em>the start lines.</em>
              </h3>
            </header>

            <ol className={styles.methodList}>
              <li>
                <span>01</span>
                <h4>Ride</h4>
                <p>Weekly team rides build the rhythm.</p>
              </li>
              <li>
                <span>02</span>
                <h4>Learn</h4>
                <p>
                  Skills and race-strategy clinics turn experience into shared
                  knowledge.
                </p>
              </li>
              <li>
                <span>03</span>
                <h4>Prepare</h4>
                <p>
                  Training camp and in-race support make preparation
                  collective.
                </p>
              </li>
              <li>
                <span>04</span>
                <h4>Give back</h4>
                <p>Every member volunteers at one local race.</p>
              </li>
            </ol>

            <div className={styles.squadRail}>
              <p>One roster / Four squads</p>
              <ul aria-label="Team squads">
                <li>Men</li>
                <li>Women</li>
                <li>Masters</li>
                <li>Development</li>
              </ul>
            </div>
          </section>

          <section
            className={styles.disciplines}
            aria-labelledby="disciplines-title"
          >
            <header className={styles.disciplineHeader}>
              <p>Race manual / Five disciplines</p>
              <h3 id="disciplines-title">
                Five ways in.
                <em>One team.</em>
              </h3>
              <p>
                Pick a course—or race them all. The same team-first approach
                carries across every discipline.
              </p>
            </header>

            <figure className={styles.actionFrame}>
              <Image
                src="/media/action-03.webp"
                alt="A road-race field climbing together on a forest-lined road"
                width="750"
                height="500"
                sizes="(max-width: 760px) calc(100vw - 40px), 40vw"
                loading="lazy"
              />
              <figcaption>
                <span>Road racing / Team archive</span>
                <span>Pacific Northwest</span>
              </figcaption>
            </figure>

            <ol className={styles.disciplineList}>
              <li>
                <span>01</span>
                <h4>Road</h4>
                <p>HBR discipline</p>
              </li>
              <li>
                <span>02</span>
                <h4>Gravel</h4>
                <p>HBR discipline</p>
              </li>
              <li>
                <span>03</span>
                <h4>Cyclocross</h4>
                <p>HBR discipline</p>
              </li>
              <li>
                <span>04</span>
                <h4>Track</h4>
                <p>HBR discipline</p>
              </li>
              <li>
                <span>05</span>
                <h4>Mountain bike</h4>
                <p>HBR discipline</p>
              </li>
            </ol>

            <footer className={styles.disciplineFooter}>
              <p>Seattle area / Racing across the Pacific Northwest</p>
              <span aria-hidden="true">01—05</span>
            </footer>
          </section>
        </section>

        <div className={styles.sectionIndex} aria-label="Explore the team">
          <header className={styles.sectionIndexHeader}>
            <p>Race manual / Section index</p>
            <p>HBR · Seattle</p>
          </header>

          <section
            className={styles.sectionIndexRow}
            id="events"
            aria-labelledby="events-title"
          >
            <p className={styles.sectionNumber}>02 / Race days</p>
            <h2 id="events-title">Events</h2>
            <p className={styles.sectionSummary}>
              The team presents the Mason Lake road race near Grapeview and
              the Women, Trans, Femme, Non-Binary racing series at Pacific
              Raceways.
            </p>
            <p className={styles.sectionTag}>Mason Lake / WTNB</p>
          </section>

          <section
            className={styles.sectionIndexRow}
            id="gallery"
            aria-labelledby="gallery-title"
          >
            <p className={styles.sectionNumber}>03 / Race archive</p>
            <h2 id="gallery-title">Gallery</h2>
            <p className={styles.sectionSummary}>
              Official race-day photography from Mason Lake follows the team
              through the bunch, the break, and the finish.
            </p>
            <p className={styles.sectionTag}>Official HBR gallery</p>
          </section>

          <section
            className={styles.sectionIndexRow}
            id="partners"
            aria-labelledby="partners-title"
          >
            <p className={styles.sectionNumber}>04 / Team support</p>
            <h2 id="partners-title">Partners</h2>
            <p className={styles.sectionSummary}>
              Hagens Berman, Smith, Skratch Labs, Specialized, and SILCA
              support the team.
            </p>
            <p className={styles.sectionTag}>Five verified partners</p>
          </section>

          <section
            className={`${styles.sectionIndexRow} ${styles.joinRow}`}
            id="join"
            aria-labelledby="join-title"
          >
            <p className={styles.sectionNumber}>05 / Membership</p>
            <h2 id="join-title">Join</h2>
            <p className={styles.sectionSummary}>
              Race with a Seattle team built around weekly rides, rider
              development, shared support, and showing up for one another.
            </p>
            <a href="https://www.hbsccycling.com/join-us">
              Join the team <span aria-hidden="true">↗</span>
            </a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
