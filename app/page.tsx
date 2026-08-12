import type { Metadata } from "next";
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
              <a href="https://www.hbsccycling.com/join">
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

        <section className={styles.handoff} id="team" aria-labelledby="team-title">
          <p className={styles.handoffLabel}>The team / Seattle</p>
          <h2 id="team-title">
            Race together.
            <em>Grow together.</em>
          </h2>
          <aside>
            Weekly rides, rider clinics, team camp, and in-race support—built
            around a team-first approach.
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
