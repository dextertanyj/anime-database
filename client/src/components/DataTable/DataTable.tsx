import { Table, Tbody, Thead } from "@chakra-ui/react";
import {
  ColumnDef,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { To } from "react-router-dom";

import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";
import { matchFilter, rankedSort, selectFilter } from "./utilities";

export type TableData = {
  link?: To;
};

export type DataTableProps<Data> = {
  data: Data[];
  columns: ColumnDef<Data, unknown>[];
};

export const DataTable = <Data extends TableData>({ data, columns }: DataTableProps<Data>) => {
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

  return (
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
