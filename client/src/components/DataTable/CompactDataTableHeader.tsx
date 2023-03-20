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
  const canAnySort =
    groups
      .flatMap((group) => group.headers)
      .map((header) => header.column)
      .filter((column) => column.getCanSort()).length > 0;

  const canAnyFilter =
    groups
      .flatMap((group) => group.headers)
      .map((header) => header.column)
      .filter((column) => column.getCanFilter()).length > 0;

  return (
    <HStack>
      {canAnySort && (
        <CompactDataTableSort
          groups={groups}
          sortingState={sortingState}
          setTableSortingState={setTableSortingState}
        />
      )}
      {canAnyFilter && (
        <CompactDataTableFilter
          groups={groups}
          filterState={filterState}
          setTableFilterState={setTableFilterState}
        />
      )}
    </HStack>
  );
};
