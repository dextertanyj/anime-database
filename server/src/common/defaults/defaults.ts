const WatchStatus = {
  IN_PROGRESS: { status: "Watching", color: "#3182CE" },
  COMPLETED: { status: "Completed", color: "#38A169" },
} as const;

export const defaults = {
  WatchStatus,
};
