import { useCallback, useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  HStack,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { To, useNavigate } from "react-router-dom";

import { DataTable } from "src/components/DataTable/DataTable";
import { SeriesQuery } from "src/generated/graphql";
import { useIsMobile } from "src/hooks/useIsMobile";

type Episode = NonNullable<SeriesQuery["series"]>["episodes"][number] & {
  link?: To;
};

const columnHelper = createColumnHelper<Episode>();
const columns = [
  columnHelper.accessor("title", {
    header: () => "Title",
    enableSorting: false,
    enableColumnFilter: false,
    meta: {
      maximize: true,
    },
  }),
  columnHelper.accessor("episodeNumber", {
    header: () => "#",
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: true,
  }),
];

const SimpleCard = ({ row }: { row: Row<Episode> }) => {
  const navigate = useNavigate();

  const hoverBackground = useColorModeValue("chakra-subtle-bg", "gray.600");

  const onClick = useCallback(() => {
    if (row.original.link) {
      navigate(row.original.link);
    }
  }, [navigate, row]);

  return (
    <Card size="sm" onClick={onClick} cursor="pointer" sx={{ _hover: { bg: hoverBackground } }}>
      <CardBody>
        <Stack spacing={2}>
          <Heading size="md">{row.getValue("title")}</Heading>
        </Stack>
      </CardBody>
    </Card>
  );
};

export const EpisodesTable = ({
  data,
}: {
  data: NonNullable<SeriesQuery["series"]>["episodes"];
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const tableData: Episode[] = useMemo(() => {
    return data
      .map((item) => ({
        ...item,
        link: `episode/${item.id}`,
      }))
      .sort((lhs, rhs) => (lhs.episodeNumber || 0) - (rhs.episodeNumber || 0));
  }, [data]);

  const initialState = useMemo(() => {
    if (tableData.length > 0 && !tableData[0].episodeNumber) {
      return {
        columnVisibility: {
          episodeNumber: false,
        },
      };
    }
    return undefined;
  }, [tableData]);

  return (
    <Stack spacing={2}>
      <HStack justify="space-between">
        <Heading size="lg">Episodes</Heading>
        {isMobile || <Button onClick={() => navigate("episode/create")}>Add</Button>}
      </HStack>
      <Divider />
      <DataTable
        data={tableData}
        columns={columns}
        CompactRowView={SimpleCard}
        initialState={initialState}
      />
    </Stack>
  );
};
