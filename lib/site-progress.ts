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
    status: "PASSED",
    round: 2,
    latestVerdict:
      "PASS — 8.9 desktop / 8.7 mobile. Contrast, touch targets, density, and truth gates cleared.",
    biggestGap: "No blocking gap; keep the board current at every checkpoint.",
    checkpoint: "10be0aa · P01 PASS",
  },
  {
    id: 2,
    name: "Design system",
    status: "PASSED",
    round: 2,
    latestVerdict:
      "PASS — 9.0 overall; clear desktop/mobile A/B win and source-truth gate cleared.",
    biggestGap: "No blocking gap; maintain tokens as production sections ship.",
    checkpoint: "a257b81 · P02 PASS",
  },
  {
    id: 3,
    name: "Global shell",
    status: "PASSED",
    round: 5,
    latestVerdict:
      "PASS — 9.0 overall; clear desktop/mobile A/B win with no objective shell defect.",
    biggestGap: "None — independently approved.",
    checkpoint: "P03 · R5 · PASS",
  },
  {
    id: 4,
    name: "Cinematic hero",
    status: "PASSED",
    round: 2,
    latestVerdict:
      "PASS — 9.0 overall; clear desktop/mobile A/B win with no objective hero defect.",
    biggestGap: "None — independently approved.",
    checkpoint: "P04 · R2 · PASS",
  },
  {
    id: 5,
    name: "Team story / disciplines",
    status: "PASSED",
    round: 3,
    latestVerdict:
      "PASS — 9.1 overall; clear desktop/mobile A/B win with no objective or licensing defect.",
    biggestGap: "None — independently approved.",
    checkpoint: "P05 · R3 · PASS",
  },
  {
    id: 6,
    name: "Events",
    status: "PASSED",
    round: 2,
    latestVerdict:
      "PASS — 9.2 overall; all categories cleared 8.7 with a clear desktop/mobile A/B win and no objective defect.",
    biggestGap: "None — independently approved.",
    checkpoint: "P06 · R2 · PASS",
  },
  {
    id: 7,
    name: "Join / membership",
    status: "PASSED",
    round: 2,
    latestVerdict:
      "PASS — 9.3 overall; clear desktop/mobile A/B win with verified signup truth and no objective defect.",
    biggestGap: "None — independently approved.",
    checkpoint: "P07 · R2 · PASS",
  },
  {
    id: 8,
    name: "Race gallery",
    status: "PASSED",
    round: 3,
    latestVerdict:
      "PASS — 9.3 overall; clear desktop/mobile A/B win with no objective gallery defect.",
    biggestGap: "None — independently approved.",
    checkpoint: "P08 · R3 · PASS",
  },
  {
    id: 9,
    name: "Partners",
    status: "PASSED",
    round: 3,
    latestVerdict:
      "PASS — 9.4 overall; clear desktop/mobile A/B win with no objective partner-section gap.",
    biggestGap: "None — independently approved.",
    checkpoint: "P09 · R3 · PASS",
  },
  {
    id: 10,
    name: "Motion language",
    status: "PASSED",
    round: 7,
    latestVerdict:
      "PASS — 9.1 overall; clear desktop/mobile A/B win with no objective motion-system gap.",
    biggestGap: "None — independently approved.",
    checkpoint: "P10 · R7 · PASS",
  },
  {
    id: 11,
    name: "Responsive / a11y / performance / SEO",
    status: "BUILDING",
    round: 1,
    latestVerdict: "R1 builder active — production hardening in progress.",
    biggestGap:
      "Full production hardening: metadata/social preview, keyboard/contrast/landmarks, Core Web Vitals/bundle/media budgets, responsive edge cases, and the obsolete test suite.",
    checkpoint: "P11 · R1 · BUILD",
  },
  {
    id: 12,
    name: "Final blind A/B + public deployment",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Production blind A/B and public anonymous deployment remain.",
    checkpoint: "P12 · PLANNED",
  },
] as const;

export const passedPieceCount = progressPieces.filter(
  (piece) => piece.status === "PASSED",
).length;
