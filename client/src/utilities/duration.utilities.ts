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
