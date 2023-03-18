import { useRef } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  useColorMode,
  useDimensions,
} from "@chakra-ui/react";

import { watchStatus } from "src/hooks/operations/useWatchStatus";
import { useIsMobile } from "src/hooks/useIsMobile";

import { DefaultWatchStatusPanel } from "./DefaultWatchStatusPanel";
import { WatchStatusPanel } from "./WatchStatusPanel";

export const WatchStatusCard = () => {
  const { data } = watchStatus.useGetAll();
  const { colorMode } = useColorMode();
  const cardRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(cardRef, true);
  const isMobile = useIsMobile();

  const isVertical = dimensions ? dimensions.contentBox.width < 700 : isMobile;

  return !data ? null : (
    <Card w="full" ref={cardRef}>
      <CardHeader pb={0}>
        <Heading size="md">Watch Status</Heading>
      </CardHeader>
      <CardBody>
        <Stack
          alignItems="start"
          justifyContent={"space-between"}
          direction={isVertical ? "column" : "row"}
          spacing={4}
        >
          <Box maxW={isVertical ? "unset" : "400px"} w={isVertical ? "100%" : "50%"}>
            <WatchStatusPanel statuses={data.watchStatuses} />
          </Box>
          <Box
            sx={
              isVertical
                ? {
                    w: "100%",
                    borderTop: "1px",
                    paddingTop: 4,
                    borderColor: colorMode === "light" ? "gray.300" : "gray.600",
                  }
                : {
                    w: "50%",
                    borderLeft: "1px",
                    paddingLeft: 4,
                    borderColor: colorMode === "light" ? "gray.300" : "gray.600",
                  }
            }
          >
            <DefaultWatchStatusPanel statuses={data.watchStatuses} />
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
