import { Season as PrismaSeason } from "@prisma/client";
import { addWeeks, endOfMonth, isAfter, isBefore, max, setYear, startOfMonth } from "date-fns";

import { Season as GraphQLSeason, SeriesStatus } from "src/generated/graphql";

type ReleaseDate = {
  year: number;
  season: PrismaSeason | GraphQLSeason;
};

const boundaries = {
  WINTER: { start: 1, end: 3 },
  FALL: { start: 4, end: 6 },
  SUMMER: { start: 7, end: 9 },
  SPRING: { start: 10, end: 12 },
} as const;

export const getTimeBasedStatus = (
  release: ReleaseDate,
  episodeCount?: number,
): SeriesStatus | null => {
  const today = new Date();
  const start = setYear(startOfMonth(boundaries[release.season].start), release.year);
  if (isBefore(today, start)) {
    return SeriesStatus.UPCOMING;
  }
  let end = setYear(endOfMonth(boundaries[release.season].end), release.year);
  if (episodeCount) {
    const adjustedEnd = endOfMonth(addWeeks(start, episodeCount));
    end = max([end, adjustedEnd]);
  }
  if (!isAfter(today, end)) {
    return SeriesStatus.AIRING;
  }
  return null;
};
