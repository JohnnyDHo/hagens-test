export const HASH_LANDING_IDS = [
  "team",
  "events",
  "join",
  "gallery",
  "partners",
] as const;

const HASH_LANDING_ID_SET = new Set<string>(HASH_LANDING_IDS);

export const initialHashTargetId = (hash: string) => {
  if (!hash.startsWith("#") || hash.length < 2) return null;

  try {
    const id = decodeURIComponent(hash.slice(1));
    return HASH_LANDING_ID_SET.has(id) ? id : null;
  } catch {
    return null;
  }
};

export const anchorScrollTop = ({
  currentScrollY,
  targetViewportTop,
  stickyHeaderHeight,
  breathingRoom = 16,
}: {
  currentScrollY: number;
  targetViewportTop: number;
  stickyHeaderHeight: number;
  breathingRoom?: number;
}) =>
  Math.max(
    0,
    currentScrollY +
      targetViewportTop -
      Math.max(0, stickyHeaderHeight) -
      Math.max(0, breathingRoom),
  );

