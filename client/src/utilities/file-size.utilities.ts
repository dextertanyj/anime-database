const units = ["B", "KB", "MB", "GB", "TB"] as const;

export const renderFileSize = (size: number): string => {
  if (size === 0) {
    return `0 ${units[0]}}`;
  }

  let idx = 0;

  while (size >= 1000 && idx < units.length - 1) {
    size /= 1000;
    idx++;
  }

  return `${size.toFixed(2).endsWith(".00") ? size.toFixed(1) : size.toFixed(2)} ${units[idx]}`;
};
