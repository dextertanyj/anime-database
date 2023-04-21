export const destructureDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600) || NaN;
  let minutes = Math.floor((duration % 3600) / 60);
  let seconds = duration % 60;
  if (!hours && !minutes) {
    minutes = NaN;
  }
  if (!hours && !minutes && !seconds) {
    seconds = NaN;
  }
  return { hours, minutes, seconds };
};

export const restructureDuration = (duration: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  return (duration.hours || 0) * 3600 + (duration.minutes || 0) * 60 + (duration.seconds || 0);
};

export const renderDuration = (
  duration: number | { hours: number; minutes: number; seconds: number },
) => {
  if (typeof duration === "number") {
    duration = destructureDuration(duration);
  }
  const { hours, minutes, seconds } = duration;
  const hoursString = hours ? `${hours}h ` : "";
  const minutesString = minutes ? `${minutes}m ` : "";
  const secondsString = seconds ? `${seconds}s` : "";
  return `${hoursString}${minutesString}${secondsString}`;
};
