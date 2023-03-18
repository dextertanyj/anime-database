import { Box } from "@chakra-ui/react";

import { EditableList } from "src/components/EditableList/EditableList";
import { WatchStatus } from "src/generated/graphql";

import { WatchStatusEntry } from "./WatchStatusEntry";

export const WatchStatusPanel = ({
  statuses,
}: {
  statuses: Array<Pick<WatchStatus, "id" | "status" | "color">>;
}) => {
  return (
    <Box>
      <EditableList data={statuses} ListElement={WatchStatusEntry} />
    </Box>
  );
};
