import {
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { flexRender, HeaderGroup, SortingState, Updater } from "@tanstack/react-table";

import { BiSortDown, BiSortUp, BiX } from "react-icons/bi";

export const CompactDataTableSort = ({
  groups,
  sortingState,
  setTableSortingState,
}: {
  groups: HeaderGroup<never>[];
  sortingState: SortingState;
  setTableSortingState: (updater: Updater<SortingState>) => void;
}) => {
  const headers = groups.flatMap((headerGroup) => headerGroup.headers);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        variant="outline"
        onClick={onOpen}
        w="full"
        colorScheme={sortingState.length ? "teal" : "gray"}
      >
        Sort
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={6}>
            <Stack spacing={4}>
              <HStack justifyContent="space-between">
                <Heading size="md">Sort By</Heading>
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
                  .filter((header) => header.column.getCanSort())
                  .map((header) => {
                    const sorted = header.column.getIsSorted();
                    return (
                      <HStack key={header.id} justifyContent="space-between">
                        <Text fontWeight="semibold">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Text>
                        <ButtonGroup isAttached>
                          <IconButton
                            aria-label="ascending"
                            variant={sorted && sorted == "asc" ? "solid" : "outline"}
                            colorScheme={sorted && sorted == "asc" ? "teal" : "gray"}
                            onClick={() =>
                              setTableSortingState([{ id: header.column.id, desc: false }])
                            }
                            icon={<BiSortDown />}
                          />
                          <IconButton
                            aria-label="descending"
                            variant={sorted && sorted == "desc" ? "solid" : "outline"}
                            colorScheme={sorted && sorted == "desc" ? "teal" : "gray"}
                            onClick={() =>
                              setTableSortingState([{ id: header.column.id, desc: true }])
                            }
                            icon={<BiSortUp />}
                          />
                        </ButtonGroup>
                      </HStack>
                    );
                  })}
              </Stack>
              <Button size="sm" w="30%" alignSelf="center" onClick={() => setTableSortingState([])}>
                Clear
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
