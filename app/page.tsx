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
              <div className={styles.methodTitle}>
                <h3 id="method-title">More than race day.</h3>
                <p>
                  Team racing is learned, practiced, and supported together.
                </p>
              </div>
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
              <p>Race atlas / 01—05</p>
              <h3 id="disciplines-title">The race changes under your wheels.</h3>
              <p>
                Five disciplines. One roster. The same team-first approach
                carries from paved bunches to forest trails.
              </p>
            </header>

            <ol className={styles.disciplineAtlas}>
              <li className={styles.roadLane}>
                <article>
                  <figure>
                    <Image
                      src="/media/action-03.webp"
                      alt="A road-race field climbing together on a paved forest highway"
                      width="750"
                      height="500"
                      sizes="(max-width: 760px) calc(100vw - 40px), 55vw"
                      loading="lazy"
                    />
                    <figcaption className={styles.officialCredit}>
                      Official HBR team archive
                    </figcaption>
                  </figure>
                  <div className={styles.laneCopy}>
                    <span>01 / Paved bunch</span>
                    <h4>Road</h4>
                    <p>Paved courses. Bunch racing.</p>
                  </div>
                </article>
              </li>

              <li className={styles.gravelLane}>
                <article>
                  <figure>
                    <Image
                      src="/media/discipline-gravel.webp"
                      alt="A cyclist descending a rocky mixed-surface route above forested hills"
                      width="1400"
                      height="934"
                      sizes="(max-width: 760px) calc(100vw - 40px), 31vw"
                      loading="lazy"
                    />
                    <figcaption className={styles.photoCredit}>
                      <span>Reference image · Cropped + WebP derivative</span>
                      <span className={styles.creditLinks}>
                        <a
                          href="https://commons.wikimedia.org/wiki/File:Cyclist_on_gravel_bike_descending_Eldridge_Grade.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the gravel reference image by Drakepirates on Wikimedia Commons (opens in a new tab)"
                        >
                          Image · Drakepirates <span aria-hidden="true">↗</span>
                        </a>
                        <a
                          href="https://creativecommons.org/licenses/by-sa/4.0/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the CC BY-SA 4.0 license for the gravel reference image (opens in a new tab)"
                        >
                          CC BY-SA 4.0 <span aria-hidden="true">↗</span>
                        </a>
                      </span>
                    </figcaption>
                  </figure>
                  <div className={styles.laneCopy}>
                    <span>02 / Mixed surface</span>
                    <h4>Gravel</h4>
                    <p>Loose ground. Long routes.</p>
                  </div>
                </article>
              </li>

              <li className={styles.crossLane}>
                <article>
                  <figure>
                    <Image
                      src="/media/discipline-cyclocross.webp"
                      alt="Cyclocross racers climbing a grass incline inside a taped circuit"
                      width="1024"
                      height="1024"
                      sizes="(max-width: 760px) calc(100vw - 40px), 27vw"
                      loading="lazy"
                    />
                    <figcaption className={styles.photoCredit}>
                      <span>Reference image · Cropped + WebP derivative</span>
                      <span className={styles.creditLinks}>
                        <a
                          href="https://commons.wikimedia.org/wiki/File:JeremyPowersCXNats.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the cyclocross reference image by Roxanne King on Wikimedia Commons (opens in a new tab)"
                        >
                          Image · Roxanne King <span aria-hidden="true">↗</span>
                        </a>
                        <a
                          href="https://creativecommons.org/licenses/by/2.0/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the CC BY 2.0 license for the cyclocross reference image (opens in a new tab)"
                        >
                          CC BY 2.0 <span aria-hidden="true">↗</span>
                        </a>
                      </span>
                    </figcaption>
                  </figure>
                  <div className={styles.laneCopy}>
                    <span>03 / Off-road circuit</span>
                    <h4>Cyclocross</h4>
                    <p>Taped course. Fast laps.</p>
                  </div>
                </article>
              </li>

              <li className={styles.trackLane}>
                <article>
                  <figure>
                    <Image
                      src="/media/discipline-track.webp"
                      alt="A cyclist riding the banking of an outdoor velodrome"
                      width="1000"
                      height="1334"
                      sizes="(max-width: 760px) calc(100vw - 40px), 27vw"
                      loading="lazy"
                    />
                    <figcaption className={styles.photoCredit}>
                      <span>Reference image · Cropped + WebP derivative</span>
                      <span className={styles.creditLinks}>
                        <a
                          href="https://unsplash.com/photos/a-person-riding-a-bike-on-a-track-QvN9oEvvdm4"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the track reference image by Vitalii Khodzinskyi on Unsplash (opens in a new tab)"
                        >
                          Image · Vitalii Khodzinskyi <span aria-hidden="true">↗</span>
                        </a>
                        <a
                          href="https://unsplash.com/license"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the Unsplash License for the track reference image (opens in a new tab)"
                        >
                          Unsplash License <span aria-hidden="true">↗</span>
                        </a>
                      </span>
                    </figcaption>
                  </figure>
                  <div className={styles.laneCopy}>
                    <span>04 / Velodrome</span>
                    <h4>Track</h4>
                    <p>Banked oval. Measured lines.</p>
                  </div>
                </article>
              </li>

              <li className={styles.mountainLane}>
                <article>
                  <figure>
                    <Image
                      src="/media/discipline-mtb.webp"
                      alt="A mountain biker navigating a narrow trail through dense forest"
                      width="1000"
                      height="1500"
                      sizes="(max-width: 760px) calc(100vw - 40px), 27vw"
                      loading="lazy"
                    />
                    <figcaption className={styles.photoCredit}>
                      <span>Reference image · Cropped + WebP derivative</span>
                      <span className={styles.creditLinks}>
                        <a
                          href="https://www.pexels.com/photo/man-using-a-mountain-bike-in-the-forest-11715051/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the mountain bike reference image by Jonathan Cooper on Pexels (opens in a new tab)"
                        >
                          Image · Jonathan Cooper <span aria-hidden="true">↗</span>
                        </a>
                        <a
                          href="https://www.pexels.com/license/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View the Pexels License for the mountain bike reference image (opens in a new tab)"
                        >
                          Pexels License <span aria-hidden="true">↗</span>
                        </a>
                      </span>
                    </figcaption>
                  </figure>
                  <div className={styles.laneCopy}>
                    <span>05 / Trail</span>
                    <h4>Mountain bike</h4>
                    <p>Forest trail. Off-road lines.</p>
                  </div>
                </article>
              </li>
            </ol>

            <footer className={styles.disciplineFooter}>
              <p>Seattle area / Racing across the Pacific Northwest</p>
              <span aria-hidden="true">01—05</span>
            </footer>
          </section>
        </section>

        <section
          className={styles.eventsProgram}
          id="events"
          aria-labelledby="events-title"
        >
          <header className={styles.eventsMasthead}>
            <div className={styles.eventsIndex}>
              <span>02</span>
              <p>Presented races / 2026</p>
            </div>

            <div className={styles.eventsHeading}>
              <p>HBR race calendar</p>
              <h2 id="events-title">
                Two venues.
                <em>Three start lines.</em>
              </h2>
            </div>

            <p className={styles.eventsIntro}>
              Hagens Berman Racing presents two spring road-race days around
              Mason Lake and an August night for women, trans, and non-binary
              racers at Pacific Raceways.
            </p>
          </header>

          <article className={styles.masonEvent} aria-labelledby="mason-title">
            <div className={styles.eventLedger}>
              <p>Road race / 2026</p>
              <p>Grapeview, Washington</p>
              <p>Presented by HBR Seattle</p>
            </div>

            <div className={styles.masonDate} aria-label="March 21 and March 28, 2026">
              <span className={styles.dateMonth}>Mar</span>
              <span className={styles.dateDay}>21</span>
              <span className={styles.dateJoin} aria-hidden="true">+</span>
              <span className={styles.dateDay}>28</span>
              <span className={styles.dateYear}>2026 / Saturdays</span>
            </div>

            <figure className={styles.masonPhoto}>
              <div className={styles.masonFrames}>
                <div>
                  <Image
                    src="/media/mason-05.webp"
                    alt="A road-race group moving through the trees on the Mason Lake course"
                    width="750"
                    height="600"
                    sizes="(max-width: 760px) calc(100vw - 40px), 34vw"
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div>
                  <Image
                    src="/media/mason-06.webp"
                    alt="A road-race field riding together on the Mason Lake course"
                    width="750"
                    height="500"
                    sizes="(max-width: 760px) 78vw, 38vw"
                    loading="lazy"
                    unoptimized
                  />
                </div>
              </div>
              <figcaption>
                <span>Official HBR race archive</span>
                <span>Two race days / one course</span>
              </figcaption>
            </figure>

            <div className={styles.masonCopy}>
              <p className={styles.eventSequence}>Race days / 01 + 02</p>
              <h3 id="mason-title">Mason Lake Road Race</h3>
              <p>
                The 2026 Mason Lake Road Race pairs two Saturdays on a rolling
                12-mile loop around scenic Mason Lake near Grapeview.
              </p>
              <a
                href="https://www.hbsccycling.com/mason-lake"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View official 2026 Mason Lake race information (opens in a new tab)"
              >
                Official race information <span aria-hidden="true">↗</span>
              </a>
            </div>

            <ol className={styles.masonDays} aria-label="Mason Lake 2026 race dates">
              <li>
                <span>Day 01</span>
                <time dateTime="2026-03-21">Saturday / March 21 / 2026</time>
              </li>
              <li>
                <span>Day 02</span>
                <time dateTime="2026-03-28">Saturday / March 28 / 2026</time>
              </li>
            </ol>

            <dl className={styles.courseReadout}>
              <div>
                <dt>Loop</dt>
                <dd>12 miles</dd>
              </div>
              <div>
                <dt>Profile</dt>
                <dd>Rolling hills</dd>
              </div>
              <div>
                <dt>Place</dt>
                <dd>Mason Lake</dd>
              </div>
            </dl>
          </article>

          <article className={styles.wtnbEvent} aria-labelledby="wtnb-title">
            <div className={styles.wtnbDate} aria-label="August 25, 2026">
              <span>Aug</span>
              <strong>25</strong>
              <small>Tue / 2026</small>
            </div>

            <div className={styles.wtnbCopy}>
              <p className={styles.eventSequence}>Race night / 03</p>
              <h3 id="wtnb-title">
                WTNB Night
                <em>at Pacific Raceways</em>
              </h3>
              <p>
                A beginner clinic at 6:00 PM, followed by a short,
                beginner-friendly women, trans, and non-binary race at 6:45 PM
                on the closed circuit in Kent.
              </p>
              <a
                href="https://www.hbsccycling.com/wtnb-night-at-pr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View official 2026 WTNB Night information (opens in a new tab)"
              >
                Event information <span aria-hidden="true">↗</span>
              </a>
            </div>

            <figure className={styles.wtnbPhoto}>
              <Image
                src="/media/race-03.webp"
                alt="Cyclists gathered at the start of a road race"
                width="750"
                height="500"
                sizes="(max-width: 760px) calc(100vw - 40px), 30vw"
                loading="lazy"
                unoptimized
              />
              <figcaption>
                <span>Official HBR race archive</span>
                <span>Race-day community</span>
              </figcaption>
            </figure>

            <ol className={styles.wtnbSchedule} aria-label="WTNB Night schedule">
              <li>
                <time dateTime="2026-08-25T18:00">6:00 PM</time>
                <p>Beginner race clinic</p>
              </li>
              <li>
                <time dateTime="2026-08-25T18:45">6:45 PM</time>
                <p>WTNB race</p>
              </li>
            </ol>
          </article>

          <footer className={styles.eventsFooter}>
            <p>Three starts / two venues / one racing community</p>
            <span aria-hidden="true">02—03</span>
          </footer>
        </section>

        <div className={styles.sectionIndex} aria-label="Explore the team">
          <header className={styles.sectionIndexHeader}>
            <p>Race manual / Next sections</p>
            <p>HBR · Seattle</p>
          </header>

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
