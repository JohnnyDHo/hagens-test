export type ProgressStatus = "QUEUED" | "BUILDING" | "IN REVIEW" | "PASSED";

export type ProgressPiece = {
  id: number;
  name: string;
  status: ProgressStatus;
  round: number | null;
  latestVerdict: string;
  biggestGap: string;
  checkpoint: string;
};

export const progressPieces: readonly ProgressPiece[] = [
  {
    id: 1,
    name: "Content contract / progress board",
    status: "IN REVIEW",
    round: 1,
    latestVerdict: "Builder complete; independent rendered critique pending.",
    biggestGap: "Desktop and mobile visual QA has not yet been signed off.",
    checkpoint: "P01 · R1 · BUILD",
  },
  {
    id: 2,
    name: "Design system",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 3,
    name: "Global shell",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 4,
    name: "Cinematic hero",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 5,
    name: "Team story / disciplines",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 6,
    name: "Events",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 7,
    name: "Join / membership",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 8,
    name: "Race gallery",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 9,
    name: "Partners",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 10,
    name: "Motion language",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 11,
    name: "Responsive / a11y / performance / SEO",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
  {
    id: 12,
    name: "Final blind A/B + public deployment",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Builder pass not started.",
    checkpoint: "—",
  },
] as const;

export const passedPieceCount = progressPieces.filter(
  (piece) => piece.status === "PASSED",
).length;
