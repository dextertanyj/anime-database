import { SeriesStatus } from "src/generated/graphql";

export const seriesStatusToDisplayString = (status: SeriesStatus) => {
  switch (status) {
    case SeriesStatus.Airing:
      return "Airing";
    case SeriesStatus.Upcoming:
      return "Upcoming";
    case SeriesStatus.Incomplete:
      return "Incomplete";
    case SeriesStatus.Complete:
      return "Complete";
  }
};
