import { HStack } from "@chakra-ui/react";
import { ColumnFiltersState, HeaderGroup, SortingState, Updater } from "@tanstack/react-table";

import { CompactDataTableFilter } from "./CompactDataTableFilter";
import { CompactDataTableSort } from "./CompactDataTableSort";

export const CompactDataTableHeader = ({
  groups,
  sortingState,
  setTableSortingState,
  filterState,
  setTableFilterState,
}: {
  groups: HeaderGroup<never>[];
  sortingState: SortingState;
  setTableSortingState: (updater: Updater<SortingState>) => void;
  filterState: ColumnFiltersState;
  setTableFilterState: (updater: Updater<ColumnFiltersState>) => void;
}) => {
  return (
    <HStack>
      <CompactDataTableSort
        groups={groups}
        sortingState={sortingState}
        setTableSortingState={setTableSortingState}
      />
      <CompactDataTableFilter
        groups={groups}
        filterState={filterState}
        setTableFilterState={setTableFilterState}
      />
    </HStack>
  );
};
