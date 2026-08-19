import type { Metadata } from "next";
import Image from "next/image";
import HeroMedia from "@/components/HeroMedia";
import HomeMotion from "@/components/HomeMotion";
import InitialHashStabilizer from "@/components/InitialHashStabilizer";
import RaceArchive from "@/components/RaceArchive";
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
    <div className={styles.site} id="top" data-motion-root>
      <InitialHashStabilizer />
      <HomeMotion />
      <SiteHeader />

      <main id="main-content">
        <section
          className={styles.hero}
          aria-labelledby="hero-title"
          data-motion-hero
        >
          <HeroMedia
            className={styles.media}
            videoClassName={styles.video}
            readyClassName={styles.mediaReady}
            motionHook
          />

          <div
            className={styles.raceStripe}
            aria-hidden="true"
            data-motion-hero-stripe
          >
            <span>HBR / Seattle / Five disciplines / One team</span>
          </div>

          <div className={styles.topRail} data-motion-hero-meta>
            <p>Seattle, Washington</p>
            <p>Amateur cycling / Team first</p>
          </div>

          <div className={styles.titleBlock}>
            <p className={styles.kicker} data-motion-hero-kicker>
              Hagens Berman Racing
            </p>
            <h1 id="hero-title">
              <span data-motion-hero-line>Everyone</span>
              <em data-motion-hero-line>can race.</em>
            </h1>
          </div>

          <div className={styles.bottomRail} data-motion-hero-meta>
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
          <header className={styles.teamLead} data-motion-masthead>
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

          <figure className={styles.teamPortrait} data-motion-image>
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
            <header data-motion-masthead>
              <p>How the team moves / 04</p>
              <div className={styles.methodTitle}>
                <h3 id="method-title">More than race day.</h3>
                <p>
                  Team racing is learned, practiced, and supported together.
                </p>
              </div>
            </header>

            <ol className={styles.methodList} data-motion-stagger>
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
            <header className={styles.disciplineHeader} data-motion-masthead>
              <p>Race atlas / 01—05</p>
              <h3 id="disciplines-title">The race changes under your wheels.</h3>
              <p>
                Five disciplines. One roster. The same team-first approach
                carries from paved bunches to forest trails.
              </p>
            </header>

            <ol className={styles.disciplineAtlas} data-motion-atlas>
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
          <header className={styles.eventsMasthead} data-motion-masthead>
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

            <div
              className={styles.masonDate}
              aria-label="March 21 and March 28, 2026"
              data-motion-accent
            >
              <span className={styles.dateMonth}>Mar</span>
              <span className={styles.dateDay}>21</span>
              <span className={styles.dateJoin} aria-hidden="true">+</span>
              <span className={styles.dateDay}>28</span>
              <span className={styles.dateYear}>2026 / Saturdays</span>
            </div>

            <figure className={styles.masonPhoto} data-motion-image>
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

            <ol
              className={styles.masonDays}
              aria-label="Mason Lake 2026 race dates"
              data-motion-stagger
            >
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
            <div
              className={styles.wtnbDate}
              aria-label="August 25, 2026"
              data-motion-accent
            >
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

            <figure className={styles.wtnbPhoto} data-motion-image>
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

            <ol
              className={styles.wtnbSchedule}
              aria-label="WTNB Night schedule"
              data-motion-stagger
            >
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

        <section
          className={styles.joinProgram}
          id="join"
          aria-labelledby="join-title"
        >
          <header className={styles.joinMasthead} data-motion-masthead>
            <div className={styles.joinIndex}>
              <span>03</span>
              <p>Membership / Seattle</p>
            </div>

            <div className={styles.joinHeading}>
              <p>Everyone can race.</p>
              <h2 id="join-title">
                Your place
                <em>in the bunch.</em>
              </h2>
            </div>

            <p className={styles.joinIntro}>
              Hagens Berman Racing fields men&apos;s, women&apos;s, masters, and
              development squads across five disciplines. The common thread is
              a team-first way of racing.
            </p>
          </header>

          <div className={styles.joinBody}>
            <div className={styles.joinVisualRail}>
              <figure className={styles.joinPortrait} data-motion-image>
                <Image
                  src="/media/action-05.webp"
                  alt="Two cyclists racing on a forest road, led by a rider in a Hagens Berman kit"
                  width="750"
                  height="500"
                  sizes="(max-width: 760px) calc(100vw - 40px), 39vw"
                  loading="lazy"
                  unoptimized
                />
                <div className={styles.joinPhotoFlag} aria-hidden="true">
                  <span>One kit</span>
                  <span>One team</span>
                </div>
                <figcaption>
                  <span>Official HBR race archive</span>
                  <span>Team kit / On course</span>
                </figcaption>
              </figure>

              <div className={styles.joinRailStatement} data-motion-accent>
                <p>
                  Everyone
                  <em>can race.</em>
                </p>
                <span>Five disciplines / One team-first roster</span>
              </div>
            </div>

            <article
              className={styles.joinDossier}
              aria-labelledby="exchange-title"
            >
              <header className={styles.dossierHeader}>
                <p>Membership briefing / HBR Seattle</p>
                <span>Rider exchange · 03 / 05</span>
              </header>

              <div className={styles.dossierLead}>
                <p>Team support / Shared commitment</p>
                <h3 id="exchange-title">
                  What the team offers.
                  <em>What you bring.</em>
                </h3>
                <p>
                  A racing team works when knowledge, preparation, and effort
                  move through the whole roster—not just one rider.
                </p>
              </div>

              <div className={styles.joinExchange}>
                <section
                  className={styles.teamOffers}
                  aria-labelledby="offers-title"
                >
                  <header>
                    <p>Team / Offers</p>
                    <h4 id="offers-title">Support from week to race day.</h4>
                  </header>
                  <ol data-motion-stagger>
                    <li>
                      <span>01</span>
                      <p>Weekly team rides</p>
                    </li>
                    <li>
                      <span>02</span>
                      <p>Skills and race-strategy clinics</p>
                    </li>
                    <li>
                      <span>03</span>
                      <p>Team training camp</p>
                    </li>
                    <li>
                      <span>04</span>
                      <p>In-race support</p>
                    </li>
                  </ol>
                </section>

                <section
                  className={styles.riderCommitment}
                  aria-labelledby="commitment-title"
                >
                  <header>
                    <p>Rider / Commits</p>
                    <h4 id="commitment-title">Show up for the team.</h4>
                  </header>
                  <dl>
                    <div>
                      <dt>Annual dues</dt>
                      <dd>$75</dd>
                    </div>
                    <div>
                      <dt>Team kit</dt>
                      <dd>
                        <strong>01</strong>
                        <span>Jersey + bib</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Give back</dt>
                      <dd>
                        <strong>01</strong>
                        <span>Local race</span>
                      </dd>
                    </div>
                  </dl>
                  <p className={styles.volunteerNote}>
                    Every member volunteers at one local race.
                  </p>
                </section>
              </div>

              <div className={styles.squadStrip}>
                <p>Four squads / One roster</p>
                <ul aria-label="Membership squads">
                  <li>Men</li>
                  <li>Women</li>
                  <li>Masters</li>
                  <li>Development</li>
                </ul>
              </div>

              <footer className={styles.joinAction}>
                <div>
                  <p>Start with an introduction.</p>
                  <span>
                    On the official page, choose JOIN THE TEAM to open the
                    contact form.
                  </span>
                </div>
                <a
                  href="https://www.hbsccycling.com/join-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the official Hagens Berman Racing join page (opens in a new tab)"
                >
                  Open official join page <span aria-hidden="true">↗</span>
                </a>
              </footer>
            </article>
          </div>

          <footer className={styles.joinFooter}>
            <p>Community / Development / Team racing</p>
            <span aria-hidden="true">03—05</span>
          </footer>
        </section>

        <RaceArchive />

        <section
          className={styles.partnersProgram}
          id="partners"
          aria-labelledby="partners-title"
        >
          <header className={styles.partnersMasthead} data-motion-masthead>
            <div className={styles.partnersIndex}>
              <span>05</span>
              <p>Partners / Current roster</p>
            </div>

            <div className={styles.partnersHeading}>
              <p>Team support / 01—05</p>
              <h2 id="partners-title">
                With good
                <em>company.</em>
              </h2>
            </div>

            <div className={styles.partnersIntro}>
              <p>
                Hagens Berman, Smith, Skratch Labs, Specialized, and SILCA
                make up the current HBR partner roster.
              </p>
              <span>Open a mark to visit its official site.</span>
            </div>
          </header>

          <div className={styles.partnerBoard}>
            <header className={styles.partnerBoardHeader}>
              <p>Partner field / Seattle</p>
              <p>Five verified names</p>
            </header>

            <ol
              className={styles.partnerGrid}
              aria-label="HBR partner roster"
              data-motion-stagger
            >
              <li className={styles.partnerHagens}>
                <a
                  href="https://www.hbsslaw.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit the official Hagens Berman website (opens in a new tab)"
                >
                  <figure>
                    <Image
                      src="/media/partner-hagens-berman.webp"
                      alt="Hagens Berman"
                      width="1160"
                      height="230"
                      sizes="(max-width: 760px) calc(100vw - 40px), 62vw"
                      loading="lazy"
                    />
                    <figcaption>
                      <span>01 / 05</span>
                      <span><span className={styles.officialWord}>Official </span>site ↗</span>
                    </figcaption>
                  </figure>
                </a>
              </li>

              <li className={styles.partnerSilca}>
                <a
                  href="https://silca.cc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit the official SILCA website (opens in a new tab)"
                >
                  <figure>
                    <Image
                      src="/media/partner-silca.webp"
                      alt="SILCA"
                      width="917"
                      height="792"
                      sizes="(max-width: 760px) calc(100vw - 40px), 28vw"
                      loading="lazy"
                    />
                    <figcaption>
                      <span>05 / 05</span>
                      <span><span className={styles.officialWord}>Official </span>site ↗</span>
                    </figcaption>
                  </figure>
                </a>
              </li>

              <li className={styles.partnerSmith}>
                <a
                  href="https://www.smithoptics.com/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit the official Smith Optics website (opens in a new tab)"
                >
                  <figure>
                    <Image
                      src="/media/partner-smith.webp"
                      alt="Smith"
                      width="1000"
                      height="400"
                      sizes="(max-width: 760px) calc(100vw - 40px), 31vw"
                      loading="lazy"
                    />
                    <figcaption>
                      <span>02 / 05</span>
                      <span><span className={styles.officialWord}>Official </span>site ↗</span>
                    </figcaption>
                  </figure>
                </a>
              </li>

              <li className={styles.partnerSkratch}>
                <a
                  href="https://www.skratchlabs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit the official Skratch Labs website (opens in a new tab)"
                >
                  <figure>
                    <Image
                      src="/media/partner-skratch.webp"
                      alt="Skratch Labs"
                      width="622"
                      height="178"
                      sizes="(max-width: 760px) calc(100vw - 40px), 27vw"
                      loading="lazy"
                    />
                    <figcaption>
                      <span>03 / 05</span>
                      <span><span className={styles.officialWord}>Official </span>site ↗</span>
                    </figcaption>
                  </figure>
                </a>
              </li>

              <li className={styles.partnerSpecialized}>
                <a
                  href="https://www.specialized.com/us/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit the official Specialized website (opens in a new tab)"
                >
                  <figure>
                    <Image
                      src="/media/partner-specialized.svg"
                      alt="Specialized"
                      width="1540"
                      height="160"
                      sizes="(max-width: 760px) calc(100vw - 40px), 62vw"
                      loading="lazy"
                    />
                    <figcaption>
                      <span>04 / 05</span>
                      <span><span className={styles.officialWord}>Official </span>site ↗</span>
                    </figcaption>
                  </figure>
                </a>
              </li>
            </ol>
          </div>

          <footer className={styles.partnersRunout}>
            <p>Team first / Race together</p>
            <div aria-hidden="true">
              <span>HBR</span>
              <span>SEA</span>
              <span>05 / 05</span>
            </div>
          </footer>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
