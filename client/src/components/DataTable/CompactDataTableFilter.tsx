import { useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Column,
  ColumnFiltersState,
  flexRender,
  HeaderGroup,
  Updater,
} from "@tanstack/react-table";

import { BiX } from "react-icons/bi";
import { isShallowEqualArray } from "src/utilities";

export const CompactDataTableFilter = ({
  groups,
  filterState,
  setTableFilterState,
}: {
  groups: HeaderGroup<never>[];
  filterState: ColumnFiltersState;
  setTableFilterState: (updater: Updater<ColumnFiltersState>) => void;
}) => {
  const headers = groups
    .flatMap((headerGroup) => headerGroup.headers)
    .filter(
      (header) =>
        header.column.columnDef.filterFn === "matchFilter" ||
        header.column.columnDef.filterFn === "selectFilter",
    );

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        variant="outline"
        onClick={onOpen}
        w="full"
        colorScheme={filterState.length ? "teal" : "gray"}
      >
        Filter
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={6}>
            <Stack spacing={4}>
              <HStack justifyContent="space-between">
                <Heading size="md">Filter By</Heading>
                <IconButton
                  aria-label="close"
                  variant="ghost"
                  onClick={onClose}
                  icon={<BiX />}
                  colorScheme="gray"
                  size="sm"
                />
              </HStack>
              <Stack spacing={3}>
                {headers
                  .filter((header) => header.column.getCanFilter())
                  .map((header) => {
                    return (
                      <Stack key={header.id} justifyContent="space-between">
                        <Text fontWeight="semibold">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Text>
                        {header.column.columnDef.filterFn === "selectFilter" ? (
                          <CompactDataTableSelectFilter column={header.column} />
                        ) : (
                          <CompactDataTableTextFilter column={header.column} />
                        )}
                      </Stack>
                    );
                  })}
              </Stack>
              <Button size="sm" w="30%" alignSelf="center" onClick={() => setTableFilterState([])}>
                Clear
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const CompactDataTableSelectFilter = ({ column }: { column: Column<never> }) => {
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
        <Box display="flex" flexWrap="wrap" alignItems="center">
          {Array.from(values)
            .sort()
            .map((value) => (
              <Box key={value} mr={2}>
                <Checkbox fontWeight="normal" fontSize="sm" textTransform="none" value={value}>
                  {value}
                </Checkbox>
              </Box>
            ))}
        </Box>
      </CheckboxGroup>
    </Stack>
  );
};

const CompactDataTableTextFilter = ({ column }: { column: Column<never> }) => {
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
