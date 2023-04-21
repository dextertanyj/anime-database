import { useCallback, useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { To, useNavigate } from "react-router-dom";

import { DataTable } from "src/components/DataTable/DataTable";
import { SeriesesQuery } from "src/generated/graphql";
import { series } from "src/hooks/operations/useSeries";
import { useIsMobile } from "src/hooks/useIsMobile";
import { HeaderPageLayout } from "src/layouts/HeaderPageLayout";
import { renderSeriesStatus, seriesStatusColor } from "src/utilities/series-status.utilties";

type Series = Omit<SeriesesQuery["serieses"][number], "status"> & { status: string; link?: To };

const columnHelper = createColumnHelper<Series>();
const columns = [
  columnHelper.accessor("title", {
    header: () => "Title",
    meta: {
      maximize: true,
    },
  }),
  columnHelper.accessor("type.type", {
    id: "type",
    header: () => "Type",
    filterFn: "selectFilter",
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    filterFn: "selectFilter",
  }),
  columnHelper.accessor("progress.status.status", {
    id: "progress",
    header: () => "Progress",
  }),
];

const SimpleCard = ({ row }: { row: Row<Series> }) => {
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
          <HStack w="full">
            <Text>{row.getValue("type")}</Text>
            <Box w="full" />
            <Badge colorScheme={seriesStatusColor(row.getValue("status"))}>
              {row.getValue("status")}
            </Badge>
            <Text>{row.getValue("progress")}</Text>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export const InventoryPage = () => {
  const isMobile = useIsMobile();
  const { data } = series.useGetAll();
  const navigate = useNavigate();

  const tableData: Series[] | undefined = useMemo(() => {
    return data?.serieses.map((item) => ({
      ...item,
      link: `/series/${item.id}`,
      status: renderSeriesStatus(item.status),
    }));
  }, [data]);

  if (!tableData) {
    return null;
  }

  return (
    <HeaderPageLayout
      title="Anime Inventory"
      HeaderAdronment={isMobile || <Button onClick={() => navigate("/series/create")}>Add</Button>}
    >
      <DataTable data={tableData} columns={columns} CompactRowView={SimpleCard} />
    </HeaderPageLayout>
  );
};
