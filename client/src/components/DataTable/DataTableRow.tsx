import { useCallback } from "react";
import { Td, Tr } from "@chakra-ui/react";
import { flexRender, Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import type { TableData } from "./DataTable";

export const DataTableRow = <Data extends TableData>({ row }: { row: Row<Data> }) => {
  const navigate = useNavigate();
  const { link } = row.original;

  const onClick = useCallback(() => {
    if (link) {
      navigate(link);
    }
  }, [link, navigate]);

  return (
    <Tr
      cursor={link && "pointer"}
      _hover={
        link
          ? {
              bg: "chakra-subtle-bg",
            }
          : undefined
      }
      onClick={onClick}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <Td maxW="fit-content" key={cell.id}>
            <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
          </Td>
        );
      })}
    </Tr>
  );
};
