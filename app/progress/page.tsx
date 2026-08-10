import type { Metadata } from "next";
import Link from "next/link";
import { passedPieceCount, progressPieces } from "../../lib/site-progress";
import styles from "./progress.module.css";

export const metadata: Metadata = {
  title: "Build Progress | Hagens Berman Racing Seattle",
  description:
    "Live build-room status for the Hagens Berman Racing Seattle website.",
};

export default function ProgressPage() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <Link className={styles.brand} href="/" aria-label="Hagens Berman Racing home">
          <span className={styles.brandMark} aria-hidden="true">
            HB
          </span>
          <span>
            Hagens Berman Racing
            <small>Seattle · Build room</small>
          </span>
        </Link>
        <p className={styles.issue}>Issue 01 · Production log</p>
      </header>

      <section className={styles.intro} aria-labelledby="progress-title">
        <p className={styles.eyebrow}>Puget Sound Race Manual / Live status</p>
        <div className={styles.introGrid}>
          <div>
            <h1 id="progress-title">Every piece earns its place.</h1>
            <p className={styles.dek}>
              Builder passes, harsh rendered critiques, and checkpoints—tracked
              from source truth to public launch.
            </p>
          </div>
          <div className={styles.score} aria-label={`${passedPieceCount} of ${progressPieces.length} pieces passed`}>
            <strong>
              {String(passedPieceCount).padStart(2, "0")}
              <span>/ {progressPieces.length}</span>
            </strong>
            <p>pieces passed</p>
          </div>
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={progressPieces.length}
          aria-valuenow={passedPieceCount}
          aria-label="Production progress"
        >
          <span
            style={{ width: `${(passedPieceCount / progressPieces.length) * 100}%` }}
          />
        </div>
      </section>

      <section className={styles.board} aria-labelledby="board-title">
        <div className={styles.boardHead}>
          <h2 id="board-title">Production board</h2>
          <p>
            <span aria-hidden="true" /> Active review
          </p>
        </div>

        <div className={styles.columnLabels} aria-hidden="true">
          <span>Piece / status</span>
          <span>Latest verdict</span>
          <span>Biggest gap</span>
          <span>Checkpoint</span>
        </div>

        <ol className={styles.pieceList}>
          {progressPieces.map((piece) => (
            <li
              className={`${styles.piece} ${
                piece.status === "QUEUED" ? styles.queuedPiece : ""
              }`}
              key={piece.id}
            >
              <div className={styles.identity}>
                <span className={styles.number} aria-hidden="true">
                  {String(piece.id).padStart(2, "0")}
                </span>
                <div>
                  <h3>{piece.name}</h3>
                  <div className={styles.statusLine}>
                    <span
                      className={`${styles.status} ${
                        piece.status === "IN REVIEW"
                          ? styles.review
                          : piece.status === "PASSED"
                            ? styles.passed
                            : styles.queued
                      }`}
                    >
                      {piece.status}
                    </span>
                    <span>Round {piece.round ?? "—"}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detail}>
                <p className={styles.mobileLabel}>Latest verdict</p>
                <p>{piece.latestVerdict}</p>
              </div>
              <div className={styles.detail}>
                <p className={styles.mobileLabel}>Biggest gap</p>
                <p>{piece.biggestGap}</p>
              </div>
              <div className={`${styles.detail} ${styles.checkpoint}`}>
                <p className={styles.mobileLabel}>Checkpoint</p>
                <p>{piece.checkpoint}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className={styles.footer}>
        <p>Built in Seattle. Reviewed in the rendered world.</p>
        <p>Last board reset · 09 Aug 2026</p>
      </footer>
    </main>
  );
}
