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
    status: "BUILDING",
    round: 1,
    latestVerdict: "Builder assignment active.",
    biggestGap: "Editorial tokens and responsive primitives are not yet established.",
    checkpoint: "P02 · R1 · BUILD",
  },
  {
    id: 3,
    name: "Global shell",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Navigation, mobile menu, and footer behaviors are not yet built.",
    checkpoint: "P03 · PLANNED",
  },
  {
    id: 4,
    name: "Cinematic hero",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Video, poster, crop, copy, and CTA treatment are not yet built.",
    checkpoint: "P04 · PLANNED",
  },
  {
    id: 5,
    name: "Team story / disciplines",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "The five-discipline editorial narrative is not yet built.",
    checkpoint: "P05 · PLANNED",
  },
  {
    id: 6,
    name: "Events",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "WTNB and Mason Lake facts are not yet translated into usable stories.",
    checkpoint: "P06 · PLANNED",
  },
  {
    id: 7,
    name: "Join / membership",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Membership benefits, requirements, and working CTA are not yet built.",
    checkpoint: "P07 · PLANNED",
  },
  {
    id: 8,
    name: "Race gallery",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Official race imagery is curated but the gallery experience is not built.",
    checkpoint: "P08 · PLANNED",
  },
  {
    id: 9,
    name: "Partners",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Verified partner marks and hierarchy are not yet integrated.",
    checkpoint: "P09 · PLANNED",
  },
  {
    id: 10,
    name: "Motion language",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "GSAP choreography and reduced-motion equivalence are not yet unified.",
    checkpoint: "P10 · PLANNED",
  },
  {
    id: 11,
    name: "Responsive / a11y / performance / SEO",
    status: "QUEUED",
    round: null,
    latestVerdict: "No verdict yet.",
    biggestGap: "Four-viewport QA, Lighthouse, metadata, and console checks remain.",
    checkpoint: "P11 · PLANNED",
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
