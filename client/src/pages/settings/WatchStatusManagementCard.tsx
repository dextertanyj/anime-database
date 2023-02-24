import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  useColorMode,
} from "@chakra-ui/react";

import { watchStatus } from "src/hooks/operations/useWatchStatus";

import { DefaultWatchStatusPanel } from "./DefaultWatchStatusPanel";
import { WatchStatusPanel } from "./WatchStatusPanel";

export const WatchStatusManagementCard = () => {
  const { data } = watchStatus.useGetAll();
  const { colorMode } = useColorMode();

  return !data ? null : (
    <Card w="full">
      <CardHeader pb={0}>
        <Heading size="md">Watch Status</Heading>
      </CardHeader>
      <CardBody>
        <HStack
          alignItems="start"
          justifyContent="space-between"
          divider={<Divider orientation="vertical" />}
        >
          <Box w="50%">
            <WatchStatusPanel statuses={data.watchStatuses} />
          </Box>
          <Box
            w="50%"
            borderLeft="1px"
            borderLeftColor={colorMode === "light" ? "gray.300" : "gray.600"}
          >
            <DefaultWatchStatusPanel statuses={data.watchStatuses} />
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};
