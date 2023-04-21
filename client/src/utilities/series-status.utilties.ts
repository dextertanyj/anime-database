import { SeriesStatus } from "src/generated/graphql";

export const renderSeriesStatus = (status: SeriesStatus) => {
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

export const seriesStatusColor = (status: SeriesStatus | string) => {
  status = status.toUpperCase();
  switch (status) {
    case SeriesStatus.Airing:
      return "blue";
    case SeriesStatus.Upcoming:
      return "gray";
    case SeriesStatus.Incomplete:
      return "yellow";
    case SeriesStatus.Complete:
      return "green";
  }
};
