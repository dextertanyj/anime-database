import { Box, HStack, Icon, Th, Tr } from "@chakra-ui/react";
import { flexRender, HeaderGroup } from "@tanstack/react-table";

import { BiSortDown, BiSortUp } from "react-icons/bi";

import { DataTableFilter } from "./DataTableFilter";

export const DataTableHeader = ({ group }: { group: HeaderGroup<never> }) => {
  return (
    <Tr>
      {group.headers.map((header) => {
        const sorted = header.column.getIsSorted();
        const canSort = header.column.getCanSort();
        return (
          <Th key={header.id} width={header.column.columnDef.meta?.maximize ? "full" : "inherit"}>
            <HStack justifyContent="space-between">
              <HStack
                cursor={canSort ? "pointer" : "auto"}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                spacing={1}
              >
                <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                {canSort && sorted ? (
                  <Icon as={{ asc: BiSortDown, desc: BiSortUp }[sorted]} />
                ) : (
                  <Box w={{ base: "0.75rem", xl: "1rem" }} />
                )}
              </HStack>
              <DataTableFilter column={header.column} />
            </HStack>
          </Th>
        );
      })}
    </Tr>
  );
};
