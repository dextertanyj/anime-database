import { Stack } from "@chakra-ui/react";
import { Row, Table } from "@tanstack/react-table";

import { useIsMobile } from "src/hooks/useIsMobile";

import { CompactDataTableHeader } from "./CompactDataTableHeader";
import { TableData } from "./DataTable";

export type CompactRowView<Data> = (props: { row: Row<Data> }) => JSX.Element;

export const CompactDataTable = <Data extends TableData>({
  CompactRowView,
  table,
}: {
  CompactRowView: CompactRowView<Data>;
  table: Table<Data>;
}) => {
  const isMobile = useIsMobile();

  return (
    <Stack spacing={isMobile ? 2 : 4}>
      <CompactDataTableHeader
        groups={table.getHeaderGroups()}
        sortingState={table.getState().sorting}
        setTableSortingState={table.setSorting}
        filterState={table.getState().columnFilters}
        setTableFilterState={table.setColumnFilters}
      />
      {table.getRowModel().rows.map((row) => (
        <CompactRowView key={row.id} row={row} />
      ))}
    </Stack>
  );
};
