import { Season } from "@prisma/client";

const SEASON_ORDER = [Season.WINTER, Season.SPRING, Season.SUMMER, Season.FALL] as const;

type ReleaseDate = { year?: number | null; season?: Season | null };

export const releaseDateComparator = (lhs: ReleaseDate, rhs: ReleaseDate): number => {
  if ((!rhs.year || !rhs.season) && (!lhs.year || !lhs.season)) {
    return 0;
  }
  if (!lhs.year || !lhs.season) {
    return 1;
  }
  if (!rhs.year || !rhs.season) {
    return -1;
  }
  const delta = lhs.year - rhs.year;
  if (delta !== 0) {
    return delta;
  }
  return SEASON_ORDER.indexOf(lhs.season) - SEASON_ORDER.indexOf(rhs.season);
};
