export const setCompare = <T>(
  lhs: Set<T>,
  rhs: Set<T>,
  comparator: (lhs: T, rhs: T) => boolean = (lhs, rhs) => lhs === rhs,
): { lhsOnly: Set<T>; intersect: Set<T>; rhsOnly: Set<T> } => {
  const lhsOnly: Set<T> = new Set(
    [...lhs].filter((item) => !Array.from(rhs).some((element) => comparator(item, element))),
  );
  const intersect: Set<T> = new Set(
    [...lhs].filter((item) => Array.from(rhs).some((element) => comparator(item, element))),
  );
  const rhsOnly: Set<T> = new Set(
    [...rhs].filter((item) => !Array.from(lhs).some((element) => comparator(element, item))),
  );
  return { lhsOnly, intersect, rhsOnly };
};
