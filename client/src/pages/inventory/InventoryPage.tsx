import { useMemo } from "react";
import { Box, Button } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import { DataTable } from "src/components/DataTable/DataTable";
import { SeriesesQuery } from "src/generated/graphql";
import { series } from "src/hooks/operations/useSeries";
import { HeaderPageLayout } from "src/layouts/HeaderPageLayout";
import { seriesStatusToDisplayString } from "src/utilities/series-status.utilties";

const columnHelper = createColumnHelper<SeriesesQuery["serieses"][number]>();
const columns = [
  columnHelper.accessor("title", {
    header: () => "Title",
    meta: {
      maximize: true,
    },
  }),
  columnHelper.accessor("type.type", {
    header: () => "Type",
    filterFn: "selectFilter",
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (props) => seriesStatusToDisplayString(props.getValue()),
    filterFn: "selectFilter",
  }),
  columnHelper.accessor("progress.status.status", {
    header: () => "Progress",
  }),
];

export const InventoryPage = () => {
  const { data } = series.useGetAll();
  const navigate = useNavigate();

  const tableData = useMemo(() => {
    return data?.serieses.map((item) => ({
      ...item,
      link: `/series/${item.id}`,
    }));
  }, [data]);

  if (!tableData) {
    return null;
  }

  return (
    <HeaderPageLayout
      title="Anime Inventory"
      HeaderAdronment={<Button onClick={() => navigate("/series/create")}>Add</Button>}
    >
      <Box minW="650px">
        {/* @ts-expect-error accessor definition mismatch */}
        <DataTable data={tableData} columns={columns} />
      </Box>
    </HeaderPageLayout>
  );
};
