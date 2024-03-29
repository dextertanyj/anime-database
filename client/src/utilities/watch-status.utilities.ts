import { WatchStatusType } from "src/generated/graphql";

export const renderWatchStatus = (type: WatchStatusType) => {
  switch (type) {
    case WatchStatusType.Completed:
      return "Completed";
    case WatchStatusType.InProgress:
      return "Watching";
  }
};
