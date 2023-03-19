import { Table, Tbody, Thead, useBreakpointValue } from "@chakra-ui/react";
import {
  ColumnDef,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { To } from "react-router-dom";

import { CompactDataTable, CompactRowView } from "./CompactDataTable";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";
import { matchFilter, rankedSort, selectFilter } from "./utilities";

export type TableData = {
  link?: To;
};

export type DataTableProps<Data> = {
  data: Data[];
  columns: ColumnDef<Data, unknown>[];
  threshold?: "xs" | "sm" | "md" | "lg" | "md";
  CompactRowView?: CompactRowView<Data>;
};

export const DataTable = <Data extends TableData>({
  data,
  columns,
  threshold = "lg",
  CompactRowView,
}: DataTableProps<Data>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    filterFns: {
      matchFilter: matchFilter,
      selectFilter: selectFilter,
    },
    sortingFns: {
      rankedSort: rankedSort,
    },
    defaultColumn: {
      filterFn: "matchFilter",
      sortingFn: "rankedSort",
    },
  });

  const isCompact = useBreakpointValue(
    CompactRowView
      ? {
          base: true,
          [threshold]: false,
        }
      : { base: false },
  );

  return isCompact && CompactRowView ? (
    <CompactDataTable CompactRowView={CompactRowView} table={table} />
  ) : (
    <Table
      size={{ base: "sm", xl: "md" }}
      sx={{
        td: { paddingX: "16px" },
        th: { paddingX: "16px", fontSize: { base: "0.75rem", xl: "1rem" } },
      }}
    >
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => {
          // @ts-expect-error accessor definition mismatch
          return <DataTableHeader key={headerGroup.id} group={headerGroup} />;
        })}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <DataTableRow key={row.id} row={row} />
        ))}
      </Tbody>
    </Table>
  );
};
