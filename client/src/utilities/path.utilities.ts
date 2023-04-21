export const renderPath = (str: string): string => {
  return str.replace(/(\/|\\)/g, "\u200B$1");
};
