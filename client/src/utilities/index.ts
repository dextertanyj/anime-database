export const isShallowEqualArray = <T>(lhs: readonly T[], rhs: readonly T[]) => {
  if (lhs.length !== rhs.length) {
    return false;
  }
  const left = [...lhs].sort();
  const right = [...lhs].sort();
  for (let idx = 0; idx < left.length; idx++) {
    if (left[idx] !== right[idx]) {
      return false;
    }
  }
  return true;
};

export const isNotWhitespaceOnly = (str: string) => {
  return str === "" || !!str.trim();
};
