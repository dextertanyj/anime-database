import { useCallback, useMemo } from "react";
import {
  Center,
  Checkbox,
  CheckboxGroup,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Column } from "@tanstack/react-table";

import { BiFilter, BiFilterAlt, BiX } from "react-icons/bi";
import { isShallowEqualArray } from "src/utilities";

import { isSelectFilter } from "./utilities";

export const DataTableFilter = ({ column }: { column: Column<never> }) => {
  const isFiltered = column.getIsFiltered();

  const fontSize = useBreakpointValue({
    base: "sm",
    xl: "md",
  });

  const size = useBreakpointValue({
    base: "xs",
    xl: "sm",
  });

  const showFilter =
    column.getCanFilter() &&
    typeof column.columnDef.filterFn === "string" &&
    (column.columnDef.filterFn === "matchFilter" || column.columnDef.filterFn === "selectFilter");

  return showFilter ? (
    <Popover placement="bottom-end">
      <Center>
        <PopoverTrigger>
          <IconButton
            aria-label="filter"
            variant="ghost"
            colorScheme={isFiltered ? undefined : "gray"}
            isRound
            size={size}
            fontSize={fontSize}
            icon={<BiFilter />}
          />
        </PopoverTrigger>
      </Center>
      <PopoverContent w="200px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader display="flex" w="full" justifyContent="center">
          <BiFilterAlt />
        </PopoverHeader>
        <PopoverBody>
          {isSelectFilter(column.columnDef.filterFn) ? (
            <DataTableSelectFilter column={column} />
          ) : (
            <DataTableTextFilter column={column} />
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : null;
};

const DataTableSelectFilter = ({ column }: { column: Column<never> }) => {
  const values = useMemo(
    () => Array.from((column.getFacetedUniqueValues() as Map<string, number>).keys()),
    [column],
  );
  const existing = column.getFilterValue() as string[] | undefined;

  const onChange = useCallback(
    (selected: string[]) => {
      if (isShallowEqualArray(selected.sort(), values.sort())) {
        column.setFilterValue(undefined);
        return;
      }
      column.setFilterValue(selected);
    },
    [column, values],
  );

  const onSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        column.setFilterValue(undefined);
        return;
      }
      column.setFilterValue([]);
      return;
    },
    [column],
  );

  return (
    <Stack spacing={2}>
      <Checkbox
        fontWeight="normal"
        fontSize="sm"
        textTransform="none"
        isChecked={existing === undefined}
        isIndeterminate={existing !== undefined && existing.length !== 0}
        onChange={(e) => onSelectAll(e.target.checked)}
      >
        (Select all)
      </Checkbox>
      <CheckboxGroup value={existing ?? values} onChange={onChange}>
        <Stack spacing={2}>
          {Array.from(values)
            .sort()
            .map((value) => (
              <Checkbox
                key={value}
                fontWeight="normal"
                fontSize="sm"
                textTransform="none"
                value={value}
              >
                {value}
              </Checkbox>
            ))}
        </Stack>
      </CheckboxGroup>
    </Stack>
  );
};

const DataTableTextFilter = ({ column }: { column: Column<never> }) => {
  return (
    <InputGroup size="sm">
      <Input
        value={(column.getFilterValue() as string) ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      />
      {column.getFilterValue() ? (
        <InputRightElement>
          <IconButton
            aria-label="clear"
            variant="ghost"
            icon={<BiX />}
            size="xs"
            onClick={() => column.setFilterValue(undefined)}
          />
        </InputRightElement>
      ) : null}
    </InputGroup>
  );
};
