import { compareItems, RankingInfo, rankings, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, FilterFnOption, SortingFn, sortingFns } from "@tanstack/react-table";

declare module "@tanstack/table-core" {
  interface FilterFns {
    matchFilter: FilterFn<unknown>;
    selectFilter: FilterFn<unknown>;
  }
  interface FilterMeta {
    rank?: RankingInfo;
  }
  interface SortingFns {
    rankedSort: SortingFn<unknown>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    maximize?: boolean;
  }
}

export const isSelectFilter = (fn?: FilterFnOption<never>) => {
  return fn && typeof fn === "string" && fn === "selectFilter";
};

export const selectFilter: FilterFn<unknown> = (row, columnId, filterValue: string[]) => {
  return filterValue.includes(row.getValue<string>(columnId));
};

export const matchFilter: FilterFn<unknown> = (row, columnId, value: string, addMeta) => {
  const rank = rankItem(row.getValue(columnId), value, { threshold: rankings.ACRONYM });
  addMeta({ rank });
  return rank.passed;
};

export const rankedSort: SortingFn<unknown> = (first, second, columnId) => {
  const firstRank = first.columnFiltersMeta[columnId]?.rank;
  const secondRank = second.columnFiltersMeta[columnId]?.rank;

  let result = 0;
  if (firstRank && secondRank) {
    result = compareItems(firstRank, secondRank);
  }

  return result === 0 ? sortingFns.alphanumeric(first, second, columnId) : result;
};
